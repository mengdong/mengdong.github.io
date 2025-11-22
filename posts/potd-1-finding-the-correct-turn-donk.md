---
title: "POTD #1: Finding the correct turn donk"
date: "2025-11-22"
excerpt: "Analyzing a hand where a turn donk bet is the optimal strategy."
---

2023年WSOP flip and go最后三桌, 我是桌上CL. 2nd CL open UTG+1 2BB, 我在大盲防守78hh. Flop 9h7d6d. X b33 c. Turn 6s X X. River As X b50 xr4x. 对手长考弃牌。

![Solver River BB raise](/images/POTD1/potd1_1.png)

当进入比赛的后期，我一般会倾向于保守的策略，除非对对手有特殊的解读。我对UTG+1的印象是他一个solid player, bluff的频率可能不足，且对手从未深跑WSOP比赛，所以我认为他会overfold river。但是从solver的结果来看，面对一个GTO的策略，尽管大盲的XR bluff combo不多，UTG的Ax并没有太多的fo牌率(因为solver推荐turn donk，我需要node lock BB turn 100% check来得到这个结果)。

![Solver River UTG bluff catching](/images/POTD1/potd1_2.png)

为了尽量避免在river进入一个猜猜看的高风险境地，solver的推荐策略会在turn高频率donk。尤其是在比赛后期with a covering stack，能对对手施加极大的压力。也许这些donk上更加aggressive的donk才是从CL到拿到奖杯的取胜之匙。

![Solver Turn Donk](/images/POTD1/potd1_3.png)

我觉得我能够抓住对手river bluff不足，而面对XR会overfold的倾向，把一些用来call的combo进行转诈唬是一个好的剥削。但是在turn没有抓住范围优势的出张主动出击，应该是因为我对donk lead的策略并没有系统地学习。

给自己的打分：A-


