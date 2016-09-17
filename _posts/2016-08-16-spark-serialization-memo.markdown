---
layout:     post
title:      "Handle Spark Serialization"
subtitle:   "Task not serializable error"
date:       2016-08-16 20:15:00
author:     "Dong Meng"
tags:
    - Open Source
    - Big Data
    - Apache Spark
header-img: "img/post-bg-04.jpg"

---
<p>Serialization is an important concept in most distributed applications, of course Spark is included. A serialization framework helps you convert objects into a stream of bytes and vice versa in new computing environment. This is very helpful when you try to save objects to disk or send them through networks. Those situations happen in Spark when things are shuffle around.</p>

<h3 class="section-heading">Solve Serialization Issue</h3>

<p>In spark development, it is very common to come across serialization errors, especially in Spark Streaming applications. There are typically two ways to handle this: 1, make the object/class serializable; 2, declare the instance within the lambda function. For example, if we want to read Hbase per prefix key in a RDD map function, we could write a class like:</p>
<pre><code>import org.apache.hadoop.hbase.client.{ConnectionFactory, Scan}
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.hbase.{HBaseConfiguration, TableName}
import scala.collection.mutable.ArrayBuffer

class HBaseReader(val table: String) extends Serializable{
    @transient lazy val hBaseConfiguration = HBaseConfiguration.create()
    @transient lazy val connection = ConnectionFactory.createConnection(hBaseConfiguration)
    @transient lazy val hTable = connection.getTable(TableName.valueOf(table))

    def getArray(prefixKey: String):Array[String] = {
        val hbaseArray = new ArrayBuffer[String]
        val scan = new Scan()
        scan.setRowPrefixFilter(Bytes.toBytes(prefixKey))
        val resultScanner = hTable.getScanner(scan)
        var result = resultScanner.next()
        while (result != null) {
            hbaseArray += Bytes.toString(result.value)
            result = resultScanner.next()
        }
        resultScanner.close()
        hbaseArray.toArray
    }

    def close(): Unit = {
        hTable.close()
        connection.close()
    }
}
</code></pre>

<p>Among the class, <code>@transient</code> means annotation for fields that should not be serialized at all. If you mark a field as @transient, then the frame- work should not save the field even when the surrounding object is serialized. When the object is loaded, the field will be restored to the default value for the type of the field annotated as @transient. Also if you prefix a val definition with a lazy modifier, the initializing expression on the right-hand side will only be evaluated the first time the val is used. We can compare the examples below:</p>
<pre><code>object Test {
    val x = { println("initializing x"); "done" }
}
object TestLazy {
    lazy val x = { println("initializing x"); "done" }
}
</code></pre>
<p>If in scala/spark shell, we execute <code>Test</code>, then <code>Test.x</code>, we will observe that Test.x is intialized when we execute Test. On the other hand, we execute <code>TestLazy</code> then <code>TestLazy.x</code> we will observe that TestLazy.x is initialized when executing TestLazy.x. In Spark, this would translate into we want initalize those vals only when they have been executed on each individual executors. Hence, we can safely use <code>getArray</code> in a RDD map function</p> 

<p>However, in the Hbase production usage, the best practice is to close the connection clearly in your code. And long lasting Hbase connection sometime cannot recover from spark executor failures. In my experience, the best practice is to put the connection life circle inside a function</p>

<pre><code>import org.apache.hadoop.hbase.client.{ConnectionFactory, Scan}
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.hbase.{HBaseConfiguration, TableName}
import scala.collection.mutable.ArrayBuffer

Object HBaseReader(val table: String) extends Serializable{
    def getArray(prefixKey: String):Array[String] = {
        val hBaseConfiguration = HBaseConfiguration.create()
        val connection = ConnectionFactory.createConnection(hBaseConfiguration)
        hTable = connection.getTable(TableName.valueOf(table))
        val hbaseArray = new ArrayBuffer[String]
        val scan = new Scan()
        scan.setRowPrefixFilter(Bytes.toBytes(prefixKey))
        val resultScanner = hTable.getScanner(scan)
        var result = resultScanner.next()
        while (result != null) {
            hbaseArray += Bytes.toString(result.value)
            result = resultScanner.next()
        }
        resultScanner.close()
        hTable.close()
        connection.close()
        hbaseArray.toArray
    }
}
</code></pre>


