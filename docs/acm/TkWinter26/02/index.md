---
title: 2026寒假个人训练赛第二场
---
# 2026寒假个人训练赛第二场

罚时吃麻了，而且错误都特别蠢，可能是没睡醒吧……

前面四道是 CSP-X 2025 河南，后面两道是从 CSP-J 2025 里面选的。

## A. 投票

签到题，排序，优先队列，set 应该都可以。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 110;
priority_queue<int> q;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int t;
        cin >> t;
        q.emplace(t);
    }
    int mx = q.top();
    while (!q.empty() && q.top() == mx) q.pop();
    if (q.empty()) cout << "No" << endl;
    else cout << q.top() << endl;
    return 0;
}
```

## B. 接网线

按要求模拟即可。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 1010;
int s[8], res[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string a, b;
    cin >> a >> b;
    for (int i = 0; i < a.length(); ++i) {
        for (int j = 0; j < b.length(); ++j) {
            if (a[i] == b[j]) {
                s[i] = j;
                break;
            }
        }
    }
    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        int t;
        cin >> t;
        res[i / 8 * 8 + s[i % 8]] = t;
    }
    for (int i = 0; i < n; ++i) cout << res[i] << ' ';
    cout << endl;
    return 0;
}
```

## C. 简单排序题

也是按要求统计，然后 sort 即可。

```cpp
#include <iostream>
#include <algorithm>
#include <map>

using namespace std;

const int N = 500010;
struct Node {
    int val, idx, t;
} a[N];
map<int, int> mp;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i].val, a[i].idx = i, a[i].t = 0, mp[a[i].val]++;
    for (int i = 1; i <= n; ++i) a[i].t = mp[a[i].val];
    sort(a + 1, a + n + 1, [](Node a, Node b) {
        return a.t == b.t ? a.idx < b.idx : a.t > b.t;
    });
    for (int i = 1; i <= n; ++i) cout << a[i].val << ' ';
    cout << endl;
    return 0;
}
```

## D. 我要飞得更高

需要注意题面说的是

> 前进次数不同或前进次数相同但是存在某一步前进距离不同，则认为两个方案不同。

所以相同步长但是不同火箭算为一个方案，把火箭做一个区间合并，合并完之后用新的做 DP 即可。记合并完了之后火箭数量为 $k$

$$
f_i = \sum_{j = 0}^{k}\sum_{w = \max\left\{0, i - L_j\right\}}^{\max\left\{-1, i - R_j\right\}}{f_w}
$$

做一个前缀和优化内部循环即可。

```cpp
#include <iostream>
#include <algorithm>
#include <map>

using namespace std;
typedef long long LL;
const int N = 100010, M = 210, MOD = 998244353;
LL s[N], f[N];
pair<int, int> a[M], b[M];
int n, m, k;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) cin >> a[i].first >> a[i].second;
    sort(a + 1, a + m + 1);
    for (int i = 1; i <= m; ++i) {
        if (!k) b[++k] = a[i];
        else {
            if (a[i].first <= b[k].second + 1) b[k].second = max(b[k].second, a[i].second);
            else b[++k] = a[i];
        }
    }
    f[0] = s[0] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= k; ++j) {
            auto &[L, R] = b[j];
            if (i - L >= 0) {
                f[i] = f[i] + s[i - L] % MOD;
                if (i - R > 0) f[i] = (f[i] - s[i - R - 1] + MOD) % MOD;
            }
        }
        s[i] = (s[i - 1] + f[i]) % MOD;
    }
    cout << f[n] << endl;
    return 0;
}
```

## E. 拼数

[洛谷](https://www.luogu.com.cn/problem/P14357)

直接把数字取出来排序就行。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    vector<int> v;
    cin >> s;
    for (char c : s) if (isdigit(c)) v.emplace_back(c - '0');
    sort(v.begin(), v.end(), greater<int>());
    for (int i : v) cout << i;
    cout << endl;
    return 0;
}
```

## F. 座位

[洛谷](https://www.luogu.com.cn/problem/P14358)

好像没什么可说的，需要注意先输出列号，再输出行号，我输出反了怀疑自己改错了吃了一发发罚时……

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
const int N = 110;
int a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, k;
    cin >> n >> m;
    for (int i = 1; i <= n * m; ++i) cin >> a[i];
    k = a[1];
    sort(a + 1, a + n * m + 1, greater<int>());
    for (int i = 1; i <= n * m; ++i) {
        if (a[i] == k) {
            k = i;
            break;
        }
    }
    int x = (k + n - 1) / n, y = (x & 1) ? k - (x - 1) * n : n - (k - (x - 1) * n) + 1;
    cout << x << ' ' << y << endl;
    return 0;
}
```