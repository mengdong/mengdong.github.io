---
layout:     post
title:      "Python Machine Learning Project Template"
subtitle:   "pylint, Cookiecutter, project structure"
date:       2018-05-30 00:01:00
author:     "Dong Meng"
tags:
    - Open Source
    - Python
    - Machine Learning
    - Coding
header-img: "img/post-bg-03.jpg"
---

# Introduction

Recently, it came to my notice that I need to focus on improve coding quality, I have modified my previous template for python related machine learning projects, added pylint and imporved the skeleton on Cookiecutter project structure. I will continue to add some example project code to this repo [python-ml-structure](https://github.com/mengdong/python-ml-structure)

<pre><code>
Project Organization
------------

 ├── LICENSE
 ├── .pylintrc          <- Python style guidance
 ├── Makefile           <- Makefile with commands like `make data` or `make train`
 ├── README.md          <- The top-level README for developers using this project.
 ├── env                <- CI configuration
 ├── data
 │   ├── external       <- Data from third party sources.
 │   ├── interim        <- Intermediate data that has been transformed.
 │   ├── processed      <- The final, canonical data sets for modeling.
 │   └── raw            <- The original, immutable data dump.
 │
 ├── docs               <- A default Sphinx project; see sphinx-doc.org for details
 │
 ├── models             <- Trained and serialized models, model predictions, or 
 │                         model summaries
 │
 ├── notebooks          <- Jupyter notebooks. Naming convention is a number 
 │                         (for ordering), the creator's initials, and a short `-`  
 │                         delimited description, e.g. `1.0-jqp-initial-data-exploration`.
 │
 ├── references         <- Data dictionaries, manuals, and all other explanatory materials.
 │
 ├── reports            <- Generated analysis as HTML, PDF, LaTeX, etc.
 │   └── figures        <- Generated graphics and figures to be used in reporting
 │
 ├── requirements.txt   <- The requirements file for reproducing analysis environment, e.g.
 │                         generated with `pip freeze > requirements.txt`
 │
 ├── setup.py           <- makes project pip installable so src can be imported
 ├── src                <- Source code for use in this project.
 │   ├── __init__.py    <- Makes src a Python module
 │   │
 │   ├── data           <- Scripts to download or generate data
 │   │   └── make_dataset.py
 │   │
 │   ├── features       <- Scripts to turn raw data into features for modeling
 │   │   └── build_features.py
 │   │
 │   ├── models         <- Scripts to train models and then use trained models to make
 │   │   │                 predictions
 │   │   ├── predict_model.py
 │   │   └── train_model.py
 │   │
 │   └── visualization  <- Scripts to create exploratory and results oriented visualizations
 │       └── visualize.py
 │
 └── tox.ini            <- tox file with settings for running tox; see tox.testrun.org

</code></pre>
