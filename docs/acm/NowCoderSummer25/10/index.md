---
title: 2025牛客暑期多校训练营10
---
# 2025牛客暑期多校训练营10

最后一场了，后面打三天训练赛我就该小学期了，训练赛题解系列暂时停更，但是有可能更新小学期项目的日志之类的。

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 6 |
| 赛后补 | 0 |

排名是 164，还比较好。这场打的比较好最大的原因应该是敢于尝试，尝试一些无法严格证明的结论或者时间复杂度，赌对了就过了。我敲了一下午代码，又累又爽吧。今天配合的挺好的，我直接续着队友的思路写代码改细节，做的时候队友复盘思路找问题，一套下来做的还挺流畅的。似乎没什么任何一个人独立做出来的题，思路大部分是他们的，所以全标队友的主要贡献了。

## D. Grammar Test (grammar) <sup style="color: blue">队友</sup>

本场签到题，排除了连续 0 和连续 1 之后讨论交换次数就比较容易的得到了结论。

## E. Sensei and Affection (affection) <sup style="color: blue">队友</sup>

本来想着加完之后的序列一定不会超过最大值，但是想错了， m = 2 的时候有可能超过一点更优，让多个包含最大值的段集体加 1 如果能满足题目的条件，显然比分开加更优。

代码是我写的，第一次忘记了取所有可能的情况的 min (空调冷 / 连续写代码多了写迷糊了)，第二次是上面那个逻辑错误。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 10010;

LL f[N][2], a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m;
        LL mx = 0, mn = 0x3f3f3f3f, r = 200;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            scanf("%lld", &a[i]);
            mx = max(mx, a[i]);
            mn = min(mn, a[i]);
        }
        f[0][0] = f[0][1] = 0;
        if (m == 1) mn = mx, r = mx;
        int g[2] = {};
        LL res = 0x3f3f3f3f;
        for (int t = mn; t <= r; ++t) {
            for (int tt = mx; tt <= r; ++tt) {
                g[0] = t, g[1] = tt;
                if (g[0] >= a[1]) f[1][0] = g[0] - a[1];
                else f[1][0] = 0x3f3f3f3f;
                if (g[1] >= a[1]) f[1][1] = g[1] - a[1];
                else f[1][1] = 0x3f3f3f3f;
                for (int i = 2; i <= n; ++i) {
                    for (int j = 0; j < 2; ++j) {
                        f[i][j] = 0x3f3f3f3f;
                        for (int k = 0; k < 2; ++k) {
                            if (g[j] - a[i] >= 0 && g[k] - a[i - 1] >= 0) f[i][j] = min(f[i][j], f[i - 1][k] + max(0LL, (g[j] - a[i]) - (g[k] - a[i - 1])));
                        }
                    }
                }
                res = min(res, min(f[n][0], f[n][1]));
            }
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## F. Sensei and Yuuka Going Shopping (yuuka) <sup style="color: blue">队友</sup>

枚举第一个分隔点，开一个类似链表的结构记录每个 x 下一次出现的位置，线段树区间加维护前面的点对于后面的点选为第二个分隔点的贡献，实现的时候会遇到很多边界情况，比较需要谨慎。

这道题也是我写的，我竟然一遍就过了。

虽然不影响结果，但是我其实干了个大蠢事，维护区间最大值的位置可以不用写这么麻烦的，直接存位置，pushup 的时候更新上来就可以。然而我自创了一个方法，记录了通往最大值的路径，两条链同时向下递归找的最大值，还好我没写挂。你说我犯蠢了吧，我写对了，你说我不犯蠢吧，自己给自己找麻烦……

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 150010, M = 1000010;

int a[N], v[M], ne[N], fir[N];
int tr[N * 4], tag[N * 4], mxp[N * 4];

void pushup(int u) {
    if (tr[u << 1] > tr[u << 1 | 1]) {
        mxp[u] = 0;
    }
    else {
        mxp[u] = 1;
    }
    tr[u] = mxp[u] ? tr[u << 1 | 1] : tr[u << 1];
}

void pushdown(int u) {
    if (tag[u]) {
        tag[u << 1] += tag[u], tag[u << 1 | 1] += tag[u];
        tr[u << 1] += tag[u], tr[u << 1 | 1] += tag[u];
        tag[u] = 0;
    }
}

void modify(int u, int l, int r, int ql, int qr, int v) {
    if (ql > qr) return;
    if (ql <= l && r <= qr) {
        tr[u] += v, tag[u] += v;
    }
    else {
        pushdown(u);
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        pushup(u);
    }
}

int query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) {
        return tr[u];
    }
    else {
        pushdown(u);
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = max(res, query(u << 1, l, mid, ql, qr));
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

pair<int, int> query_mxp(int u, int l, int r, int ql, int qr) {
    if (l == r) return {tr[u], l};
    else if (ql <= l && r <= qr) {
        pushdown(u);
        int mid = l + r >> 1;
        if (mxp[u] == 0) return query_mxp(u << 1, l, mid, ql, qr);
        else return query_mxp(u << 1 | 1, mid + 1, r, ql, qr);
    }
    else {
        pushdown(u);
        int mid = l + r >> 1;
        pair<int, int> t1 = {-1, -1}, t2 = {-1, -1};
        if (ql <= mid) t1 = query_mxp(u << 1, l, mid, ql, qr);
        if (qr > mid) t2 = query_mxp(u << 1 | 1, mid + 1, r, ql, qr);
        if (t1.first > t2.first) return t1;
        else return t2;
    }
}

void print(int u, int l, int r) {
    if (l == r) printf("%d ", tr[u]);
    else {
        pushdown(u);
        int mid = l + r >> 1;
        print(u << 1, l, mid), print(u << 1 | 1, mid + 1, r);
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        memset(ne, 0, sizeof(int) * (n + 1));
        memset(fir, 0, sizeof(int) * (n + 1));
        memset(tr, 0, sizeof(int) * (n * 4 + 1));
        memset(tag, 0, sizeof(int) * (n * 4 + 1));
        memset(mxp, 0, sizeof(int) * (n * 4 + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            if (v[a[i]]) {
                ne[v[a[i]]] = i;
            }
            else fir[i] = true;
            v[a[i]] = i;
        }
        int res = -1, p1 = 2, p2 = 3;
        for (int i = 1; i <= n - 2; ++i) {
            if (fir[i]) modify(1, 1, n, ne[i] + 1, v[a[i]], 1);
            else modify(1, 1, n, i + 1, ne[i], -1);
            int qs = query(1, 1, n, i + 1, n);
            if (res < qs) {
                res = qs;
                p1 = i + 1, p2 = query_mxp(1, 1, n, i + 1, n).second;
            }
            // print(1, 1, n);
            // printf("\n");
        }
        printf("%d\n", res);
        printf("%d %d\n", p1, p2);
        for (int i = 1; i <= n; ++i) v[a[i]] = 0;
    }
    return 0;
}
```

## H. Rev Equation (NOI-tAUqe ver.) (equation) <sup style="color: blue">队友</sup>

算是半个签到题吧，可能的情况比较少。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        string s;
        cin >> s;
        if (s[0] != s[2] && (s[0] == '0' || s[1] != '-')) cout << "Yes" << endl;
        else cout << "No" << endl;
    }
    return 0;
}
```

## I. Matrix (matrix) <sup style="color: blue">队友</sup>

这道题本来一直没思路，尝试过分类讨论，只讨论出了 1 * m 或者 n * 1 的结论，当时还以为 n 和 m 不能同奇同偶。直到研究暴搜搜出来的答案的时候，暴搜搜出来一个这个

```
1 9 17 16 8 
2 10 18 15 7 
4 12 20 13 5 
3 11 19 14 6
```

观察到 1,2,3,4, 5,6,7,8 …… 分别各占了一列，然后思路就突然打开了。之前单独讨论一行或者一列的情况的时候得出了一个结论，只要左右左右循环走就一定能正好全部填上，证明可以根据前缀和的奇偶性证。看到这个合法的矩阵之后，我们就想是不是可以**每列上下走走完之后左右走换到下一列再上下走**，然后不同奇同偶的情况应用了这个结论之后验证样例没问题，又多测了几组，都以为行了的时候，交了一发 WA 了。

后来写了个 100 * 100 内的验证，自测逻辑的问题，如果填不满就输出错误数据并 `return 123`，<del>然后把队友的 wsl 跑死机了，</del>在我这儿跑了一发，发现问题，`3 6` 的时候返回了 123。我首先指出了问题，左右走的时候，每次走的长度都是一个 n 的倍数，m 个连续的 n 的倍数 mod m 能出现 m 个不同的位置当且仅当 n 和 m 互质，讨论确定无误之后，改了有解的条件，之前所有的有解的分类讨论都归结成了一类，再交一发成功拿下。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int n,m;

int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int main()
{
    scanf("%d%d", &n, &m);
    if (gcd(n, m) == 1) {
        printf("YES\n");
        vector<vector<int>> a(n, vector<int>(m, -1));
        int x = 0, y = 0, t = 1;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n - 1; ++j) {
                a[x][y] = t;
                x = ((x + (j & 1 ? 1 : -1) * t) % n + n) % n;
                t++;
            }
            a[x][y] = t;
            y = ((y + (i & 1 ? 1 : -1) * t) % m + m) % m;
            t++;
        } 
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                if (a[i][j] == -1) return 123;
                printf("%d ", a[i][j]);
            }
            printf("\n");
        }
    }
    else {
        printf("NO\n");
    }
    return 0;
}
```

## K. Amazing Sets (amazing) <sup style="color: blue">队友</sup>

思路还是队友那来的，我只想出来一个可能的优化，然后他竟然跑得飞快，难以置信。

大体上看这是一个树上背包问题的变体，数的大小是 10<sup>4</sup>，所有节点的权值和也是 10<sup>4</sup>，直接 nm<sup>2</sup> 暴力显然不太合适。我想出来一个办法，这道题本质上做的其实是类似一个树上的集合合并操作，考虑用 bitset 存状态，启发式合并玄学降低时间复杂度，合并状态时从 f<sub>x</sub> 和 f<sub>y</sub> 选择一个少的枚举 1 的位置，把多的移位或进答案更新回 f<sub>x</sub>(类似二进制数作乘积的操作)，一个启发式合并大概是一个 log，一个 bitset 优化除掉了一个 32，外加所有 a 的和比较小，有效状态应该比较少，理论上**可能**能过。

期间 WA 了一发，因为

- 状态转移方程循环里面的 j 全写成了 i；
- 没看到根节点不一定是 1。

然后还真就神奇的过了。

```cpp
#include <iostream>
#include <bitset>

using namespace std;
const int N = 10010;
bitset<10001> f[N];
int s[N], a[N], deg[N];
int head[N], ne[N], ver[N], tot;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dp(int x) {
    for (int i = head[x]; i; i = ne[i]) {
        bitset<10001> b(0);
        int y = ver[i];
        dp(y);
        s[x] += s[y];
        a[x] += a[y];
        if (f[x].count() > f[y].count()) swap(f[x], f[y]);
        b |= f[y];
        for (int j = 0; j <= 10000; ++j) {
            if (f[x][j]) b |= f[y] << j;
        }
        f[x] |= b;
    }
    if (!s[x]) f[x].set(a[x], 1);
}

int main() {
    int n, m;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        deg[y]++;
        add(x, y);
    }
    scanf("%d", &m);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        s[x]++, s[y]--;
    }
    int rt;
    for (int i = 1; i <= n; ++i) {
        if (deg[i] == 0) {
            rt = i;
            break;
        }
    }
    dp(rt);
    f[rt][0] = 1;
    printf("%ld\n", f[rt].count());
    return 0;
}
```