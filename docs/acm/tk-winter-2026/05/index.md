---
title: 2026寒假个人训练赛第五场
---
# 2026寒假个人训练赛第五场

前四道应该是 CSP-X 辽宁，都是大水题，后三道是 CSP-J 2024。

## A. 字符串数数

```cpp
#include <iostream>

using namespace std;

int t[26];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    for (char c : s) t[c - 'a']++;
    for (int i : t) cout << i << endl;
    return 0;
}
```

## B. 积分

维护个二维前缀和然后暴力检查即可。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 1010;
LL a[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, x, y;
    LL res = -1e18;
    cin >> n >> m >> x >> y;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> a[i][j];
            a[i][j] += a[i - 1][j] + a[i][j - 1] - a[i - 1][j - 1];
            if (i >= x && j >= x) res = max(res, a[i][j] - a[i - x][j] - a[i][j - x] + a[i - x][j - x]);
            if (i >= y && j >= y) res = max(res, a[i][j] - a[i - y][j] - a[i][j - y] + a[i - y][j - y]);
        }
    }
    cout << res << endl;
    return 0;
}
```

## C. ⼩ L 打⽐赛

经典的贪心问题，直接右端点排序然后能选择选。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
typedef long long LL;
const int N = 500010;
pair<int, int> a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i].first >> a[i].second;
    sort(a + 1, a + n + 1, [](pair<int, int> a, pair<int, int> b) {
        return a.second < b.second;
    });
    int t = 0;
    int r = 0;
    for (int i = 1; i <= n; ++i) {
        if (a[i].first > r) r = a[i].second, t++;
    }
    cout << t << endl;
    return 0;
}
```

## D. 购物

n 很小，直接暴力所有情况挨个检查。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
typedef long long LL;
const int N = 20;
LL a[N][2];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, res = 0;
    LL s;
    cin >> n >> s;
    for (int i = 0; i < n; ++i) cin >> a[i][0] >> a[i][1];
    for (int i = 0; i < (1 << n); ++i) {
        LL t = 0;
        for (int j = 0; j < n; ++j) {
            t += a[j][i >> j & 1];
        }
        if (s >= t) res++;
    }
    cout << res << endl;
    return 0;
}
```

## E. 地图探险

[洛谷](https://www.luogu.com.cn/problem/P11228)

直接暴力模拟即可。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
typedef long long LL;
const int N = 1010;
// d=0 代表向东，d=1 代表向南，d=2 代表向西，d=3 代表向北
const int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
char a[N][N];
bool v[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n, m, k, x, y, d;
        cin >> n >> m >> k >> x >> y >> d;
        for (int i = 1; i <= n; ++i) cin >> (a[i] + 1);
        int res = 1;
        v[x][y] = true;
        for (int i = 0; i < k; ++i) {
            int tx = x + dx[d], ty = y + dy[d];
            if (0 < tx && tx <= n && 0 < ty && ty <= m && a[tx][ty] == '.') {
                x = tx, y = ty;
                if (!v[x][y]) v[x][y] = true, res++;
            }
            else d = (d + 1) % 4;
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) v[i][j] = false;
        }
        cout << res << endl;
    }
    return 0;
}
```

## F. 小木棍

[洛谷](https://www.luogu.com.cn/problem/P11229)

首先要让位数最小，位数最小的前提下保证最高位较小。所以结论是尽可能的选用木棍数量最多的 `8`，根据余数微调高位。因为余数只有 $0, 1, \dots 6$ 七种，很容易分类讨论，手推或者打表都行。

结论是

- 当只有 1~6 根的时候，答案分别是 -1, 1, 7, 4, 2, 6
- 除此之外先尽可能填满 8，填到不能再填，然后做以下微调
  - 余数为 6，直接高位补 6
  - 余数为 5，直接高位补 2
  - 余数为 4，删掉一个 8，高位补 20
  - 余数为 3
    - 如果有两个及以上的 8，删掉 2 个 8，高位补 200
    - 否则删掉一个 8 高位补 22
  - 余数为 2，直接高位补 1
  - 余数为 1，删掉一个 8，高位补 10
  - 余数为 0，全填 8

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        if (n < 7) {
            if (n <= 1) cout << -1 << endl;
            else if (n == 2) cout << 1 << endl;
            else if (n == 3) cout << 7 << endl;
            else if (n == 4) cout << 4 << endl;
            else if (n == 5) cout << 2 << endl;
            else cout << 6 << endl;
        }
        else {
            int a = n / 7, b = n % 7;
            if (b == 6) cout << 6;
            else if (b == 5) cout << 2;
            else if (b == 4) cout << 20, a--;
            else if (b == 3) {
                if (a == 1) cout << 22, a--;
                else cout << 200, a -= 2;
            }
            else if (b == 2) cout << 1;
            else if (b == 1) cout << 10, a--;
            for (int i = 0; i < a; ++i) cout << 8;
            cout << endl;
        }
    }
    return 0;
}
```

## G. 接龙<sup style="color: red">(补)</sup>

[洛谷](https://www.luogu.com.cn/problem/P11230)

普及组都冒出来蓝题了，当时感觉怎么算时间复杂度都不对，但是实际上就是一个**暴力 + 常数优化**。我当时的思路是每一个人的词库都相当于一张图，我用 n 种颜色分别标记每个人图中的边，然后合成一个大的图，模拟 100 轮手动走不同颜色的边，bfs 走相同颜色的边，理论上时间复杂度是对的，但是可惜常数太大被卡了，终于今天在我的不懈努力下终于优化过去了😭（这个代码洛谷还是会被卡，但是时间复杂度的正确性肯定没问题，搜素改成滑动窗口 + 遍历常数应该还能更小，但是不想改了）。

```cpp
#include <iostream>
#include <tuple>
#include <cstring>
#include <vector>
#include <algorithm>
 
using namespace std;
 
const int N = 200010;
int f[101][N];
int a[N], l[N], r[N];
bool vis[N];
tuple<int, int, int> q[N * 2];
vector<int> values;
vector<pair<int, int>> ne[N]; // 颜色 下标
int n, k, qq;
 
void solve() {
    cin >> n >> k >> qq;
    values.clear();
    for (int i = 1; i <= n; ++i) {
        int len;
        cin >> len;
        l[i] = r[i - 1] + 1, r[i] = r[i - 1] + len;
        for (int j = l[i]; j <= r[i]; ++j) {
            cin >> a[j];
            values.emplace_back(a[j]);
        }
    }
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    int m = values.size();
    for (int i = 1; i <= m; ++i) ne[i].clear();
    for (int i = 1; i <= n; ++i) {
        for (int j = l[i]; j <= r[i]; ++j) {
            a[j] = lower_bound(values.begin(), values.end(), a[j]) - values.begin() + 1;
            if (j < r[i]) ne[a[j]].emplace_back(i, j + 1);
        }
    }
    for (int i = 1; i <= 100; ++i) {
        for (int j = 1; j <= m; ++j) f[i][j] = 0;
    }
    f[0][1] = -1;
    for (int t = 1; t <= 100; ++t) {
        int hh = 0, tt = -1;
        for (int i = 1; i <= m; ++i) {
            if (f[t - 1][i]) {
                if (f[t - 1][i] == -1) {
                    for (auto &[c, j] : ne[i]) {
                        q[++tt] = {c, 1, j};
                    }
                }
                else {
                    for (auto &[c, j] : ne[i]) {
                        if (c != f[t - 1][i]) {
                            q[++tt] = {c, 1, j};
                        }
                    }
                }
            }
        }
        memset(vis, 0, sizeof(bool) * (r[n] + 1));
        while (hh <= tt) {
            auto [c, len, x] = q[hh++];
            if (f[t][a[x]]) {
                if (f[t][a[x]] != c) f[t][a[x]] = -1;
            }
            else f[t][a[x]] = c;
            if (vis[x]) continue;
            vis[x] = true;
            if (x < r[c] && len + 1 < k) q[++tt] = {c, len + 1, x + 1};
        }
        // for (int i = 1; i <= 9; ++i) cout << f[t][i] << ' ';
        // cout << endl;
    }
    while (qq--) {
        int r, c;
        cin >> r >> c;
        auto t = lower_bound(values.begin(), values.end(), c);
        if (t == values.end() || *t != c) cout << 0 << endl;
        else cout << (f[r][t - values.begin() + 1] != 0) << endl;
    }
}
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
}
```