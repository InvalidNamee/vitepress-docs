---
title: 2025夏季个人训练赛第三十四场
---
# 2025夏季个人训练赛第三十四场

没有牛客的第二天～～

## A. 小Biu的骰子

我刚开始的时候惯性思维的想遍历终点枚举起点，没有考虑到不同起点过来的概率还都得单独算，WA 了好几发之后才发现……

枚举起点会好做特别多。

```cpp
#include <iostream>

using namespace std;
const int N = 1010;
int x[N];
double f[N], g[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &x[i]);
    }
    f[1] = x[1];
    g[1] = 1;
    for (int i = 1; i < n; ++i) {
        int t = min(6, n - i);
        for (int j = 1; j <= t; ++j) {
            f[i + j] += (f[i] + x[i + j] * g[i]) / t;
            g[i + j] += g[i] / t;
        }
    }
    printf("%.15lf\n", f[n]);
    return 0;
}
```

## B. 小Biu的树

我试图扭曲子树的定义 WA 了一发，是的，我的子树曾经还能剪枝😇。

很简单的树形dp，回溯的时候维护一个子树大小和一个子树最大值，如果一个点至少有两个孩子就取子树最大值最大的两个孩子更新答案。

```cpp
#include <iostream>
#include <climits>
#include <queue>

using namespace std;
const int N = 100010;

int head[N], ver[N * 2], ne[N * 2], tot;
int a[N], f[N], g[N], n, res = INT_MIN;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x, int fa) {
    f[x] = a[x];
    priority_queue<int> q;
    int mx = 0;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dfs(y, x);
        f[x] += f[y];
        q.push(g[y]);
        g[x] = max(g[x], g[y]);
    }
    g[x] = max(g[x], f[x]);
    if (q.size() >= 2) {
        int t1 = q.top(), t2;
        q.pop();
        t2 = q.top();
        q.pop();
        res = max(res, t1 + t2);
    }
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    fill(g, g + n + 1, INT_MIN);
    dfs(1, 0);
    if (res == INT_MIN) printf("Impossible\n");
    else printf("%d\n", res);
    return 0;
}
```

## C. 掰手腕

直接排序差分在排序，贪心取最小的。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
const int N = 100010;

int a[N];

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
    sort(a + 1, a + n + 1);
    for (int i = n; i; --i) a[i] = abs(a[i] - a[i - 1]);
    sort(a + 2, a + n + 1);
    long long res = 0;
    for (int i = 0; i < k; ++i) res += a[i + 2];
    printf("%lld\n", res);
    return 0;
}
```

## D. 踢石头

直接模拟就行，每两次移动一定会忽略掉一个石头，直接模拟最多走 2e5 次。

```cpp
#include <iostream>
#include <queue>

using namespace std;

priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int p, d;
        scanf("%d%d", &p, &d);
        q.push({p, d});
    }
    bool f = true;
    long long res = 0;
    while (!q.empty()) {
        auto [p, d] = q.top();
        q.pop();
        if (f) q.push({p + d, d});
        res = p;
        f ^= 1;
    }
    printf("%lld\n", res);
    return 0;
}
```

## E. 蛋糕 (cake)

这道题在考验优化常数的能力，主要的点是

- 不要尝试用 map 和 unordered_map，全都得 TLE；
- 不要用 printf 一位一位输出，建议用 putchar；
- 不要尝试 memset，同样会喜提 TLE。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;
int res[2000010], sa[2000010], p[10000010];
int a, b, g, mark, l;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int main() {
    for (int t = 0; t < 18; ++t) {
        scanf("%d%d", &a, &b);
        g = gcd(a, b);
        a /= g, b /= g;
        printf("%d", a / b);
        if (a % b != 0) {
            a %= b;
            putchar('.');
            mark = 0, l = 0;
            while (a) {
                a *= 10;
                if (p[a]) {
                    mark = p[a];
                    break;
                }
                p[a] = ++l;
                res[l] = a / b;
                sa[l] = a;
                a %= b;
            }
            if (mark) {
                for (int i = 1; i < mark; ++i) {
                    putchar(res[i] + 48);
                    p[sa[i]] = 0;
                }
                putchar('(');
                for (int i = mark; i <= l; ++i) {
                    putchar(res[i] + 48);
                    p[sa[i]] = 0;
                }
                putchar(')');
            }
            else {
                for (int i = 1; i <= l; ++i) {
                    putchar(res[i] + 48);
                    p[sa[i]] = 0;
                }
            }
        }
        putchar('\n');
    }
    return 0;
}
```

## I. 矩阵游戏

双倍经验: [洛谷](https://www.luogu.com.cn/problem/P1129)

今天上午我一直在犯迷糊，我快把二分图最大匹配的过程都模拟出来了还没想到跑二分图最大匹配……中午越想越不对劲，发现我之前好像做过这个题 (洛谷有两份 22 年 9 月的提交记录)。

其实只需要考虑每一行是否都能抽出来一个不重复的位置，把行标和列标建边跑二分图最大匹配，如果跑出来是 n 就可以，如果不是 n 就不可以。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;

const int N = 210;
vector<int> ed[N];
bool vis[N];
int match[N];

bool dfs(int x) {
    if (vis[x]) return false;
    vis[x] = true;
    for (int y : ed[x]) {
        if (!match[y] || dfs(match[y])) {
            match[y] = x;
            return true;
        }
    }
    return false;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        memset(match, 0, sizeof(int) * (n + 1));
        for (int i = 1; i <= n; ++i) ed[i].clear();
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                int t;
                scanf("%d", &t);
                if (t) ed[i].emplace_back(j);
            }
        }
        int cnt = 0;
        for (int i = 1; i <= n; ++i) {
            memset(vis, 0, sizeof(bool) * (n + 1));
            if (dfs(i)) cnt++;
        }
        printf(cnt == n ? "Yes\n" : "No\n");
    }
    return 0;
}
```

## J. 时态同步 <sup style="color: red">ERROR</sup>

双倍经验: [洛谷](https://www.luogu.com.cn/problem/P1131)

我怀疑数据有问题……我的代码在洛谷过了，在这儿就只有 72.7 分，而且 72.7 的还不止我一个。

这是一个比较朴素的树形dp，反向思维，路径一样，不妨认为是从叶子流向根的，开一个 f 维护答案，一个 g 维护从叶子传到当前点的时间，从子树向根合并的时候以子节点的最长时间为准别的都补成这个时间。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 500010;
int head[N], ne[N * 2], ver[N * 2], t[N * 2], tot;
LL f[N], g[N]; // 需要的次数 传到子树根节点的时间

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    t[tot] = z;
}

void dp(int x, int fa) {
    LL s = 0;
    int cnt = 0;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dp(y, x);
        f[x] += f[y];
        cnt++;
        s += g[y] + t[i];
        g[x] = max(g[x], g[y] + t[i]);
    }
    f[x] += g[x] * cnt - s;
}

int main() {
    int n, s;
    scanf("%d%d", &n, &s);
    for (int i = 1; i < n; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        add(x, y, z), add(y, x, z);
    }
    dp(s, 0);
    printf("%lld\n", f[s]);
    return 0;
}
```