---
author: "Python Morsels"
published: 2024-04-05T23:41:43.000Z
link: https://www.pythonmorsels.com/http-server/
id: https://www.pythonmorsels.com/http-server/
feed: "Python Morsels"
tags: []
---
> [!abstract] Python's http.server module - 2024-04-05T23:41:43.000Z

🔗Read article [online](https://www.pythonmorsels.com/http-server/). For other items in this feed see [[Python Morsels]].

- [ ] [[Python's http․server module]] - 2024-04-05T23:41:43.000Z
- - -
Use Python's `http.server` module to serve up a static website on your own machine.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1841759405-9da045272fa3ba2c3dafbff1086447bd10609290a8f06c9e3ef300b43cd23fbf-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [A directory trees of `index.html` files](https://www.pythonmorsels.com/http-server/#a-directory-trees-of-indexhtml-files)
2. [Serving up HTML files with `http.server`](https://www.pythonmorsels.com/http-server/#serving-up-html-files-with-httpserver)
3. [Customizing `http.server` with CLI arguments](https://www.pythonmorsels.com/http-server/#customizing-httpserver-with-cli-arguments)
4. [Using `http.server` as a module](https://www.pythonmorsels.com/http-server/#using-httpserver-as-a-module)
5. [Use `python -m http.server` for a local HTTP server](https://www.pythonmorsels.com/http-server/#use-python-m-httpserver-for-a-local-http-server)

## A directory trees of `index.html` files

We have a directory here that represents a static website:

`~/comprehensions/_build/dirhtml                                 $ ls index.html                                 index.html`
                                

We not only have an `index.html` file, but also a bunch of sub-directories, each with their own `index.html` file:

`~/comprehensions/_build/dirhtml                                 $ ls generator-expressions                                 index.html`
                                

The only way to really navigate this website locally is to **serve up these files** using some sort of HTTP server that is aware of these index files.

Python comes bundled with an HTTP server that we can use. It's called `http.server`.

## Serving up HTML files with `http.server`

If we run this module …

### [Read the full article: https://www.pythonmorsels.com/http-server/](https://www.pythonmorsels.com/http-server/)
