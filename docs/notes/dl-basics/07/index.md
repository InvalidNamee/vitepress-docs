---
title: 深度强化学习
---
# 深度强化学习

## 引入

### 强化学习的难点

- 奖励延迟
- Agent 的操作会影响它接收到的后续数据

### 概述

- 基于策略 （学习 Actor）
- 基于值函数 （学习 Critic）
- Actor + Critic

## 基于策略的方法

### 几个版本

| Version | 核心思想 | 问题 | 改进 | 奖励 |
|---|---|---|---|---|
| V0 | 只看即时奖励 | 无法处理延迟奖励 | 引入长期奖励 | — |
| V1 | 看总回报 $G_t$ | 未来奖励权重一样 | 引入折扣 | $G_t = \sum_{n = t}^{N} r_n$ |
| V2 | 折扣回报 | 所有动作都可能被增强 | 引入 baseline | $G_t' = \sum_{n = t}^{N} \gamma^{n - t} r_n$ |
| V3 | 相对奖励（Advantage） | 更稳定、更合理 | 接近现代 RL | $G_t' = \sum_{n = t}^{N} \gamma^{n - t} r_n - b$ |

### 策略梯度

策略梯度（Policy Gradient）：

1. Initialize actor network parameters $\theta_0$
2. For training iteration $i = 1$ to $T$：
   - Using actor $\theta_{i-1}$ to interact
   - Obtain data $s_1, a_1, s_2, a_2, \dots, s_N, a_N$
   - Compute $A_1, A_2, \dots, A_N$
   - Compute loss $L$
   - $\theta_i \leftarrow \theta_{i-1} - \eta \nabla L$

### On-policy vs Off-policy

- On-policy（同轨策略）：用于生成采样数据序列的策略（actor for interacting）和用于实际决策的待评估和改进的策略（actor to train）是相同的
- Off-policy（离轨策略）→ Proximal Policy Optimization（PPO，近端策略优化）：训练的 actor 必须知道它与和环境互动的 actor 不同的地方。

### 训练

需要放大 Actor 的输出熵，或者在参数熵添加噪声。

actor 需要在数据收集过程中具有随机性，动作是从输出分布中采样的主要原因。

$b$ 可以依赖状态，通常由一个网络估计出来，是一个 NN 的输出，令 $A^\theta(s_t, a_t) = R - b$ 为优势函数。意义是假设在某一状态 $s_t$ 执行某一个动作 $a_t$ 相对于其他可能的动作的优势。（评论员）

## Actor-Critic

### Policy Gradient

$$
\nabla_\theta R_\theta \approx \frac{1}{N} \sum_{n=1}^N \sum_{t=1}^{T_n} (G_t^n - b) \nabla_\theta \log p_\theta(a_t^n | s_t^n)
$$

$G_t^n$ 通过和环境交互获得，不稳定。

有足够的样本，近似 $G$ 的期望。

### Q-Learning

- 状态值函数 $V^\pi(s)$
  - When using actor $\pi$, the cumulated reward expects to be obtained after visiting state $s$
- 状态-动作值函数 $Q^\pi(s, a)$
  - When using actor $\pi$, the cumulated reward expects to be obtained after taking $a$ at state $s$

| Version | 核心思想 | 问题 | 改进 | 奖励 / Advantage |
|---|---|---|---|---|
| V3.5 | Monte-Carlo Advantage Actor-Critic | 必须等 episode 结束；$G_t$ 方差仍然很大 | 用 Critic 学习状态价值 | $\displaystyle A_t = G_t - V_\theta(s_t)$ |
| V4 | TD Advantage / A2C | Monte-Carlo 更新慢、噪声大 | 用一步 TD bootstrap 估计未来 | $\displaystyle A_t = r_t + \gamma V_\theta(s_{t+1}) - V_\theta(s_t)$ |

### Advantage Actor-Critic

上面的 V4。

## 基于价值的方法

### Critic

- Critic 评估一个 actor $\pi$ 有多好
- 状态价值函数 $V^\pi(s)$
  - 在状态 $s$ 下，当采取 actor $\pi$ 进行交互，期望最终获得的累积奖励

### 估计 $V^\pi(s)$

- 蒙特卡罗（MC）方法
  - critic 观测 actor $\pi$ 玩整局游戏
- 时序差分方法
  - 有些应用的 episode 太长，所以延迟到一个 episode 结束再学习是效率太低。

### Q-Learning

给定 $Q^\pi(s, a)$，找到一个新 actor $\pi'$ 比 $\pi$ "更好"：

- "更好"：$V^{\pi'}(s) \geq V^\pi(s)$，对所有的状态 $s$
- $\pi'(s) = \arg\max_a Q^\pi(s, a)$
- $\pi'$ 没有额外的参数。它取决于 $Q$
- 不适合连续动作 $a$（稍后解决）

### DQN

- 利用 DQN，$Q(s, a; \mathbf{w})$ 近似 $Q^*(s, a)$（最优动作价值函数）
- DQN 通过 $a_t = \arg\max_a Q(s_t, a; \mathbf{w})$ 选择动作
- 我们试图学习参数 $\mathbf{w}$

### 改进——目标网络

$Q$ 更新 $N$ 次之后再复制给 Target $Q$：

- Online 网络输出：$Q(s_t, a_t; \mathbf{w})$
- Target 网络输出：$y_t = r_t + \gamma \max_a \hat{Q}(s_{t+1}, a; \mathbf{w}^-)$
- 计算 loss：$L = (Q - y)^2$

### 探索

- Epsilon Greedy：argmax / 随机
- Boltzmann Exploration：softmax

### 经验回放 Replay Buffer

$\pi$ 和环境交互放入缓存区。

在每次迭代：
1. 对于每一个批量进行采样
2. 更新 Q-function

### Double DQN

解决 $Q$ 值被高估的问题：

$$Q(s_t, a_t) \leftarrow r_t + Q'(s_{t+1}, \arg\max_a Q(s_{t+1}, a))$$

### Dueling DQN

把 $Q$ 拆成了 $V$ 和 $A$，解决没意义的选择上无效探索。

| | Double DQN | Dueling DQN |
|---|---|---|
| 解决问题 | Q值高估 | 状态价值学习效率低 |
| 核心思想 | 动作选择与评估分离 | Q拆成V+A |
| 改哪里 | target计算 | 网络结构 |
| 是否改变Q定义 | 否 | 是（分解Q） |
| 主要收益 | 更稳定 | 更高效 |

### 优先级经验回放

让 TD 误差越大的数据被抽样的概率越高。

### Multi-step TD

前 $N$ 步用真实奖励，后面再 bootstrap。
