---
role: rssitem
aliases: []
id: http://johncarlosbaez.wordpress.com/?p=37766
author: John Baez
link: https://johncarlosbaez.wordpress.com/2024/04/16/agent-based-models-part-8/
published: 2024-04-16T19:01:15.000Z
feed: "[[Azimuth]]"
tags:
  - rss/computer_science
  - rss/epidemiology
  - rss/mathematics
pinned: false
---

> [!abstract] Agent-Based Models (Part 8) (by John Baez)
> ![image|float:right|400](https://johncarlosbaez.files.wordpress.com/2023/07/state_diagram.png) Last time I presented a class of agent-based models where agents hop around a graph in a stochastic way. Each vertex of the graph is some ‘state’ agents can be in, and each edge is called a ‘transition’. In these models, the probability per time of an agent making a transition and leaving some state ［…］

🌐 Read article [online](https://johncarlosbaez.wordpress.com/2024/04/16/agent-based-models-part-8/). ⤴ For other items in this feed see [[Azimuth]].

- [ ] [[RSS/Feeds/Azimuth/Agent-Based Models (Part 8)|Agent-Based Models (Part 8)]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

[Last time](https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/) I presented a class of agent-based models where agents hop around a graph in a stochastic way. Each vertex of the graph is some ‘state’ agents can be in, and each edge is called a ‘transition’. In these models, the probability per time of an agent making a transition and leaving some state can depend on when it arrived at that state. It can also depend on which agents are in other states that are ‘linked’ to that edge—and when _those_ agents arrived.

I’ve been trying to generalize this framework to handle processes where agents are born or die—or perhaps more generally, processes where some number of agents turn into some other number of agents. There’s already a framework that does something sort of like this. It’s called ‘stochastic Petri nets’, and we explained this framework here:

• John Baez and Jacob Biamonte, _[Quantum Techniques for Stochastic Mechanics](https://arxiv.org/abs/1209.3632)_, World Scientific Press, Singapore, 2018. (See also blog articles [here](https://math.ucr.edu/home/baez/networks/#petri).)

However, in their simplest form, stochastic Petri nets are designed for agents whose only distinguishing information is which state they’re in. They don’t have ‘names’—that is, individual identities. Thus, even calling them ‘agents’ is a bit of a stretch: usually they’re called ‘tokens’, since they’re drawn as black dots.

We could try to enhance the Petri net framework to give tokens names and other identifying features. There are various imaginable ways to do this, such as ‘colored Petri nets’. But so far this approach seems rather ill-adapted for processes where agents have identities—perhaps because I’m not thinking about the problem the right way.

So, at some point I decided to try something less ambitious. It turns out that in applications to epidemiology, general processes where _n_ agents come in and _m_ go out are not often required. So I’ve been trying to minimally enhance the framework from last time to include processes ‘birth’ and ‘death’ processes as well as transitions from state to state.

As I thought about this, some questions kept plaguing me:

When an agent gets created, or ‘born’, which one actually gets born? In other words, what is its name? Its precise name may not matter, but if we want to keep track of it after it’s born, we need to give it a name. And this name had better be ‘fresh’: not already the name of some other agent.

There’s also the question of what happens when an agent gets destroyed, or ‘dies’. This feels less difficult: there just stops being an agent with the given name. But probably we want to prevent a new agent from having the same name as that dead agent.

Both these questions seem fairly simple, but so far they’re making it hard for me to invent a truly elegant framework. At first I tried to separately describe transitions between states, births, and deaths. But this seemed to triplicate the amount of work I needed to do.

Then I tried models that have

• a finite set ![S](https://s0.wp.com/latex.php?latex=S&bg=ffffff&fg=333333&s=0&c=20201002) of **states**,

• a finite set ![T](https://s0.wp.com/latex.php?latex=T&bg=ffffff&fg=333333&s=0&c=20201002) of **transitions**,

• maps ![u, d \colon T \to S + \{\textrm{undefined}\}](https://s0.wp.com/latex.php?latex=u%2C+d+%5Ccolon+T+%5Cto+S+%2B+%5C%7B%5Ctextrm%7Bundefined%7D%5C%7D&bg=ffffff&fg=333333&s=0&c=20201002) mapping each transition to its **upstream** and **downstream** states.

Here ![S + \{\textrm{undefined}\}](https://s0.wp.com/latex.php?latex=S+%2B+%5C%7B%5Ctextrm%7Bundefined%7D%5C%7D&bg=ffffff&fg=333333&s=0&c=20201002) is the disjoint union of ![S](https://s0.wp.com/latex.php?latex=S&bg=ffffff&fg=333333&s=0&c=20201002) and a singleton whose one element is called **undefined**. Maps from ![T](https://s0.wp.com/latex.php?latex=T&bg=ffffff&fg=333333&s=0&c=20201002) to ![S + \{\textrm{undefined}\}](https://s0.wp.com/latex.php?latex=S+%2B+%5C%7B%5Ctextrm%7Bundefined%7D%5C%7D&bg=ffffff&fg=333333&s=0&c=20201002) are a standard way to talk about partially defined maps from ![T](https://s0.wp.com/latex.php?latex=T&bg=ffffff&fg=333333&s=0&c=20201002) to ![S.](https://s0.wp.com/latex.php?latex=S.&bg=ffffff&fg=333333&s=0&c=20201002) We get four cases:

1) If the downstream of a transition is defined (i.e. in ![S](https://s0.wp.com/latex.php?latex=S&bg=ffffff&fg=333333&s=0&c=20201002)) but its upstream is undefined we call this transition a **birth transition**.

2) If the upstream of a transition is defined but its downstream is undefined we call this transition a **death transition**.

3) If the upstream and downstream of a transition are both defined we call this transition a **transformation**. In practice most of transitions will be of this sort.

4) We never need transitions whose upstream and downstream are undefined: these would describe agents that pop into existence and instantly disappear.

This is sort of nice, except for the fourth case. Unfortunately when I go ahead and try to actually describe a model based on this paradigm, I seem still to wind up needing to handle births, deaths and transformations quite differently.

For example, [last time](https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/) my models had a fixed set ![A](https://s0.wp.com/latex.php?latex=A&bg=ffffff&fg=333333&s=0&c=20201002) of **agents**. To handle births and deaths, I wanted to make this set time-dependent. But I need to separately say how this works for transformations, birth transitions and death transitions. For transformations we don’t change ![A.](https://s0.wp.com/latex.php?latex=A.&bg=ffffff&fg=333333&s=0&c=20201002) For birth transitions we add a new element to ![A.](https://s0.wp.com/latex.php?latex=A.&bg=ffffff&fg=333333&s=0&c=20201002) And for death transitions we remove an element from ![A,](https://s0.wp.com/latex.php?latex=A%2C&bg=ffffff&fg=333333&s=0&c=20201002) and maybe record its name on a ledger or drive a stake through its heart to make sure it can never be born again!

So far this is tolerable, but things get worse. Our model also needs ‘links’ from states to transitions, to say how agents present in those states affect the timing of those transition. These are used in the ‘jump function’, a stochastic function that answers this question:

> If at time ![t](https://s0.wp.com/latex.php?latex=t&bg=ffffff&fg=333333&s=0&c=20201002) agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) arrives at the state upstream to some transition ![e,](https://s0.wp.com/latex.php?latex=e%2C&bg=ffffff&fg=333333&s=0&c=20201002) and the agents at states linked to the transition ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) form some set ![S_e,](https://s0.wp.com/latex.php?latex=S_e%2C&bg=ffffff&fg=333333&s=0&c=20201002) when will agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) make the transition ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) given that it doesn’t do anything else first?

This works fine for transformations, meaning transitions ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) that have both an upstream and downstream state. It works just a tiny bit differently for death transitions. But birth transitions are quite different: since newly born agents don’t have a previous upstream state ![u(e)](https://s0.wp.com/latex.php?latex=u%28e%29&bg=ffffff&fg=333333&s=0&c=20201002), they don’t have a time at which they arrived at that state.

Perhaps this is just how modeling works: perhaps the search for a staggeringly beautiful framework is a distraction. But another approach just occurred to me. Today I just want to briefly state it. I don’t want to write a full blog article on it yet, since I’ve already spent a lot of time writing two articles that I deleted when I became disgusted with them—and I might become disgusted with this approach too!

Briefly, this approach is exactly the approach I described [last time](https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/). There are fundamentally no births and no deaths: all transitions have an upstream and a downstream state. There is a fixed set ![A](https://s0.wp.com/latex.php?latex=A&bg=ffffff&fg=333333&s=0&c=20201002) of agents that does not change with time. We handle births and deaths using a dirty trick.

Namely, births are transitions out of a ‘unborn’ state. Agents hang around in this state until they are born.

Similarly, deaths are transitions to a ‘dead’ state.

There can be multiple ‘unborn’ states and ‘dead’ states. Having multiple unborn states makes it easy to have agents with different characteristics enter the model. Having multiple dead states makes it easy for us to keep tallies of different causes of death. We should make the unborn states distinct from the dead states to prevent ‘reincarnation’—that is, the birth of a new agent that happens to equal an agent that previously died.

I’m hoping that when we proceed this way, we can shoehorn birth and death processes into the framework described last time, without really needing to modify it at all! All we’re doing is exploiting it in a new way.

Here’s one possible problem: if we start with a finite number of agents in the ‘unborn’ states, the population of agents can’t grow indefinitely! But this doesn’t seem very dire. For most agent-based models we don’t feel a need to let the number of agents grow arbitrarily large. Or we can relax the requirement that the set of agents is finite, and put an infinite number of agents ![u_1, u_2, u_3, \dots](https://s0.wp.com/latex.php?latex=u_1%2C+u_2%2C+u_3%2C+%5Cdots&bg=ffffff&fg=333333&s=0&c=20201002) in an unborn state. This can be done without using an infinite amount of memory: it’s a ‘potential infinity’ rather than an ‘actual infinity’.

There could be other problems. So I’ll post this now before I think of them.