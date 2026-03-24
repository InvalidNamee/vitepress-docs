---
title: 2025春训第五场
---
# 2025春训第五场

又是熟悉的博弈问题，又是熟悉的做不出来，不过剩下三道能做出来的都挺有意思的，相对比较满足。

## A. 游戏

答案= min(max(从小到大交替选，从大到小交替选)，max(A从最大的连续选，A从最小的连续选)).

* **提示**：A 希望答案尽可能大，所以由 A 决策决定的应取 max，B 希望答案尽可能小，所以由 B 决策决定的应该取 min.
    
* **建议**：给 @[xx liu (qwertyuiop)](@liuxx) 佬磕一个
    

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int a[100010];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    sort(a + 1, a + n + 1);
    long long A = 0, B = 0;
    long long res;
    for (int i = n; i > 0; i -= 2) A += a[i];
    for (int i = n - 1; i > 0; i -= 2) B += a[i];
    res = abs(A) - abs(B);
    A = 0, B = 0;
    for (int i = 1; i <= n; i += 2) A += a[i];
    for (int i = 2; i <= n; i += 2) B += a[i];
    res = max(res, abs(A) - abs(B));
    A = 0, B = 0;
    for (int i = 1; i <= n; ++i) {
        if (i <= (n + 1) / 2) A += a[i];
        else B += a[i];
    }
    long long t1 = abs(A) - abs(B);
    A = 0, B = 0;
    reverse(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) {
        if (i <= (n + 1) / 2) A += a[i];
        else B += a[i];
    }
    res = min(max(t1, abs(A) - abs(B)), res);
    printf("%lld\n", res);
    return 0;
}
```

## B. 音符

单调队列优化的 dp 效率最高， 或者线段树也行，两版代码都贴一下。

$$
res = \max_{i = 1}^{n} \max_{j < i\ \land\ a_i - a_j <= k}\{i - j + 1 + \max_{k < j\ \land \ a_{j - 1} - a_k <= k}\{j - k\}\}
$$

一个双指针维护内层 max，一个单调队列维护 $\max_{j < i\ \land\ a_i - a_j <= k}\{- j + 1 + \max_{k < j\ \land \ a_j - a_k <= k}\{j - k + 1\}\}$，就可以实现 O(n).

**单调队列代码**

```cpp
#include <iostream>
#include <algorithm>
#include <map>

using namespace std;

const int N = 500010;
int a[N], q[N];
long long f[N];

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    long long res = 0;
    int pre_max = 0;
    sort(a + 1, a + n + 1);
    int hh = 0, tt = -1, t = 0;
    for (int i = 1, j = 1; i <= n; ++i) {
        while (hh <= tt && a[i] - a[q[hh]] > k) hh++;
        while (j <= i && a[i] - a[j] > k) j++;
        if (hh <= tt) res = max(res, i + f[q[hh]]);
        f[i] = -i + 1 + pre_max;
        pre_max = max(pre_max, i - j + 1);
        while (hh <= tt && f[i] >= f[q[tt]]) tt--;
        q[++tt] = i;
    }
    printf("%lld\n", res);
    return 0;
}
```

**线段树<s>暴戾</s>代码**（离散化疑似反向优化了）

```cpp
#include <iostream>
#include <cstring>
#include <map>

using namespace std;

const int N = 500010;
map<int, int> mp;
int a[N], b[N];
long long tr[N * 4], f[N][2], s[N];

void pushup(int u) {
    tr[u] = max(tr[u << 1], tr[u << 1 | 1]);
}

void init(int u, int l, int r) {
    if (l == r) tr[u] = l == 0 ? 0 : -__LONG_LONG_MAX__;
    else {
        int mid = l + r >> 1;
        init(u << 1, l, mid), init(u << 1 | 1, mid + 1, r);
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

long long query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        long long res = -__LONG_LONG_MAX__;
        int mid = l + r >> 1;
        if (ql <= mid) res = max(res, query(u << 1, l, mid, ql ,qr));
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    init(1, 0, n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        mp[a[i]];
    }
    int m = 0;
    for (auto &i : mp) {
        i.second = ++m;
        b[m] = i.first;
    }
    for (int i = 1; i <= n; ++i) {
        s[mp[a[i]]]++;
    }
    for (int i = 1; i <= m; ++i) s[i] += s[i - 1];
    long long res = 0;
    for (int i = 1; i <= m; ++i) {
        int l = 0, r = i - 1;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (b[mid] < b[i] - k) l = mid;
            else r = mid - 1;
        }
        f[i][0] = max(f[i - 1][0], s[i] - s[l]);
        f[i][1] = s[i] + query(1, 0, n, l, i - 1);
        modify(1, 0, n, i, -s[i] + f[i][0]);
    }
    for (int i = 1; i <= m; ++i) {
        res = max(res, f[i][1]);
    }
    printf("%lld\n", res);
    return 0;
}
```

非常反直觉，其实我敲线段树比上面的单调队列快，单调队列比较考验思维，不像我们线段树和二分查找，直接背板子就行了。

## C. 星星点灯

过滤掉所有边权大于 m 的边，然后跑最小生成树，同时统计边权和，最后加上 连通块个数 \* m 就是答案。相对比较 easy.

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;
struct edge {
    int x, y, z;
} ed[N * N];
int fa[N];

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

int main() {
    int val, n, m = 0;
    scanf("%d%d", &val, &n);
    for (int i = 1; i <= n; ++i) fa[i] = i;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            int t;
            scanf("%d", &t);
            if (i < j) ed[++m] = {i, j, t};
        }
    }
    sort(ed + 1, ed + m + 1, [](edge a, edge b) {
        return a.z < b.z;
    });
    long long res = 0;
    for (int i = 1; i <= m; ++i) {
        if (ed[i].z > val) break;
        int x = ed[i].x, y = ed[i].y;
        x = getfa(x), y = getfa(y);
        if (x == y) continue;
        else {
            fa[y] = x;
            res += ed[i].z;
        }
    }
    for (int i = 1; i <= n; ++i) if (i == fa[i]) res += val;
    printf("%lld\n", res);
    return 0;
}
```

## D. **翘课**

类似于分组背包问题，先把每一天单独的旷 \[0, k\] 节课的后呆在教学楼的时间算出来，然后跑分组背包dp即可。（理论上可以在维护每天单独的时间的同时做分组背包dp，但是我不知道为什么一直写挂）

* ps：说的很简单，但是内部逻辑其实有点绕。
    

```cpp
#include <iostream>
#include <cstring>
#include <vector>

using namespace std;

vector<int> a[510];
int f[510][510];
int g[510][510];

int main() {
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            int t;
            scanf("%d", &t);
            if (t) a[i].push_back(j);
        }
    }
    memset(f, 0x3f, sizeof(f));
    memset(g, 0x3f, sizeof(g));
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < a[i].size(); ++j) { // 旷课 j 节
            int t = a[i].size() - j; // 上课 t 节
            for (int k = t - 1; k < a[i].size(); ++k) {
                f[i][j] = min(f[i][j], a[i][k] - a[i][k - t + 1] + 1);
            }
        }
        f[i][a[i].size()] = 0;
    }
    g[0][0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j <= k; ++j) {
            for (int l = 0; l <= j; ++l) {
                g[i][j] = min(g[i][j], g[i - 1][l] + f[i][j - l]);
            }
        }
    }
    int res = 0x3f3f3f3f;
    for (int i = 0; i <= k; ++i) {
        res = min(res, g[n][i]);
    }
    printf("%d\n", res);
    return 0;
}
```