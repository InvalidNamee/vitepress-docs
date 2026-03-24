---
title: 2025春训第十四场
---
# 2025春训第十四场

时隔好久，战斗爽终于复刻了😋，拿个榜一真不容易。

## A. Christmas Tree Adapter

终于有签到题了。

```cpp
#include <iostream>

using namespace std;

int main() { 
    int a, w, v;
    cin >> a >> w >> v;
    if (a * v <= w) cout << 1 << endl;
    else cout << 0 << endl;
    return 0;
}
```

## B. **Cool Phone Numbers**

而且签到题还不止一道。

```cpp
#include <iostream>
#include <set>

using namespace std;

set<char> st;

int main() {
    string s;
    cin >> s;
    for (char c : s) {
        if (isdigit(c)) st.insert(c);
    }
    cout << st.size() << endl;
    return 0;
}
```

## C. **Ready for Contest**

竟然有四道。

```cpp
#include <iostream>

using namespace std;

bool a[100010][4];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        a[x][y] = true;
    }
    for (int i = 1; i <= n; ++i) {
        if (a[i][1] & a[i][2]) printf("%d\n", i);
    }
    return 0;
}
```

## D. **Fixing the Tournament**

尽可能把排名低的两两组队，最后如果会输，还需要加上输的那一场。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int n, r;
    cin >> n >> r;
    cout << min((int)floor(log2((1 << n) - r + 1)) + 1, n) << endl;
    return 0;
}
```

## **E. Identical Letters**

比较经典的滑动窗口问题，枚举 26 个字母，遍历数组双指针维护到每一个位置时当前字母能构成的最长连续序列的长度，全部取 max 即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n, m;
    cin >> s >> m;
    n = s.length();
    s = ' ' + s;
    int res = 0;
    for (char c = 'a'; c <= 'z'; ++c) {
        for (int i = 1, j = 1, del = 0; i <= n; ++i) {
            if (s[i] != c) del++;
            while (j <= i && del > m) if (s[j++] != c) del--;
            res = max(res, i - j + 1 - del);
        }
    }
    cout << res << endl;
    return 0;
}
```

## **F. Espresso Made Your Way**

我没有调红温，绝对没有🤮🤮🤮，那个 +13 的绝对不是我😭

设原来一杯的权重为 1，那么第一杯加进来的权重也是 1，再加第二杯的时候，因为前面已经浪费了一杯了，已有的这两杯的混合物变成一杯了，所以可以认为第二杯和前面两杯的量合起来是等价的，权重为 2，同理后面的权重是 4, 8, 16, 32……

所以最后调出来的东西☕️（🥛）占的比例肯定是

$$
\frac{1}{2^n}(k_0 + \sum_{i = 0}^{n - 1}k_{i + 1} 2^i)
$$

其中 n 为浪费的杯数，k 为 0 或 1. 其实求和符号里的就是一个整数的二进制表示，所以整个式子其实等价于 $\frac{k}{2^n}, k \in [0, 2^n] \cap \mathbb{Z}$。然后就好说了，枚举 k 验证能不能成立就行。**需要注意枚举的范围，应该枚举到** $\log_2{10^{12}}$**！！！**

```cpp
#include <iostream>
#include <cmath>

using namespace std;

long long c1, m1, c2, m2;

int main() {
    cin >> c1 >> m1 >> c2 >> m2;
    if (c1 * m2 > c2 * m1) swap(c1, c2), swap(m1, m2);
    if (c1 == 0 || c2 == 0 || m1 == 0 || m2 == 0) cout << 0 << endl;
    else {
        m1 += c1, m2 += c2;
        int i = 0;
        while (true) {
            __int128_t l = 0, r = (1ll << i);
            bool f = false;
            while (l <= r) {
                __int128_t mid = (l + r) >> 1;
                if (mid * m2 > (__int128_t)c2 * (1ll << i)) r = mid - 1;
                else if (mid * m1 < (__int128_t)c1 * (1ll << i)) l = mid + 1;
                else {
                    f = true;
                    break;
                }
            }
            if (f) {
                cout << i << endl;
                return 0;
            }
            i++;
        }
    }
    return 0;
}
```

这是正着试的办法，还可以反着尝试，更 easy 一些，不需要二分尝试，把 C 和 M 不断除以 2，直到最后一个不相等的位置。

## **G. Speed Ups**

相对比较好做，线性 dp 维护到每一个加速的位置的最短时间（这里指的是可以踩到这个加速的情况，不包括上一个加速没用完路过这里的情况），然后枚举起点和所有加速的位置，算走到终点的时长取 min.

```cpp
#include <iostream>
#include <algorithm>
#include <iomanip>
#define int long long

using namespace std;

struct Node {
    int x, m, d;
} a[1010];
int f[1010];

signed main() {
    int n, l;
    scanf("%lld%lld", &n, &l);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld%lld%lld", &a[i].x, &a[i].m, &a[i].d);
    }
    sort(a + 1, a + n + 1, [](Node a, Node b) {
        return a.x < b.x;
    });
    for (int i = 1; i <= n; ++i) {
        f[i] = 0x3f3f3f3f;
        for (int j = 0; j < i; ++j) {
            if ((long long)a[j].m * a[j].d <= (a[i].x - a[j].x)) {
                f[i] = min(f[i], f[j] + a[j].d + (a[i].x - a[j].x - a[j].m * a[j].d));
            }
        }
    }
    double res = 1e18;
    for (int i = 0; i <= n; ++i) {
        if ((long long)a[i].x + (long long)a[i].m * a[i].d <= l) res = min(res, (double)(f[i] + a[i].d + (l - a[i].m * a[i].d - a[i].x)));
        else res = min(res, (double)(f[i]) + (double)(l - a[i].x) / a[i].m);
    }
    printf("%lf\n", res);
    return 0;
}
```

## **H. Magnetic Attractions**

众所周知，根据高中物理知识，这个区域是一个圆形区域，以 s 为原点， $\vec{sS}$ 方向为 x 轴，垂直的方向为 y 轴重新建一个坐标系，记 S 的新的坐标为 (d, 0).

$$
\frac{s}{x^2 + y^2} = \frac{S}{(x - d)^2 + y^2}
$$

整理可得

$$
(x - \frac{s}{s - S})^2 + y^2 = \frac{sd - sd^2}{s - S}
$$

$$
r^2 = \frac{sd - sd^2}{s - S}
$$

直接套圆的面积公式就能算出来

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    double s1, x1, y1, s2, x2, y2;
    cin >> s1 >> x1 >> y1 >> s2 >> x2 >> y2;
    double d = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    double r2 = pow(s1 * d / (s2 - s1), 2) - s1 * d * d / (s1 - s2), pi = acos(-1);
    printf("%lf\n", pi * r2);
    return 0;
}
```

## **I. Hotel Rooms**

单点修改，区间查询，线段树或者树状数组都可以，个人感觉树状数组好写一点，于是就写的树状数组，也是一遍秒了。

```cpp
#include <iostream>

using namespace std;

int n, m;
int tr[500010];
bool f[500010];
void add(int u, int val) {
    for (; u <= n; u += u & -u) {
        tr[u] += val;
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
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        add(i, 1);
    }
    for (int i = 1; i <= m; ++i) {
        char s[2];
        scanf("%s", s);
        if (s[0] == 'A') {
            int l, r;
            scanf("%d%d", &l, &r);
            printf("%d\n", query(r) - query(l - 1));
        }
        else {
            int x;
            scanf("%d", &x);
            if (!f[x]) f[x] = true, add(x, -1);
        }
    }
    return 0;
}
```