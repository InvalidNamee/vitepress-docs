---
title: 2025牛客暑期多校训练营9
---
# 2025牛客暑期多校训练营9

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 6 |
| 赛后补 | 3 |

当时非常惊险，最后 20 分钟开出来两道题，排名 284，一共八发罚时，我吃了七发，我在反思了😭。

补题后发现水题相当的多，榜歪了，我们跟着歪了，先做了难的，简单的没时间看了。

之前感觉分开标个人和队友的 AC 数没什么大意义，大多数时候简单题谁切都一样，难题都是大家一起想的办法，于是删了。现在发现标这个题是我做的还是队友做的似乎也没意义。有时候是自己思路出了点漏洞，讨论之后想通了；有时候代码是我代写的，思路是队友给的；有的我自己代码一直挂，他们调出来了，全删了又感觉少了点什么。

但是也没有人定义 <sup style="color: blue">队友</sup> 这个标记是什么意思，标了可以理解为我个人认为队友是最大贡献者吧。

## A. AVL tree

我写的，五发罚时，最后还差点挂了。

最开始我先有的思路，但是思路不太对，我没完全看懂题，没有理解清楚 AVL 树的结构，甚至想着三分峰值，先吃了一发罚时。WA 了一发之后开始反思，突然想到一个性质——**树高一定不会太大**，如果太大指数级增长到一定程度之后不如全删了，“可以”直接枚举高度，这时候对 AVL 树的理解还错的，又改了一版代码，但是没交，因为之前 F 已经 WA 了两发，现在又 WA 了一发，害怕了谨慎的和队友交流了一下，发现我对 AVL 树的理解不对，**不是**完全二叉树最后一层减一半，而是一个嵌套定义的类似斐波那契数列的式子，改了求树高对应新增节点数的代码之后又交了一发，又 WA，然后我们就怀疑是被边界卡了，最后改了好几版，才终于发现**不能直接暴力枚举树高也不能在只删一次低于限制高度的点的前提下 dp**，最后发现乱七八糟的一顿改之后竟然成了一个**非常简单的树形 dp**。这波真怪我，一己之力把一队都带偏了。

```cpp
#include <iostream>
#include <climits>

using namespace std;
typedef long long LL;
const int N = 200010;
LL f[N][30];
int son[N][2], dep[N], cnt[N];

void init() {
    f[0][0] = 0, f[0][1] = 1;
    for (int i = 2; i <= 26; ++i) {
        f[0][i] = f[0][i - 1] + f[0][i - 2] + 1;
    }
}

void dfs(int x) {
    cnt[x] = 1;
    if (son[x][0]) dep[son[x][0]] = dep[x] + 1, dfs(son[x][0]);
    if (son[x][1]) dep[son[x][1]] = dep[x] + 1, dfs(son[x][1]);
    cnt[x] += cnt[son[x][0]] + cnt[son[x][1]];
}

void dp(int x) {
    if (dep[x] == 26) {
        for (int i = 1; i <= 26; ++i) {
            f[x][i] = f[0][i] + cnt[x] - 1;
        }
        f[x][0] = cnt[x];
    }
    if (son[x][0]) dp(son[x][0]);
    if (son[x][1]) dp(son[x][1]);
    f[x][0] = cnt[x];
    for (int i = 1; i <= 26; ++i) {
        if (i == 1) f[x][i] = f[son[x][0]][i - 1] + f[son[x][1]][i - 1];
        else f[x][i] = min(f[son[x][0]][i - 1] + f[son[x][1]][i - 2], min(f[son[x][1]][i - 1] + f[son[x][0]][i - 2], f[son[x][1]][i - 1] + f[son[x][0]][i - 1]));
    }
}

int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d%d", &son[i][0], &son[i][1]);
        }
        dep[1] = 1;
        dfs(1);
        dp(1);
        LL res = LLONG_MAX;
        for (int i = 1; i <= 26; ++i) res = min(res, f[1][i]);
        printf("%lld\n", res);
    }
    return 0;
}
```

## B. Date <sup style="color: blue">队友</sup>

待补

## C. Epoch-making <sup style="color: red">补</sup>

只需要注意到一个性质，如果取了一个入度是 0 的权值大的点，其他入度为零的权值小的点都取了一定不会变劣，然后一个暴搜就搜过去了，只用了 61ms.

唉唉，可惜可惜。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>
#include <bitset>

using namespace std;

const int N = 24;
vector<int> ed[N];
int w[N], deg[N], n, m, res;

void dfs(int msk, int s) {
    if (msk == (1 << n) - 1) {
        res = min(res, s);
        return;
    }
    else if (s > res) return;
    vector<pair<int, int>> vals;
    for (int i = 0; i < n; ++i) {
        if (!(msk >> i & 1) && !deg[i]) {
            vals.emplace_back(w[i], i);
        }
    }
    int bk[N];
    memcpy(bk, deg, sizeof(int) * n);
    sort(vals.begin(), vals.end());
    int pre = 0;
    for (auto &[v, i] : vals) {
        if (pre && v != pre) dfs(msk, s + pre);
        msk |= 1 << i;
        for (int j : ed[i]) deg[j]--;
        pre = v;
    }
    if (pre) dfs(msk, s + pre);
    memcpy(deg, bk, sizeof(int) * n);
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 0; i < n; ++i) scanf("%d", &w[i]);
    for (int i = 0; i < m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        x--, y--;
        ed[x].emplace_back(y);
        deg[y]++;
    }
    res = 0x3f3f3f3f;
    dfs(0, 0);
    printf("%d\n", res);
    return 0;
}
```

## F. Military Training

这道是我写的，并且吃了两发罚时

- 第一发是因为以为是爆 int 了，确实是会爆，但是不只有这个问题；
- 第二发是因为相对关系想错了，如果不平行横纵坐标差值的 min 的 max * 2 + 1 是对的；但是如果是平行的这样就会少算两步，要的应该是第二小的距离，按端点坐标排序之后对应位置作差才对。

当时的代码

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int sx1, sy1, sx2, sy2, tx1, ty1, tx2, ty2;
        scanf("%d%d%d%d%d%d%d%d", &sx1, &sy1, &sx2, &sy2, &tx1, &ty1, &tx2, &ty2);
        if (abs(sx1 - sx2) == abs(tx1 - tx2)) {
            if (sx1 == sx2) {
                if (sy1 > sy2) swap(sx1, sx2), swap(sy1, sy2);
                if (ty1 > ty2) swap(tx1, tx2), swap(ty1, ty2);
                printf("%d\n", max(abs(sx1 - tx1), abs(sy1 - ty1)) * 2);
            }
            else {
                if (sx1 > sx2) swap(sx1, sx2), swap(sy1, sy2);
                if (tx1 > tx2) swap(tx1, tx2), swap(ty1, ty2);
                printf("%d\n", max(abs(sx1 - tx1), abs(sy1 - ty1)) * 2);
            }
        }
        else {
            printf("%d\n", max(min(min(abs(sx1 - tx1), abs(sx1 - tx2)), min(abs(sx2 - tx1), abs(sx2 - tx2))), min(min(abs(sy1 - ty1), abs(sy1 - ty2)), min(abs(sy2 - ty1), abs(sy2 - ty2)))) * 2 + 1);
        }
    }
    return 0;
}
```

后来看题解发现旋转坐标轴 45° 更简单，而且还不容易错，利用的是曼哈顿距离和切比雪夫距离的关系。

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long sx1, sy1, sx2, sy2, tx1, ty1, tx2, ty2;
        scanf("%lld%lld%lld%lld%lld%lld%lld%lld", &sx1, &sy1, &sx2, &sy2, &tx1, &ty1, &tx2, &ty2);
        printf("%lld\n", abs((sx1 + sy1 + sx2 + sy2) - (tx1 + ty1 + tx2 + ty2)) / 2 + abs((sx1 + sx2 - sy1 - sy2) - (tx1 + tx2 - ty1 - ty2)) / 2);
    }
    return 0;
}
```

## G. Permutation <sup style="color: blue">队友</sup>

虽然代码是我写的，而且期间还挂的特别惨，但是这道题差不多就只有我的苦力，我的贡献就是写了份代码，给出了一个正确的隔板法公式，原理是事后才明白的。

当时

- 单调栈条件不慎写反，但是初始化正了，导致调试时候同时改条件和初始化都是错的；
- (罪至死) 组合数求错了，我自己都没想到我把公式写错了 `jc[n] * inv[m] * inv[n - m]`，有一个 inv 不慎写成了 jc；
- (罪不至死) 阶乘乘法逆元不是我这么预处理的，更高效的办法是前求 `inv[n]`，然后倒着乘回去，省下一个 log。

**单调栈**维护最后能选出这个数的最大范围以及，配合**差分前缀和**维护钦定最后选这个数的前提下能选其他数的数量，顺序一定是单增的，可以用隔板算不同分配情况的方案数，最后加上全空。

```cpp
#include <iostream>
#include <cstring>

using namespace std;
typedef long long LL;
const int N = 2000010;
const int mo = 998244353;

int a[N], st[N], s[N], len[N], tp;
LL jc[N], inv[N];

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % mo;
        base = base * base % mo;
        p >>= 1;
    }
    return res;
}

void init() {
    jc[0] = 1;
    for (int i = 1; i <= 2000000; ++i) {
        jc[i] = jc[i - 1] * i % mo;
        inv[i] = power(jc[i], mo - 2);
    }
    inv[0]=1;
}

LL c(int n, int m) {
    //cout << "qwq"<< n << ' ' << m << endl;
    return jc[n] * inv[m] % mo * inv[n - m] % mo;
}

int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        tp = 1;
        a[0] = 0x3f3f3f3f;
        memset(s, 0, sizeof(int) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            while (tp > 1 && a[i] < a[st[tp]]) {
                // cout << st[tp - 1] + 1 << ' ' << i - 1 << endl;
                len[st[tp]] = i - st[tp - 1] - 1;
                s[i]--, s[st[tp - 1] + 1]++;
                tp--;
            }
            st[++tp] = i;
        }
        while (tp > 1) {
            // cout << st[tp - 1] + 1 << ' ' << n << endl;
            len[st[tp]] = n - st[tp - 1];
            s[st[tp - 1] + 1]++;
            tp--;
        }
        LL res = 0;
        for (int i = 1; i <= n; ++i) {
            s[i] += s[i - 1];
            //cout << len[i] << ' ' << s[i] << endl;
            // printf("%d ", s[i]);
            res = (res + c(len[i] + s[i] - 1, s[i]));
        }
        // printf("\n");
        printf("%lld\n", (res + 1 + mo) % mo);

    }
    return 0;
}
```

## H. Counter Streak <sup style="color: red">补</sup>

dp 很简单，稍微复杂一点的地方在怎么把年份映射成连续的整数，题解给出了一种用**蔡勒公式**的做法 (看不懂，好高深，好神奇，记到板子里)。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 100010;
vector<int> a[N];
int f[N][3];

// 蔡勒公式
int zeller (int y, int m, int d) {
    if (m < 3) {
        m += 12;
        y--;
    }
    return 365 * y + y / 4 - y / 100 + y / 400 + (153 * (m - 3) + 2) / 5 + d - 307;
}

int main() {
    int n, y, m, d, hh, mm, tt;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%4d-%2d-%2d %2d:%2d:%2d", &y, &m, &d, &hh, &mm, &tt);
        int t = zeller(y, m, d);
        if (hh < 20) a[i].emplace_back(t - 1);
        a[i].emplace_back(t);
        if (hh + 6 >= 24) a[i].emplace_back(t + 1);
    }
    a[0].emplace_back(0);
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < a[i].size(); ++j) {
            f[i][j] = 1;
            for (int k = 0; k < a[i - 1].size(); ++k) {
                if (a[i - 1][k] == a[i][j]) {
                    f[i][j] = max(f[i][j], f[i - 1][k]);
                }
                else if (a[i - 1][k] + 1 == a[i][j]) {
                    f[i][j] = max(f[i][j], f[i - 1][k] + 1);
                }
            }
        }
    }
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < 3; ++j) {
            res = max(res, f[i][j]);
        }
    }
    printf("%d 1\n", res);
    return 0;
}
```


## J. Too many catgirls nya

本日签到题，我当时看到他的时候还愣了几秒，真就这么简单吗。

直到我实在看不出什么端倪了，交了一发过了。

甚至真有人开了 1000 行注释，输出了数字 + nya，每行代码后面都加 nya 无视编译错误，最后喜提编译错误。

```python
n = int(input())
print(n, 'nya')
for _ in range(n):
    s = input()
    print(s, 'nya')
```

## L. Ping Pong <sup style="color: red">补</sup>

这道题其实比上面的 A, B 和 G 都简单，但是没有早点发现他，很可惜，走 2n - 2 步一定会进入一个长度为 2n - 2 的循环，前面个暴力，后面利用循环节优化一下。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 200010;

int a[N], res[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        queue<int> q;
        int n, k, mx = 0;
        scanf("%d%d", &n, &k);
        fill(res, res + n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            mx = max(a[i], mx);
            q.emplace(i);
        }
        q.pop();
        int cur = 1, t = 0;
        for (int j = 1; j < 2 * n - 1; ++j) {
            if (!k) break;
            int p = q.front();
            q.pop();
            res[cur]++, res[p]++;
            if (t == n - 1 || a[cur] < a[p]) {
                t = 1;
                q.emplace(cur);
                cur = p;
            }
            else {
                t++;
                q.emplace(p);
            }
            k--;
        }
        int t1 = k / (2 * n - 2), t2 = k % (2 * n - 2);
        for (int j = 1, i = 1; j <= 2 * n - 2; ++j) {
            int p = q.front();
            q.pop();
            if (j <= t2) res[cur] += t1 + 1, res[p] += t1 + 1;
            else res[cur] += t1, res[p] += t1;
            if (t == n - 1 || a[cur] < a[p]) {
                q.emplace(cur);
                cur = p, t = 1;
            }
            else {
                t++;
                q.emplace(p);
            }
        }
        for (int i = 1; i <= n; ++i) printf("%d ", res[i]);
        printf("\n");
    }
    return 0;
}
```

## M. Digit Sum	<sup style="color: blue">队友</sup>

本日签到题，被队友稳稳拿下。