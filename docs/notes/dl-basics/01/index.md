---
title: 机器学习基础
---
# 机器学习基础

机器学习都学过，主要是过了一下监督学习，有很多需要算的东西可能需要注意一下

## 概念

Instance（实例），feature vector（特征向量），feature space（特征空间）

输入实例𝑥的特征向量：

$$
x = \left(x^{(1)}, x^{(2)}, \ldots, x^{(i)}, \ldots, x^{(n)}\right)^T
$$

- $x^{(i)}$ 与 $x_i$ 不同，后者表示多个输入变量中的第 $i$ 个

$$
x_i = \left(x_i^{(1)}, x_i^{(2)}, \ldots, x_i^{(n)}\right)^T
$$

- 训练集：

$$
T = \left\{(x_1, y_1), (x_2, y_2), \ldots, (x_N, y_N)\right\}
$$

- 输入变量和输出变量：
  - 分类问题、回归问题、标注问题

## 线性回归

### 推导

$$
x = \left(1, x^{(1)}, x^{(2)}, \ldots, x^{(i)}, \ldots, x^{(n)}\right)^T
$$

$$
h_\theta(x)
= \theta_0 + \theta_1 x^{(1)} + \cdots + \theta_n x^{(n)}
= \theta^T x
= x^T \theta
$$

$$
J(\theta)
= \frac{1}{2N}\sum_{i=1}^N\left(h_\theta(x_i)-y_i\right)^2
= \frac{1}{2}(X\theta-Y)^T(X\theta-Y)
$$

$$
\begin{aligned}
\frac{\partial J(\Theta)}{\partial \Theta}
&= \frac{\partial J(\Theta)}{\partial b}
\cdot
\frac{\partial b}{\partial c}
\cdot
\frac{\partial c}{\partial \Theta} \\
&= \frac{1}{2}
\cdot
\frac{\partial b^2}{\partial b}
\cdot
\frac{\partial b}{\partial c}
\cdot
\frac{\partial c}{\partial \Theta} \\
&= b^T I_{N\times N}X \\
&= (X\Theta - Y)^T X \\
&= 0
\end{aligned}
$$

$$
\left((X\Theta - Y)^T X\right)^T
= X^T(X\Theta - Y)
= 0
$$

$$
\Theta
= (X^T X)^{-1}X^T Y
$$

### 正规方程

线性回归最优解对应的解析公式

$$
\Theta = (X^TX)^{-1}X^TY
$$

## 正则化

正则化一般形式：

$$
\min_{f\in\mathcal{F}} \frac{1}{N}\sum_{i=1}^N L\left(y_i, f(x_i)\right) + \lambda J(f)
$$

- 回归问题中：

$$
L(w) = \frac{1}{N}\sum_{i=1}^N\left(y_i - f(x_i; w)\right)^2 + \frac{\lambda}{2}\|w\|_2^2
$$

$$
L(w) = \frac{1}{N}\sum_{i=1}^N\left(y_i - f(x_i; w)\right)^2 + \lambda\|w\|_1
$$

### 正则化与岭回归

$X^T X$ 不可逆，$X^T X + \lambda I$ 可逆，带进去能得到

$$
J(\theta)
= \frac{1}{2}(Y - X\theta)^T(Y - X\theta)
+ \frac{\lambda}{2}\theta^T\theta
$$

### 正则化与交叉验证


- 简单交叉验证（70%，30%）
- S折交叉验证
- 留一交叉验证（上一种的极端情况，每轮只留一个样本验证）

## 分类

### 二分类

单位跃阶函数

$$
y =
\begin{cases}
0, & z < 0 \\
0.5, & z = 0 \\
1, & z > 0
\end{cases}
$$

- 缺点：不连续

替代函数——对数几率函数（logistic funtion

$$
y = \frac{1}{1 + e^{-z}}
$$

- 单调可微、任意阶可导

### logistic 回归

> [!NOTE]
> 这个做过实验

$$
\pi(x)
= \frac{\exp(w^T x)}{1 + \exp(w^T x)}
$$

$$
1 - \pi(x)
= \frac{1}{1 + \exp(w^T x)}
$$

$$
\begin{aligned}
L(w)
&= -\sum_{i=1}^N\left[y_i\log\pi(x_i) + (1-y_i)\log(1-\pi(x_i))\right] \\
&= -\sum_{i=1}^N\left[y_i\log\frac{\pi(x_i)}{1-\pi(x_i)} + \log(1-\pi(x_i))\right] \\
&= -\sum_{i=1}^N\left[y_iw^Tx_i - \log\left(1+\exp(w^Tx_i)\right)\right]
\end{aligned}
$$

$$
\frac{\partial L(w)}{\partial W}
= -\left(y - y'\right)x^T
$$

> 发现这个式子和线性回归是一样的（只有 $\hat{y}$ 变了）

### 多项logistic回归

$$
P(Y = K| x) = \frac{1}{1 + \sum_{k = 1}^{K - 1}\exp(w_k^T x)}
$$

> Q: 为什么只用算到 K - 1
> 
> A: 因为这里采用的是：“以一个类别作为基准类（reference class）” 的多项 logistic 回归写法, 最后一个类别的概率由：$1-\sum_{k=1}^{K-1}P(Y=k|x)$ 自动确定。

### Softmax回归

$$
\frac{\exp(w_k^Tx)}{1 + \sum_{k=1}^{K-1}\exp(w_k^Tx)}
$$

$$
\frac{\exp(w_k^Tx)}{\sum_{k=1}^K\exp(w_k^Tx)}
$$

(后面是一些推理和求导，和上面二分类基本上一样的逻辑)

## 常用的定理

### 没有免费午餐定理（No Free Lunch Theorem，NFL）
对于基于迭代的最优化算法，不存在某种算法对所有问题（有限的
搜索空间内）都有效。如果一个算法对某些问题有效，那么它一定
在另外一些问题上比纯随机搜索算法更差。

### 丑小鸭定理(Ugly Duckling Theorem)
丑小鸭与白天鹅之间的区别和两只白天鹅之间的区别一样大.

GPT：

丑小鸭定理实际上是在说明：

没有“先验偏好”，就不存在有效学习。

这也是：

* 特征工程
* 模型结构
* 正则化
* inductive bias

为什么重要的理论原因之一。

### 奥卡姆剃刀原理(Occam's Razor)

如无必要，勿增实体

## 归纳偏置(Inductive Bias)

很多学习算法经常会对学习的问题做一些假设，这些假设就称为**归纳偏置**

在贝叶斯学习中成为**先验**(Prior)
