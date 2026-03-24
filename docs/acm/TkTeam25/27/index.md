---
title: 2025组队训练赛第 27 场
---
# 2025组队训练赛第 27 场

## A. Super-palindrome

只能全是一个字母或者两个字母交替出现，可以直接枚举。

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
        int res = s.length();
        for (char a = 'a'; a <= 'z'; ++a) {
            for (char b = 'a'; b <= 'z'; ++b) {
                int tt = 0;
                char t[] = {a, b};
                for (int i = 0; i < s.length(); ++i) {
                    tt += s[i] != t[i & 1];
                }
                res = min(res, tt);
            }
        }
        cout << res << endl;
    }
    return 0;
}
```

## B. Master of Phi

一个质因数只要出现过，那就是等价的，问题等价于计算每一种组合的 $\prod q_i \cdot \sum \left(1 - \frac{1}{p_i}\right)$，暴力的做就是直接用一个 bitmask 枚举所有的可能的组合，但是正好会被卡常，于是可以选择用线性 dp，$f_i$ 表示前 i 个素数累计的值，转移考虑分类讨论当前选和不选，如果选就乘 $q_i \cdot \left(1 - \frac{1}{p_i}\right)$。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int MOD = 998244353;
const int N = 20;

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int p[N], q[N], inv[N];
LL f[N];

void solve() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        scanf("%d%d", &p[i], &q[i]);
        inv[i] = power(p[i], MOD - 2);
    }
    LL res = 0, bs = 1;
    for (int i = 0; i < n; ++i) {
        bs = bs * power(p[i], q[i]) % MOD;
    }
    f[0] = 1;
    for (int i = 1; i <= n; ++i) {
        f[i] = f[i - 1] * (((1LL - inv[i - 1] + MOD) % MOD * q[i - 1] + 1) % MOD) % MOD;
    }
    printf("%lld\n", f[n] * bs % MOD);
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

## C. Hakase and Nano

## D. Master of Random

设 f 为子树和的期望，从后往前以第 i 每个点为根的子树都可能给前面的贡献 $\frac{f_i}{i - 1}$，做一个后缀和维护。

```cpp
#include <iostream>
#include <cstring>
using namespace std;
typedef long long LL;
const int N = 100010;
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

int a[N];
LL f[N], g[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        memset(f, 0, sizeof(f));
        memset(g, 0, sizeof(g));
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        for (int i = n; i; --i) {
            g[i] = (g[i] + g[i + 1]) % MOD;
            f[i] = (g[i] + a[i]) % MOD;
            g[i - 1] = power(i - 1, MOD - 2) * f[i] % MOD;
        }
        LL res = 0;
        for (int i = 1; i <= n; ++i) {
            res = (res + f[i]) % MOD;
        }
        res = (res * power(n, MOD - 2)) % MOD;
        printf("%lld\n", res);
    }
    return 0;
}
```

## J. Master of GCD

只需要差分前缀和统计 2 和 3 的个数，分别取 min，然后快速幂在乘起来。

```cpp
#include <iostream>
#include <cstring>

using namespace std;
typedef long long LL;
const int N = 100010;
const int MOD = 998244353;
int s1[N], s2[N];

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
    int T;
    scanf("%d", &T);
    while (T--) {
        memset(s1, 0, sizeof(s1));
        memset(s2, 0, sizeof(s2));
        int n, m;
        scanf("%d%d", &n, &m);
        while (m--) {
            int l, r, p;
            scanf("%d%d%d", &l, &r, &p);
            if (p == 2) s1[l]++, s1[r + 1]--;
            else s2[l]++, s2[r + 1]--;
        }
        int c1 = 0x3f3f3f3f, c2 = 0x3f3f3f3f;
        for (int i = 1; i <= n; ++i) {
            s1[i] += s1[i - 1];
            s2[i] += s2[i - 1];
            // cout << s1[i] << ' ' << s2[i] << endl;
            c1 = min(c1, s1[i]);
            c2 = min(c2, s2[i]);
        }
        // cout << c1 << ' ' << c2 << endl;
        // cout << endl;
        printf("%lld\n", power(2, c1) * power(3, c2) % MOD);
    }
    return 0;
}
```

## K. Master of Sequence

a 很小，考虑把下取整用分类讨论消掉。首先对于每一个 a，统计所有的 $\lfloor\frac{b}{a}\rfloor$ 的和，$b \leftarrow b\ \text{mod}\ a$，对于残留的 b，如果 $t\ \text{mod}\ a > b$，结果为分开下取整 + 1，否则为分开下取整之和。维护的是动态的后缀和，可以开树状数组解决。