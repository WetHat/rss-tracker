---
author: "Larissa Fortuna"
published: 2024-06-03T16:31:50.000Z
link: https://github.blog/2024-06-03-arm64-on-github-actions-powering-faster-more-efficient-build-systems/
id: https://github.blog/?p=78262
feed: "The GitHub Blog꞉ Product News and Updates"
tags: []
---
> [!abstract] Arm64 on GitHub Actions: Powering faster, more efficient build systems by Larissa Fortuna - 2024-06-03T16:31:50.000Z
> GitHub Actions now offers Arm-hosted runners with images built by Arm for developers to begin building on the latest and most sustainable processors on the market. The post Arm64 on GitHub Actions: Powering faster, more efficient build systems appeared first on The GitHub Blog.

🔗Read article [online](https://github.blog/2024-06-03-arm64-on-github-actions-powering-faster-more-efficient-build-systems/). For other items in this feed see [[The GitHub Blog꞉ Product News and Updates]].

- [ ] [[Arm64 on GitHub Actions꞉ Powering faster, more efficient build systems]] - 2024-06-03T16:31:50.000Z
- - -
GitHub is ecstatic to unveil ArmⓇ-based Linux and Windows runners for GitHub Actions are now in Public Beta. This new addition to our suite of hosted runners provides power, performance and sustainability improvements for all your GitHub Actions jobs. Developers can now take advantage of Arm-based hardware hosted by GitHub to build and deploy their release assets anywhere Arm architecture is used. Best of all, these runners are priced at 37% less than our x64 Linux and Windows runners.

Customers are refactoring their applications to take advantage of the price and performance benefits of Arm architecture. These new runners provide power, performance, and sustainability improvements for all your GitHub Actions jobs and are designed to efficiently run large cloud-native workloads. Developers in every industry—from gaming to embedded mobile development—are able to take advantage of the performance these new runners offer.

These runners are fully managed by GitHub with an image built by Arm containing all the tools needed for developers to get started. They offer a power-efficient compute layer that can increase price-to-performance ratios, allowing customers to optimize compute costs to get more done within existing budgets while also reducing their carbon footprint.

Previously, developers building on Arm within GitHub have had to self-host or utilize QEMU virtualization which is slower than running natively. Customers can now build, test, and deploy their web and application servers, open-source databases, containers, microservices, Java and .NET applications, AI applications, gaming, or media servers on the Arm architecture, bringing their entire CI/CD workflow onto one platform while also benefiting from the scale and speed gained from using GitHub-hosted runners.

> We leveraged Arm runners to very quickly set up a workflow to build a Linux Arm64 binary for our open source Rust project, Spice.ai OSS, and it’s been rock-solid–we haven’t had any issues with it since we set it up. We’ve saved 2-3 days of engineering effort up front to set up our own runners, plus about 1-2 hours per week to maintain them ourselves.

- Phillip LeBlanc // Founder and CTO, Spice AI

## GitHub and Arm: A new class of image[](#github-and-arm-a-new-class-of-image)

GitHub has partnered with Arm to provide the Ubuntu and Windows VM images for these runners, ensuring our customers can seamlessly start building on Arm. The Ubuntu 22.04 image is equipped with a full set of tools to jumpstart developers quickly on Arm runners and begin deploying Arm release assets as soon as possible, with plans to add developer tools to the Windows image and a new Ubuntu 24.04 image.

GitHub is excited to present these partner images to our customers. We are committed to partnering with the best technology providers on the market to provide a wide range of images for our customers to build on. These partnerships are focused on providing a best-in-class experience that can be leveraged across industries. We began this with our GPU runners, launched in April, by offering an image built by NVIDIA aimed at companies wanting to incorporate their MLOps practices into GitHub Actions. As we expand our GitHub-hosted runner fleet, we will continue to expand image options in parallel through close partnerships with industry-leading technology providers.

“Our longstanding partnership with GitHub is rooted in empowering shift-left software development and accelerating time to market while improving sustainability,” said Bhumik Patel, Director of Software Ecosystem Development, Infrastructure Line of Business at Arm. “The availability of Arm-hosted runners marks an important step toward more sustainable computing by enabling software developers with advanced CI/CD capabilities to develop the power-efficient and versatile Arm architecture for projects, from data centers and cloud to automotive, IoT, and much more.”

To view the list of installed software, give feedback, or report issues with the image, head to the new [partner runner images repository](https://github.com/actions/partner-runner-images).

## Sustainability on GitHub Actions[](#sustainability-on-github-actions)

GitHub is committed to sustainability, and to helping customers on their journey to reduce their own carbon emissions. By using these new Arm-hosted runners, customers can lower their carbon footprint by running on machines that are proven to be more power efficient. Arm-based servers in the cloud have been shown to use 30-40% less power output for some of the most widely deployed workloads. [[Source](https://www.nttdata.com/global/en/insights/focus/will-java-run-more-sustainably-on-arms-architecture#:~:text=The%20higher%20power%20efficiency%20of,critical%20reporting%20metrics%20for%20corporations), [source](https://www.forbes.com/sites/patrickmoorhead/2023/03/01/ampere-is-driving-sustainability-using-the-right-metricpower-at-the-rack/?sh=41e3613e2ed9)]

Arm technology has been shown to reduce heat generation and lower power consumption in data centers. To help understand your own impact, you can [use this tool](https://github.com/green-coding-solutions/eco-ci-energy-estimation) to measure the energy consumption of each of your GitHub Actions workflow runs.

## Get started using Arm-hosted runners today![](#get-started-using-arm-hosted-runners-today)

These runners are available to our customers on our GitHub Team and Enterprise Cloud plans. We expect to begin offering Arm runners for open source projects by the end of the year. Customers can begin using these runners today by creating an Arm runner in their organization/enterprise, and then updating the `runs-on` syntax in their GitHub Actions workflow file to call that runner name. Find out more information on how to set up Arm-hosted runners in [this video](https://youtu.be/vrr_OgMk458) or in our [public documentation](https://docs.github.com/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners). To learn more about runner-per-minute pricing, check out the [documentation](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions#per-minute-rates).

The post [Arm64 on GitHub Actions: Powering faster, more efficient build systems](https://github.blog/2024-06-03-arm64-on-github-actions-powering-faster-more-efficient-build-systems/) appeared first on [The GitHub Blog](https://github.blog).
