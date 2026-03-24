---
title: UPCPC2026网络预选赛
---
# UPCPC2026网络预选赛

**前言**

- Liuxx 说我的代码一眼 ai😭
- 验题的时候感觉出的有点太简单了，实际上好像很惨烈🤯

## A. ACM 常识问答

答案是。

```
FFTTFTTFFFTTT
```

## B. 幂数不可表示

最大可能的底数只可能是 $\sqrt{n}$，从 $1$ 到 $\sqrt{n}$ 开始暴力统计即可。

```cpp
#include <iostream>
#include <set>
#include <cmath>

using namespace std;

typedef long long LL;

set<LL> s;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL n, lim;
    cin >> n;
    lim = sqrt(n);
    for (int i = 2; i <= lim; ++i) {
        LL t = i;
        while (i * t <= n) {
            t *= i;
            s.insert(t);
        }
    }
    cout << n - s.size() << endl;
    return 0;
}
```

## C. 幸运数字

需要维护一个滑动窗口，对于每一个起点都找到窗口内的 mex 值，动态维护 mex 值可以用**权值线段树**实现。给出现过的元素标 1，没出现过的标 0，结点维护区间加法，在线段树上二分就可以得到 mex 值。

从前往后扫一遍，开一个数组 ls 统计每个值最近一次出现的位置，每次移动窗口

- 检查最左侧的元素有没有在后续出现过
  - 如果出现过，不需要操作
  - 如果没有，从线段树里把它减掉
- 检查右侧新进来的元素最后一次出现在不在窗口内
  - 如果出现过，不需要操作
  - 如果没出现，加到线段树里
  - 更新一下 ls

```cpp
#include <iostream>
#include <set>
#include <cmath>

using namespace std;

const int N = 1500010;

int tr[N * 4], a[N], ls[N];

void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] += v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }
}

int query(int u, int l, int r) {
    if (l == r) return l;
    else {
        int mid = l + r >> 1;
        if (tr[u << 1] < mid - l + 1) return query(u << 1, l, mid);
        else return query(u << 1 | 1, mid + 1, r);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    int res = n + 1;
    for (int i = 0; i <= n + 1; ++i) ls[i] = -0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        if (ls[a[i]] <= i - m) modify(1, 0, n + 1, a[i], 1);
        if (i > m && ls[a[i - m]] <= i - m) modify(1, 0, n + 1, a[i - m], -1);
        ls[a[i]] = i;
        if (i >= m) res = min(res, query(1, 0, n + 1));
    }
    cout << res << endl;
    return 0;
}
```

## D. 买发糕这一块

买一块需要 $[A, B]$，两块需要 $[2A, 2B]$…

枚举所有可能的数量，检查 W 在不在区间内，第一个合法的是最少的，最后一个合法的就是最多的。最坏的情况下 $A = B = 1, W = 1000$，只需要枚举 $10^6$ 次，完全可以通过。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int a, b, w;
    cin >> a >> b >> w;
    w *= 1000;
    int l1 = -1, r1 = -1, l = a, r = b;
    for (int i = 1; l <= w; i++, l += a, r += b) {
        if (l <= w && w <= r) {
            if (l1 == -1) l1 = i;
            r1 = i;
        }
    }
    if (l1 == -1) cout << "UNSATISFIABLE" << endl;
    else cout << l1 << ' ' << r1 << endl;
    return 0;
}
```

## E. 宵宫的烟花收纳

对于每一次询问单独处理。利用贪心的思想，如果一个盒子能放得下一个人气值高的，那么一定不会选择放低的。如果要放一个烟花，那么放在能放的体积最小的盒子一定最优。按照人气值从大到小排序，尽可能放大的即可。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 60;
typedef long long LL;
pair<LL, LL> a[N];
LL x[N];
bool f[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, q;
    cin >> n >> m >> q;
    for (int i = 1; i <= n; ++i) cin >> a[i].second >> a[i].first;
    for (int i = 1; i <= m; ++i) cin >> x[i];
    sort(a + 1, a + n + 1, greater<pair<LL, LL>>());
    while (q--) {
        int l, r;
        cin >> l >> r;
        LL res = 0;
        memset(f, 0, sizeof(f));
        for (int i = l; i <= r; ++i) f[i] = true;
        for (int i = 1; i <= n; ++i) {
            int pos = -1;
            for (int j = 1; j <= m; ++j) {
                if (!f[j] && x[j] >= a[i].second) {
                    if (pos == -1) pos = j;
                    else if (x[j] < x[pos]) pos = j;
                }
            }
            if (pos != -1) f[pos] = true, res += a[i].first;
        }
        cout << res << endl;
    }
    return 0;
}
```

## F. 霍格沃茨的终极对决

签到题，y - p 一定是最大的。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL x, y, p, q;
    cin >> x >> y >> p >> q;
    cout << y - p << endl;
    return 0;
}
```

## G. 纯种双生星人

$N$ 最多只有 12 位，枚举所有六位以内的数复制两份看看超不超过 $N$ 即可。当然二分答案也是可以的，但是数据太小了没必要。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL n;
    int res = 0;
    cin >> n;
    for (int i = 1; i < 1000000; ++i) {
        if (stoll(to_string(i) + to_string(i)) <= n) res++;
    }
    cout << res << endl;
    return 0;
}
```

## H. 绿皮肤的女巫

一个人要么被边界，要么不被卡。初始化一个非常大的上下界，然后分别按照要求模拟。统计全局的偏移量，检查每个人的初始值 + 偏移量，和下界取 max，和上界取 min 就是答案。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    LL l = -1000000000000000000, r = 1000000000000000000, s = 0;
    for (int i = 1; i <= n; ++i) {
        LL x, op;
        cin >> x >> op;
        if (op == 1) s += x, l += x, r += x;
        else if (op == 2) l = max(l, x), r = max(r, x);
        else l = min(l, x), r = min(r, x);
    }
    int q;
    cin >> q;
    for (int i = 1; i <= q; ++i) {
        LL x;
        cin >> x;
        cout << max(l, min(r, x + s)) << endl;
    }
    return 0;
}
```

## I. 我要打上海 major

应该有很多种大同小异的做法。我的做法是找一下多边形的中心（题目给的两个点的中点），然后找第一个点关于这个中心的极角，把极角加上一个外角的弧度找到目标点的方向，然后在这个方向上对角线长度的一般的长度找到目标点。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    double x0, y0, x1, y1, x2, y2;
    cin >> n >> x0 >> y0 >> x1 >> y1;
    double len = sqrt(pow(x0 - x1, 2) + pow(y0 - y1, 2));
    auto t = atan2(y0 - y1, x0 - x1) + acos(-1) * 2 / n;
    cout << fixed << (x0 + x1) / 2 + len / 2 * cos(t) << ' ' << fixed << (y0 + y1) / 2 + len / 2 * sin(t) << endl;
    return 0;
}
```

## J. 星空魔法跳跃

- 如果距离小于 R，那么需要两步（等腰三角形）
- 如果不小于 R，需要 $\lceil\frac{\text{距离}}{R}\rceil$ 步

我这里是为了防止精度出问题，二分了一下平方根。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

typedef long long LL;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL R, x, y;
    cin >> R >> x >> y;
    LL l = 0, r = 150000;
    while (l < r) {
        LL mid = l + r >> 1;
        if ((__int128_t)R * R * mid * mid >= x * x + y * y) r = mid; // 这个 int128 好像不用开
        else l = mid + 1;
    }
    if (l == 1 && x * x + y * y != R * R) l = 2;
    cout << l << endl;
    return 0;
}
```

## K. 奇幻赌场的命运骰子

Burnside 引理，一个集合在群 $G$ 的作用下，不同的方案数（等价类/轨道数）等于所有置换作用下不动点数量的平均值。

对于这道题就是在所有旋转角度下等价状态的个数的平均值就是答案，接下来就是大模拟了。要枚举正方体的 24 种不同的旋转角度，讨论每种角度下等价状态的个数。

~~非常的恶心，我就不写了~~


## L. 众口难调

所有 a 取 max，所有 b 取 min，得到的区间就是所有区间的交集，输出交集的长度即可（如果是负的直接输出 0）。

```cpp
#include <iostream>

using namespace std;

const int N = 1010;
int L[N], R[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    int l = 0, r = 0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        cin >> L[i];
    }
    for (int i = 1; i <= n; ++i) {
        cin >> R[i];
    }
    for (int i = 1; i <= n; ++i) {
        l = max(L[i], l), r = min(R[i], r);
    }
    cout << max(0, r - l + 1) << endl;
    return 0;
}
```

## M. 扑克大师

观察到操作 2 只会影响前一半和后一半整体的相对位置，不会改变内部的相对位置。打一个全局的标记表示前后一半是否处于交换状态，操作 1 根据标记映射到不同的位置然后交换，操作 2 只改标记即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, q, t = 0;
    string s;
    cin >> n >> s >> q;
    while (q--) {
        int op, a, b;
        cin >> op >> a >> b;
        if (op == 1) {
            if (t == 0) swap(s[a - 1], s[b - 1]);
            else {
                if (a <= n) a += n;
                else a -= n;
                if (b <= n) b += n;
                else b -= n;
                swap(s[a - 1], s[b - 1]);
            }
        }
        else {
            t ^= 1;
        }
    }
    if (t) {
        for (int i = 1; i <= n; ++i) cout << s[n + i - 1];
        for (int i = 1; i <= n; ++i) cout << s[i - 1];
    }
    else {
        for (int i = 1; i <= n; ++i) cout << s[i - 1];
        for (int i = 1; i <= n; ++i) cout << s[n + i - 1];
    }
    cout << endl;
    return 0;
}
```

## N. 游戏积分判定

按要求模拟即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int a, b, c;
    cin >> a >> b >> c;
    if (a == b) cout << c << endl;
    else if (a == c) cout << b << endl;
    else if (b == c) cout << a << endl;
    else cout << 0 << endl;
    return 0;
}
```