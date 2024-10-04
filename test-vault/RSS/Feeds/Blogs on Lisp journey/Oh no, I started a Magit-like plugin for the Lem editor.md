---
role: rssitem
author: Unknown
published: 2024-03-14T12:11:34.000Z
link: https://localhost/blog/oh-no-i-started-a-magit-like-plugin-for-the-lem-editor/
id: /blog/oh-no-i-started-a-magit-like-plugin-for-the-lem-editor/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] Oh no, I started a Magit-like plugin for the Lem editor - 2024-03-14T12:11:34.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Lem is an awesome project. It’s an editor buit in Common Lisp, ready to use out of the box for Common Lisp, that supports more languages and modes (Python, Rust, Elixir, Go, JavaScript, TypeScript, Haskell, Java, Nim, Dart, OCaml, Scala, Swift, shell, asm, but also markdown, ascii, JSON, HTML and CSS, SQL…) thanks to, in part, its built-in LSP support. I took the challenge to add an interactive interface for Git, à la Magit, because you know, despite all its features (good vim mode, project-awar⋯

🔗Read article [online](https://localhost/blog/oh-no-i-started-a-magit-like-plugin-for-the-lem-editor/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Oh no, I started a Magit-like plugin for the Lem editor]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Additional RSS Items Referring to This Article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
Lem is an awesome project. It’s an editor buit in Common Lisp, ready to use out of the box for Common Lisp, that supports more languages and modes (Python, Rust, Elixir, Go, JavaScript, TypeScript, Haskell, Java, Nim, Dart, OCaml, Scala, Swift, shell, asm, but also markdown, ascii, JSON, HTML and CSS, SQL…) thanks to, in part, its built-in LSP support. I took the challenge to add an interactive interface for Git, à la Magit, because you know, despite all its features (good vim mode, project-aware commands, grep, file tree view and directory mode, multiple cursors, tabs…), there’s so much an editor should do to be useful all day long.