---
title: The 2022 ICPC Asia East Continent Final Contest
---
# The 2022 ICPC Asia East Continent Final Contest

qoj 链接：[https://qoj.ac/contest/1522](https://qoj.ac/contest/1197)

如果代码是我写的或者是后来补的，我会贴一下我这儿留着的代码，如果是我参与的我会写一下思路。

过了 C, F, I, J, M 五道题，罚时 784，差 40 罚时左右银。

## M. Dining Professors

签到题，按照每个位置能够到的不吃辣的人的数量排序，优先给较大的不辣的。


## I. Chase Game 2<sup style="color: blue">(未参与)</sup>

我对这道题完全没印象，在讨论这道题的时候我好像在努力 C 题。

## C. Best Carry Player 2

折磨死我了，这个墨迹了一个小时属实是不应该，最后的原因竟然是<span style="color: blue">数组没清空</span>。

特判不进位的情况，也就是找第一个不是 9 的位置。其他情况用一个线性 DP (想模拟也行，无非是代码长一点) 维护出来从低到高前 i 位进位 j 次且最后一位 k(是/否) 进位的最小 y，最后检查最大的能够到的位数够不够，如果不够取高位然后给 y 补 9 凑够。

```cpp
#include <iostream>
#include <cstring>
#include <iomanip>

using namespace std;

typedef long long LL;
const int N = 20;
int a[N];
LL f[N][N][2];

void solve() {
    LL x;
    int k, l = 0;
    cin >> x >> k;
    memset(a, 0, sizeof(a));
    while (x) {
        a[++l] = x % 10;
        x /= 10;
    }
    if (k == 0) {
        for (int i = 1; i <= l + 1; ++i) {
            if (a[i] != 9) {
                cout << 1;
                for (int j = 1; j < i; ++j) {
                    cout << 0;
                }
                cout << endl;
                return;
            }
        }
    }
    memset(f, 0x3f, sizeof(f));
    f[0][0][0] = 0;
    LL base = 1;
    for (int i = 1; i <= l; ++i) {
        for (int j = 0; j <= k; ++j) {
            if (a[i] != 9) {
                f[i][j][0] = min(f[i - 1][j][0], f[i - 1][j][1]);
            }
            else f[i][j][0] = f[i - 1][j][0];
            if (j > 0 && a[i] != 0) f[i][j][1] = min(f[i - 1][j - 1][0] + (10LL - a[i]) * base, f[i - 1][j - 1][1] + (10LL - a[i] - 1) * base);
            else if (j > 0) f[i][j][1] = f[i - 1][j - 1][1] + (10LL - a[i] - 1) * base;
        }
        base *= 10;
    }
    LL t = min(f[l][k][1], f[l][k][0]);
    if (t < 2000000000000000000LL) {
        cout << t << endl;
        return;
    }
    for (int i = 0; i < k; ++i) {
        if (f[l][k - i][1] < 2000000000000000000LL) {
            for (int j = 0; j < i; ++j) cout << 9;
            cout << setw(l) << setfill('0') << f[l][k - i][1];
            cout << endl;
            return;
        }
    }
    cout << -1 << endl;
    return;
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

## I. Chase Game

这道也是我自己切掉的（基本是一眼看出来了）。注意到当**被对方瞬移到自己脚底下第一次之后唯一的最优解就是走最短路快速到达终点**。可以这么理解，当被瞬移一次后不管怎么走，最短路的所有伤害构成的 multiset 一定是其他路径的子集。现在问题转化成了两段，第一段是在攻击范围内走，第二段是出去之后立刻走最短路到终点。先两次 bfs 找到所有点到 k 和 n 的距离，然后对起点和在攻击范围内的点进行 Dijkstra，过程中对于每一条出界的边都尝试计算一次答案，取最小值。

```cpp
#include <iostream>
#include <cstring>
#include <queue>

using namespace std;

typedef long long LL;
const int N = 100010, M = 200010;
int head[N], ver[M * 2], ne[M * 2], tot;
int dis_atk[N], dis_n[N];
LL dis[N];
bool vis[N];
int n, m, k;
LL d;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void bfs(int s, int dis[]) {
    memset(vis, 0, sizeof(vis));
    queue<int> q;
    q.emplace(s);
    vis[s] = true;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (!vis[y]) {
                vis[y] = true;
                dis[y] = dis[x] + 1;
                q.emplace(y);
            }
        }
    }
}

LL calc(int l) {
    LL a = l / d, b = l % d;
    return (a + 1) * (d + 1) * d / 2 - (d - b) * (d - b + 1) / 2;
}

LL dijkstra() {
    LL res = 0x3f3f3f3f3f3f3f3f;
    memset(dis, 0x3f, sizeof(dis));
    memset(vis, 0, sizeof(vis));
    dis[1] = 0;
    priority_queue<pair<LL, int>, vector<pair<LL, int>>, greater<pair<LL, int>>> q;
    q.emplace(0LL, 1);
    while (!q.empty()) {
        auto [_, x] = q.top();
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dis_atk[y] < d) {
                if (dis[y] > dis[x] + d - dis_atk[y]) {
                    dis[y] = dis[x] + d - dis_atk[y];
                    q.emplace(dis[y], y);
                }
            }
            else res = min(res, dis[x] + calc(dis_n[y] + 1));
        }
    }
    res = min(res, dis[n]);
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m >> k >> d;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    bfs(k, dis_atk);
    bfs(n, dis_n);
    cout << dijkstra() << endl;
    return 0;
}
```

## F. Inversion<sup style="color: blue">(未参与)</sup>

四次查询能确定一对大小关系，但是用归并排序正好会被卡，需要优化。好像是做了类似选择排序的操作。

## L. Aqre<sup style="color: red">(补题)</sup>

简直是大暴力……中途下班的下班，吃饭的吃饭，导致最后吃完回来发现他的时候为时已晚了。

- 如果 n 和 m 都不大于 3，那直接全填满 1；
- 如果其中有一个不大于 3，沿着长的那边一直重复下面的模式 (我的 b 数组)；
  ```
  1110
  0111
  1110
  ```
- 如果 n 和 m 都大于 3，那么最终答案沿两个方向都一定是以 4 为循环节不断扩展的。自己画一画会发现只能有两种情况滚动而成 (我的 a 和 c 数组)，横着滚和竖着滚等价，所以不用分别枚举横着和竖着滚，暴力所有情况，找到一个合法且最大的即可。
  ```
  1110 1110
  1011 0111
  1101 1101
  0111 1011
  ```
  
下面请欣赏💩山<del>（bushi</del>

```cpp
#include <iostream>

using namespace std;

const int N = 1010;
int a[N][N], b[N][N], c[N][N], s2[N][N];
int cnt, t;
bool vis[N][N];
const int dx[] = {0, 0, 1, -1}, dy[] = {1, -1, 0, 0};
int n, m;

void init() {
    for (int i = 1; i <= 1000; ++i) {
        int t;
        if (i % 4 == 1) t = 0;
        else if (i % 4 == 2) t = 2;
        else if (i % 4 == 3) t = 1;
        else t = 3;
        for (int j = 1; j <= 1004; ++j) {
            if ((j + t) % 4 == 0) a[i][j] = 0;
            else a[i][j] = 1;
        }
    }
    for (int i = 1; i <= 1000; ++i) {
        int t;
        if (i % 4 == 1) t = 0;
        else if (i % 4 == 2) t = 3;
        else if (i % 4 == 3) t = 1;
        else t = 2;
        for (int j = 1; j <= 1004; ++j) {
            if ((j + t) % 4 == 0) c[i][j] = 0;
            else c[i][j] = 1;
        }
    }
    for (int i = 1; i <= 3; ++i) {
        int t;
        if (i & 1) t = 0;
        else t = 2;
        for (int j = 1; j <= 1000; ++j) {
            if ((j + t) % 4 == 0) b[i][j] = 0;
            else b[i][j] = 1;
            s2[i][j] = s2[i - 1][j] + s2[i][j - 1] - s2[i - 1][j - 1] + b[i][j];
        }
    }
}

void dfs(int x, int y, int a[N][N]) {
    if (x <= 0 || x > n || y <= t || y > m + t || a[x][y] == 0 || vis[x][y]) return;
    vis[x][y] = true;
    cnt++;
    for (int i = 0; i < 4; ++i) dfs(x + dx[i], y + dy[i], a);
}

pair<int, int> work(int a[N][N]) {
    int res = 0, tt = -1;
    for (t = 0; t < 4; ++t) {
        int tot = 0, f = 0;
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                if (!vis[i][j + t] && a[i][j + t]) { 
                    if (!f) {
                        f = 1;
                        cnt = 0;
                        dfs(i, j + t, a);
                        tot = cnt;
                    }
                    else {
                        f = 2;
                        break;
                    }
                }
                if (f == 2) break;
            }
        }
        if (f == 1 && res < tot) {
            res = tot;
            tt = t;
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                vis[i][j + t] = false;
            }
        }
    }
    return {res, tt};
}

void printmat(int res, int tt, int a[N][N]) {
    cout << res << endl;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cout << a[i][j + tt];
        }
        cout << endl;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    init();
    int T;
    cin >> T;
    while (T--) {
        cin >> n >> m;
        if (n <= 3 && m <= 3) {
            cout << n * m << endl;
            for (int i = 1; i <= n; ++i) {
                for (int j = 1; j <= m; ++j) {
                    cout << 1;
                }
                cout << endl;
            }
        }
        else if (n <= 3) {
            cout << s2[n][m] << endl;
            for (int i = 1; i <= n; ++i) {
                for (int j = 1; j <= m; ++j) {
                    cout << b[i][j];
                }
                cout << endl;
            }
        }
        else if (m <= 3) {
            cout << s2[m][n] << endl;
            for (int i = 1; i <= n; ++i) {
                for (int j = 1; j <= m; ++j) {
                    cout << b[j][i];
                }
                cout << endl;
            }
        }
        else {
            auto t1 = work(a), t2 = work(c);
            if (t1.second != -1 && t2.second != -1) {
                if (t1.first >= t2.first) printmat(t1.first, t1.second, a);
                else printmat(t2.first, t2.second, c);
            }
            else if (t1.second != -1) printmat(t1.first, t1.second, a);
            else if (t2.second != -1) printmat(t2.first, t2.second, a);
            else return 123;
        }
    }
    return 0;
}
```