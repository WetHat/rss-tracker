---
author: "John Baez"
published: 2024-05-13T18:23:03.000Z
link: https://johncarlosbaez.wordpress.com/2024/05/13/agent-based-models-part-9/
id: http://johncarlosbaez.wordpress.com/?p=37840
feed: "Azimuth"
tags: [rss/computer_science,rss/epidemiology,rss/mathematics]
pinned: false
---
> [!abstract] Agent-Based Models (Part 9) by John Baez - 2024-05-13T18:23:03.000Z
> Since May 1st, Kris Brown, Nathaniel Osgood, Xiaoyan Li, William Waites and I have been meeting daily in James Clerk Maxwell’s childhood home in Edinburgh. We’re hard at work on our project called New Mathematics and Software for Agent-Based models. It’s impossible to explain everything we’re doing while it’s happening. But I want to record […]
>
> ![image](https://johncarlosbaez.files.wordpress.com/2023/07/state_diagram.png)

🔗Read article [online](https://johncarlosbaez.wordpress.com/2024/05/13/agent-based-models-part-9/). For other items in this feed see [[Azimuth]].

- [ ] [[Agent-Based Models (Part 9)]]
- - -
Since May 1st, [Kris Brown](https://www.krisb.org/docs/research), [Nathaniel Osgood](https://www.cs.usask.ca/faculty/osgood/), [Xiaoyan Li](https://scholar.google.ca/citations?user=55dzbRgAAAAJ&hl=en), [William Waites](https://scholar.google.com/citations?user=eayiEiwAAAAJ&hl=en) and I have been meeting daily in James Clerk Maxwell’s childhood home in Edinburgh.

[![](https://johncarlosbaez.files.wordpress.com/2024/05/1200px-maxwellsequations-1860-1871.jpg?w=450&h=298)](https://johncarlosbaez.files.wordpress.com/2024/05/1200px-maxwellsequations-1860-1871.jpg)

We’re hard at work on our project called [New Mathematics and Software for Agent-Based models](https://johncarlosbaez.wordpress.com/2023/08/17/agent-based-models-part-2/). It’s impossible to explain everything we’re doing while it’s happening. But I want to record some of our work. So please pardon how I skim through a bunch of already known ideas in my desperate attempt to quickly reach the main point. I’ll try to make up for this by giving lots of references.

Today I’ll talk about an interesting class of models we have developed together with Sean Wu. We call them ‘stochastic _C_-set rewriting systems’. They’re just part of our overall framework, but they’re an important part.

In this sort of model time is continuous, the state of the world is described by discrete data, and the state changes stochastically at discrete moments in time. All _those_ features are already present in the class of models I described in [Part 7](https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/). But today’s models are far more general, because the state of the world is described in a more general way! Now the state of the world at any moment of time is a **_C_-set**: a functor

![f \colon C \to \mathsf{Set} ](https://s0.wp.com/latex.php?latex=f+%5Ccolon+C+%5Cto+%5Cmathsf%7BSet%7D+&bg=ffffff&fg=333333&s=0&c=20201002)

for some fixed finitely presented category _C_ to the category of sets.

_C_-sets are a flexible generalization of directed graphs. For example, a thing like this is a _C_-set for an appropriate choice of _C_:

![](https://i0.wp.com/math.ucr.edu/home/baez/networks/catalysts/petri_marking_1.png)

There are also _C_-sets that look even less like graphs.

_C_-sets have been implemented in [AlgebraicJulia](https://www.algebraicjulia.org/), a software framework for doing scientific computation with categories. To learn more, start here:

• Evan Patterson, [Graphs and C-sets I: What is a graph?](https://blog.algebraicjulia.org/post/2020/09/cset-graphs-1/), _AlgebraicJulia Blog_, 1 September 2020.

There’s a [lot more](https://blog.algebraicjulia.org/index.html#category=c-sets) on this blog explaining things you can do with _C_-sets, and how they’re implemented in AlgebraicJulia. We plan to take advantage of all this stuff!

In particular, we’ll use ‘double pushout rewriting’ to specify rules for how a _C_-set can change with time. If you’re not familiar with this concept, start here:

• nLab, [Double pushout rewriting](https://ncatlab.org/nlab/show/span+rewriting#double_pushout_rewriting).

This concept is well-understood (by those who understand it well), so I’ll just roughly sketch it. In double pushout rewriting for _C_-sets, a **rewrite rule** is a diagram of _C_-sets

![L \stackrel{\ell}{\hookleftarrow} I \stackrel{r}{\to} R](https://s0.wp.com/latex.php?latex=L+%5Cstackrel%7B%5Cell%7D%7B%5Chookleftarrow%7D+I+%5Cstackrel%7Br%7D%7B%5Cto%7D+R&bg=ffffff&fg=333333&s=0&c=20201002)

To apply this rewrite rule to a _C_-set _S_, we find inside that _C_-set an instance of the pattern _L_, called a ‘match’, and replace it with the pattern _R_. These ‘patterns’ are themselves _C_-sets. The _C_-set _I_ can be thought of as the common part of _L_ and _I_. The maps ![\ell](https://s0.wp.com/latex.php?latex=%5Cell&bg=ffffff&fg=333333&s=0&c=20201002) and ![r](https://s0.wp.com/latex.php?latex=r&bg=ffffff&fg=333333&s=0&c=20201002) tell us how this common part fits into _L_ and _R_.

Note that in this incredibly sketchy explanation I am already starting to use maps between _C_-sets! Indeed, for each category _C_ there’s a category called ![C\mathsf{Set}](https://s0.wp.com/latex.php?latex=C%5Cmathsf%7BSet%7D&bg=ffffff&fg=333333&s=0&c=20201002) with:

• functors ![f \colon C \to \mathsf{Set} ](https://s0.wp.com/latex.php?latex=f+%5Ccolon+C+%5Cto+%5Cmathsf%7BSet%7D+&bg=ffffff&fg=333333&s=0&c=20201002) as objects: we call these **_C_-sets**;

• natural transformations between such functors as morphisms: we call these **_C_-set maps**.

This sort of category has been intensively studied for many decades, and there’s a huge amount we can do with them:

• nLab, [Category of presheaves](https://ncatlab.org/nlab/show/category+of+presheaves#definition).

I used _C_-set maps in a couple of places above. First, the arrows here

![L \stackrel{\ell}{\hookleftarrow} I \stackrel{r}{\to} R](https://s0.wp.com/latex.php?latex=L+%5Cstackrel%7B%5Cell%7D%7B%5Chookleftarrow%7D+I+%5Cstackrel%7Br%7D%7B%5Cto%7D+R&bg=ffffff&fg=333333&s=0&c=20201002)

are _C_-set maps. For slightly technical reasons we demand that ![\ell](https://s0.wp.com/latex.php?latex=%5Cell&bg=ffffff&fg=333333&s=0&c=20201002) be [monic](https://en.wikipedia.org/wiki/Monomorphism): that’s why I drew it with a hooked arrow. Second, I introduced the term ‘match’ without defining it. But we can define it: a **match** of _L_ to a _C_-set _S_ is simply a _C_-set map

![L \to S](https://s0.wp.com/latex.php?latex=L+%5Cto+S&bg=ffffff&fg=333333&s=0&c=20201002)

And now for some good news: Kris Brown has already implemented double pushout rewriting for _C_-sets in AlgebraicJulia:

• Github, [AlgebraicRewriting.jl](https://github.com/AlgebraicJulia/AlgebraicRewriting.jl).

### Stochastic _C_-set rewriting systems

Now comes the main idea I want to explain.

A **stochastic _C_-set rewriting system** consists of:

1) a category _C_

2) a finite collection of rewrite rules

![\rho_i = \left( L_i \stackrel{\ell_i}{\hookleftarrow} I_i \stackrel{r_i}{\to} R_i \right)](https://s0.wp.com/latex.php?latex=%5Crho_i+%3D+%5Cleft%28+L_i+%5Cstackrel%7B%5Cell_i%7D%7B%5Chookleftarrow%7D+I_i+%5Cstackrel%7Br_i%7D%7B%5Cto%7D+R_i+%5Cright%29&bg=ffffff&fg=333333&s=0&c=20201002)

3) for each rewrite rule ![\rho_i](https://s0.wp.com/latex.php?latex=%5Crho_i&bg=ffffff&fg=333333&s=0&c=20201002) in our collection, a **timer** ![T_i.](https://s0.wp.com/latex.php?latex=T_i.&bg=ffffff&fg=333333&s=0&c=20201002) This is a stochastic map

![T_i \colon [0,\infty) \to [0,\infty] ](https://s0.wp.com/latex.php?latex=T_i+%5Ccolon+%5B0%2C%5Cinfty%29+%5Cto+%5B0%2C%5Cinfty%5D+&bg=ffffff&fg=333333&s=0&c=20201002)

That’s all.

What does this do for us? First, it means that for each choice of rewrite rule ![\rho_i](https://s0.wp.com/latex.php?latex=%5Crho_i&bg=ffffff&fg=333333&s=0&c=20201002) in our collection, and for each so-called **start time** ![t \ge 0,](https://s0.wp.com/latex.php?latex=t+%5Cge+0%2C&bg=ffffff&fg=333333&s=0&c=20201002) we get a probability measure ![T_i(t)](https://s0.wp.com/latex.php?latex=T_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) on ![[0,\infty].](https://s0.wp.com/latex.php?latex=%5B0%2C%5Cinfty%5D.&bg=ffffff&fg=333333&s=0&c=20201002)

Let’s write ![w_i(t)](https://s0.wp.com/latex.php?latex=w_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) to mean a randomly chosen element of ![[0,\infty]](https://s0.wp.com/latex.php?latex=%5B0%2C%5Cinfty%5D&bg=ffffff&fg=333333&s=0&c=20201002) distributed according to the probability measure ![T_i(t).](https://s0.wp.com/latex.php?latex=T_i%28t%29.&bg=ffffff&fg=333333&s=0&c=20201002) We call ![w_i(t)](https://s0.wp.com/latex.php?latex=w_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) the **wait time**, because it says how long after time ![t](https://s0.wp.com/latex.php?latex=t&bg=ffffff&fg=333333&s=0&c=20201002) we should wait until we apply the rewrite rule ![\rho_i.](https://s0.wp.com/latex.php?latex=%5Crho_i.&bg=ffffff&fg=333333&s=0&c=20201002) The time

![t + w_i(t) ](https://s0.wp.com/latex.php?latex=t+%2B+w_i%28t%29+&bg=ffffff&fg=333333&s=0&c=20201002)

is called the **rewrite time.**

In what follows, I’ll always assume these randomly chosen numbers ![w_i(t)](https://s0.wp.com/latex.php?latex=w_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) are stochastically independent—even if we reuse the same timer repeatedly for different tasks.

### Running a stochastic _C_-set rewriting system

Okay, so how do we actually use this for modeling? How do we ‘run’ a context-independent stochastic _C_-set rewriting system? I’ll sketch it out.

The idea is that at any time ![t \ge 0,](https://s0.wp.com/latex.php?latex=t+%5Cge+0%2C&bg=ffffff&fg=333333&s=0&c=20201002) the state of the world is some _C_-set, say ![S_t.](https://s0.wp.com/latex.php?latex=S_t.&bg=ffffff&fg=333333&s=0&c=20201002) If you give me the initial state of the world ![S_0,](https://s0.wp.com/latex.php?latex=S_0%2C&bg=ffffff&fg=333333&s=0&c=20201002) the stochastic _C_-set rewriting system will tell you how to compute the state of the world at all later times. But this computation involves randomness.

Here’s how it works:

We start at ![t = 0.](https://s0.wp.com/latex.php?latex=t+%3D+0.&bg=ffffff&fg=333333&s=0&c=20201002) We look for all matches to patterns ![L_i](https://s0.wp.com/latex.php?latex=L_i&bg=ffffff&fg=333333&s=0&c=20201002) in the initial state ![S_0.](https://s0.wp.com/latex.php?latex=S_0.&bg=ffffff&fg=333333&s=0&c=20201002) For each match we compute a wait time ![w_i(t) \in [0,\infty]](https://s0.wp.com/latex.php?latex=w_i%28t%29+%5Cin+%5B0%2C%5Cinfty%5D&bg=ffffff&fg=333333&s=0&c=20201002) and then the rewrite time ![t + w_i(t),](https://s0.wp.com/latex.php?latex=t+%2B+w_i%28t%29%2C&bg=ffffff&fg=333333&s=0&c=20201002) but right now ![t = 0.](https://s0.wp.com/latex.php?latex=t+%3D+0.&bg=ffffff&fg=333333&s=0&c=20201002) We make a table of all the matches and their rewrite times.

The smallest of the rewrite times in our table, say ![0 + w_j(0),](https://s0.wp.com/latex.php?latex=0+%2B+w_j%280%29%2C&bg=ffffff&fg=333333&s=0&c=20201002) is the first time the state of the world can change. We change it by applying the rewrite rule ![\rho_j](https://s0.wp.com/latex.php?latex=%5Crho_j&bg=ffffff&fg=333333&s=0&c=20201002) to the state of the world ![S_0.](https://s0.wp.com/latex.php?latex=S_0.&bg=ffffff&fg=333333&s=0&c=20201002) When we do this, we cross off the rewrite time ![0 + w_j(0)](https://s0.wp.com/latex.php?latex=0+%2B+w_j%280%29&bg=ffffff&fg=333333&s=0&c=20201002) and its corresponding match from our table.

More generally, suppose ![t](https://s0.wp.com/latex.php?latex=t&bg=ffffff&fg=333333&s=0&c=20201002) is _any_ time when the state of the world changes. It will have changed by applying some rewrite rule ![\rho_j](https://s0.wp.com/latex.php?latex=%5Crho_j&bg=ffffff&fg=333333&s=0&c=20201002) to the previous state of the world, giving some new _C_-set ![S_t.](https://s0.wp.com/latex.php?latex=S_t.&bg=ffffff&fg=333333&s=0&c=20201002)

When this happens, new matches can appear, and existing matches can disappear. So we do this:

1) For each existing match that disappears, we cross off that match and its rewrite time from our table.

2) For each new match that appears, say one involving the rewrite rule ![\rho_i,](https://s0.wp.com/latex.php?latex=%5Crho_i%2C&bg=ffffff&fg=333333&s=0&c=20201002) we add that match and its rewrite time ![t + w_i(t)](https://s0.wp.com/latex.php?latex=t+%2B+w_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) to our table.

We then wait until the smallest rewrite time in our table, say ![t'.](https://s0.wp.com/latex.php?latex=t%27.&bg=ffffff&fg=333333&s=0&c=20201002) At that time, we apply the corresponding rewrite rule to the state ![S_t](https://s0.wp.com/latex.php?latex=S_t&bg=ffffff&fg=333333&s=0&c=20201002), getting some new _C_-set ![S_{t'}.](https://s0.wp.com/latex.php?latex=S_%7Bt%27%7D.&bg=ffffff&fg=333333&s=0&c=20201002) We also cross off the rewrite time ![t'](https://s0.wp.com/latex.php?latex=t%27&bg=ffffff&fg=333333&s=0&c=20201002) and its corresponding match from our table.

Then just keep doing the loop.

### Subtleties

A lot of the subtleties in this formalism involve our use of timers.

For example, I computed wait times ![w_i(t)](https://s0.wp.com/latex.php?latex=w_i%28t%29&bg=ffffff&fg=333333&s=0&c=20201002) using a timer which is a stochastic map

![T_i \colon [0,\infty) \to [0,\infty] ](https://s0.wp.com/latex.php?latex=T_i+%5Ccolon+%5B0%2C%5Cinfty%29+%5Cto+%5B0%2C%5Cinfty%5D+&bg=ffffff&fg=333333&s=0&c=20201002)

The dependence on ![t \in [0,\infty)](https://s0.wp.com/latex.php?latex=t+%5Cin+%5B0%2C%5Cinfty%29&bg=ffffff&fg=333333&s=0&c=20201002) here means the wait time can depend on when we start the timer. And the fact that this stochastic map takes values in ![[0,\infty]](https://s0.wp.com/latex.php?latex=%5B0%2C%5Cinfty%5D&bg=ffffff&fg=333333&s=0&c=20201002) means the wait time can be _infinite_. This is a way of letting rewrite rules have a probability < 1 of ever being applied. If you don't like these features you can easily limit the formalism to avoid them.

The more serious subtleties involve whether and how to change wait times as the state of the world changes. For example, we can imagine more general timers that explicitly depend on the current state of the world as well as the time ![t \in [0,\infty).](https://s0.wp.com/latex.php?latex=t+%5Cin+%5B0%2C%5Cinfty%29.&bg=ffffff&fg=333333&s=0&c=20201002) However, in this case I am confused about how we should update our table of wait times as the state of the world changes. So I decided to postpone discussing this generalization!
