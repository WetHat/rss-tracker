---
role: rssitem
author: "John Baez"
published: 2024-03-13T23:20:10.000Z
link: https://johncarlosbaez.wordpress.com/2024/03/13/the-probability-of-the-law-of-excluded-middle/
id: http://johncarlosbaez.wordpress.com/?p=37675
feed: "[[Azimuth]]"
tags: [rss/mathematics]
pinned: false
---

> [!abstract] The Probability of the Law of Excluded Middle by John Baez - 2024-03-13T23:20:10.000Z
> <span class="rss-image">![image|400](https://johncarlosbaez.files.wordpress.com/2024/03/free_heyting_algebra_on_one_generator.jpg)</span>
> The Law of Excluded Middle says that for any statement P, “P or not P” is true. Is this law true? In classical logic it is. But in intuitionistic logic it’s not. So, in intuitionistic logic we can ask what’s the probability that a randomly chosen statement obeys the Law of Excluded Middle. And the ［…］

🔗Read article [online](https://johncarlosbaez.wordpress.com/2024/03/13/the-probability-of-the-law-of-excluded-middle/). For other items in this feed see [[Azimuth]].

- [ ] [[The Probability of the Law of Excluded Middle]]

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
The [Law of Excluded Middle](https://en.wikipedia.org/wiki/Law_of_excluded_middle) says that for any statement P, “P or not P” is true.

Is this law true? In classical logic it is. But in [intuitionistic logic](https://en.wikipedia.org/wiki/Intuitionistic_logic) it’s not.

So, in intuitionistic logic we can ask what’s the _probability_ that a randomly chosen statement obeys the Law of Excluded Middle. And the answer is “at most 2/3—or else your logic is classical”.

This is a very nice new result by Benjamin Bumpus and Zoltan Kocsis:

• Benjamin Bumpus, [Degree of classicality](https://bmbumpus.com/2024/02/27/degree-of-classicality/), _Merlin’s Notebook_, 27 February 2024.

Of course they had to make this more precise before proving it. Just as classical logic is described by [Boolean algebras](https://en.wikipedia.org/wiki/Boolean_algebra), intuitionistic logic is described by something a bit more general: [Heyting algebras](https://en.wikipedia.org/wiki/Heyting_algebra). They proved that in a finite Heyting algebra, if more than 2/3 of the statements obey the Law of Excluded Middle, then it must be a Boolean algebra!

Interestingly, nothing like this is true for “not not P implies P”. They showed this can hold for an arbitrarily high fraction of statements in a Heyting algebra that is still not Boolean.

Here’s a piece of the free Heyting algebra on one generator, which some call the Rieger–Nishimura lattice:

[  
![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/free_heyting_algebra_on_one_generator.jpg)  
](https://commons.wikimedia.org/wiki/File:Rieger-Nishimura.svg)

_Taking the principle of excluded middle from the mathematician would be the same, say, as proscribing the telescope to the astronomer or to the boxer the use of his fists._ — David Hilbert

I disagree with this statement, but boy, Hilbert sure could write!