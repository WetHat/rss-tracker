---
role: rssitem
author: John Baez
published: 2024-03-15T10:10:44.000Z
link: https://johncarlosbaez.wordpress.com/2024/03/15/the-probability-of-undecidability/
id: http://johncarlosbaez.wordpress.com/?p=37690
feed: "[[Azimuth]]"
tags: [rss/mathematics]
pinned: false
---

> [!abstract] The Probability of Undecidability by John Baez - 2024-03-15T10:10:44.000Z
> ![image|400](https://johncarlosbaez.files.wordpress.com/2024/03/unprovability_michael_freedman.png){.rss-image}
> There’s a lot we don’t know. There’s a lot we can’t know. But can we at least know how much we can’t know? What fraction of mathematical statements are undecidable—that is, can be neither proved nor disproved? There are many ways to make this question precise… but it remains a bit mysterious. The best results ［…］

🔗Read article [online](https://johncarlosbaez.wordpress.com/2024/03/15/the-probability-of-undecidability/). For other items in this feed see [[Azimuth]].

- [ ] [[The Probability of Undecidability]]

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
There’s a lot we don’t know. There’s a lot we _can’t_ know. But can we at least know how _much_ we can’t know?

What fraction of mathematical statements are undecidable—that is, can be neither proved nor disproved? There are many ways to make this question precise… but it remains a bit mysterious. The best results I know appear, not in a published paper, but on MathOverflow!

In 1998, the Fields-medal winning topologist [Michael Freedman](https://eudml.org/doc/224467) conjectured that the fraction of statements that are provable in Peano Arithmetic approaches zero quite rapidly as you go to longer and longer statements:

![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/unprovability_michael_freedman.png)

He must also have been conjecturing that Peano Arithmetic is consistent, since if it’s inconsistent then _all_ its statements are provable. From now on let’s assume that PA is consistent.

In 2005, [Cristian Calude and Konrad Jürgensen](https://doi.org/10.1016/j.aam.2004.10.003) published a paper arguing that Freedman was on the right track. More precisely, they showed that the fraction of statements in PA that are provable goes to zero as we go to longer and longer statements. The fraction of disprovable statements also goes to zero. So, the fraction of undecidable statements approaches 1.

Unfortunately their paper had a mistake!

In 2009, [David Speyer](https://mathoverflow.net/a/7902/2893) argued that the fraction of provable statements does not approach 0 and does not approach 1 as we consider longer and longer statements. Instead, it’s bounded by numbers between 0 and 1. Similarly for the fraction of undecidable statements! His argument is not air-tight, as he admits and explains—but I believe it. Someone should try to complete his proof.

Speyer’s idea is very simple: if P is any statement, the statement “P or 1 = 1” is provable. This can be used to get a lower bound on the number of provable statements of a given length. Similarly, suppose G is some undecidable statement. Then for any statement P, the statement “G and (P or 1 = 1)” is undecidable. This can be used to get a lower bound on the number of undecidable statements of a given length.