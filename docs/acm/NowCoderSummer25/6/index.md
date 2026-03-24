---
title: 2025牛客暑期多校训练营6
---
# 2025牛客暑期多校训练营6

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 5 |
| 赛后补 | 1 |

排名是 161，这场配合明显比之前好一点了，能做出来的基本上都做了，没有很大的遗憾了

## B. Base Conversion Master

这么简单的题，一直没人做，最后被我捡了个漏……就是一个二分，唯一需要考虑的地方就是怎么防止非法数据把 long long 炸掉。

```cpp
#include <iostream>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 200010;
vector<LL> a[N];
int n;
LL y, M;

LL calc(LL s) {
    __int128_t cur = 0;
    for (int i = 1; i <= n; ++i) {
        cur = 0;
        for (int j : a[i]) {
            if (j >= s) return -1;
            cur = cur * s + j;
            if (cur >= 1000000010) {
                cur = 1000000010;
                break;
            }
        }
        s = cur;
    }
    return s;
}

LL checkl(LL s) {
    __int128_t cur = 0;
    for (int i = 1; i <= n; ++i) {
        cur = 0;
        for (int j : a[i]) {
            if (j >= s) return false;
            cur = cur * s + j;
            if (cur >= 1000000010) {
                cur = 1000000010;
                break;
            }
        }
        s = cur;
    }
    return s >= y;
}

LL checkr(LL s) {
    __int128_t cur = 0;
    for (int i = 1; i <= n; ++i) {
        cur = 0;
        for (int j : a[i]) {
            if (j >= s) return true;
            cur = cur * s + j;
            if (cur >= 1000000010) {
                cur = 1000000010;
                break;
            }
        }
        s = cur;
    }
    return s <= y;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        scanf("%d%lld%lld", &n, &y, &M);
        for (int i = 1; i <= n; ++i) {
            int k;
            scanf("%d", &k);
            a[i].resize(k);
            for (int j = 0; j < k; ++j) scanf("%lld", &a[i][j]);
        }
        // zuo bian jie
        LL l = 2, r = M;
        while (l < r) {
            LL mid = l + r >> 1;
            if (checkl(mid)) r = mid;
            else l = mid + 1;
        }
        LL rr = calc(l);
        if (rr == -1 || rr != y) {
            printf("-1 -1\n");
            continue;
        }
        else printf("%lld ", l);
        // you bian jie
        l = 2, r = M;
        while (l < r) {
            LL mid = l + r + 1 >> 1;
            if (checkr(mid)) l = mid;
            else r = mid - 1;
        }
        printf("%lld\n", r);
    }
    return 0;
}
```

## C. Stack <sup style="color: blue">队友</sup>

刚开始我卡了一会儿，讨论的时候我受到只考虑最后一个数的位置的启发想出来了正解，两个人的思路整合一下就完整了。

```cpp
#include <iostream>

using namespace std;

const int N = 500010;
const int MOD = 998244353;

long long f[N][4];

int main() {
    f[0][0] = 1;
    for (int i = 1; i <= 500000; ++i) {
        f[i][0] = f[i - 1][0] * i % MOD;
        f[i][1] = (f[i - 1][1] * i % MOD + f[i - 1][0] % MOD) % MOD;
        f[i][2] = (f[i - 1][2] * (i - 1) % MOD + f[i - 1][0] + 2LL * f[i - 1][1] + f[i - 1][2]) % MOD;
        f[i][3] = (f[i - 1][3] * (i - 1) % MOD + f[i - 1][0] + 3LL * f[i - 1][1] + 3LL * f[i - 1][2] + f[i - 1][3]) % MOD;
    }
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        printf("%lld\n", f[n][3]);
    }
    return 0;
}
```

## D. Beautiful Matrix <sup style="color: blue">队友</sup>

我感觉挺难的，我没反应过来就已经被队友秒了，数学题的思路都挺巧的，两次差分转化了一下，思路就会变清晰了。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int MOD = 998244353;

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int main() {
    LL n, m;
    cin >> n >> m;
    LL a = 1, b = 1;
    for (int i = 1; i <= m; ++i) {
        a = a * (((n - 1) * n + m - i + 1) % MOD) % MOD;
        b = b * i % MOD;
    }
    cout << a * power(b, MOD - 2) % MOD << endl;
    return 0;
}
```

## G. Turn around <sup style="color: red">补</sup>

学到了**广义矩阵**，这道题用 max 和 加法 替代了原来的 加法 和 乘法，这个规则下的矩阵乘法依然满足结合律，之后开了线段树维护每个位置的转移矩阵。

又被边界卡了qwq，因为全是 L 的时候没有一个 R 把矩阵的 a<sub>2, 1</sub> 变成 -∞，然后就出错了。

```cpp
#include <iostream>

using namespace std;

struct mat {
    int a[2][2] = {};

    int res() {
        return max(0, a[1][0]);
    }
};

mat operator * (mat a, mat b) {
    mat c = {{{-0x3f3f3f3f, -0x3f3f3f3f}, {-0x3f3f3f3f, -0x3f3f3f3f}}};
    for (int k = 0; k < 2; ++k) {
        for (int i = 0; i < 2; ++i) {
            for (int j = 0; j < 2; ++j) {
                c.a[i][j] = max(c.a[i][j], a.a[i][k] + b.a[k][j]);
            }
        }
    }
    return c;
}
const int N = 200010;
const mat L = {{{1, -0x3f3f3f3f}, {0, 0}}}, R = {{{0, -0x3f3f3f3f}, {-0x3f3f3f3f, 1}}};

mat tr[N * 4];
char s[N];

void pushup(int u) {
    tr[u] = tr[u << 1] * tr[u << 1 | 1];
}

void init(int u, int l, int r) {
    if (l == r) tr[u] = s[l] == 'L' ? L : R;
    else {
        int mid = l + r >> 1;
        init(u << 1, l, mid), init(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

void modify(int u, int l, int r, int p, mat v, int w) {
    if (l == r) tr[u] = v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v, w);
        else modify(u << 1 | 1, mid + 1, r, p, v, w);
        pushup(u);
    }
}

int main() {
    int n, m, cnt = 0;
    scanf("%d%d%s", &n, &m, s + 1);
    init(1, 1, n);
    for (int i = 1; i <= n; ++i) {
        cnt += s[i] == 'L';
    }
    while (m--) {
        int p;
        scanf("%d", &p);
        if (s[p] == 'L') {
            s[p] = 'R';
            cnt--;
            modify(1, 1, n, p, R, 0);
        }
        else {
            cnt++;
            s[p] = 'L';
            modify(1, 1, n, p, L, 1);
        }
        printf("%d\n", cnt == n ? 0 : tr[1].res());
    }
    return 0;
}
```

## K. Maximum GCD

这道题是我想的，但是 WA 两次，我是战犯😭

- 第一次是因为里面的边界没处理好，少算了边界情况；
- 第二次是因为第一次改了之后判 0 又出问题了。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1000010;
int a[N];
int tr[N * 4];
int suf[N], p[N];

void init(int u, int l, int r) {
    if (l == r) tr[u] = a[l] - a[l - 1];
    else {
        int mid = l + r >> 1;
        init(u << 1, l, mid), init(u << 1 | 1, mid + 1, r);
        tr[u] = __gcd(tr[u << 1], tr[u << 1 | 1]);
    }
}

int query(int u, int l, int r, int ql, int qr) {
    if (ql > qr) return 0;
    else if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1, res = 0;
        if (ql <= mid) res = __gcd(res, query(u << 1, l, mid, ql, qr));
        if (qr > mid) res = __gcd(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
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

        bool f = true;
        for (int i = 1; i <= n; ++i) {
            if (a[i] != a[1]) {
                f = false;
                break;
            }
        }
        if (f) {
            printf("0\n");
            continue;
        }

        int g = 0, len = 0;
        for (int i = n; i; --i) {
            int tg = __gcd(g, a[i]);
            if (tg < g) {
                len++;
                suf[len] = g;
                p[len] = i + 1;
            }
            g = tg;
        }
        g = 0;
        init(1, 1, n);
        int res = query(1, 1, n, 2, n);
        for (int i = 1; i <= n; ++i) {
            res = max(res, abs(__gcd(g, query(1, 1, n, i + 1, n))));
            for (int j = 1; j <= len; ++j) {
                res = max(res, abs(__gcd(g, __gcd(query(1, 1, n, i + 1, p[j] - 1), suf[j]))));
                if (i > p[j] - 1) break;
            }
            g = __gcd(g, a[i]);
        }
        printf("%d\n", res);
    }
    return 0;
}
```
## L. Minimum Parenthesis String <sup style="color: blue">队友</sup>

这道水一点，就是一个贪心。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 100010;
pair<int, int> a[N];
int b[N * 2];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m; 
        scanf("%d%d", &n, &m);
        memset(b, 0, sizeof(int) * (n * 2 + 1));
        for (int i = 1; i <= m; ++i) {
            scanf("%d%d", &a[i].first, &a[i].second);
        }
        sort(a + 1, a + m + 1, greater<pair<int, int>>());
        int cnt = 0, ls = n * 2 + 1;
        for (int i = 1; i <= m; ++i) {
            if (a[i].first <= ls && ls <= a[i].second) continue;
            else {
                b[a[i].first] = 1;
                cnt++;
                ls = a[i].first;
            }
        }
        if (cnt > n) printf("-1\n");
        else {
            bool valid = true;
            int cur = 0;
            cnt = n - cnt;
            for (int i = 1; i <= n * 2; ++i) {
                if (!b[i] && cnt) b[i] = 1, cnt--;
                cur += b[i] ? 1 : -1;
                if (cur < 0) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                for (int i = 1; i <= n * 2; ++i) {
                    putchar(b[i] ? '(' : ')');
                }
                putchar('\n');
            }
            else {
                printf("-1\n");
            }
        }
    }
    return 0;
}
```