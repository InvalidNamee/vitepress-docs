---
title: 2025春训第十九场
---
# 2025春训第十九场

## A. 熊孩子打卡

一道比较水的签到题，因为数据不算太大，直接开 map 统计就可以。

```cpp
#include <cstdio>
#include <map>

using namespace std;

map<int, int> mp;

int main() {
    int n, res = 0, ls = __INT_MAX__; // 数据肯定到不了 __INT_MAX__
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        if (ls == t) continue;
        else {
            mp[t]++;
            ls = t;
            res++;
        }
    }
    for (auto [a, b]: mp) {
        printf("%d %d\n", a, b);
    }
    return 0;
}
```

## B. 最省力整理法

不管怎么换最后体力应该是一样的，因为数据比较小，所以直接冒泡排序就可以。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 5010;
int a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    long long res = 0;
    for (int i = 1; i < n; ++i) {
        for (int j = 1; j <= n - i; ++j) {
            if (a[j] > a[j + 1]) {
                res += max(a[j], a[j + 1]);
                swap(a[j], a[j + 1]);
            }
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## C. 穿心咒

这是高中题，两圆的位置关系有 内含、内切、相交、外切、外离，分别对应 0、1、2、1、0，根据**圆心的距离和半径的关系**判断即可。

```cpp
#include <iostream>

using namespace std;

int p(int x) {
    return x * x;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) { 
        int x1, y1, r1, x2, y2, r2;
        scanf("%d%d%d%d%d%d", &x1, &y1, &r1, &x2, &y2, &r2);
        if (x1 == x2 && y1 == y2 && r1 == r2) printf("-1\n");
        else if (p(x1 - x2) + p(y1 - y2) > p(r1 + r2) || p(x1 - x2) + p(y1 - y2) < p(r1 - r2)) printf("0\n");
        else if (p(x1 - x2) + p(y1 - y2) == p(r1 + r2) || p(x1 - x2) + p(y1 - y2) == p(r1 - r2)) printf("1\n");
        else printf("2\n");
    }
    return 0;
}
```

## D. 吃火锅

之前某次训练赛的 A 题。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <queue>

using namespace std;

const int N = 510;
const int M = 250010;
const int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
int a[N][N], n;
vector<int> ed[M];
int deg[M], f[M];

int calc(int x, int y) {
    return (x - 1) * n + y;
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            scanf("%d", &a[i][j]);
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            for (int k = 0; k < 4; ++k) {
                int x = i + dx[k], y = j + dy[k];
                if (x > 0 && x <= n && y > 0 && y <= n && a[i][j] < a[x][y]) {
                    ed[calc(i, j)].push_back(calc(x, y));
                    deg[calc(x, y)]++;
                }
            }
        }
    }
    queue<int> q;
    for (int i = 1; i <= n * n; ++i) {
        if (deg[i] == 0) q.push(i), f[i] = 1;
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : ed[x]) {
            f[y] = max(f[y], f[x] + 1);
            if (--deg[y] == 0) q.push(y);
        }
    }
    int res = 0;
    for (int i = 1; i <= n * n; ++i) {
        res = max(res, f[i]);
    }
    printf("%d\n", res);
    return 0;
}
```

## E. 套路比赛

可以用分块来做，把 $n$个数按照除以 $\lfloor \sqrt n \rfloor$ 的余数分成 $\lceil \sqrt n \rceil$块。

1. 第 i 轮淘汰，需要找 $m\ \text{mod}\ (n - i)$ 个人，如果为零，就赋值成 n - i，我们把这个人数记为 t；
    
2. 每次淘汰先从当前的人所在的块内开始**暴力遍历，遇到未被淘汰的就 t -= 1；**
    
3. 如果成功在块内找到了下一个被淘汰的（t == 0），**标记上，并把当前块的计数 - 1**，进行下一轮淘汰；
    
4. 否则**按块遍历**，t -= 块内剩余的人数（这个值可以预先维护好），直到某个块内**剩余的人数比 t 多，暴力遍历**该块，直到 t == 0，淘汰掉这个人。
    
5. 以此类推，执行 n - 1 次，剩下的人就是答案。
    

```cpp
/*
我这里把下标统一往前移了一位，为了方便取模
*/
#include <iostream>
#include <cmath>

using namespace std;

bool f[100010];
int siz[333];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    int L = sqrt(n), cnt = n / L;
    for (int i = 0; i < n; ++i) {
        f[i] = true;
        siz[i / L]++;
    }
    int cur = 0;
    for (int i = 1; i < n; ++i) {
        int t = m % (n - i + 1), cur_bk = cur / L;
        if (!t) t = n - i + 1;
        while (cur / L == cur_bk && t) {
            t -= f[cur];
            cur++;
            cur %= n;
        }
        if (!t) {
            int tt = (cur - 1 + n) % n;
            f[tt] = false;
            siz[tt / L]--;
        }
        else {
            cur_bk = cur / L;
            while (siz[cur_bk] < t) {
                t -= siz[cur_bk];
                cur_bk++;
                cur_bk %= cnt + 1;
            }
            cur = cur_bk * L;
            while (t) {
                t -= f[cur];
                cur++;
                cur %= n;
            }
            int tt = (cur - 1 + n) % n;
            f[tt] = false;
            siz[tt / L]--;
        }
    }
    for (int i = 0; i < n; ++i) {
        if (f[i]) {
            printf("%d\n", i + 1);
            return 0;
        }
    }
    return 0;
}

/*
0 1 2 3 4 5 6 7 8 9
0 1 _ 3 4 5 6 7 8 9
0 1 _ 3 4 _ 6 7 8 9
0 1 _ 3 4 _ 6 7 _ 9
0 _ _ 3 4 _ 6 7 _ 9
0 _ _ 3 4 _ _ 7 _ 9
_ _ _ 3 4 _ _ 7 _ 9
_ _ _ 3 4 _ _ _ _ 9
_ _ _ 3 _ _ _ _ _ 9
_ _ _ 3 _ _ _ _ _ _
*/
```

## F. 石子合并

如果数据小的话，直接用 STL 的堆就可以做，但是他没给数据范围，所以我采取了打表 + 找规律的做法。

答案 = $1 · 0 + 2^0 · 2 + 2^1 · 3 + 2^2 · 4 + \dots + (n - 1 - 2^0 - 2^1 - 2^2 - \dots) · k$.

代码中注释掉的是打表的过程。

```cpp
#include <iostream>
#include <queue>

using namespace std;

// priority_queue<int, vector<int>, greater<int>> q;
// long long res[101], t[101];

int main() {
    unsigned long long n, res = 0;
    cin >> n;
    int i = 0;
    n--;
    while (n) {
        if (n >= (1ull << i)) res += (1ull << i) * (i + 2), n -= (1ull << i);
        else res += n * (i + 2), n = 0;
        i++;
    }
    cout << res << endl;

    // for (int t = 1; t <= 100; ++t) {
    //     int i = 0;
    //     n = t - 1;
    //     while (n) {
    //         if (n >= (1ull << i)) res += (1ull << i) * (i + 2), n -= (1ull << i);
    //         else res += n * (i + 2), n = 0;
    //         i++;
    //     }
    //     cout << res << ' ';
    //     res = 0;
    //     // for (int i = 1; i <= n; ++i) q.push(1);
    //     // while (q.size() > 1) {
    //     //     int x = q.top(); q.pop();
    //     //     int y = q.top(); q.pop();
    //     //     q.push(x + y);
    //     //     res[n] += x + y;
    //     // }
    //     // q.pop();
    // }
    // for (int i = 1; i <= 100; ++i) t[i] = res[i] - res[i - 1];
    // for (int i = 1; i <= 100; ++i) cout << res[i] << ' ';
    // cout << endl;
    return 0;
}
```