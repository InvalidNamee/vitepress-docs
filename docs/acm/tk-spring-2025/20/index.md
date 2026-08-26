---
title: 2025春训第二十场
---
# 2025春训第二十场

第一场打完觉的非常水，于是第二场立刻就被真实了，已老实求放过😇😇😇。

## **A. 舞蹈机器人**

熟悉的情况，熟悉的打表（

**打表**

```cpp
#include <iostream>
#include <set>

using namespace std;

const int dx[] = {1, 0, -1, 0}, dy[] = {0, 1, 0, -1};
set<pair<int, int>> s;

void dfs(int x, int y, int dep, int lim, bool f) {
    if (dep == lim) {
        s.insert({x, y});
        return;
    }
    for (int i = f; i < 4; i += 2) {
        dfs(x + dx[i], y + dy[i], dep + 1, lim, f ^ 1);
    }
}

int main() {
    int n = 50;
    for (int i = 1; i <= 20; ++i) {
        s.clear();
        dfs(0, 0, 0, i, 0);
        dfs(0, 0, 0, i, 1);
        cout << s.size() << endl;
    }
    cout << endl;
    return 0;
}

/*
4 12 24 40 60 84 112
4  8 12 16 20 24 28
1  2  3  4  5  6  7

4 * n * (n - 1) / 2
*/
```

**AC 代码**

```python
n = int(input())
if n & 1:
    n = (n + 1) // 2
    print(n * (n + 1) * 2)
else:
    n = n // 2 + 1
    print(n * n)
```

## B. 狗是啥呀

这道比较简单一点，找一个单次伤害最大的作为最后一击，前面的找一个净伤害最高的一直打即可。

```cpp
#include <iostream>
#include <climits>

using namespace std;

int main() {
    int n;
    long long x, mxd = LLONG_MIN, mxk = 0;
    cin >> n >> x;
    for (int i = 1; i <= n; ++i) {
        long long d, h;
        cin >> d >> h;
        mxk = max(mxk, d);
        mxd = max(mxd, d - h);
    }
    if (x <= mxk) cout << 1 << endl;
    else if (mxd <= 0) cout << -1 << endl;
    else cout << 1 + (x - mxk + mxd - 1) / mxd << endl;
    return 0;
}
```

## C. 枢纽

看到这道题我直接就想到了点双联通分量缩点，于是写缩点写挂了（-14）……

事实上只有一组查询，完全可以**暴力**解决，从 a 出发搜索，经过 b 就直接 return 把搜到的点打上标记；同理从 b 出发打标记。如此，所有的点被分成三大区。

* 如果一个点两个标记都存在，表明他可以只经过 a 或者 b 到其他任何点，否则不能；
    
* 如果只有 a 或者 b 的标记，这两块点之间必须经过 a 和 b 才行。
    

所以答案是只被 a 标记的点个数 \* 只被 b 标记的点个数。

**优雅的做法**

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010, M = 1000010;

int head[N], ver[M], ne[M], tot = 1;
bool vis[N][2];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x, bool f, int t) {
    if (vis[x][f] || x == t) return;
    vis[x][f] = true;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        dfs(y, f, t);
    }
}

int main() {
    int n, m, a, b;
    scanf("%d%d%d%d", &n, &m, &a, &b);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    dfs(a, 0, b);
    dfs(b, 1, a);
    int t1 = 0, t2 = 0;
    for (int i = 1; i <= n; ++i) {
        if (vis[i][0] && !vis[i][1]) t1++;
        else if (vis[i][1] && !vis[i][0]) t2++;
    }
    t1--, t2--;
    printf("%lld\n", (long long)t1 * t2);
    return 0;
}
```

**丑陋的做法（缩点）**

```cpp
#include <iostream>
#include <set>
#include <vector>
#include <stack>

using namespace std;

const int N = 200010, M = 1000010;

set<pair<int, int>> s;
int head[N], ver[M], ne[M], tot = 1;
int dfn[N], low[N], t;
int bcc_id[N], bcc_siz[N * 2], bcc_cnt;
bool cut[N];
vector<int> ed[N * 2], bcc[N];
stack<int> st;
int fa[N * 2], dep[N * 2];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void tarjan(int x, int from) {
    dfn[x] = low[x] = ++t;
    st.push(x);
    int cnt = 0;
    for (int i = head[x]; i; i = ne[i]) {
        if (i == (from ^ 1)) continue;
        int y = ver[i];
        if (!dfn[y]) {
            tarjan(y, i);
            low[x] = min(low[x], low[y]);
            if (dfn[x] <= low[y]) {
                cnt++;
                if (x != 1 || cnt > 1) cut[x] = true;
                bcc_cnt++;
                int tp;
                do {
                    tp = st.top();
                    st.pop();
                    bcc_id[tp] = bcc_cnt;
                    bcc_siz[bcc_cnt]++;
                    bcc[bcc_cnt].push_back(tp);
                } while (tp != y);
                bcc_siz[bcc_cnt]++;
                bcc[bcc_cnt].push_back(x);
            }
        }
        else low[x] = min(low[x], dfn[y]);
    }
}

void dfs(int x) {
    for (int y : ed[x]) {
        if (y == fa[x]) continue;
        fa[y] = x;
        dep[y] = dep[x] + 1;
        dfs(y);
        bcc_siz[x] += bcc_siz[y];
    }
}

int check(int x, int y) {
    while (x) {
        if (fa[x] == y) return x;
        x = fa[x];
    }
    return 0;
}

int main() {
    int n, m, a, b;
    scanf("%d%d%d%d", &n, &m, &a, &b);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        if (x == y) continue;
        if (x > y) swap(x, y);
        if (s.find({x, y}) != s.end()) continue;
        s.insert({x, y});
        add(x, y), add(y, x);
    }
    tarjan(1, 0);
    for (int i = 1; i <= n; ++i) {
        if (cut[i]) {
            bcc_id[i] = ++bcc_cnt;
            bcc_siz[bcc_cnt] = 1;
        }
    }
    for (int i = 1; i <= bcc_cnt; ++i) {
        if (!bcc[i].empty()) {
            for (int x : bcc[i]) {
                if (cut[x]) {
                    bcc_siz[i]--;
                    ed[bcc_id[x]].push_back(i);
                    ed[i].push_back(bcc_id[x]);
                }
            }
        }
        else break;
    }
    if (!cut[a] || !cut[b]) {
        printf("0\n");
    }
    else {
        dfs(1);
        int x = bcc_id[a], y = bcc_id[b];
        if (dep[x] > dep[y]) swap(x, y);
        int f = check(y, x);
        if (f) { // x 是 y 的祖先
            printf("%lld\n", (long long)(n - bcc_siz[f] - 1) * (bcc_siz[y] - 1));
        }
        else {
            printf("%lld\n", (long long)(bcc_siz[x] - 1) * (bcc_siz[y] - 1));
        }
    }
    return 0;
}
```

## D. 魔法药水

这是一道 dp 题。

n ≤ 100，意味着每秒递增的魔力值只会是 1 ~ 100 之间的整数。枚举选择的瓶数 t，维护一个状态 $f_{i, j, k}$ 表示前 i 瓶药水选了 j 瓶，魔力值之和对 t 的余数为 k 时魔力值的最大值。对于每一个 t，如果存在状态 $f_{n, t, m \% t}$，就尝试用这个状态更新答案。

需要特别注意对每一个 t 是否存在合法的最终状态。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

long long f[110][110][110], a[110];

int main() {
    int n;
    long long m, res;
    cin >> n >> m;
    res = m;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    for (int t = 1; t <= n; ++t) {
        memset(f, -1, sizeof(f));
        f[0][0][0] = 0;
        for (int i = 1; i <= n; ++i) {
            f[i][0][0] = 0;
            // i 个 药水
            for (int j = 1; j <= t; ++j) {
                // 选了 j 个
                for (int k = 0; k < t; ++k) {
                    // 余数是 k
                    f[i][j][k] = f[i - 1][j][k];
                    if (~f[i - 1][j - 1][((k - a[i]) % t + t) % t])
                        f[i][j][k] = max(f[i][j][k], f[i - 1][j - 1][((k - a[i]) % t + t) % t] + a[i]);
                }
            }
        }
        if (~f[n][t][m % t]) res = min(res, (m - f[n][t][m % t]) / t);
    }
    cout << res << endl;
    return 0;
}
```