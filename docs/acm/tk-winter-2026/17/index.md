---
title: 2026寒假个人训练赛第十七场
---
# 2026寒假个人训练赛第十七场

## A. 珂朵莉与数字

可以二分答案，但是小心爆 long long，我就这么 wa 的……

```cpp
#include <iostream>

using namespace std;

typedef long long LL;

LL n, p;

LL check(LL mid) {
    __int128_t res = 1;
    for (int i = 0; i < p; ++i) {
        res *= mid;
        if (res > n) return false;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T; 
    while (T--) {
        cin >> n >> p;
        LL l = 0, r = n;
        while (l < r) {
            LL mid = l + r + 1 >> 1;
            if (check(mid)) l = mid;
            else r = mid - 1;
        }
        cout << l << endl;
    }
    return 0;
}
```

## B. 珂朵莉与序列

排个序，这样就可以把前面的和后面的拆开去绝对值，然后维护一个前缀和和后缀和即可 $O(1)$ 得出一个位置的答案。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 100010;
pair<LL, LL> a[N];
LL pre[N], suf[N], res[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i].first, a[i].second = i;
    sort(a + 1, a + n + 1);
    for (int i = n; i; --i) suf[i] = suf[i + 1] + a[i].first;
    for (int i = 1; i <= n; ++i) {
        pre[i] = pre[i - 1] + a[i].first;
        res[a[i].second] = a[i].first * i - pre[i] + suf[i] - a[i].first * (n - i + 1);
    }
    for (int i = 1; i <= n; ++i) cout << res[i] << ' ';
    cout << endl;
    return 0;
}
```

## C. 珂朵莉与字符串

线性 DP，维护 $f_{i, j}$ 表示 S 的前 i 位配对了 `chtholly` 中的前 j 个的方案数，根据当前位的 $S_i$ 考虑状态转移。很可恶的一点是这个题会爆 long long，所以我用 Python 重写了一遍成功过了。

```python
s = input()
n = len(s)
f = [[1, 0, 0, 0, 0, 0, 0, 0, 0]]
for i in range(1, n + 1):
    c = s[i - 1]
    f.append(f[-1].copy())
    if c == 'c':
        f[i][1] += f[i - 1][0]
    elif c == 'h':
        f[i][2] += f[i - 1][1]
        f[i][4] += f[i - 1][3]
    elif c == 't':
        f[i][3] += f[i - 1][2]
    elif c == 'o':
        f[i][5] += f[i - 1][4]
    elif c == 'l':
        f[i][6] += f[i - 1][5]
        f[i][7] += f[i - 1][6]
    elif c == 'y':
        f[i][8] += f[i - 1][7]
print(f[n][8])
```


## D. 珂朵莉与面积

数学题，直接用公式算就行了，方法应该不唯一。就是两个三角形 + 扇形的面积做差或者求和。我这里三角形面积就用了 $\frac{\text{底} \times \text{高}}{2}$，扇形用了 $\frac{1}{2}\alpha r^2$.

```cpp
#include <iostream>
#include <cmath>
#include <iomanip>
#define PI 3.141592653589793

using namespace std;

double work(double a) {
    double t = acos(a);
    if (t > PI / 2) t = PI - t;
    return PI / 2 - t + fabs(sin(t) * cos(t));
}

int sign(double n) {
    if (fabs(n) < 1e-7) return 0;
    else if (n > 0) return 1;
    else return -1;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    double l, r;
    cin >> l >> r;
    cout << fixed << setprecision(3) << fabs(work(l) * sign(l) - work(r) * sign(r)) << endl;
    return 0;
}
```

## E. 最大数

直接线段树即可，或者用无旋 Treap 也可以做。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;
LL tr[N * 4], D;
int n;

void pushup(int u) {
    tr[u] = max(tr[u << 1], tr[u << 1 | 1]);
}

void modify(int u, int l, int r, int p, LL v) {
    if (l == r) tr[u] += v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        pushup(u);
    }
}

LL query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        LL res = 0;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> D;
    LL t = 0;
    int m = 0;
    for (int i = 1; i <= n; ++i) {
        char op;
        LL val;
        cin >> op >> val;
        if (op == 'A') {
            modify(1, 1, n, ++m, (val + t) % D);
        }
        else {
            cout << (t = query(1, 1, n, m - val + 1, m)) << endl;
        }
    }
    return 0;
}
```

## F. Cable master

又是一道经典的模板题。答案满足单调性，二分答案即可。

```cpp
#include <iostream>
#include <algorithm>
#include <iomanip>

using namespace std;

typedef long long LL;
const int N = 10010;
LL a[N];
int n, k;

LL get() {
    static string s;
    cin >> s;
    int idx = s.find('.');
    if (idx == EOF) return stoi(s);
    else return stoi(s.substr(0, idx) + s.substr(idx + 1));
}

bool check(int mid) {
    LL cnt = 0;
    for (int i = 1; i <= n; ++i) cnt += a[i] / mid;
    return cnt >= k;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) {
        a[i] = get();
    }
    int l = 0, r = 10000000;
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    cout << l / 100 << '.' << setw(2) << setfill('0') << l % 100 << endl;
    return 0;
}
```

## G. Splitting the Field【Normal】

考虑到分出的两块不可能重叠，那么直接分别按一个维度排序，枚举分割点对所有可能的答案取 min 即可，排序后预处理前缀、后缀的 max 和 min 即可 $O(n)$ 枚举答案。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 50010;
pair<LL, LL> a[N];
LL pre_mx[N], pre_mn[N], suf_mx[N], suf_mn[N];
LL res;
int n;

void work() {
    sort(a + 1, a + n + 1);
    pre_mn[0] = suf_mn[n + 1] = 1000000001;
    for (int i = 1; i <= n; ++i) {
        pre_mx[i] = max(pre_mx[i - 1], a[i].second);
        pre_mn[i] = min(pre_mn[i - 1], a[i].second);
    }
    for (int i = n; i; --i) {
        suf_mx[i] = max(suf_mx[i + 1], a[i].second);
        suf_mn[i] = min(suf_mn[i + 1], a[i].second);
    }
    for (int i = 2; i <= n; ++i) {
        if (a[i - 1].first != a[i].first) {
            res = min(res, (pre_mx[i - 1] - pre_mn[i - 1]) * (a[i - 1].first - a[1].first) + (suf_mx[i] - suf_mn[i]) * (a[n].first - a[i].first));
        }
    }
}


int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n;
    LL mnx = 1000000001, mny = 1000000001, mxx = 0, mxy = 0;
    for (int i = 1; i <= n; ++i) {
        auto &[x, y] = a[i];
        cin >> x >> y;
        mnx = min(mnx, x), mny = min(mny, y);
        mxx = max(mxx, x), mxy = max(mxy, y);
    }
    res = (mxx - mnx) * (mxy - mny);
    work();
    for (int i = 1; i <= n; ++i) {
        swap(a[i].first, a[i].second);
    }
    work();
    cout << (mxx - mnx) * (mxy - mny) - res << endl;
    return 0;
}
```

## H. Dishwashing

考虑到如果一个前缀已经不合法了，往后加元素一定也不可能合法，所以答案具有单调性。另外检查一段前缀是否合法很好写，所以可以考虑二分答案。

想要检查一个前缀是否合法，只需要模拟一遍他的流程。Bessie 放出的所有栈从栈顶到栈底一定单调递增，从左到右的所有栈中的元素一定单调递增，否则 Elsie 不可能取出一个有序的序列。拿到一个新的盘子时，检查能不能直接被取走，如果不能就二分到第一个比他大的栈放到栈顶即可。每次放完都贪心的让 Elsie 尝试取。最后如果取完了就是可行，否则不可行。

```cpp
#include <iostream>
#include <stack>
#include <algorithm>

using namespace std;

const int N = 100010;
int a[N], b[N], n;
stack<int> q[N];

bool check(int m) {
    int j = 1, k = 1, len = 0;
    for (int i = 1; i <= m; ++i) b[i] = a[i];
    sort(b + 1, b + m + 1);
    for (int i = 1; i <= m && j <= m; ++i) {
        if (a[i] == b[j]) j++;
        else {
            int l = k, r = len + 1;
            while (l < r) {
                int mid = l + r >> 1;
                if (q[mid].top() > a[i]) r = mid;
                else l = mid + 1;
            }
            if (l == len + 1) q[++len].emplace(a[i]);
            else q[l].emplace(a[i]);
        }
        while (j <= m && k <= len && b[j] == q[k].top()) {
            q[k].pop();
            j++;
            if (q[k].empty()) k++;
        }
    }
    for (int i = 1; i <= m; ++i) while (!q[i].empty()) q[i].pop();
    return j == m + 1;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int l = 1, r = n;
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    cout << l << endl;
    return 0;
}
```