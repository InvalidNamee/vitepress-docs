---
title: 2026寒假个人训练赛第十五场
---
# 2026寒假个人训练赛第十五场

罚时吃饱了（bushi

## A. 奶牛大会

二分答案，间隔越长越容易成功，二分能成功和不能成功的边界。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;

int a[N];
int n, m, c;

bool check(int mid) {
    int t = -100000000, cur = 0, cnt = 0;
    for (int i = 1; i <= n; ++i) {
        if (a[i] - t > mid || cur == c) cnt++, t = a[i], cur = 0;
        cur++;
    }
    return cnt <= m;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m >> c;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    sort(a + 1, a + n + 1);
    int l = 0, r = 1000000000;
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    cout << l << endl;
    return 0;
}
```

## B. 面积 (area)

往外面框一个圈，从外面的新加的点开始搜一遍，没被标记的就是内部点。

然后我因为无视了右边那条和下边那条挂到了好几次。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 20;
int a[N][N];
int n = 10;

void dfs(int x, int y) {
    if (x < 0 || x > n + 1 || y < 0 || y > n + 1 || a[x][y] != 0) return;
    a[x][y] = 1;
    if (x <= n) dfs(x + 1, y);
    if (x > 0) dfs(x - 1, y);
    if (y <= n) dfs(x, y + 1);
    if (y > 0) dfs(x, y - 1);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cin >> a[i][j];
        }
    }
    for (int i = 0; i <= n + 1; ++i) dfs(0, i), dfs(n + 1, i), dfs(i, 0), dfs(i, n + 1);
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (a[i][j] == 0) res++;
        }
    }
    cout << res << endl;
    return 0;
}
```

## C. 营救 (save)

bfs 第一次搜到用的步数就是答案。

```cpp
#include <iostream>
#include <queue>
#include <tuple>

using namespace std;

const int N = 1010;
char a[N][N];

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
    queue<tuple<int, int, int>> q;
    int sx, sy, tx, ty;
    cin >> sx >> sy >> tx >> ty;
    q.emplace(0, sx, sy);
    while (!q.empty()) {
        auto [d, x, y] = q.front();
        q.pop();
        if (tx == x && ty == y) {
            cout << d << endl;
            break;
        }
        if (a[x][y] == '1') continue;
        a[x][y] = '1';
        if (x < n) q.emplace(d + 1, x + 1, y);
        if (x > 1) q.emplace(d + 1, x - 1, y);
        if (y < n) q.emplace(d + 1, x, y + 1);
        if (y > 1) q.emplace(d + 1, x, y - 1);
    }
    return 0;
}
```

## D. 最少转弯问题 (turn)

相当于建了一个分层图在分层图上 bfs，边权只有 0 和 1，所以可以用双端队列做 bfs，还是第一次搜到的就是答案。

```cpp
#include <iostream>
#include <deque>
#include <tuple>

using namespace std;

const int N = 110;
const int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
char a[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> a[i][j];
        }
    }
    deque<tuple<int, int, int, int>> q;
    int sx, sy, tx, ty;
    cin >> sx >> sy >> tx >> ty;
    q.emplace_back(0, 0, sx, sy);
    q.emplace_back(1, 0, sx, sy);
    q.emplace_back(2, 0, sx, sy);
    q.emplace_back(3, 0, sx, sy);
    while (!q.empty()) {
        auto [dis, dir, x, y] = q.front();
        q.pop_front();
        if (tx == x && ty == y) {
            cout << dir << endl;
            break;
        }
        if (x < 1 || x > n || y < 1 || y > m || a[x][y] == '1') continue;
        a[x][y] = '1';
        for (int i = 0; i < 4; ++i) {
            if (i == dir) q.emplace_front(dir, dis, x + dx[i], y + dy[i]);
            else q.emplace_back(dir, dis + 1, x + dx[i], y + dy[i]);
        }
    }
    return 0;
}
```

## E. 社交网络

Floyd 板子，统计最短路和最短路条数然后按要求直接算就行。

```cpp
#include <iostream>
#include <iomanip>

using namespace std;

typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 110;

PLL merge(PLL a, PLL b) {
    if (a.first == b.first) return {a.first, a.second + b.second};
    else return a.first < b.first ? a : b;
}

PLL f[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            f[i][j] = {1000LL * 500000000, 0};
        }
    }
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        cin >> x >> y >> z;
        f[x][y] = f[y][x] = merge(f[x][y], {z, 1});
    }
    for (int k = 1; k <= n; ++k) {
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (i != j && j != k) f[i][j] = merge(f[i][j], {f[i][k].first + f[k][j].first, f[i][k].second * f[k][j].second});
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        double res = 0;
        for (int j = 1; j <= n; ++j) {
            for (int k = 1; k <= n; ++k) {
                if (i != j && j != k && i != k && f[j][k].first == f[j][i].first + f[i][k].first) res += (double)f[j][i].second * f[i][k].second / f[j][k].second;
            }
        }
        cout << fixed << setprecision(3) << res << endl;
    }
    return 0;
}
```

## F. Play on Words

我一直理解错了题面，他问的是前面输入的 m 个串中某个子序列和询问的串相等的串个数，直接双指针扫描就可以。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
const int N = 5010;
 
string s[N];
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int m, n;
    cin >> m;
    for (int i = 1; i <= m; ++i) cin >> s[i];
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        string t;
        cin >> t;
        int cnt = 0;
        for (int j = 1; j <= m; ++j) {
            int l = 0;
            for (int k = 0; k < s[j].length(); ++k) {
                if (s[j][k] == t[l]) l++;
                if (l == t.length()) break;
            }
            cnt += l == t.length();
        }
        cout << cnt << endl;
    }
    return 0;
}
```

## G. 【树型DP】叶子的染色

不妨先假设都染到叶子上，然后让叶子上的颜色不断往上走，在路径上合并。记.$f_{x,i}$ 为结点 x 涂颜色 i 且子树合法需要的最少次数。枚举每个非叶子结点的颜色

$$
f_{x, j} = 1 + \sum_{y \text{is a son of} x}\max\{f_{y, i} - 1, f_{y, i \oplus 1}\}
$$

如果儿子和父亲颜色一样，那么都能并到父亲，只用计算父亲那一个代价就行了，如果不一样那么只能留在儿子。

然后这道题的数据只有 $10^4$ 我幻想着直接对每个非叶子结点都暴力一遍能过，然后就正好被卡了，无奈之下只能再写个换根 DP 了。

```cpp
#include <iostream>

using namespace std;

const int N = 10010;
int head[N], ver[N * 2], ne[N * 2], tot;
int f[N][2], n, m, res;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dp(int x, int fa) {
    if (x > m) f[x][1] = f[x][0] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dp(y, x);
        f[x][1] += min(f[y][1] - 1, f[y][0]);
        f[x][0] += min(f[y][0] - 1, f[y][1]);
    }
}

void dfs(int x, int fa) {
    res = min(res, min(f[x][0], f[x][1]));
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa || y <= m) continue;
        int bk[4] = {f[x][0], f[x][1], f[y][0], f[y][1]};
        f[x][0] -= min(f[y][0] - 1, f[y][1]);
        f[x][1] -= min(f[y][1] - 1, f[y][0]);
        f[y][1] += min(f[x][1] - 1, f[x][0]);
        f[y][0] += min(f[x][0] - 1, f[x][1]);
        f[x][0] = bk[0], f[x][1] = bk[1], f[y][0] = bk[2], f[y][1] = bk[3];
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int c;
        cin >> c;
        f[i][c] = 1;
        f[i][c ^ 1] = m;
    }
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    dp(m + 1, 0);
    res = m;
    dfs(m + 1, 0);
    cout << res << endl;
    return 0;
}
```

