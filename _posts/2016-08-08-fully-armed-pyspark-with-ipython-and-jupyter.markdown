---
layout:     post
title:      "Fully Arm Your Spark with Ipython and Jupyter in Python 3"
subtitle:   "a summary on Spark 2.0.0 environment set up with Python 3"
date:       2016-08-08 20:15:00
author:     "Dong Meng"
tags:
    - Open Source
    - Apache Spark
    - Python
header-img: "img/post-bg-02.jpg"

---
<p>This is a memo on configuring Jupyter 4.x to work with pyspark 2.0.0. I am using Mac OS please adjust the steps accordingly for other systems.</p>

<h3 class="section-heading">Ipython in Pyspark</h3>
<p>To use ipython as driver for pyspark shell: (to use ipython functionalities in pyspark shell). Add the following lines in spark-env.sh</p>
<pre><code>export PYSPARK_PYTHON=/Users/dmeng/anaconda3
export PYSPARK_DRIVER_PYTHON=/Users/dmeng/anaconda3/bin/ipython
</code></pre>

<h3 class="section-heading">Jupyter Notebook in Pyspark </h3>
<p>If you want to launch Jupyter notebook when launch pyspark shell:</p>
<pre><code>export PYSPARK_PYTHON=/Users/dmeng/anaconda3
export PYSPARK_DRIVER_PYTHON=/Users/dmeng/anaconda3/bin/jupyter
export PYSPARK_DRIVER_PYTHON_OPTS="notebook"
</code></pre>

<h3 class="section-heading">Pyspark in Ipython</h3>
<p>If you want to able to choose to use spark when launch ipython shell: 1, add a ipython profile named pyspark.</p>
<pre><code>ipython profile create pyspark
</code></pre>
<p>2, Add <code>~/.ipython/profile_pyspark/startup/00-pyspark-setup.py</code> </p>
<pre><code>import os
import sys
spark_home = os.environ.get('SPARK_HOME', None)
if not spark_home:
    raise ValueError('SPARK_HOME environment variable is not set')
sys.path.insert(0, os.path.join(spark_home, 'python'))
sys.path.insert(0, os.path.join(spark_home, 'python/lib/py4j-0.10.1-src.zip'))
exec(open(os.path.join(spark_home, 'python/pyspark/shell.py')).read())
</code></pre>
<p>Then you are able to launch <code>ipython --profile=pyspark</code></p>

<h3 class="section-heading">Pyspark in Jupyter Notebook</h3>
<p>After created pyspark ipython profile, although Jupyter use Kernel to control its configuration, we can further create a pyspark kernel to launch pyspark in Jupyter Notebook. Add pyspark Jupyter kernel at <code>~/Library/Jupyter/kernels/pyspark/kernel.json</code></p>
<pre><code>{
    "display_name": "PySpark (Spark 2.0.0)",
    "language": "python",
    "argv": [
        "/Users/dmeng/anaconda3/bin/python3",
        "-m",
        "ipykernel",
        "--profile=pyspark",
        "-f",
        "{connection_file}"
    ],
    "env": {
        "CAPTURE_STANDARD_OUT": "true",
        "CAPTURE_STANDARD_ERR": "true",
        "SEND_EMPTY_OUTPUT": "false",
        "SPARK_HOME": "/usr/local/Cellar/apache-spark/2.0.0/libexec/"
    }
}
</code></pre>
<p>Launch Jupyter notebook and you will see that in addition to python3, there is an option for Pyspark (spark 2.0.0) when creating notebook. You can also specify more spark env opts in env section of the kernel json file. For example:</p>
<pre><code>{
 "display_name": "PySpark",
 "language": "python",
 "argv": [
  "/usr/bin/python",
  "-m",
  "IPython.kernel",
  "-f",
  "{connection_file}"
 ],
 "env": {
  "SPARK_HOME": "/opt/cloudera/parcels/CDH/lib/spark",
  "HADOOP_CONF_DIR": "/etc/hadoop/conf",
  "PYTHONPATH": "/opt/cloudera/parcels/CDH/lib/spark/python/:/opt/cloudera/parcels/CDH/lib/spark/python/lib/py4j-0.8.2.1-src.zip",
  "PYTHONSTARTUP": "/opt/cloudera/parcels/CDH/lib/spark/python/pyspark/shell.py",
  "PYSPARK_SUBMIT_ARGS": "--master yarn-client --conf spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.io.compression.codec=lzf --conf spark.speculation
=true --conf spark.shuffle.manager=sort --conf spark.shuffle.service.enabled=true --conf spark.dynamicAllocation.enabled=true --conf spark.dynamicAllocation.initialExecutors=4
--conf spark.dynamicAllocation.minExecutors=4 --conf spark.executor.cores=1 --conf spark.executor.memory=512m pyspark-shell"
 }
}
</code></pre>

<h3 class="section-heading">Scala in Jupter Notebook</h3>
<p>Detailed information could be found here: <a href="http://toree.apache.org/documentation/user/installation.html"> Apache Toree</a>. </p>

<p></p>
<p>Some reference:</p>
<p>http://www.davidgreco.me/blog/2015/12/24/how-to-use-jupyter-with-spark-kernel-and-cloudera-hadoop-slash-spark/</p>
<p>https://jupyter-client.readthedocs.io/en/latest/kernels.html#kernels</p>
