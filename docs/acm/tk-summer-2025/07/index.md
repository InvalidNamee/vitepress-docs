---
title: 2025夏季个人训练赛第七场
---
# 2025夏季个人训练赛第七场

## A. 气球（balloon）

好在 k 只有 100，直接 dp 就可以解决，$f_{i, j, k}$ 表示第 i 个气球颜色为 j 颜色和上一个 (不 if k == 0) 一样的方案数。

```cpp
#include <iostream>

using namespace std;

const int MOD = 1000000007;
const int N = 100010;

long long f[N][110][2], s[N];

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    s[0] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= k; ++j) {
            f[i][j][0] = ((s[i - 1] - f[i - 1][j][1] - f[i - 1][j][0]) % MOD + MOD) % MOD;
            f[i][j][1] = f[i - 1][j][0];
            s[i] = (s[i] + f[i][j][0] + f[i][j][1]) % MOD;
        }
    }
    printf("%lld\n", s[n]);
    return 0;
}
```

## B. 机器人（robot）

每次改就只会被改的那条点后面的路径，先 dp 一遍预处理出来经过每个位置的机器人个数，每次修改的时候顺着原来那条链全减掉然后再顺着新的链全加回去，全部重新取 max，并不会 TLE。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 1510;

char mp[N][N];
int f[N][N], deg[N][N], value[N][2]; // 0 是右 1 是下

void calc(int n) {
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        res = max(res, max(f[i][n + 1] * value[i][0], f[n + 1][i] * value[i][1]));
    }    
    printf("%d\n", res);
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%s%d", mp[i] + 1, &value[i][0]);
        for (int j = 1; j <= n; ++j) {
            if (mp[i][j] == 'R') deg[i][j + 1]++;
            else deg[i + 1][j]++;
        }
    }
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &value[i][1]);
    }
    for (int i = 1; i <= n + 1; ++i) {
        for (int j = 1; j <= n + 1; ++j) {
            if (i <= n && j <= n) f[i][j] = 1;
            if (mp[i - 1][j] == 'D') f[i][j] += f[i - 1][j];
            if (mp[i][j - 1] == 'R') f[i][j] += f[i][j - 1];
        }
    }
    calc(n);
    int q;
    scanf("%d", &q);
    while (q--) {
        int x, y;
        scanf("%d%d", &x, &y);
        int t = f[x][y];
        int i = x, j = y;
        while (i <= n && j <= n) {
            if (mp[i][j] == 'R') {
                j++;
                f[i][j] -= t;
            }
            else if (mp[i][j] == 'D') {
                i++;
                f[i][j] -= t;
            }
        }
        i = x, j = y;
        mp[i][j] = mp[i][j] == 'R' ? 'D' : 'R';
        while (i <= n && j <= n) {
            if (mp[i][j] == 'R') {
                j++;
                f[i][j] += t;
            }
            else if (mp[i][j] == 'D') {
                i++;
                f[i][j] += t;
            }
        }
        calc(n);
    }
    return 0;
}
```

## C. 积木大赛（blocks）

按 a + b 排序，$f_{i, j}$ 表示选到第 i 个积木，重量为 j 的最大高度，按照背包的思路 dp 即可。

**why?** 其实我做的时候是蒙出来的。

本质上就是考虑相邻的两个积木互相摞的可能性。如果两个积木互换位置都能摞上，那顺序就不影响了；如果只有一种能摞上那一定是 a + b 小的在上面。所以按照 a + b 从小到大排序没问题。

$$
\begin{align}
    &a_1 + b_1 < a_2 + b_2\\
    &\begin{cases}
        a_2 \le b_1 \rArr a_1 < b_2\\
        a_1 \le b_2 \rArr \text{不确定}
    \end{cases}
\end{align}
$$

```cpp
#include <iostream>
#include <algorithm>
#define int long long

using namespace std;

const int N = 1010;
struct wood {
    int a, b, c;
} a[N];
long long f[N][20010];

signed main() {
    int n;
    scanf("%lld", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld%lld%lld", &a[i].a, &a[i].b, &a[i].c);
    }
    sort(a + 1, a + n + 1, [](wood a, wood b) {
        return a.a + a.b < b.a + b.b;
    });
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j <= 20000; ++j) {
            if (j >= a[i].a && j - a[i].a <= a[i].b) f[i][j] = max(f[i - 1][j], f[i - 1][j - a[i].a] + a[i].c);
            else f[i][j] = f[i - 1][j];
        }
    }
    long long res = 0;
    for (int i = 0; i <= 20000; ++i) {
        res = max(res, f[n][i]);
    }
    printf("%lld\n", res);
    return 0;
}
```

## D. Positioning Peter’s Paintings

签到题。

```cpp
#include <iostream>

using namespace std;

int main() {
    long long a, b, x, y;
    cin >> a >> b >> x >> y;
    cout << min(max(a, x) + (b + y), max(b, y) + (a + x)) * 2 << endl;
    return 0;
}
```

## E. Cryptogram Cracking Club

水题++

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    string s;
    long long n, sum = 0, cur = 0; 
    cin >> s >> n;
    for (char c : s) {
        if (isdigit(c)) cur = cur * 10 + c - 48;
        else {
            sum += cur;
            cur = 0;
            if (sum > n) break;
        }
    }
    sum += cur;
    cur = 0;
    n %= sum;
    n++;
    char ls;
    sum = 0;
    for (char c : s) {
        if (isdigit(c)) cur = cur * 10 + c - 48;
        else {
            sum += cur;
            cur = 0;
            if (sum >= n) {
                cout << ls << endl;
                break;
            }
            ls = c;
        }
    }
    if (sum < n) cout << ls << endl;
    return 0;
}
```

## G. Floor is Lava

[洛谷链接](https://www.luogu.com.cn/problem/P11860)

太巧妙了，把边当点，对新图跑一遍最短路。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <tuple>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 200010;

vector<tuple<int, int, int>> ed[N];
vector<pair<int, int>> newed[N];
priority_queue<pair<LL, int>, vector<pair<LL, int>>, greater<pair<LL, int>>> q;
LL dis[N];
bool vis[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int x, y, w;
        scanf("%d%d%d", &x, &y, &w);
        ed[x].push_back({w, y, i});
        ed[y].push_back({w, x, i});
    }
    for (int i = 1; i <= n; ++i) {
        sort(ed[i].begin(), ed[i].end());
        for (int j = 1; j < ed[i].size(); ++j) {
            auto [a, b, c] = ed[i][j - 1];
            auto [d, e, f] = ed[i][j];
            newed[c].push_back({d - a, f});
            newed[f].push_back({d - a, c});
        }
    }
    for (auto [a, b, c] : ed[1]) newed[0].push_back({a, c});
    for (auto [a, b, c] : ed[n]) newed[c].push_back({0, m + 1});
    memset(dis, 0x3f, sizeof(dis));
    dis[0] = 0;
    q.push({dis[0], 0});
    while (!q.empty()) {
        int x = q.top().second;
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (auto [w, y] : newed[x]) {
            if (dis[y] > dis[x] + w) {
                dis[y] = dis[x] + w;
                q.push({dis[y], y});
            }
        }
    }
    printf("%lld\n", dis[m + 1]);
    return 0;
}
```