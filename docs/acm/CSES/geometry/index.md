---
title: CSES Geometry
---
# CSES Geometry

- 2026-01-13：还差两道题，预计明天完结！！
- 2026-01-17：完结！！！

主要是为了补全队的短板，我开始学之前看都不看的计算几何了，毕竟谁不想做香香软软的数据结构呢。另外如果有人看的话，前排提醒一下，这**不是详细的题解**，只是记录一下自己做的过程。

做这个板子题的题集之前我先看了 Acwing 的课，所以码风会和y总的比较相似。

## Point Location Test

叉积判断一下就行。

```cpp
#include <iostream>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;

LL gcd(LL a, LL b) {
    return b ? gcd(b, a % b) : a;
}

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

PLL a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        scanf("%lld%lld", &a[i].x, &a[i].y);
    }
    a[n] = a[0];
    LL s = 0, cnt[2] = {0, 0};
    for (int i = 0; i < n; ++i) {
        s += area({0, 0}, a[i], a[i + 1]);
        cnt[1] += abs(gcd(a[i].x - a[i + 1].x, a[i].y - a[i + 1].y));
    }
    cnt[0] = (abs(s) - cnt[1]) / 2 + 1;
    printf("%lld %lld\n", cnt[0], cnt[1]);
    return 0;
}
```

## Line Segment Intersection

也是叉积判断一下就行，但是这个需要特判共线的情况。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#define x first
#define y second

using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

int sign(LL x) {
    if (x == 0) return 0;
    else if (x < 0) return -1;
    else return 1;
}

bool in_mid(PLL a, PLL b, PLL c) {
    vector<PLL> v ={a, b, c};
    sort(v.begin(), v.end());
    return v[1] == c;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        PLL p[4];
        for (int i = 0; i < 4; ++i) scanf("%lld%lld", &p[i].x, &p[i].y);
        int s1 = sign(area(p[0], p[1], p[2])), s2 = sign(area(p[0], p[1], p[3])), s3 = sign(area(p[2], p[3], p[0])), s4 = sign(area(p[2], p[3], p[1]));
        if (s1 == 0 && in_mid(p[0], p[1], p[2])) printf("YES\n");
        else if (s2 == 0 && in_mid(p[0], p[1], p[3])) printf("YES\n");
        else if (s3 == 0 && in_mid(p[2], p[3], p[0])) printf("YES\n");
        else if (s4 == 0 && in_mid(p[2], p[3], p[1])) printf("YES\n");
        else if (s1 != s2 && s3 != s4) printf("YES\n");
        else printf("NO\n");
    }
    return 0;
}
```

## Polygon Area

多边形面积，用三角剖分，取原点为参考点，按着边的顺序做叉积，求和取绝对值，这道题让求面积的二倍，所以不用除以二。

```cpp
#include <iostream>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 1010;

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

PLL a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        scanf("%lld%lld", &a[i].x, &a[i].y);
    }
    a[n] = a[0];
    LL res = 0;
    for (int i = 0; i < n; ++i) {
        res += area({0, 0}, a[i], a[i + 1]);
    }
    printf("%lld\n", abs(res));
    return 0;
}
```

## Point in Polygon

特判在边界的情况，别的地方用射线法。

```cpp
#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 1010;

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

int sign(LL n) {
    if (n == 0) return 0;
    else if (n > 0) return 1;
    else return -1;
}

bool on_mid(PLL a, PLL b, PLL c) {
    vector<PLL> v = {a, b, c};
    sort(v.begin(), v.end());
    return v[1] == c;
}

bool check_intersection(PLL p, PLL q, PLL a, PLL b) {
    return sign(area(p, q, a)) * sign(area(p, q, b)) < 0 && sign(area(a, b, p)) * sign(area(a, b, q)) < 0;
}

PLL a[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 0; i < n; ++i) scanf("%lld%lld", &a[i].x, &a[i].y);
    a[n] = a[0];
    while (m--) {
        PLL p, q;
        long double theta = 0;
        scanf("%lld%lld", &p.x, &p.y);
        q = {1000000007, p.y + 1};
        bool f = false, g = false;
        for (int i = 0; i < n; ++i) {
            if ((a[i + 1] - a[i]) * (p - a[i]) == 0) {
                if (on_mid(a[i], a[i + 1], p)) {
                    f = true;
                    break;
                }
            }
            else {
                g ^= check_intersection(p, q, a[i], a[i + 1]);
            }
        }
        if (f) printf("BOUNDARY\n");
        else if (g) printf("INSIDE\n");
        else printf("OUTSIDE\n");
    }
    return 0;
}
```

## Polygon Lattice Points

皮克定理 `面积 = 内部格点 + 边界格点 / 2 - 1`，算出来面积和边界的格点，然后再用公式算内部格点。

```cpp
#include <iostream>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;

LL gcd(LL a, LL b) {
    return b ? gcd(b, a % b) : a;
}

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

PLL a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        scanf("%lld%lld", &a[i].x, &a[i].y);
    }
    a[n] = a[0];
    LL s = 0, cnt[2] = {0, 0};
    for (int i = 0; i < n; ++i) {
        s += area({0, 0}, a[i], a[i + 1]);
        cnt[1] += abs(gcd(a[i].x - a[i + 1].x, a[i].y - a[i + 1].y));
    }
    cnt[0] = (abs(s) - cnt[1]) / 2 + 1;
    printf("%lld %lld\n", cnt[0], cnt[1]);
    return 0;
}
```

## Minimum Euclidean Distance

> [!NOTE]
> 这道题看了题解。

这是高中集训的时候印象非常深的一道题，当时啥都听不懂，造成了非常大的心理阴影，现在看看好像也没什么特别难的。这和计算几何关系就不太大了，他的思路是先**按照 x 坐标排序**然后**不断递归两边**，合并的时候初始化当前的最短距离 d 为**两边的最小值**，显然横纵坐标绝对值差超过 d 的点对是无意义的，所以我们从二分的 mid 处向左和向右画出**两个相邻的带状区域**，把区域内的点按照 y 坐标排序双指针扫描**维护差值小于 d 的滑动窗口**。滑动窗口内里面的点距离两两必须都夹在 $d$ 和 $\sqrt{d}$ 之间，一定不会太多，暴力处理。

```cpp
#include <iostream>
#include <algorithm>
#include <cmath>
#include <vector>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 200010;

PLL a[N], b[N], q[N];

LL get_dis(PLL a, PLL b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

LL solve(int l, int r) {
    if (l == r) return __LONG_LONG_MAX__;
    int mid = l + r >> 1;
    LL midx = a[mid].x, d = min(solve(l, mid), solve(mid + 1, r));
    int h1 = l, h2 = mid + 1, idx = l;
    while (h1 <= mid && h2 <= r) {
        if (a[h1].y <= a[h2].y) b[idx++] = a[h1++];
        else b[idx++] = a[h2++];
    }
    while (h1 <= mid) b[idx++] = a[h1++];
    while (h2 <= r) b[idx++] = a[h2++];
    int n = 0;
    for (int i = l; i <= r; ++i) {
        a[i] = b[i];
        if ((a[i].x - midx) * (b[i].x - midx) < d) q[++n] = b[i];
    }
    for (int i = 1, j = 1; i <= n; ++i) {
        while ((q[i].y - q[j].y) * (q[i].y - q[j].y) >= d) j++;
        for (int k = j; k < i; ++k) d = min(d, get_dis(q[k], q[i]));
    }
    return d;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i].x >> a[i].y;
    sort(a + 1, a + n + 1);
    cout << solve(1, n) << endl;
    return 0;
}
```

## Convex Hull

一个看着很简单的 Andrew 在 Acwing 和 CSES 连挂了两次……

上一次是下标填错 (`used[st[tp--]]` 写成了 `used[tp--]`)，这一次是 while 写成 if 没发现。

```cpp
#include <iostream>
#include <algorithm>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 200010;
PLL a[N];
int st[N], tp;
bool used[N];

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

LL area(PLL a, PLL b, PLL c) {
    return (b - a) * (c - a);
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld%lld", &a[i].x, &a[i].y);
    }
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) {
        while (tp >= 2 && area(a[st[tp - 1]], a[st[tp]], a[i]) < 0) used[st[tp--]] = false;
        st[++tp] = i;
        used[i] = true;
    }
    used[1] = false;
    for (int i = n - 1; i; --i) {
        if (used[i]) continue;
        while (tp >= 2 && area(a[st[tp - 1]], a[st[tp]], a[i]) < 0) tp--;
        st[++tp] = i;
    }
    printf("%d\n", tp - 1);
    for (int i = 1; i < tp; ++i) {
        printf("%lld %lld\n", a[st[i]].x, a[st[i]].y);
    }
    return 0;
}
```

## Maximum Manhattan Distances

这道比较简单，从训练赛到上海月赛遇到过很多次了，只和 x + y 和 x - y 的最值有关系。

```cpp
#include <iostream>
#include <climits>

using namespace std;
typedef long long LL;

int main() {
    int n;
    scanf("%d", &n);
    LL mx1 = LLONG_MIN, mx2 = LLONG_MIN, mn1 = LLONG_MAX, mn2 = LLONG_MAX;
    while (n--) {
        LL x, y;
        scanf("%lld%lld", &x, &y);
        mx1 = max(mx1, x + y), mx2 = max(mx2, x - y), mn1 = min(mn1, x + y), mn2 = min(mn2, x - y);
        printf("%lld\n", max(mx1 - mn1, mx2 - mn2));
    }
    return 0;
}
```

## All Manhattan Distances

横纵坐标没什么大关系，可以拆开分别算，没什么难度，但是第一次爆 long long 了。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
typedef long long LL;
const int N = 200010;
LL x[N], y[N];

void print(__int128_t x) {
    if (x == 0) return;
    print(x / 10);
    printf("%d", x % 10);
} 

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%llu%llu", &x[i], &y[i]);
    sort(x + 1, x + n + 1);
    sort(y + 1, y + n + 1);
    __int128_t sx = 0, sy = 0, res = 0;
    for (int i = 1; i <= n; ++i) {
        res += (__int128_t)x[i] * (i - 1) + (__int128_t)y[i] * (i - 1) - sx - sy;
        sx += x[i], sy += y[i];
    }
    if (res == 0) printf("0\n");
    else print(res), printf("\n");
    return 0;
}
```

## Intersection Points

分出来横线竖线，按照起点横坐标排序横线和竖线，枚举竖线，利用优先队列维护横坐标跨越当前竖线的横坐标的横线，用树状数组维护覆盖情况。

另外，反着做应该也行，入队出队的时候需要做区间加减，查询需要单点查询，可以用树状数组维护差分数组，好处是少开一个优先队列。

```cpp
#include <iostream>
#include <queue>
#include <algorithm>
#define x first
#define y second
using namespace std;
typedef pair<int, int> pii;
const int N = 100010, M = 2000002;
int tr[M];
struct Line {
    pii s, t;

    bool operator <(const Line& _) const {
        return t.x > _.t.x;
    }
} a[N], b[N];
priority_queue<Line> q;

void add(int u, int t) {
    for (; u <= M; u += u & -u) {
        tr[u] += t;
    }
}

int query(int u) {
    int res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

int main() {
    int n, l1 = 0, l2 = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        pii s, t;
        scanf("%d%d%d%d", &s.x, &s.y, &t.x, &t.y);
        s.x += M / 2, s.y += M / 2, t.x += M / 2, t.y += M / 2;
        if (s.x > t.x || s.y > t.y) swap(s, t); // 保证从左到右从上到下
        if (s.x == t.x) a[++l1] = {s, t};
        else b[++l2] = {s, t};
    }
    sort(a + 1, a + l1 + 1, [](Line a, Line b) { // 竖线排序
        return a.s.x < b.s.x;
    });
    sort(b + 1, b + l2 + 1, [](Line a, Line b) { // 横线排序
        return a.s.x < b.s.x;
    });
    long long res = 0;
    for (int i = 1, j = 0; i <= l1; ++i) {
        while (j + 1 <= l2 && b[j + 1].s.x <= a[i].s.x) {
            q.emplace(b[++j]);
            add(b[j].s.y, 1);
        }
        while (!q.empty() && q.top().t.x < a[i].s.x) {
            add(q.top().s.y, -1);
            q.pop();
        }
        res += query(a[i].t.y) - query(a[i].s.y - 1);
    }
    printf("%lld\n", res);
    return 0;
}
```

## Line Segments Trace I

这道题是半个半平面交，可以用单调栈维护，按照斜率不减的顺序排序。然后从左到右维护单调栈，保证交点横坐标单调递增。最终栈里面的就是最大值函数的边界，最终构成轮廓的几条直线在栈里的下标关于横坐标是单调的，所以输出答案的时候用双指针即可。

我因为单调栈的 if 条件太长打错了一个 first / second 卡了几十分钟……

```cpp
#include <iostream>
#include <algorithm>
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;
PLL a[N];
int st[N], tp;

LL calc(PLL line, int x) {
    return line.first + line.second * x;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        LL y1, y2;
        scanf("%lld%lld", &y1, &y2);
        a[i] = {y1, (y2 - y1) / m};
    }
    sort(a + 1, a + n + 1, [](PLL a, PLL b) {
        return a.second == b.second ? a.first > b.first : a.second < b.second;
    });
    for (int i = 1; i <= n; ++i) {
        while (tp > 1 && (a[i].first - a[st[tp]].first) * (a[st[tp - 1]].second - a[st[tp]].second) <= (a[st[tp]].first - a[st[tp - 1]].first) * (a[st[tp]].second - a[i].second) || tp && a[i].first >= a[st[tp]].first) tp--;
        st[++tp] = i;
    }
    for (int i = 0, j = 1; i <= m; ++i) {
        while (j < tp && calc(a[st[j]], i) <= calc(a[st[j + 1]], i)) j++;
        printf("%lld ", calc(a[st[j]], i));
    }
    printf("\n");
    return 0;
}
```

## Line Segments Trace II

我学会李超树了！这道题是李超树的板子，李超树利用标记永久化解决了一个线段在不同位置最优性不同的问题。一般的线段树区间修改是找到目标区间直接改懒标记就行，李超树的区间修改的思想是保证当前的懒标记能让一半是最优的，然后用相同的条件递归另一半，这样单点查询的时候取一路的 max 一定能取到一次最优的线段。如果主席树比较熟看一眼代码就明白了。

```cpp
#include <iostream>
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;
PLL tr[N * 4];

LL get_val(PLL line, int x) {
    return line.first + line.second * x;
}

void modify(int u, int l, int r, int ql, int qr, PLL v) {
    if (l == r) {
        tr[u] = get_val(tr[u], l) > get_val(v, l) ? tr[u] : v;
    }
    else if (ql <= l && r <= qr) {
        int mid = l + r >> 1;
        if (get_val(v, mid) > get_val(tr[u], mid)) swap(tr[u], v);
        if (get_val(v, l) <= get_val(tr[u], l)) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        else if (get_val(v, r) <= get_val(tr[u], r)) modify(u << 1, l, mid, ql, qr, v);
    }
    else {
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
    }
}

LL query(int u, int l, int r, int p) {
    if (l == r) return get_val(tr[u], l);
    else {
        int mid = l + r >> 1;
        if (p <= mid) return max(get_val(tr[u], p), query(u << 1, l, mid, p));
        else return max(get_val(tr[u], p), query(u << 1 | 1, mid + 1, r, p));
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    fill(tr, tr + m * 4, make_pair(-1, 0));
    for (int i = 1; i <= n; ++i) {
        LL x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        modify(1, 0, m, x1, x2, {(x1 * y2 - x2 * y1) / (x1 - x2), (y1 - y2) / (x1 - x2)});
    }
    for (int i = 0; i <= m; ++i) {
        cout << query(1, 0, m, i) << ' ';
    }
    cout << endl;
    return 0;
}
```

## Lines and Queries I

和上一道基本上一样，甚至还省了一个区间修改，只需要更新懒标记。需要注意函数值可能是负的了，需要初始化成负无穷。

```cpp
#include <iostream>
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;
PLL tr[N * 4];

LL get_val(PLL line, int x) {
    return line.first + line.second * x;
}

void modify(int u, int l, int r, int ql, int qr, PLL v) {
    if (l == r) {
        tr[u] = get_val(tr[u], l) > get_val(v, l) ? tr[u] : v;
    }
    else if (ql <= l && r <= qr) {
        int mid = l + r >> 1;
        if (get_val(v, mid) > get_val(tr[u], mid)) swap(tr[u], v);
        if (get_val(v, l) <= get_val(tr[u], l)) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        else if (get_val(v, r) <= get_val(tr[u], r)) modify(u << 1, l, mid, ql, qr, v);
    }
    else {
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
    }
}

LL query(int u, int l, int r, int p) {
    if (l == r) return get_val(tr[u], l);
    else {
        int mid = l + r >> 1;
        if (p <= mid) return max(get_val(tr[u], p), query(u << 1, l, mid, p));
        else return max(get_val(tr[u], p), query(u << 1 | 1, mid + 1, r, p));
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int q, m = 100000;
    cin >> q;
    fill(tr, tr + m * 4, make_pair(-1000001000000000, 0));
    while (q--) {
        int op;
        cin >> op;
        if (op == 1) {
            LL a, b;
            cin >> a >> b;
            modify(1, 0, m, 0, m, {b, a});
        }
        else {
            int x;
            cin >> x;
            cout << query(1, 0, m, x) << endl;
        }
    }
    return 0;
}
```

## Lines and Queries II

在上一道的基础上把生效区间加回来了。

```cpp
#include <iostream>
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;
PLL tr[N * 4];

LL get_val(PLL line, int x) {
    return line.first + line.second * x;
}

void modify(int u, int l, int r, int ql, int qr, PLL v) {
    if (l == r) {
        tr[u] = get_val(tr[u], l) > get_val(v, l) ? tr[u] : v;
    }
    else if (ql <= l && r <= qr) {
        int mid = l + r >> 1;
        if (get_val(v, mid) > get_val(tr[u], mid)) swap(tr[u], v);
        if (get_val(v, l) <= get_val(tr[u], l)) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        else if (get_val(v, r) <= get_val(tr[u], r)) modify(u << 1, l, mid, ql, qr, v);
    }
    else {
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
    }
}

LL query(int u, int l, int r, int p) {
    if (l == r) return get_val(tr[u], l);
    else {
        int mid = l + r >> 1;
        if (p <= mid) return max(get_val(tr[u], p), query(u << 1, l, mid, p));
        else return max(get_val(tr[u], p), query(u << 1 | 1, mid + 1, r, p));
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int q, m = 100000;
    cin >> q;
    fill(tr, tr + m * 4, make_pair(-1000001000000001, 0));
    while (q--) {
        int op;
        cin >> op;
        if (op == 1) {
            int a, b, l, r;
            cin >> a >> b >> l >> r;
            modify(1, 0, m, l, r, {b, a});
        }
        else {
            int x;
            cin >> x;
            LL res = query(1, 0, m, x);
            if (res == -1000001000000001) cout << "NO" << endl;
            else cout << res << endl;
        }
    }
    return 0;
}
```

## Area of Rectangles

> [!NOTE]
> 这道题看了题解，知道有一种用线段树的做法但是靠自己想没想出来怎么维护。

矩形面积并是一个经典的扫描线问题，可以想象成把这一堆矩形放到一块然后按照 $x = 0,-1,1,-2,2\dots$ 切成很多长条，这些长条的面积是很好计算的。暴力的做法可以参考 [AcWing 做题记录](posts/geometry-acwing/#acwing-3068-%E6%89%AB%E6%8F%8F%E7%BA%BF)。

我们需要从左到右扫一遍横坐标，然后想办法高效维护垂直于 x 轴方向上的覆盖长度。这涉及到区间加减和区间查询，所以第一个就可以想到线段树。但是如果要开线段树，要维护的一定得是某个 y 的区间被覆盖的次数，否则当一个矩形结束的时候你没有办法删掉，问题就在于如果维护的是被覆盖的次数那怎么统计有多少个位置是被覆盖的。这里用到了一个巧妙的转化，我们维护**区间最小值和区间最小值的数量**。

- 如果区间最小值是 0，那么被覆盖的次数就是**区间长度 - 最小值0的个数**
- 否则被覆盖的次数就是**区间长度**

可以发现这个状态是可以合并的，合并时只需要比较一下两个儿子最小值的大小，如果不相等，直接用较小的；否则把儿子的最小值个数相加。这道题坐标数量级只有 $10^6$，所以不用离散化了，直接暴力做的行了。

```cpp
#include <iostream>
#include <tuple>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 2000010;

vector<tuple<int, int, int>> v[N];
struct Node {
    int val, len, tag;
} tr[N * 4];

void pushup(int u) {
    if (tr[u << 1].val == tr[u << 1 | 1].val) tr[u].val = tr[u << 1].val, tr[u].len = tr[u << 1].len + tr[u << 1 | 1].len;
    else if (tr[u << 1].val < tr[u << 1 | 1].val) tr[u].val = tr[u << 1].val, tr[u].len = tr[u << 1].len;
    else tr[u].val = tr[u << 1 | 1].val, tr[u].len = tr[u << 1 | 1].len;
}

void build(int u, int l, int r) {
    if (l == r) tr[u] = {0, 1, 0};
    else {
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

void pushdown(int u) {
    if (tr[u].tag) {
        tr[u << 1].tag += tr[u].tag, tr[u << 1 | 1].tag += tr[u].tag;
        tr[u << 1].val += tr[u].tag, tr[u << 1 | 1].val += tr[u].tag;
        tr[u].tag = 0;
    }
}

void modify(int u, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) {
        tr[u].val += v, tr[u].tag += v;
    }
    else {
        pushdown(u);
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        pushup(u);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m = 2000001;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        x1 += 1000001, x2 += 1000001, y1 += 1000001, y2 += 1000001;
        v[x1].emplace_back(1, y1, y2 - 1);
        v[x2].emplace_back(-1, y1, y2 - 1);
    }
    build(1, 1, m);
    LL res = 0;
    for (int i = 1; i <= m; ++i) {
        for (auto [f, l, r] : v[i]) modify(1, 1, m, l, r, f);
        res += tr[1].val == 0 ? m - tr[1].len : m;
    }
    cout << res << endl;
    return 0;
}
```

## Robot Path

经过不完全统计，我做这道题用了 218 分钟😇

这道题主要难点就是标记上经过的位置，即使离散化过了 1e5 * 1e5 量级的数据也不可能用二维数组维护，所以首先排除了二维树状数组。注意到一个比较关键的性质，标记操作的次数只有 1e5 次，数据比较稀疏，然后我就想能不能树套树搏一搏。估计一下**离散化**之后内存占用

```bash
python
>>> 1e5 * math.log2(2e5) ** 2 * (1 + 1 + 4 + 4) / 1024 ** 2
295.7338692082626
```
内存大头只需要 `295MB` 完全可行。

具体的，我们需要维护一个**结点是线段树的线段树（树套树）**，外层线段树维护行，内层线段树维护列，**维护布尔值**就行（因为不需要知道有多少走过的，只需要知道有没有走过，能省一点就省一点），操作涉及到区间修改区间查询，为了最大限度的压缩时间和空间复杂度，我们需要**动态开点**和**标记永久化**，保证每次操作时间和空间复杂度都在 $\log^2{n}$。

整体的思路是

- 先无视规则，走一遍全程，把端点位置的横纵坐标都记下来**离散化**（注意每次走的区间最好不要搞成闭区间，可能给后面的操作造成问题，我这里统一改成了**左开右闭**，所以把走一步和走 x 步的坐标全记录进去）；
- 然后开始走第二轮，每走一步之前用线段树检查路上是否有标记过的：
  - 如果有，**二分距离**，找到边界统计答案，跳出循环；
  - 如果没有，把一整段加到答案里面继续走。

这个二分距离从理论上必要性不大，因为可以线段树上二分，但是会非常恶心，又考虑到时间复杂度瓶颈不在这儿，多一点也没事。整体时间复杂度还是 $O(n \log^2 n)$.

之后就是大量的调试了，yysy 第一次写这么大一坨写的是真的真的很恶心，我还写过一次指针版本的，理论上没问题，在我这儿也没问题，但是到服务器上就被 MLE 了（悲）。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 100010;
vector<pair<char, int>> qs;
vector<LL> values;
struct SubNode {
    bool val, tag;
    int ls, rs;
} sub[N * 17 * 17];
struct Node {
    int val, tag, ls, rs;
} tr[N * 8];
int tot_sub, tot, m, rt;

void modify(int &u, int l, int r, int ql, int qr) {
    if (!u) u = ++tot_sub;
    if (ql <= l && r <= qr) {
        sub[u].tag = true;
    }
    else {
        sub[u].val = true;
        int mid = l + r >> 1;
        if (qr <= mid) modify(sub[u].ls, l, mid, ql, qr);
        else if (ql > mid) modify(sub[u].rs, mid + 1, r, ql, qr);
        else modify(sub[u].ls, l, mid, ql, mid), modify(sub[u].rs, mid + 1, r, mid + 1, qr);
    }
}

bool query(int u, int l, int r, int ql, int qr) {
    if (!u) return false;
    else if (ql <= l && r <= qr) return sub[u].val | sub[u].tag;
    else {
        int mid = l + r >> 1;
        if (sub[u].tag) return true;
        if (qr <= mid) return query(sub[u].ls, l, mid, ql, qr);
        else if (ql > mid) return query(sub[u].rs, mid + 1, r, ql, qr);
        else return query(sub[u].ls, l, mid, ql, mid) | query(sub[u].rs, mid + 1, r, mid + 1, qr);
    }
}

void modify(int &u, int l, int r, int x1, int y1, int x2, int y2) {
    if (make_pair(x1, y1) > make_pair(x2, y2)) swap(x1, x2), swap(y1, y2);
    if (!u) u = ++tot;
    if (x1 <= l && r <= x2) modify(tr[u].tag, 1, m, y1, y2);
    else {
        modify(tr[u].val, 1, m, y1, y2);
        int mid = l + r >> 1;
        if (x2 <= mid) modify(tr[u].ls, l, mid, x1, y1, x2, y2);
        else if (x1 > mid) modify(tr[u].rs, mid + 1, r, x1, y1, x2, y2);
        else modify(tr[u].ls, l, mid, x1, y1, mid, y2), modify(tr[u].rs, mid + 1, r, mid + 1, y1, x2, y2);
    }
}

bool query(int u, int l, int r, int x1, int y1, int x2, int y2) {
    if (make_pair(x1, y1) > make_pair(x2, y2)) swap(x1, x2), swap(y1, y2);
    if (!u) return false;
    else if (x1 <= l && r <= x2) return query(tr[u].val, 1, m, y1, y2) | query(tr[u].tag, 1, m, y1, y2);
    else {
        int mid = l + r >> 1;
        if (query(tr[u].tag, 1, m, y1, y2)) return true;
        if (x2 <= mid) return query(tr[u].ls, l, mid, x1, y1, x2, y2);
        else if (x1 > mid) return query(tr[u].rs, mid + 1, r, x1, y1, x2, y2);
        else return query(tr[u].ls, l, mid, x1, y1, mid, y2) | query(tr[u].rs, mid + 1, r, mid + 1, y1, x2, y2);
    }
}

int get(LL p) {
    return lower_bound(values.begin(), values.end(), p) - values.begin() + 1;
}

void print() {
    cout << "TREE" << endl;
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= m; ++j) {
            cout << query(1, 1, m, i, j, i, j) << ' ';
        }
        cout << endl;
    }
}

int main() {
    // freopen("test_input.txt", "r", stdin);
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    qs.resize(n);
    LL x = 0, y = 0;
    values.emplace_back(0);
    for (int i = 0; i < n; ++i) {
        cin >> qs[i].first >> qs[i].second;
        auto &[c, t] = qs[i];
        if (c == 'U') values.emplace_back(x - 1), values.emplace_back(x -= t);
        else if (c == 'D') values.emplace_back(x + 1), values.emplace_back(x += t);
        else if (c == 'L') values.emplace_back(y - 1), values.emplace_back(y -= t);
        else values.emplace_back(y + 1), values.emplace_back(y += t);
    }
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    m = values.size();
    x = 0, y = 0;
    int pos = get(0);
    LL res = 0;
    modify(rt, 1, m, pos, pos, pos, pos);
    for (int i = 0; i < qs.size(); ++i) {
        auto &[c, t] = qs[i];
        if (i > 0 && (c == 'U' && qs[i - 1].first == 'D' || c == 'D' && qs[i - 1].first == 'U' || c == 'L' && qs[i - 1].first == 'R' || c == 'R' && qs[i - 1].first == 'L')) break;
        LL x1, y1, x2, y2;
        if (c == 'U') x1 = x - 1, x2 = x - t, y1 = y2 = y, x -= t;
        else if (c == 'D') x1 = x + 1, x2 = x + t, y1 = y2 = y, x += t;
        else if (c == 'L') y1 = y - 1, y2 = y - t, x1 = x2 = x, y -= t;
        else y1 = y + 1, y2 = y + t, x1 = x2 = x, y += t;
        x1 = get(x1), x2 = get(x2), y1 = get(y1), y2 = get(y2);
        if (query(rt, 1, m, x1, y1, x2, y2)) {
            int l = 0, r = abs(x2 + y2 - x1 - y1);
            int t1, t2;
            if (c == 'U') t1 = -1, t2 = 0;
            else if (c == 'D') t1 = 1, t2 = 0;
            else if (c == 'L') t1 = 0, t2 = -1;
            else t1 = 0, t2 = 1;
            while (l < r) {
                int mid = l + r >> 1;
                if (query(rt, 1, m, x1, y1, x1 + t1 * mid, y1 + t2 * mid)) r = mid;
                else l = mid + 1;
            }
            int px = x1 + l * t1, py = y1 + l * t2;
            res += abs(values[px - 1] + values[py - 1] - values[x1 - 1] - values[y1 - 1]) + 1;
            break;
        }
        res += abs(values[x2 - 1] + values[y2 - 1] - values[x1 - 1] - values[y1 - 1]) + 1;
        modify(rt, 1, m, x1, y1, x2, y2);
    }
    cout << res << endl;
    return 0;
}
```

<span class="text-2xl font-black text-red-500">完结撒花！！！🎉🎉🎉</span>