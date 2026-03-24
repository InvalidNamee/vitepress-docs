---
title: 2025组队训练赛第 23 场
---
# 2025组队训练赛第 23 场

## C. DFS 序

树形 dp.

## E. 循环赛 <sup style="color: red">欠</sup>

## G. Menji 和 gcd

对于每一组数据，设 gcd 为 g，一定存在一个 k，$kg, (k + 1)g \in [L, R]$，k 和 g 至少有一个是小于 $\sqrt{R}$ 的，分别枚举两次 g 和 k。（下面代码中是 l 和 t）

```cpp
#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>
 
using namespace std;
typedef long long LL;
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        LL a, b;
        scanf("%lld%lld", &a, &b);
        LL res = 0;
        for (LL l = 1; l <= 1000000; ++l) {
            if ((a + l - 1) / l * l + l <= b) {
                res = max(res, l);
            }
        }
        for (LL t = 1; t <= 1000000; ++t) {
            LL l = (b / (t + 1));
            if (t * l >= a) {
                res = max(res, l);
            }
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## H. 小班课

二分图最大匹配……。

## I. 不等式

对每一个点 x 维护他的所有的 y 和 z，拓扑排序取出堆头的时候 dp，选择 $f_x = max\lbrace f_y + f_z\rbrace$，最后检查一下有没有成环。

```cpp
#include <iostream>
#include <queue>
#include <set>
 
using namespace std;
 
typedef long long LL;
const int N = 200010;
 
int ver[N * 2], ne[N * 2], head[N], deg[N], tot;
vector<pair<int, int>> a[N];
LL f[N];
 
void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    deg[y]++;
}
 
int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        add(y, x), add(z, x);
        a[x].emplace_back(y, z);
    }
    queue<int> q;
    for (int i = 1; i <= n; ++i) {
        if (deg[i] == 0) {
            q.push(i);
            f[i] = 1;
        }
    }
    LL res = 0;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (auto [y, z] : a[x]) {
            f[x] = max(f[x], f[y] + f[z]);
        }
        res += f[x];
        if (res > 1000000000) {
            printf("-1\n");
            return 0;
        }
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (--deg[y] == 0) {
                q.push(y);
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        if (deg[i]) {
            printf("-1\n");
            return 0;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```