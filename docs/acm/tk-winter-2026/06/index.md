---
title: 2026寒假个人训练赛第六场
---
# 2026寒假个人训练赛第六场

前面感觉像是一套 OI 的模拟题，后面两道没找到来源。又因为看错数据范围开小数组导致 RE 多次。

## A. 奇数(odd)

先算出来全局的奇偶性，然后每次修改看一下区间和的奇偶性和 k * 区间长度 的奇偶性是否相同。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 200010;
LL a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        a[i] += a[i - 1];
    }
    bool f = a[n] & 1;
    while (q--) {
        int l, r;
        LL k;
        cin >> l >> r >> k;
        bool f1 = k * (r - l + 1) & 1, f2 = (a[r] - a[l - 1]) & 1;
        if (f ^ (f1 != f2)) cout << "YES" << endl;
        else cout << "NO" << endl;
    }
    return 0;
}
```

## B. 覆盖层数(cover)

离散化差分前缀和即可。

```cpp
#include <iostream>
#include <map>
using namespace std;
typedef long long LL;
const int N = 200010;
map<LL, LL> a;
int t[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        int l, r;
        cin >> l >> r;
        a[l]++, a[r + 1]--;
    }
    LL pre = a.begin()->first;
    LL s = 0;
    for (auto &[k, v] : a) {
        t[s] += k - pre;
        s += v;
        pre = k;
    }
    for (int i = 1; i <= n; ++i) cout << t[i] << ' ';
    cout << endl;
    return 0;
}
```

## C. 卡牌(card)

我刚开始把他想的特别复杂，实际上并没有。保证了 $a_i \le d_i$ 所以无视 a 和 d 的绑定关系，自己也不可能杀掉自己；另外也不可能出现环。所以尽可能贪心打，直接 a 和 d 分开排序双指针扫描，每成功配对一次答案 `-1` 即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 1000010;
LL a[N], b[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, res = 0;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i] >> b[i];
    sort(a + 1, a + n + 1);
    sort(b + 1, b + n + 1);
    res = n;
    for (int i = 1, j = 1; i <= n && j <= n; ++i) {
        while (j <= n && a[j] <= b[i]) j++;
        if (j <= n) res--, j++;
    }
    cout << res << endl;
    return 0;
}
```

## D. 链(chain)<sup style="color: red">(补题)</sup>

这题感觉我本来可能还能做出来，都是 E 题的那个树套树的点子害的……

可以逆向思维，从只有一个点开始加点，对于一个已经有了 $i$ 个连通块的状态，考虑加一个点

- 连上任意两个相邻的块，对 $i - 1$ 贡献了 $i - 1$；
- 在任意一个块左侧或者右侧添加，对 $i$ 贡献 $2i$；
- 在任意一个空隙加一个点，对 $i + 1$ 贡献 $i + 1$。

然后写成矩阵用矩阵快速幂就可以过了。这道题数据量有点大，先把查询离线了在快速幂的循环里一块乘才能过，时间复杂度是 $O\left(\left(m^2q + m^3\right)\cdot\log{n}\right)$。

```cpp
#include <iostream>
#include <cstring>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 510, M = 110;
const int MOD = 1000000007;
int m;
LL a[M][M], b[M][M], v[N][M], v2[M];

void mul1(LL v1[]) {
    memset(v2, 0, sizeof(v2));
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < m; ++j) {
            v2[i] = (v2[i] + a[j][i] * v1[j]) % MOD;
        }
    }
    memcpy(v1, v2, sizeof(v2));
}

void mul2() {
    memset(b, 0, sizeof(b));
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < m; ++j) {
            for (int k = 0; k < m; ++k) {
                b[i][j] = (b[i][j] + a[i][k] * a[k][j]) % MOD;
            }
        }
    }
    memcpy(a, b, sizeof(a));
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int q;
    cin >> m >> q;
    for (int i = 1; i <= m; ++i) {
        if (i >= 2) a[i - 1][i - 2] += i - 1;
        a[i - 1][i - 1] += i * 2;
        if (i < m) a[i - 1][i] += i + 1;
    }
    vector<int> qs(q);
    for (int i = 0; i < q; ++i) {
        cin >> qs[i];
        qs[i]--;
        v[i][0] = 1;
    }
    bool f = true;
    while (f) {
        f = false;
        for (int i = 0; i < q; ++i) {
            if (qs[i] & 1) mul1(v[i]);
            qs[i] >>= 1;
            if (qs[i]) f = true;
        }
        mul2();
    }
    for (int i = 0; i < q; ++i) cout << v[i][0] << endl;
    return 0;
}
```


## E. 完美的答卷(perfect)<sup style="color: red">(补题)</sup>

我想到了一个特别麻烦的树形 DP + 可持久化 Trie 的做法，然而没写完。这个做法是单 log 时间复杂度，跑的很快。

### 树形 DP + 可持久化 Trie

看到这种区间最大和最小，我直接本能的想到**单调栈**，单调栈能快速得到某个数为最大值的最大区间。然后问题就转化成了已知一个区间和最大值的位置，找到一个包含最大值的子区间，使得最小值和最大值的异或和最大。异或和最大，是经典的 Trie 能解决的问题。现在问题转化成了如何快速得到这个区间的所有可能的最小值构成的 Trie，因为必须包含这个最大值，所以整个问题可以分成两个子问题，右边的**前缀 min** 和左边的 **后缀min**。以前缀 min 为例，后缀 min 直接把数组 reverse 一下再来一遍就好了。我们想要得到的是每一个子区间可能的前缀 min，也是从左到右做单调递增单调栈的栈底元素，**单调栈弹栈的过程其实就是新的最小值覆盖旧的最小值的过程**，每个元素可能且仅可能被一个后面的元素弹出，最终这种覆盖的过程构成一棵内向树，反转所有的边，令树的结点为字典树，**从根到叶子进行树形 DP**（从右往左）可以得到任何一个中间点走到末尾路径上的所有前缀 min。最后只需要在维护一个树上倍增，然后**利用可持久化 Trie 进行差分**，就可以得到目标 Trie 了。

```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 300010;
int trie[N * 21][2];
int a[N], rt[N], tot;
int st[N], tp;
int ver[N], head[N], ne[N], f[N][20], idx;
int n;

void insert(int x, int cur, int pre) {
    for (int i = 19; i >= 0; --i) {
        bool t = x >> i & 1;
        trie[cur][t] = ++tot;
        trie[cur][t ^ 1] = trie[pre][t ^ 1];
        cur = trie[cur][t], pre = trie[pre][t];
    }
}

int query(int x, int l, int r) {
    int res = 0;
    for (int i = 19; i >= 0; --i) {
        bool t = x >> i & 1;
        if (trie[r][t ^ 1] && trie[r][t ^ 1] != trie[l][t ^ 1]) {
            res += 1 << i;
            l = trie[l][t ^ 1], r = trie[r][t ^ 1];
        }
        else {
            l = trie[l][t], r = trie[r][t];
        }
    }
    return res;
}

void add(int x, int y) {
    ver[++idx] = y;
    ne[idx] = head[x];
    head[x] = idx;
}

void dfs(int x) {
    for (int i = 1; i < 20; ++i) {
        f[x][i] = f[f[x][i - 1]][i - 1];
    }
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == f[x][0]) continue;
        f[y][0] = x;
        rt[y] = ++tot;
        insert(a[y], rt[y], rt[x]);
        dfs(y);
    }
}

int qrange(int x, int l, int r) {
    // cout << x << ' ' << l << ' ' << r << endl;
    int p = l;
    for (int i = 19; i >= 0; --i) {
        if (f[p][i] <= r) p = f[p][i];
    }
    p = f[p][0];
    // cout << "QWQ" << l << ' ' << p << ' ' << query(x, rt[p], rt[l]) << endl;
    return query(x, rt[p], rt[l]);
}

int work() {
    idx = tot = 0;
    memset(trie, 0, sizeof(trie));
    memset(head, 0, sizeof(head));
    int res = 0;
    // 单调递增
    tp = 0;
    int tst = 0;
    for (int i = 1; i <= n; ++i) {
        while (tp && a[i] <= a[st[tp]]) {
            add(i, st[tp--]);
        }
        st[++tp] = i;
    }
    while (tp) {
        add(n + 1, st[tp]);
        tp--;
    }
    f[n + 1][0] = n + 1;
    dfs(n + 1);
    // 单调递减
    tp = 0;
    for (int i = 1; i <= n; ++i) {
        while (tp && a[i] > a[st[tp]]) {
            res = max(res, qrange(a[st[tp]], st[tp], i - 1));
            tp--;
        }
        st[++tp] = i;
    }
    while (tp) {
        res = max(res, qrange(a[st[tp]], st[tp], n));
        tp--;
    }
    return res;
}

int main() {
    // freopen("input", "r", stdin);
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int res = work();
    reverse(a + 1, a + n + 1);
    res = max(res, work());
    cout << res << endl;
    return 0;
}
```

### 分治

[MoScenix](https://moscenix.cn) 的双 log 做法非常简洁干净。

## F. City Game

用 bitset 暴力。

```cpp
#pragma GCC optimize("Ofast")
#include <iostream>
#include <bitset>

using namespace std;

const int N = 1000;
bitset<N> a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    char c;
    cin >> n >> m;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            cin >> c;
            a[i][j] = c == 'F';
        }
    }
    int res = 0;
    for (int i = 0; i < n; ++i) {
        bitset<N> t = a[i];
        int cnt = 0;
        for (int j = 0; j < m; ++j) {
            if (t[j] == 1) cnt++;
            else cnt = 0;
            res = max(res, cnt);
        }
        for (int k = i - 1; k >= 0; --k) {
            t &= a[k];
            cnt = 0;
            for (int j = 0; j < m; ++j) {
                if (t[j] == 1) cnt++;
                else cnt = 0;
                res = max(res, cnt * (i - k + 1));
            }
        }
    }
    cout << res * 3 << endl;
    return 0;
}
```

## G. Colorful Lines

从后往前算，给已经染过色的行和列打上标记，每次更新答案的时候减掉重复的即可。

```cpp
#include <iostream>
#include <tuple>
#include <vector>
#include <set>

using namespace std;

typedef long long LL;
const int N = 300010;
vector<tuple<int, int, int>> qs;
set<int> row, col;
LL res[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int h, w, q, m;
    cin >> h >> w >> m >> q;
    qs.resize(q);
    for (int i = 0; i < q; ++i) {
        auto &[a, b, c] = qs[i];
        cin >> a >> b >> c;
    }
    for (int i = q - 1; i >= 0; --i) {
        auto &[op, n, c] = qs[i];
        if (op == 1) { // row
            if (row.count(n)) continue;
            res[c] += w - col.size();
            row.insert(n);
        }
        else { // col
            if (col.count(n)) continue;
            res[c] += h - row.size();
            col.insert(n);
        }
    }
    for (int i = 1; i <= m; ++i) cout << res[i] << ' ';
    cout << endl;
    return 0;
}
```