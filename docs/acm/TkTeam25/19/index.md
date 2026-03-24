---
title: 2025组队训练赛第 19 场
---
# 2025组队训练赛第 19 场

## B. Lovers

签到题，二分答案或者用 set.lower_bound。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 200010;
int a[N], b[N];
int n, k;

bool check(int mid) {
    for (int i = n - mid + 1, j = n; i <= n; ++i, --j) {
        if (a[i] + b[j] < k) return false;
    }
    return true;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        scanf("%d%d", &n, &k);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &b[i]);
        }
        sort(a + 1, a + n + 1);
        sort(b + 1, b + n + 1);
        int l = 0, r = n;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (check(mid)) l = mid;
            else r = mid - 1;
        }
        printf("%d\n", l);
    }
    return 0;
}
```

## F. God of Gamblers

$$
\frac{a}{a + b}
$$

蒙出来的，不知道具体原理。因为如果不考虑钱不够的情况下，如果赌赢一次一定比上一次输之前多一块钱，就感觉是 $\frac{a}{a + b}$.

```cpp
#include <iostream>

using namespace std;

int main() {
    int a, b;
    while (scanf("%d%d", &a, &b) != EOF)
        printf("%.5lf\n", (double)a / (a + b));
    return 0;
}
```

## G. Sum of xor sum

我本来想用线段树维护矩阵乘法做 dp 的，理论上似乎也可行。但是有个更简单的做法，因为**统计答案和数位是独立的**，可以分开考虑不同的数位，这样就只有 0/1 了。考虑段的拼接，如何把连续的子区间合并答案，这里就不难想到最大子段和的维护，新答案 = 左段的答案 + 右段的答案 +（左端为 0 的后缀数 * 右端为 1 的前缀数）+（左端为 1 的后缀数 * 有段为 0 的前缀数）。按位拆开，线段树维护每位的答案，对于每一个请求做区间查询即可。

应该还有一个更快的 O(n) 的做法。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
const int MOD = 1000000007;
typedef long long LL;

struct Node {
    LL sum;
    int val, sl0, sr0, len;

    void print() {
        printf("%lld %d %d %d %d\n", sum, val, sl0, sr0, len);
    }
};

Node merge(Node a, Node b) {
    Node c;
    if (a.val) c.sl0 = a.sl0 + (b.len - b.sl0);
    else c.sl0 = a.sl0 + b.sl0;
    if (b.val) c.sr0 = (a.len - a.sr0) + b.sr0;
    else c.sr0 = a.sr0 + b.sr0;
    c.val = a.val ^ b.val;
    c.len = a.len + b.len;
    c.sum = (LL)(a.sr0) * (b.len - b.sl0) + (LL)(a.len - a.sr0) * b.sl0 + a.sum + b.sum;
    c.sum %= MOD;
    return c;
}

struct SegmentTree {
    Node tr[N * 4];

    void pushup(int u) {
        tr[u] = merge(tr[u << 1], tr[u << 1 | 1]);
    }

    void build(int u, int l, int r, int a[], int b) {
        if (l == r) {
            int t = a[l] >> b & 1;
            tr[u] = {t, t, t ^ 1, t ^ 1, 1};
        }
        else {
            int mid = l + r >> 1;
            build(u << 1, l, mid, a, b), build(u << 1 | 1, mid + 1, r, a, b);
            pushup(u);
        }
    }

    Node query(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        else {
            int mid = l + r >> 1;
            Node res = {0, 0, 0, 0, 0};
            if (ql <= mid) res = merge(res, query(u << 1, l, mid, ql, qr));
            if (qr > mid) res = merge(res, query(u << 1 | 1, mid + 1, r, ql, qr));
            return res;
        }
    }
} smt[20];

int a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, q;
        scanf("%d%d", &n, &q);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        for (int i = 0; i < 20; ++i) smt[i].build(1, 1, n, a, i);
        while (q--) {
            int l, r;
            scanf("%d%d", &l, &r);
            LL res = 0;
            for (int i = 0; i < 20; ++i) {
                auto t = smt[i].query(1, 1, n, l, r);
                // t.print();
                res = (res + (1LL << i) * t.sum % MOD) % MOD;
            }
            // printf("\n");
            printf("%lld\n", res);
        }
    }
    return 0;
}
```

## H. Arrangement for Contests

**贪心**的从左到右一直取，需要一个线段树维护一下区间最小值。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;

int tr[N * 4], tag[N * 4];
int a[N];

void pushup(int u) {
    tr[u] = min(tr[u << 1], tr[u << 1 | 1]);
}

void pushdown(int u) {
    if (tag[u]) {
        tag[u << 1] += tag[u], tag[u << 1 | 1] += tag[u];
        tr[u << 1] += tag[u], tr[u << 1 | 1] += tag[u];
        tag[u] = 0;
    }
}

void build(int u, int l, int r) {
    tag[u] = 0;
    if (l == r) tr[u] = a[l];
    else {
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

void modify(int u, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) {
        tr[u] += v;
        tag[u] += v;
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
    if (ql <= l && r <= qr) return tr[u];
    else {
        pushdown(u);
        int mid = l + r >> 1, res = 0x3f3f3f3f;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = min(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, k;
        scanf("%d%d", &n, &k);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        build(1, 1, n);
        long long res = 0;
        for (int i = 1; i <= n - k + 1; ++i) {
            int t = query(1, 1, n, i, i + k - 1);
            res += t;
            // cout << t << ' ';
            modify(1, 1, n, i, i + k - 1, -t);
        }
        // cout << endl;
        printf("%lld\n", res);
    }
    return 0;
}
```

## J. LOL

**暴搜前四个，同时维护第五个人的选择数**，统计我方选英雄的方案数。然后需要乘 $A_{95}^{5} \cdot C_{90}^{10} \cdot C_{10}^{5}$.

这个系数可以直接用 python 库算出来

```bash
❯ python
Python 3.12.2 | packaged by conda-forge | (main, Feb 16 2024, 20:54:21) [Clang 16.0.6 ] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import math
>>> math.perm(95, 5) * math.comb(90, 10) * math.comb(10, 5) % 1000000007
531192758
```
当然，也可以直接用答案反推出来，我们当时都懵了，感觉做对了但是求不出来这个系数，然后直接 `515649254LL % MOD * power(res, MOD - 2) % MOD` 倒推出来了。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int MOD = 1000000007;
int a[5][100], b[100];
int t;
LL res;

LL power(LL n, LL p) {
    LL res = 1, b = n;
    while (p) {
        if (p & 1) res = res * b % MOD;
        b = b * b % MOD;
        p >>= 1;
    }
    return res;
}

void dfs(int x) {
    if (x == 4) {
        res = (res + t) % MOD;
        return;
    }
    for (int i = 0; i < 100; ++i) {
        if (b[i] || !a[x][i]) continue;
        b[i] = 1;
        if (a[4][i]) t--;
        dfs(x + 1);
        if (a[4][i]) t++;
        b[i] = 0;
    }
}

int main() {
    while (1) {
        for (int i = 0; i < 5; ++i) {
            for (int j = 0; j < 100; ++j) {
                if (scanf("%1d", &a[i][j]) == EOF) {
                    return 0;
                }
            }
        }
        t = 0;
        res = 0;
        for (int i = 0; i < 100; ++i) if (a[4][i]) t++;
        dfs(0);
        printf("%lld\n", res * 531192758 % MOD);
        // printf("%lld\n", 515649254LL % MOD * power(res, MOD - 2) % MOD);
    }
    return 0;
}
```