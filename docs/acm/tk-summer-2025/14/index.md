---
title: 2025夏季个人训练赛第十四场
---
# 2025夏季个人训练赛第十四场

## A. 公交线路

按要求模拟即可。

```cpp
#include <iostream>

using namespace std;

const int N = 20;
int a[N], b[N];

int main() {
    int n, x, y;
    scanf("%d%d%d", &n, &x, &y);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    int m;
    scanf("%d", &m);
    for (int i = 1; i <= m; ++i) {
        scanf("%d", &b[i]);
    }
    bool l = true, r = true;
    for (int i = 1; i <= m; ++i) {
        int p = x + i;
        if (p < 0 || p > n) {
            r = false;
            break;
        }
        else if (b[i] != a[p]) {
            r = false;
            break;
        }
    }
    for (int i = 1; i <= m; ++i) {
        int p = x - i;
        if (p < 0 || p > n) {
            l = false;
            break;
        }
        else if (b[i] != a[p]) {
            l = false;
            break;
        }
    }
    if (l && r) printf("Unsure\n");
    else if (!l && !r) {
        printf("qwq\n");
        return 123;
    }
    else if (x < y && r || x > y && l) printf("Right\n");
    else printf("Wrong\n");
    return 0;
}
```

## <span style="color: red">B. 攻防演练</span>

## C. 连锁商店

2<sup>36</sup> 会爆空间和时间，但是 2<sup>18</sup> 正好不会，最多 36 个景点，只有公司出现次数 ≥ 2 的点记录状态才有意义，统计一下出现次数 ≥ 2 的景点拓扑排序 + 状压dp 就可以解决。

<p style="color: red">记得初始化😭</p>

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>

using namespace std;

const int N = 40;

int f[N][1 << 18], cnt[N], a[N], b[N], c[N], w[N], deg[N];
vector<int> ed[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &c[i]);
        cnt[c[i]]++;
    }
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &w[i]);
    }
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        if (x > y) swap(x, y);
        ed[x].push_back(y);
        deg[y]++;
    }

    int len = 0;
    for (int i = 1; i <= n; ++i) {
        if (cnt[i] > 1) a[++len] = i, b[i] = len;
    }
    queue<int> q;
    q.push(1);
    memset(f, -0x3f, sizeof(f));
    if (b[c[1]]) f[1][1 << (b[c[1]] - 1)] = w[c[1]];
    else f[1][0] = w[c[1]];
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : ed[x]) {
            if (b[c[y]])
                for (int mask = 0; mask < (1 << len); ++mask) {
                    if (mask >> (b[c[y]] - 1) & 1) f[y][mask] = max(f[y][mask], f[x][mask]);
                    else f[y][mask | (1 << b[c[y]] - 1)] = max(f[y][mask | (1 << b[c[y]] - 1)], f[x][mask] + w[c[y]]);
                }
            else
                for (int mask = 0; mask < (1 << len); ++mask) {
                    f[y][mask] = max(f[y][mask], f[x][mask] + w[c[y]]);
                }
            if (--deg[y] == 0) q.push(y);
        }
    }
    for (int i = 1; i <= n; ++i) {
        int res = 0;
        for (int j = 0; j < (1 << len); ++j) {
            res = max(res, f[i][j]);
        }
        printf("%d\n", res);
    }
    return 0;
}
```

## D. 修建道路

从左到右连成一条链一定是最优的，如果中间跨越了几个村庄，代价就是中间的所有的路取 max，一定不比连成一条链小。

```cpp
#include <iostream>

using namespace std;

const int N = 200010;
int a[N];

int main() {
    int n;
    long long res = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    for (int i = 2; i <= n; ++i) {
        res += max(a[i], a[i - 1]);
    }
    printf("%lld\n", res);
    return 0;
}
```

## G. 3G网络

$r \rarr + \infty$ 了，圆心的距离就能忽略了，所以答案是 $\frac{1}{n}$.

```cpp
#include <iostream>

using namespace std;

int main() {
    int n;
    scanf("%d", &n);
    printf("%.15f\n", 1.0 / n);
    return 0;
}
```

## I. 驾驶卡丁车

一般的大模拟，都挺好实现的。

```cpp
#include <iostream>

using namespace std;

const int N = 60;
const int dx[] = {-1, -1, 0, 1, 1, 1, 0, -1}, dy[] = {0, 1, 1, 1, 0, -1, -1, -1};
char mp[N][N], s[510];

int main() {
    int n, m, x, y;
    scanf("%d%d", &n, &m);
    for (int i = 0; i <= m + 1; ++i) mp[0][i] = mp[n + 1][i] = '#';
    for (int i = 1; i <= n; ++i) {
        scanf("%s", mp[i] + 1);
        for (int j = 1; j <= n; ++j) {
            if (mp[i][j] == '*') {
                x = i, y = j;
            }
        }
        mp[i][0] = mp[i][m + 1] = '#';
    }
    int q, v = 0, d = 0;
    scanf("%d%s", &q, s);
    for (int i = 0; i < q; ++i) {
        if (s[i] == 'L') d = (d + 7) % 8;
        else if (s[i] == 'R') d = (d + 1) % 8;
        else if (s[i] == 'U') v++;
        else if (s[i] == 'D') v = max(v - 1, 0);
        else {
            cout << "qwq" << endl;
            return 123;
        }
        for (int j = 1; j <= v; ++j) {
            if (mp[x + dx[d]][y + dy[d]] == '#' || (d & 1) && mp[x + dx[(d + 7) % 8]][y + dy[(d + 7) % 8]] == '#' && mp[x + dx[(d + 1) % 8]][y + dy[(d + 1) % 8]] == '#') {
                v = 0;
                printf("Crash! ");
                break;
            }
            else x += dx[d], y += dy[d];
        }
        printf("%d %d\n", x, y);
    }
    return 0;
}
```

## K. 音乐游戏

数据有问题，实际上 n 不太准，直接统计 `-` 的个数就是对的。

```cpp
#include <iostream>

using namespace std;

const int N = 1010;

int main() {
    string s;
    int res = 0;
    getline(cin, s);
    while (getline(cin, s)) {
        for (char c : s) if (c == '-') res++;
    }
    cout << res << endl;
    return 0;
}
```