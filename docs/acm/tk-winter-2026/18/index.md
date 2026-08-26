---
title: 2026寒假个人训练赛第十八场
---
# 2026寒假个人训练赛第十八场

## A. 间隔

不可能当且仅当有相邻相等的且不是全部相等，否则最小间隔就是所有间隔的 gcd。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        bool f = true;
        int n;
        cin >> n;
        vector<int> a(n + 1);
        for (int i = 1; i <= n; ++i) {
            cin >> a[i];
        }
        int g = 0;
        for (int i = 2; i <= n; ++i) {
            if (a[i] - a[i - 1] == 0 && a[i] != a[1]) {
                cout << -1 << endl;
                f = false;
                break;
            }
            g = gcd(g, a[i] - a[i - 1]);
        }
        if (!f) continue;
        if (g == 0) {
            cout << 0 << endl;
            continue;
        }
        long long cnt = 0;
        for (int i = 2; i <= n; ++i) {
            cnt += (a[i] - a[i - 1]) / g - 1;
        }
        cout << cnt << endl;
    }
    return 0;
}
```

## B. 密码锁

直接暴力枚举 DP 即可。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 30, M = 1010, MOD = 1000000007;
LL f[M][N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, t;
    cin >> n >> m >> t;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            f[1][i][j] = 1;
        }
    }
    for (int i = 2; i <= t; ++i) {
        int dis;
        cin >> dis;
        for (int j = 1; j <= n; ++j) {
            for (int k = 1; k <= m; ++k) {
                for (int x = 1; x <= n; ++x) {
                    for (int y = 1; y <= m; ++y) {
                        if (abs(x - j) + abs(y - k) <= dis) f[i][j][k] = (f[i][j][k] + f[i - 1][x][y]) % MOD;
                    }
                }
            }
        }
    }
    LL res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            res = (res + f[t][i][j]) % MOD;
        }
    }
    cout << res << endl;
    return 0;
}
```

## C. 上街

这是一个非常非常恶心的大模拟 + Dijkstra，题目基本上是纯板子，但是写着真恶心。

```cpp
#include <iostream>
#include <queue>
#include <cstring>
#include <tuple>

using namespace std;

typedef long long LL;
const int N = 210, M = 60;
const int deltx[] = {1, 0, -1, 0}, delty[] = {0, -1, 0, 1};

int a[N][N], b[N][N], d[N][N], e[N][N];
int dis[N][N][4][M];
bool vis[N][N][4][M];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, t, xe, ye;
    cin >> n >> m >> t >> xe >> ye;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> a[i][j] >> b[i][j] >> d[i][j] >> e[i][j];
        }
    }
    memset(dis, 0x3f, sizeof(dis));
    priority_queue<tuple<int, int, int, int, int>, vector<tuple<int, int, int, int, int>>, greater<tuple<int, int, int, int, int>>> q;
    dis[1][1][0][0] = 0;
    q.emplace(dis[1][1][0][0], 0, 0, 1, 1);
    while (!q.empty()) {
        auto [_, ct, dir, x, y] = q.top();
        q.pop();
        if (vis[x][y][dir][ct]) continue;
        vis[x][y][dir][ct] = true;
        int &dx = dis[x][y][dir][ct];
        if (x == xe && y == ye) {
            cout << dx << endl;
            return 0;
        }
        int tx, ty, ndir, nt, w;
        if (a[x][y] == 0 && b[x][y] == 0) {
            for (int tt = dir - 1; tt <= dir + 1; ++tt) {
                ndir = (tt + 4) % 4, tx = x + deltx[ndir], ty = y + delty[ndir];
                if (tx <= 0 || tx > n || ty <= 0 || ty > m) continue;
                if (ndir == 0) w = d[x][y];
                else if (ndir == 1) w = e[tx][ty];
                else if (ndir == 2) w = d[tx][ty];
                else w = e[x][y];
                if (t == 0) nt = 0;
                else nt = (ct + w) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
        }
        else if (dir == 0) {
            if (y > 1) { // you
                ndir = 1, tx = x, ty = y - 1, w = e[tx][ty], nt = (ct + e[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (x < n) { // qian
                ndir = 0, tx = x + 1, ty = y, w = (ct < a[x][y] ? a[x][y] - ct : 0) * 10 + d[x][y], nt = (max(ct, a[x][y]) + d[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (y < m) { // zuo
                ndir = 3, tx = x, ty = y + 1, w = (ct < a[x][y] ? a[x][y] - ct : 0) * 10 + e[x][y], nt = (max(ct, a[x][y]) + e[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
        }
        else if (dir == 1) {
            if (x > 1) { // you
                ndir = 2, tx = x - 1, ty = y, w = d[tx][ty], nt = (ct + d[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (y > 1) { // qian
                ndir = 1, tx = x, ty = y - 1, w = ct < a[x][y] ? e[tx][ty] : (t - ct) * 10 + e[tx][ty], nt = ((ct < a[x][y] ? ct : 0) + e[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (x < n) { // zuo
                ndir = 0, tx = x + 1, ty = y, w = ct < a[x][y] ? d[x][y] : (t - ct) * 10 + d[x][y], nt = ((ct < a[x][y] ? ct : 0) + d[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
        }
        else if (dir == 2) {
            if (y < m) { // zuo
                ndir = 3, tx = x, ty = y + 1, w = e[x][y], nt = (ct + e[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (x > 1) { // qian
                ndir = 2, tx = x - 1, ty = y, w = (ct < a[x][y] ? a[x][y] - ct : 0) * 10 + d[tx][ty], nt = (max(ct, a[x][y]) + d[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (y > 1) { // zuo
                ndir = 1, tx = x, ty = y - 1, w = (ct < a[x][y] ? a[x][y] - ct : 0) * 10 + e[tx][ty], nt = (max(ct, a[x][y]) + e[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
        }
        else { // dir == 3
            if (x < n) { // you
                ndir = 0, tx = x + 1, ty = y, w = d[x][y], nt = (ct + d[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (y < m) { // qian
                ndir = 3, tx = x, ty = y + 1, w = ct < a[x][y] ? e[x][y] : (t - ct) * 10 + e[x][y], nt = ((ct < a[x][y] ? ct : 0) + e[x][y]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
            if (x > 1) { // zuo
                ndir = 2, tx = x - 1, ty = y, w = ct < a[x][y] ? d[tx][ty] : (t - ct) * 10 + d[tx][ty], nt = ((ct < a[x][y] ? ct : 0) + d[tx][ty]) % t;
                int &dy = dis[tx][ty][ndir][nt];
                if (dy > dx + w) dy = dx + w, q.emplace(dy, nt, ndir, tx, ty);
            }
        }
    }
    return 0;
}
```

## D. 联通数

所有两位及以上的全是 1 的数都能用 111 和 11 表示出来，先全用 111，然后一个一个反悔。显然反悔的步数不会超过 110 就一定能找到答案 / 判定不合法。

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
        LL n, k;
        cin >> n >> k;
        if (n % k == 0) {
            n /= k;
            LL t = n / 111;
            bool f = false;
            for (int i = 1; i <= t; ++i) {
                if ((n - (LL)i * 111) % 11 == 0) {
                    f = true;
                    break;
                }
            }
            if (f) cout << "YES" << endl;
            else cout << "NO" << endl;
        }
        else cout << "NO" << endl;
    }
    return 0;
}
```

## E. 赛博朋克

## F. 凌云渡

## G. 圣迹再临

## H. Wooden Sticks

和 [导弹拦截问题](https://www.luogu.com.cn/problem/P1020) 一样，把一个维度排序，然后另一个维度贪心取。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 5010;

pair<LL, LL> a[N];
vector<LL> b;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i) cin >> a[i].first >> a[i].second;
        sort(a + 1, a + n + 1);
        for (int i = 1; i <= n; ++i) {
            int p = -1;
            for (int j = 0; j < b.size(); ++j) {
                if (b[j] <= a[i].second) {
                    if (p == -1) p = j;
                    else if (b[j] > b[p]) p = j;
                }
            }
            if (p == -1) b.emplace_back(a[i].second);
            else b[p] = a[i].second;
        }
        cout << b.size() << endl;
        b.clear();
    }
    return 0;
}
```

## I. Shipping containers

如果间隔大于 $\sqrt{n}$ 那么单次修改次数不会超过 $\lfloor\sqrt{n}\rfloor$，暴力修改，反之维护前缀和只会占用 $O(n\sqrt{n})$ 的空间。分开做即可。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

typedef long long LL;
const int N = 100010;

int s[N][320], a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k, l;
    cin >> n >> k;
    l = sqrt(n);
    for (int i = 1; i <= k; ++i) {
        int p, cnt, d;
        cin >> p >> cnt >> d;
        if (d > l) for (int j = 0; j < cnt; ++j) a[p + j * d]++;
        else s[p][d]++, s[min(n + 1, p + d * cnt)][d]--;
    }
    for (int i = 1; i <= n; ++i) {
        int t = a[i];
        for (int j = 1; j <= l; ++j) {
            if (i - j >= 0) s[i][j] += s[i - j][j];
            t += s[i][j];
        }
        cout << t << ' ';
    }
    cout << endl;
    return 0;
}
```