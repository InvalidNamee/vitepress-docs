---
title: ICPC Asia EC Online 2025(I)
---
其实很早之前就补的差不多了，可以看到 16 号就打算写了，后来一直拖，拖到了现在。

这场我们打的挺好的，我只写了一道大模拟，然后队友已经切完了，最后做交互题没调出来。

## A. Who Can Win

这就是一道大模拟，逻辑上没有难度，代码不在我这个机子上，没存也不想再写一遍了，记得当时有三个东西没初始化挂掉了（当时没有立刻发现），然后电脑让出去了，浪费了好长时间。

## B. Creating Chaos

当时说是隔几个取一个来着，后来发现直接取前 k 个就行。

```cpp
#include <iostream>

using namespace std;

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) printf("%d ", i);
    printf("\n");
    return 0;
}
```

## C. Canvas Painting

用贪心的思想，维护一个候选集合，枚举位置，加入的时候先取左端点最小的，取出的时候优先取右端点最小的，补题的时候挂了好几次。

```cpp
#include <iostream>
#include <queue>
#include <algorithm>

using namespace std;
typedef pair<int, int> PII;
const int N = 200010;
PII a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        priority_queue<int, vector<int>, greater<int>> q;
        int n, m, cur = 0;
        scanf("%d%d", &m, &n);
        for (int i = 1; i <= m; ++i) {
            scanf("%d%d", &a[i].first, &a[i].second);
        }
        sort(a + 1, a + m + 1);
        int res = n, j = 0;
        while (cur <= n && j < m) {
            while (j < m && cur > a[j + 1].first) q.push(a[++j].second);
            while (!q.empty() && cur > q.top()) q.pop();
            if (!q.empty()) cur++, q.pop(), res--;
            else cur = a[j + 1].first + 1;
        }
        while (!q.empty()) {
            if (cur <= q.top()) cur++, res--;
            q.pop();
        }
        printf("%d\n", res);
    }
    return 0;
}
```

## D. Min-Max Tree

这道是树形 dp，关键就是不能被题目描述带着走，不能从怎么删这个角度考虑，应该考虑在树中取 k 个正值，k 个负值，一个连通块只能有一个正和一个负，权值和最大，把合法状态空间扩大了，但是最优解一定还是原问题的最优解。对于一个连通块只有三种情况，平衡，正，负，考虑状态转移，一个块最多只能有一个正和一个负，正向反向线性 dp 维护一下只有一个正，只有一个负，全是 0 的前后缀，枚举分界点向根合并。这道题补的时候没有调很久。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 1000010;
int ver[N * 2], ne[N * 2], head[N], tot;
LL a[N], f[N][3]; // 0 配对 1 正 2 负
LL pre[N][3], suf[N][3];
int idx[N];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dp(int x, int fa) {
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dp(y, x);
    }
    int l = 0;
    for (int i = head[x]; i; i = ne[i]) {
        if (ver[i] == fa) continue;
        idx[++l] = ver[i];
    }
    if (!l) {
        f[x][1] = a[x], f[x][2] = -a[x];
        return;
    }
    idx[0] = idx[l + 1] = 0;
    pre[0][1] = pre[0][2] = suf[l + 1][1] = suf[l + 1][2] = -2000000000;
    pre[0][0] = suf[l + 1][0] = 0;
    for (int i = 1; i <= l; ++i) {
        int y = idx[i];
        pre[i][0] = pre[i - 1][0] + f[y][0];
        pre[i][1] = max(pre[i - 1][0] + f[y][1], pre[i - 1][1] + f[y][0]);
        pre[i][2] = max(pre[i - 1][0] + f[y][2], pre[i - 1][2] + f[y][0]);
    }
    for (int i = l; i; --i) {
        int y = idx[i];
        suf[i][0] = suf[i + 1][0] + f[y][0];
        suf[i][1] = max(suf[i + 1][0] + f[y][1], suf[i + 1][1] + f[y][0]);
        suf[i][2] = max(suf[i + 1][0] + f[y][2], suf[i + 1][2] + f[y][0]);
    }
    // if (x == 1) cout << suf[1][1] << " " << suf[1][2] << endl;
    f[x][0] = max(suf[1][0], max(suf[1][1] - a[x], suf[1][2] + a[x]));
    f[x][1] = max(suf[1][0] + a[x], suf[1][1]);
    f[x][2] = max(suf[1][0] - a[x], suf[1][2]);
    for (int i = 1; i < l; ++i) {
        f[x][0] = max(f[x][0], max(pre[i][1] + suf[i + 1][2], pre[i][2] + suf[i + 1][1]));
    }
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%lld", &a[i]);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    dp(1, 0);
    // for (int i = 1; i <= n ;++i) {
    //     cout << i << " : ";
    //     for (int j = 0; j < 3; ++j) cout << f[i][j] << ' ';
    //     cout << endl;
    // }
    printf("%lld\n", f[1][0]);
    return 0;
}
```

## G. Sorting

签到题，我们当时被卡了会儿，不应该，举了一个错的例子卡了自己对的想法。

```cpp
#include <iostream>

using namespace std;

const int N = 200010;
bool f[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int l, r;
        scanf("%d%d", &l, &r);
        if (l + 1 == r) f[l] = true;
    }
    for (int i = 1; i < n; ++i) {
        if (!f[i]) {
            printf("No\n");
            return 0;
        }
    }
    printf("Yes\n");
    return 0;
}
```

## I. Knapsack Problem<sup style="color: blue">欠</sup>


## J. Moving on the Plane<sup style="color: red">补</sup>

感觉我们当时的思路就差一点就想出来了，我感觉确实是因为感觉排名够了，都不是很想努力了。

转成切比雪夫距离之后 x 反向和 y 方向就完全拆开了，对于每个坐标轴上分别做一次

- 枚举所有可以到达的长度为 k 的区间，算出来方案数，减去用相同做法做一遍长度为 k - 1 的区间的方案数（这是一个容斥的过程，他是相邻两段交叉，k - 1 的正好就是 k 多出来的重叠部分）。

两个维度的答案乘一下就是答案。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int MOD = 998244353;
const int N = 60, M = 100010, lim = 300000;
int a[N], b[N];
LL jc[M], inv[M];

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

LL c(int n, int m) {
    if (m > n) return 0;
    return jc[n] * inv[m] % MOD * inv[n - m] % MOD;
}

int main() {
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    jc[0] = 1;
    for (int i = 1; i <= m; ++i) {
        jc[i] = jc[i - 1] * i % MOD;
    }
    inv[0] = 1;
    inv[m] = power(jc[m], MOD - 2);
    for (int i = m - 1; i; --i) {
        inv[i] = inv[i + 1] * (i + 1) % MOD;
    }
    for (int i = 1; i <= n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        a[i] = x + y, b[i] = x - y;
    }
    LL res = 1, s;
    for (int T = 0; T < 2; ++T) {
        s = 0;
        for (int j = k, t = 1; j >= max(0, k - 1); --j, t *= -1) { // 长度
            for (int i = -lim; i + j <= lim; ++i) { // 左端点
                LL ts = 1;
                for (int p = 1; p <= n; ++p) {
                    LL tt = 0;
                    for (int l = 0; l <= j; ++l) {
                        int len = abs(i + l - a[p]);
                        if (m >= len && (m - len) % 2 == 0)
                            tt = (tt + c(m, (m - len) / 2)) % MOD;
                    }
                    ts = (ts * tt) % MOD;
                    if (!ts) break;
                }
                s = ((s + ts * t) % MOD + MOD) % MOD;
            }
        }
        res = res * s % MOD;
        swap(a, b);
    }
    printf("%lld\n", res);
    return 0;
}
```

## M. Teleporter

当时我们分层图 Dijkstra 卡过了，补题的时候我也这么过的，但是这个 Dijkstra 应该比较多余，目测再从上到下扫一遍也能达成效果。

```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <tuple>
using namespace std;
typedef long long LL;
const int N = 5010, M = 10010;

int head[N], ver[N * 2], ne[N * 2], w[N * 2], tot;
pair<int, int> a[M];
LL dis[N], b[N];
bool vis[N];
priority_queue<pair<LL, int>> q;

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

void dijkstra() {
    memset(vis, 0, sizeof(vis));
    while (!q.empty()) {
        auto [_, x] = q.top();
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dis[y] > dis[x] + w[i]) {
                dis[y] = dis[x] + w[i];
                q.emplace(-dis[y], y);
            }
        }
    }
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i < n; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        add(x, y, z), add(y, x, z);
    }
    for (int i = 1; i <= m; ++i) {
        scanf("%d%d", &a[i].first, &a[i].second);
    }
    memset(dis, 0x3f, sizeof(dis));
    dis[1] = 0;
    q.emplace(-dis[1], 1);
    for (int t = 0; t <= n; ++t) {
        dijkstra();
        LL res = 0;
        for (int i = 1; i <= n; ++i) {
            res += dis[i];
        }
        printf("%lld\n", res);
        memset(b, 0x3f, sizeof(b));
        for (int i = 1; i <= m; ++i) {
            b[a[i].second] = min(b[a[i].second], min(dis[a[i].second], dis[a[i].first]));
            b[a[i].first] = min(b[a[i].first], min(dis[a[i].second], dis[a[i].first]));
        }
        for (int i = 1; i <= n; ++i) {
            dis[i] = min(dis[i], b[i]);
            q.emplace(-dis[i], i);
        }
    }
    return 0;
}
```

<span style="color: grey">可怜的 [Laffey](https://github.com/sLaffey) 被卡了。</span>