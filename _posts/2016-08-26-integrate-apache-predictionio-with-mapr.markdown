---
layout:     post
title:      "Integrate Apache PredictionIO with MapR"
subtitle:   "Actionable Machine Learning"
date:       2016-08-26 10:00:00
author:     "Dong Meng"
tags:
    - Open Source
    - Big Data
    - Apache Spark
    - Hbase
    - Machine Learning
header-img: "img/predictionio.png"

---

<p><a href="http://predictionio.incubator.apache.org/">Apache PredicitonIO</a> is an open sourced machine learning server. In this article, we integrate Apache PredictionIO with MapR converged data platform 5.1 as backend. Specifically, we use  MapRDB (1.1.1) for event data storage, Elastic Search for meta data storage, MapRFS for model data storage. </p> 

<h3 class="section-heading">Introduction</h3>

<p>PredictionIO is an open sourced machine learning server, who recently joined the apache family. The strength of PredictionIO includes, quote:</p>
- Quickly build and deploy an engine as a web service on production with customizable templates;
- Respond to dynamic queries in real-time once deployed as a web service;
- Evaluate and tune multiple engine variants systematically;
- Unify data from multiple platforms in batch or in real-time for comprehensive predictive analytics;
- Speed up machine learning modeling with systematic processes and pre-built evaluation measures;
- Support machine learning and data processing libraries such as Spark MLLib and OpenNLP;
- Implement your own machine learning models and seamlessly incorporate them into your engine;
- Simplify data infrastructure management.

<p>PredictionIO is bundled with Hbase, and use it as event data storage manage data infrastructure for machine learning models. In this integration task, we will use MapRDB within MapR converged data platform to replace Hbase. MapRDB implemented directly in the MapR file system. The resulting advantages is that MapRDB has no intermediate layers when performing operations on data. MapRDB runs within MapR MFS process, and reads/writes to disk directly. Whereas Hbase mostly runs on HDFS, which it needs to communicate through JVM and HDFS further need to communicates with linux file system to perform reads/writes. Further advantages could be found here in <a href="http://maprdocs.mapr.com/home/MapROverview/c_maprdb_new.html">MapR doc</a></p>

<p>A few lines of code need to be modified in PredictionIO to work with MapRDB. I have created a forked version that works with MapR 5.1 and Spark 1.6.1. The Github link is <a href="https://github.com/mengdong/mapr-predictionio">https://github.com/mengdong/mapr-predictionio</a> </p>

<h3 class="section-heading">Preparation</h3>

<p>The prerequisite of this article is you have a MapR 5.1 cluster running, with Spark 1.6.1 and Elastic Search 1.7.5 server installed. Java 1.8 is needed and Java 1.7 will experience erros in compiling. Since we use  MapRDB (1.1.1) for event data storage, Elastic Search for meta data storage, MapRFS for model data storage. In MapRDB, there is no Hbase namespace concept, so the table hierarchy is based on the hierarchy of MapR file system. MapR support namespace mapping for hbase, <a href="
http://maprdocs.mapr.com/home/MapR-DB/MappingTableNamespaceBetw_28870174-d3e64.html">details here</a>. Please note that the <code>core-site.xml</code> is located at <code>/opt/mapr/hadoop/hadoop-2.7.0/etc/hadoop/</code> as of MapR 5.1 and you should modify core-site.xml and add a configuration as below. Also please create a dedicated MapR volume at the path of your choice. </p>
<pre><code>&lt;property&gt;
    &lt;name&gt;hbase.table.namespace.mappings&lt;/name&gt;
    &lt;value&gt;*:/hbase_tables&lt;/value&gt;
&lt;/property&gt;
</code></pre>

<p>Then we download and compile PredictionIO:</p>
<pre><code>    git clone https://github.com/mengdong/mapr-predictionio.git
    cd mapr-predictionio 
    git checkout mapr
    ./make-distribution.sh
</code></pre>

<p>After compile, there should be a file <code>PredictionIO-0.10.0-SNAPSHOT.tar.gz</code> created, copy it to a temporary path and extract it there, and copy back the jar file <code>pio-assembly-0.10.0-SNAPSHOT.jar</code> into <code>lib</code> directory under your <code>mapr-predictionio</code> folder.</p>

<p>Since we want to work with MapR 5.1, we want to make sure the proper classpath is included. I have edited <code>bin/pio-class</code> in my repo to include necessary change but your environment could vary, so please edit accordingly. <code>conf/pio-env.sh</code> also needs to be created. I have a template for reference:</p>

<img class="shadow" src="/img/predictionio/pio-env.png" />

<p>At this point, the preparation is almost finished. We should add <code>bin</code> folder of your PredictionIO to your path. And just run <code>pio status</code> to find out if your setup is successful. If everything works out, you should observe the following log:</p>

<img class="shadow" src="/img/predictionio/success.png" />

<p>This means it is ready to run <code>bin/pio-start-all</code> to start your PredictionIO console. If it runs successfully, you can just run <code>jps</code> and you should observe a <code>console</code> jvm.</p>

<h3 class="section-heading">Deploy Machine Learning Models</h3>

<p>One excellent feature of PredictionIO is the ease to develop/train/deploy your machine learning application and performs model update and model governance. There are many templates available to demo, for example: <a href="http://predictionio.incubator.apache.org/demo/textclassification/">spam email detection</a>. Due to the recent migration to apache family, links are broken. I have created forked repo to make a couple templates working. One <a href="https://github.com/mengdong/template-scala-parallel-classification">https://github.com/mengdong/template-scala-parallel-classification</a> is for <a href="http://predictionio.incubator.apache.org/demo/textclassification/">spam email detection</a> which is a logistic regression trained to do binary spam email classification. Another one <a href="https://github.com/mengdong/template-scala-parallel-similarproduct">https://github.com/mengdong/template-scala-parallel-similarproduct</a> is for <a href="http://predictionio.incubator.apache.org/templates/similarproduct/quickstart/">similar product</a>, which is a recommendation engine for user and items. You can either clone my forked repo instead of using <code>pio template get</code>. Or, you can copy <code>src</code> folder and <code>build.sbt</code> over to your “pio template get” location. Please modify the package name in your scala code to match your input during template get if you do a copy over.</p>

<p>Everything else works in predictionIO tutorial. I believe the links will be fixed very soon as well. So you can just follow the tutorial to register your engine to a PredictionIO application. Then to train the machine learning model and further deploy the model and use it through REST service or SDK (currently supporting python/java/php/ruby). Further more, you can use Spark and PredictionIO to develop your own model to use MapRDB to serve as the backend. </p>




