---
title: 2026寒假个人训练赛第七场
---
# 2026寒假个人训练赛第七场

## A. 松果(pinecones)

给最小的加 1。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, mn = 100, p = 0;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
        if (a[i] < mn) mn = a[i], p = i;
    }
    long long res = 1;
    for (int i = 0; i < n; ++i) {
        if (i != p) res *= a[i];
    }
    cout << res * (mn + 1) << endl;
    return 0;
}
```

## B. 池化(pooling)

直接模拟。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k;
    cin >> n >> k;
    vector<vector<int>> a(n + 1, vector<int>(n + 1));
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cin >> a[i][j];
        }
    }
    for (int i = k; i <= n; i += k) {
        for (int j = k; j <= n; j += k) {
            int r = 0;
            for (int d1 = 0; d1 < k; ++d1) {
                for (int d2 = 0; d2 < k; ++d2) {
                    r = max(r, a[i - d1][j - d2]);
                }
            }
            cout << r << ' ';
        }
        cout << endl;
    }
    return 0;
}
```

## C. 选择排序(select)

观察他给的样例能总结出规律。

- 字典序最小的一定是在顺序的基础上，交换第 $k$ 个和第 $k + 1$ 个；
- 字典序最大的有两种情况
  - $k > \lfloor \frac{n}{2} \rfloor$ 一定是在逆序的基础上交换第 $k$ 个和第 $k + 1$ 个；
  - 否则在逆序的基础上把 $[k + 1, n - k]$ 正过来。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 2010;
int a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n, k;
        cin >> n >> k;
        if (k == 0) {
            for (int i = 1; i <= n; ++i) cout << i << ' ';
            cout << endl;
            for (int i = 1; i <= n; ++i) cout << i << ' ';
            cout << endl;
        }
        else {
            for (int i = 1; i <= n; ++i) {
                if (i == k) cout << k + 1 << ' ';
                else if (i == k + 1) cout << k << ' ';
                else cout << i << ' ';
            }
            cout << endl;
            if (k > n / 2)
                for (int i = 1; i <= n; ++i) {
                    if (i == k) cout << n - k << ' ';
                    else if (i == k + 1) cout << n - k + 1 << ' ';
                    else cout << n - i + 1 << ' ';
                }
            else {
                for (int i = 1; i <= k; ++i) {
                    cout << n - i + 1 << ' ';
                }
                for (int i = k + 1; i <= n - k; ++i) {
                    cout << i << ' ';
                }
                for (int i = 1; i <= k; ++i) {
                    cout << k - i + 1 << ' ';
                }
            }
            cout << endl;
        }
    }
    return 0;
}
```

## D. 困难的题目(hard)

实际上一点也不困难。贪心的想，对于每一个数能覆盖到他的区间全加 w 一定不劣，不能覆盖他的一定是不加。因为 n 很小，用前缀和优化一下暴力处理即可，否则可能要变成一道数据结构题了。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <tuple>

using namespace std;

typedef long long LL;
const int N = 5010;
LL a[N], c[N];
bool res[N];
vector<tuple<int, int, int>> b[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, w;
    cin >> n >> m >> w;
    for (int i = 1; i <= m; ++i) {
        int l, r, v;
        cin >> l >> r >> v;
        if (~v) a[l] += v, a[r + 1] -= v;
        else b[l].emplace_back(l, r, w), b[r + 1].emplace_back(l, r, -w);
    }
    for (int i = 1; i <= n; ++i) {
        a[i] += a[i - 1];
    }
    for (int i = 1; i <= n; ++i) {
        memset(c, 0, sizeof(LL) * (n + 1));
        for (auto [l, r, w] : b[i]) {
            c[l] += w, c[r + 1] -= w;
        }
        LL mx = 0;
        for (int i = 1; i <= n; ++i) {
            c[i] += c[i - 1];
            a[i] += c[i];
            mx = max(mx, a[i]);
        }
        if (a[i] == mx) cout << 1;
        else cout << 0;
    }
    cout << endl;
    return 0;
}
```

## E. 回文(palindrom)

区间 DP，记 $f_{l, r}$ 为区间 $[l, r]$ 的回文串数量，考虑通过分类讨论区间左右端点的关系统计数量

$$
f_{l, r} = \begin{cases}
    1 & l = r\\
    f_{l + 1, r} + f_{l, r - 1} + 1 & s_l = s_r\\
    f_{l + 1, r} + f_{l, r - 1} - f_{l + 1, r - 1} & else 
\end{cases}
$$

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 5010;
const int MOD = 1000000007;
LL f[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        string s;
        cin >> s;
        s = " " + s;
        int n = s.length() - 1;
        // cout << n << endl;
        for (int i = 1; i <= n; ++i) {
            f[i][i] = 1;
        }
        for (int i = 1; i < n; ++i) {
            f[i][i + 1] = s[i] == s[i + 1] ? 3 : 2;
        }
        for (int len = 3; len <= n; ++len) {
            for (int i = 1; i + len - 1 <= n; ++i) {
                int j = i + len - 1;
                f[i][j] = ((f[i + 1][j] + f[i][j - 1] - f[i + 1][j - 1]) % MOD + MOD) % MOD;
                if (s[i] == s[j]) f[i][j] = (f[i][j] + f[i + 1][j - 1] + 1) % MOD;
            }
        }
        cout << f[1][n] << endl;
    }
    return 0;
}
```

## F. Fill the Square

贪心的给前面填小的一定没问题，又因为有 26 个可选项，但是相邻的最多只有 4 个，后面一定能有可行解，直接暴力就行了。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <tuple>

using namespace std;

const int N = 20;
const int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
char a[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    for (int t = 1; t <= T; ++t) {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i) cin >> (a[i] + 1);
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (isalpha(a[i][j])) continue;
                else {
                    for (char c = 'A'; c <= 'Z'; ++c) {
                        bool f = true;
                        for (int d = 0; d < 4; ++d) {
                            int tx = i + dx[d], ty = j + dy[d];
                            if (a[tx][ty] == c) {
                                f = false;
                                break;
                            }
                        }
                        if (f) {
                            a[i][j] = c;
                            break;
                        }
                    }
                }
            }
        }
        cout << "Case " << t << ":" << endl;
        for (int i = 1; i <= n; ++i) cout << (a[i] + 1) << endl;
    }
    return 0;
}
```

## G. The Cow Gathering



## H. Disruption

先建出来树，然后每次将 p 到 q 路径上的所有边和 r 取个 min。可以直接无脑**树剖 + 线段树**，或者先对 r 排序，之后贪心用**并查集**维护（每条边只走一次，所以可以暴力走）。

我在默写树剖 + 线段树上取得了 25 min 的好成绩，你也来试试吧～～

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 50010;

int head[N], ver[N * 2], ne[N * 2], tot = 1;
int dep[N], cnt[N], fa[N], son[N];
int dfn[N], top[N], t; 
int tr[N * 4], tag[N * 4];
int n, m;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs1(int x) {
    cnt[x] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa[x]) continue;
        dep[y] = dep[x] + 1;
        fa[y] = x;
        dfs1(y);
        if (cnt[y] > cnt[son[x]]) son[x] = y;
        cnt[x] += cnt[y];
    }
}

void dfs2(int x, int tp) {
    top[x] = tp;
    dfn[x] = ++t;
    if (son[x]) dfs2(son[x], tp);
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa[x] || y == son[x]) continue;
        dfs2(y, y);
    }
}

void pushup(int u) {
    tr[u] = min(tr[u << 1], tr[u << 1 | 1]);
}

void pushdown(int u) {
    if (tag[u] != 0x3f3f3f3f) {
        tag[u << 1] = min(tag[u << 1], tag[u]), tag[u << 1 | 1] = min(tag[u << 1 | 1], tag[u]);
        tr[u << 1] = min(tr[u << 1], tag[u]), tr[u << 1 | 1] = min(tr[u << 1 | 1], tag[u]);
        tag[u] = 0x3f3f3f3f;
    }
}

void modify(int u, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) {
        tr[u] = min(tr[u], v);
        tag[u] = min(tag[u], v);
    }
    else {
        int mid = l + r >> 1;
        pushdown(u);
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql ,qr, v);
        pushup(u);
    }
}

int query(int u, int l, int r, int p) {
    if (l == r) return tr[u];
    else {
        int mid = l + r >> 1;
        pushdown(u);
        if (p <= mid) return query(u << 1, l, mid, p);
        else return query(u << 1 | 1, mid + 1, r, p);
    }
}

void print(int u, int l, int r) {
    if (l == r) cout << tr[u] << ' ';
    else {
        int mid = l + r >> 1;
        pushdown(u);
        print(u << 1, l, mid), print(u << 1 | 1, mid + 1, r);
    }
}

void modify(int x, int y, int v) {
    while (top[x] != top[y]) {
        if (dep[top[x]] < dep[top[y]]) swap(x, y);
        modify(1, 1, n, dfn[top[x]], dfn[x], v);
        x = fa[top[x]];
    }
    if (dfn[x] == dfn[y]) return;
    if (dfn[x] > dfn[y]) swap(x, y);
    modify(1, 1, n, dfn[x] + 1, dfn[y], v);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m;
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    dep[1] = 1;
    dfs1(1);
    dfs2(1, 1);
    memset(tr, 0x3f, sizeof(int) * (n * 4));
    memset(tag, 0x3f, sizeof(int) * (n * 4));
    while (m--) {
        int x, y, z;
        cin >> x >> y >> z;
        modify(x, y, z);
        // print(1, 1, n);
        // cout << endl;
    }
    for (int i = 2; i <= tot; i += 2) {
        int t = query(1, 1, n, max(dfn[ver[i]], dfn[ver[i ^ 1]]));
        cout << (t == 0x3f3f3f3f ? -1 : t) << endl;
    }
    return 0;
}
```