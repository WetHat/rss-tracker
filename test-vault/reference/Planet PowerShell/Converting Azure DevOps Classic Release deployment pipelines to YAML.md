---
author: "mark@wragg.io"
published: 2024-04-02T12:00:00.000Z
link: https://wragg.io/converting-azure-devops-classic-release-pipelines-to-yaml/
id: https://wragg.io/converting-azure-devops-classic-release-pipelines-to-yaml
feed: "Planet PowerShell"
tags: [rss/powershell,rss/azure,rss/azuredevops,rss/pipelines,rss/YAML]
pinned: false
---
> [!abstract] Converting Azure DevOps Classic Release deployment pipelines to YAML by mark@wragg.io - 2024-04-02T12:00:00.000Z
> I recently migrated some Azure DevOps Classic Release deployment pipelines to YAML. There’s obvious benefits to storing your pipelines as code: they become an artifact in source control that can evolve and change as the code they build or deploy does, and you have the benefits of version history and maintaining the pipelines via pull requests. However I also found that I could use logic and expressions to make the pipelines more efficient and easier to maintain and that through templating could ⋯

🔗Read article [online](https://wragg.io/converting-azure-devops-classic-release-pipelines-to-yaml/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Converting Azure DevOps Classic Release deployment pipelines to YAML]]
- - -
I recently migrated some Azure DevOps Classic Release deployment pipelines to YAML. There’s obvious benefits to storing your pipelines as code: they become an artifact in source control that can evolve and change as the code they build or deploy does, and you have the benefits of version history and maintaining the pipelines via pull requests. However I also found that I could use logic and expressions to make the pipelines more efficient and easier to maintain and that through templating could easily connect the pipelines together to form what I humorously dubbed the “super pipeline” (but then the name stuck). In this blog post I will explain the approach I took and the advantages/disadvantages I discovered.
