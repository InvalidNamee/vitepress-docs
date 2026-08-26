---
title: 2025夏季个人训练赛第五场
---
# 2025夏季个人训练赛第五场

## A. 折纸

签到题。

```cpp
#include <iostream>

using namespace std;

int main() {
    int n;
    long long res = 0;
    scanf("%d", &n);
    while (n--) {
        int op;
        scanf("%d", &op);
        if (op == 1) {
            int a, b;
            scanf("%d%d", &a, &b);
            res += (a + b) * 2;
        }
        else if (op == 2) {
            int a;
            scanf("%d", &a);
            res += a * 4;
        }
        else {
            int a, b, c;
            scanf("%d%d%d", &a, &b, &c);
            res += a + b + c;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## B. 插入排序

事后我发现有两个佬补出来了，于是想去洛谷找找看有没有题解，结果在题面的最下面有一句提示: **不需要移动的数之间符合什么规律呢？**

我笨😭，我竟然没想到。

有逆序对一定是优先动小的那个，所以固定一个和最大的不下降子序列把剩下的数插进去就是最优的，用树状数组处理一下就行了，和最长不下降子序列几乎一样，只不过这道题是带权的。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
const int M = 20010;

int a[N];
long long tr[M];

void add(int x, long long val) {
    for (; x <= 20000; x += x & -x) {
        tr[x] = max(tr[x], val);
    }
}

long long query(int x) {
    long long res = 0;
    for (; x; x -= x & -x) {
        res = max(tr[x], res);
    }
    return res;
}

int main() {
    int n;
    long long res = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        res += a[i];
    }
    for (int i = 1; i <= n; ++i) {
        long long val = query(a[i]);
        add(a[i], val + a[i]);
    }
    printf("%lld\n", res - query(20000));
    return 0;
}
```

## C. 幻灯片

我刚开始看错题了，以为要求总面积……

维护 x1，x2 的前缀后缀最大值，y1，y2 的前缀后缀最小值，把每个点删掉之后前后缀最大值求 max，最小值求 min，就能得到重叠部分的 x1，x2，y1，y2 计算面积取 max 即可。

```cpp
#include <iostream>
using namespace std;

const int N = 100010;
int px1[N], py1[N], px2[N], py2[N];
int sx1[N], sy1[N], sx2[N], sy2[N];
int x1[N], y1[N], x2[N], y2[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int n;
    cin >> n;
    px1[0] = py1[0] = sx1[n + 1] = sy1[n + 1] = -0x3f3f3f3f;
    px2[0] = py2[0] = sx2[n + 1] = sy2[n + 1] = 0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        cin >> x1[i] >> y1[i] >> x2[i] >> y2[i];
        px1[i] = max(px1[i - 1], x1[i]), py1[i] = max(py1[i - 1], y1[i]);
        px2[i] = min(px2[i - 1], x2[i]), py2[i] = min(py2[i - 1], y2[i]);
    }
    for (int i = n; i; --i) {
        sx1[i] = max(sx1[i + 1], x1[i]), sy1[i] = max(sy1[i + 1], y1[i]);
        sx2[i] = min(sx2[i + 1], x2[i]), sy2[i] = min(sy2[i + 1], y2[i]);
    }
    long long res = 0;
    for (int i = 1; i <= n; ++i) {
        int lx = max(px1[i - 1], sx1[i + 1]), ly = max(py1[i - 1], sy1[i + 1]);
        int rx = min(px2[i - 1], sx2[i + 1]), ry = min(py2[i - 1], sy2[i + 1]);
        if (lx < rx && ly < ry) res = max(res, 1LL * (rx - lx) * (ry - ly));
    }
    cout << res << endl;
    return 0;
}
```

## D. 军训整队

因为可以任意交换，所以坐标就不重要了，把二维坐标压到一维数组里面，这道题就变成了一个排列的变换最少能用多少个对换表示。可以先拆成轮换，一个 n-轮换能用 n - 1 个对换表示。

需要做的操作就是降维然后把原位置和目标位置建边，所有环的节点数 - 1 再求和。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;

int ne[N];
bool vis[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    int lim = n * m;
    for (int i = 1; i <= lim; ++i) {
        int x, y;
        scanf(" (%d,%d) ", &x, &y);
        ne[i] = (x - 1) * m + y;
    }
    int res = 0;
    for (int i = 1; i <= lim; ++i) {
        if (!vis[i]) {
            int x = i, t = 0;
            do {
                t++;
                vis[x] = true;
                x = ne[x];
            } while (x != i);
            res += t - 1;
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## E. 瓶子涂色

很简单的线性 dp。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100010;

int a[N][3], f[N][3];

int main() {
    int n;
    scanf("%d", &n);
    for (int j = 0; j < 3; ++j) {
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i][j]);
        }
    }
    memset(f, 0x3f, sizeof(f));
    f[0][0] = f[0][1] = f[0][2] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 3; ++j) {
            for (int k = 0; k < 3; ++k) {
                if (j == k) continue;
                f[i][j] = min(f[i][j], f[i - 1][k] + a[i][j]);
            }
        }
    }
    printf("%d\n", min(f[n][0], min(f[n][1], f[n][2])));
    return 0;
}
```