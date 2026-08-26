---
title: 2025牛客暑期多校训练营4
---
# 2025牛客暑期多校训练营4

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| 个人 AC | 3 |
| 赛后补 | 3 |

一人一道，最后排名 225，当时队友的 G 题差点做出来了，我的时间都用在试 D 了，I 题没时间做了，比较可惜。

## B. Blind Alley <span style="color: blue"><sup>队友</sup></span>

两遍 dfs + 一遍dp，理论上应该很好写，但是我赛后自己写的时候一直不断出各种情况。

```cpp
#include <iostream>
#include <vector>

using namespace std;

vector<vector<int>> mp;
vector<vector<bool>> vis, valid;
vector<vector<int>> f;
vector<pair<int, int>> mv = {{-1, 0}, {1, 0}, {0, 1}}, mv_rev = {{-1, 0}, {1, 0}, {0, -1}};
int n, m, k;

void dfs1(int x, int y) {
    if (valid[x][y]) return;
    valid[x][y] = true;
    for (int i = 0; i < 3; ++i) {
        int tx = x + mv_rev[i].first, ty = y + mv_rev[i].second;
        if (tx > 0 && tx <= n && ty > 0 && ty <= m && mp[tx][ty] != 1) {
            dfs1(tx, ty);
        }
    }
}

void dfs(int x, int y) {
    if (vis[x][y]) return;
    vis[x][y] = true;
    for (int i = 0; i < 3; ++i) {
        int tx = x + mv[i].first, ty = y + mv[i].second;
        if (tx > 0 && tx <= n && ty > 0 && ty <= m && mp[tx][ty] != 1) {
            dfs(tx, ty);
        }
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        scanf("%d%d%d", &n, &m, &k);
        mp = vector<vector<int>>(n + 2, vector<int>(m + 2));
        vis = vector<vector<bool>>(n + 2, vector<bool>(m + 2, false));
        valid = vector<vector<bool>>(n + 2, vector<bool>(m + 2, false));
        f = vector<vector<int>>(n + 2, vector<int>(m + 2, 0));
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                scanf("%1d", &mp[i][j]);
            }
        }
        dfs1(1, m);
        dfs(1, 1);
        for (int j = m; j; --j) {
            for (int i = 1; i <= n; ++i) {
                if (!valid[i][j] && vis[i][j]) f[i][j] = f[i][j + 1] + 1;
            }
            for (int i = 2; i <= n; ++i) {
                if (!valid[i][j] && vis[i][j]) f[i][j] = max(f[i][j], f[i - 1][j]);
            }
            for (int i = n - 1; i; --i) {
                if (!valid[i][j] && vis[i][j]) f[i][j] = max(f[i][j], f[i + 1][j]);
            }
        }
        bool ok = false;
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                if (f[i][j] >= k) {
                    ok = true;
                    break;
                }
                // cout << f[i][j] << ' ';
            }
            if (ok) break;
            // cout << endl;
        }
        printf(ok ? "Yes\n" : "No\n");
    }
    return 0;
}
```

## D. Determinant of 01-Matrix

这道是我写的，尝试了应该有三个小时，刚开始队友给出了一种方案，但是有超长度的风险，于是就真超长度了……后面我自己试了好久试出来一种看似可行的方法
，也是基于二进制的。

首先试出来了行列式为 2 的矩阵

$$
\begin{pmatrix}
    1 & 1 & 0\\
    0 & 1 & 1\\
    1 & 0 & 1
\end{pmatrix}
$$

二进制位是 0 的时候需要 * 2 的情况就解决了；然后尝试怎么让一个矩阵在 * 2 之后再 + 1，试出来的结论是在一个方阵右上角补一个 3 * 3 的单位阵，右下角补一个上面的矩阵，最后一列的最下面补一个 1，其他位置全填 0 就能实现，是从行列式分块的角度出发蒙的。

后来正经做法我也看了，甚至有一个现成的结构套一下就出来了，可惜我当时不知道，~~就这水平线代还考了 97~~。

```cpp
// 码风不一致是因为交题的电脑上 vscode 的插件发力了
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<vector<int>> mat = {{1, 1, 0}, {0, 1, 1}, {1, 0, 1}};

int main()
{
    int n;
    scanf("%d", &n);
    if (n == 1)
        cout << 1 << endl << 1 << endl;
    else
    {
        vector<vector<int>> res = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
        vector<int> b;
        while (n)
        {
            b.push_back(n & 1);
            n >>= 1;
        }
        for (int i = b.size() - 2; i >= 0; --i)
        {
            if (!b[i]) // mo wei shi ling
            {
                for (int j = 0; j < res.size(); ++j)
                {
                    res[j].push_back(0);
                    res[j].push_back(0);
                    res[j].push_back(0);
                }
                int t = res.size();
                for (int j = 0; j < 3; ++j)
                {
                    res.push_back(vector<int>(t, 0));
                    if (j == 0)
                        res.back().back() = 1;
                    for (int k = 0; k < 3; ++k)
                    {
                        res.back().push_back(mat[j][k]);
                    }
                }
            }
            else
            { // mo wei shi yi

                res[0].push_back(1);
                res[0].push_back(0);
                res[0].push_back(0);
                res[1].push_back(0);
                res[1].push_back(1);
                res[1].push_back(0);
                res[2].push_back(0);
                res[2].push_back(0);
                res[2].push_back(1);
                for (int j = 3; j < res.size(); ++j)
                {
                    res[j].push_back(0);
                    res[j].push_back(0);
                    res[j].push_back(0);
                }

                int t = res.size();
                for (int j = 0; j < 3; ++j)
                {
                    res.push_back(vector<int>(t, 0));
                    if (j == 0)
                        res.back().back() = 1;
                    for (int k = 0; k < 3; ++k)
                    {
                        res.back().push_back(mat[j][k]);
                    }
                }
            }
        }
        printf("%ld\n", res.size());
        for (auto row : res)
        {
            for (int i : row)
                printf("%d ", i);
            printf("\n");
        }
    }
    return 0;
}
```

## E. Echoes of 24 <span style="color: red"><sup>补</sup></span>

写完之后发现，还是数据结构适合我，看着吓人，但是赛后没怎么调就直接过了。

唉唉，三年前被树剖把心态弄崩（QQ 微信头像还是当时的 TLE），现在随手一个，还挺稳定的。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 500010;

int head[N], ver[N * 2], ne[N * 2], tot;
int dep[N], son[N], cnt[N], fa[N];
int dfn[N], rnk[N], top[N], t;
int a[N];
LL tr[N * 4];
int n, q;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x) {
    cnt[x] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa[x]) continue;
        fa[y] = x;
        dep[y] = dep[x] + 1;
        dfs(y);
        cnt[x] += cnt[y];
        if (cnt[y] > cnt[son[x]]) son[x] = y;
    }
}

void dfs(int x, int tp) {
    dfn[x] = ++t;
    rnk[t] = x;
    top[x] = tp;
    if (son[x]) dfs(son[x], tp);
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == son[x] || y == fa[x]) continue;
        dfs(y, y);
    }
}

void pushup(int u) {
    tr[u] = tr[u << 1] + tr[u << 1 | 1];
}

void build(int u, int l, int r) {
    if (l == r) {
		tr[u] = a[rnk[l]] > 1 ? a[rnk[l]] : 0;
	}
    else {
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] = v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        pushup(u);
    }
}

LL query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        LL res = 0;
        if (ql <= mid) res += query(u << 1, l, mid, ql, qr);
        if (qr > mid) res += query(u << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }
}

tuple<LL, int, int> query(int x, int y) {
    int dist = 0;
    LL s = 0;
    while (top[x] != top[y]) {
        if (dep[top[x]] < dep[top[y]]) swap(x, y);
        dist += dfn[x] - dfn[top[x]] + 1;
        s += query(1, 1, n, dfn[top[x]], dfn[x]);
        x = fa[top[x]];
    }
    if (dfn[x] > dfn[y]) swap(x, y);
	s += query(1, 1, n, dfn[x], dfn[y]);
    dist += dfn[y] - dfn[x] + 1;
    return {s, dist, x}; // sum 距离 lca
}

int main() {
    // freopen("input", "r", stdin);
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    dep[1] = 1;
    dfs(1);
    dfs(1, 1);
	build(1, 1, n);
	// cout << endl;
    while (q--) {
        int op, x, y;
        scanf("%d%d%d", &op, &x, &y);
        if (op == 1) {
            auto [s, dist, lca] = query(x, y);
            if (s > 24) printf("0\n");
            else if (s == 24 || dist >= 24) printf("1\n");
            else {
                vector<bool> f(25, 0), g(25, 0);
                vector<int> b;
                int l;
                for (int i = x; i != lca; i = fa[i]) b.emplace_back(i);
                b.emplace_back(lca);
                l = b.size();
                for (int i = y; i != lca; i = fa[i]) b.emplace_back(i);
                reverse(b.begin() + l, b.end());
                f[a[b[0]]] = true;
                for (int i = 1; i < b.size(); ++i) {
                    for (int j = 24; j > a[b[i]]; --j) {
                        g[j] = g[j] | f[j - a[b[i]]];
                    }
                    for (int j = 24; j; --j) {
                        if (j % a[b[i]] == 0) {
                            g[j] = g[j] | f[j / a[b[i]]];
                        }
                    }
                    f = g;
                    fill(g.begin(), g.end(), 0);
                }
                if (f[24]) printf("1\n");
                else printf("0\n");
            }
        }
        else {
            a[x] = y;
            modify(1, 1, n, dfn[x], y == 1 ? 0 : y);
        }
    }
    return 0;
}
```

## F. For the Treasury!	<span style="color: blue"><sup>队友</sup></span>

这应该是这一场最简单的题，可惜我们刚开始没发现他，后来补的时候也感觉很简单。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 300010;
long long a[N];

int main() {
    int n, k, c;
    scanf("%d%d%d", &n, &k, &c);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
        a[i] -= (long long)i * c;
    }
    sort(a + 1, a + n + 1, greater<long long>());
    long long res = 0;
    for (int i = 1; i <= k; ++i) {
        res += a[i];
    }
    res += (long long)k * (k + 1) * c / 2;
    printf("%lld\n", res);
    return 0;
}
```

## G. Ghost in the Parentheses <span style="color: red"><sup>补</sup></span>

这道当时也是差一点，一人 a 了一道之后队友就是在想这个，样例都验证过了，交了一发 WA 了后面就没调对。赛后还和标程对拍了，最终调对了。

我自己也看题解补了，所有条件都想到确实不容易，想到了也有统计漏但是风险。

```cpp
#include <iostream>
#include <cstring>

using namespace std;
const int N = 1000010;
const int MOD = 998244353;
typedef long long LL;

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

char s[N];
int pre[N], suf[N];

int main() {
    int n;
    scanf("%s", s + 1);
    n = strlen(s + 1);
    for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + (s[i] == '(');
    for (int i = n; i; --i) suf[i] = suf[i + 1] + (s[i] == ')');
    LL res = 0, l = 0;
    int t = 0;
    for (int i = 1; i <= n; ++i) {
        if (s[i] == '(') {
            t++;
            l = (l + power(2, pre[i - 1])) % MOD;
        }
        else t--;
        if (t <= 1) { // 强制 ( ) 都存在，强制选最后一个 ( 防止算重
            if (suf[i + 1]) {
                res = (res + l * (power(2, suf[i + 1]) - 1) % MOD) % MOD;
            }
            l = 0;
        }
    }
    res = (res + power(2, n / 2 + 1) - 1) % MOD; // 全 ( and 全 )
    res = res * power(power(2, n), MOD - 2) % MOD;
    printf("%lld\n", res);
    return 0;
}
```

## I. I, Box <span style="color: red"><sup>补</sup></span>

这道也相对简单，很可惜后面没时间了，直接每个 box bfs 一遍就可以，输出路径也比较无脑，如果有被别的箱子挡的情况就直接把挡他的那个箱子视为这个箱子继续就行，全程没有一点难度。

```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <vector>

using namespace std;

const int N = 60;
const int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};
const char name[] = {'D', 'R', 'U', 'L'};

struct node {
    char c;
    int x, y;
};
char mp[N][N];
int pre[N][N];
bool vis[N][N];
vector<node> res;
int n, m;
int bx = 0, dest = 0;

bool valid(int x, int y) {
    return x > 0 && x <= n && y > 0 && y <= m && mp[x][y] != '#';
}

void dfs(int x, int y) {
    if (vis[x][y]) return;
    vis[x][y] = true;
    if (mp[x][y] == '*') dest++;
    else if (mp[x][y] == '@') bx++;
    for (int i = 0; i < 4; ++i) {
        if (valid(x + dx[i], y + dy[i])) dfs(x + dx[i], y + dy[i]);
    }
}

bool check() {
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            if (!vis[i][j]) {
                dfs(i, j);
                if (bx != dest) return false;
            }
        }
    }
    return true;
}

void record(pair<int, int> p) {
    int dir = pre[p.first][p.second];
    if (dir != -1) {
        pair<int, int> q = p;
        q.first -= dx[dir], q.second -= dy[dir];
        record(q);
        char &c = mp[p.first][p.second], &d = mp[q.first][q.second];
        if (c != '!' && c != '@') {
            if (c == '.') c = '@';
            else if (c == '*') c = '!';
            else cout << "problem: c == " << c << endl;
            if (d == '!') d = '*';
            else d = '.';
            res.push_back({name[dir], q.first, q.second});
        }
    }
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%s", mp[i] + 1);
    }
    if (!check()) {
        printf("-1\n");
    }
    else {
        while (true) {
            int x = -1, y;
            for (int i = 1; i <= n; ++i) {
                for (int j = 1; j <= m; ++j) {
                    if (mp[i][j] == '@') {
                        x = i, y = j;
                        break;
                    }
                }
                if (x != -1) break;
            }
            if (x == -1) break;
            memset(vis, 0, sizeof(vis));
            memset(pre, -1, sizeof(pre));
            queue<pair<int, int>> q;
            q.push({x, y});
            vis[x][y] = true;
            pair<int, int> d;
            while (!q.empty()) {
                pair<int, int> s = q.front();
                q.pop();
                if (mp[s.first][s.second] == '*') {
                    d = s;
                    break;
                }
                for (int i = 0; i < 4; ++i) {
                    pair<int, int> t = s;
                    t.first += dx[i], t.second += dy[i];
                    if (valid(t.first, t.second) && vis[t.first][t.second] == false) {
                        vis[t.first][t.second] = true;
                        pre[t.first][t.second] = i;
                        q.push(t);
                    }
                }
            }
            record(d);
            // for (int i = 1; i <= n; ++i) {
            //     for (int j = 1; j <= m; ++j) {
            //         printf("%c", mp[i][j]);
            //     }
            //     printf("\n");
            // }
            // printf("\n");
        }
        printf("%ld\n", res.size());
        for (auto [c, x, y] : res) {
            printf("%d %d %c\n", x, y, c);
        }
    }    
    return 0;
}
```