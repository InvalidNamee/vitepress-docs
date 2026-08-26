---
title: 2025夏季个人训练赛第三场
---
# 2025夏季个人训练赛第三场

## A. 扫雷I

按要求模拟就行，需要注意点不是 0 的格子视为无效操作。

```cpp
#include <iostream>

using namespace std;

const int N = 60;
int a[N][N];

int main() {
    int n, cnt = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            scanf("%d", &a[i][j]);
            cnt += a[i][j];
        }
    }
    int x, y;
    while (scanf("%d%d", &x, &y), x) {
        if (a[x][y] == 1) {
            printf("GAME OVER!\n");
            return 0;
        }
        else if (a[x][y]) continue;
        for (int i = x - 1; i <= x + 1; ++i) {
            for (int j = y - 1; j <= y + 1; ++j) {
                if (a[i][j] == 0) a[i][j] = -1;
                else if (a[i][j] == 1) cnt--, a[i][j] = -2;
            }
        }
        if (!cnt) {
            printf("YOU ARE WINNER!\n");
            return 0;
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            printf("%d ", a[i][j]);
        }
        printf("\n");
    }
    return 0;
}
```
## B. 无根树

如果数据大的话需要换根 dp，对每个点需要维护子树高度的最大值和次大值，换根时如果换到了最大值的那条链就用次大值，否则用最大值。

他数据范围很小，所以直接暴力以每个点为根 dp 一遍就可以了。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;

const int N = 1010;
vector<int> ed[N];
int f[N];

void dp(int x, int fa) {
    for (int y : ed[x]) {
        if (y == fa) continue;
        f[y] = f[x] + 1;
        dp(y, x);
    }
    for (int y : ed[x]) {
        if (y == fa) continue;
        f[x] = max(f[x], f[y]);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].push_back(y);
        ed[y].push_back(x);
    }
    for (int i = 1; i <= n; ++i) {
        // 数据太小直接暴力
        f[i] = 1;
        dp(i, 0);
        printf("%d\n", f[i]);
    }
    return 0;
}
```

## C. 积木

$n \le 10^9$ 所以 $\sqrt[3]{n} \le 10^3$，直接暴力枚举因式就可以。

~~为什么我当时还在拉格朗日乘数法求条件极值😭~~

```cpp
#include <iostream>
#include <climits>
using namespace std;
typedef long long LL;

int main() {
    LL n;
    cin >> n;
    LL minv = LLONG_MAX, maxv = LLONG_MIN;
    for (LL x = 1; x * x * x <= n; ++x) {
        if (n % x != 0) continue;
        LL yz = n / x;
        for (LL y = 1; y * y <= yz; ++y) {
            if (yz % y != 0) continue;
            LL z = yz / y;
            LL A1 = x + 1, B1 = y + 2, C1 = z + 2;
            LL A2 = x + 1, B2 = z + 2, C2 = y + 2;
            LL A3 = y + 1, B3 = x + 2, C3 = z + 2;
            LL A4 = y + 1, B4 = z + 2, C4 = x + 2;
            LL A5 = z + 1, B5 = x + 2, C5 = y + 2;
            LL A6 = z + 1, B6 = y + 2, C6 = x + 2;
            LL vals[6] = {
                A1 * B1 * C1 - n,
                A2 * B2 * C2 - n,
                A3 * B3 * C3 - n,
                A4 * B4 * C4 - n,
                A5 * B5 * C5 - n,
                A6 * B6 * C6 - n
            };
            for (int i = 0; i < 6; ++i) {
                if (vals[i] < minv) minv = vals[i];
                if (vals[i] > maxv) maxv = vals[i];
            }
        }
    }
    cout << minv << ' ' << maxv << endl;
    return 0;
}
```

## D. 幸运数III

10 位的幸运数只有 $2^10 = 1024$ 个，所以直接暴力枚举所有的幸运数就可以解决问题。

```cpp
#include <iostream>

using namespace std;

long long calc(int x) {
    if (!x) return 0;
    long long pre = 0, res = 0;
    for (int i = 1; i <= 10; ++i) {
        for (int mask = 0; mask < (1 << i); ++mask) {
            long long val = 0;
            for (int j = 0; j < i; ++j) {
                if (mask >> j & 1) val = val * 10 + 7;
                else val = val * 10 + 4;
            }
            if (x > val) res += val * (val - pre);
            else return (x - pre) * val + res;
            pre = val;
        }
    }
    return res;
}

int main() {
    int l, r;
    scanf("%d%d", &l, &r);
    printf("%lld\n", calc(r) - calc(l - 1)); // 用差分的思想可以简化左边界的处理
    return 0;
}
```
## E. Run

线性 dp，需要另外开一个状态表示上一次是否 run，其他的就和经典的爬楼梯问题完全一样了。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
const int MOD = 1000000007;
long long f[N][2], s[N];

int main() {
    int q, k;
    scanf("%d%d", &q, &k);
    f[0][0] = 1; 
    for (int i = 1; i <= 100000; ++i) {
        f[i][0] = (f[i - 1][0] + f[i - 1][1]) % MOD;
        if (i >= k) f[i][1] = f[i - k][0];
        s[i] = (s[i - 1] + f[i][0] + f[i][1]) % MOD;
    }
    while (q--) {
        int l, r;
        scanf("%d%d", &l, &r);
        printf("%lld\n", ((s[r] - s[l - 1]) % MOD + MOD) % MOD);
    }
    return 0;
}
```
## G. Money

最大的 profit 一定是能赚的都赚了，所以对于所有单调递增的子段都在开头买了在结尾卖了即可，这样能在保证最大 profit 的同时减少操作次数。

```cpp
#include <iostream>

using namespace std;
const int N = 100010;
int a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, cnt = 0;
        long long res = 0;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        a[n + 1] = -11111;
        for (int l = 1, r = 1; r <= n; ++r) {
            if (a[r] <= a[r + 1]) continue;
            else {
                if (a[r] > a[l]) {
                    cnt++;
                    res += a[r] - a[l];
                }
                l = r + 1;
            }
        }
        printf("%lld %d\n", res, cnt * 2);
    }
    return 0;
}
```