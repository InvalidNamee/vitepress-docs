---
title: 2025夏季个人训练赛第十五场
---
# 2025夏季个人训练赛第十五场

## A: NPSC, Again

```cpp
#include <iostream>
#include <map>

using namespace std;

int main() {
    string s;
    int n;
    cin >> s >> n;
    n = n == 1 ? 0 : 7;
    if (s == "Monday") {
        cout << 6 + n << endl;
    }
    else if (s == "Tuesday") {
        cout << 5 + n << endl;
    }
    else if (s == "Wednesday") {
        cout << 4 + n << endl;
    }
    else if (s == "Thursday") {
        cout << 3 + n << endl;
    }
    else if (s == "Friday") {
        cout << 2 + n << endl;
    }
    else if (s == "Saturday") {
        cout << 1 + n << endl;
    }
    else if (s == "Sunday") {
        cout << 7 + n << endl;
    }
    return 0;
}
```

## C. 最大公因子

首先这个最大公因子一定是 n 的因数，其次 n 要能拆成这么 k 个数，要满足 $\frac{n}{k} \ge k$，直接枚举因子，找最大的。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int T;
    cin >> T;
    while (T--) {
        long long n, k, l, res = 0;
        cin >> n >> k;
        l = sqrt(n);
        for (int i = 1; i <= l; ++i) {
            if (n % i == 0) {
                if (i >= k) res = max(res, n / i);
                else if (n / i >= k) res = max(res, (long long)i);
            }
        }
        cout << res << endl;
    }
    return 0;
}
```

## D. 方阵, Again^2

维护二维前缀和枚举所有位置依次验证。

```cpp
#include <iostream>

using namespace std;

const int N = 2010;

long long s[N][N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            scanf("%lld", &s[i][j]);
            s[i][j] += s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1];
        }
    }
    int res = 0;
    for (int i = 2; i < n; ++i) {
        for (int j = 2; j < n; ++j) {
            if (s[i - 1][n] == s[n][n] - s[i][n] && s[n][j - 1] == s[n][n] - s[n][j]) {
                res++;
            }
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## F. 猫咪派对买早餐

线性 dp，但是需要注意卡边界情况

- $f_{i, 0}$ 表示没有改变品种的前提下以第 i 只猫结尾的相同品种的猫的数量，如果用这个状态更新答案，可以贪心的选择随意把旁边一只猫改变品种（前提是旁边得有一只猫）
- $f_{i, 1}$ 表示已经改变品种的前提下以第 i 只猫结尾的相同品种的猫的数量，可以直接更新答案。

答案是

$$
\min \{n, \max_{i = 1}^{n} \max\{f_{i, 0} + 1, f_{i, 1}\}\}
$$

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;
int a[N], f[N][2];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    int res = 1;
    f[1][0] = 1;
    for (int i = 2; i <= n; ++i) {
        if (a[i] == a[i - 1]) f[i][0] = f[i - 1][0] + 1, f[i][1] = f[i - 1][1] + 1;
        else f[i][0] = 1;
        if (i == 2) f[i][1] = 2;
        else if (a[i] == a[i - 2]) f[i][1] = max(f[i][1], f[i - 2][0] + 2);
        res = max(res, max(f[i][0] + 1, f[i][1]));
    }
    printf("%d\n", min(res, n));
    return 0;
}
```