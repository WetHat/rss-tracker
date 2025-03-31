---
role: rssitem
author: "John Baez"
published: 2024-02-28T21:09:29.000Z
link: https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/
id: "http://johncarlosbaez.wordpress.com/?p=37547"
feed: "[[Azimuth]]"
tags: [rss/computer_science,rss/epidemiology,rss/mathematics]
pinned: false
---

> [!abstract] Agent-Based Models (Part 7) by John Baez - 2024-02-28T21:09:29.000Z
> ![image|float:right|400](https://johncarlosbaez.files.wordpress.com/2023/07/state_diagram.png) Last time I presented a simple, limited class of agent-based models where each agent independently hops around a graph. I wrote: Today the probability for an agent to hop from one vertex of the graph to another by going along some edge will be determined the moment the agent arrives at that vertex. It will ［…］

🌐 Read article [online](https://johncarlosbaez.wordpress.com/2024/02/28/agent-based-models-part-7/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Agent-Based Models (Part 7)]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
[Last time](https://johncarlosbaez.wordpress.com/2024/02/21/agent-based-models-part-6/) I presented a simple, limited class of agent-based models where each agent independently hops around a graph. I wrote:

> Today the probability for an agent to hop from one vertex of the graph to another by going along some edge will be determined the moment the agent arrives at that vertex. It will depend only on the agent and the various edges leaving that vertex. Later I’ll want this probability to depend on other things too—like whether other agents are at some vertex or other. When we do that, we’ll need to keep updating this probability as the other agents move around.

Let me try to figure out that generalization now.

Last time I discovered something surprising to me. To describe it, let’s bring in some jargon. The conditional probability per time of an agent making a transition from its current state to a chosen other state (given that it doesn’t make some _other_ transition) is called the **hazard function** of that transition. In a **Markov process**, the hazard function is actually a constant, independent of how long the agent has been in its current state. In a **semi-Markov process**, the hazard function is a function only of how long the agent has been in its current state.

For example, people like to describe radioactive decay using a Markov process, since experimentally it doesn’t seem that ‘old’ radioactive atoms decay at a higher or lower rate than ‘young’ ones. (Quantum theory says this can’t be exactly true, but nobody has seen deviations yet.) On the other hand, the death rate of people is highly non-Markovian, but we might try to describe it using a semi-Markov process. Shortly after birth it’s high—that’s called ‘infant mortality’. Then it goes down, and then it gradually increases.

We definitely want to our agent-based processes to have the ability to describe semi-Markov processes. What surprised me last time is that I could do it without explicitly keeping track of how long the agent has been in its current state, or when it entered its current state!

The reason is that we can decide which state an agent will transition to next, and when, as soon as it enters its current state. This decision is random, of course. But using random number generators we can make this decision the moment the agent enters the given state—because there is nothing more to be learned by waiting! I described an algorithm for doing this.

I’m sure this is well-known, but I had fun rediscovering it.

But today I want to allow the hazard function for a given agent to make a given transition to depend on the states of other agents. In this case, if some _other_ agent randomly changes state, we will need to recompute _our_ agent’s hazard function. There is probably no computationally feasible way to avoid this, in general. In some analytically solvable models there might be—but we’re simulating systems precisely because we don’t know how to solve them analytically.

So now we’ll want to keep track of the **residence time** of each agent—that is, how long it’s been in its current state. But William Waites pointed out a clever way to do this: it’s cheaper to keep track of the agent’s **arrival time**, i.e. when it entered its current state. This way you don’t need to keep updating the residence time. Whenever you need to know the residence time, you can just subtract the arrival time from the current clock time.

Even more importantly, our model should now have ‘informational links’ from states to transitions. If we want the presence or absence of agents in some state to affect the hazard function of some transition, we should draw a ‘link’ from that state to that transition! Of course you could say that anything is allowed to affect anything else. But this would create an undisciplined mess where you can’t keep track of the chains of causation. So we want to see explicit ‘links’.

So, here’s my new modeling approach, which generalizes the one we saw last time. For starters, a model should have:

• a finite set ![V](https://s0.wp.com/latex.php?latex=V&bg=ffffff&fg=333333&s=0&c=20201002) of **vertices** or **states**,

• a finite set ![E](https://s0.wp.com/latex.php?latex=E&bg=ffffff&fg=333333&s=0&c=20201002) of **edges** or **transitions**,

• maps ![u, d \colon E \to V](https://s0.wp.com/latex.php?latex=u%2C+d+%5Ccolon+E+%5Cto+V&bg=ffffff&fg=333333&s=0&c=20201002) mapping each edge to its source and target, also called its **upstream** and **downstream**,

• finite set ![A](https://s0.wp.com/latex.php?latex=A&bg=ffffff&fg=333333&s=0&c=20201002) of **agents**,

• a finite set ![L](https://s0.wp.com/latex.php?latex=L&bg=ffffff&fg=333333&s=0&c=20201002) of **links**,

• maps ![s \colon L \to V](https://s0.wp.com/latex.php?latex=s+%5Ccolon+L+%5Cto+V&bg=ffffff&fg=333333&s=0&c=20201002) and ![t \colon L \to E](https://s0.wp.com/latex.php?latex=t+%5Ccolon+L+%5Cto+E&bg=ffffff&fg=333333&s=0&c=20201002) mapping each link to its **source** (a state) and its **target** (a transition).

All of this stuff, except for the set of agents, is exactly what we had in our earlier paper on stock-flow models, where we treated people _en masse_ instead of as individual agents. You can see this in Section 2.1 here:

• John Baez, Xiaoyan Li, Sophie Libkind, Nathaniel D. Osgood, Evan Patterson, [Compositional modeling with stock and flow models](https://arxiv.org/abs/2205.08373).

So, I’m trying to copy that paradigm, and eventually unify the two paradigms as much as possible.

But they’re different! In particular, our agent-based models will need a ‘jump function’. This says when each agent ![a \in A](https://s0.wp.com/latex.php?latex=a+%5Cin+A&bg=ffffff&fg=333333&s=0&c=20201002) will undergo a transition ![e \in E](https://s0.wp.com/latex.php?latex=e+%5Cin+E&bg=ffffff&fg=333333&s=0&c=20201002) if it arrives at the state upstream to that transition at a specific time ![t \in \mathbb{R}.](https://s0.wp.com/latex.php?latex=t+%5Cin+%5Cmathbb%7BR%7D.&bg=ffffff&fg=333333&s=0&c=20201002) This jump function will not be deterministic: it will be a _stochastic_ function, just as it was in [yesterday’s formalism](https://johncarlosbaez.wordpress.com/2024/02/21/agent-based-models-part-6/). But today it will depend on more things! Yesterday it depended only on ![a, e](https://s0.wp.com/latex.php?latex=a%2C+e&bg=ffffff&fg=333333&s=0&c=20201002) and ![t.](https://s0.wp.com/latex.php?latex=t.&bg=ffffff&fg=333333&s=0&c=20201002) But now the links will come into play.

For each transition ![e \in E](https://s0.wp.com/latex.php?latex=e+%5Cin+E&bg=ffffff&fg=333333&s=0&c=20201002), there is set of links whose target is that transition, namely

![t^{-1}(e) = \{\ell \in L \; \vert \; t(\ell) = e \} ](https://s0.wp.com/latex.php?latex=t%5E%7B-1%7D%28e%29+%3D+%5C%7B%5Cell+%5Cin+L+%5C%3B+%5Cvert+%5C%3B+t%28%5Cell%29+%3D+e+%5C%7D+&bg=ffffff&fg=333333&s=0&c=20201002)

Each link in ![\ell \in  t^{-1}(e)](https://s0.wp.com/latex.php?latex=%5Cell+%5Cin++t%5E%7B-1%7D%28e%29&bg=ffffff&fg=333333&s=0&c=20201002) will have one state ![v](https://s0.wp.com/latex.php?latex=v&bg=ffffff&fg=333333&s=0&c=20201002) as its source. We say this state **affects** the transition ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) **via** the link ![\ell.](https://s0.wp.com/latex.php?latex=%5Cell.&bg=ffffff&fg=333333&s=0&c=20201002)

We want the jump function for the transition ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) to depend on the presence or absence of agents in each state that affects this transition.

Which agents are in a given state? Well, it depends! But those agents will always form some subset of ![A,](https://s0.wp.com/latex.php?latex=A%2C&bg=ffffff&fg=333333&s=0&c=20201002) and thus an element of ![2^A.](https://s0.wp.com/latex.php?latex=2%5EA.&bg=ffffff&fg=333333&s=0&c=20201002) So, we want the jump function for the transition ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) to depend on an element of

![\prod_{\ell \in t^{-1}(e)} 2^A = 2^{A \times t^{-1}(e)} ](https://s0.wp.com/latex.php?latex=%5Cprod_%7B%5Cell+%5Cin+t%5E%7B-1%7D%28e%29%7D+2%5EA+%3D+2%5E%7BA+%5Ctimes+t%5E%7B-1%7D%28e%29%7D+&bg=ffffff&fg=333333&s=0&c=20201002)

I’ll call this element ![S_e.](https://s0.wp.com/latex.php?latex=S_e.&bg=ffffff&fg=333333&s=0&c=20201002) And as mentioned earlier, the jump function will also depend on a choice of agent ![a \in A](https://s0.wp.com/latex.php?latex=a+%5Cin+A&bg=ffffff&fg=333333&s=0&c=20201002) and on the _arrival time_ of the agent ![a.](https://s0.wp.com/latex.php?latex=a.&bg=ffffff&fg=333333&s=0&c=20201002)

So, we’ll say there’s a jump function ![j_e](https://s0.wp.com/latex.php?latex=j_e&bg=ffffff&fg=333333&s=0&c=20201002) for each transition ![e,](https://s0.wp.com/latex.php?latex=e%2C&bg=ffffff&fg=333333&s=0&c=20201002) which is a stochastic function

![j_e \colon A \times 2^{A \times t^{-1}(e)} \times \mathbb{R} \rightsquigarrow \mathbb{R} ](https://s0.wp.com/latex.php?latex=j_e+%5Ccolon+A+%5Ctimes+2%5E%7BA+%5Ctimes+t%5E%7B-1%7D%28e%29%7D+%5Ctimes+%5Cmathbb%7BR%7D+%5Crightsquigarrow+%5Cmathbb%7BR%7D+&bg=ffffff&fg=333333&s=0&c=20201002)

The idea, then, is that ![j_e(a, S_e, t)](https://s0.wp.com/latex.php?latex=j_e%28a%2C+S_e%2C+t%29&bg=ffffff&fg=333333&s=0&c=20201002) is the answer to this question:

> **If at time ![t](https://s0.wp.com/latex.php?latex=t&bg=ffffff&fg=333333&s=0&c=20201002) agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) arrived at the vertex ![u(e),](https://s0.wp.com/latex.php?latex=u%28e%29%2C&bg=ffffff&fg=333333&s=0&c=20201002) and the agents at states linked to the edge ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) are described by the set ![S_e,](https://s0.wp.com/latex.php?latex=S_e%2C&bg=ffffff&fg=333333&s=0&c=20201002) when will agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) move along the edge ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) to the vertex ![d(e),](https://s0.wp.com/latex.php?latex=d%28e%29%2C&bg=ffffff&fg=333333&s=0&c=20201002) given that it doesn’t do anything else first?**

The answer to this question can keep changing as agents other than ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) move around, since the set ![S_e](https://s0.wp.com/latex.php?latex=S_e&bg=ffffff&fg=333333&s=0&c=20201002) can keep changing. This is the big difference between today’s formalism and yesterday’s.

Here’s how we run our model. At every moment in time we keep track of some information about each agent ![a \in A,](https://s0.wp.com/latex.php?latex=a+%5Cin+A%2C&bg=ffffff&fg=333333&s=0&c=20201002) namely:

• Which vertex is it at now? We call this vertex the agent’s **state**, ![\sigma(a).](https://s0.wp.com/latex.php?latex=%5Csigma%28a%29.&bg=ffffff&fg=333333&s=0&c=20201002)

• When did it arrive at this vertex? We call this time the agent’s **arrival time**, ![\alpha(a).](https://s0.wp.com/latex.php?latex=%5Calpha%28a%29.&bg=ffffff&fg=333333&s=0&c=20201002)

• For each edge ![e](https://s0.wp.com/latex.php?latex=e&bg=ffffff&fg=333333&s=0&c=20201002) whose upstream is ![\sigma(a),](https://s0.wp.com/latex.php?latex=%5Csigma%28a%29%2C&bg=ffffff&fg=333333&s=0&c=20201002) when will agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) move along this edge if it doesn’t do anything else first? Call this time ![T(a,e).](https://s0.wp.com/latex.php?latex=T%28a%2Ce%29.&bg=ffffff&fg=333333&s=0&c=20201002)

I need to explain how we keep updating these pieces of information (supposing we already have them). Let’s assume that at some moment in time ![t_i](https://s0.wp.com/latex.php?latex=t_i&bg=ffffff&fg=333333&s=0&c=20201002) an agent makes a transition. More specifically, suppose agent ![\underline{a} \in A](https://s0.wp.com/latex.php?latex=%5Cunderline%7Ba%7D+%5Cin+A&bg=ffffff&fg=333333&s=0&c=20201002) makes a transition ![\underline{e}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Be%7D&bg=ffffff&fg=333333&s=0&c=20201002) from the state

![\underline{v} = u(\underline{e}) \in V](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D+%3D+u%28%5Cunderline%7Be%7D%29+%5Cin+V&bg=ffffff&fg=333333&s=0&c=20201002)

to the state

![\underline{v}' = d(\underline{e}) \in V.](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D%27+%3D+d%28%5Cunderline%7Be%7D%29+%5Cin+V.&bg=ffffff&fg=333333&s=0&c=20201002)

At this moment we update the following information:

1) We set

![\alpha(\underline{a}) := t_i](https://s0.wp.com/latex.php?latex=%5Calpha%28%5Cunderline%7Ba%7D%29+%3A%3D+t_i&bg=ffffff&fg=333333&s=0&c=20201002)

(So, we update the arrival time of that agent.)

2) We set

![\sigma(\underline{a}) := \underline{v}'](https://s0.wp.com/latex.php?latex=%5Csigma%28%5Cunderline%7Ba%7D%29+%3A%3D+%5Cunderline%7Bv%7D%27&bg=ffffff&fg=333333&s=0&c=20201002)

(So, we update the state of that agent.)

3) We recompute the subset of agents in the state ![\underline{v}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D&bg=ffffff&fg=333333&s=0&c=20201002) (by removing ![\underline{a}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Ba%7D&bg=ffffff&fg=333333&s=0&c=20201002) from this subset) and in the state ![\underline{v}'](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D%27&bg=ffffff&fg=333333&s=0&c=20201002) (by adding ![\underline{a}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Ba%7D&bg=ffffff&fg=333333&s=0&c=20201002) to this subset).

4) For every transition ![f](https://s0.wp.com/latex.php?latex=f&bg=ffffff&fg=333333&s=0&c=20201002) that’s affected by the state ![\underline{v}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D&bg=ffffff&fg=333333&s=0&c=20201002) or the state ![\underline{v}'](https://s0.wp.com/latex.php?latex=%5Cunderline%7Bv%7D%27&bg=ffffff&fg=333333&s=0&c=20201002), and for every agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) in the upstream state of that transition, we set

![T(a,f) := j_f(a, S_f, \alpha(a))](https://s0.wp.com/latex.php?latex=T%28a%2Cf%29+%3A%3D+j_f%28a%2C+S_f%2C+%5Calpha%28a%29%29&bg=ffffff&fg=333333&s=0&c=20201002)

where ![S_f](https://s0.wp.com/latex.php?latex=S_f&bg=ffffff&fg=333333&s=0&c=20201002) is the element of ![2^{A \times t^{-1}(f)}](https://s0.wp.com/latex.php?latex=2%5E%7BA+%5Ctimes+t%5E%7B-1%7D%28f%29%7D&bg=ffffff&fg=333333&s=0&c=20201002) saying which subset of agents is in each state affecting the transition ![f.](https://s0.wp.com/latex.php?latex=f.&bg=ffffff&fg=333333&s=0&c=20201002) (So, we update our table of times at which agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) will make the transition ![f,](https://s0.wp.com/latex.php?latex=f%2C&bg=ffffff&fg=333333&s=0&c=20201002) given that it doesn’t do anything else first.)

Now we need to compute the next time at which something happens, namely ![t_{i+1}.](https://s0.wp.com/latex.php?latex=t_%7Bi%2B1%7D.&bg=ffffff&fg=333333&s=0&c=20201002) And we need to compute what actually happens then!

To do this, we look through our table of times ![T(a,e)](https://s0.wp.com/latex.php?latex=T%28a%2Ce%29&bg=ffffff&fg=333333&s=0&c=20201002) for each agent ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) and all transitions out of the state that agent is in. and see which time is smallest. If there’s a tie, break it. Then we reset ![\underline{a}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Ba%7D&bg=ffffff&fg=333333&s=0&c=20201002) and ![\underline{e}](https://s0.wp.com/latex.php?latex=%5Cunderline%7Be%7D&bg=ffffff&fg=333333&s=0&c=20201002) to be the agent-edge pair that minimizes ![T(a,e).](https://s0.wp.com/latex.php?latex=T%28a%2Ce%29.&bg=ffffff&fg=333333&s=0&c=20201002)

5) We set

![t_{i+1} := T(\underline{a},\underline{e})](https://s0.wp.com/latex.php?latex=t_%7Bi%2B1%7D+%3A%3D+T%28%5Cunderline%7Ba%7D%2C%5Cunderline%7Be%7D%29&bg=ffffff&fg=333333&s=0&c=20201002)

Then we loop back around to step 1), but with ![i+1](https://s0.wp.com/latex.php?latex=i%2B1&bg=ffffff&fg=333333&s=0&c=20201002) replacing ![i.](https://s0.wp.com/latex.php?latex=i.&bg=ffffff&fg=333333&s=0&c=20201002)

Whew! I hope you followed that. If not, please ask questions.