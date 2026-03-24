---
title: 2025春训第十六场
---
# 2025春训第十六场

差点就 ak 了，有点可惜，感谢学姐手下留情😭。

## **A. Number Maximization**

签到题 \* 1

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int main() {
    string s;
    cin >> s;
    sort(s.begin(), s.end(), greater<char>());
    cout << s << endl;
    return 0;
}
```

## **B. Simplified Calendar System**

签到题 \* 2

```cpp
#include <iostream>

using namespace std;

int main() {
    int a, b, c, d, e, f, g;
    cin >> a >> b >> c >> d >> e >> f >> g;
    cout << (d - 1 + (e - a) + (f - b) * 30 + (g - c) * 360) % 7 + 1 << endl;
    return 0;
}
```

## **C. Letter Frequency**

签到题 \* 3

```cpp
#include <iostream>
#include <map>

using namespace std;

string s[30];

int main() {
    int n, len = 0;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> s[i];
        len = max(len, (int)s[i].length());
    }
    for (int i = 1; i <= len; ++i) {
        cout << i << ":";
        map<char, int> mp;
        for (int j = 1; j <= n; ++j) {
            if (s[j].length() >= i) mp[s[j][i - 1]]++;
        }
        int mx = 0;
        for (auto [a, b] : mp) mx = max(mx, b);
        for (auto [a, b] : mp) if (b == mx) cout << ' ' << a;
        cout << endl;
    }
    return 0;
}
```

## **D. Pseudo Pseudo Random Numbers**

数据非常的小，所以直接暴力枚举检查就行，签到题 \* 4

```cpp
#include <iostream>

using namespace std;

int n, k;

bool check(int mask) {
    int ls = -1, len = 0;
    for (int i = 0; i < n; ++i) {
        if ((mask >> i & 1) != ls) len = 1;
        else len++;
        ls = mask >> i & 1;
        if (len > k) return false;
    }
    return true;
}

int main() {
    int t = 0;
    cin >> n >> k;
    for (int i = 0; i < (1 << n); ++i) {
        if (check(i)) t++;
    }
    cout << t << endl;
    return 0;
}
```

## **E. Word Tree**

没什么特别的，就是最小生成树。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

string s[1010];
int fa[1010];
vector<pair<int, pair<int, int>>> ed;

int dis(string a, string b) {
    int n = a.length();
    int d = 0;
    for (int i = 0; i < n; ++i) {
        d += abs(a[i] - b[i]);
    }
    return d;
}

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, l;
    cin >> n >> l;
    for (int i = 1; i <= n; ++i) {
        cin >> s[i];
        fa[i] = i;
        for (int j = 1; j < i; ++j) {
            ed.push_back({dis(s[i], s[j]), {i, j}});
        }
    }
    int res = 0;
    sort(ed.begin(), ed.end());
    for (auto [w, p] : ed) {
        int x = getfa(p.first), y = getfa(p.second);
        if (x == y) continue;
        else {
            fa[y] = x;
            res = max(res, w);
        }
    }
    cout << res << endl;
    return 0;
}
```

## **F. House Prices Going Up**

树状数组（线段树）模板题。

```cpp
#include <iostream>

using namespace std;

const int N = 500010;
long long tr[N];
int n;
void add(int u, int v) {
    for (; u <= n; u += u & -u) {
        tr[u] += v;
    }
}

long long query(int u) {
    long long res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        add(i, t);
    }
    int q;
    scanf("%d", &q);
    while (q--) {
        char s[2];
        int x, y;
        scanf("%s%d%d", s, &x, &y);
        if (s[0] == 'U') add(x, y);
        else printf("%lld\n", query(y) - query(x - 1));
    }
    return 0;
}
```

## **G. Which Number**

到这里难度开始正常了，这道题是二分答案+容斥原理，先二分答案，然后用容斥原理检查前面合法的数的个数。

我不慎 WA 了一次好像是爆 long long 了。

```cpp
#include <iostream>

using namespace std;

long long a[20], k;
long long n;

bool check(long long mid) {
    __int128_t cnt = 0;
    for (int mask = 0; mask < (1 << k); ++mask) {
        __int128_t t = 1;
        int op = 0;
        for (int j = 0; j < k; ++j) {
            if (mask >> j & 1) {
                op++;
                t *= a[j];
            }
        }
        op = (op & 1) ? -1 : 1;
        cnt += (mid / t) * op;
    }
    return cnt >= n;
}

int main() {
    scanf("%lld%d", &n, &k);
    for (int i = 0; i < k; ++i) {
        scanf("%lld", &a[i]);
    }
    __int128_t l = 1, r = __LONG_LONG_MAX__;
    while (l < r) {
        long long mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    printf("%lld\n", (long long)l);
    return 0;
}
```

## **I. Share Auction**

又是一道二分题，考虑这样一个问题，对于一个 lot 如果一块一块的 bid **每一块的收益都会逐渐减小**，目标状态是使得最后 bid 了 v 之后目标状态是一个**相对均匀的状态**。具体来说是让其中的一部分（有可能是全部）在投了 v 之后再投 1 时或者的收益在误差允许的范围内尽可能相等，这样就能最大程度保证每次投的都是最优解。

于是可以**二分最终投一块钱的收益**，然后计算想把收益压到 ≤ mid 的时候需要 bid 多少，和 v 比较，找到一个尽可能接近 v 的（可以稍微大一点，因为有的情况最后好几个都相等，一降低每个都得 bid 1，无法到 v，但是不影响最后计算，因为都一样，最后投哪个都行）。找到之后按二分的 check 函数的逻辑再跑一次，这一次要加上最大限制 v，跑的过程中记录收益累加即可。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 100010;

struct Node {
    double rate;
    int tot_val;
    int voted = 0, other_vote;

    bool operator <(const Node &_) const {
        return rate < _.rate;
    }

    double vote(int t) {
        double r = (double)voted / (voted + other_vote) * tot_val;
        voted += t;
        rate = (double)(voted + 1) / (voted + other_vote + 1) * tot_val - (double)voted / (voted + other_vote) * tot_val;
        return (double)voted / (voted + other_vote) * tot_val - r;
    }
} a[N];
int n, v;

long long check(double val) {
    long long res = 0;
    for (int i = 1; i <= n; ++i) {
        int l = 0, r = 100000000;
        while (l < r) {
            int mid = l + r >> 1;
            auto bk = a[i];
            bk.vote(mid);
            if (bk.rate < val) r = mid;
            else l = mid + 1;
        }
        res += l;
    }
    return res;
}

int main() {
    double L = 0, R = 0;
    scanf("%d%d", &n, &v);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i].tot_val, &a[i].other_vote);
        a[i].vote(0);
        R = max(R, a[i].rate);
    }
    while (R - L > 1e-9) {
        double mid = (L + R) / 2;
        if (check(mid) >= v) L = mid;
        else R = mid;
    }
    double res = 0;
    for (int i = 1; i <= n; ++i) {
        int l = 0, r = v;
        while (l < r) {
            int mid = l + r >> 1;
            auto bk = a[i];
            bk.vote(mid);
            if (bk.rate < L) r = mid;
            else l = mid + 1;
        }
        res += a[i].vote(l);
        v -= l;
    }
    if (v) return 123;
    else printf("%f\n", res);
    return 0;
}
```

## **J. Desert Travel**

基本功大考核，**最小生成树 + 树上倍增**，思维难度不是很大，但是比较有操作难度，这中间炸了死哪都不知道。

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
#include <vector>

using namespace std;

const int N = 5010;

struct Edge {
    int x, y;
    double w;
} a[N * (N - 1) / 2];

int x[N], y[N];
int fa[N];
int f[N][15], dep[N];
double g[N][15];
vector<pair<double, int>> ed[N];

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

void dfs(int x) {
    for (int i = 1; i < 15; ++i) {
        f[x][i] = f[f[x][i - 1]][i - 1];
        g[x][i] = max(g[x][i - 1], g[f[x][i - 1]][i - 1]);
    }
    for (auto [w, y] : ed[x]) {
        if (y == f[x][0]) continue;
        g[y][0] = w;
        f[y][0] = x;
        dep[y] = dep[x] + 1;
        dfs(y);
    }
}

int main() {
    int n, m = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        fa[i] = i;
        scanf("%d%d", &x[i], &y[i]);
        for (int j = 1; j < i; ++j) {
            a[++m] = {j, i, sqrt(pow(x[i] - x[j], 2) + pow(y[i] - y[j], 2))};
        }
    }
    sort(a + 1, a + m + 1, [](Edge a, Edge b) {
        return a.w < b.w;
    });
    for (int i = 1; i <= m; ++i) {
        int x = getfa(a[i].x), y = getfa(a[i].y);
        if (x == y) continue;
        fa[y] = x;
        ed[a[i].x].push_back({a[i].w, a[i].y});
        ed[a[i].y].push_back({a[i].w, a[i].x});
    }
    dep[1] = 1;
    dfs(1);
    int q;
    scanf("%d", &q);
    while (q--) {
        int x, y;
        double res = 0;
        scanf("%d%d", &x, &y);
        if (dep[x] < dep[y]) swap(x, y);
        for (int i = 14; i >= 0; --i) {
            if (dep[f[x][i]] >= dep[y]) {
                res = max(res, g[x][i]);
                x = f[x][i];
            }
        }
        if (x != y) {
            for (int i = 14; i >= 0; --i) {
                if (f[x][i] != f[y][i]) {
                    res = max(res, max(g[x][i], g[y][i]));
                    x = f[x][i], y = f[y][i];
                }
            }
            res = max(res, max(g[x][0], g[y][0]));
        }
        printf("%f\n", res);
    }
    return 0;
}
```