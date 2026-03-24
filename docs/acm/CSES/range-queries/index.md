---
title: CSES Range Queries
---
# CSES Range Queries

这些是寒假集训新做的题，之前做过的不会再专门写一遍题解了，如果需要代码可以看[仓库](https://github.com/InvalidNamee/OJ-AC-Repository-for-UPC/tree/main/AC_code/CSES%E7%B3%BB%E5%88%97/3845_Range_Queries)。

## Visible Buildings Queries

单调栈维护每个元素右侧第一个比他大的元素的位置，然后用倍增查询。

```cpp
#include <iostream>
#include <stack>

using namespace std;

const int N = 100010;

stack<int> st;
int a[N], f[N][17];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        while (!st.empty() && a[i] > a[st.top()]) {
            f[st.top()][0] = i;
            st.pop();
        }
        st.emplace(i);
    }
    while (!st.empty()) {
        f[st.top()][0] = n + 1;
        st.pop();
    }
    f[n + 1][0] = n + 1;
    for (int j = 1; j < 17; ++j) {
        for (int i = 1; i <= n + 1; ++i) {
            f[i][j] = f[f[i][j - 1]][j - 1];
        }
    }
    while (q--) {
        int l, r, res = 0;
        cin >> l >> r;
        for (int i = 16; i >= 0; --i) {
            if (f[l][i] <= r) {
                l = f[l][i];
                res += 1 << i;
            }
        }
        cout << res + 1 << endl;
    }
    return 0;
}
```

## Range Interval Queries

主席树（可持久化线段树）板子，离散化之后维护一个可持久化的权值线段树查询的时候用两颗不同版本的树作差。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 200010;

struct Node {
    int val, ls, rs;
} tr[N * 20];
int tot;

vector<int> values;
int a[N], rt[N];

void pushup(int u) {
    tr[u].val = tr[tr[u].ls].val + tr[tr[u].rs].val;
}

void modify(int &u, int v, int l, int r, int p, int val) {
    u = ++tot;
    tr[u] = tr[v];
    if (l == r) tr[u].val += val;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(tr[u].ls, tr[v].ls, l, mid, p, val);
        else modify(tr[u].rs, tr[v].rs, mid + 1, r, p, val);
        pushup(u);
    }
}

int query(int u, int v, int l, int r, int ql, int qr) {
    if (u == 0 && v == 0) return 0;
    if (ql <= l && r <= qr) return tr[v].val - tr[u].val;
    else {
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = query(tr[u].ls, tr[v].ls, l, mid, ql, qr);
        if (qr > mid) res += query(tr[u].rs, tr[v].rs, mid + 1, r, ql, qr);
        return res;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        values.emplace_back(a[i]);
    }
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    for (int i = 1; i <= n; ++i) {
        modify(rt[i], rt[i - 1], 1, n, lower_bound(values.begin(), values.end(), a[i]) - values.begin() + 1, 1);
    }
    while (q--) {
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        c = lower_bound(values.begin(), values.end(), c) - values.begin() + 1;
        d = upper_bound(values.begin(), values.end(), d) - values.begin();
        cout << query(rt[a - 1], rt[b], 1, n, c, d) << endl;
    }
    return 0;
}
```

## Subarray Sum Queries II

最大子段和，上一道是带修改的，这一道是静态查询。都是线段树维护和，最大前缀和，最大后缀和，最大子段和。推荐开结构体，建议专门写一个 merge 函数合并两个节点。

```cpp
#include <cstdio>
#include <iostream>
 
using namespace std;
 
const int N = 200010;
 
struct Node {
    long long s, ls, rs, ms;
} tr[N << 2];

Node merge(Node a, Node b) {
    Node res;
    res.s = a.s + b.s;
    res.ls = max(a.ls , a.s + b.ls);
    res.rs = max(b.rs, a.rs + b.s);
    res.ms = max(a.rs + b.ls, max(a.ms, b.ms));
    return res;
}
 
void modify(int u, int l, int r, int p, int v) {
    if (l == r) {
        tr[u].s = v;
        tr[u].ls = tr[u].rs = tr[u].ms = max(0, v);
        return;
    }
    int mid = l + r >> 1;
    if (p <= mid) modify(u << 1, l, mid, p, v);
    else modify(u << 1 | 1, mid + 1, r, p, v);
    tr[u] = merge(tr[u << 1], tr[u << 1 | 1]);
}

Node query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    int mid = l + r >> 1;
    Node res = {0, 0, 0, 0};
    if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
    if (qr > mid) res = merge(res, query(u << 1 | 1, mid + 1, r, ql, qr));
    return res;
}
 
int main() {
    int n, q;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        modify(1, 1, n, i, t);
    }
    while (q--) {
        int l, r;
        scanf("%d%d", &l, &r);
        printf("%lld\n", query(1, 1, n, l, r).ms);
    }
    return 0;
}
```

## Distinct Values Queries II

把所有可能的权值离散化，各开一个 set 存所有的出现位置。开线段树维护区间内的元素前一次出现位置的最大值。

- 对于一个修改操作
  - 找到旧权值的 set，删掉旧的那一次出现的下标，修改线段树，把后一次的下标的权值改成前一次的下标
  - 把下标插入到新权值的 set，修改线段树，当前下标的值改成前一次出现的权值，后一次出现的下标的值改成当前下标
- 对于一个查询操作
  - 只需要查区间最大值是否大于左端点即可

```cpp
#include <cstdio>
#include <iostream>
 
using namespace std;
 
const int N = 200010;
 
struct Node {
    long long s, ls, rs, ms;
} tr[N << 2];

Node merge(Node a, Node b) {
    Node res;
    res.s = a.s + b.s;
    res.ls = max(a.ls , a.s + b.ls);
    res.rs = max(b.rs, a.rs + b.s);
    res.ms = max(a.rs + b.ls, max(a.ms, b.ms));
    return res;
}
 
void modify(int u, int l, int r, int p, int v) {
    if (l == r) {
        tr[u].s = v;
        tr[u].ls = tr[u].rs = tr[u].ms = max(0, v);
        return;
    }
    int mid = l + r >> 1;
    if (p <= mid) modify(u << 1, l, mid, p, v);
    else modify(u << 1 | 1, mid + 1, r, p, v);
    tr[u] = merge(tr[u << 1], tr[u << 1 | 1]);
}

Node query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    int mid = l + r >> 1;
    Node res = {0, 0, 0, 0};
    if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
    if (qr > mid) res = merge(res, query(u << 1 | 1, mid + 1, r, ql, qr));
    return res;
}
 
int main() {
    int n, q;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        modify(1, 1, n, i, t);
    }
    while (q--) {
        int l, r;
        scanf("%d%d", &l, &r);
        printf("%lld\n", query(1, 1, n, l, r).ms);
    }
    return 0;
}
```

## Movie Festival Queries

> [!NOTE]
> 这道题看了题解

思路比较巧妙，开一个数组，对于每一场 movie 在左端点的下标的位置存右端点的位置，做一个后缀 min 能得到从某个时间开始看电影看完一场的最早时间，然后用倍增就解决了。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 1000010;
int f[N][20];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q, m = 1000000;
    cin >> n >> q;
    for (int i = 1; i <= m + 1; ++i) {
        f[i][0] = m + 1;
    }
    for (int i = 1; i <= n; ++i) {
        int l, r;
        cin >> l >> r;
        f[l][0] = min(f[l][0], r);
    }
    for (int i = m; i; --i) {
        f[i][0] = min(f[i][0], f[i + 1][0]);
    }
    for (int j = 1; j < 20; ++j) {
        for (int i = 1; i <= m + 1; ++i) {
            f[i][j] = f[f[i][j - 1]][j - 1];
        }
    }
    while (q--) {
        int l, r, res = 0;
        cin >> l >> r;
        for (int i = 19; i >= 0; --i) {
            if (f[l][i] <= r) {
                l = f[l][i];
                res |= 1 << i;
            }
        }
        cout << res << endl;
    }
    return 0;
}
```

## Range Queries and Copies

刚开始我以为他是一个数组一直往尾部加，又看了看发现他是新建一整组，所以又是一个主席树。

- 操作 1：单点修改。
- 操作 2：找到 array k 的主席树的根的下标，从这个根开始做区间查询。
- 操作 3：直接往存根的数组里加一项，复制 array k 的根的下标。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 200010;

struct Node {
    LL val;
    int ls, rs;
} tr[N * 24];
int tot;

int a[N], rt[N], cnt = 1;

void pushup(int u) {
    tr[u].val = tr[tr[u].ls].val + tr[tr[u].rs].val;
}

void build(int &u, int l, int r) {
    u = ++tot;
    if (l == r) tr[u] = {a[l]};
    else {
        int mid = l + r >> 1;
        build(tr[u].ls, l, mid), build(tr[u].rs, mid + 1, r);
        pushup(u);
    }
}

void modify(int &u, int v, int l, int r, int p, int val) {
    u = ++tot;
    tr[u] = tr[v];
    if (l == r) tr[u].val = val;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(tr[u].ls, tr[v].ls, l, mid, p, val);
        else modify(tr[u].rs, tr[v].rs, mid + 1, r, p, val);
        pushup(u);
    }
}

LL query(int u, int l, int r, int ql, int qr) {
    if (u == 0) return 0;
    if (ql <= l && r <= qr) return tr[u].val;
    else {
        int mid = l + r >> 1;
        LL res = 0;
        if (ql <= mid) res = query(tr[u].ls, l, mid, ql, qr);
        if (qr > mid) res += query(tr[u].rs, mid + 1, r, ql, qr);
        return res;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    build(rt[cnt], 1, n);
    while (q--) {
        int op;
        cin >> op;
        if (op == 1) {
            int a, k, x;
            cin >> k >> a >> x;
            modify(rt[k], rt[k], 1, n, a, x);
        }
        else if (op == 2) {
            int k, a, b;
            cin >> k >> a >> b;
            cout << query(rt[k], 1, n, a, b) << endl;
        }
        else {
            int k;
            cin >> k;
            rt[++cnt] = rt[k];
        }
    }
    return 0;
}
```

## Missing Coin Sum Queries

> [!NOTE]
> 事实证明不能做太多的数据结构，我该休息了。被一个 int 爆了一个小时才发现，还有这么蠢的人吗😭

先回顾单独的 Missing Coin Sum 怎么做，如果一组硬币已经可以表示 $\left[1, m\right]$，那么加入一个面值为 $a_i$ 的硬币，当且仅当 $a_i \le m$ 的时候才能保证 $\left[1, m + a_i\right]$ 的值都能表示，否则中间一定有间断，第一个不能表示的还是 $m + 1$。从小往大推，不断这样扩大区间直到不能扩大就可以得到答案。

1. 初始化答案 $res = 1$；
2. 尝试把所有小于答案的数相加得到 $s$
   - 如果 $s \ge res$，更新答案 $res = s + 1$，转到 2 继续尝试更大的能不能表示。
   - 否则 $res$ 就是答案。

那么继续来考虑现在的问题，不难发现上面的流程中 $res$ 是指数级增长的，只要能快速算出这个小于等于 $res$ 的数的和就能不 TLE。这个可以用**离散化 + 主席树**实现。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 200010;

struct Node {
    LL val;
    int ls, rs;
} tr[N * 20];
int tot;

vector<LL> values;
int a[N], rt[N];

void pushup(int u) {
    tr[u].val = tr[tr[u].ls].val + tr[tr[u].rs].val;
}

void modify(int &u, int v, int l, int r, int p, int val) {
    u = ++tot;
    tr[u] = tr[v];
    if (l == r) tr[u].val += val;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(tr[u].ls, tr[v].ls, l, mid, p, val);
        else modify(tr[u].rs, tr[v].rs, mid + 1, r, p, val);
        pushup(u);
    }
}

LL query(int u, int v, int l, int r, int ql, int qr) {
    if (ql > qr) return 0;
    if (u == 0 && v == 0) return 0;
    if (ql <= l && r <= qr) return tr[v].val - tr[u].val;
    else {
        int mid = l + r >> 1;
        LL res = 0;
        if (ql <= mid) res = query(tr[u].ls, tr[v].ls, l, mid, ql, qr);
        if (qr > mid) res += query(tr[u].rs, tr[v].rs, mid + 1, r, ql, qr);
        return res;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        values.emplace_back(a[i]);
    }
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    int m = values.size();
    for (int i = 1; i <= n; ++i) {
        modify(rt[i], rt[i - 1], 1, m, lower_bound(values.begin(), values.end(), a[i]) - values.begin() + 1, a[i]);
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        LL res = 1;
        int T = 100;
        while (T--) {
            /*
            if Q is valid:
                \sum [1, Q] is valid
            */
            LL s = query(rt[l - 1], rt[r], 1, m, 1, upper_bound(values.begin(), values.end(), res) - values.begin());
            if (res == s + 1) break;
            else res = s + 1;
        }
        cout << res << endl;
    }
    return 0;
}

```
