---
title: 2025春训第二十六场
---
# 2025春训第二十六场

题面可以看[这里](https://acm.hdu.edu.cn/search.php?field=problem&key=2025%A1%B0%B6%A4%B0%D2%B1%E0%B3%CC%A1%B1%D6%D0%B9%FA%B4%F3%D1%A7%C9%FA%CB%E3%B7%A8%C9%E8%BC%C6%B4%BA%BC%BE%C1%AA%C8%FC%A3%A83%A3%A9&source=1&searchmode=source).

## **A. 数列计数**

最害怕的数学题。

$\prod_{i=1}^{n}\binom{a_i}{b_i} $ 等价于对于每一个 i，都有 $\binom{a_i}{b_i}$ 为奇数。

对于 $\binom{n}{k}$，根据（ChatGPT指出的）卢卡斯定理，取 p = 2 有

$$
\binom{n}{k} \equiv \binom{n\ \text{mod}\ 2}{k\ \text{mod}\ 2} \binom{\lfloor\frac{n}{2}\rfloor}{1}\ (\text{mod}\ 2)
$$

右边这一项同理可以不断展开，最终等价于\*\*取出了 n 和 k 的所有二进制位算组合数再乘积。\*\*显然要想保证是奇数，**只能 k 的每个二进制位都不比 n 大。**

对于每一项做一次数位 dp，统计每一位都比 $a_i$ 小的数的个数即可，时间复杂度是 $\Theta(n\log 10^9)$。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
const int MOD = 998244353;
int a[N];
long long f[31][2]; // 第i位，是否顶上界

int dp(int a, int l) {
    f[30][1] = 1;
    for (int i = 29; i >= 0; --i) {
        if (a >> i & 1) { // 可选 1 和 0
            if (l >> i & 1) {
                f[i][1] = f[i + 1][1];
                f[i][0] = (f[i + 1][0] * 2 + f[i + 1][1]) % MOD;
            }
            else {
                f[i][1] = f[i + 1][1];
                f[i][0] = f[i + 1][0] * 2 % MOD;
            }
        }
        else { // 只能选 0 
            if (l >> i & 1) {
                f[i][1] = 0;
                f[i][0] = (f[i + 1][0] + f[i + 1][1]) % MOD;
            }
            else {
                f[i][1] = f[i + 1][1];
                f[i][0] = f[i + 1][0];
            }
        }
    }
    return (f[0][0] + f[0][1]) % MOD;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        long long res = 1;
        for (int i = 1; i <= n; ++i) {
            int l;
            scanf("%d", &l);            
            res = (res * dp(a[i], min(l, a[i]))) % MOD;
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## **D. 弯曲筷子**

这道题需要发现一个小结论，显然我当时没发现……

先对 c 数组排序一下，排序后一根筷子**只可能和他相邻的或者隔一个的筷子配对**。所以问题就转化成了一个线性dp 的问题。对于每一个 i 只用考虑 i - 1 和 i - 2. dp时主要需要考虑**兜底**，即如何强制选上必须选的，状态转移方程很简单，可以参考下面的代码。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 300010;

pair<int, bool> c[N];
long long f[N][2];

long long p2(long long a) {
    return a * a;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m;
        scanf("%d%d", &n, &m);
        memset(f, 0x3f, sizeof(long long) * (n * 2 + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &c[i].first);
            c[i].second = false;
        }
        for (int i = 1; i <= m; ++i) {
            int t;
            scanf("%d", &t);
            c[t].second = true;
        }
        f[0][1] = 0;
        sort(c + 1, c + n + 1);
        int pre = 0;
        for (int i = 1; i <= n; ++i) {
            if (c[i - 1].second) {
                f[i][0] = f[i - 1][1]; // 一定要配对
                f[i][1] = f[i - 1][0] + p2(c[i].first - c[i - 1].first);
            }
            else {
                f[i][0] = min(f[i - 1][0], f[i - 1][1]); // 随意
                if (i >= 2) f[i][1] = min(f[i - 1][0] + p2(c[i].first - c[i - 1].first), f[i - 2][0] + p2(c[i].first - c[i - 2].first));
            }
        }
        if (c[n].second) printf("%lld\n", f[n][1]);
        else printf("%lld\n", min(f[n][0], f[n][1]));
    }
    return 0;
}
```

## **E. 修复公路**

我感觉这应该是最水的一道题，我们需要用最小的代价使不连通的图连通，显然就是把本来不连通的连通块作为节点建一棵树，答案是**连通块数量 - 1**.

需要主意别把初始化写挂😭

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>

using namespace std;

const int N = 300010;

vector<int> ed[N];
bool vis[N];

void dfs(int x) {
    if (vis[x]) return;
    vis[x] = true;
    for (int y : ed[x]) {
        dfs(y);
    }
}

void solve() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        vis[i] = false;
        ed[i].clear();
    }
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        if (i - t > 0) ed[i].push_back(i - t), ed[i - t].push_back(i);
        if (i + t <= n) ed[i].push_back(i + t), ed[i + t].push_back(i);
    }
    int cnt = 0;
    for (int i = 1; i <= n; ++i) {
        if (!vis[i]) cnt++, dfs(i);
    }
    printf("%d\n", cnt - 1);
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        solve();
    }
    return 0;
}
```

## **G. 宝石商店**

这是一道纯数据结构题，不难发现

$$
(a_i \lor x) \oplus (a_i \land x) = a_i \oplus x
$$

问题转化成在区间 \[l, r\] 内找一个 i，使得 $a_i \oplus x$ 最大。于是**可持久化字典树**或者主席树套字典树都行。建议别写树套树，一错一个不吱声。

我不作死，我写的是字典树。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;

int trie[N * 60][2], rt[N], tot;

void add(int x, int cur, int pre) {
    for (int i = 30; i >= 0; --i) {
        bool t = x >> i & 1;
        trie[cur][t] = ++tot;
        trie[cur][t ^ 1] = trie[pre][t ^ 1];
        cur = trie[cur][t], pre = trie[pre][t];
    }
}

int query(int x, int l, int r) {
    int res = 0;
    for (int i = 30; i >= 0; --i) {
        bool t = x >> i & 1;
        if (trie[r][t ^ 1] && trie[r][t ^ 1] != trie[l][t ^ 1]) {
            res += 1 << i;
            l = trie[l][t ^ 1], r = trie[r][t ^ 1];
        }
        else {
            l = trie[l][t], r = trie[r][t];
        }
    }
    return res;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--){ 
        int n, m;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            rt[i] = ++tot;
            int t;
            scanf("%d", &t);
            add(t, rt[i], rt[i - 1]);
        }
        while (m--) {
            int l, r, x;
            scanf("%d%d%d", &l, &r, &x);
            printf("%d\n", query(x, rt[l - 1], rt[r]));
        }
        memset(trie, 0, (tot + 1) * sizeof(trie[0]));
        memset(rt, 0, (n + 1) * sizeof(int));
        tot = 0;
    }
    return 0;
}
```

## **I. 部落冲突**

我这里魔改了一下并查集，这道题用并查集处理唯一的困难就是**操作2（野蛮人 a 移动到部落 b 中）**，直接改野蛮人 a 的父亲可能会波及到他的子树，所以需要一种办法**让每个野蛮人始终是叶子**。于是我开了 n 个虚拟节点分别初始化成每个野蛮人的父亲，用来合并和交换，进行合并和交换的时候**动的永远都是虚拟节点**，这样随便改父亲就不会出问题了。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 1000010;

int rep[N], rnk[N * 2], fa[N * 2]; // 前 n 个表示野蛮人，中间表示初始虚拟节点
int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

void solve() {
    int n, q;
    scanf("%d%d", &n, &q);

    int tot = 2 * n;
    for (int i = 1; i <= n; ++i) {
        fa[i] = i + n;
        fa[i + n] = i + n;
        rep[i] = i + n; // 代表点暂时选中间的初始节点，不能动前 n 个
        rnk[i + n] = i;
    }

    while (q--) {
        int op;
        scanf("%d", &op);
        if (op == 4) {
            int a;
            scanf("%d", &a);
            printf("%d\n", rnk[getfa(a)]);
        }
        else {
            int a, b;
            scanf("%d%d", &a, &b);
            if (op == 1) {
                int r1 = rep[a], r2 = rep[b];
                fa[r2] = r1; // 合并
                rep[b] = r1;
            }
            else if (op == 2) {
                fa[a] = rep[b]; // 野蛮人只能是叶子
            }
            else {
                swap(rnk[rep[a]], rnk[rep[b]]);
                swap(rep[a], rep[b]);
            }
        }
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        solve();
    }
    return 0;
}
```

## **J. 选择配送**

这道题应该是第二水的题，尝试分类讨论**分离两个点的参数**，尝试去绝对值

$$
|p_1 - p_2| + |q_1 - q_2| = \max\{|(p_1 + q_1) - (q_1 + q_2|), |(p_1 - q_1) - (p_2 + q_2)|\}
$$

只需要**记录四个极端值** $\max\{x_i + y_i\}, \min\{x_i + y_i\},\max\{x_i - y_i\},\min\{x_i - y_i\}$就能找到对于每个候选配送站的最大距离。

```cpp
#include <iostream>
#include <climits>

using namespace std;

const int N = 1000010;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m;
        long long mn_s = LLONG_MAX, mx_s = LLONG_MIN, mn_m = LLONG_MAX, mx_m = LLONG_MIN;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            long long x, y;
            scanf("%lld%lld", &x, &y);
            mx_s = max(mx_s, x + y);
            mn_s = min(mn_s, x + y);
            mx_m = max(mx_m, x - y);
            mn_m = min(mn_m, x - y);
        }
        long long res = LLONG_MAX;
        for (int i = 1; i <= m; ++i) {
            long long x, y;
            scanf("%lld%lld", &x, &y);
            long long su = x + y, me = x - y;
            res = min(res, max(max(abs(su - mx_s), abs(su - mn_s)), max(abs(me - mx_m), abs(me - mn_m))));
        }
        printf("%lld\n", res);
    }
    return 0;
}
```