---
role: rssitem
author: "Ya Gao"
published: 2024-05-13T18:27:34.000Z
link: https://github.blog/2024-05-13-research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/
id: https://github.blog/?p=78014
feed: "The GitHub Blog꞉ Product News and Updates"
tags: []
pinned: false
---
> [!abstract] Research: Quantifying GitHub Copilot’s impact in the enterprise with Accenture by Ya Gao - 2024-05-13T18:27:34.000Z
> We conducted research with developers at Accenture to understand GitHub Copilot’s real-world impact in enterprise organizations. The post Research: Quantifying GitHub Copilot’s impact in the enterprise with Accenture appeared first on The GitHub Blog.

🔗Read article [online](https://github.blog/2024-05-13-research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/). For other items in this feed see [[../The GitHub Blog꞉ Product News and Updates|The GitHub Blog꞉ Product News and Updates]].
The GitHub Blog꞉ Product News and Updates
- [ ] [[Research꞉ Quantifying GitHub Copilot’s impact in the enterprise with Accenture]]
- - -
Since bringing GitHub Copilot to market, we’ve conducted several lab studies to discover its impact on developer efficiency, developer satisfaction, and overall code quality. We found that our AI pair programmer helps developers code up to [55% faster](https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) and that it made [85% of developers](https://github.blog/2023-10-10-research-quantifying-github-copilots-impact-on-code-quality/) feel more confident in their code quality. With the introduction of our first [GitHub Copilot offering for businesses and organizations in 2023](https://github.blog/2023-02-14-github-copilot-for-business-is-now-available/)—and more recently [GitHub Copilot Enterprise](https://github.blog/2024-02-27-github-copilot-enterprise-is-now-generally-available/#:~:text=Our%20most%20advanced%20AI%20offering,throughout%20the%20software%20development%20lifecycle.)—it’s become increasingly important for us to measure the impact of GitHub Copilot across real-world, large engineering organizations.

**To learn more, we partnered with Accenture to study how developers integrated GitHub Copilot into their daily workflows**, and we found significant improvements in several areas, including:

- **Improved developer satisfaction.** 90% of developers found they were more fulfilled with their job when using GitHub Copilot, and 95% said they enjoyed coding more with Copilot’s help.
- **Quickly adopted by developers.** Over 80% of Accenture participants successfully adopted GitHub Copilot with a 96% success rate among initial users. 43% found it “extremely easy to use.” Additionally, 67% of total participants used GitHub Copilot at least 5 days per week, averaging 3.4 days of usage weekly.

## Methodology[](#methodology)

In this study, we collaborated with Accenture to conduct an extensive, randomized controlled trial (RCT). Participants included developers who engage in a variety of software development tasks daily, including engineering, design, and testing across a spectrum of software products and services. They hold various positions within their organizations from entry-level roles to team management positions, and may work collaboratively or independently depending on the project and team dynamics.

For the trial, developers were randomly assigned to two groups. One group of developers was given access to GitHub Copilot, while the other group was not. Our objective was to assess the influence of GitHub Copilot on developers’ experience within the enterprise setting, where they collaborate on multifaceted projects. We collected DevOps telemetry on several output performance metrics that reflect insights into developers’ regular coding activity.

Beyond the initial experiment, we conducted a company-wide adoption analysis, which explored installation rates, generated code acceptance rates, and the time it took developers to accept GitHub Copilot’s first coding suggestion. Success was determined by whether they accepted a suggestion from GitHub Copilot or not.

In addition, we surveyed the GitHub Copilot users at Accenture to gain a better understanding of how developers perceived the impact of GitHub Copilot on their workflows. Not only did this survey uncover insights into how and when developers are using GitHub Copilot, but it also indicated an overwhelming improvement in developer satisfaction, which we know to be a key component of the [developer experience (DevEx)](https://github.blog/2023-06-08-developer-experience-what-is-it-and-why-should-you-care/). The combination of both telemetry data and the information from the survey provides a full picture for us to understand GitHub Copilot’s impact at the enterprise level.

## Our findings[](#our-findings)

### Developers quickly found value in GitHub Copilot and adopted it as part of their daily toolkit[](#developers-quickly-found-value-in-github-copilot-and-adopted-it-as-part-of-their-daily-toolkit)

[More than 50,000 organizations have adopted GitHub Copilot so far](https://www.microsoft.com/en-us/investor/events/fy-2024/earnings-fy-2024-q2.aspx), but we haven’t yet had a clear view into what those adoption rates look like on the individual level. When we dug deeper into the usage patterns of GitHub Copilot among Accenture developers, **67% of respondents reported utilizing GitHub Copilot at least 5 days per week**, with an **average usage frequency of 3.4 days per week.** Moreover, a substantial 70% of respondents relied on GitHub Copilot for coding tasks in a familiar programming language. This indicates a high level of integration of GitHub Copilot into developers’ daily workflows, highlighting its importance as a valuable engineering tool and resource.

We also observed that developers were excited to use GitHub Copilot. **81.4% of developers installed the GitHub Copilot IDE extension on the same day** that they received a license. And not only were they excited to use it, but getting started was simple and did not provide a barrier to entry.

In fact, **96% of those who installed the IDE extension started receiving and accepting suggestions on the same day.** On average, developers took just one minute from seeing their first suggestion to accepting one, too. This was further validated in user surveys, with **43% finding GitHub Copilot “extremely easy to use” and 51% rating it as “extremely useful.”**

As part of the GitHub Copilot service, we provide the measurement capabilities for our customers to determine gains from Copilot themselves. To produce many of the insights in this report, we leveraged public APIs available via GitHub and Azure DevOps. Among them, GitHub offers the [GitHub Copilot Metrics API](https://github.blog/changelog/2024-04-23-github-copilot-metrics-api-now-available-in-public-beta/), designed to provide users with information about Copilot usage within your organization. You can also explore the [Copilot Learning Pathways](https://resources.github.com/learn/pathways/copilot/essentials/measuring-the-impact-of-github-copilot/) to learn more about what GitHub Copilot can help your business achieve. Keep reading for more information on conducting your own studies on GitHub Copilot’s impact.

![A chart showing how developers at Accenture gauged the ease of using GitHub Copilot. 42.8% of developers at Accenture deem it "extremely easy to use."](https://github.blog/wp-content/uploads/2024/05/image3.png?w=1024&resize=1024%2C538)

![A chart showing how developers at Accenture gauged the usefulness of GitHub Copilot. 50.9% of developers at Accenture deem it "extremely useful."](https://github.blog/wp-content/uploads/2024/05/image5.png?w=1024&resize=1024%2C538)

### Developers improved code quality using GitHub Copilot[](#developers-improved-code-quality-using-github-copilot)

By convention, pull requests represent a ready-to-deploy code change (for example, a new feature, bug fix, or code refactoring). When measured in aggregate, the number of pull requests per developer can be used to measure a team’s throughput or velocity. Ultimately, an increase in pull requests represents an increase in value delivered, and **Accenture developers saw an 8.69% increase in pull requests.** Because each pull request must pass through a code review, the pull request merge rate is an excellent measure of code quality as seen through the eyes of a maintainer or coworker. **Accenture saw a 15% increase to the pull request merge rate,** which means that as the volume of pull requests increased, so did the number of pull requests passing code review.

But we don’t want to just shift issues downstream and overburden the system with low-quality code. It’s one thing for a teammate to assess quality and yet another for new code to successfully complete CI runs where test automation evaluates code quality against deterministic measures. At Accenture, we saw an **84% increase in successful builds** suggesting not only that more pull requests were passing through the system, but they were also of higher quality as assessed by both human reviewers and test automation.

By enabling developers to maintain focus and stay in the flow, GitHub Copilot doesn’t sacrifice quality for speed. And our findings provide evidence for exactly that.

In our study, **developers accepted around 30% of GitHub Copilot’s suggestions**. And **90% of the developers** reported that they committed code suggested by GitHub Copilot, while **91% of the developers reported that their teams had merged pull requests containing code suggested by GitHub Copilot**. Analysis also showed high usage rates with the accepted code—for example, **developers retained 88% of GitHub Copilot-generated characters in their editor**.

![A chart showing how developers at Accenture gauged GitHub Copilot’s impact on production code, also outlined in the preceding paragraph.](https://github.blog/wp-content/uploads/2024/05/image4.png?w=1024&resize=1024%2C541)

By experiencing improved success rates in builds, developers can reduce the likelihood of errors.

### GitHub Copilot improved the overall developer experience[](#github-copilot-improved-the-overall-developer-experience)

Our survey among Accenture developers unveiled compelling findings indicating a significant boost in overall developer satisfaction with GitHub Copilot. An impressive **90% of developers expressed feeling more fulfilled with their jobs** when utilizing GitHub Copilot, and a staggering **95% of developers reported enjoying coding more when leveraging GitHub Copilot’s capabilities**.

This enhancement in job satisfaction could allow developers to allocate their focus toward tasks most fulfilling to them, like solutions design or collaboration. Furthermore, our analysis revealed that developers’ heightened fulfillment correlated directly with their engagement with GitHub Copilot. When using GitHub Copilot less than two days per week, fulfillment only increased “a little.” But when using GitHub Copilot more than 2 days per week, fulfillment increases “quite a bit.”

70% of developers also reported quite a bit less mental effort was expended on repetitive tasks, and 54% spent less time searching for information or examples when utilizing GitHub Copilot. This reduction in cognitive load could enable developers to allocate their cognitive resources more efficiently, reducing burnout. GitHub Copilot also allowed developers to maintain uninterrupted focus, with a majority indicating that they could maintain [flow state](https://github.blog/2024-01-22-how-to-get-in-the-flow-while-coding-and-why-its-important/) while using the tool, a hallmark of good DevEx. These impacts extend beyond mere task optimization, which offers enterprises a competitive edge by maximizing developer resources and fostering a conducive environment for innovation and growth.

![A chart showing how developers at Accenture grew more fulfilled the more they used GitHub Copilot.](https://github.blog/wp-content/uploads/2024/05/image2.png?w=1024&resize=1024%2C538)

How to evaluate the impact of GitHub Copilot in your organization

Organizations seeking to conduct studies on the impact of GitHub Copilot can follow a methodological approach focusing on collecting and analyzing three types of data: quantitative, qualitative, and operational. To ensure readiness for data collection, organizations are advised to streamline their DevOps platform telemetry infrastructure in alignment with their specific goals and workflows.

It’s essential to note that success metrics should be tailored to reflect the unique processes and operations of each organization. By adopting this methodology and customizing metrics accordingly, organizations can effectively gauge the impact of GitHub Copilot.

[Learn how to measure the impact of GitHub Copilot in your organization >](https://resources.github.com/learn/pathways/copilot/essentials/measuring-the-impact-of-github-copilot/)

## From the lab to the real world[](#from-the-lab-to-the-real-world)

After conducting multiple lab studies on the impact of GitHub Copilot, we are now working to understand how GitHub Copilot affected developers’ workdays in real-world environments—and that’s been made possible by the tremendous adoption we’ve seen among businesses and enterprise organizations alike.

With this study, we have uncovered compelling evidence that GitHub Copilot significantly enhances developer experience, satisfaction, and overall job fulfillment in real-world enterprise settings. With GitHub Copilot in their toolkits, developers can also enhance their skill sets and gain greater proficiency in their organization’s codebase, which ultimately leads to heightened contribution levels across teams, all without sacrificing the quality of code.

---

### Acknowledgments[](#acknowledgments)

We are very grateful to all the developers who participated in the GitHub Copilot adoption experiment and survey. Ya Gao from GitHub Customer Research led the experiment in partnership with Accenture, the Microsoft Office of the Chief Economist, and the GitHub Copilot Quality Measurement team, specifically in collaboration with Phillip Coppney and Daniel A. Schocke at Accenture; Sida Peng, Dan Tetrick, and Jeff Wilcox at Microsoft; and Erik Polzin and Lizzie Redford at GitHub.

The post [Research: Quantifying GitHub Copilot’s impact in the enterprise with Accenture](https://github.blog/2024-05-13-research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/) appeared first on [The GitHub Blog](https://github.blog).