---
title: 2026寒假个人训练赛第一场
---
# 2026寒假个人训练赛第一场

前面四道是 CSP-X 2025 山东，后面两道是从 CSP-J 2025 里面选的。

## A. 评奖

[洛谷](https://www.luogu.com.cn/problem/B4425)

简单模拟。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;

int a[N], b[N], c[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    for (int i = 1; i <= n; ++i) cin >> c[i];
    int t1 = 0, t2 = 0;
    for (int i = 1; i <= n; ++i) {
        int t[] = {a[i], b[i], c[i]};
        sort(t, t + 3);
        if (t[0] == 100) t1++;
        else if (t[0] >= 90 && t[1] >= 95) t2++;
    }
    cout << t1 << ' ' << t2 << endl;
    return 0;
}
```

## B. IOI 串

[洛谷](https://www.luogu.com.cn/problem/B4426)

$n^2$ 枚举分隔点即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 5010;
int pre[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    s = " " + s;
    for (int i = 1; i < s.length(); ++i) {
        pre[i] = pre[i - 1] + (s[i] == 'O');
    }
    int res = s.length();
    for (int i = 1; i < s.length(); ++i) {
        for (int j = i + 2; j < s.length(); ++j) {
            res = min(res, pre[i] + pre[s.length() - 1] - pre[j - 1] + (j - i - 1) - (pre[j - 1] - pre[i]));
        }
    }
    cout << res << endl;
    return 0;
}
```


## C. 能量水晶

[洛谷](https://www.luogu.com.cn/problem/B4427)

> [!NOTE]
> 我简直是🐷，做红温了，吃了 5 发罚时。我从一开始就把堆的大小限制成了 $k$（应该限制成 $m$），后来检查的时候都没发现。我一开始写的二分，我就怀疑二分不行，又重构成暴力，最后做完剩下三道了检查了半天才猛然发现，我堆的大小限制错了。

注意到 $a_i$ 很小，可以枚举一个最大值把所有的小行星的水晶全拆的不小大于这个值，然后选最后 $k$ 个，所有情况取一个 max 即可。如果 $a_i$ 变大了同样可以通过二分找到这个值。


```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <algorithm>

using namespace std;

const int N = 2010;

int a[N], b[N], c[N];
int n, m, k;

int check(int mid) {
    int res = 0;
    memcpy(c, b, sizeof(b));
    priority_queue<int, vector<int>, greater<int>> q;
    for (int i = 1; i <= m; ++i) {
        if (b[i] <= mid) {
            q.emplace(b[i]);
        }
        else {
            while (b[i] > mid && (q.size() < m || q.top() < min(b[i] - mid, mid))) {
                if (q.size() == m) q.pop();
                q.emplace(min(b[i] - mid, mid));
                b[i] -= min(b[i] - mid, mid);
            }
            q.emplace(b[i]);
        }
    }
    int r = 0;
    while (q.size() > m) q.pop();
    for (int i = 0; i < k; ++i) {
        if (q.empty()) break;
        r += q.top();
        q.pop();
    }
    memcpy(b, c, sizeof(b));
    return r;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m >> k;
    if (k == 0) {
        cout << 0 << endl;
        return 0;
    }
    for (int i = 1; i <= n; ++i) cin >> a[i];
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= m; ++i) {
        b[i] = n - m + i >= 1 ? a[n - m + i] : 0;
    }
    int res = 0;
    for (int l = 0; l <= 2000; ++l) {
        res = max(res, check(l));
    }
    cout << res << endl;
    return 0;
}
```

## D. 勇者斗恶龙

[洛谷](https://www.luogu.com.cn/problem/B4428)

不难发现任何一个勇者想要和两边都不一样至多只会提升 2 次，所以就可以做线性 dp 了，维护第 $i$ 个勇者提升 $j (j \le 2)$ 时前 $i$ 个勇者不冲突的最少代价。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 200010;
LL f[N][3];
int a[N], b[N];


int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    a[0] = -123123;
    for (int i = 1; i <= n; ++i) cin >> a[i] >> b[i];
    memset(f, 0x3f, sizeof(f));
    f[0][0] = f[0][1] = f[0][2] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 3; ++j) {
            for (int k = 0; k < 3; ++k) {
                if (a[i - 1] + k != a[i] + j) {
                    f[i][j] = min(f[i][j], f[i - 1][k] + b[i] * j);
                }
            }
        }
    }
    cout << min(f[n][1], min(f[n][2], f[n][0])) << endl;
    return 0;
}
```

## E. 异或和

[洛谷](https://www.luogu.com.cn/problem/P14359)

容易证明贪心是对的，从左往右扫一遍，假设现在扫到了 $i$，如果 $[1, i]$ 的后缀异或和里面有一个是 $k$ 就直接选掉一定不劣。这个后缀可以用 set + 懒标记维护。

```cpp
#include <iostream>
#include <set>

using namespace std;

typedef long long LL;
set<LL> s;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    LL k, cur = 0, res = 0;
    cin >> n >> k;
    s.insert(0);
    for (int i = 1; i <= n; ++i) {
        LL t;
        cin >> t;
        if (s.find(cur ^ t ^ k) != s.end()) {
            res++;
            s.clear();
            s.insert(0);
            cur = 0;
            // cout << i << " ";
        }
        else {
            cur ^= t;
            s.insert(cur);
        }
    }
    cout << res << endl;
    return 0;
}
```

## F. 多边形

[洛谷](https://www.luogu.com.cn/problem/P14360)

如果将 $m$ 根从小到大排序，他的条件等价为

$$
m \ge 3\ \land\ \sum_{i = 1}^{m - 1}{l_i} > l_m
$$

先从小到大排序，用 dp 维护 $f_{i, j, k}$: 前 $i$ 根里面选了 $k$ 根，且长度和为 $j$ 的方案数。由于单根长度最大只有 5000，所以太大的 $j$ 直接归到 5001 里面即可；我们只关注是否够三根，所以太大的 $k$ 全部归到 2 里面即可。现在时间复杂度是 $O(n \cdot \max{a_i})$，可以过了。但是 UPC 的 oj 限制内存 `128MB`，可能会爆掉，开个滚动数组优化一下即可。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 5010, MOD = 998244353;

int a[N];
LL f[2][N * 2][3];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    sort(a + 1, a + n + 1);
    LL res = 0;
    f[0][0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = a[i] + 1; j <= 5001; ++j) {
            res = (res + f[0][j][2]) % MOD;
        }
        memset(f[1], 0, sizeof(f[1]));
        for (int k = 0; k < 3; ++k) {
            for (int j = 0; j <= 5001; ++j) {
                auto &t = f[1][min(j + a[i], 5001)][min(k + 1, 2)];
                t = (t + f[0][j][k]) % MOD;
                f[1][j][k] = (f[1][j][k] + f[0][j][k]) % MOD;
                // if (j < 10) cout << f[1][j][k] << ' ';
            }
            // cout << endl;
        }
        // cout << endl;
        swap(f[0], f[1]);
    }
    cout << res << endl;
    return 0;
}
```