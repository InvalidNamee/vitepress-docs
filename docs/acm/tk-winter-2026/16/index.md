---
title: 2026寒假个人训练赛第十六场
---
# 2026寒假个人训练赛第十六场

## A. 约数个数

又是一个数论分块，不标数据范围害我 TLE 了一发。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

typedef long long LL;

LL cnt(LL n) {
    LL l = 1, res = 0;
    while (l <= n) {
        LL r = n / (n / l);
        res += (r - l + 1) * (n / l);
        l = r + 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int a, b;
    cin >> a >> b;
    cout << cnt(b) - cnt(a - 1) << endl;
    return 0;
}
```

## B. 二哥找宝箱

类似分层图最短路，因为宝箱很少，可以用一个 bitmask 存状态，然后 BFS 一遍。

```cpp
#include <iostream>
#include <queue>
#include <tuple>

using namespace std;

const int N = 110;
const int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};
int a[N][N];
bool vis[N][N][1 << 5];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, t = 0;
    cin >> n >> m;
    queue<tuple<int, int, int, int>> q;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> a[i][j];
            if (a[i][j] == 2) q.emplace(0, 0, i, j), a[i][j] = 0;
            else if (a[i][j] == 1) a[i][j] <<= t++;
        }
    }
    while (!q.empty()) {
        auto [dis, msk, x, y] = q.front();
        q.pop();
        if (vis[x][y][msk]) continue;
        vis[x][y][msk] = true;
        if (msk == (1 << t) - 1) {
            cout << dis << endl;
            return 0;
        }
        for (int i = 0; i < 4; ++i) {
            int tx = x + dx[i], ty = y + dy[i];
            if (tx > 0 && tx <= n && ty > 0 && ty <= m && a[tx][ty] != -1) q.emplace(dis + 1, msk | a[tx][ty], tx, ty);
        }
    }
    cout << -1 << endl;
    return 0;
}
```

## C. 整数去位

贪心，尽可能让最高位的小即可。提前存一下对于某一个位置下一个 0 ~ 9 的位置，这样就可以 $O(n)$ 维护了。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 1000010;

int ne[N][10], h[10];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string num;
    int n, m;
    cin >> num >> m;
    n = num.length();
    if (n == m) cout << 0 << endl;
    else {
        num = " " + num;
        memset(h, 0x3f, sizeof(h));
        for (int i = n; i; --i) {
            h[num[i] - '0'] = i;
            for (int j = 0; j < 10; ++j) ne[i][j] = h[j];
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < 10; ++j) {
                if (m >= ne[i][j] - i) {
                    m -= ne[i][j] - i;
                    i = ne[i][j];
                    break;
                }
            }
            cout << num[i];
        }
        cout << endl;
    }
    return 0;
}
```

## D. 柠檬汽水

从大到小排序，然后按他说的模拟一边即可，把容易放弃的放到最后一定不劣。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;
int a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    sort(a + 1, a + n + 1, greater<int>());
    int res = n;
    for (int i = 1; i <= n; ++i) {
        if (a[i] < i - 1) {
            res = i - 1;
            break;
        }
    }
    cout << res << endl;
    return 0;
}
```

## E. Crane

这个题似乎是两个题的缝合，拼尽全力无法看懂，题面和样例不一样……

## F. Cow Dance Show 【Easy】

已有答案检查是否合法很容易，答案具有单调性，二分答案。

```cpp
#include <iostream>
#include <queue>

using namespace std;

typedef long long LL;
const int N = 10010;
int a[N], n, t;
priority_queue<int, vector<int>, greater<int>> q;

bool check(int mid) {
    for (int i = 1; i <= mid; ++i) q.emplace(a[i]);
    for (int i = mid + 1; i <= n; ++i) {
        int x = q.top();
        q.pop();
        q.emplace(x + a[i]);
    }
    int mx = 0;
    while (!q.empty()) mx = max(mx, q.top()), q.pop();
    return mx <= t;
}


int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> t;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int l = 1, r = n;
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    cout << l << endl;
    return 0;
}
```

## G. The Tower of Babylon

不难发现每一种方块的一种朝向只会用一次（上面的要严格小于下面的）。先排个序保证一个维度的单调性，这样一个状态的后继就一定在他后面了，满足了无后效性，然后跑给类似 LIS 的 DP 即可。

```cpp
#include <iostream>
#include <tuple>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 200;
tuple<LL, LL, LL> a[N];
LL f[N];
int m;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, T = 0;
    while (cin >> n, n) {
        m = 0;
        for (int i = 1; i <= n; ++i) {
            int b[3];
            cin >> b[0] >> b[1] >> b[2];
            for (int j = 0; j < 3; ++j) {
                for (int k = 0; k < 3; ++k) {
                    for (int l = 0; l < 3; ++l) {
                        if (j == k || k == l || l == j) continue;
                        a[++m] = {b[j], b[k], b[l]};
                    }
                }
            }
        }
        sort(a + 1, a + m + 1);
        LL res = 0;
        for (int i = 1; i <= m; ++i) {
            f[i] = get<2>(a[i]);
            for (int j = 1; j < i; ++j) {
                if (get<0>(a[j]) < get<0>(a[i]) && get<1>(a[j]) < get<1>(a[i])) f[i] = max(f[i], f[j] + get<2>(a[i]));
            }
            res = max(res, f[i]);
        }
        cout << "Case " << ++T << ": maximum height = " << res << endl;
    }
    return 0;
}
```