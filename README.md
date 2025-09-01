# The RSS Tracker Obsidian Plugin

The RSS Tracker Obsidian plugin is designed to enable users to remain informed about their preferred content sources. By consolidating and overseeing RSS feeds, it offers a platform for efficiently tracking updates and seamlessly integrating them into the Obsidian knowledge graph.

## Features

The RSS Tracker plugin brings powerful content tracking and organization capabilities directly into your Obsidian workflow. Here’s how it enhances your note-taking experience:

- **Seamless Integration with Your Knowledge Graph** :
  RSS Tracker automatically maps RSS feed taxonomies—such as categories and hashtags—into Obsidian’s own tagging system. This means new content from your favorite sources is instantly connected to your existing notes, making discovery and cross-referencing effortless.

- **Dataview Dashboards for Feed Organization** :
  Effortlessly organize your RSS feeds into custom collections using a built-in Dataview dashboard. This lets you group, filter, and review updates from multiple sources in a way that fits your unique research or reading habits.

- **Advanced Taxonomy-Driven Dashboards**:
  Take advantage of powerful, hashtag-based filters to create dashboards tailored to your interests. Whether you want to track specific topics, authors, or trends, you can surface exactly the content you care about—right inside Obsidian.

- **Reading List Management**:
  Keep track of articles and updates you want to read later. RSS Tracker provides a dedicated reading list feature, so you never lose sight of important or interesting items.

- **Pin Important Items** :
  Highlight and pin key RSS items to ensure they persist in your vault. Pinned items remain easily accessible, making it simple to revisit essential content or reference it in your notes.

With these features, RSS Tracker transforms Obsidian into a powerful hub for staying informed, organized, and in control of your information flow.


## Installation (BRAT)

To install the RSS Tracker plugin using the BRAT (Beta Reviewers Auto-update Tool) plugin:
1. Ensure the **BRAT** plugin is installed and enabled in your Obsidian vault.
   - You can find BRAT in the Community Plugins browser by searching for "BRAT".
2. Open the BRAT plugin interface from the left sidebar or via the command palette.
3. Click **"Add Plugin"** and enter the GitHub repository URL for RSS Tracker:
```
https://github.com/WetHat/rss-tracker
```
4. Click **"Add"**. BRAT will fetch and list the RSS Tracker plugin in your BRAT dashboard.
5. In the BRAT dashboard, click **"Install"** next to the RSS Tracker plugin entry.
6. Once installed, go to **Settings → Community Plugins** and enable the RSS Tracker plugin.
7. The RSS Tracker plugin is now ready to use in your vault.

---

## Quickstart

After installing and enabling the RSS Tracker plugin:

1. Open the command palette (`Ctrl+P` or `Cmd+P`) and search for "RSS Tracker".
2. Use the **"Add RSS Feed"** command to subscribe to your first feed.
   Example:
3. Access your Feed dashboard (`Feeds.md`) from the Obsidian file explorer.
4. New feed items will appear as notes.
5. Use the reading list and pin features to manage important articles.

## Plug-In Settings

Configure plugin behavior via **Settings → RSS Tracker**. Refer to [Commands documentation](http://wethat.github.io/rss-tracker/settings).

## Documentation

See the [user manual](http://wethat.github.io/rss-tracker/index) for detailed information on usage and customization options.


## Contributing to RSS Tracker

We welcome contributions of all kinds, from bug fixes and new features to documentation improvements. Please follow these guidelines to ensure a smooth development process.

### 1. Fork and Clone the Repository

1. **Fork** the [RSS Tracker GitHub repository](https://github.com/WetHat/rss-tracker) to your own GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/rss-tracker.git
   cd rss-tracker
   ```

### 2. Set Up the Development Environment

1. Ensure you have [Node.js](https://nodejs.org/) (version 16 or higher recommended) and [npm](https://www.npmjs.com/) installed.
2. Initialize the project dependencies:
   ```bash
   npm install
   ```

### 3. Recommended: Use Visual Studio Code

We recommend using [Visual Studio Code (VSCode)](https://code.visualstudio.com/) for development. It offers excellent TypeScript support, debugging tools, and integration with GitHub.

- Install the recommended extensions when prompted.
- Use the built-in terminal for running build and test commands.

### 4. Create a Feature Branch

Before making changes, create a new branch based on `main`:
```bash
git checkout -b feature/your-feature-name
```

### 5. Make Your Changes

- Follow the existing code style and conventions.
- Write clear commit messages.
- Add or update documentation as needed.

### 6. Test Your Changes

- Ensure your changes do not break existing functionality.
- Run any available tests or manual checks.

## 7. Push and Create a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Go to the original [RSS Tracker repository](https://github.com/WetHat/rss-tracker) and click **"Compare & pull request"**.
3. Fill in the pull request template, describing your changes and referencing any related issues.

### 8. Code Review and Feedback

- Participate in the code review process by responding to comments and making requested changes.
- Once approved, your changes will be merged into the main branch.

---

 If you have any questions, feel free to open an issue or start a discussion.