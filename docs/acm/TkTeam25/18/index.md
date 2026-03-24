---
title: 2025组队训练赛第 18 场
---
# 2025组队训练赛第 18 场

## B. Call of Accepted

基本上就是**中缀表达式求值**，开两个栈模拟即可，还是挺好写的。

```cpp
#include <iostream>
#include <sstream>
using namespace std;
 
const int N = 200;
 
int w(char c) {
    if (c == '+' || c == '-') return 1;
    else if (c == '*') return 2;
    else if (c == 'd') return 3;
    else return 0;
}
 
pair<int, int> st1[N];
char st2[N], tp1, tp2;
 
void calc() {
    auto a = st1[tp1 - 1], b = st1[tp1];
    char c = st2[tp2--];
    tp1--;
    if (c == '+') a.first += b.first, a.second += b.second;
    else if (c == '-') a.first -= b.second, a.second -= b.first;
    else if (c == '*') {
        int t[] = {a.first * b.first, a.second * b.second, a.first * b.second, a.second * b.first};
        a = {min(min(t[0], t[1]), min(t[2], t[3])), max(max(t[0], t[1]), max(t[2], t[3]))};
    }
    else if (c == 'd') {
        a = {a.first, a.second * b.second};
    }
    else cout << "awa" << endl;
    st1[tp1] = a;
}
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    while (cin >> s) {
        tp1 = tp2 = 0;
        stringstream ss(s);
        char c;
        int num;
        while (ss.peek() != EOF) {
            if (isdigit(ss.peek())) {
ss >> num;
st1[++tp1] = {num, num};
            }
            else {
ss >> c;
if (c == '(') st2[++tp2] = c;
else if (c == '+' || c == '-') {
    while (tp2 && w(st2[tp2]) >= 1) {
        calc();
    }
    st2[++tp2] = c;
}
else if (c == '*') {
    while (tp2 && w(st2[tp2]) >= 2) {
        calc(); 
    }
    st2[++tp2] = c;
}
else if (c == 'd') {
    while (tp2 && w(st2[tp2]) >= 3) {
        calc();
    }
    st2[++tp2] = c;
}
else {
    while (st2[tp2] != '(') {
        calc();
    }
    tp2--;
}
            }
        }
        while (tp2) calc();
        printf("%d %d\n", st1[tp1].first, st1[tp1].second);
    }
    return 0;
}
```

## D. Made In Heaven

第 k 短路，可以用 A*，估值函数用反图 Dijkstra 从终点跑出来的最短路，第 k 次搜到终点的时候走过的路径就是第 k 短路。

我 A* 没有判断不连通又爆时间又爆空间的，改完就对了。

```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <tuple>

using namespace std;
const int N = 1010, M = 10010;

int head[N], head_rev[N], ver[M * 2], ne[M * 2], w[M * 2], tot;
int dis[N];
bool vis[N];

int n, m, s, e, k;
int v[N];
int t;

void add(int *head, int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

void dijkstra(int s) {
    priority_queue<pair<int, int>> q;
    memset(dis, 0x3f, sizeof(dis));
    memset(vis, 0, sizeof(vis));
    dis[s] = 0;
    q.emplace(-dis[s], s);
    while (!q.empty()) {
        int x = q.top().second;
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (int i = head_rev[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dis[y] > dis[x] + w[i]) {
dis[y] = dis[x] + w[i];
q.emplace(-dis[y], y);
            }
        }
    }
}

void solve() {
    memset(head, 0, sizeof(head));
    memset(head_rev, 0, sizeof(head_rev));
    memset(v, 0, sizeof(v));
    tot = 0;
    scanf("%d%d%d%d", &s, &e, &k, &t);
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        add(head, x, y, z);
        add(head_rev, y, x, z);
    }
    dijkstra(e);
    priority_queue<pair<int, int>> q;
    q.emplace(-dis[s], s);
    while (!q.empty()) {
        auto [cost, x] = q.top();
        q.pop();
        v[x]++;
        if (v[x] > k) continue;
        if (x == e) {
            if (-cost > t) {
printf("Whitesnake!\n");
return;
            }
            if (v[x] == k) {
printf("yareyaredawa\n");
return;
            }
        }
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (v[y] > k) continue;
            q.emplace(cost + dis[x] - w[i] - dis[y], y);
        }
    }
    printf("Whitesnake!\n");
}

int main() {
    while (scanf("%d%d", &n, &m) != EOF) {
        solve();
    }
    return 0;
}
```

## E. The cake is a lie<sup style="color: red">补</sup>

刚开始数据有问题，没有填数据，过样例的都过了。后来我调对了，重判的时候被卡掉了，时间限制 1s，我跑 1.5s，绝望.jpg。

### $O(n^3 \log n)$ 做法

先说一下被卡掉的思路。

- **枚举一条弦**，假定圆心在中垂线上，初始化认为这条弦是直径；
- 遍历所有的点，统计当前在圆内的点数，同时根据在圆内和圆外和在直径两侧分成四块，**正弦定理求出来包含三个点的圆的半径，按半径分别排序**；
- 朝一个方向扩展圆，**双指针遍历**这个方向圆外点和另一个方向的圆内点，随着并入外面的点，里面的点会被排出圆外，同时要维护圆内的点数；
- 恢复到直径，朝反方向在扩展；
- 在以上过程中如果点数 > s，就直接**更新答案**；
- 继续枚举其他弦。

代码是这样的，真的只差一点就过去了。

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
#include <vector>
#include <iomanip>
#define x first
#define y second
using namespace std;
typedef pair<int, int> PII;
const int N = 310;
const double eps = 1e-7;
PII a[N];
double b[N], c[N], d[N], e[N];

PII operator -(const PII &a, const PII &b) {
    return {a.x - b.x, a.y - b.y};
}

PII operator +(const PII &a, const PII &b) {
    return {a.x + b.y, a.y - b.y};
}

int operator *(const PII &a, const PII &b) {
    return a.x * b.y - a.y * b.x;
}

int operator &(const PII &a, const PII &b) {
    return a.x * b.x + a.y * b.y;
}

double getlen(const PII &a) {
    return sqrt(a.x * a.x + a.y * a.y);
}

double calc_r(const PII &a, const PII &b, const PII &c) {
    PII t1 = b - a, t2 = c - a, t3 = c - b;
    return getlen(t3) / ((t1 * t2) / getlen(t1) / getlen(t2)) / 2;
}

void solve() {
    int n, s, R;
    cin >> n >> s;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i].x >> a[i].y;
    }
    cin >> R;
    if (n < s) {
        cout << "The cake is a lie.\n";
        return;
    }
    else if (s == 1) {
        cout << R << ".0000\n";
        return;
    }
    double res = 100000;
    bool f = true;
    for (int i = 2; i <= n; ++i) {
        if (a[i] != a[1]) {
            f = false;
            break;
        }
    }
    if (f) {
        cout << R << ".0000\n";
        return;
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = i + 1; j <= n; ++j) {
            auto &p = a[i], &q = a[j];
            int t = 0, l1 = 0, l2 = 0, l3 = 0, l4 = 0;
            for (int k = 1; k <= n; ++k) {
int dot = (a[k] - a[i]) & (a[k] - a[j]);
if (dot <= 0) {
    t++;
}
double r = calc_r(p, q, a[k]);
if (fabs(r) >= eps) {
    if (dot <= 0) {
        if (r > 0) b[++l1] = r;
        else c[++l2] = fabs(r);
    }
    else {
        if (r > 0) d[++l3] = r;
        else e[++l4] = fabs(r);
    }
}
            }
            if (t >= s) {
res = min(res, getlen(p - q) / 2);
continue;
            }
            sort(b + 1, b + l1 + 1);
            sort(c + 1, c + l2 + 1);
            sort(d + 1, d + l3 + 1);
            sort(e + 1, e + l4 + 1);
            int bk = t;
            for (int k = 1, l = 1; k <= l4; ++k) {
double r = e[k];
t++;
while (l <= l1 && b[l] < r) l++, t--; 
if (t >= s) res = min(res, r);
            }
            t = bk;
            for (int k = 1, l = 1; k <= l3; ++k) {
double r = d[k];
t++;
while (l <= l2 && c[l] < r) l++, t--;
if (t >= s) res = min(res, r);
            }
        }
    }
    cout << fixed << setprecision(4) << res + R << '\n';
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
}
```

### $O(n^2 \log n \log (1e12))$ 做法

后来搜了题解之后学会了更快的做法，我的第一版思路和这个做法类似，但是我没有想到处理圆心的方法。

**二分半径**；枚举所有的圆，依次固定每一个圆，求所有的和他间距在 2r 以内的圆（包括他自己）和他的交点的极角，**离散化极角，做差分前缀和**，覆盖最多的一块如果不小于 s 为合法，否则不合法，最后成功 363ms 过了。

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
#include <vector>
#include <iomanip>
#define x first
#define y second
using namespace std;
typedef pair<int, int> PII;
const int N = 310;
const double eps = 1e-8;
PII a[N];
pair<double, int> b[N * 2];
double dis[N][N], ang[N][N];
int n, s, R;

int dcmp(double a, double b) {
    if (fabs(a - b) < eps) return 0;
    else if (a < b) return -1;
    else return 1;
}

PII operator -(const PII &a, const PII &b) {
    return {a.x - b.x, a.y - b.y};
}

PII operator +(const PII &a, const PII &b) {
    return {a.x + b.y, a.y - b.y};
}

int operator *(const PII &a, const PII &b) {
    return a.x * b.y - a.y * b.x;
}

int operator &(const PII &a, const PII &b) {
    return a.x * b.x + a.y * b.y;
}

double getlen(const PII &a) {
    return sqrt(a.x * a.x + a.y * a.y);
}

double getangle(const PII &a) {
    return atan2(a.y, a.x);
}

bool check(double r) {
    for (int i = 1; i <= n; ++i) {
        int l = 0;
        for (int j = 1; j <= n; ++j) {
            if (dcmp(dis[i][j], r * 2) <= 0) {
double t = acos(dis[i][j] / 2 / r);
b[++l] = {ang[i][j] - t, 1};
b[++l] = {ang[i][j] + t, -1};
            }
        }
        sort(b + 1, b + l + 1, [](pair<double, int> a, pair<double, int> b) {
            return dcmp(a.first, b.first) == 0 ? a.second > b.second : dcmp(a.first, b.first) < 0;
        });
        int t = 0;
        for (int i = 1; i <= l; ++i) {
            t += b[i].second;
            if (t >= s) return true;
        }
    }
    return false;
}

void solve() {
    cin >> n >> s;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i].x >> a[i].y;
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            dis[i][j] = getlen(a[j] - a[i]);
            ang[i][j] = getangle(a[j] - a[i]);
        }
    }
    cin >> R;
    if (n < s) {
        cout << "The cake is a lie.\n";
        return;
    }
    // cout << check(0.3) << endl;
    double l = 0.0, r = 10000;
    while (l + eps < r) {
        double mid = (l + r) / 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    cout << fixed << setprecision(4) << l + R << '\n';
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
}
```

## F. Fantastic Graph <sup style="color: blue">欠</sup>

上下界网络流，待学。

## G. Spare Tire <sup style="color: blue">欠</sup>

数学题，待补。

## I. Lattice's basics in digital electronics <sup style="color: blue">欠</sup>

大模拟，待补。

## K. Supreme Number

我们打表发现只有这几个数，所以问题就直接解决了。

```text
1, 2, 3, 5, 7, 11, 13, 17, 23, 31, 37, 53, 71, 73, 113, 131, 137, 173, 311, 317
```

