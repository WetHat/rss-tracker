---
author: "Blogs on Lisp journey"
published: 2017-12-01T13:21:20.000Z
link: https://localhost/blog/continuous-integration-delivering-executables-on-gitlab/
id: /blog/continuous-integration-delivering-executables-on-gitlab/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] Continuous Integration and delivery on Gitlab CI, testing locally with Docker - 2017-12-01T13:21:20.000Z
> Best read in the Cookbook ! also Travis CI, code coverage, testing with Prove. Gitlab CI is part of Gitlab and is available on Gitlab.com, for public and private repositories. Let’s see straight away a simple .gitlab-ci.yml: image: daewok/lisp-devel before_script: - apt-get update -qy - apt-get install -y git-core - git clone https://github.com/foo/bar ~/quicklisp/local-projects/ test: script: - make test Gitlab CI is based on Docker. With image we tell it to use the daewok/lisp-devel one.

🔗Read article [online](https://localhost/blog/continuous-integration-delivering-executables-on-gitlab/). For other items in this feed see [[../Blogs on Lisp journey]].

- [ ] [[Continuous Integration and delivery on Gitlab CI, testing locally with Docker]]
- - -

