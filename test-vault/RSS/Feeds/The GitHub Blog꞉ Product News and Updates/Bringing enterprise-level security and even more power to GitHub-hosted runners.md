---
role: rssitem
author: Tanmayee Kamath
published: 2024-04-02T16:35:24.000Z
link: https://github.blog/2024-04-02-bringing-enterprise-level-security-and-even-more-power-to-github-hosted-runners/
id: https://github.blog/?p=77210
feed: "[[../The GitHub Blog꞉ Product News and Updates]]"
tags: []
pinned: false
---
> [!abstract] Bringing enterprise-level security and even more power to GitHub-hosted runners by Tanmayee Kamath - 2024-04-02T16:35:24.000Z
> GitHub-hosted runners now support Azure private networking. Plus, we've added 2 vCPU Linux, 4 vCPU Windows, macOS L, macOS XL, and GPU hosted runners to our runner fleet. The post Bringing enterprise-level security and even more power to GitHub-hosted runners appeared first on The GitHub Blog.

🔗Read article [online](https://github.blog/2024-04-02-bringing-enterprise-level-security-and-even-more-power-to-github-hosted-runners/). For other items in this feed see [[../The GitHub Blog꞉ Product News and Updates]].

- [ ] [[Bringing enterprise-level security and even more power to GitHub-hosted runners]]
- - -
GitHub’s journey towards enhancing enterprise readiness for GitHub Actions takes a significant leap forward with the introduction of Azure private networking for GitHub-hosted runners on GitHub Actions. This development builds upon our initial offering of [more powerful GitHub-hosted runners](https://github.blog/changelog/2023-06-21-github-hosted-larger-runners-for-actions-are-generally-available/) equipped with Static IPs, marking a strategic move to cater to the complex networking and security needs of enterprise customers.

The value of utilizing hosted runners is two-fold. For individual developers, it maximizes their coding time by eliminating the overhead associated with infrastructure management. Simultaneously, for DevOps administrators, it significantly reduces the time and cost required to manage and maintain compute infrastructure for software life cycle automation, thereby streamlining operations and allowing teams to focus on innovation. The rollout of larger runners was not just an upgrade; it was the beginning of a comprehensive plan aimed at enterprise-grade readiness, providing robust virtual machines and features tailored for business needs. A great testament to this is [how we, at GitHub, have transformed our CI system](https://github.blog/2023-09-26-how-github-uses-github-actions-and-actions-larger-runners-to-build-and-test-github-com/) to meet the scaling demands of our engineering teams and enabled them to confidently and quickly ship software with GitHub Actions and GitHub-hosted runners.

Today, we unveil the next chapter by generalizing Azure private networking, ensuring all runner tiers, starting from our 2-vCPU runners, now support auto-scaling, static IPs and private networking capabilities. Additionally, we’re generalizing larger macOS runners and introducing a brand new GPU runner in public beta. These enhancements are a testament to our commitment to simplifying the adoption of GitHub Actions across all project sizes and complexities; and empowering you to standardize on GitHub seamlessly and securely as your automation and CI/CD platform. Let’s explore these improvements together!

## Azure private networking for GitHub-hosted runners is generally available 🎉[](#azure-private-networking-for-github-hosted-runners-is-generally-available-%f0%9f%8e%89)

We are excited to announce that Azure private networking for GitHub-hosted runners is now generally available. This feature allows you to run your actions workflows on GitHub-hosted runners that are connected to your Azure virtual network, without compromising on security or performance.

GitHub-hosted runners provide powerful compute in the cloud for running your CI/CD and automation workflows that are fully managed, eliminating the overhead of managing and maintaining your own infrastructure. However, we heard from enterprises having strict networking and security requirements that prevented them from using GitHub-hosted runners to their full potential, specifically:

- Secure access to private resources within their on-prem or cloud based locations, such as databases, artifactory, storage accounts, or APIs.
- Enforce network security policies and outbound access rules on the runners to reduce data exfiltration risks.
- Isolate their build traffic from the public internet and route it through their existing private network connections (for example, VPN or ExpressRoute).
- Monitor network traffic for any malicious or unusual behavior as workflows run.

With Azure private networking, you can easily create GitHub-hosted runners that are provisioned within your Azure virtual network and subnet of choice. Thereafter, your actions workflows can securely access Azure services like storage accounts, databases, and on-premises data sources, such as an artifactory through existing, pre-configured connections like [VPN gateways](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways) and [ExpressRoutes](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction). Additionally, security is front and center with this update. Any existing or new networking policies, such as [Network Security Group (NSG)](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview) or firewall rules, will automatically apply to GitHub-hosted runners giving platform administrators comprehensive control over network security, all managed within a single place.

![Screenshot of the page for creating a new network configuration. The fields of the form are "configuration name," "Azure Virtual Network," and "services allowed." GitHub Actions is selected under "Services allowed."](https://github.blog/wp-content/uploads/2024/04/new-network-configuration.png?w=1024&resize=1024%2C582)

> At Deutsche Vermögensberatung (DVAG), we always focus on delivering great products to our customers. By executing our CI/CD workflows on GitHub-hosted runners, the burden of managing our own infrastructure has been lifted. This shift has provided our developers and DevOps administrators with precious time to dedicate to innovation, thus ultimately accelerating our products' time to market. One of the standout features of GitHub Actions is the ability to securely and privately integrate with Azure networking, which empowers us to establish secure and private connections from GitHub-hosted runners to our internal resources. With minimal administrative overhead we can effectively manage many resources including Kubernetes clusters, databases, and virtual machines.

- Florian Koch, Lead Developer IT Platform // Deutsche Vermögensberatung

### Support for GitHub Team plan[](#support-for-github-team-plan)

Azure private networking is now supported with the GitHub Team plan, in addition to the GitHub Enterprise Cloud plan. With that, GitHub Team plan organization administrators have the ability to create and manage network configurations for their organization’s Github-hosted runners.

### New Azure regions[](#new-azure-regions)

At public beta, Azure private networking was supported across three primary regions: East US, East US2, and West US2. With general availability, we are adding support for 10 additional Azure regions based on your feedback. Newly added regions include Central US, West US, Norway East, France Central, Switzerland North, UK South, North Europe, Australia East, Southeast Asia, and South India.

## Introducing additional runners SKUs 🎉[](#introducing-additional-runners-skus-%f0%9f%8e%89)

We are excited to introduce the latest additions to the GitHub-hosted runner fleet, 2 vCPU Linux and 4 vCPU Windows runners, supporting auto-scaling and private networking features. Previously, our supported SKUs ranged from 4 vCPU (Linux only) to 64 vCPU, prompting substantial feedback requesting smaller SKUs with the same auto-scaling and private networking capabilities. These newly introduced smaller machines are geared to specifically support scenarios where smaller machine sizes suffice yet the demand for heightened security and performance persists. Additionally, we are thrilled to announce that Apple silicon (M1) hosted runners, specifically macOS L (12-core Intel) and macOS XL (M1 w/GPU hardware acceleration), which were [previously in public beta](https://github.blog/changelog/2023-10-02-github-actions-apple-silicon-m1-macos-runners-are-now-available-in-public-beta/), are now generally available.

## GPU hosted runners available in public beta 🎉[](#gpu-hosted-runners-available-in-public-beta-%f0%9f%8e%89)

We’re delighted to unveil GPU hosted runners in public beta! This new runner empowers teams working with machine learning models, such as large language models (LLMs) or those requiring GPU graphic cards for game development, to run these more efficiently as part of their automation or CI/CD process. This allows teams to do complete application testing, including the ML components, with GitHub Actions.

![Screenshot of the page displaying different runner specifications.](https://github.blog/wp-content/uploads/2024/04/runner-specifications.png?w=876&resize=876%2C551)

Moreover, the GPU SKU comes equipped with auto-scaling and private networking features. We’re initially rolling out support for a 4-core SKU on Linux and Windows machines with 1 T4 GPU, and have more SKUs planned for later this year.

## What’s next?[](#whats-next)

At GitHub, we are dedicated to continuous improvement, driven by your feedback, to ensure that our platform delivers an unparalleled user experience. Here’s a glimpse into some exciting enhancements on the horizon for GitHub-hosted Actions runners.

Reliability continues to be our top priority as we introduce new functionalities. We understand the profound impact any service disruption has on our users and are actively engaged in significant efforts to enhance the overall scalability and reliability of the GitHub Actions platform.

We’re focused on elevating the Azure private networking feature set, enabling the creation of network configurations encompassing multiple virtual networks. Additionally, we’re streamlining setup processes through scripting and implementing best practices for VNET peering to accommodate unsupported Azure regions. For customers not utilizing Azure, we’re developing private networking solutions tailored to address similar challenges surrounding private resource accessibility, outbound control, and network monitoring. These solutions will seamlessly integrate with other leading cloud providers, such as AWS and GCP.

In response to your valuable feedback, we’re refining our image capabilities. Soon, you will have the ability to craft custom VM images natively in GitHub Actions, bundling all necessary software and tools to expedite build and test procedures for even the most intricate or expansive projects. Furthermore, we’re committed to enhancing our runner SKUs to meet the evolving demands of our user base. This includes the introduction of additional GPU SKUs, ARM SKUs, and any other variants driven by customer demand.

## Get started[](#get-started)

Azure private networking for GitHub-hosted runners is generally available starting today across GitHub Team and Enterprise Cloud plans. To get started, navigate to the ‘Hosted Compute Networking’ section within your Enterprise or Organization settings. For more details, consult our [documentation](https://github.co/actions-azure-vnet). To request support for additional Azure regions, please fill out this [form](https://resources.github.com/private-networking-for-github-hosted-runners-with-azure-virtual-networks/). Please note: Azure private networking for GitHub Codespaces continues to remain in beta.

The newly added 2 vCPU Linux and 4 vCPU Windows SKUs are generally available starting today across GitHub Team and Enterprise plans. To use these runners, create a GitHub-hosted runner by selecting the ‘2-core’ or ‘4-core’ size options in the runner creation flow. macOS L and macOS XL runners are also generally available across GitHub Team and Enterprise plans, and can be used by updating the runs-on key to use one of the [GitHub-defined macOS runner labels](https://docs.github.com/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners#about-macos-larger-runners). To learn more about pricing for these SKUs, refer to our [documentation](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions#per-minute-rates).

**GPU hosted runners are available starting today in public beta across GitHub Team and Enterprise plans.** To learn more about pricing for these runners, refer to our [documentation](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions). To share your feedback and help us find the right additional GPU SKUs to support, please fill out this [form](https://forms.gle/9JQ3rtm1pX6RcEjt8).

We’re eager to hear your feedback on any and all of these functionalities. Share your thoughts on our [GitHub Community Discussion](https://github.com/orgs/community/discussions/58739).

The post [Bringing enterprise-level security and even more power to GitHub-hosted runners](https://github.blog/2024-04-02-bringing-enterprise-level-security-and-even-more-power-to-github-hosted-runners/) appeared first on [The GitHub Blog](https://github.blog).