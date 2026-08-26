---
title: 2025组队训练赛第 26 场
---
# 2025组队训练赛第 26 场

## A. An Olympian Math Problem

打表发现应该输出 n - 1.

```cpp
#include <iostream>
 
using namespace std;
 
int main() {
    int t;
    long long n;
    scanf("%d", &t);
    while (t--) {
        scanf("%lld", &n);
        printf("%lld\n", n - 1);
    }
    return 0;
}
```

## B. The writing on the wall

单调栈

## C. GDY

大模拟，我的 2 能管住 2，卡了 2h😇。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
const int N = 210, M = 20010;
const int ne[] = {0, 2, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1};
int a[M], t[N][14], num[N];
 
void solve() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) scanf("%d", &a[i]);
    int cur = 1, now_card = 0, ls_person = 1, cur_person = 1;
    // init
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 5; ++j) {
            if (cur <= m) {
                t[i][a[cur++]]++;
                num[i]++;
            }
        }
    }
    bool first = true;
    while (true) {
        if (ls_person == cur_person) {
            if (first) first = false;
            else {
                for (int i = 0; i < n; ++i) {
                    if (cur <= m) {
                        t[(cur_person + i - 1) % n + 1][a[cur++]]++;
                        num[(cur_person + i - 1) % n + 1]++;
                    }
                }
            }
            for (int i = 1; i <= 13; ++i) {
                if (t[cur_person][(i + 1) % 13 + 1]) {
                    t[cur_person][(i + 1) % 13 + 1]--;
                    now_card = (i + 1) % 13 + 1;
                    num[cur_person]--;
                    // cout << cur_person << " CHU " << (i + 1) % 13 + 1 << endl;
                    break;
                }
            }
            // cout << endl;
            ls_person = cur_person;
        }
        else {
            if (t[cur_person][ne[now_card]]) {
                t[cur_person][ne[now_card]]--;
                num[cur_person]--;
                ls_person = cur_person;
                now_card = ne[now_card];
                // cout << cur_person << " CHU " << now_card << endl;
            }
            else if (now_card != 2 && t[cur_person][2]) {
                t[cur_person][2]--;
                num[cur_person]--;
                ls_person = cur_person;
                now_card = 2;
                // cout << cur_person << " CHU " << now_card << endl;
            }
        }
        if (num[cur_person] <= 0) break;
        // for (int i = 1; i <= 13; ++i) cout << t[cur_person][i] << ' ';
        // cout << endl;
        cur_person = cur_person % n + 1;
    }
    for (int i = 1; i <= n; ++i) {
        if (num[i] == 0) printf("Winner\n");
        else {
            int res = 0;
            for (int j = 1; j <= 13; ++j) {
                res += t[i][j] * j;
                t[i][j] = 0;
            }
            num[i] = 0;
            printf("%d\n", res);
        }
    }
}
 
int main() {
    int T;
    scanf("%d", &T);
    for (int i = 1; i <= T; ++i) {
        printf("Case #%d:\n", i);
        solve();
    }
    return 0;
}
```

## E. AC Challenge

状压 dp，维护第 i 次选后结果是一个 bitmask 的得分最大值。

我状态转移神秘不取 max，挂掉了一次。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
using namespace std;
typedef long long LL;
const int N = 20;
LL f[1 << N], g[1 << N];
LL a[N], b[N];
int v[N];
 
int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        int t;
        scanf("%lld%lld%d", &a[i], &b[i], &t);
        for (int j = 0; j < t; ++j) {
            int tmp;
            scanf("%d", &tmp);
            v[i] |= 1 << (tmp - 1);
        }
    }
    memset(f, -0x3f, sizeof(f));
    memset(g, -0x3f, sizeof(g));
    LL inf = f[0], res = 0;
    f[0] = 0;
    int tmp = 0;
    for (int i = 1; i <= n; ++i) {
        for (int msk = 0; msk < (1 << n); ++msk) {
            if (f[msk] == inf) continue;
            for (int j = 0; j < n; ++j) {
                if ((msk >> j & 1) || ((v[j] & msk) != v[j])) continue;
                else {
                    g[msk | (1 << j)] = max(g[msk | (1 << j)], f[msk] + a[j] * i + b[j]);
                    res = max(res, g[msk | (1 << j)]);
                }
            }
        }
        tmp |= 1 << (i - 1);
        swap(f, g);
        memset(g, -0x3f, sizeof(g));
    }
    printf("%lld\n", res);
    return 0;
} 
```

## G. Lpl and Energy-saving Lamps

似乎是个平衡树，用 set 能做。

## I. Skr

裸的回文自动机板子。

## J. Nanjing Sum

对于一个数做质因数分解，如果最高幂次超过 2，必定有一边不是 square-free integer，所有的分解方案是把幂次为 2 的一边取一个，其余的任意放。

利用线筛的过程 dp，考虑标记的过程 `v[i * prime[j]] = prime[j]`，检查 i 中是否出现过这个约数 `prime[j]` 以及出现是否已经两次，更新答案。

```cpp
#include <iostream>
 
using namespace std;
 
const int N = 20000010;
int v[N], prime[N], l;
long long f[N];
 
void init() {
    int n = 20000000;
    f[1] = 1;
    for (int i = 2; i <= n; ++i) {
        if (v[i] == 0) {
            v[i] = i;
            prime[++l] = i;
            f[i] = 2;
        }
        for (int j = 1; j <= l; ++j) {
            if (prime[j] > v[i] || prime[j] > n / i) break;
            v[i * prime[j]] = prime[j];
            if (v[i] != prime[j]) {
                f[i * prime[j]] = f[i] * 2;
            }
            else if (v[i] == prime[j] && v[i / v[i]] != prime[j]) {
                f[i * prime[j]] = f[i] / 2;
            }
            else {
                f[i * prime[j]] = 0;
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        f[i] += f[i - 1];
    }
}
 
int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        printf("%lld\n", f[n]);
    }
    return 0;
}
```

## L. Magical Girl Haze

裸的分层图最短路板子。

