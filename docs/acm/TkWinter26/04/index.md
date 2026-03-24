---
title: 2026寒假个人训练赛第四场
---
# 2026寒假个人训练赛第四场

## A. 分组

排序之后贪心的能取尽取一定不会变劣，而且还更有可能给后面留出配对的机会。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;
int a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k, res = 0;
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) {
        if (i < n && a[i + 1] - a[i] <= k) i++;
        res++;
    }
    cout << res << endl;
    return 0;
}
```

## B. 促销

直接暴力模拟，时间复杂度是 log 级的。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL n, m, res;
    cin >> n >> m;
    res = n;
    while (n >= m) {
        res += n / m;
        n = n / m + n % m;
    }
    cout << res << endl;
    return 0;
}
```

## C. 凹区间

经典的**单调栈**问题，找到一个数左右第一个比他大的位置。可以只跑一轮解决，维护一个（**严格**）单调递减的单调栈，对于一个数，入栈前栈顶是左侧第一个**大于**他的，弹掉他的那个是右侧第一个**不小于**他的。需要注意一个边界问题，如果只跑一轮单调栈不可避免**边界取等**的问题，需要特判，如果维护的是严格递减的，需要特判右边界取等，不严格递减需要特判左边界取等，否则会算多，例如 `1 1 0 1 1`，如果不特判边界会输出 `4`（分别会右侧和左侧多取一个 `1`），但是实际是 `3`。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
const int N = 1000010;
int a[N], st[N], tp;
// 单调递减
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, res = 1;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        while (tp && a[i] >= a[st[tp]]) {
            if (tp > 1 && a[i] != a[st[tp]]) res = max(res, i - st[tp - 1] + 1);
            tp--;
        }
        st[++tp] = i;
    }
    cout << res << endl;
    return 0;
}
```

## D. 好路径

a 很小，考虑**枚举所有下界**，求出对应的最小上界，然后作差取 min。枚举到下界 k 时，在所有权值不小于 k 的位置构成的图上跑**最小生成树**找到从 (1, 1) 到 (n, n) 的路径上的最大权值，如果不存在路径说明 k 不合法，直接忽略掉。

```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <tuple>

using namespace std;
const int N = 110;
int a[N][N], f[N][N];
bool vis[N][N];
int dx[] = {-1, 1, 0, 0}, dy[] = {0, 0, 1, -1};

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cin >> a[i][j];
        }
    }
    int res = 0x3f3f3f3f;
    for (int k = 0; k <= a[1][1]; ++k) {
        memset(vis, 0, sizeof(vis));
        memset(f, 0x3f, sizeof(f));
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> q;
        f[1][1] = a[1][1];
        q.emplace(f[1][1], 1, 1);
        while (!q.empty()) {
            auto [_, x, y] = q.top();
            q.pop();
            if (vis[x][y]) continue;
            vis[x][y] = true;
            for (int t = 0; t < 4; ++t) {
                int tx = x + dx[t], ty = y + dy[t];
                if (tx > 0 && tx <= n && ty > 0 && ty <= n && a[tx][ty] >= k && f[tx][ty] > max(a[tx][ty], f[x][y])) {
                    f[tx][ty] = max(a[tx][ty], f[x][y]);
                    q.emplace(f[tx][ty], tx, ty);
                }
            }
        }
        // cout << f[n][n] << endl;
        res = min(res, f[n][n] - k);
    }
    cout << res << endl;
    return 0;
}
```

## E. Shapes

朴实无华的大模拟，我想到了一个能稍微好写一点的办法。首先不妨固定 s，枚举 t 的 4 个旋转角度，我们知道如果在一个恰当的角度下可以通过平移得到，那么所有的 `#` 的坐标的相对位置一定都是一样的，把 s 的 `#` 的坐标排序，把 t 的 `#` 的坐标也排序，**偏移量应该是一个定值**，检查这个即可。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
const int N = 210;
char a[N][N], b[N][N];
vector<pair<int, int>> va, vb;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cin >> a[i][j];
            if (a[i][j] == '#') va.emplace_back(i, j);
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cin >> b[i][j];
            if (b[i][j] == '#') vb.emplace_back(i, j);
        }
    }
    if (va.size() != vb.size()) {
        cout << "No" << endl;
        return 0;
    }
    sort(va.begin(), va.end());
    for (int i = 0; i < 4; ++i) {
        for (auto &[x, y] : vb) {
            int tx = x, ty = y;
            x = ty, y = -tx + n + 1;
        }
        bool f = true;
        sort(vb.begin(), vb.end());
        for (int i = 1; i < va.size(); ++i) {
            if (vb[i].first - va[i].first != vb[0].first - va[0].first || vb[i].second - va[i].second != vb[0].second - va[0].second) {
                f = false;
                break;
            }
            // cout << vb[i].first << ' ' << vb[i].second << endl;
        }
        if (f) {
            cout << "Yes" << endl;
            return 0;
        }
    }
    cout << "No" << endl;
    return 0;
}
```

## F. Ubiquity

可以考虑容斥或者线性 DP 两种做法。

### 容斥

答案 = 不限制 - 限制不选 9 - 限制不选 0 + 限制不选 9 和 0

$$
cnt = 10^n - 2 \cdot 9^n + 8^n
$$

写个快速幂（暴力求幂也行），然后套公式即可。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 1000010, MOD = 1000000007;

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
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    cout << ((power(10, n) - power(9, n) - power(9, n) + power(8, n)) % MOD + MOD) % MOD << endl;
    return 0;
}
```

### 线性 DP

无非只有四种状态

- 没有出现过 0 和 9
- 只出现过 0
- 只出现过 0
- 0 和 9 都出现过 

通过枚举最后一位选什么进行状态转移，时间复杂度是 $O(n)$ 没有快速幂快。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 1000010, MOD = 1000000007;
LL f[N][4];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    f[0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        f[i][0] = f[i - 1][0] * 8 % MOD;
        f[i][1] = (f[i - 1][0] + f[i - 1][1] * 9) % MOD;
        f[i][2] = (f[i - 1][0] + f[i - 1][2] * 9) % MOD;
        f[i][3] = (f[i - 1][1] + f[i - 1][2] + f[i - 1][3] * 10) % MOD;
    }
    cout << f[n][3] << endl;
    return 0;
}
```