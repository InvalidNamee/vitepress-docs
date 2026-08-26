---
title: 2025牛客暑期多校训练营7
---
# 2025牛客暑期多校训练营7

时间和 xcpc 系统测试赛撞了，所以是周五 vp 的，大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 5 |
| 赛后补 | 1 |

vp 排名 185，这场打的比较好，最后 I 题差点就调出来了，结束后 3min 一发 A 了，如果当时过了了 I 题排名就 98 了。

## A. Loopy Laggon <sup style="color: blue">队友</sup>

Alice 的旋转不会改变逆序数，外环是一个 12-轮换，内环是一个 4-轮换，可以拆成 11 + 3 = 14 个对换，**不改变逆序数奇偶性**，Bob 随机放置只有 $\frac{1}{2}$ 的概率放对，一套 10 个检查出来的概率是 $1 - \frac{1}{2^{10}}$，可以答对 90%，他没卡暴力求逆序数的方法。

讲题的时候讲了一种 O(n) 判断排列奇偶性的方法，从左往右扫一遍如果有一个数不在他的位置上就换回来，奇偶性取反，直到换完，裸的板子大概是这样的，也记录一下。

```cpp
#include <iostream>

using namespace std;

int a[10], p[10];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        scanf("%d", &a[i]);
        p[a[i]] = i;
    }
    int f = 0;
    for (int i = 0; i < n; ++i) {
        if (a[i] != i + 1) {
            swap(a[i], a[p[i + 1]]);
            swap(p[a[i]], p[a[p[i + 1]]]);
            f ^= 1;
        }
    }
    return 0;
}
```

这是这道题的 AC 代码

```cpp
#include <iostream>

using namespace std;

const int N = 100;
int a[N], p[N];

int main() {
    int id, m, k, n, l;
    scanf("%d%d%d%d", &id, &m, &k, &n);
    l = n * n;
    while (m--) {
        bool f = false;
        for (int t = 0; t < k; ++t) {
            int cnt = 0;
            for (int i = 0; i < l; ++i) {
                scanf("%d", &a[i]);
                p[a[i]] = i;
            }
            for (int i = 0; i < l; ++i) {
                if (a[i] != i + 1) {
                    swap(a[i], a[p[i + 1]]);            
                    swap(p[a[i]], p[a[p[i + 1]]]);
                    cnt ^= 1;
                }
            }
            if (cnt & 1) f = true;
        }
        printf(f ? "1" : "0");
    }
    printf("\n");
    return 0;
}
```

## F. Forsaken City <sup style="color: blue">队友</sup>

一道签到题，枚举 i，答案是 $\max_{1 \le i \le n} \max_{1 \le j < i} - a_i$.

```cpp
#include <iostream>

using namespace std;

const int N = 200010;
int a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, res = 0, mx = 0;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            if (i > 1) res = max(res, mx - a[i]);
            mx = max(mx, a[i]);
        }
        printf("%d\n", res);
    }
    return 0;
}
```

## F. The Correlation

这道题是我写的，而且我是战犯😭

贪心的想，每次取最大最小值一半都能最大程度减少 $\sum_{1 \le i < j \le n} \left|a_i - a_j\right|$，但是我写的时候写了个 (mx - mn) / 2，还得全队吃 2 发罚时，这事可能不完全怪我，但是我确实没想清，旁边说一嘴我就信了……我逃不了主要责任

```cpp
#include <iostream>
#include <algorithm>
#include <climits>

using namespace std;

typedef long long LL;
const int N = 200010;
const int MOD = 998244353;
LL a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%lld", &a[i]);
    LL res = LLONG_MAX;
    for (int t = 0; t < n; ++t) {
        LL mn = LLONG_MAX, mx = LLONG_MIN;
        for (int i = 1; i <= n; ++i) {
            mn = min(a[i], mn), mx = max(a[i], mx);
        }
        int v = (mx + mn) / 2;
        LL pre_s = 0, cur_res = 0;
        for (int i = 1; i <= n; ++i) a[i] = abs(a[i] - v);
        sort(a + 1, a + n + 1);
        for (int i = 1; i <= n; ++i) {
            cur_res = ((cur_res + (LL)a[i] * (i - 1) % MOD - pre_s) % MOD + MOD) % MOD;
            pre_s = (pre_s + a[i]) % MOD;
        }
        res = cur_res;
        bool f = true;
        for (int i = 1; i <= n; ++i) {
            if (a[i] != 0 && a[i] != 1) {
                f = false;
                break;
            }
        }
        if (f) break;
    }
    printf("%lld\n", res);
    return 0;
}
```

## G. Nice Doppelgnger

这题一发过了，某种意义上算是当天把欠的补了吧，最近这是第二个用线筛 dp 的题了，吸取上次写挂的教训，这次一遍就对了。

刚开始还打算打表来着，但是突然注意~~(猜)~~到一个关键性质，如果一个数的幂次为奇数的质因数个数为奇数个，加入集合一定不会和其他两个数组成平方数，队友考虑到有这个性质的数正好一定至少有一半（只考虑 2 的幂次，如果一个数不满足那么他的 2 倍一定满足），遂大胆的写。

```cpp
#include <iostream>
#include <vector>

using namespace std;
const int N = 1000010;
int prime[N], v[N];
bool f[N];

int main() {
    int m = 1000000, l = 0;
    for (int i = 2; i <= m; ++i) {
        if (v[i] == 0) {
            v[i] = i;
            prime[++l] = i;
            f[i] = true;
        }
        for (int j = 1; j <= l; ++j) {
            if (prime[j] > v[i] || prime[j] > m / i) break;
            v[i * prime[j]] = prime[j];
            f[i * prime[j]] = f[i] ^ 1;
        }
    }
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        int lim = n / 2;
        for (int i = 2; i <= n; ++i) {
            if (f[i]) {
                printf("%d ", i);
                lim--;
                if (lim == 0) break;
            }
        }
        printf("\n");
    }
    return 0;
}
```

## I. Lava Layer <sup style="color: red">补</sup>

大型矩阵快速幂加速期望 dp，太恶心了，写的有一种大模拟即视感，最后结束后三分钟队友成功调出来了……

这是期间我写的线性 dp 代码最终版，先调对状态转移方程然后给矩阵对照，大寄了差不多三次

- 位运算逻辑写错，按位或和按位异或不能直接对那个期望值算，应该用后四位和当前数码运算一下加上这个 delta 值 * 概率；
- 大逻辑有问题，除了乘法外的 delta 值要乘上过来的概率，我之前没乘，趁着别人写 A 的时候手算了一个样例验证了新结论正确；
- 还是位运算写错，按位与不是相加而是直接赋值成 (后四位 & 当前数码) * 概率，因为前面的全与掉了。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;
typedef long long LL;
const int N = 1000010;
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
LL f[N][1 << 4], g[N][1 << 4];
vector<LL> s;

int main() {
    LL inv5 = power(5, MOD - 2);
    int T;
    scanf("%d", &T);
    while (T--) {
        LL n;
        int k;
        scanf("%lld%d", &n, &k);
        s.clear();
        s.resize(k);
        for (int i = 0; i < k; ++i) {
            scanf("%lld", &s[i]);
        }
        memset(f, 0, sizeof(f));
        memset(g, 0, sizeof(g));
        LL invk = power(k, MOD - 2);
        for (int i : s) {
            f[0][i & 15] = invk * i % MOD;
            g[0][i & 15] = invk;
        }
        for (int i = 1; i < n; ++i) {
            for (LL msk = 0; msk < (1 << 4); ++msk) {
                for (int j : s) {
                    g[i][(j + msk) & 15] = (g[i][(j + msk) & 15] + g[i - 1][msk] * inv5 % MOD * invk % MOD) % MOD;
                    g[i][(j * msk) & 15] = (g[i][(j * msk) & 15] + g[i - 1][msk] * inv5 % MOD * invk % MOD) % MOD;
                    g[i][(j & msk) & 15] = (g[i][(j & msk) & 15] + g[i - 1][msk] * inv5 % MOD * invk % MOD) % MOD;
                    g[i][(j | msk) & 15] = (g[i][(j | msk) & 15] + g[i - 1][msk] * inv5 % MOD * invk % MOD) % MOD;
                    g[i][(j ^ msk) & 15] = (g[i][(j ^ msk) & 15] + g[i - 1][msk] * inv5 % MOD * invk % MOD) % MOD;

                    f[i][(j + msk) & 15] = (f[i][(j + msk) & 15] + (f[i - 1][msk] + g[i - 1][msk] * j) % MOD * inv5 % MOD * invk % MOD) % MOD;
                    f[i][(j * msk) & 15] = (f[i][(j * msk) & 15] + (f[i - 1][msk] * j) % MOD * inv5 % MOD * invk % MOD) % MOD;
                    f[i][(j & msk) & 15] = (f[i][(j & msk) & 15] + ( g[i - 1][msk] * ((LL)(msk & j))) % MOD * inv5 % MOD * invk % MOD) % MOD;
                    f[i][(j | msk) & 15] = (f[i][(j | msk) & 15] + (f[i - 1][msk] + g[i - 1][msk] * ((LL)(msk | j) - msk + MOD)) % MOD * inv5 % MOD * invk % MOD) % MOD;
                    f[i][(j ^ msk) & 15] = (f[i][(j ^ msk) & 15] + (f[i - 1][msk] + g[i - 1][msk] * ((LL)(msk ^ j) - msk + MOD)) % MOD * inv5 % MOD * invk % MOD) % MOD;
                }
            }
            // for (int msk = 0; msk < (1 << 4); ++msk) {
            //     cout << f[i][msk] << ' ';
            // }
            // cout << endl;
        }
        LL res = 0;
        for (int i = 0; i < (1 << 4); ++i) {
            res = (res + f[n - 1][i]) % MOD;
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

然后转化成向量和矩阵的形式，初始状态一个行向量 $\begin{pmatrix}
    f_0 & g_0    
\end{pmatrix}$ 拼到一起，状态转移方程写成一个矩阵，行号 -> 列号是一次转移初状态到末状态的贡献倍率，没有这一项就填 0.

后来我~~偷~~学了队友怎么开的数组，也自己重写了一版，没有当时的紧张感倒是调的快多了，几乎没出什么问题就过去了。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;
typedef long long LL;
const int MOD = 998244353;
const int N = 32;

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

LL f[N], g[N], a[N][N], b[N][N];
vector<LL> s;

void mul1() {
    memset(g, 0, sizeof(g));
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j) {
            g[i] = (g[i] + a[j][i] * f[j]) % MOD;
        }
    }
    memcpy(f, g, sizeof(f));
}

void mul2() {
    memset(b, 0, sizeof(b));
    for (int k = 0; k < N; ++k) {
        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < N; ++j) {
                b[i][j] = (b[i][j] + a[i][k] * a[k][j]) % MOD;
            }
        }
    }
    memcpy(a, b, sizeof(a));
}

int main() {
    LL inv5 = power(5, MOD - 2);
    int T;
    scanf("%d", &T);
    while (T--) {
        LL n;
        int k;
        scanf("%lld%d", &n, &k);
        LL invk = power(k, MOD - 2), inv5k = invk * inv5 % MOD;
        memset(f, 0, sizeof(f));
        memset(a, 0, sizeof(a));
        s.resize(k);
        for (LL& i : s) {
            scanf("%d", &i);
            f[i] = invk * i % MOD;
            f[i + 16] = invk;
        }
        for (int msk = 0; msk < 16; ++msk) {
            for (LL& i : s) {
                // +
                a[msk][(msk + i) & 15] = (a[msk][(msk + i) & 15] + inv5k) % MOD;
                a[msk + 16][(msk + i) & 15] = (a[msk + 16][(msk + i) & 15] + i * inv5k) % MOD;
                a[msk + 16][((msk + i) & 15) + 16] = (a[msk + 16][((msk + i) & 15) + 16] + inv5k) % MOD;
                // *
                a[msk][(msk * i) & 15] = (a[msk][(msk * i) & 15] + i * inv5k) % MOD;
                a[msk + 16][((msk * i) & 15) + 16] = (a[msk + 16][((msk * i) & 15) + 16] + inv5k) % MOD;
                // &
                a[msk + 16][(msk & i) & 15] = (a[msk + 16][(msk & i) & 15] + (msk & i) * inv5k) % MOD;
                a[msk + 16][((msk & i) & 15) + 16] = (a[msk + 16][((msk & i) & 15) + 16] + inv5k) % MOD;
                // |
                a[msk][(msk | i) & 15] = (a[msk][(msk | i) & 15] + inv5k) % MOD;
                a[msk + 16][(msk | i) & 15] = (a[msk + 16][(msk | i) & 15] + ((i | msk) - msk + MOD) * inv5k) % MOD;
                a[msk + 16][((msk | i) & 15) + 16] = (a[msk + 16][((msk | i) & 15) + 16] + inv5k) % MOD;
                // ^
                a[msk][(msk ^ i) & 15] = (a[msk][(msk ^ i) & 15] + inv5k) % MOD;
                a[msk + 16][(msk ^ i) & 15] = (a[msk + 16][(msk ^ i) & 15] + ((i ^ msk) - msk + MOD) * inv5k) % MOD;
                a[msk + 16][((msk ^ i) & 15) + 16] = (a[msk + 16][((msk ^ i) & 15) + 16] + inv5k) % MOD;
            }
        }
        n--;
        while (n) {
            if (n & 1) mul1();
            mul2();
            n >>= 1;
        }
        LL res = 0;
        for (int i = 0; i < (1 << 4); ++i) {
            res = (res + f[i]) % MOD;
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## J. Ivory <sup style="color: blue">队友</sup>

巧妙的数学题，不断取 b 和 d 中较小的消较大的，利用残余部分互质，留出一个常数提到外面继续递归。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int MOD = 998244353;

LL power(LL n, LL p) {
    n %= MOD;
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

LL gcd(LL a, LL b) {
    return b ? gcd(b, a % b) : a;
}

LL work(LL a, LL b, LL c, LL d) {
    if (a == 1 || c == 1) return 1;
    if (b > d) swap(a, c), swap(b, d);
    LL g = gcd(a, c);
    return power(g, b) * work(a / g, b, g, d - b) % MOD;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        LL a, b, c, d;
        scanf("%lld%lld%lld%lld", &a, &b, &c, &d);
        printf("%lld\n", work(a, b, c, d));
    }
    return 0;
}
```