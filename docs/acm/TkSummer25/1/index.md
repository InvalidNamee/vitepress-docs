---
title: 2025夏季个人训练赛第一场
---
# 2025夏季个人训练赛第一场

第一天前面的英文题还是比较简单的，但是后面的中文题一个不会😭

## A. Roller Coaster Ride

签到题

```cpp
#include <iostream>

using namespace std;

int main() {
    int n, c, p;
    cin >> n >> c >> p;
    if (n <= c * p) cout << "yes" << endl;
    else cout << "no" << endl;
    return 0;
}
```
## B. Donut Shop

跟着题目要求模拟就可以了。

```cpp
#include <iostream>

using namespace std;

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    while (m--) {
        char s[2];
        int q;
        scanf("%s%d", s, &q);
        n += (s[0] == '+' ? 1 : -1) * q;
    }
    printf("%d\n", n);
    return 0;
}
```

## C. Product Codes

刚开始数据混乱，但是后来修好重判了。

字符串模拟题，利用类似快读的思想读数字求和，其他字符遇到大写字母就输出大写字母即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        string s;
        long long f = 1, res = 0, val = 0;
        cin >> s;
        for (char c : s) {
            if (isdigit(c)) res = res * 10 + c - 48;
            else {
                val += res * f;
                // cout << res * f << ' ' ;
                res = 0;
                f = 1;
                if (c == '-') f = -1;
                else if (isupper(c)) cout << c;
            }
        }
        val += res * f;
        cout << val << endl;
        if (val == -3000) {
            cout << s << endl;
            return 0;
        }
    }
    return 0;
}
```

## D. Sunny Days

类似滑动窗口的思想，一个滑动窗口里面不能有两个 P，如果右边进来一个 P，就不断向右挪左端点直到队列里面只有一个 P，对于每个右端点对应的滑动窗口长度取 max 即可。

需要**注意**：n = 1，只有一个 S 的时候需要特判，我就被坑了。

```cpp
#include <iostream>

using namespace std;

const int N = 500010;
int f[N];

int main() {
    int n, res = 0, l = 1, pre = 0;
    bool flag = false;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        char s[2];
        scanf("%s", s);
        f[i] = s[0] == 'S';
        if (!f[i]) {
            if (!flag) {
                flag = true;
            }
            else {
                while (f[l++]);
            }
        }
        res = max(res, i - l + 1);
    }
    printf("%d\n", res - !(flag));
    return 0;
}
```

## E. Connecting Territories

本质上其实就是一个简单的二维 dp
$$
f_{i, j} = \min\{f_{i - 1, j - 1}, f_{i - 1, j}, f_{i - 1, j + 1}\} + M_{i, j}
$$
这么开会爆空间，所以开一个滚动数组优化一下即可。

```cpp
#include <iostream>

using namespace std;

const int N = 20010;

int f[N][2];

int main() {
    int n, m, p;
    int res = 0x3f3f3f3f;
    scanf("%d%d%d", &n, &m, &p);
    f[0][0] = f[0][1] = f[m + 1][0] = f[m + 1][1] = 0x3f3f3f3f;
    int t = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            bool tt = i & 1;
            f[j][tt] = t + 1 + min(min(f[j - 1][tt ^ 1], f[j][tt ^ 1]), f[j + 1][tt ^ 1]);
            t = (t + 1) % p;
        }
    }
    for (int j = 1; j <= m; ++j) {
        res = min(res, f[j][n & 1]);
    }
    printf("%d\n", res);
    return 0;
}
```

## F. 情景剧

> 感谢 liuxx 佬的支持

可以枚举当每个位置作为最小值时有趣长度的最大值，固定了最小值之后，区间长度变长一定是正提升。

- 最长区间长度: 可以用**单调栈**维护，开一个单调递增的单调栈，入栈后他压住的是左侧比他小的第一个位置，顶出去他的是右侧比他小的第一个位置。
- 区间最大值: 可以用**线段树**或者**st表**维护，个人感觉线段树不容易挂所以用了线段树。

```cpp
#include <iostream>

using namespace std;

const int N = 2000010;

int a[N], l[N], tr[N * 4], st[N], tp;

void build(int u, int l, int r) {
    if (l == r) tr[u] = a[l];
    else {
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1, r);
        tr[u] = max(tr[u << 1], tr[u << 1 | 1]);
    }
}

int query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

void print(__int128_t n) {
    if (n) {
        print(n / 10);
        printf("%d", n % 10);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    __int128_t res = 0;
    build(1, 1, n);
    for (int i = 1; i <= n; ++i) {
        while (tp && a[i] <= a[st[tp]]) {
            res = max(res, (__int128_t)(i - 1 - l[st[tp]]) * a[st[tp]] * query(1, 1, n, l[st[tp]] + 1, i - 1));
            tp--;
        }
        l[i] = st[tp];
        st[++tp] = i;
    }
    while (tp) {
        res = max(res, (__int128_t)(n - l[st[tp]]) * a[st[tp]] * query(1, 1, n, l[st[tp]] + 1, n));
        tp--;
    }
    print(res);
    printf("\n");
    return 0;
}
```