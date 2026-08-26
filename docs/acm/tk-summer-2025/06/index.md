---
title: 2025夏季个人训练赛第六场
---
# 2025夏季个人训练赛第六场

## A. 入围判断

签到题

```cpp
#include <iostream>

using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a >= b ? "YES" : "NO") << endl;
    return 0;
}
```

## B. 区间筛数

签到题 * 2

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>

using namespace std;

bool prime(int x) {
    if (x <= 1) return false;
    int l = sqrt(x);
    for (int i = 2; i <= l; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}

bool hui(int x) {
    string s = to_string(x);
    string t = s;
    reverse(t.begin(), t.end());
    return s == t;
}

int main() {
    int l, r;
    scanf("%d%d", &l, &r);
    for (int i = l; i <= r; ++i) {
        if (prime(i) && hui(i)) {
            printf("%d\n", i);
        }
    }
    return 0;
}
```

## C. 排版

签到题 * 3

```cpp
#include <iostream>
#include <sstream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, k, cur = 0;
    string s;
    cin >> n >> k;
    for (int i = 0; i < n; ++i) {
        cin >> s;
        if (cur + s.length() > k) {
            cout << endl << s;
            cur = s.length();
        }
        else {
            if (cur != 0) cout << ' ';
            cur += s.length();
            cout << s;
        }
    }
    cout << endl;
    return 0;
}
```

## D. 编程很重要

开一个状态 $f_i$ 表示 m = i 时的答案，枚举所有 $j,\ j^4 \le i$ 转移状态即可，时间复杂度是 $\Theta(n\sqrt[4]{n})$。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100010;

int f[N];

int main() {
    memset(f, 0x3f, sizeof(f));
    int n;
    scanf("%d", &n);
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; (long long)j * j * j * j <= i; ++j) {
            f[i] = min(f[i], f[i - j * j * j * j] + 1);
        }       
    }
    printf("%d\n", f[n]);
    return 0;
}
```

## F. 炮塔

字符串模拟，比较阴间。

- 遇到干扰器在不死的前提下先取了再说；
- 连续三个炮塔必死 `###`；
- 通过两个连续的炮塔 `##` 一定会留一个干扰器；
- 手上有 1 个干扰器，只能回头穿过一个炮塔取前面的干扰器，这种折返的收益只可能是 0 或 1，如 `.*##*.#..*` 可以取到后两个；
- 手上有 2 个及以上干扰器，可以随意穿过前面的单个炮塔取干扰器，先前遇到连续的炮塔时放的那一个不能取回。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    for (int t = 1; t <= T; ++t) {
        string s;
        cin >> s;
        int cur = 0, pre = 0, res = 0; // 当前干扰器个数，如果当前手上有 ≥ 2 个干扰器折返一次后的个数，任何一个时刻手上的最多干扰器个数
        bool f = false; // 判断前一个炮塔是否欠着干扰器
        for (int i = 0; i < s.length(); ++i) {
            if (s[i] == '*') {
                cur++, pre++;
                if (cur > 1) cur = pre;
                else if (cur && f) f = false, cur++;
            }
            else if (s[i] == '#') {
                if (i + 1 >= s.length() || s[i + 1] != '*') {
                    if (s[i - 1] != '#' && cur) cur--, f = true;
                    else break; // 必死
                }
                else f = false;
                if (s[i - 1] == '#') pre--, f = false;
            }
            else if (cur > 1) cur = pre;
            else if (cur && f) f = false, cur++;
            res = max(res, cur);
        }
        cout << res << endl;
    }
    return 0;
}
```