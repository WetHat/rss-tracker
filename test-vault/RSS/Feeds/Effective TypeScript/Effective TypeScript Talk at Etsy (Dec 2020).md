---
role: rssitem
author: Unknown
published: 2024-01-31T22:40:00.000Z
link: https://effectivetypescript.com/2024/01/31/etsy/
id: https://effectivetypescript.com/2024/01/31/etsy/
feed: "[[Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] Effective TypeScript Talk at Etsy (Dec 2020) - 2024-01-31T22:40:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Back in 2020 I gave a whole series of Effective TypeScript talks at companies that were interested in the language and the book. The talk that I gave at Etsy in December of 2020 was one of the most fun. It was recorded and is now available to watch. It's about an hour.

🔗Read article [online](https://effectivetypescript.com/2024/01/31/etsy/). For other items in this feed see [[Effective TypeScript]].

- [ ] [[Effective TypeScript Talk at Etsy (Dec 2020)]]

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
Back in 2020 I gave a whole series of [_Effective TypeScript_](https://amzn.to/3UjPrsK) talks at companies that were interested in the language and the book. The talk that I gave at Etsy in December of 2020 was one of the most fun. It was recorded and is now available to watch. It's about an hour.

Here are the [slides](https://docs.google.com/presentation/d/1rx7In5TUiMm0q9z1wnWQf5tZeRS8z25NG3LqExsjj3U/edit?usp=sharing). Topics covered in this talk include:

- What is an "Effective" book?
- What's the relationship between TypeScript and JavaScript ([playground](https://www.typescriptlang.org/play/#code/DYUwLgBAxglmCeEC8EDkA7EB3C8D2ATgNbRzyoDcAUFHugM56gB0weA5gBSwLNh4BVAA5CQBKAEN6ITgEpZ1KktoNI9MBLAh6yCAG0qECAG90EgLYgAXGgCCwCQCMLE1ABpoEoXAnAbqAFk6MHY8SwJyAF83QxMzS397KSJXD09vDT80ACkAV0wJXNRo2NMLazsCGAAvOlT0nyzUAAUACzwQdBgAD2KYowB6AYhmUaoAXWoAM0IIbjp1CHVNEAg8KaWNLXpZE1iVRhY2LmWtZkkMpgUqSKogA))
- Why you shouldn't repeat type information in documentation ([Item 30](https://effectivetypescript.com/2023/05/31/jsdoc-repeat/); [playground](https://www.typescriptlang.org/play?#code/PQKhCgAIUglBTALgVwE4DsDOkCGlOKoCW6A5pAO5GIAWkt8kAZgParymovLoAmkAYxYAbNgDooMACo4A1vGwAveF0hs16RjlSlkAW3jpEmMZADq1Ouha4d+w8YA0kdigzYGk-Ihx9t-VnZObj5BEXFzSw0tOwMjZ1c0LHoaRkCOLh5+IVFUL0DcSAAHbUQiAWRhbWKcUngJaGBwJh4BMpZ0SDrEADE2DJDeAGFw1AAKErqAfgAub2IyAEpIAG8oFyQkmrrIAF59yAByUVISQ8gp1dQ5gEYAJgB2Z1Jbx+cAI1eHgF9IOZXrpAAAzPOYgyCfYHfADc4G+4HA3T6QUyfBGuTGiwRJEQKiYOAEjD6NjWkEgwGAkAAopYVIUqMJhBDGJgkGpUBDKERGcz8EgPshEJBrEL3ixaOscLN5iRSLCye9pQQFnK4QjQDAAMpsIUMGVkbDvACewvsxAEkAAbjhhMhGGMiGJ6pAAER3F2QAA8rpuQJdi1MABEWApheLIHoWLwiEwTeh9CZGs1Wu1OpgdQA5M3lG3CI1jeN6TBzZWygDaAF1FiXCOWK6t1okMKai2J06hEGMxjgPstdgA+SBZvTvFTd5YAWiH+lH43ei0WsPhQA))
- Why you should think about types as sets of values (Item 7, [playground](https://www.typescriptlang.org/play?#code/PTAEBUE8AcFMGdQEMBOtT1gF0QewGajS7zwCWARgDboBuSVArggFAs1agAeoAvKAEYADAG4WPfgHJhksSxCgA6gAsknMoQDu6TUgB2nLLmRUquTaCzKy8APxsFAVT1lDMViyzvQAQQBCAMJ8oJI+kqAAPiF+4VGSAbLs2MgAXL6BwaGJSJkxYjlSACKJ8mAqapKIAERIpGQA5npI1LBV9iwAJrAAxlSo6BwYAPIoAHJp8FgoZHr1kaB6jAC2FLAocgCyasoAdPAAjihYABTwI6MAlHIKAJKIiytrlsrouHpUkJbeVmqgS0gAawQzxsoE0uBQAPaCgAypAVrgqIhVLR0DkvHBQAB9X45MzdNRkN5YljdN6TUCwKjBDq4brLWAGHb1bAAURoS0ZWD8kBuHWOkiWkAAtFTJFcWAw1icqTssLAuFgAm95QYJaVQAAlWBIDqgKoK1UdeBVZDVeCMCiYTgEKosGbylD4JDddCjRimSAwrCMLoGUAAbxYoBDoDIHQmUxm9TEoYWSE5kems3mi1MYgAvg4wHcQYghgBpaFgB1rZ2u0De31cymKxnG0Duz1Vv2cIMKONNRMYKOzMQKLNAA))
- Designing types that only represent valid states (Item 28, [playground](https://www.typescriptlang.org/play?#code/PTDECcFMHMEsHsB2AoWiAulwDMCGBjSAAgGV1dMiBvZIo-AV3CgwAVdpIAuIgZ3XBpoAblpEADh0gAVSAA90PfoMQixsXgBl4uACZCeAI3jwANpFyJRdLOHjgA-EoFDRAX2QhQkRLqhwkZGR5cXt0ImwGRHx0BEQiFl0sdk4ACn4KblJyTABKajEQIgA6UrEodCZ4gAMAHgALAEYAPgASKgzMYsZmH3QUyDda4CbmgB1Eds7IYslOWQU3avcgr3841AwsPEIiACVIAEcGSH5WH31VArppngBycQuhO5W0TBwCYgPj0-QAUWY9mufByWTutnsLzEEPAzhUag8b22n32RxO-BIDHwhF4vGBtyId3gAGsoXQ5jJ5IoQfCVugAJ6PVE-DGgogAXmZ6P6TyuAB8ub8AXZwEQBd9uZjsadeKJNu8dsQyJkAEzAnosfpSOGucpo368HhUADaFJ1qgAujwJb9lZg3CsvBd1kggA))
- How to avoid fighting with the type checker ([playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAcwE4FN1QBRgIYC26AXIgM5SoxjIA0iARjKlABYAieUJin3iAH0RgQAG1EBKRAG8AUIkSisiPMnQBZMogC8jZmz7pEAfl5d0AOjBwA7tikBaPSw7mLaqABUYRe4lIi4gDcsvKKymiYsDQ6iAAGABLo4nCIACTS+EQAvhZxIQowwIjYTC6GUnIK1ZFY1MiIANS6cYgAmnAgKhglqJ3IrKIAnlIZqhpaAPSIAIwADAvZ5OgQCAAmWnCia3kFiNlhGFAgqEi10cghB0A))

The content of the talk represents my views, it wasn't by or on behalf of Etsy. If you're interested in hosting an _Effective TypeScript_ talk at your company or meetup, please [get in touch](https://twitter.com/danvdk)!