---
title: 2026 蓝桥杯省赛 A 组
---
# 2026 蓝桥杯省赛 A 组

## 一些感想

[洛谷自测](https://www.luogu.com.cn/contest/320702#problems)

整体来说感觉非常的水（符合我对蓝桥杯的一贯印象），我大概 2:30 做完了除了 B 的所有题，期间在 E 和 F 稍微卡了一下。然后很戏剧性的一幕是我上来就非常自信的 A 从来没检查过，然后错了；我最后猜 B 的结论猜对了，但是因为不会用配置高达 i5 4xxx 的 32 位 win7 的命令行，我把 2048 照着敲敲错了，然后 wa 了。然后我的 H 疑似嘌呤顺序写的和题面有出入，对拍检查的时候直接复制了那个有出入的映射，导致没查出来，g 和 c 反了，感觉会挂一些点。

## A. 均衡数

注意到 `2026202620262026` 的二进制表示有 51 位，是奇数，但是“均衡数“只能是偶数位，所以要么是最大的 50 位，要么是最小的 52 位，都试一下就会发现答案是 52 位的这个（但是我说服自己选择了 50 位的那个😭）。

答案该是这个

```
2251799847239679
```

## B. 量子 2048

不妨按行填，打表可以发现第一行确定了之后下面每一行的 0 和 1 的相对位置都是定死的，但是每一行都能反转。第一行有奇数个 Q 的方案数是 $2^{2048 - 1}$(所有的 m 为奇数的组合数的和)；剩下每行都能反转所以乘 $2^{2048 - 1}$。这样不能保证列都是奇的，如果是偶的，把最后一列反转一定就会变成奇的，所以在除以 2，答案是 $2^{2048 * 2 - 3}$.

```
618395416
```

## C. 拦截程序

取中点，距离上取整。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        LL l, v, t;
        cin >> l >> v >> t;
        cout << (abs(v * t - (l - v * t)) + 1 >> 1) << endl;
    }
    return 0;
}
```

## D. 切割木材

已知一个答案很容易验证是否合法，如果一个答案合法，那么比他大的都合法，满足单调性。二分答案即可。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 1000010;

LL a[N];
int n, k;

bool check(LL mid) {
    LL t = 0;
    for (int i = 1; i <= n; ++i) {
        t += (a[i] + mid - 1) / mid - 1;
    }
    return t <= k;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    LL l = 0, r = 1000000000;
    while (l < r) {
        LL mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    cout << l << endl;
    return 0;
}
```

## E. 读取指令

首先排除掉不可能的 $w \mod c \neq 0$ 和 $\frac{1}{2}n (n + 1) c < w$，然后特判一下 w = 0 的时候输出 0，剩下的情况 $w = \frac{w}{c}$，这样就转成了从 1 到 n 找最少的连续区间凑出一个 w 的问题。打表发现两段连续的区间就可以表达 $[1, \frac{1}{2}n(n + 1)]$ 内的所有数了，所以只需要检查是否可以有一段连续的区间表示。枚举左端点，二分右端点依次检查答案即可，如果可以就是 1，不行就是 2。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        LL n, c, w;
        cin >> n >> c >> w;
        if (w % c != 0 || w > (n + 1) * n / 2 * c) cout << -1 << endl;
        else if (w == 0) cout << 0 << endl;
        else {
            w /= c;
            bool f = false;
            for (LL i = 1; i <= n; ++i) {
                LL l = i, r = n;
                while (l < r) {
                    LL mid = l + r >> 1;
                    if ((i + mid) * (mid - i + 1) / 2 >= w) r = mid;
                    else l = mid + 1;
                }
                if ((i + l) * (l - i + 1) / 2 == w) {
                    f = true;
                    break;
                }
            }
            if (f) cout << 1 << endl;
            else cout << 2 << endl;
        }
    }
    return 0;
}
```

## F. 外卖配送

发现是个背包 DP，先预处理一下不同批次大小的最快处理时间（批次大小一样，有更快的不可能选慢的），然后就和无穷背包一模一样了。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 5010;
LL a[N], f[N];

int main() {
    int n, m, x;
    cin >> n >> m >> x;
    memset(a, 0x3f, sizeof(a));
    memset(f, 0x3f, sizeof(f));
    for (int i = 1; i <= m; ++i) {
        LL aa, bb;
        cin >> aa >> bb;
        for (int j = 1; j <= n; ++j) {
            a[j] = min(a[j], bb * j * (j - 1) / 2 + aa * j);
        }
    }
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < i; ++j) {
            f[i] = min(f[i], f[j] + a[i - j] + x);
        }
    }
    cout << f[n] - x << endl;
    return 0;
}
```

## G. 综合应变指标

~~我的线性做法似乎激发了 [Moscenix](https://moscenix.cn/) 的好胜心，但是只能证明这个线性的做法更巧妙。~~

考虑去绝对值，分类讨论取他自己和取相反数的情况，最优解肯定是不会取到不符合绝对值定义的一个区间取成负的的情况的。具体的维护 $f_{i, j, k}$ 表示前 i 个取到第 j 组了当前组 (k ? 是 : 否) 取相反数的情况下的和的最大值。

更新考虑从上一组转移过来（这时候上一组选自己和相反数都不影响）还是接着填这一组（这里符号要和 k 的限制保持一致）。

$$
\begin{align}
    f_{i, j, 0} &= \min\{f_{i - 1, j - 1, 0}, f_{i - 1, j - 1, 1}, f_{i - 1, j, 0}\} + a_i\\
    f_{i, j, 1} &= \min\{f_{i - 1, j - 1, 0}, f_{i - 1, j - 1, 1}, f_{i - 1, j, 1}\} - a_i
\end{align}
$$

```cpp
#include <iostream>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 100010;

LL f[N][4][2], a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    memset(f, -0x3f, sizeof(f));
    f[0][0][1] = f[0][0][0] = 0;
    for (int i = 1; i <= n; ++i) {
        f[i][0][0] = f[i - 1][0][0] + a[i];
        f[i][0][1] = f[i - 1][0][1] - a[i];
        for (int j = 1; j < 4; ++j) {
            f[i][j][0] = max(max(f[i - 1][j - 1][0], f[i - 1][j - 1][1]), f[i - 1][j][0]) + a[i];
            f[i][j][1] = max(max(f[i - 1][j - 1][0], f[i - 1][j - 1][1]), f[i - 1][j][1]) - a[i];
        }
    }
    cout << max(f[n][3][0], f[n][3][1]) << endl;
    return 0;
}
```

## H. 基因研究

这题我感觉我之前做过更复杂的。考虑 DP，维护 $f_{i, j}$ 表示前 i 个的后缀已经匹配了目标串的前 j 个的概率，状态转移考虑枚举 i 和 j 然后枚举最后一位填什么（记为 k）。同一个状态最后一位填不同的值转移到的状态会不一样，找这个目标状态的过程其实和 KMP 的过程是一样的。

```cpp
#include <iostream>
#include <map>

using namespace std;

typedef long long LL;
const int N = 3010;
const int MOD = 998244353;

map<char, int> mp = {{'A', 0}, {'T', 1}, {'G', 2}, {'C', 3}};
LL f[N][N], a[N][4];
int b[N], ne[N], g[N][N];

int main() {
    int n, m;
    string s;
    cin >> n >> m >> s;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 4; ++j) {
            cin >> a[i][j];
        }
    }
    for (int i = 0; i < m; ++i) b[i] = mp[s[i]];
    for (int i = 2, j = 0; i <= m; ++i) {
        while (j && b[i - 1] != b[j]) j = ne[j];
        if (b[i - 1] == b[j]) j++;
        ne[i] = j;
    }
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < 4; ++j) {
            int k = i;
            while (k && b[k] != j) k = ne[k];
            if (b[k] == j) k++;
            g[i][j] = k;
        }
    }
    f[0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < m; ++j) {
            for (int k = 0; k < 4; ++k) {
                f[i][g[j][k]] = (f[i][g[j][k]] + f[i - 1][j] * a[i][k]) % MOD;
            }
        }
        f[i][m] = (f[i][m] + f[i - 1][m]) % MOD;
    }
    cout << f[n][m] << endl;
    return 0;
}
```