---
author: "Richard Lander"
published: 2024-04-30T17:05:00.000Z
link: https://devblogs.microsoft.com/dotnet/secure-your-container-build-and-publish-with-dotnet-8/
id: https://devblogs.microsoft.com/dotnet/?p=51654
feed: "․NET Blog"
tags: [rss/〭NET,rss/Cloud_Native,rss/Containers,rss/〭net_sdk,rss/CLI,rss/dotnet_cli,rss/sdk]
pinned: false
---
> [!abstract] Secure your container build and publish with .NET 8 by Richard Lander - 2024-04-30T17:05:00.000Z
> .NET 8 has new security features for containers, including non-root images and SDK tools. Discover how to create non-root container images, configure Kubernetes pods, and inspect images and containers for enhanced security.
> 
> The post [Secure your container build and publish with .NET 8](https://devblogs.microsoft.com/dotnet/secure-your-container-build-and-publish-with-dotnet-8/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).

🔗Read article [online](https://devblogs.microsoft.com/dotnet/secure-your-container-build-and-publish-with-dotnet-8/). For other items in this feed see [[../․NET Blog]].

- [ ] [[Secure your container build and publish with ․NET 8]]
- - -
.NET 8 raises the bar for container security for .NET container images and SDK tools. The SDK produces application images that align with [industry best practices and standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted), by default. We also offer additional security hardening with [Chiseled images](https://devblogs.microsoft.com/dotnet/announcing-dotnet-chiseled-containers/) for an extra layer of protection.

`dotnet publish` will generate a container image for you and configure it as non-root by default. It’s easy with .NET to quickly improve the security posture of your production apps.

In this post, you will learn how to:

- Produce non-root container images
- Configure Kubernetes pods to require non-root images
- Inspect images and containers
- Use `root` (or other users)

This post is a continuation of [Streamline your container build and publish with .NET 8](https://devblogs.microsoft.com/dotnet/streamline-container-build-dotnet-8/), published earlier this month. It builds on [Secure your .NET cloud apps with rootless Linux Containers](https://devblogs.microsoft.com/dotnet/securing-containers-with-rootless/) and [Running non-root .NET containers with Kubernetes](https://devblogs.microsoft.com/dotnet/running-nonroot-kubernetes-with-dotnet/), published last year.

## Threat model

It’s good to start any security related conversation with a clear view of the threats at play.

There are two primary threats to consider:

- [Container breakout](https://www.aquasec.com/cloud-native-academy/container-security/container-escape/) — An attacker is able to break out of the container and execute operations within the host.
- [Remote Code Execution (RCE)](https://en.wikipedia.org/wiki/Arbitrary_code_execution) — An attacker is able to cause an app to execute operations within the container. Not specific to containers.

> Despite Docker not being marketed as sandboxing software, its default setup is meant to secure host resources from being accessed by processes inside of a container.

That’s a great framing of the situation, from [Escape from Docker and Kubernetes containers to root on host](https://blog.dragonsector.pl/2019/02/cve-2019-5736-escape-from-docker-and.html) (in reference to [CVE-2019-5736](https://seclists.org/oss-sec/2019/q1/119)). The author is saying that we’re collectively relying a lot on the “default setup” of the various container solutions we use, implying that container breakout is a real threat.

From the same post, under “Mitigations”:

> Use a low privileged user inside the container

Here, the author is effectively saying that you need to do your part to more safely rely on the pseudo-sandboxing nature of container solutions. If you don’t and another container breakout vulnerability is discovered, then part of the burden falls to developers hosting their apps as `root`. Put another way, “caveat emptor.”

The security and vulnerability landscape can be tough to navigate at the best of times. Keeping dependencies up to date is the first and most critical mitigation to these risks, for both container host and guest. Non-root hosting is an excellent [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) measure that may protect against unknown future vulnerabilities.

## Container ecosystem: `root` by default

Base images are configured as the `root` user by default.

```bash
$ docker run --rm alpine whoami
root
$ docker run --rm debian whoami
root
$ docker run --rm ubuntu whoami
root
$ docker run --rm mcr.microsoft.com/dotnet/runtime-deps:8.0 whoami
root
```

After just explaining that images should be configured as non-root as an important security measure, I’m demonstrating that most base images are published using `root`, including the ones we publish. Why?

Usability trumps security for general-purpose base images and always will. It’s important that package management and other privileged operations are straightforward and that higher-level images can choose the user they want.

However, it remains true that an attacker with an active RCE vulnerability will be able to do anything they want with `root` permission.

In contrast, [Ubuntu Chiseled](https://devblogs.microsoft.com/dotnet/announcing-dotnet-chiseled-containers/) and [Chainguard](https://www.chainguard.dev/chainguard-images) base images are appliance-like, taking a different approach than general purpose images. They trade usability and compatibility for security. We endorse this design point.

Note: See [Hardened Container Images: Images for a Secure Supply Chain](https://www.chainguard.dev/unchained/hardened-container-images-images-for-a-secure-supply-chain).

That’s a lot of context about base images and a great segue to application images, which (we think) should be built with a security-first philosophy.

## .NET ecosystem: Non-root by default

`dotnet publish` produces non-root images by default. Let’s take a look with a simple console app. I’m going to skip a number of steps that are covered in [Streamline your container build and publish with .NET 8](https://devblogs.microsoft.com/dotnet/streamline-container-build-dotnet-8/).

This is the source code for the app.

```csharp
using System.Runtime.InteropServices;
Console.WriteLine($"Hello {Environment.UserName}, using {RuntimeInformation.OSDescription} on {RuntimeInformation.OSArchitecture}");
```

It is very easy to produce a container image.

```bash
$ dotnet publish -t:PublishContainer
MSBuild version 17.9.8+b34f75857 for .NET
  Determining projects to restore...
  All projects are up-to-date for restore.
  my-app -> /Users/rich/my-app/bin/Release/net8.0/my-app.dll
  my-app -> /Users/rich/my-app/bin/Release/net8.0/publish/
  Building image 'my-app' with tags 'latest' on top of base image 'mcr.microsoft.com/dotnet/runtime:8.0'.
  Pushed image 'my-app:latest' to local registry via 'docker'.
```

The app will say hello to the user that starts the process, as you can see from the source code.

```bash
$ docker run --rm my-app
Hello app, using Debian GNU/Linux 12 (bookworm) on Arm64
```

We see `Hello app`, as expected.

We can also run `whoami` just like was done with the base images.

```bash
$ docker run --rm --entrypoint bash my-app -c "whoami"
app
```

As can be seen, this image is not using `root`, in contrast to the base images we looked at.

Running `whoami` requires launching the image. Kubernetes doesn’t do that; it looks at container image metadata to determine the user.

Let’s look at container metadata.

```bash
$ docker inspect --format='{{.Config.User}}' my-app
1654
```

The SDK sets the user via UID because that’s required by Kubernetes to enforce its `runAsNonRoot` property.

We can look a bit more under the covers to see where the `1654` value comes from.

```bash
$ docker run --rm --entrypoint bash my-app -c "cat /etc/passwd | tail -n 1"
app:x:1654:1654::/home/app:/bin/sh
$ docker inspect --format='{{.Config.Env}}' my-app
[PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin APP_UID=1654 ASPNETCORE_HTTP_PORTS=8080 DOTNET_RUNNING_IN_CONTAINER=true DOTNET_VERSION=8.0.4]
$ docker run --rm --entrypoint bash my-app -c "echo \$APP_UID"
1654
```

We define a user called `app` and give it a UID > 1000 to avoid [reserved ranges](https://en.wikipedia.org/wiki/User_identifier#Reserved_ranges). `1654` is `1000` + the ASCII values of each of the characters in `dotnet`. We also set an environment variable — `APP_UID` — with this same value. That avoids anyone needing to remember or use this value (without the environment variable) for common scenarios.

In a previous post, I included a set of fun [non-root in action](https://devblogs.microsoft.com/dotnet/securing-containers-with-rootless/#non-root-in-action) demos. You can look at that post to go deeper.

## Non-root Dockerfiles

The model with Dockerfiles is similar, but requires one extra step, setting the `USER` instruction.

I’ll show you what that looks like, using this [sample Dockerfile](https://github.com/dotnet/dotnet-docker/blob/2746ed050286ed81b1b404def75c7c6d06c80bde/samples/dotnetapp/Dockerfile).

That Dockerfile uses the environment variable we just looked at to define the user. This is the pattern we intend everyone to use, to switch to a non-root user with Dockerfiles. Again, this pattern avoids magic numbers being plastered everywhere and works best with Kubernetes.

```bash
$ cat Dockerfile | tail -n 2 
USER $APP_UID
ENTRYPOINT ["./dotnetapp"]
```

Note: Lots of developers will have already made their own user. Continuing with your own user or switching to the built-in one are both fine options.

We can then build and run an image.

```bash
$ docker build --pull -t my-app .
$ docker run --rm my-app
         42                                                    
         42              ,d                             ,d     
         42              42                             42     
 ,adPPYb,42  ,adPPYba, MM42MMM 8b,dPPYba,   ,adPPYba, MM42MMM  
a8"    `Y42 a8"     "8a  42    42P'   `"8a a8P_____42   42     
8b       42 8b       d8  42    42       42 8PP!!!!!!!   42     
"8a,   ,d42 "8a,   ,a8"  42,   42       42 "8b,   ,aa   42,    
 `"8bbdP"Y8  `"YbbdP"'   "Y428 42       42  `"Ybbd8"'   "Y428  

OSArchitecture: Arm64
OSDescription: Debian GNU/Linux 12 (bookworm)
FrameworkDescription: .NET 8.0.4

UserName: app
HostName : 8da0d81720f8

ProcessorCount: 8
TotalAvailableMemoryBytes: 4113563648 (3.83 GiB)
```

As you can see, the application is running as the `app` user.

The switch to enable non-root hosting (in Dockerfiles) is just a one line change.

## Ubuntu Chiseled images

[Ubuntu Chiseled images](https://devblogs.microsoft.com/dotnet/announcing-dotnet-chiseled-containers/) are appliance-like, providing a locked-down default experience. They are compatible with regular Ubuntu, however, they have sharp edges where whole sections of the operating system have been cut out. Notably, they are configured as non-root. That means that you don’t even have to configure the user since it is already set.

You can inspect a chiseled image to see the user is set.

```bash
$ docker inspect --format='{{.Config.User}}' mcr.microsoft.com/dotnet/runtime:8.0-jammy-chiseled
1654
```

We have a different [sample Dockerfile](https://github.com/dotnet/dotnet-docker/blob/2746ed050286ed81b1b404def75c7c6d06c80bde/samples/dotnetapp/Dockerfile.chiseled) that relies on the user being set in these images.

```bash
$ cat Dockerfile.chiseled | tail -n 4
FROM mcr.microsoft.com/dotnet/runtime:8.0-jammy-chiseled
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["./dotnetapp"]
```

As you can see, the `USER` is not set in this Dockerfile. Let’s build and run it.

```bash
$ docker build --pull  -t my-app -f Dockerfile.chiseled .
$ docker run --rm my-app
         42                                                    
         42              ,d                             ,d     
         42              42                             42     
 ,adPPYb,42  ,adPPYba, MM42MMM 8b,dPPYba,   ,adPPYba, MM42MMM  
a8"    `Y42 a8"     "8a  42    42P'   `"8a a8P_____42   42     
8b       42 8b       d8  42    42       42 8PP!!!!!!!   42     
"8a,   ,d42 "8a,   ,a8"  42,   42       42 "8b,   ,aa   42,    
 `"8bbdP"Y8  `"YbbdP"'   "Y428 42       42  `"Ybbd8"'   "Y428  

OSArchitecture: Arm64
OSDescription: Ubuntu 22.04.4 LTS
FrameworkDescription: .NET 8.0.4

UserName: app
HostName : 293212d2eaba

ProcessorCount: 8
TotalAvailableMemoryBytes: 4113563648 (3.83 GiB)
```

Again, the application is running as the `app` user. If you use chiseled images, you get better results and there is less to do in your Dockerfile.

You can just as easily use Chiseled images with SDK publish.

```bash
dotnet publish -t:PublishContainer -p:ContainerFamily=jammy-chiseled
```

This command will produce a non-root image, both because our Chiseled images are configured as non-root and `dotnet publish` creates non-root images by default.

## Kubernetes

Kubernetes has a [`runAsNonRoot` mechanism](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#securitycontext-v1-core) that is part of its [security standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted). When set (to `true`), Kubernetes will fail loading a pod manifest if a container image is `root`.

I think of `runAsNonRoot` as a “roles and responsibilities” type feature. It is the role of the container image to set the user. It is the responsibility of the orchestrator to validate that the user is set as expected, as non-root.

Recall the “like Kubernetes does it” look at container metadata earlier.

```bash
$ docker inspect --format='{{.Config.User}}' my-app
1654
```

Kubernetes doesn’t use `docker inspect` but the idea is the same. It looks at this same `User` value, determines if the value is a UID, and if so does a `value > 0` check. If that expression resolves to true, then the `runAsNonRoot` check passes. For context `root` has a UID of `0`, so this check is the analog of `user != root`.

Let’s take a quick look at how non-root works with Kubernetes. There is much more detail in [Running non-root .NET containers with Kubernetes](https://devblogs.microsoft.com/dotnet/running-nonroot-kubernetes-with-dotnet/) if you want to learn more.

Here’s an example of how to set `runAsNonRoot` in a Pod manifest.

```yaml
    spec:
      securityContext:
        runAsNonRoot: true
      containers:
      - name: aspnetapp
        image: mcr.microsoft.com/dotnet/samples:aspnetapp-chiseled
        ports:
        - containerPort: 8080
```

In this example, every container listed (even though there is only one in the example) must be non-root. `securityContext` can also be set on a container. You can see these settings in broader context in [non-root.yaml](https://github.com/dotnet/dotnet-docker/blob/0535bf7c536483266d36066bf2e87115106f2985/samples/kubernetes/non-root/non-root.yaml#L15-L16).

It’s really only interesting to see what happens if `runAsNonRoot` is set to `true` and we try to load an image that uses the `root` users.

At the time of writing, the `mcr.microsoft.com/dotnet/samples:aspnetapp-chiseled` image (used above) is configured as non-root and the `mcr.microsoft.com/dotnet/samples:aspnetapp` is `root`. I’ll change the `image` value in the manifest to `mcr.microsoft.com/dotnet/samples:aspnetapp` and then see if the load fails.

```bash
$ kubectl apply -f non-root.yaml
deployment.apps/dotnet-non-root created
service/dotnet-non-root created
$ kubectl get po
NAME                            READY   STATUS                       RESTARTS   AGE
dotnet-non-root-6df9cb77d8-74t96   0/1     CreateContainerConfigError   0          5s
```

As you can see, the load fails.

Digging a little deeper, we can see the cause.

```bash
$ kubectl describe po | grep Error
      Reason:       CreateContainerConfigError
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: container has runAsNonRoot and image will run as root (pod: "dotnet-non-root-6df9cb77d8-74t96_default(d4df0889-4a69-481a-adc4-56f41fb41c63)", container: aspnetapp)
```

> Error: container has runAsNonRoot and image will run as root

That matches expectations. Good.

## Change the user to `root`

There may be cases where the user needs to be set to `root`. That’s straightforward to do.

It is possible (using Docker) to run a command as `root` in a running container with `docker exec -u`. The command will be often be `bash`, but we’ll use `whoami` since it offers a better demonstration.

```bash
$ docker exec 5d56a4a1cb97 whoami
app
$ docker exec -u root 5d56a4a1cb97 whoami
root
```

Note that `kubectl exec` doesn’t offer a `-u` argument (for good reason).

Similarly, a container can be started with a specific user, overriding the user set in image metadata.

```bash
$ docker run --rm -it -u root myapp
Hello root, using Debian GNU/Linux 12 (bookworm) on X64
```

Last, a specific user can be used when building the image, with `ContainerUser`.

```bash
$ dotnet publish -t:PublishContainer -p:ContainerUser=root
  Building image 'myapp' with tags 'latest' on top of base image 'mcr.microsoft.com/dotnet/runtime:8.0'.
  Pushed image 'myapp:latest' to local registry via 'docker'.
$ docker run --rm -it myapp
Hello root, using Debian GNU/Linux 12 (bookworm) on X64
```

The `ContainerUser` specified needs to exist.

```bash
$ dotnet publish -t:PublishContainer -p:ContainerUser=rich
  Building image 'myapp' with tags 'latest' on top of base image 'mcr.microsoft.com/dotnet/runtime:8.0'.
  Pushed image 'myapp:latest' to local registry via 'docker'.
$ docker run --rm -it myapp
docker: Error response from daemon: unable to find user rich: no matching entries in passwd file.
```

You can, however, use a valid UID.

```bash
$ dotnet publish -t:PublishContainer -p:ContainerUser=1654
  Building image 'myapp' with tags 'latest' on top of base image 'mcr.microsoft.com/dotnet/runtime:8.0'.
  Pushed image 'myapp:latest' to local registry via 'docker'.
$ docker run --rm myapp
Hello app, using Debian GNU/Linux 12 (bookworm) on X64
```

As you can see, both the `root` and `app` users are defined in the container images we publish.

```bash
$ docker run --rm mcr.microsoft.com/dotnet/runtime-deps bash -c "cat /etc/passwd | head -n 1"
root:x:0:0:root:/root:/bin/bash
$ docker run --rm mcr.microsoft.com/dotnet/runtime-deps bash -c "cat /etc/passwd | tail -n 1"
app:x:1654:1654::/home/app:/bin/sh
```

## Closing

The user for production apps is a key part of any security plan. Unfortunately, it is easy to miss since everything works without specifying the user. In fact, it works too well. One could say this is the root of the problem.

Adding a user to a Dockerfile is easy. Creating end-to-end workflows that reliably establish the desired security outcomes is a lot harder. As you can see, it is now straightforward to produce non-root container images, with `dotnet publish` or with Dockerfiles. The images will work correctly with Kubernetes security features, which is critical in enforcing your desired security policies.

There will always be additional security settings that are needed. Non-root hosting is one of the most impactful changes you can make.

The post [Secure your container build and publish with .NET 8](https://devblogs.microsoft.com/dotnet/secure-your-container-build-and-publish-with-dotnet-8/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).
