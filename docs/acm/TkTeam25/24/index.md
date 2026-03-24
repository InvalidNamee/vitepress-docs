---
title: 2025组队训练赛第 24 场
---
# 2025组队训练赛第 24 场

## A. 游戏

很容易获胜

## E. 广播

类似最长公共子序列，先把两个串 reverse 一下，$f_{i, j}$ 表示第一个串匹配到第 i 个第二个串匹配到第 j 个的时候需要的最少步数，考虑转移，如果 $a_{i + 1} = b_{i + 1}$ 或者两个里面有一个是 1 就可以以 0 的代价转移过去，另外任何情况都能选一边插入一个 1 转移到 $f_{i + 1, j} 和 f_{i, j + 1}$，代价是 1。答案是 $\min_{i \in [0, n], j \in [0, m]} \lbrace f_{i, m}, f_{n, j} \rbrace$.

我统计答案的时候习惯性的写 for i = 0，然后 WA 了一发😭。

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
 
using namespace std;
 
const int N = 2010;
int f[N][N], a[N], b[N];
 
int main() {
    memset(f, 0x3f, sizeof(f));
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    for (int i = 1; i <= m; ++i) {
        scanf("%d", &b[i]);
    }
    reverse(a + 1, a + n + 1);
    reverse(b + 1, b + m + 1);
    f[0][0] = 0;
    for (int i = 0; i <= n; ++i) {
        for (int j = 0; j <= m; ++j) {
            if (a[i + 1] == b[j + 1] || a[i + 1] == 1 || b[j + 1] == 1) f[i + 1][j + 1] = min(f[i + 1][j + 1], f[i][j]);
            f[i + 1][j] = min(f[i + 1][j], f[i][j] + 1);
            f[i][j + 1] = min(f[i][j + 1], f[i][j] + 1);
        }
    }
    int res = 0x3f3f3f3f;
    for (int i = 0; i <= n; ++i) res = min(res, f[i][m]);
    for (int i = 0; i <= m; ++i) res = min(res, f[n][i]);
    printf("%d\n", res);
    return 0;
}
```

## J. 图

对于一对点 a 和 b，只需要保证只有一条最短路为 (a, b) 即可，可以用 floyd。

```cpp
#include <iostream>
 
using namespace std;
 
const int N = 510;
typedef long long LL;
 
LL ed[N][N], f[N][N], g[N][N];
 
int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            scanf("%lld", &f[i][j]);
            ed[i][j] = f[i][j];
            g[i][j] = 1;
        }
    }
    for (int k = 1; k <= n; ++k) {
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (i == j || j == k || i == k) continue;
                if (f[i][j] > f[i][k] + f[k][j]) {
                    g[i][j] = g[i][k] * g[k][j];
                    f[i][j] = f[i][k] + f[k][j];
                }
                else if (f[i][j] == f[i][k] + f[k][j]) {
                    g[i][j] += g[i][k] + g[k][j];
                }
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (g[i][j] == 1 && f[i][j] == ed[i][j] && i != j) {
                printf("1");
            }
            else printf("0");
        }
        printf("\n");
    }
    return 0;
}
```

## K. 报数

注意到 f(n) 一定不会大于 9000，而且收敛很快，可以考虑对 f(n) 的值进行枚举，记录能继续运算 k - 1 次能得到 m 的所有数。做数位 dp，统计 $g_{i, j, k}$，表示枚举到第 i 位，目前 f 值为 j 的方案数，k 表示当前是否顶到上界，最后对于所有合法的 j 求 $\sum_{j, k} g_{n, j, k}$.

我代码里的 f 和 g 是反的，因为我喜欢用 f 做 dp 的数组。我把 g 收敛的条件写错了 T 了一发。

```cpp
#include <iostream>
#include <vector>
 
using namespace std;
 
const int N = 1010, M = 9010;
const int MOD = 1000000007;
int f[N][M][2], pre[N][M][2];
char s[N];
int a[N];
 
int g(int n, int k) {
    if (n % 10 == n) return n;
    else if (!k) return n;
    else {
        int res = 0;
        while (n) {
            res += n % 10;
            n /= 10;
        }
        return g(res, k - 1);
    }
}
 
int get(int i, int tt, int l, int r) {
    if (r < 0) return 0;
    if (l <= 0) return pre[i][r][tt];
    else return ((pre[i][r][tt] - pre[i][l - 1][tt]) % MOD + MOD) % MOD; 
}
 
void solve() {
    int k, m;
    scanf("%s%d%d", s, &k, &m);
    int n = 0;
    for (int i = 0; s[i]; ++i) {
        a[++n] = s[i] - 48;
    }
    vector<int> v;
    for (int i = 0; i <= n * 9; ++i) {
        if (g(i, k - 1) == m) {
            v.emplace_back(i);
        }
    }
    if (v.empty()) printf("0\n");
    else if (v.back() == 0) printf("1\n");
    else {
        f[0][0][1] = 1;
        int l = v.back();
        for (int i = 0; i <= l; ++i) {
            pre[0][i][1] = 1;
        }
        for (int i = 1; i <= n; ++i) {
            for (int t = 0; t <= l; ++t) {
                f[i][t][0] = (get(i - 1, 0, t - 9, t) + get(i - 1, 1, t - a[i] + 1, t)) % MOD;
                f[i][t][1] = get(i - 1, 1, t - a[i], t - a[i]);
                for (int tt = 0; tt < 2; ++tt)
                    if (t == 0) pre[i][t][tt] = f[i][t][tt];
                    else pre[i][t][tt] = (pre[i][t - 1][tt] + f[i][t][tt]) % MOD;
            }
        }
        int res = 0;
        for (int i : v) {
            res = (res + f[n][i][0] + f[n][i][1]) % MOD;
        }
        printf("%d\n", res);
    }
}
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        solve();    
    }
    return 0;
}
```