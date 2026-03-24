---
title: 2026寒假个人训练赛第三场
---
# 2026寒假个人训练赛第三场

前四道我没找到来源，后两道是 AtCoder 的 abc213c 和 abc229d。

## A. 编程试题

签到题，直接模拟就行。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, res = 0;
    cin >> n;
    while (n--) {
        int t = 0;
        for (int i = 0; i < 5; ++i) {
            int f;
            cin >> f;
            t += f;
        }
        if (t >= 3) res++;
    }
    cout << res << endl;
    return 0;
}
```

## B. 密码难题

一共只有 $10^4$ 种可能，直接暴力所有的情况。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int res = 0;
    cin >> s;
    for (int i = 0; i < 10000; ++i) {
        int a[] = {i % 10, i / 10 % 10, i / 100 % 10, i / 1000};
        bool f = true;
        for (int j = 0; j < 10; ++j) {
            if (s[j] == 'y' && a[0] != j && a[1] != j && a[2] != j && a[3] != j || s[j] == 'n' && (a[0] == j || a[1] == j || a[2] == j || a[3] == j)) {
                f = false;
                break;
            }
        }
        res += f;
    }
    cout << res << endl;
    return 0;
}
```

## C. 最少时间

问题等价于首先每个订单都必须生产，在这个前提下我们有 $k - 1$ 次机会删掉任意两次生产之间的间隔，贪心删最大的一定最优。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int res = 0;
    cin >> s;
    for (int i = 0; i < 10000; ++i) {
        int a[] = {i % 10, i / 10 % 10, i / 100 % 10, i / 1000};
        bool f = true;
        for (int j = 0; j < 10; ++j) {
            if (s[j] == 'y' && a[0] != j && a[1] != j && a[2] != j && a[3] != j || s[j] == 'n' && (a[0] == j || a[1] == j || a[2] == j || a[3] == j)) {
                f = false;
                break;
            }
        }
        res += f;
    }
    cout << res << endl;
    return 0;
}
```

## D. 最佳时段

考虑 dp，维护 $f_{i, j}$: 前 $i$ 个中选了 $j$ 段时的最大值，这道题的数据不太大可以 $O(n^2 k)$ 暴力更新，如果数据在开大一点就要考虑单调队列（栈）优化了。

我数组越界吃了 4 个罚时😇😇😇

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int res = 0;
    cin >> s;
    for (int i = 0; i < 10000; ++i) {
        int a[] = {i % 10, i / 10 % 10, i / 100 % 10, i / 1000};
        bool f = true;
        for (int j = 0; j < 10; ++j) {
            if (s[j] == 'y' && a[0] != j && a[1] != j && a[2] != j && a[3] != j || s[j] == 'n' && (a[0] == j || a[1] == j || a[2] == j || a[3] == j)) {
                f = false;
                break;
            }
        }
        res += f;
    }
    cout << res << endl;
    return 0;
}
```

## E. Reorder Cards

H 和 W 没有意义，只需要所有的横坐标离散化一下，所有的纵坐标离散化一下，然后输出。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

const int N = 100010;
int x[N], y[N];
vector<int> vx, vy;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int h, w, n;
    cin >> h >> w >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> x[i] >> y[i];
        vx.emplace_back(x[i]), vy.emplace_back(y[i]);
    }
    sort(vx.begin(), vx.end());
    vx.erase(unique(vx.begin(), vx.end()), vx.end());
    sort(vy.begin(), vy.end());
    vy.erase(unique(vy.begin(), vy.end()), vy.end());
    for (int i = 1; i <= n; ++i) {
        cout << lower_bound(vx.begin(), vx.end(), x[i]) - vx.begin() + 1 << ' ' << lower_bound(vy.begin(), vy.end(), y[i]) - vy.begin() + 1 << endl;
    }
    return 0;
}
```

## F. Longest X

问题等价于维护一个滑动窗口，需要保证窗口内的 `.` 的数量不多于 $k$，开个队列或者不开出来用双指针扫描都可以。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

const int N = 200010;
int q[N];
string s;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k;
    cin >> s >> k;
    n = s.length();
    s = " " + s;
    int hh = 0, tt = -1, t = 0, res = 0;
    for (int i = 1; i <= n; ++i) {
        q[++tt] = i;
        t += s[i] == '.';
        while (hh <= tt && t > k) t -= s[q[hh++]] == '.';
        res = max(res, tt - hh + 1);
    }
    cout << res << endl;
    return 0;
}
```


