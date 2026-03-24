---
title: 2025组队训练赛第 22 场
---
# 2025组队训练赛第 22 场

最简单的一场。

## A. Flag Bearer

这是一道签到题，我感觉最大的难点在于把 26 个字母全部敲完（代码太长，建议点右侧导航栏跳转）。

```cpp
#include <iostream>
#include <vector>
 
using namespace std;
 
const int N = 26;
 
vector<string> t[N] = {
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*....",
        "...##....",
        "..#.#....",
        ".#..#....",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        ".###*....",
        "....#....",
        "....#....",
        "....#....",
        "........."
    },
    {
        ".........",
        ".#.......",
        "..#......",
        "...#.....",
        "....*....",
        "....#....",
        "....#....",
        "....#....",
        "........."
    },
    {
        ".........",
        "....#....",
        "....#....",
        "....#....",
        "....*....",
        "....#....",
        "....#....",
        "....#....",
        "........."
    },
    {
        ".........",
        ".......#.",
        "......#..",
        ".....#...",
        "....*....",
        "....#....",
        "....#....",
        "....#....",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*###.",
        "....#....",
        "....#....",
        "....#....",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*....",
        "....##...",
        "....#.#..",
        "....#..#.",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        ".###*....",
        "...#.....",
        "..#......",
        ".#.......",
        "........."
    },
    {
        ".........",
        ".#.......",
        "..#......",
        "...#.....",
        "....*....",
        "...#.....",
        "..#......",
        ".#.......",
        "........."
    },
    {
        ".........",
        "....#....",
        "....#....",
        "....#....",
        "....*###.",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        "....#....",
        "....#....",
        "....#....",
        "....*....",
        "...#.....",
        "..#......",
        ".#.......",
        "........."
    },
    {
        ".........",
        ".......#.",
        "......#..",
        ".....#...",
        "....*....",
        "...#.....",
        "..#......",
        ".#.......",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*###.",
        "...#.....",
        "..#......",
        ".#.......",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*....",
        "...#.#...",
        "..#...#..",
        ".#.....#.",
        "........."
    },
    {
        ".........",
        ".#.......",
        "..#......",
        "...#.....",
        ".###*....",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        "....#....",
        "....#....",
        "....#....",
        ".###*....",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".......#.",
        "......#..",
        ".....#...",
        ".###*....",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        ".###*###.",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        ".###*....",
        ".....#...",
        "......#..",
        ".......#.",
        "........."
    },
    {
        ".........",
        ".#..#....",
        "..#.#....",
        "...##....",
        "....*....",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".#.....#.",
        "..#...#..",
        "...#.#...",
        "....*....",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        "....#....",
        "....#....",
        "....#....",
        "....*....",
        ".....#...",
        "......#..",
        ".......#.",
        "........."
    },
    {
        ".........",
        ".......#.",
        "......#..",
        ".....#...",
        "....*###.",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".......#.",
        "......#..",
        ".....#...",
        "....*....",
        ".....#...",
        "......#..",
        ".......#.",
        "........."
    },
    {
        ".........",
        ".#.......",
        "..#......",
        "...#.....",
        "....*###.",
        ".........",
        ".........",
        ".........",
        "........."
    },
    {
        ".........",
        ".........",
        ".........",
        ".........",
        "....*###.",
        ".....#...",
        "......#..",
        ".......#.",
        "........."
    },
};
 
int main() {
    int n, c;
    cin >> n >> c;
    vector<string> s(9);
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < 9; ++j) {
            cin >> s[j];
        }
        int k = 0;
        for (int j = 0; j < 26; ++j) {
            if (t[j] == s) {
                k = j;
                break;
            }
        }
        k = (k + c) % 26;
        for (int j = 0; j < 9; ++j) {
            cout << t[k][j] << endl;
        }
    }
    return 0;
}
```

## B. Cowpproximation

做法和之前的[这道题](https://blog.starlab.top/p/2025rt18/#e-the-cake-is-a-lie%E8%A1%A5)完全一样。

二分半径，验证的时候尝试每个圆把其他圆和他的相交弧离散化，差分前缀和，如果最大值是 n - 1，就表明可以，时间复杂度是 $O(n^2 \log{n} \log{m})$ (m 为半径二分的范围 / 二分的精度)，但是我们的 oj 有点卡常，可以尝试一些方法玄学的卡过。官方题解给出的验证方式和我一样，但是他用的是梯度下降，他说 Well implemented gradient descend may find the solution quickly。

```cpp
#include <iostream>
#include <cmath>
#include <iomanip>
#include <algorithm>
#define x first
#define y second
using namespace std;
typedef pair<double, double> PDD;
const int N = 1010;
const double eps = 1e-8;
const double PI = acos(-1);
double dis[N][N], ang[N][N];
pair<PDD, double> a[N];
pair<double, int> b[N * 2];
int n;
 
PDD operator -(PDD a, PDD b) {
    return {a.x - b.x, a.y - b.y};
}
 
double calc(double a, double b, double d) {
    return acos((a * a + d * d - b * b) / (a * d * 2));
}
 
double get_angle(PDD a) {
    return atan2(a.y, a.x);
}
 
double get_len(PDD a) {
    return sqrt(a.x * a.x + a.y * a.y);
}
 
double dcmp(double a, double b) {
    if (fabs(a - b) < eps) return 0;
    else if (a < b) return -1;
    else return 1;
}
 
bool check(double mid) {
    int lim = min(n, 231);
    for (int i = 1; i <= lim; ++i) {
        int l = 0;
        int cnt = 0;
        for (int j = 1; j <= n; ++j) {
            if (i == j) continue;
            double &d = dis[i][j];
            if (dcmp(a[i].second + a[j].second + mid * 2, d) == -1) break;
            else if (dcmp(a[i].first.x, a[j].first.x) == 0 && dcmp(a[i].first.y, a[j].first.y) == 0 && dcmp(a[i].second, a[j].second) == 0) {
                cnt++;
            }
            else if (dcmp(fabs(a[i].second - a[j].second), d) == 1) {
                if (a[i].second <= a[j].second) cnt++;
                else break;
            }
            else {
                double t0 = ang[i][j], t = calc(a[i].second + mid, a[j].second + mid, d);
                b[l++] = {t0 - t, 1};
                b[l++] = {t0 + t, -1};
            }
        }
        if (cnt == n - 1) return true;
        sort(b, b + l);
        for (int i = 0; i < l; ++i) {
            cnt += b[i].second;
            if (cnt == n - 1) return true;
        }
    }
    return false;
}
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i].first.x >> a[i].first.y >> a[i].second;
    }
    sort(a + 1, a + n + 1, [](pair<PDD, double> a, pair<PDD, double> b) {
        return a < b;
    });
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            dis[i][j] = get_len(a[i].first - a[j].first);
            ang[i][j] = get_angle(a[j].first - a[i].first);
        }
    }
    double l = 0, r = 1500;
    while (r - l > 1e-6) {
        double mid = (l + r) / 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    cout << fixed << setprecision(7) << (l + r) / 2 << endl;
    return 0;
}
```

## D. Fishception

如果最大的矩形不和坐标轴平行，那么一定对应的是 x 最小，x 最大，y 最小，y 最大；如果最大矩形和坐标轴平行，那么对应的一定是 x 最小的两个，x 最大的两个。所以可以考虑按照 x 排序存一个数组，按照 y 排序存一个数组，四个指针分别指向两个数组的头和尾，按照上面的规则每次取出四个，直到还剩四个，直接找相邻三个点叉积算出面积。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
 
using namespace std;
 
const int N = 200010;
 
pair<int, int> p[N], x[N], y[N];
bool v[N];
 
int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        x[i].second = y[i].second = i;
        scanf("%d%d", &x[i].first, &y[i].first);
        p[i] = {x[i].first, y[i].first};
    }
    sort(x + 1, x + n + 1);
    sort(y + 1, y + n + 1);
    int t = n / 4 - 1;
    int h1 = 1, h2 = 1, t1 = n, t2 = n;
    while (t--) {
        while (v[x[h1].second]) h1++;
        while (v[y[h2].second]) h2++;
        while (v[x[t1].second]) t1--;
        while (v[y[t2].second]) t2--;
        if (x[h1].second != y[h2].second && x[h1].second != y[t2].second && x[t1].second != y[h2].second && x[t1].second != y[t2].second) {
            v[x[h1].second] = v[x[t1].second] = v[y[h2].second] = v[y[t2].second] = true;
        }
        else {
            v[x[h1].second] = v[x[h1 + 1].second] = v[x[t1].second] = v[x[t1 - 1].second] = true;
            h1++, t1--;
        }
    }
    vector<pair<int, int>> res;
    for (int i = 1; i <= n; ++i) {
        if (!v[i]) {
            res.emplace_back(p[i]);
        }
    }
    sort(res.begin(), res.end());
    // for (auto [x, y] : res) cout << x << ' ' << y << endl;
    pair<int, int> v1 = {res[1].first - res[0].first, res[1].second - res[0].second}, v2 = {res[2].first - res[0].first, res[2].second - res[0].second};
    printf("%lld\n", abs((long long)v1.first * v2.second - (long long)v1.second * v2.first));
    return 0;
}
```

## F. Hamster <sup style="color: blue">补</sup>

这是一个小结论
- 有一个是奇数就可以全走完；
- 如果全是偶数，可以发现两个下标奇偶性不同的位置可以只绕过他一个，否则要绕过包含其中一个满足上面特征的格子在内的多个，所以不如只绕过一个这样的格子。

```cpp
#include <iostream>

using namespace std;

const int N = 1010;

int main() {
    int n, m, res = 0, mn = 1001;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            int t;
            scanf("%d", &t);
            res += t;
            if ((i ^ j) & 1) mn = min(mn, t);
        }
    }
    if ((n | m) & 1) printf("%d\n", res);
    else printf("%d\n", res - mn);
    return 0;
}
```

## G. Pray Mink <sup style="color: blue">补</sup>

直接暴搜。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int res = 0;

bool prime(int x) {
    if (x < 2) return false;
    int l = sqrt(x);
    for (int i = 2; i <= l; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}

void dfs(int x, int t) {
    if (!prime(x)) {
        res = max(res, t);
        return;
    }
    for (int i = 0, bs = 1; i < 9; ++i, bs *= 10) {
        int y = x / bs / 10 * bs + x % bs;
        if (y != x) dfs(y, t + 1);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    dfs(n, 0);
    printf("%d\n", res);
    return 0;
}
```

## H. Ornithology <sup style="color: blue">补</sup>

树状数组统计逆序对，由于初始位置允许重叠，所以应该全部统计答案然后在一次性加进去。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;

int tr[N], n;
int buf[N];

void add(int x) {
    for (; x <= n; x += x & -x) {
        tr[x]++;
    }
}

int query(int x) {
    int res = 0;
    for (; x; x -= x & -x) {
        res += tr[x];
    }
    return res;
}

int main() {
    LL res = 0;
    int p;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &p);
        for (int j = 1; j <= p; ++j) {
            scanf("%d", &buf[j]);
            buf[j]++;
            res += query(n) - query(buf[j]);
        }
        for (int j = 1; j <= p; ++j) {
            add(buf[j]);
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## I. P||k Cutting <sup style="color: blue">补</sup>

维护前缀每一位 1 最后出现的位置，对于每一个位置 i，以当前位置为区间右端点，计算左端点的极限位置。

| k<sub>i</sub> | a<sub>i</sub> | 操作 |
| --- | --- | --- |
| 1 | 1 | 该位已经满足条件，无需操作 |
| 1 | 0 | 需要去前面找一个 1，左端点至少选在前方第一个 1 的左侧（包含） |
| 0 | 1 | 已经不可能了，赋一个不可能的值 |
| 0 | 0 | 需要前面不能有 1，左端点至少选在前方第一个 1 的右侧（不包含） |

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 400010;

int g[30], f[30]; // 最近的一个 1 的位置

int main() {
    LL res = 0;
    int n, k, t, l, r;
    scanf("%d%d", &n, &k);
    for (int i = 0; i < 30; ++i) {
        g[i] = k >> i & 1;
    }
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &t);
        l = 1, r = i;
        for (int j = 0; j < 30; ++j) {
            if (g[j]) {
                if (t >> j & 1) continue;
                else r = min(r, f[j]);
            }
            else {
                if (t >> j & 1) l = i + 1;
                else l = max(l, f[j] + 1);
            }
        }
        for (int j = 0; j < 30; ++j) {
            if (t >> j & 1) f[j] = i;
        }
        res += max(0, r - l + 1);
    }
    printf("%lld\n", res);
    return 0;
}
```

## J. Rabid Rabbit <sup style="color: blue">补</sup>

斐波那契数近似是指数增长的，所以合法的斐波那契数一定不多。可以枚举每一个合法的斐波那契数，扫一遍数组维护每一个数左侧最靠右和他互补的那个数的位置，前缀 max 一下，查询的时候检查对于每一个斐波那契数，右端点的前缀 max 知否大于左端点。

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

const int N = 100010;
int a[N], f[N][45];
vector<int> v;
unordered_map<int, int> mp;

void init() {
    long long a = 1, b = 1, c;
    while (b < 2000000000) {
        v.emplace_back(b);
        c = a + b;
        a = b;
        b = c;
    }
}

int main() {
    init();
    int n, q;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        for (int j = 0; j < 45; ++j) {
            f[i][j] = max(f[i - 1][j], mp[v[j] - a[i]]);
        }
        mp[a[i]] = i;
    }
    while (q--) {
        int l, r, res = 0;
        scanf("%d%d", &l, &r);
        for (int i = 0; i < 45; ++i) {
            if (f[r + 1][i] >= l + 1) res++;
        }
        printf("%d\n", res);
    }
    return 0;
}
```

## K. Fellow Sheep <sup style="color: blue">补</sup>

对于一个 abcde 结构，先走满 ab，和 de，最后 ace，bcd 有且仅有一条能走，再加上剩下的流量。把所有的流量去 min。

```cpp
#include <iostream>

using namespace std;

int main() {
    int n;
    int res = 500000000;
    scanf("%d", &n);
    while (n--) {
        int a, b, c, d, e, r = 0;
        scanf("%d%d%d%d%d", &a, &b, &c, &d, &e);
        int t1 = min(a, b), t2 = min(d, e);
        r = t1 + t2;
        a -= t1, b -= t1, d -= t2, e -= t2;
        r += max(min(a, min(c, e)), min(b, min(c, d)));
        res = min(res, r);
    }
    printf("%d\n", res);
    return 0;
}
```

## L. Watchdogs <sup style="color: blue">补</sup>

中间的一个或者两个点可以用树上倍增算出来，如果只有一个标 2，有两个把下面的标 1。贪心的做，如果一定要放一只猫，一定尽可能的往上放，给后面留机会。dfs 一遍，回溯的时候如果当前是 2 就直接答案 + 1，如果孩子里面有 1 当前标成 2，答案 + 1.

```cpp
#include <iostream>

using namespace std;

const int N = 100010;

int head[N], ver[N * 2], ne[N * 2], tot;
int f[N][17], dep[N], g[N], cnt;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x) {
    for (int i = 1; i < 17; ++i) {
        f[x][i] = f[f[x][i - 1]][i - 1];
    }
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == f[x][0]) continue;
        dep[y] = dep[x] + 1;
        f[y][0] = x;
        dfs(y);
    }
}

int get_dis(int x, int y) {
    int t = 0;
    if (dep[x] < dep[y]) swap(x, y);
    for (int i = 16; i >= 0; --i) {
        if (dep[f[x][i]] >= dep[y]) x = f[x][i], t += 1 << i;
    }
    if (x == y) return t;
    for (int i = 16; i >= 0; --i) {
        if (f[x][i] != f[y][i]) {
            x = f[x][i], y = f[y][i];
            t += 1 << i + 1;
        }
    }
    return t + 2;
}

int move(int x, int t) {
    for (int i = 0; i < 16; ++i) {
        if (t >> i & 1) x = f[x][i];
    }
    return x;
}

void dfs2(int x) {
    bool v[3] = {};
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == f[x][0]) continue;
        dfs2(y);
        v[g[y]] = true;
    }
    if (g[x] == 2) cnt++;
    else if (v[1]) g[x] = 2, cnt++;
}

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        x++, y++;
        add(x, y), add(y, x);
    }
    dep[1] = 1;
    dfs(1);
    for (int i = 1; i <= k; ++i) {
        int x, y, d;
        scanf("%d%d", &x, &y);
        x++, y++;
        d = get_dis(x, y);
        if (dep[x] < dep[y]) swap(x, y);
        int t = move(x, d >> 1);
        g[t] = max(g[t], d & 1 ? 1 : 2);
    }
    dfs2(1);
    printf("%d\n", cnt);
    return 0;
}
```