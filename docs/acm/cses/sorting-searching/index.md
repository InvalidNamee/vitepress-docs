---
title: CSES Sorting and Searching
---
# CSES Sorting and Searching

这些是寒假集训新做的题，之前做过的不会再专门写一遍题解了，如果需要代码可以看[仓库](https://github.com/InvalidNamee/OJ-AC-Repository-for-UPC/tree/main/AC_code/CSES%E7%B3%BB%E5%88%97/3834_Sorting_and_Searching)。

## Distinct Values Subarrays

很经典的滑动窗口问题，我们只需要维护以每一个位置为结尾往左延伸的最长长度，这个滑动窗口随着右端点的右移左端点一定不会左移。做法是记录一个左端点 $j$ 初始化成 1，右端点 $i$ 从 $1$ 到 $n$ 枚举，每次往右走时，$j = \max\left\{j, x_i\text{上次出现的位置} + 1\right\}$，区间长度相加就是答案。

```cpp
#include <iostream>
#include <map>

using namespace std;

map<int, int> mp;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    long long res = 0;
    cin >> n;
    for (int i = 1, j = 1; i <= n; ++i) {
        int t;
        cin >> t;
        j = max(j, mp[t] + 1);
        mp[t] = i;
        res += i - j + 1;
    }
    cout << res << endl;
    return 0;
}
```

## Distinct Values Subsequences

每个数只能出现一次或者不出现，统计一下每个数出现的个数，然后`+1`累乘就是答案。

```cpp
#include <iostream>
#include <map>

using namespace std;
const int MOD = 1000000007, N = 200010;
typedef long long LL;
map<int, int> mp;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, tot = 1;
    LL res = 1;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int t;
        cin >> t;
        mp[t]++;
    }
    for (auto [k, v] : mp) res = (res * (v + 1)) % MOD;
    cout << (res - 1 + MOD) % MOD << endl;
    return 0;
}
```