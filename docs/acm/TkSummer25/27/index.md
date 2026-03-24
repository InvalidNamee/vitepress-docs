---
title: 2025夏季个人训练赛第二十七场
---
# 2025夏季个人训练赛第二十七场

今天没有牛客可以 vp 了，🐸说打一场个人训练吧，于是就有了这篇博客。

## A. 折半枚举：四数之和为零 <sup style="color: red">补</sup>

当时被卡常卡空间，各种卡，卡绝望了……赛时 TLE 和 MLE 共计 12 发，补题的时候还有两发。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 4010;
int v1[N * N], v2[N * N];
int a[4][N];
int len;

inline int read() {
    int x = 0, op = 1;
    char c = getchar();
    while (!isdigit(c)) {
        if (c == '-') op = -1;
        c = getchar();
    }
    while (isdigit(c)) x = x * 10 + c - 48, c = getchar();
    return x * op;
}

int main() {
    int n = read();
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 4; ++j) {
            a[j][i] = read();
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            v1[len] = a[0][i] + a[1][j];
            v2[len] = -a[2][i] - a[3][j];
            len++;
        }
    }
    sort(v1, v1 + len);
    sort(v2, v2 + len);
    long long res = 0;
    for (int i = 0, j = 0, ri, rj; i < len && j < len; ) { // 不用双指针就会喜提 TLE
        if (v1[i] == v2[j]) {
            ri = i + 1, rj = j + 1;
            while (ri < len && v1[ri] == v1[i]) ri++;
            while (rj < len && v2[rj] == v2[j]) rj++;
            res += (long long)(ri - i) * (rj - j);
            i = ri, j = rj;
        }
        else if (v1[i] < v2[j]) {
            int ri = i + 1;
            while (ri < len && v1[ri] == v1[i]) ri++;
            i = ri;
        }
        else {
            int rj = j + 1;
            while (rj < len && v2[rj] == v2[j]) rj++;
            j = rj;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## B. 会议

朴实无华的换根 dp

```cpp
#include <iostream>
#include <vector>
using namespace std;
const int N = 50010;
vector<int> ed[N];
long long f[N];
int cnt[N];
long long res;
int idx, n;

void dp(int x, int fa) {
    cnt[x] = 1;
    for (int y : ed[x]) {
        if (y == fa) continue;
        dp(y, x);
        f[x] += f[y] + cnt[y];
        cnt[x] += cnt[y];
    }
}

void chrt(int x, int fa) {
    for (int y : ed[x]) {
        if (y == fa) continue;
        long long bk = f[y];
        f[y] += (f[x] - f[y] - cnt[y]) + (n - cnt[y]);
        if (f[y] == res && y < idx || f[y] < res) {
            idx = y;
            res = f[y];
        }
        chrt(y, x);
        f[y] = bk;
    }
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i < n; ++i) {
        int a, b;
        scanf("%d%d", &a, &b);
        ed[a].emplace_back(b);
        ed[b].emplace_back(a);
    }
    dp(1, 0);
    idx = 1, res = f[1];
    chrt(1, 0);
    printf("%d %lld\n", idx, res);
    return 0;
}
```

## C. 变音量

也是一道朴实无华的 dp 题，记录第 i 次能不能到 j，然后二维 dp 就可以。

```cpp
#include <iostream>

using namespace std;
bool f[70][1010];

int main() {
    int n, s, m;
    scanf("%d%d%d", &n, &s, &m);
    f[0][s] = true;
    n--;
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        for (int j = 0; j <= m; ++j) {
            if (j >= t) f[i][j] |= f[i - 1][j - t];
            if (j + t <= m) f[i][j] |= f[i - 1][j + t];
        }
    }
    for (int j = m; j; --j) {
        if (f[n][j]) {
            printf("%d\n", j);
            return 0;
        }
    }
    printf("-1\n");
    return 0;
}
```

## D. 三角棋盘上的N皇后

直接爆搜就可以解决，我的爆搜 171 ms.

```cpp
#include <iostream>

using namespace std;
const int N = 14;
int msk[N];
int mx, cur, t;
int n;

void dfs(int x, int msk1, int msk2) {
    if (x == 0) {
        if (cur > mx) {
            mx = cur;
            t = 1;
        }
        else if (cur == mx) t++;
        return;
    }
    int mask = msk1 | msk2;
    if (msk[x]) {
        if (msk[x] & mask) return;
        else dfs(x - 1, (msk1 | msk[x]) >> 1, (msk2 | msk[x]) & ((1 << x - 1) - 1));
    }
    else {
        for (int i = 0; i < x; ++i) {
            if (mask >> i & 1) continue;
            else {
                cur++;
                dfs(x - 1, (msk1 | (1 << i)) >> 1, (msk2 | (1 << i)) & ((1 << x - 1) - 1));
                cur--;
            }
        }
        dfs(x - 1, msk1 >> 1, msk2 & ((1 << x - 1) - 1));
    }
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        char s[N + 1];
        scanf("%s", s);
        for (int j = 0; s[j]; ++j) {
            msk[i] = (msk[i] << 1) | (s[j] == '*');
        }
    }
    dfs(n, 0, 0);
    printf("%d\n%d\n", mx, t);
    return 0;
}
```

## E. 教主的游乐场

最优的路径一定只往左走一次或者一直往右，从右往左更新一遍状态先处理直接往右的，再从左往右更新一遍先往左再往右的，可以用线段树维护，背板子的题写着就是😋。

我当时查询的循环写的 n 然后 OLE 了一次。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100000;
int tr[N * 4];
int a[N];
 
void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] = min(tr[u], v);
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        tr[u] = min(tr[u << 1], tr[u << 1 | 1]);
    }
}

int query(int u, int l, int r, int ql, int qr) {
    if (ql > qr) return 0x3f3f3f3f;
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        int res = 0x3f3f3f3f;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = min(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    memset(tr, 0x3f, sizeof(tr));
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        if (i + a[i] > n) modify(1, 1, n, i, 1);
    }
    for (int i = n; i; --i) {
        modify(1, 1, n, i, min(query(1, 1, n, 1, i - 1), query(1, 1, n, i + 1, min(n, i + a[i]))) + 1);
    }
    for (int i = 1; i <= n; ++i) {
        modify(1, 1, n, i, min(query(1, 1, n, 1, i - 1), query(1, 1, n, i + 1, min(n, i + a[i]))) + 1);
    }
    for (int i = 1; i <= m; ++i) {
        int q;
        scanf("%d", &q);
        printf("%d ", query(1, 1, n, q, q));
    }
    printf("\n");
    return 0;
}
```

## F. 任务 (task)

用类似 dp 的思路贪心，按照 l 排序，维护一下目前所有线程的右端点，每次都找离第 i 个区间的左端点最近的右端点用，如果找不到就只能放弃一个，这个时候**检查一下他的右端点是否比最大的小**，如果是就把右端点最大的放弃掉把他加进去，否则直接把这个放弃掉。

```cpp
#include <iostream>
#include <algorithm>
#include <set>

using namespace std;
const int N = 1000010;
pair<int, int> a[N];
multiset<int> s;

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i].first, &a[i].second);
    }
    int res = 0;
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) {
        auto p = s.upper_bound(a[i].first);
        if (p == s.begin()) {
            if (s.size() < k) s.insert(a[i].second), res++;
            else if (*s.rbegin() > a[i].second) s.erase(--s.end()), s.insert(a[i].second);
        }
        else {
            s.erase(--p), s.insert(a[i].second);
            res++;
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## G. 祈求者 (invoker)

把状态用三进制压缩，然后直接一遍状压 dp 就解决了，最困难的地方在于三进制状态有 27 个，需要要注意打表的时候会不会抄错。

```cpp
#include <iostream>
#include <map>
#include <vector>
#include <cstring>
using namespace std;

const int N = 100010;

map<char, vector<int>> mp = {
    {'Y', {0}},                         // QQQ
    {'V', {1, 3, 9}},                   // QQW
    {'G', {2, 6, 18}},                  // QQE
    {'C', {13}},                        // WWW
    {'X', {4, 10, 12}},                 // QWW
    {'Z', {14, 16, 22}},                // WWE
    {'T', {26}},                        // EEE
    {'F', {8, 20, 24}},                 // QEE
    {'D', {17, 23, 25}},                // WEE
    {'B', {5, 7, 11, 15, 19, 21}}       // QWE
};

int f[N][27];

int dis(int x, int y) {
    vector<int> s1 = {x / 9, x / 3 % 3, x % 3}, s2 = {y / 9, y / 3 % 3, y % 3};
    if (s1 == s2) return 1;
    else if (s1[1] == s2[0] && s1[2] == s2[1]) return 2;
    else if (s1[2] == s2[0]) return 3;
    else return 4;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length();
    memset(f, 0x3f, sizeof(f));
    for (int i = 1; i <= n; ++i) {
        auto v = mp[s[i - 1]];
        if (i == 1) {
            for (int j : v) f[i][j] = 4;
        }
        else {
            for (int j : v) {
                for (int k = 0; k < 27; ++k) {
                    f[i][j] = min(f[i][j], f[i - 1][k] + dis(k, j));
                }
            }
        }
    }
    int res = 0x3f3f3f3f;
    for (int i = 0; i < 27; ++i) {
        res = min(res, f[n][i]);
    }
    printf("%d\n", res);
    return 0;
}
```

## I. 排列计数

画一下样例很容易观察出来，这就是个二叉堆，对于每一个子树都保证根节点比子树的最小值小即可。于是就可以树形 dp 了。

刚在数位 dp 那里爆了一次 int，然后又在这儿爆 int 了……

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long LL;
const int N = 1000010;

LL power(LL n, LL p, LL mod) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % mod;
        base = base * base % mod;
        p >>= 1;
    }
    return res;
}

LL jc[N], f[N];
vector<int> ed[N];
int n, p;
int cnt[N];

LL c(int n, int m) {
    return jc[n] * power(jc[n - m], p - 2, p) % p * power(jc[m], p - 2, p) % p;
}

void dp(int x) {
    f[x] = 1;
    cnt[x] = 1;
    bool first = true;
    for (int y : ed[x]) {
        dp(y);
        cnt[x] += cnt[y];
        f[x] = (f[x] * f[y]) % p;
    }
    if (cnt[x] != 1) f[x] = (f[x] * c(cnt[x] - 1, cnt[ed[x][0]])) % p;
}

int main() {
    scanf("%d%d", &n, &p);
    jc[0] = 1;
    for (int i = 1; i <= n; ++i) {
        jc[i] = jc[i - 1] * i % p;   
        if (i != 1) ed[i / 2].emplace_back(i);
    }
    dp(1);
    printf("%lld\n", f[1]);
    return 0;
}
```

## K. 【数位DP】数字计数

这个数位dp很恶心，需要一边统计方案数一边统计数字的出现次数，还需要排除前导零的情况，正好我数位dp不好，被硬控了一上午。好不容易 dp 调对了，又爆 int 了……

$f_{i, j, k}$ 表示从最高位开始数填到前 i 位时所有情况指定数字的个数，$j \in \{0, 1\}$ 表示是否顶到上界，$k \in {0, 1}$ 表示当前位置是不是前导零，$g_{i, j, k}$ 表示满足 j 和 k 约束的数的个数。

状态转移枚举当前位置填的数，0 的时候涉及到前导零的问题要单独算，其他的数一起算。

来欣赏一下一我横向滚动两屏半的超长状态转移方程🤮

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;
const int N = 14;
long long a[N], len;
long long f[N][2][2], g[N][2][2]; // 顶上界 前导零

long long count(long long x, int k) {
    memset(g, 0, sizeof(g));
    if (x == -1) return 0;
    if (x == 0) return k == 0;
    len = 0;
    while (x) {
        a[++len] = x % 10;
        x /= 10;
    }
    reverse(a + 1, a + len + 1);
    g[0][1][1] = 1;
    for (int i = 1; i <= len; ++i) {
        g[i][0][0] = (g[i - 1][1][0] * (a[i] != 0) + g[i - 1][0][0]) + (g[i - 1][1][0] + g[i - 1][1][1]) * max(0LL, a[i] - 1) + (g[i - 1][0][0] + g[i - 1][0][1]) * 9;
        g[i][0][1] = g[i - 1][1][1] + g[i - 1][0][1];
        g[i][1][0] = 1;
        f[i][0][0] = (f[i - 1][1][0] * (a[i] != 0) + f[i - 1][0][0]) + g[i - 1][1][0] * (a[i] != 0 && k == 0) + g[i - 1][0][0] * (k == 0) + (f[i - 1][1][1] + f[i - 1][1][0]) * max(0LL, a[i] - 1) + (f[i - 1][0][0] + f[i - 1][0][1]) * 9 + (g[i - 1][1][0] + g[i - 1][1][1]) * (k != 0 && k < a[i]) + (g[i - 1][0][0] + g[i - 1][0][1]) * (k != 0);
        f[i][1][0] = f[i - 1][1][0] + (a[i] == k);
    }
    return f[len][0][0] + f[len][1][0] + (k == 0);
}

int main() {
    long long a, b;
    cin >> a >> b;
    for (int i = 0; i < 10; ++i) {
        cout << count(b, i) - count(a - 1, i) << ' ';
    }
    cout << endl;
    return 0;
}
```