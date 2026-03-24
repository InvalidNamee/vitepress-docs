---
title: CSES Adcanced Techniques
---
# CSES Adcanced Techniques

更新 ing（但是会优先补 vp ICPC 没做出来的题）

## Meet in the Middle

对半分，两半分别暴力所有情况。最后排序，遍历一边的，用二分或者双指针维护另一边的合法的组合的范围。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 40;
int a[N], lb, lc;
LL b[1 << 20], c[1 << 20];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, x;
    cin >> n >> x;
    for (int i = 0; i < n; ++i) cin >> a[i];
    int mid = n >> 1;
    for (int i = 0; i < (1 << mid); ++i) {
        LL s = 0;
        for (int j = 0; j < mid; ++j) {
            if (i >> j & 1) s += a[j];
        }
        b[lb++] = s;
    }
    for (int i = 0; i < (1 << n - mid); ++i) {
        LL s = 0;
        for (int j = 0; j < n - mid; ++j) {
            if (i >> j & 1) s += a[j + mid];
        }
        c[lc++] = s;
    }
    sort(b, b + lb), sort(c, c + lc);
    LL res = 0;
    for (int i = 0; i < lb; ++i) {
        res += upper_bound(c, c + lc, x - b[i]) - lower_bound(c, c + lc, x - b[i]); 
    }
    cout << res << endl;
    return 0;
}
```

## Hamming Distance

直接暴力就行了。

```cpp
#include <iostream>
#include <bitset>

using namespace std;

const int N = 20010;
bitset<31> a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k;
    cin >> n >> k;
    int res = 40;
    for (int i = 1; i <= n; ++i) {
        string s;
        int t = 0;
        cin >> s;
        for (char c : s) t = (t << 1) + (c == '1');
        a[i] = t;
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = i + 1; j <= n; ++j) {
            res = min(res, (int)(a[i] ^ a[j]).count());
        }
    }
    cout << res << endl;
    return 0;
}
```

## Corner Subgrid Check	

卡不过去😭

## Corner Subgrid Count

思路应该很显然，开 bitset 存位置，暴力枚举所有行号组合两个二进制串与一下，设 1 的数量为 c，对答案贡献 $\binom{c}{2}$.然后就是怎么卡常都过不去，最后看别人开了个 `Ofast` 优化过去了，然后我也开，993ms 极限跑过去了。

```cpp
#pragma GCC optimize("Ofast")
#include <iostream>
#include <bitset>
#include <cstring>
 
using namespace std;
 
typedef long long LL;
const int N = 3010;
char a[N][N];
bitset<N> b[N];
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> (a[i] + 1);
        for (int j = 1; j <= n; ++j) {
            b[i][j] = a[i][j] == '1';
        }
    }
    LL res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = i + 1; j <= n; ++j) {
            LL c = (b[i] & b[j]).count();
            res += c * (c - 1) / 2;
        }
    }
    cout << res << endl;
    return 0;
}
```

## Reachable Nodes

用 bitset 记录能到的点，用记搜做反拓扑序 dp。

```cpp
#include <iostream>
#include <bitset>

using namespace std;

const int N = 50010, M = 100010;
bitset<N> f[N];
bool v[N];
int ver[M], ne[M], head[N], tot;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x) {
    if (v[x]) return;
    v[x] = true;
    f[x][x] = true;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        dfs(y);
        f[x] |= f[y];
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y);   
    }
    for (int i = 1; i <= n; ++i) {
        if (!v[i]) dfs(i);
        cout << f[i].count() << ' ';
    }
    cout << endl;
    return 0;
}
```

## Reachability Queries

上一道的增强版。强联通分量缩点之后在反拓扑序 DP 即可。

```cpp
#include <iostream>
#include <bitset>

using namespace std;

const int N = 50010, M = 200010;
int h1[N], h2[N], ver[M], ne[M], tot;
int st[N], tp;
int dfn[N], low[N], scc_id[N], scc_cnt, t;
bool ins[N];
bool vis[N];
bitset<N> f[N];

void add(int *head, int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void tarjan(int x) {
    dfn[x] = low[x] = ++t;
    st[++tp] = x;
    ins[x] = true;
    for (int i = h1[x]; i; i = ne[i]) {
        int y = ver[i];
        if(!dfn[y]) {
            tarjan(y);
            low[x] = min(low[x], low[y]);
        } 
        else if (ins[y]) low[x] = min(low[x], dfn[y]);
    }
    if (dfn[x] == low[x]) {
        int y;
        scc_cnt++;
        do {
            y = st[tp--];
            ins[y] = false;
            scc_id[y] = scc_cnt;
        } while (y != x);
    }
}


void dfs(int x) {
    if (vis[x]) return;
    vis[x] = true;
    f[x][x] = true;
    for (int i = h2[x]; i; i = ne[i]) {
        int y = ver[i];
        dfs(y);
        f[x] |= f[y];
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, q;
    cin >> n >> m >> q;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        add(h1, x, y);
    }
    for (int i = 1; i <= n; ++i) {
        if (!dfn[i]) tarjan(i);
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = h1[i]; j; j = ne[j]) {
            int y = ver[j];
            if (scc_id[i] != scc_id[y]) {
                add(h2, scc_id[i], scc_id[y]);
            }
        }
    }
    while (q--) {
        int a, b;
        cin >> a >> b;
        a = scc_id[a], b = scc_id[b];
        dfs(a);
        cout << (f[a][b] ? "YES" : "NO") << endl;
    }
    return 0;
}
```

## Cut and Paste

可以用 [FHQ-Treap](https://oi-wiki.org/ds/treap/#%E6%97%A0%E6%97%8B-treap)（现学的）。这是一种基于分裂和合并的 Treap，感觉写起来反而还比一般的 Treap 好写。

```cpp
#include <iostream>
#include <random>
#include <ctime>

using namespace std;

const int N = 200010;
mt19937 rnd(time(nullptr));

struct Node {
    int ls, rs;
    int cnt;
    char c;
    unsigned pri;
} tr[N];
int tot, rt;

void pushup(int u) {
    tr[u].cnt = tr[tr[u].ls].cnt + tr[tr[u].rs].cnt + 1;
}

void split(int u, int k, int &x, int &y) {
    if (!u) {
        x = y = 0;
        return;
    }
    int lsiz = tr[tr[u].ls].cnt + 1;
    if (lsiz <= k) x = u, split(tr[u].rs, k - lsiz, tr[u].rs, y);
    else y = u, split(tr[u].ls, k, x, tr[u].ls);
    pushup(u);
}

int merge(int u, int v) {
    if (!u || !v) return u | v;
    if (tr[u].pri < tr[v].pri) {
        tr[u].rs = merge(tr[u].rs, v);
        pushup(u);
        return u;
    }
    else {
        tr[v].ls = merge(u, tr[v].ls);
        pushup(v);
        return v;
    }
}

int newNode(char c) {
    tr[++tot] = {0, 0, 1, c, rnd()};
    return tot;
}

void print(int u) {
    if (!u) return;
    else {
        print(tr[u].ls);
        cout << tr[u].c;
        print(tr[u].rs);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    string s;
    cin >> n >> q >> s;
    for (char c : s) rt = merge(rt, newNode(c));
    while (q--) {
        int l, r;
        cin >> l >> r;
        int lt, mt, rrt;
        split(rt, l - 1, lt, mt);
        split(mt, r - l + 1, mt, rrt);
        rt = merge(lt, rrt);
        rt = merge(rt, mt);
    }
    print(rt);
    cout << endl;
    return 0;
}
```

## Substring Reversals

仍然可以用 FHQ-Treap，这次的区间反转需要打懒标记。

```cpp
#include <iostream>
#include <random>
#include <ctime>

using namespace std;

const int N = 200010;
mt19937 rnd(time(nullptr));

struct Node {
    int ls, rs;
    int cnt;
    char c;
    bool tag;
    unsigned pri;
} tr[N];
int tot, rt;

void pushup(int u) {
    tr[u].cnt = tr[tr[u].ls].cnt + tr[tr[u].rs].cnt + 1;
}

void pushdown(int u) {
    if (tr[u].tag) {
        if (tr[u].ls) swap(tr[tr[u].ls].ls, tr[tr[u].ls].rs), tr[tr[u].ls].tag ^= 1;
        if (tr[u].rs) swap(tr[tr[u].rs].ls, tr[tr[u].rs].rs), tr[tr[u].rs].tag ^= 1;
        tr[u].tag = 0;
    }
}

void split(int u, int k, int &x, int &y) {
    if (!u) {
        x = y = 0;
        return;
    }
    pushdown(u);
    int lsiz = tr[tr[u].ls].cnt + 1;
    if (lsiz <= k) x = u, split(tr[u].rs, k - lsiz, tr[u].rs, y);
    else y = u, split(tr[u].ls, k, x, tr[u].ls);
    pushup(u);
}

int merge(int u, int v) {
    if (!u || !v) return u | v;
    if (tr[u].pri < tr[v].pri) {
        pushdown(u);
        tr[u].rs = merge(tr[u].rs, v);
        pushup(u);
        return u;
    }
    else {
        pushdown(v);
        tr[v].ls = merge(u, tr[v].ls);
        pushup(v);
        return v;
    }
}

int newNode(char c) {
    tr[++tot] = {0, 0, 1, c, 0, rnd()};
    return tot;
}

void print(int u) {
    if (!u) return;
    else {
        pushdown(u);
        print(tr[u].ls);
        cout << tr[u].c;
        print(tr[u].rs);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    string s;
    cin >> n >> q >> s;
    for (char c : s) rt = merge(rt, newNode(c));
    while (q--) {
        int l, r;
        cin >> l >> r;
        int lt, mt, rrt;
        split(rt, l - 1, lt, mt);
        split(mt, r - l + 1, mt, rrt);
        swap(tr[mt].ls, tr[mt].rs);
        tr[mt].tag ^= 1;
        rt = merge(lt, mt);
        rt = merge(rt, rrt);
    }
    print(rt);
    cout << endl;
    return 0;
}
```

## Reversals and Sums

同上，多维护一个 sum，pushup 的时候更新即可。

```cpp
#include <iostream>
#include <random>
#include <ctime>

using namespace std;
typedef long long LL;
const int N = 200010;
mt19937 rnd(time(nullptr));

struct Node {
    int ls, rs;
    int cnt;
    LL val, s;
    bool tag;
    unsigned pri;
} tr[N];
int tot, rt;

void pushup(int u) {
    tr[u].cnt = tr[tr[u].ls].cnt + tr[tr[u].rs].cnt + 1;
    tr[u].s = tr[tr[u].ls].s + tr[tr[u].rs].s + tr[u].val;
}

void pushdown(int u) {
    if (tr[u].tag) {
        if (tr[u].ls) swap(tr[tr[u].ls].ls, tr[tr[u].ls].rs), tr[tr[u].ls].tag ^= 1;
        if (tr[u].rs) swap(tr[tr[u].rs].ls, tr[tr[u].rs].rs), tr[tr[u].rs].tag ^= 1;
        tr[u].tag = 0;
    }
}

void split(int u, int k, int &x, int &y) {
    if (!u) {
        x = y = 0;
        return;
    }
    pushdown(u);
    int lsiz = tr[tr[u].ls].cnt + 1;
    if (lsiz <= k) x = u, split(tr[u].rs, k - lsiz, tr[u].rs, y);
    else y = u, split(tr[u].ls, k, x, tr[u].ls);
    pushup(u);
}

int merge(int u, int v) {
    if (!u || !v) return u | v;
    if (tr[u].pri < tr[v].pri) {
        pushdown(u);
        tr[u].rs = merge(tr[u].rs, v);
        pushup(u);
        return u;
    }
    else {
        pushdown(v);
        tr[v].ls = merge(u, tr[v].ls);
        pushup(v);
        return v;
    }
}

int newNode(int t) {
    tr[++tot] = {0, 0, 1, t, t, 0, rnd()};
    return tot;
}

void print(int u) {
    if (!u) return;
    else {
        pushdown(u);
        print(tr[u].ls);
        cout << tr[u].val << ' ';
        print(tr[u].rs);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        int t;
        cin >> t;
        rt = merge(rt, newNode(t));
    } 
    while (q--) {
        int op, a, b;
        cin >> op >> a >> b;
        int l, m, r;
        split(rt, a - 1, l, m);
        split(m, b - a + 1, m, r);
        if (op == 1) {
            swap(tr[m].ls, tr[m].rs);
            tr[m].tag ^= 1;
        }
        else cout << tr[m].s << endl;
        rt = merge(merge(l, m), r);
    }
    return 0;
}
```

## Necessary Roads

跑无向图 tarjan 找到桥即可。

```cpp
#include <iostream>

using namespace std;

const int N = 100010, M = 200010;

int head[N], ver[M * 2], ne[M * 2], tot = 1;
int dfn[N], low[N], t;
bool bridge[M * 2];
int cnt;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void tarjan(int x, int from) {
    dfn[x] = low[x] = ++t;
    for (int i = head[x]; i; i = ne[i]) {
        if (i == (from ^ 1)) continue;
        int y = ver[i];
        if (!dfn[y]) {
            tarjan(y, i);
            low[x] = min(low[x], low[y]);
            if (dfn[x] < low[y]) bridge[i] = bridge[i ^ 1] = true, cnt++;
        }
        else low[x] = min(low[x], dfn[y]);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    tarjan(1, 0);
    cout << cnt << endl;
    for (int i = 2; i <= tot; i += 2) {
        if (bridge[i]) cout << ver[i ^ 1] << ' ' << ver[i] << endl;
    }
    return 0;
}
```

## Necessary Cities

跑无向图 tarjan 找到割点即可。

```cpp
#include <iostream>

using namespace std;

const int N = 100010, M = 200010;

int head[N], ver[M * 2], ne[M * 2], tot = 1;
int dfn[N], low[N], t;
bool cut[N];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void tarjan(int x, int from) {
    dfn[x] = low[x] = ++t;
    int f = 0;
    for (int i = head[x]; i; i = ne[i]) {
        if (i == (from ^ 1)) continue;
        int y = ver[i];
        if (!dfn[y]) {
            tarjan(y, i);
            low[x] = min(low[x], low[y]);
            if (x == 1) {
                if (++f == 2) cut[x] = true;
            }
            else if (dfn[x] <= low[y]) cut[x] = true;
        }
        else low[x] = min(low[x], dfn[y]);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    tarjan(1, 0);
    int cnt = 0;
    for (int i = 1; i <= n; ++i) if (cut[i]) cnt++;
    cout << cnt << endl;
    for (int i = 1; i <= n; ++i) if (cut[i]) cout << i << ' ';
    cout << endl;
    return 0;
}
```

