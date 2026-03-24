---
title: 2025夏季个人训练赛第九场
---
# 2025夏季个人训练赛第九场

## C. 水王的奇妙集合

权值线段树。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;

int tr[N * 4];

void pushup(int u) {
    tr[u] = tr[u << 1] + tr[u << 1 | 1];
}

void modify(int u, int l, int r, int p, int val) {
    if (l == r) tr[u] += val;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, val);
        else modify(u << 1 | 1, mid + 1, r, p, val);
        pushup(u);
    }
}

int query(int u, int l, int r, int k) {
    if (l == r) return l;
    else {
        int mid = l + r >> 1;
        if (tr[u << 1] >= k) return query(u << 1, l, mid, k);
        else return query(u << 1 | 1, mid + 1, r, k - tr[u << 1]);
    }
}

void print(int u, int l, int r) {
    if (l == r) printf("%d ", tr[u]);
    else {
        int mid = l + r >> 1;
        print(u << 1, l, mid), print(u << 1 | 1, mid + 1, r);
    }
}

int main() {
    int n, q;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        int val;
        scanf("%d", &val);
        modify(1, 1, n, val, 1);
    }
    for (int i = 1; i <= q; ++i) {
        int val;
        scanf("%d", &val);
        if (val >= 1 && val <= n) modify(1, 1, n, val, 1);
        else modify(1, 1, n, query(1, 1, n, -val), -1); 
    }
    if (tr[1]) printf("%d\n", query(1, 1, n, 1));
    else printf("0\n");
    return 0;
}
```

## D. 探险

每个房间都求一遍，找最短的那个。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1000010;

int main() {
    int n, res = 0x3f3f3f3f;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int a, b;
        scanf("%d%d", &a, &b);
        res = min(res, a + (b - 1) / 2);
    }
    printf("%d\n", res);
    return 0;
}
```

## F. 最大得分

a 和 b 取最小公倍数，公共位置随意，仅 a 有的位置尽量大，仅 b 有的位置尽量小，其实就变成了两个等差数列作差。

```cpp
#include <iostream>

using namespace std;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int main() {
    int n, a, b;
    scanf("%d%d%d", &n, &a, &b);
    long long t = (long long)a * b / gcd(a, b);
    int add = n / a - n / t, dec = n / b - n / t;
    printf("%lld\n", (long long)(n + n - add + 1) * add / 2 - (long long)(1 + dec) * dec / 2);
    return 0;
}
```

## G. 送分题（give）

第十场 E 题的简化版，详细的推导见[这里](https://invalidnamee.github.io//p/2025sp10/#e-愿此行终抵群星)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int MOD = 1000000007; // 从第十场过来的记得改模数qwq
const int N = 3010, M = 2000010;

int power(int n, int p) {
    long long res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int jc[M], inv[M];
int f[N];
pair<int, int> p[N];

int c(int n, int m) {
    return 1LL * jc[n] * inv[m] % MOD * inv[n - m] % MOD;
}

int way(pair<int, int> a, pair<int, int> b) {
    return c(b.second + b.first - a.second - a.first, b.second - a.second);
}

bool le(pair<int, int> a, pair<int, int> b) {
    return a.first <= b.first && a.second <= b.second;
}

int main() {
    jc[0] = inv[0] = 1;
    for (int i = 1; i <= 2000000; ++i) {
        jc[i] = 1LL * jc[i - 1] * i % MOD;
        inv[i] = power(jc[i], MOD - 2);
    }
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i <= k; ++i) {
        scanf("%d%d", &p[i].first, &p[i].second);
    }
    sort(p + 1, p + k + 1);
    p[k + 1] = {m, n};
    p[0] = {1, 1};
    f[0] = 1;
    for (int i = 1; i <= k + 1; ++i) {
        f[i] = way(p[0], p[i]);
        for (int j = 1; j < i; ++j) {
            if (le(p[j], p[i])) {
                f[i] = (f[i] - (1LL * f[j] * way(p[j], p[i]) % MOD) + MOD) % MOD;
            }
        }
    }
    printf("%d\n", f[k + 1]);
    return 0;
}
```