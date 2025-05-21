---
role: rssitem
aliases: []
id: https://github.blog/?p=77929
author: Eric Bailey
link: https://github.blog/2024-05-07-how-were-building-more-inclusive-and-accessible-components-at-github/
published: 2024-05-07T17:00:20.000Z
feed: "[[The GitHub Blog꞉ Product News and Updates]]"
pinned: false
tags:
  - rss/GitHub_Issues
  - rss/Global_Accessibility_Awareness_Day
  - rss/Product
  - rss/accessibility
---

> [!abstract] How we’re building more inclusive and accessible components at GitHub (by Eric Bailey)
> ![image|float:right|400](https://github.blog/wp-content/uploads/2024/05/example-listview.png?w=1024&resize=1024%2C543) We've made improvements to the way users of assistive technology can interact with and navigate lists of issues and pull requests and tables across GitHub.com. The post How we’re building more inclusive and accessible components at GitHub appeared first on The GitHub Blog.

🌐 Read article [online](https://github.blog/2024-05-07-how-were-building-more-inclusive-and-accessible-components-at-github/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[RSS/Feeds/The GitHub Blog꞉ Product News and Updates/How we’re building more inclusive and accessible components at GitHub|How we’re building more inclusive and accessible components at GitHub]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

One of GitHub’s core values is **Diverse and Inclusive**. It is a guiding thought for how we operate, reminding us that GitHub serves a developer community that spans a wide range of geography and ability.

Putting diversity and inclusivity into practice means incorporating a wide range of perspectives into our work. To that point, **disability and accessibility** are an integral part of our efforts.

This consideration has been instrumental in crafting [resilient, accessible components](https://primer.style/) at GitHub. These components, in turn, help to guarantee that our experiences work regardless how they are interacted with.

Using GitHub should be efficient and intuitive, regardless of your device, circumstance, or ability. To that point, we have been working on improving the accessibility of our lists of issues and pull requests, as well as our information tables.

Our list of issues and pull requests are some of the most high-traffic experiences we have on GitHub. For many, it is the “homepage” of their open source projects, a jumping off point for conducting and managing work.

Our tables help to communicate, and facilitate taking action with confidence on complicated information relationships. These experiences are workhorses, helping to communicate information about branches, repositories, secrets, attestations, configurations, internal documentation, etc.

## Nothing about us without us[](#nothing-about-us-without-us)

Before we discuss the particulars of these updates, I would like to call attention to the most important aspect of the work: **direct participation of, and input from daily assistive technology users**.

Disabled people’s direct involvement in the inception, design, and development stages is indispensable. It’s crucial for us to [go beyond compliance](https://adhoc.team/playbook-accessibility/) and weave these practices into the core of our organization. Only by doing so can we create genuinely inclusive experiences.

With this context established, we can now talk about how this process manifests in component work.

## Improvements we’re making to lists of issues and pull requests[](#improvements-were-making-to-lists-of-issues-and-pull-requests)

![A list of nine GitHub issues. The issues topics are a blend of list component work and general maintenance tasks. Each issue has a checkbox for selecting it, a status icon indicating that it is an open issue, a title, metadata about its issue number, author, creation date, and source repository. These issues also have secondary information including labels, tallies for linked pull requests and comments, avatars for issue assignees, and overflow actions. Additionally, some issues have a small badge that indicates the number of tasks the issue contains, as well as how many of them are completed. Above the list of issues is an area that lists the total number of issues, allows you to select them all, control how they are sorted, change the information display density, and additional overflow actions.](https://github.blog/wp-content/uploads/2024/05/example-listview.png?w=1024&resize=1024%2C543)

Lists of issues and pull requests will continue to support methods of navigation via assistive technology that you may already be familiar with—making experiences consistent and predictable is a huge and often overlooked aspect of the work.

In addition, these lists will soon be updated to also have:

- A dedicated subheading for quickly navigating to the list itself.
- A dedicated subheading per issue or pull request.
- [List and list item screen reader keyboard shortcut](https://www.nvaccess.org/files/nvda/documentation/userGuide.html#SingleLetterNavigation) support.
- Arrow keys and Home/End to quickly move through each list item.
- Focus management that allows using Tab to explore individual list item content.
- Support for Space keypresses for selecting list items, and Enter for navigating to the issue or pull request the list item links to.

This allows a wide range of assistive technologies to efficiently navigate, and act on these experiences.

## Improvements we’re making to tables[](#improvements-were-making-to-tables)

![A table titled, ‘Active branches’. It has five columns and 7 rows. The columns are titled ‘branches’, ‘updated’, ‘check status’, ‘behind/ahead’, ‘pull request’, and ‘actions’. Each row lists a branch name and its associated metadata. The branch names use a GitHub user name/feature name pattern. The user names include people who worked on the table component, including Mike Perrotti, Josh Black, Eric Bailey, and James Scholes. They also include couple of subtle references to disability advocates Alice Wong and Patty Berne. The branches are sorted by last updated order, and after the table is a link titled, ‘View more branches’.](https://github.blog/wp-content/uploads/2024/05/example-datatable.png?w=1024&resize=1024%2C431)

We are in the process of replacing one-off table implementations with [a dedicated Primer component](https://primer.style/components/data-table).

Primer-derived tables help provide **consistency and predictability**. This is important for [expected table navigation](https://www.freedomscientific.com/SurfsUp/Tables.htm), but also applies for other table-related experiences, such as loading content, sorting and pagination requests, and bulk and row-level actions.

At the time of this blog post’s publishing, there are 75 bespoke tables that have been replaced with the Primer component, spread across all of GitHub.

The reason for this quiet success has been due entirely to close collaboration with both our disabled partners and [our design system experts](https://primer.style/about). This collaboration helped to ensure:

1. The new table experiences were seamlessly integrated.
2. Doing so, improved and enhanced the underlying assistive technology experience.

## Progress over perfection[](#progress-over-perfection)

Meryl K. Evans’ [Progress Over Perfection](https://meryl.net/accessibility-progress-over-perfection/) philosophy heavily influenced how we approached this work.

**Accessibility is never done**. Part of our dedication to this work is understanding that it will grow and change to meet the needs of the people who rely on it. This means making positive, iterative change [based on feedback from the community](https://github.com/orgs/community/discussions/categories/accessibility) GitHub serves.

## More to come[](#more-to-come)

Tables will continue to be updated, and the lists should be released publicly soon. Beyond that, we’re excited about the changes we’re making to improve GitHub’s accessibility. This includes both our services and also [our internal culture](https://github.blog/2024-05-01-empowering-accessibility-githubs-journey-building-an-in-house-champions-program/).

We hope that these components, and the process that led to their creation, help you as both part of our developer community and as people who build the world’s software.

Please visit [accessibility.github.com](https://accessibility.github.com/) to learn more and share feedback on our [accessibility community discussion page](https://github.com/orgs/community/discussions/categories/accessibility).

The post [How we’re building more inclusive and accessible components at GitHub](https://github.blog/2024-05-07-how-were-building-more-inclusive-and-accessible-components-at-github/) appeared first on [The GitHub Blog](https://github.blog).