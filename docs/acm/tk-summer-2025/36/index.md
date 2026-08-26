---
title: 2025夏季个人训练赛第三十六场
---
# 2025夏季个人训练赛第三十六场

中午没睡醒，一睁眼发现三点多了，于是在宿舍先把剩下一道题写了，又写了写题解，拷到 U 盘里面了，然后回机房之后发现 U 盘落宿舍了……

## A. 婚礼上的小杉

```cpp
#include <iostream>
#include <algorithm>
#include <sstream>
using namespace std;

const int N = 1010;
pair<int, string> a[N];

int main() {
    string s;
    getline(cin, s);
    stringstream ss(s);
    int i, n = 0;
    while (ss >> i) a[++n].first = i;
    getline(cin, s);
    ss = stringstream(s);
    n = 0;
    while (ss >> s) a[++n].second = s;
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) cout << a[i].second << endl;
    return 0;
}
```

## B. 最佳课题选择

分组背包。

```cpp
#include <iostream>
#include <climits>

using namespace std;
typedef long long LL;
const int N = 10010;
LL f[N];

LL power(LL n, LL p) {
    LL res = 1;
    for (int i = 0; i < p; ++i) res *= n;
    return res;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    fill(f + 1, f + n + 1, LLONG_MAX / 2);
    for (int i = 1; i <= m; ++i) {
        LL a, b;
        scanf("%lld%lld", &a, &b);
        for (int j = n; j; --j) {
            for (int x = 1; x <= j; ++x) {
                LL t = a * power(x, b);
                f[j] = min(f[j], f[j - x] + t);
            } 
        }
    }
    printf("%lld\n", f[n]);
    return 0;
}
```

## C. 武器配备

最有的方案一定是机枪和盔甲分别排序，然后各抽出一个长度为 n 的子序列，问题转化成了维护这个子序列的最小不满意度。

f<sub>i, j, k</sub> 表示前 j 个机枪和前 k 个盔甲选了 i 对的最小不满意度，类似最长公共子序列的思路

$$
f_{i, j, k} = \min \{f_{i, j - 1, k} f_{i, j, k - 1}, f_{i - 1, j - 1, k - 1} + (m_j - n_k)^2\}
$$

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 90;
LL f[N][N][N]; // 前 j 个 a 和前 k 个 b 配了 i 对的最小值
LL c[N], d[N];

int main() {
    memset(f, 0x3f, sizeof(f));
    memset(f[0], 0, sizeof(f[0]));
    int n, a, b;
    scanf("%d%d%d", &n, &a, &b);
    for (int i = 1; i <= a; ++i) {
        scanf("%lld", &c[i]);
    }
    for (int i = 1; i <= b; ++i) {
        scanf("%lld", &d[i]);
    }
    sort(c + 1, c + a + 1);
    sort(d + 1, d + b + 1);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= a; ++j) {
            for (int k = 1; k <= b; ++k) {
                f[i][j][k] = min(min(f[i][j - 1][k], f[i][j][k - 1]), f[i - 1][j - 1][k - 1] + (c[j] - d[k]) * (c[j] - d[k]));
            }
        }
    }
    printf("%lld\n", f[n][a][b]);
    return 0;
}
```

## D. 圣诞岛的走廊

典型的 bfs 问题，直接 bfs，第一次搜到终点的距离就是答案，代码其实还有很多可以优化的地方，比如好像不可能往上回，但是无伤大雅了，能过就行。


```cpp
#include <iostream>
#include <queue>
#include <tuple>

using namespace std;

const int N = 100010;
int a[N][2];
bool v[N][2];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i][0], &a[i][1]);
    }
    queue<tuple<int, int, int>> q;
    v[1][0] = true;
    q.push({1, 0, 0});
    while (!q.empty()) {
        auto [x, y, d] = q.front();
        q.pop();
        if (x == n) {
            printf("%d\n", d);
            return 0;
        }
        if (!v[x][y ^ 1] && !a[x][y ^ 1]) v[x][y ^ 1] = true, q.push({x, y ^ 1, d + 1});
        if (x > 1 && !v[x - 1][y] && !a[x - 1][y]) v[x - 1][y] = true, q.push({x - 1, y, d + 1});
        if (!v[x + 1][y] && !a[x + 1][y]) v[x + 1][y] = true, q.push({x + 1, y, d + 1});
    }
    printf("Poor\n");
    return 0;
}
```

## E. 心情很方 (square)

看似考数学，实则考 int128，根据初中知识，AD' 长度是 $\frac{a^2}{b}$，a 和 b 比较大需要妥善处理，防止溢出。


```cpp
#include <iostream>

using namespace std;

typedef long long LL;

__int128_t gcd(__int128_t a, __int128_t b) {
    return b ? gcd(b, a % b) : a;
}

void print(__int128_t a) {
    if (a) {
        print(a / 10);
        putchar(a % 10 + 48);
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        __int128_t a, b;
        LL c, d;
        scanf("%lld%lld", &c, &d);
        a = c, b = d;
        a *= a;
        __int128_t g = gcd(a, b);
        __int128_t res = a / g + b / g;
        if (!res) putchar('0');
        else print(res);
        putchar('\n');
    }
    return 0;
}
```

## H. 皇帝的烦恼

答案一定不小于 $\max{a_i + a_{i + 1}}$.

- 如果 n 是偶数这个下界就是答案，因为正好奇数偶数的颜色可以错开；
- 如果 n 是奇数就错不开了，考虑二分答案，维护从 1 开始填到第 i 个时和 1 的最小冲突和最大冲突，如果最后一个的最小冲突不是 0 就不合法。
  $$
  \begin{align}
  mx_i &= \min \{a_i, a_1 - mn_{i - 1}\}\\
  mn_i &= \max \{0, a_i - \left(\left(mid - a_{i - 1}\right) - \left(a_i - mx_i\right)\right)\}
  \end{align}
  $$

```cpp
#include <iostream>
 
using namespace std;
 
const int N = 20010;
 
int a[N], n;
 
bool check(int mid) {
    int mxt = a[1], mnt = a[1];
    for (int i = 2; i <= n; ++i) {
        int t1, t2;
        t1 = min(a[1] - mnt, a[i]);
        t2 = max(0, a[i] - (mid - a[i - 1] - a[1] + mxt));
        mxt = t1, mnt = t2;
    }
    return mnt > 0 ? false : true;
}
 
int main() {
    int l = 0, r = 300000;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        if (i > 1) l = max(l, a[i] + a[i - 1]);
    }
    l = max(l, a[1] + a[n]);
    if (n == 1) {
        printf("%d\n", a[1]);
        return 0;
    }
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    printf("%d\n", l);
    return 0;
}
```

## I. GameZ游戏排名系统

平衡树板子题，被我用线段树打过去了，也可以用 STL 里面的平衡树 `__gnu_pbds` 写。

关了流同步之后千万不要肌肉记忆的 printf😭，害我吃了一发罚时。

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;

struct Query
{
    int t, op, val;
    string s;

    Query(const int &t, const int &op, const int &val, const string &s) : t(t), op(op), val(val), s(s) {}
};
vector<Query> qs;
map<string, int> score; // ren -> fen
vector<string> person; // fen -> ren
vector<pair<int, int>> values;
vector<int> tr;

void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] += v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
}

int query_sum(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = query_sum(u << 1, l, mid, ql, qr);
        if (qr > mid) res += query_sum(u << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }
}

int query_k(int u, int l, int r, int k) {
    if (l == r) return l;
    else {
        int mid = l + r >> 1;
        if (k <= tr[u << 1]) return query_k(u << 1, l, mid, k);
        else return query_k(u << 1 | 1, mid + 1, r, k - tr[u << 1]);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T, val;
    string s;
    cin >> T;
    qs.reserve(T);
    for (int t = 0; t < T; ++t) {
        cin >> s;
        if (s[0] == '+') cin >> val, qs.emplace_back(t, 1, -val, s.substr(1)), values.emplace_back(-val, t);
        else if (isdigit(s[1])) qs.emplace_back(t, 2, stoi(s.substr(1)), "");
        else qs.emplace_back(t, 3, -1, s.substr(1));
    }
    sort(values.begin(), values.end());
    for (auto &[t, a, b, c] : qs) {
        if (a == 1) b = lower_bound(values.begin(), values.end(), pair<int, int>(b, t)) - values.begin() + 1;
    }
    int n = values.size();
    tr = vector<int>(n * 4 + 1, 0);
    person = vector<string>(n + 1);
    for (auto &[_, op, val, s] : qs) {
        if (op == 1) {
            if (score.find(s) != score.end()) modify(1, 1, n, score[s], -1);
            modify(1, 1, n, val, 1);
            score[s] = val;
            person[val] = s;
        }
        else if (op == 3) {
            cout << query_sum(1, 1, n, 1, score[s]) << endl;
        }
        else {
            int l = val, r = min(val + 9, tr[1]);
            for (int i = l; i <= r; ++i) {
                cout << person[query_k(1, 1, n, i)] << ' ';
            }
            cout << endl;
        }
    }
    return 0;
}
```

## J. 反质数

详见进阶指南 140 页，搜前 10 个素数的 30 以内的单调不增幂次构造出来的数，找到满足要求的最小的一个。

```cpp
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;
typedef long long LL;
int p[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};
int n;
vector<LL> t;

void dfs(int x, int pre, LL res) {
    if (res > n) return;
    if (x == 10) {
        t.emplace_back(res);
        // cout << res << ' ';
        return;
    }
    LL bs = 1;
    for (int i = 0; i <= pre; ++i) {
        dfs(x + 1, i, res * bs);
        bs *= p[x];
        if (res * bs > n) break;
    }
}

int main() {
    scanf("%d", &n);
    dfs(0, 30, 1);
    int mx = 0, res = 1;
    for (auto i : t) {
        int x = i, l = sqrt(i), ct = 1;
        for (int j = 2; j <= l; ++j) {
            int t = 1;
            while (x % j == 0) {
                x /= j;
                t++;
            }
            ct *= t;
        }
        if (x != 1) ct *= 2;
        if (ct > mx) res = i, mx = ct;
        else if (ct == mx && i < res) res = i;
    }
    printf("%d\n", res);
    return 0;
}
```