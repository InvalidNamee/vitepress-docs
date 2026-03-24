---
title: 2025春训第十七场
---
# 2025春训第十七场

## A. 最大公约数

直接枚举 1 ~ n 对于每一个数从他不等于自己的约数里面找个最大的，然后全部取个 max。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int n, res = 1;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int l = sqrt(i);
        for (int j = 2; j <= l; ++j) {
            if (i % j == 0) {
                res = max(res, i / j);
                break;
            }
        }
    }
    cout << res << endl;
    return 0;
}
```

## B. 数的变换

非常的水。

* 约数中每有一个约数 2，次数 + 1；
    
* 每有一个约数 3，次数 + 2（因为算完之后还需要处理造出来的一个 2；
    
* 每有一个约数 5，次数 + 3（因为算完之后还需要处理造出来的两个 2）；
    

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long n, t = 0;
        scanf("%lld", &n);
        while (n % 5 == 0) n /= 5, t += 3;
        while (n % 3 == 0) n /= 3, t += 2;
        while (n % 2 == 0) n /= 2, t ++;
        if (n == 1)
            printf("%lld\n", t);
        else
            printf("-1\n");
    }
    return 0;
}
```

## C. 回文

这道题其实可以直接暴力，因为一共只可能有 $\binom{2}{26}$种可能的不能配对的方式，于是就有不多于 $\binom{2}{26}^2$种可能的交换情况，于是直接枚举所有情况交换即可。

```cpp
#include <iostream>
#include <algorithm>
#include <map>

using namespace std;

int a[26];
map<pair<int, int>, int> mp;
int mn = 0x3f3f3f3f;

int ord(char c) {
    return c - 'a';
}

long long getmin(int x, int y) {
    return min(min(a[x], a[y]), mn * 2);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 0; i < 26; ++i) {
        cin >> a[i];
        mn = min(mn, a[i]);
    }
    string s;
    cin >> s;
    s = ' ' + s;
    long long res = 0;
    for (int i = 1; i <= (n / 2); ++i) {
        if (s[i] != s[n - i + 1]) {
            res += min(min(a[ord(s[i])], a[ord(s[n - i + 1])]), mn * 2);
            int lv = ord(s[i]), rv = ord(s[n - i + 1]);
            if (lv > rv) swap(lv, rv);
            mp[{lv, rv}]++;
        }
    }
    long long ss = 0;
    for (auto [p, t] : mp) {
        if (t > 1) {
            ss = min(ss, -2ll * min(min(a[p.first], a[p.second]), mn * 2));
        }
        for (auto [pp, _] : mp) {
            if (pp == p) continue;
            ss = min(ss,
                min(
                    getmin(p.first, pp.first) + getmin(p.first, pp.second),
                    getmin(p.first, pp.second) + getmin(p.second, pp.first)
                ) - getmin(p.first, p.second) - getmin(pp.first, pp.second)
            );
        }
    }
    res = min(res, res + ss);
    cout << res << endl;
    return 0;
}
```

## E. 船长的自助餐

一道数据比较友好的 dp 题，至于我为什么在红温，当然是没好好读题就去做了 😇😇😇

连着吃 $\lceil \log_{\frac{2}{3}}{M} \rceil$次胃容量就变成 0 了，当然如果你没发现这个，直接把胃容量整个当一个状态塞进去应该也是不会 TLE 的，如果能离散化一下会更快。

记 $f_{i, j, 1}$ 为吃到第 i 天，已经连续吃了 j 次，并且第 i 天吃了的情况下能吃的最大值； $f_{i, j, 0}$ 为第 i 天没吃的情况下的最大值。

$$
f_{i, 1, 0} = \max \{ f_{i - 1, j, 0} \}
$$

$$
f_{i, j, 0} = \max \{f_{i - 1, j, 0}, f_{i - 1, j, 1} \} \ (j \neq 1)
$$

$$
f_{i, j, 1} = \max\{f_{i - 1, j, 0} + \min \{m_j, A_i\}, f_{i - 1, j - 1, 1} + \min \{m_j, a_i \} \} \ (m_j = \text{连续吃了} j \text{次后胃容量})
$$

```cpp
#include <iostream>
#define int long long

using namespace std;

const int N = 1010;

int n, m[70], a[N];
long long f[N][70][2];

signed main() {
    scanf("%lld%lld", &n, &m[1]);
    int l;
    for (l = 2; m[l - 1]; ++l) m[l] = m[l - 1] * 2 / 3;
    l--;
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= l; ++j) {
            f[i][1][0] = max(f[i][1][0], f[i - 1][j][0]);
        }
        for (int j = 1; j <= l; ++j) {
            f[i][j][0] = max(f[i][j][0], max(f[i - 1][j][0], f[i - 1][j][1]));
        }
        f[i][1][1] = f[i - 1][1][0] + min(m[1], a[i]);
        for (int j = 2; j <= l; ++j) {
            f[i][j][1] = max(f[i - 1][j][0] + min(m[j], a[i]), f[i - 1][j - 1][1] + min(m[j], a[i]));
        }
    }
    long long res = 0;
    for (int i = 1; i <= l; ++i) {
        res = max(res, max(f[n][i][0], f[n][i][1]));
    }
    printf("%lld\n", res);
    return 0;
}
```