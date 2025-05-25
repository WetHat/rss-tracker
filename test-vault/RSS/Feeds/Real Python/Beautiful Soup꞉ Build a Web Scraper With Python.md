---
role: rssitem
aliases:
  - "Beautiful Soup: Build a Web Scraper With Python"
id: https://realpython.com/beautiful-soup-web-scraper-python/
author: unknown
link: https://realpython.com/beautiful-soup-web-scraper-python/
published: 2024-10-28T14:00:00.000Z
feed: "[[RSS/Feeds/Real Python.md | Real Python]]"
tags: []
pinned: false
---

> [!abstract] Beautiful Soup: Build a Web Scraper With Python (by unknown)
> ![image|float:right|400](https://files.realpython.com/media/Build-a-Web-Scraper-With-Requests-and-Beautiful-Soup_Watermarked.37918fb3906c.jpg) In this tutorial, you'll walk through the main steps of the web scraping process. You'll learn how to write a script that uses Python's Requests library to scrape data from a website. You'll also use Beautiful Soup to extract the specific pieces of information you're interested in.

🌐 Read article [online](https://realpython.com/beautiful-soup-web-scraper-python/). ⤴ For other items in this feed see [[RSS/Feeds/Real Python.md | Real Python]].

- [ ] [[RSS/Feeds/Real Python/Beautiful Soup꞉ Build a Web Scraper With Python|Beautiful Soup꞉ Build a Web Scraper With Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

[Web scraping](https://realpython.com/python-web-scraping-practical-introduction/) is the automated process of extracting data from the internet. The Python libraries **Requests** and **Beautiful Soup** are powerful tools for the job. To effectively harvest the vast amount of data available online for your research, projects, or personal interests, you’ll need to become skilled at web scraping.

**In this tutorial, you’ll learn how to:**

- Inspect the **HTML structure** of your target site with your browser’s **developer tools**
- Decipher data encoded in **URLs**
- Use Requests and Beautiful Soup for **scraping and parsing data** from the internet
- Step through a **web scraping pipeline** from start to finish
- **Build a script** that fetches job offers from websites and displays relevant information in your console

If you like learning with hands-on examples and have a basic understanding of Python and HTML, then this tutorial is for you! Working through this project will give you the knowledge and tools you need to scrape any static website out there on the World Wide Web. You can download the project source code by clicking on the link below:

**Get Your Code:** [Click here to download the free sample code](https://realpython.com/bonus/beautiful-soup-web-scraper-python-code/) that you’ll use to learn about web scraping in Python.

==**Take the Quiz:**== Test your knowledge with our interactive “Beautiful Soup: Build a Web Scraper With Python” quiz. You’ll receive a score upon completion to help you track your learning progress:

---

[

![Beautiful Soup: Build a Web Scraper With Python](https://files.realpython.com/media/Build-a-Web-Scraper-With-Requests-and-Beautiful-Soup_Watermarked.37918fb3906c.jpg)



](/quizzes/beautiful-soup-web-scraper-python/)

**Interactive Quiz**

[Beautiful Soup: Build a Web Scraper With Python](/quizzes/beautiful-soup-web-scraper-python/)

In this quiz, you'll test your understanding of web scraping using Python. By working through this quiz, you'll revisit how to inspect the HTML structure of a target site, decipher data encoded in URLs, and use Requests and Beautiful Soup for scraping and parsing data from the Web.

## What Is Web Scraping?[](#what-is-web-scraping "Permanent link")

**Web scraping** is the process of gathering information from the internet. Even copying and pasting the lyrics of your favorite song can be considered a form of web scraping! However, the term “web scraping” usually refers to a process that involves automation. While some websites don’t like it when automatic scrapers gather their data, which can lead to [legal issues](https://realpython.com/podcasts/rpp/12/), others don’t mind it.

If you’re scraping a page respectfully for educational purposes, then you’re unlikely to have any problems. Still, it’s a good idea to do some research on your own to make sure you’re not violating any Terms of Service before you start a large-scale web scraping project.

### Reasons for Automated Web Scraping[](#reasons-for-automated-web-scraping "Permanent link")

Say that you like to surf—both in the ocean and online—and you’re looking for employment. It’s clear that you’re not interested in just _any_ job. With a surfer’s mindset, you’re waiting for the perfect opportunity to roll your way!

You know about a job site that offers precisely the kinds of jobs you want. Unfortunately, a new position only pops up once in a blue moon, and the site doesn’t provide an email notification service. You consider checking up on it every day, but that doesn’t sound like the most fun and productive way to spend your time. You’d rather be outside surfing real-life waves!

Thankfully, Python offers a way to apply your surfer’s mindset. Instead of having to check the job site every day, you can use Python to help automate the repetitive parts of your job search. With **automated web scraping**, you can write the code once, and it’ll get the information that you need many times and from many pages.

**Note:** In contrast, when you try to get information manually, you might spend a lot of time clicking, scrolling, and searching, especially if you need large amounts of data from websites that are regularly updated with new content. Manual web scraping can take a lot of time and be highly repetitive and error-prone.

There’s so much information on the internet, with new information constantly being added. You’ll probably be interested in some of that data, and much of it is out there for the taking. Whether you’re actually on the job hunt or just want to automatically download all the lyrics of your favorite artist, automated web scraping can help you accomplish your goals.

### Challenges of Web Scraping[](#challenges-of-web-scraping "Permanent link")

The internet has grown organically out of many sources. It combines many different technologies, styles, and personalities, and it continues to grow every day. In other words, the internet is a hot mess! Because of this, you’ll run into some challenges when scraping the web:

- **Variety:** Every website is different. While you’ll encounter general structures that repeat themselves, each website is unique and will need personal treatment if you want to extract the relevant information.
    
- **Durability:** Websites constantly change. Say you’ve built a shiny new web scraper that automatically cherry-picks what you want from your resource of interest. The first time you [run your script](https://realpython.com/run-python-scripts/), it works flawlessly. But when you run the same script a while later, you run into a discouraging and lengthy stack of [tracebacks](https://realpython.com/python-traceback/)!
    

Unstable scripts are a realistic scenario because many websites are in active development. If a site’s structure changes, then your scraper might not be able to navigate the sitemap correctly or find the relevant information. The good news is that changes to websites are often small and incremental, so you’ll likely be able to update your scraper with minimal adjustments.

Still, keep in mind that the internet is dynamic and keeps on changing. Therefore, the scrapers you build will probably require maintenance. You can set up [continuous integration](https://realpython.com/python-continuous-integration/) to run scraping tests periodically to ensure that your main script doesn’t break without your knowledge.

### An Alternative to Web Scraping: APIs[](#an-alternative-to-web-scraping-apis "Permanent link")

Some website providers offer [application programming interfaces (APIs)](https://realpython.com/python-api/) that allow you to access their data in a predefined manner. With APIs, you can avoid parsing [HTML](https://realpython.com/html-css-python/). Instead, you can access the data directly using formats like [JSON](https://realpython.com/python-json/) and [XML](https://realpython.com/python-xml-parser/). HTML is primarily a way to visually present content to users.

When you use an API, the data collection process is generally more stable than it is through web scraping. That’s because developers create APIs to be consumed by programs rather than by human eyes.

The front-end presentation of a site might change often, but a change in the website’s design doesn’t affect its API structure. The structure of an API is usually more permanent, which means it’s a more reliable source of the site’s data.

However, APIs _can_ change as well. The challenges of both variety and durability apply to APIs just as they do to websites. Additionally, it’s much harder to inspect the structure of an API by yourself if the provided documentation lacks quality.

## [Read the full article at https://realpython.com/beautiful-soup-web-scraper-python/ »](https://realpython.com/beautiful-soup-web-scraper-python/?utm_source=realpython&utm_medium=rss)

---

_［ Improve Your Python With 🐍 Python Tricks 💌 – Get a short & sweet Python Trick delivered to your inbox every couple of days. [＞＞ Click here to learn more and see examples](https://realpython.com/python-tricks/?utm_source=realpython&utm_medium=rss&utm_campaign=footer) ］_
