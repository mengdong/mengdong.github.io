---
layout:     post
title:      "Work with Frozen Graph(Graphdef) and SavedModel format across TF1 and TF2"
subtitle:   "A few handy scripts to your rescue, painless examing TF models irrespective of TensorFlow versions"
date:       2020-08-18 00:01:00
author:     "Dong Meng"
tags:
    - TensorFlow
    - Python
    - Machine Learning
    - Open Source
header-img: "img/post-bg-02.jpg"
---

# Introduction
TensorFlow has gone through some major changes between TF1 and TF2. TensorFlow has such a huge community that it is inevitable that you will at some points trying to exam a TF1 Frozen Graph within your TF2 environment or try to peek into some TF2 models with your prefered TF1 environment. I have create a [few scripts](https://github.com/mengdong/tensorflow-tensorrt-utils/tree/master/tf_utils) that is handy for you to inspect both Frozen Graph and SavedModel format regardless of what TF version you use.

