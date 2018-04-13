---
layout:     post
title:      "MapR Streams MXNet Face: A Near Realtime Face Recognition on Distributed Pub/Sub Streaming System"
subtitle:   "A Deep Learning demo with MXNet, mxnet-face, insightface and MapR Streams"
date:       2018-03-18 00:01:00
author:     "Dong Meng"
tags:
    - Open Source
    - Big Data
    - Deep Learning
    - MXNet
header-img: "img/post-bg-04.jpg"
---

# Introduction
Face recognition and detection is a well-studied field in terms of deep learning research. Finding the representation of human face through deep convolutional network is considered the state of art algorithm at the moment. For the purpose of this article, we are leveraging open source pre-trained deep learning models, mxnet-face for face detection and insightface for face recognition. The goal of this article is not to attain a benchmark level accuracy, but rather to demonstrate the flexibility to build deep learning powered application on the MapR data infrastructure and leverage NVIDIA GPUs.

Code could be cloned at [MapR-Stream-MXNet-Face](https://github.com/mengdong/mapr-streams-mxnet-face).

# Walk through
The setup of this demo is around MapR edge cluster and client devices. We use laptop as a MapR client to feed the cluster with real time video feed and to consume the final output of the models. On the MapR cluster, we leverage MapR streams to provide scalable and reliable data infrastructure for sending video frames. On the edge of MapR cluster, we deploy a DGX box to read the original MapR streams with raw video, do inferencing and write to another processed MapR streams.

<img class="shadow" src="/img/streams-arch.png" />

For the ease of deployment, we leverage nvidia docker to launch MapR PACC container using the GPU to serve the deep learning model. Also on client side, we use MapR PACC to identify new faces with a uploaded image and display the processed MapR streams. So that user doesn’t have to go through the trouble to configure the deep learning library dependencies. On the deep learning model side, as first step, we used mxnet-face to detect all faces in a video frame. Then we crop the face to 112x112 and send them to insightface, where it is use a conv3x3 and stride =1 as first convolutional layer, which is followed by fine-tuned deep residual neural net architecture. The technical details could be find in this [paper](https://jiankangdeng.github.io/resources/paper/Deng_ArcFace_submit_IJCV_2018_paper.pdf). The frame with detected faces and all the bounding boxes, face embedding vectors will be written a processed MapR Stream. We then use the outputted face embedding vector to calculate the similarity of faces with cosine distance and compare with the uploaded new images for output.

# Get pre-trained models
After clone the repo, get the face detection from [mxnet-face](https://github.com/tornadomeet/mxnet-face), whereas the model is stored at [dropbox](https://www.dropbox.com/sh/yqn8sken82gpmfr/AAC8WNSaA1ADVuUq8yaPQF0da?dl=0). Also the face recogition model fromc[insightface](https://github.com/deepinsight/insightface) whereas the model is stored at [google drive](https://drive.google.com/file/d/1x0-EiYX9jMUKiq-n1Bd9OCK4fVB3a54v/view)

put model-0000.params under "consumer/models/", put mxnet-face-fr50-0000.params under "consumer/deploy"

# Pre-requisite
A GPU MapR cluster, some installation could be referred from [this blog](https://mengdong.github.io/2017/07/14/kubernetes-1.7-gpu-on-mapr-distributed-deep-learning/)

Your laptop, with a camera if you want the content from your camera, should have MapR MAC/Linux/Windows Client installed and tested to be able to connect to your GPU MapR cluster, the installation is [here](https://maprdocs.mapr.com/52/AdvancedInstallation/SettingUptheClient-  install-mapr-client.html)

# Produce the content into a GPU MapR cluster
Producer code is straightforward, also hardcoded. Run "python mapr-producer-video.py", will read the Three Billboards trailer and produce it to a stream on the cluster:'/mapr/DLcluster/tmp/rawvideostream'. Also, you could use the camera, it is similar.

Before run the producer code, Stream should be created on the cluster, or through the client. Simple commands to create the stream and topics:
<pre><code>
maprcli stream delete -path /tmp/rawvideostream
maprcli stream create -path /tmp/rawvideostream
maprcli stream edit -path /tmp/rawvideostream -produceperm p -consumeperm p -topicperm p
maprcli stream topic create -path /tmp/rawvideostream -topic topic1 -partitions 1
</code></pre>


# Consume the content in the GPU MapR cluster
After making sure the stream in on GPU cluster, we can run the consumer which contains the facial recognition code to process the stream: "python mapr\_consumer.py". We will read from stream '/tmp/rawvideostream', get the face embedding vector and bounding boxes, and write     them to stream '/tmp/processedvideostream', also, we will write all identified faces into stream '/tmp/identifiedstream'

Similarly, the stream should be pre-created:
<pre><code>
maprcli stream delete -path /tmp/processedvideostream
maprcli stream create -path /tmp/processedvideostream
maprcli stream edit -path /tmp/processedvideostream -produceperm p -consumeperm p -topicperm p
maprcli stream topic create -path /tmp/processedvideostream -topic topic1 -partitions 1

maprcli stream create -path /tmp/identifiedstream
maprcli stream edit -path /tmp/identifiedstream -produceperm p -consumeperm p -topicperm p
maprcli stream topic create -path /tmp/identifiedstream -topic sam -partitions 1
maprcli stream topic create -path /tmp/identifiedstream -topic frances -partitions 1
maprcli stream topic create -path /tmp/identifiedstream -topic all -partitions 1
</code></pre>

# Identify new person in the stream with a picture and a docker run command on your laptop
Since all face embedding has been calculated, we can launch a container on your laptop possibly with only CPU to identify new person with one or a few picture of that person's face. Current code only accept one picture.

After set up the github repo, we can run the following command to launch the container, there is an option to decide whether you want to write identified frames with that person back to a MapR stream or not.
<pre><code>
docker pull mengdong/mapr-pacc-mxnet:new_person_identifier

docker run -it --privileged --cap-add SYS_ADMIN --cap-add SYS_RESOURCE --device /dev/fuse -e MAPR_CLUSTER=DLcluster  \
-v /home/mapr/GITHUB/mapr-streams-mxnet-face:/tmp/mapr-streams-mxnet-face:ro \
-e MAPR_CLDB_HOSTS=10.0.1.74 -e MAPR_CONTAINER_USER=mapr -e MAPR_CONTAINER_UID=5000 -e MAPR_CONTAINER_GROUP=mapr  \
-e MAPR_CONTAINER_GID=5000 -e MAPR_MOUNT_PATH=/mapr \
-e GROUPID=dong01 -e GPUID=-1 -e READSTREAM=/tmp/processedvideostream \
-e WRITESTREAM=/tmp/identifiedstream -e THRESHOLD=0.3 -e WRITETOSTREAM=0 \
-e WRITETOPIC=sam -e READTOPIC=topic1 \
-e TIMEOUT=0.3 -e PORT=5011 -e FILENAME=sam_.jpg \
-p 5011:5011 mengdong/mapr-pacc-mxnet:new_person_identifier
</code></pre>
Visualization could be seen at the port you chose (go to 'http://localhost:5011').


# Demo the processed stream from a running docker on your laptop
If you decided to write processed stream into another MapR stream, we can always pull the processed stream for visualization.
<pre><code>
docker pull mengdong/mapr-pacc-mxnet:5.2.2_3.0.1_ubuntu16_yarn_fuse_hbase_streams_flask_client_arguments

docker run -it --privileged --cap-add SYS_ADMIN --cap-add SYS_RESOURCE --device /dev/fuse -e MAPR_CLUSTER=DLcluster  \
-e MAPR_CLDB_HOSTS=10.0.1.74 -e MAPR_CONTAINER_USER=mapr -e MAPR_CONTAINER_UID=5000 -e MAPR_CONTAINER_GROUP=mapr  \
-e MAPR_CONTAINER_GID=5000 -e MAPR_MOUNT_PATH=/mapr \
-e GROUPID=YOUGROUPNAME -e STREAM=/tmp/identifiedstream -e TOPIC=all(choose from all/frances/sam) \
-e TIMEOUT=0.035(0.035 if reading from topic all, 0.2 from frances/sam, can be flexible) -e PORT=5010(choose a new port) \
-p 5010:5010(match the port you chose before) mengdong/mapr-pacc-mxnet:5.2.2_3.0.1_ubuntu16_yarn_fuse_hbase_streams_flask_client_arguments
</code></pre>
The video will show up at the port you chose (go to 'http://localhost:5010').

<iframe width="560" height="315" src="https://www.youtube.com/embed/pn77kn74Gag" frameborder="0" allowfullscreen></iframe>

