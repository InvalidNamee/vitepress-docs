---
title: CSES Dynamic Programming
---
# CSES Dynamic Programming

这些是寒假集训新做的题，之前做过的不会再专门写一遍题解了，如果需要代码可以看[仓库](https://github.com/InvalidNamee/OJ-AC-Repository-for-UPC/tree/main/AC_code/CSES%E7%B3%BB%E5%88%97/3842_Dynamic_Programming)。

## Longest Common Subsequence

经典的 LCS，一个二维 DP 就可以解决，同时需要统计一下前驱，横着走和竖着走的时候不在 LCS 上，斜着走的时候在 LCS 上，最后输出。

```cpp
#include <iostream>

using namespace std;

const int N = 1010;
int f[N][N];
pair<int, int> pre[N][N];
int a[N], b[N];

void print(int i, int j) {
    if (!i) return;
    print(pre[i][j].first, pre[i][j].second);
    if (pre[i][j] == make_pair(i - 1, j - 1)) cout << a[i] << ' ';
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    for (int i = 1; i <= m; ++i) {
        cin >> b[i];
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            if (a[i] == b[j]) f[i][j] = f[i - 1][j - 1] + 1, pre[i][j] = {i - 1, j - 1};
            else if (f[i - 1][j] > f[i][j - 1]) f[i][j] = f[i - 1][j], pre[i][j] = {i - 1, j};
            else f[i][j] = f[i][j - 1], pre[i][j] = {i, j - 1};
        }
    }
    cout << f[n][m] << endl;
    print(n, m);
    cout << endl;
    return 0;
}
```

## Minimal Grid Path

刚开始只想着怎么 DP 出来一条路径，然后不是 TLE 就是 MLE，后来才发现事情远没有我想象的那么复杂。

从左上角开始贪心的选最小的，同步更新所有疑似是答案的路径。可行的 $O(n^2)$ 做法有**沿着主对角线方向一层一层手动更新**或者**用单调队列bfs**。我用了第一种，[MoScenix](https://moscenix.cn/)用了第二种。

```cpp
#include <iostream>
 
using namespace std;
const int N = 3010;
char a[N][N];
bool v[N][N];
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> (a[i] + 1);
    v[1][1] = true;
    cout << a[1][1];
    for (int k = 2; k < n * 2; ++k) {
        char mn = 'Z' + 1;
        for (int i = 1; i <= k; ++i) {
            int j = k - i;
            if (i < 0 || i > n || j < 0 || j > n) continue;
            if (!v[i][j]) continue;
            if (i < n) mn = min(mn, a[i + 1][j]);
            if (j < n) mn = min(mn, a[i][j + 1]);
        }
        cout << mn;
        for (int i = 1; i <= k; ++i) {
            int j = k - i;
            if (i < 0 || i > n || j < 0 || j > n) continue;
            if (!v[i][j]) continue;
            if (a[i + 1][j] == mn) v[i + 1][j] = true;
            if (a[i][j + 1] == mn) v[i][j + 1] = true;
        }
    }
    cout << endl;
    return 0;
}
```

## Mountain Range

~~根据直觉~~这个可以巧妙的转化成一个用一个中序遍历的序列生成一个二叉堆，求最大深度。这个问题就相当于在二叉堆上从上到下走到底的路径长度，需要注意如果一个节点和父亲节点权值一样那么这一条边不计入深度，因为不能平飞，用线段树维护出来区间最大值的位置就可以 $O(n\log n)$ 处理完。

```cpp
#include <iostream>
#include <vector>
#include <tuple>

using namespace std;

typedef pair<int, int> PII;
const int N = 200010;
PII tr[N * 4];
int n;

PII merge(PII a, PII b) {
    if (a.first >= b.first) return a;
    else return b;
}

void pushup(int u) {
    tr[u] = merge(tr[u << 1], tr[u << 1 | 1]);
}

void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] = {v, l};
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        pushup(u);
    }
}

PII query(int u, int l, int r, int ql, int qr) {
    if (ql > qr) {
        cout << "AWA" << endl;
    }
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        PII res = {-1, -1};
        if (ql <= mid) res = merge(res, query(u << 1, l, mid, ql, qr));
        if (qr > mid) res = merge(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int dp(PII rt, int l, int r) {
    if (l == r) return 1;
    int res = 1;
    if (l <= rt.second - 1) {
        PII ls = query(1, 1, n, l, rt.second - 1);
        res = max(res, dp(ls, l, rt.second - 1) + (rt.first > ls.first));
    }
    if (rt.second + 1 <= r) {
        PII rs = query(1, 1, n, rt.second + 1, r);
        res = max(res, dp(rs, rt.second + 1, r) + (rt.first > rs.first));
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int t;
        cin >> t;
        modify(1, 1, n, i, t);
    }
    cout << dp(tr[1], 1, n) << endl;
    return 0;
}
```

## Increasing Subsequence II

也是比较经典的题，从求长度变成了求个数。初始化一个末尾是 0 的子序列个数是 1，离散化一下权值，用**树状数组维护动态前缀和**统计方案数。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 200010, MOD = 1000000007;
typedef long long LL;
vector<int> values;
int a[N], m;
LL tr[N];

int get(int x) {
    return lower_bound(values.begin(), values.end(), x) - values.begin() + 1;
}

void add(int x, LL v) {
    for (; x <= m; x += x & -x) {
        tr[x] = (tr[x] + v) % MOD;
    }
}


LL query(int x) {
    LL res = 0;
    for (; x; x -= x & -x) {
        res = (res + tr[x]) % MOD;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        values.emplace_back(a[i]);
    }
    values.emplace_back(0);
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    m = values.size();
    for (int i = 1; i <= n; ++i) a[i] = get(a[i]);
    add(1, 1);
    LL res = 0;
    for (int i = 1; i <= n; ++i) {
        res = (res + query(a[i] - 1)) % MOD;
        add(a[i], query(a[i] - 1));
    }
    cout << res << endl;
    return 0;
}
```