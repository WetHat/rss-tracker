---
role: rssitem
author: "John Baez"
published: 2024-05-04T15:47:17.000Z
link: https://johncarlosbaez.wordpress.com/2024/05/04/hexagonal-tiling-honeycomb/
id: "http://johncarlosbaez.wordpress.com/?p=37783"
feed: "[[Azimuth]]"
tags: [rss/mathematics]
pinned: false
---

> [!abstract] Hexagonal Tiling Honeycomb (by John Baez)
> ![image|float:right|400](https://johncarlosbaez.files.wordpress.com/2024/05/633_honeycomb_roice_bright.png) This picture by Roice Nelson shows a remarkable structure: the hexagonal tiling honeycomb. What is it? Roughly speaking, a honeycomb is a way of filling 3d space with polyhedra. The most symmetrical honeycombs are the ‘regular’ ones. For any honeycomb, we define a flag to be a chosen vertex lying on a chosen edge lying ［…］

🌐 Read article [online](https://johncarlosbaez.wordpress.com/2024/05/04/hexagonal-tiling-honeycomb/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[RSS/Feeds/Azimuth/Hexagonal Tiling Honeycomb|Hexagonal Tiling Honeycomb]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
[  
![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/{6,3,3}_honeycomb_roice_bright.png)  
](https://commons.wikimedia.org/wiki/File:H3_633_FC_boundary.png)

This picture by [Roice Nelson](http://www.roice3.org/) shows a remarkable structure: the [hexagonal tiling honeycomb](https://en.wikipedia.org/wiki/Hexagonal_tiling_honeycomb).

What is it? Roughly speaking, a [honeycomb](https://en.wikipedia.org/wiki/Honeycomb_\(geometry\)) is a way of filling 3d space with polyhedra. The most symmetrical honeycombs are the ‘regular’ ones. For any honeycomb, we define a **flag** to be a chosen vertex lying on a chosen edge lying on a chosen face lying on a chosen polyhedron. A honeycomb is **regular** if its geometrical symmetries act transitively on flags.

The most familiar regular honeycomb is the usual way of filling Euclidean space with cubes. This [cubic honeycomb](https://en.wikipedia.org/wiki/Cubic_honeycomb) is denoted by the symbol {4,3,4}, because a square has 4 edges, 3 squares meet at each corner of a cube, and 4 cubes meet along each edge of this honeycomb. We can also define regular honeycombs in hyperbolic space. For example, the [order-5 cubic honeycomb](https://en.wikipedia.org/wiki/Order-5_cubic_honeycomb) is a hyperbolic honeycomb denoted {4,3,5}, since 5 cubes meet along each edge:

[  
![](https://upload.wikimedia.org/wikipedia/commons/a/a7/H3_435_CC_center.png)  
](https://en.wikipedia.org/wiki/Order-5_cubic_honeycomb)

Coxeter showed there are [15 regular hyperbolic honeycombs](https://en.wikipedia.org/wiki/Honeycomb_\(geometry\)#Hyperbolic_honeycombs). The hexagonal tiling honeycomb is one of these. But it does not contain polyhedra of the usual sort! Instead, it contains flat Euclidean planes embedded in hyperbolic space, each plane containing the vertices of infinitely many regular hexagons. You can think of such a sheet of hexagons as a generalized polyhedron with _infinitely many_ faces. You can see a bunch of such sheets in the picture:

[  
![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/{6,3,3}_honeycomb_roice_bright.png)  
](https://commons.wikimedia.org/wiki/File:H3_633_FC_boundary.png)

The symbol for the hexagonal tiling honeycomb is {6,3,3}, because a hexagon has 6 edges, 3 hexagons meet at each corner in a plane tiled by regular hexagons, and 3 such planes meet along each edge of this honeycomb. You can see that too if you look carefully.

A flat Euclidean plane in hyperbolic space is called a [horosphere](https://en.wikipedia.org/wiki/Horosphere). Here’s a picture of a horosphere tiled with regular hexagons, yet again drawn by Roice:

[  
![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/{6,3,3}_honeycomb_one_cell_horosphere.png)  
](https://en.wikipedia.org/wiki/Horosphere)

Unlike the previous pictures, which are views from inside hyperbolic space, this uses the [Poincaré ball model](https://en.wikipedia.org/wiki/Hyperbolic_space#Models_of_hyperbolic_space) of hyperbolic space. As you can see here, a horosphere is a limiting case of a sphere in hyperbolic space, where one point of the sphere has become a ‘point at infinity’.

Be careful. A horosphere is _intrinsically_ flat, so if you draw regular hexagons on it their internal angles are

![2\pi/3 = 120^\circ](https://s0.wp.com/latex.php?latex=2%5Cpi%2F3+%3D+120%5E%5Ccirc&bg=ffffff&fg=333333&s=0&c=20201002)

as usual in Euclidean geometry. But a horosphere is not ‘totally geodesic’: straight lines in the horosphere are not geodesics in hyperbolic space! Thus, a hexagon in hyperbolic space with the same vertices as one of the hexagons in the horosphere actually bulges out from the horosphere a bit — and its internal angles are less than ![2\pi/3](https://s0.wp.com/latex.php?latex=2%5Cpi%2F3&bg=ffffff&fg=333333&s=0&c=20201002): they are

![\arccos\left(-\frac{1}{3}\right) \approx 109.47^\circ ](https://s0.wp.com/latex.php?latex=%5Carccos%5Cleft%28-%5Cfrac%7B1%7D%7B3%7D%5Cright%29+%5Capprox+109.47%5E%5Ccirc+&bg=ffffff&fg=333333&s=0&c=20201002)

This angle may be familar if you’ve studied tetrahedra. That’s because each vertex lies at the center of a regular tetrahedron, with its four nearest neighbors forming the tetrahedron’s corners.

It’s really these hexagons in hyperbolic space that are faces of the hexagonal tiling honeycomb, not those tiling the horospheres, though perhaps you can barely see the difference. This can be quite confusing until you think about a simpler example, like the difference between a cube in Euclidean 3-space and a cube drawn on a sphere in Euclidean space.

### Connection to special relativity

There’s an interesting connection between hyperbolic space, special relativity, and 2×2 matrices. You see, in special relativity, [Minkowski spacetime](https://en.wikipedia.org/wiki/Minkowski_space) is ![\mathbb{R}^4](https://s0.wp.com/latex.php?latex=%5Cmathbb%7BR%7D%5E4&bg=ffffff&fg=333333&s=0&c=20201002) equipped with the nondegenerate bilinear form

![(t,x,y,z) \cdot (t',x',y',z') = t t' - x x' - y y' - z z ](https://s0.wp.com/latex.php?latex=%28t%2Cx%2Cy%2Cz%29+%5Ccdot+%28t%27%2Cx%27%2Cy%27%2Cz%27%29+%3D+t+t%27+-+x+x%27+-+y+y%27+-+z+z+&bg=ffffff&fg=333333&s=0&c=20201002)

usually called the **Minkowski metric**. Hyperbolic space sits inside Minowski spacetime as the hyperboloid of points ![\mathbf{x} = (t,x,y,z)](https://s0.wp.com/latex.php?latex=%5Cmathbf%7Bx%7D+%3D+%28t%2Cx%2Cy%2Cz%29&bg=ffffff&fg=333333&s=0&c=20201002) with ![\mathbf{x} \cdot \mathbf{x} = 1](https://s0.wp.com/latex.php?latex=%5Cmathbf%7Bx%7D+%5Ccdot+%5Cmathbf%7Bx%7D+%3D+1&bg=ffffff&fg=333333&s=0&c=20201002) and ![t > 0.](https://s0.wp.com/latex.php?latex=t+%3E+0.&bg=ffffff&fg=333333&s=0&c=20201002) But we can also think of Minkowski spacetime as the space ![\mathfrak{h}_2(\mathbb{C})](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BC%7D%29&bg=ffffff&fg=333333&s=0&c=20201002) of 2×2 hermitian matrices, using the fact that every such matrix is of the form

![A =  \left( \begin{array}{cc} t + z & x - i y \\ x + i y & t - z \end{array} \right) ](https://s0.wp.com/latex.php?latex=A+%3D++%5Cleft%28+%5Cbegin%7Barray%7D%7Bcc%7D+t+%2B+z+%26+x+-+i+y+%5C%5C+x+%2B+i+y+%26+t+-+z+%5Cend%7Barray%7D+%5Cright%29+&bg=ffffff&fg=333333&s=0&c=20201002)

and

![\det(A) =  t^2 - x^2 - y^2 - z^2 ](https://s0.wp.com/latex.php?latex=%5Cdet%28A%29+%3D++t%5E2+-+x%5E2+-+y%5E2+-+z%5E2+&bg=ffffff&fg=333333&s=0&c=20201002)

In these terms, the **future cone** in Minkowski spacetime is the cone of positive definite hermitian matrices:

![\left\{A \in \mathfrak{h}_2(\mathbb{C}) \, \vert \, \det A > 0, \,  \mathrm{tr}(A) > 0 \right\}    ](https://s0.wp.com/latex.php?latex=%5Cleft%5C%7BA+%5Cin+%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BC%7D%29+%5C%2C+%5Cvert+%5C%2C+%5Cdet+A+%3E+0%2C+%5C%2C++%5Cmathrm%7Btr%7D%28A%29+%3E+0+%5Cright%5C%7D++++&bg=ffffff&fg=333333&s=0&c=20201002)

Sitting inside this we have the hyperboloid

![\mathcal{H} = \left\{A \in \mathfrak{h}_2(\mathbb{C}) \, \vert \, \det A = 1, \,  \mathrm{tr}(A) > 0 \right\}    ](https://s0.wp.com/latex.php?latex=%5Cmathcal%7BH%7D+%3D+%5Cleft%5C%7BA+%5Cin+%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BC%7D%29+%5C%2C+%5Cvert+%5C%2C+%5Cdet+A+%3D+1%2C+%5C%2C++%5Cmathrm%7Btr%7D%28A%29+%3E+0+%5Cright%5C%7D++++&bg=ffffff&fg=333333&s=0&c=20201002)

which is none other than **hyperbolic space**!

### Connection to the Eisenstein integers

Since the hexagonal tiling honeycomb lives inside hyperbolic space, which in turn lives inside Minkowski spacetime, we should be able to describe the hexagonal tiling honeycomb as sitting inside Minkowski spacetime. But how?

Back in 2022, James Dolan and I [conjectured such a description](https://math.ucr.edu/home/baez/conversations/minkowski_and_lattices.pdf), which takes advantage of the picture of Minkowski spacetime in terms of 2×2 matrices. And this April, [working on Mathstodon](https://mathstodon.xyz/@johncarlosbaez/112314288370075309), Greg Egan and I proved this conjecture!

I’ll just describe the basic idea here, and refer you elsewhere for details.

The [Eisenstein integers](https://en.wikipedia.org/wiki/Eisenstein_integer) ![\mathbb{E}](https://s0.wp.com/latex.php?latex=%5Cmathbb%7BE%7D&bg=ffffff&fg=333333&s=0&c=20201002) are the complex numbers of the form

![a + b \omega](https://s0.wp.com/latex.php?latex=a+%2B+b+%5Comega&bg=ffffff&fg=333333&s=0&c=20201002)

where ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) and ![b](https://s0.wp.com/latex.php?latex=b&bg=ffffff&fg=333333&s=0&c=20201002) are integers and ![\omega = \exp(2 \pi i/3)](https://s0.wp.com/latex.php?latex=%5Comega+%3D+%5Cexp%282+%5Cpi+i%2F3%29&bg=ffffff&fg=333333&s=0&c=20201002) is a cube root of 1. The Eisenstein integers are closed under addition, subtraction and multiplication, and they form a lattice in the complex numbers:

![](https://math.ucr.edu/home/baez/mathematical/eisenstein_integers.png)

Similarly, the set ![\mathfrak{h}_2(\mathbb{E})](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29&bg=ffffff&fg=333333&s=0&c=20201002) of 2×2 hermitian matrices with Eisenstein integer entries gives a lattice in Minkowski spacetime, since we can describe Minkowski spacetime as ![\mathfrak{h}_2(\mathbb{C}).](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BC%7D%29.&bg=ffffff&fg=333333&s=0&c=20201002)

Here’s the conjecture:

**Conjecture.** The points in the lattice ![\mathfrak{h}_2(\mathbb{E})](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29&bg=ffffff&fg=333333&s=0&c=20201002) that lie on the hyperboloid ![\mathcal{H}](https://s0.wp.com/latex.php?latex=%5Cmathcal%7BH%7D&bg=ffffff&fg=333333&s=0&c=20201002) are the centers of hexagons in a hexagonal tiling honeycomb.

Using known results, it’s relatively easy to show that there’s a hexagonal tiling honeycomb whose hexagon centers are all points in ![\mathfrak{h}_2(\mathbb{E}) \cap \mathcal{H}.](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29+%5Ccap+%5Cmathcal%7BH%7D.&bg=ffffff&fg=333333&s=0&c=20201002) The hard part is showing that every point in ![\mathfrak{h}_2(\mathbb{E}) \cap \mathcal{H}](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29+%5Ccap+%5Cmathcal%7BH%7D&bg=ffffff&fg=333333&s=0&c=20201002) is a hexagon center. Points in ![\mathfrak{h}_2(\mathbb{E}) \cap \mathcal{H}](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29+%5Ccap+%5Cmathcal%7BH%7D&bg=ffffff&fg=333333&s=0&c=20201002) are the same as 4-tuples of integers obeying an inequality (the ![\mathrm{tr}(A) > 0](https://s0.wp.com/latex.php?latex=%5Cmathrm%7Btr%7D%28A%29+%3E+0&bg=ffffff&fg=333333&s=0&c=20201002) condition) and a quadratic equation (the ![\det(A) = 1](https://s0.wp.com/latex.php?latex=%5Cdet%28A%29+%3D+1&bg=ffffff&fg=333333&s=0&c=20201002) condition). So, we’re trying to show that all 4-tuples obeying those constraints follow a very regular pattern.

Here are two proofs of the conjecture:

• John Baez, [Line bundles on complex tori (part 5)](https://golem.ph.utexas.edu/category/2024/04/line_bundles_on_complex_tori_p_2.html), _The n-Category Café_, April 30, 2024.

Greg Egan and I came up with the first proof. The basic idea was to assume there’s a point in ![\mathfrak{h}_2(\mathbb{E}) \cap \mathcal{H}](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BE%7D%29+%5Ccap+%5Cmathcal%7BH%7D&bg=ffffff&fg=333333&s=0&c=20201002) that’s _not_ a hexagon center, choose one as close as possible to the identity matrix, and then construct an even closer one, getting a contradiction. Shortly thereafter, someone on Mastodon by the name of [Mist](https://mathstodon.xyz/@ai@cawfee.club/112350732372323380) came up with a second proof, similar in strategy but different in detail. This increased my confidence in the result.

### What’s next?

Something very similar should be true for another regular hyperbolic honeycomb, the [square tiling honeycomb](https://en.wikipedia.org/wiki/Square_tiling_honeycomb):

[  
![](https://i0.wp.com/math.ucr.edu/home/baez/mathematical/{4,3,3}_honeycomb_roice.png)](https://commons.wikimedia.org/wiki/File:H3_443_FC_boundary.png)

Here instead of the Eisenstein integers we should use the [Gaussian integers](https://en.wikipedia.org/wiki/Gaussian_integer), ![\mathbb{G}](https://s0.wp.com/latex.php?latex=%5Cmathbb%7BG%7D&bg=ffffff&fg=333333&s=0&c=20201002), consisting of all complex numbers

![a + b i](https://s0.wp.com/latex.php?latex=a+%2B+b+i&bg=ffffff&fg=333333&s=0&c=20201002)

where ![a](https://s0.wp.com/latex.php?latex=a&bg=ffffff&fg=333333&s=0&c=20201002) and ![b](https://s0.wp.com/latex.php?latex=b&bg=ffffff&fg=333333&s=0&c=20201002) are integers.

**Conjecture.** The points in the lattice ![\mathfrak{h}_2(\mathbb{G})](https://s0.wp.com/latex.php?latex=%5Cmathfrak%7Bh%7D_2%28%5Cmathbb%7BG%7D%29&bg=ffffff&fg=333333&s=0&c=20201002) that lie on the hyperboloid ![\mathcal{H}](https://s0.wp.com/latex.php?latex=%5Cmathcal%7BH%7D&bg=ffffff&fg=333333&s=0&c=20201002) are the centers of squares in a square tiling honeycomb.

I’m also very interested in how these results connect to algebraic geometry! I explained this in some detail here:

• [Line bundles on complex tori (part 4)](https://golem.ph.utexas.edu/category/2024/04/post_2.html), _The n-Category Café_, April 26, 2024.

Briefly, the hexagon centers in the hexagonal tiling honeycomb correspond to principal polarizations of the abelian variety ![\mathbb{C}^2/\mathbb{E}^2](https://s0.wp.com/latex.php?latex=%5Cmathbb%7BC%7D%5E2%2F%5Cmathbb%7BE%7D%5E2&bg=ffffff&fg=333333&s=0&c=20201002). These are concepts that algebraic geometers know and love. Similarly, if the conjecture above is true, the square centers in the square tiling honeycomb will correspond to principal polarizations of the abelian variety ![\mathbb{C}^2/\mathbb{G}^2](https://s0.wp.com/latex.php?latex=%5Cmathbb%7BC%7D%5E2%2F%5Cmathbb%7BG%7D%5E2&bg=ffffff&fg=333333&s=0&c=20201002). But I’m especially interested in interpreting the other features of these honeycombs — not just the hexagon and square centers — using ideas from algebraic geometry.