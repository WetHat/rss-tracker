---
role: rssitem
author: "Carlin Cherry"
published: 2024-05-02T16:30:32.000Z
link: https://github.blog/2024-05-02-dependabot-on-github-actions-and-self-hosted-runners-is-now-generally-available/
id: https://github.blog/?p=77824
feed: "[[The GitHub Blog꞉ Product News and Updates]]"
tags: [rss/object_Object]
pinned: false
---

> [!abstract] Dependabot on GitHub Actions and self-hosted runners is now generally available by Carlin Cherry - 2024-05-02T16:30:32.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> A quick guide on the advantages of Dependabot as a GitHub Actions workflow and the benefits this unlocks, including self-hosted runner support. The post Dependabot on GitHub Actions and self-hosted runners is now generally available appeared first on The GitHub Blog.

🔗Read article [online](https://github.blog/2024-05-02-dependabot-on-github-actions-and-self-hosted-runners-is-now-generally-available/). For other items in this feed see [[The GitHub Blog꞉ Product News and Updates]].

- [ ] [[Dependabot on GitHub Actions and self-hosted runners is now generally available]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
Starting today, administrators using `Github.com` accounts can enable their repositories and/or organizations to run Dependabot updates jobs as a GitHub Actions workflow using both hosted and self-hosted runners. **Running Dependabot does not count towards GitHub Actions minutes–meaning that using Dependabot continues to be free for everyone**.

Since its launch, Dependabot has used hosted compute to simplify the process of running update jobs, minimizing the amount of work developers need to do to stay on top of security vulnerabilities. However, this compute system wasn’t able to access some on-premises resources like private registries–a growing best practice outlined in frameworks like [S2C2F](https://www.microsoft.com/en-us/securityengineering/opensource/osssscframeworkguide)–and it wasn’t as flexible as it could be. Further, as GitHub Actions has become more ubiquitous over the years, users told us they wanted to see the logs for all their jobs in just one place.

To tackle these challenges, GitHub is consolidating Dependabot’s compute platform to GitHub Actions, and jobs that generate pull requests can now be run as GitHub Actions workflows. This allows Dependabot to leverage GitHub Actions infrastructure, including connecting Dependabot to self-hosted runners. With this change, users can choose to run Dependabot on their private networks with self-hosted runners, allowing Dependabot to access on-premises private registries and update those packages. Developers will see performance improvements, like faster Dependabot runs and increased log visibility. APIs and webhooks for GitHub Actions can also detect failed runs and perform downstream processing should developers wish to configure this in their CI/CD pipelines.

For more information on how to enable your repositories with Dependabot as a GitHub Actions workflow, please see our documentation for [Dependabot on GitHub Actions runners](https://docs.github.com/code-security/dependabot/working-with-dependabot/about-dependabot-on-github-actions-runners#about-dependabot-on-github-actions-runners). If you’d like to learn more about or enable self-hosted runners, check out the [differences between hosted and self-hosted runners](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners).

Over the course of the next year, Dependabot will also migrate all update jobs to run on GitHub Actions. This migration will include faster runs, increased troubleshooting visibility, self-hosted runners, and other performance and feature benefits. For most users, the transition will be seamless; however, if your organization has [disabled GitHub Actions by policy](https://docs.github.com/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise), your administrators will receive instructions about how to update your configuration to ensure that the Dependabot service is not interrupted.

Up next for Dependabot: in addition to [gathering your feedback](https://github.com/orgs/community/discussions/categories/announcements) on Dependabot on the GitHub Actions compute infrastructure, the team is working to support additional `dependabot.yml` configuration options for multiple directories and multiple ecosystems. Keep an eye on the [GitHub Changelog](https://github.blog/changelog/) for more and please let us know what you think by contributing to our [community discussion](https://github.com/orgs/community/discussions/120779)!

Read more about [Dependabot on GitHub Actions runners](https://docs.github.com/code-security/dependabot/working-with-dependabot/about-dependabot-on-github-actions-runners).

The post [Dependabot on GitHub Actions and self-hosted runners is now generally available](https://github.blog/2024-05-02-dependabot-on-github-actions-and-self-hosted-runners-is-now-generally-available/) appeared first on [The GitHub Blog](https://github.blog).