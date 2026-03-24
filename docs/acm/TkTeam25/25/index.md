---
title: 2025组队训练赛第 25 场
---
# 2025组队训练赛第 25 场

## A. Adrien and Austin

~~我不会证明，但是我会打表！~~
n<sup>3</sup> 打表的做法是记 $f_i$ 为 i 个石头先手是(1)否(0)必胜，考虑一个人取了之后游戏会变成两个子游戏，两个子游戏先手固定一个 k，$f_0 = 0$，从左到右扫，对于一个 i 枚举前面的 j 和 l，如果有一组合法的 j 和 l 满足 $f_j \oplus f_l = 1$，那么 $f_i$ 是必胜态。

打表发现

- k = 1 时，偶数必败奇数必胜；
- 其他情况，0 必败，其他必胜。

```cpp
#include <iostream>
 
using namespace std;
 
int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    if (k == 1) {
        if (n & 1) printf("Adrien\n");
        else printf("Austin\n");
    }
    else {
        if (n == 0) printf("Austin\n");
        else printf("Adrien\n");
    }
    return 0;
}
```

## D. Country Meow

最小覆盖球板子，但是我不会😵‍💫

## G. Pyramid

结论是当时误打误撞猜出来的，我们意外发现 $f_n = f_{n - 2} + n!$，然后奇数偶数都做一个换元套公式算出来了。

## I. Magic Potion

网络流，裸的板子，学会 dinic 了😋。

虚拟源点给每个人建一条流量为 1 的边，再开一个虚拟点，虚拟源点给这个点建一条流量为 k 的边，这个点给每一个人流量为 1 的边，人给所有能打的怪建一条流量为 1 的边，怪给虚拟汇点建一条流量为 1 的边，然后跑一个最大流。

```cpp
#include <iostream>
#include <queue>
#include <cstring>

using namespace std;

const int N = 1010, M = 502010;
const int INF = 0x3f3f3f3f;
int head[N], ne[M], ver[M], w[M], tot = 1;
int cur[N], dep[N], q[N];
int S, T;

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

bool bfs() {
    memset(dep, 0, sizeof(dep));
    dep[S] = 1;
    int hh = 0, tt = -1;
    q[++tt] = S;
    cur[S] = head[S];
    while (hh <= tt) {
        int x = q[hh++];
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dep[y] || !w[i]) continue;
            dep[y] = dep[x] + 1;
            cur[y] = head[y];
            if (y == T) return true;
            q[++tt] = y;
        }
    }
    return false;
}

int find(int x, int lim) {
    if (x == T) return lim;
    int flow = 0;
    for (int i = cur[x]; i && flow < lim; i = ne[i]) {
        int y = ver[i];
        cur[x] = i;
        if (dep[y] == dep[x] + 1 && w[i]) {
            int t = find(y, min(w[i], lim - flow));
            if (!t) dep[y] = -1;
            w[i] -= t, w[i ^ 1] += t, flow += t;
        }
    }
    return flow;
}

int dinic() {
    int res = 0, flow;
    while (bfs()) while (flow = find(S, INF)) res += flow;
    return res;
}

int main() {
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        for (int j = 1; j <= t; ++j) {
            int x;
            scanf("%d", &x);
            add(i, x + n, 1);
            add(x + n, i, 0);
        }
    }
    for (int i = 1; i <= n; ++i) {
        add(0, i, 1);
        add(i, 0, 0);
        add(n + m + 1, i, 1);
        add(i, n + m + 1, 0);
    }
    add(0, n + m + 1, k);
    add(n + m + 1, 0, 0);
    for (int i = 1; i <= m; ++i) {
        add(i + n, n + m + 2, 1);
        add(n + m + 2, i + n, 0);
    }
    S = 0, T = n + m + 2;
    int res = dinic();
    printf("%d\n", res);
    return 0;
}
```

## J. Prime Game

基于线筛的 vis 数组，$O(n\ln n)$ 分解质因数。

## K. Kangaroo Puzzle

不断让任意一对位置不在一起的点走到一起。

## M. Mediocre String Problem