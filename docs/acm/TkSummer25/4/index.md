---
title: 2025夏季个人训练赛第四场
---
# 2025夏季个人训练赛第四场

## A. 牛人

随便按照一项标准排序，如果一个人排完序后他后面的人的另一项标准都不比他大他就是牛人。

需要注意的是如果排序的主键相等的人的副键是不需要比较的，会导致后缀最大值出一点问题，按主键正序副键逆序就可以解决这个问题，或者也可以用滑动窗口。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;
pair<long long, long long> a[N];
long long b[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%lld", &a[i].first);
    for (int i = 1; i <= n; ++i) scanf("%lld", &a[i].second);
    sort(a + 1, a + n + 1, [](pair<long long, long long> a, pair<long long, long long> b) {
        return a.first == b.first ? a.second >= b.second : a.first < b.first;
    });
    for (int i = n; i; --i) b[i] = max(b[i + 1], a[i].second);
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        if (a[i].second == b[i]) res++;
    }
    printf("%d\n", res);
    return 0;
}
```
## B. 斯诺克台球

太阴间了，题目要求都说不清，看代码吧……

需要注意的地方是

- 两个人用的一个桌子和一套球，甲连续打完之后乙再连续打
- 打完最后一个红球之后仍然可以任选一个彩球打，不会移除这个彩球也不会触发犯规

```cpp
#include <iostream>

using namespace std;

int aa[50], bb[50];

int main() {
    int n, m;
    int a = 0, b = 0, cnt = 15;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        aa[i] = t;
        if (i == n) {
            if (t == 0) b += 4;
            else if ((i & 1) && t != 1 && cnt > 0 || cnt <= 0 && i > 30 && i - 29 != t) b += max(4, t);
            else if (cnt > 0 && i % 2 == 0 && t == 1) b += 4;
            else a += t;
        }
        else {
            if (t == 1) cnt--;
            a += t;
        }
    }
    for (int i = 1; i <= m; ++i) {
        int t;
        scanf("%d", &t);
        bb[i] = t;
        if (i == m) {
            if (t == 0) a += 4;
            else if ((i & 1) && t != 1 && cnt > 0 || cnt <= 0 && i + n > 30 && i + n - 29 != t) a += max(4, t);
            else if (cnt > 0 && i % 2 == 0 && t == 1) b += 4;
            else b += t;
        }
        else {
            if (t == 1) cnt--;
            b += t;
        }
    }
    printf("%d %d\n", a, b);
    return 0;
}
```

## C. 演出队列

线性 dp，额外开一个状态记录是否已经删了一段，正常更新就可以。

```cpp
#include <iostream>

using namespace std;

const int N = 5010;
int f[N][2], a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 2; ++j) {
            if (a[i] > a[i - 1]) f[i][j] = f[i - 1][j] + 1;
            else f[i][j] = 1;
        }
        for (int j = 1; j < i; ++j) {
            if (a[i] > a[j]) f[i][1] = max(f[i][1], f[j][0] + 1);
        }
        res = max(res, f[i][1]);
    }
    printf("%d\n", res);
    return 0;
}
```

## D. 利比亚行动

我看到这道题的时候我知道怎么写，但是被前面恶心的不行了……放弃了写的欲望。

大概思路是分层图 dijkstra，一个点拆成 maxc 个点跑 dijkstra 就能跑出来。

## E. 抓鱼

经典的贪心问题，一直抓效率最高的就行。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 100010;

pair<LL, LL> a[N];

bool cmp(pair<LL, LL> a, pair<LL, LL> b) {
    return a.second < b.second;
}

int main() {
    int n;
    LL t, res = 0;
    scanf("%d%lld", &n, &t);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i].first);
    }
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i].second);
    }
    sort(a + 1, a + n + 1, cmp);
    for (int i = 1; i <= n; ++i) {
        if (t >= a[i].first * a[i].second) {
            res += a[i].first;
            t -= a[i].first * a[i].second;
        }
        else {
            res += t / a[i].second;
            break;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## F. PACM Team

背包问题求方案，多开一个数组记录选择即可。

难点是维度太多了，稍不留神就写挂了。

```cpp
#include <iostream>
#include <stack>

using namespace std;

const int N = 37;
// 按理说可以把第一维压掉，但是我一直写挂，最后加回来了……
int f[2][N][N][N][N];
bool p[N][N][N][N][N];
int a[N][4], g[N];

int main() {
    int n, b[4];
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d%d%d%d", &a[i][0], &a[i][1], &a[i][2], &a[i][3], &g[i]);
    }
    scanf("%d%d%d%d", &b[0], &b[1], &b[2], &b[3]);
    for (int i = 1; i <= n; ++i) {
        int t = i & 1;
        for (int j = b[0]; j >= 0; --j) {
            for (int k = b[1]; k >= 0; --k) {
                for (int l = b[2]; l >= 0; --l) {
                    for (int m = b[3]; m >= 0; --m) {
                        if (j >= a[i][0] && k >= a[i][1] && l >= a[i][2] && m >= a[i][3] && f[t ^ 1][j][k][l][m] < f[t ^ 1][j - a[i][0]][k - a[i][1]][l - a[i][2]][m - a[i][3]] + g[i]) {
                            p[i][j][k][l][m] = true;
                            f[t][j][k][l][m] = f[t ^ 1][j - a[i][0]][k - a[i][1]][l - a[i][2]][m - a[i][3]] + g[i];
                        }
                        else f[t][j][k][l][m] = f[t ^ 1][j][k][l][m];
                    }
                }
            }
        }
    }
    stack<int> res;
    int j = b[0], k = b[1], l = b[2], m = b[3];
    for (int i = n; i; --i) {
        if (p[i][j][k][l][m]) {
            res.push(i);
            j -= a[i][0], k -= a[i][1], l -= a[i][2], m -= a[i][3];
        }
    }
    printf("%ld\n", res.size());
    while (!res.empty()) {
        printf("%d ", res.top() - 1);
        res.pop();
    }
    printf("\n");
    return 0;
}
```
