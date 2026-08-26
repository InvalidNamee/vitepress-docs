---
title: 2025牛客暑期多校训练营5
---
# 2025牛客暑期多校训练营5

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 3 |
| 赛后补 | 4 |

做了 3 个补了四个，显然是赛场上出了点问题，做完最简单的三个之后我们被榜误导了，H 题很简单但是我们没看，先看了比较难的 K 题，K 题思路出来之后最终 40min 没有战胜，然后三道题遗憾离场了，排名是 373.

## A. Entangled Coins <sup style="color: red">补</sup>

这道题属实感觉有点不应该，我中间推对了很多结论，但是后面不知道怎么又给自己推翻了。

我思维卡在的点是
- 操作奇数次和偶数次得到的式子不一样，没有想到把奇数拆成一个 1 和一个偶数分析；
- 只操作偶数次的结论其实已经大致得出了，但是边界没有处理好，晕进去了，没有想到 n < 2k 会卡边界的情况下用互相抵消的思想把 k 转化成 n - k 优化掉恶心的边界情况。

应该继续往下想的，我看完题第一句就说这题的结论应该不复杂……实际上也真不复杂，但是赛场上还是没想到

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long n, k, s, t;
        scanf("%lld%lld%lld%lld", &n, &k, &s, &t);
        if (s == t) printf("0\n");
        else if (n == k) {
            if (s + t == n) printf("1\n");
            else printf("-1\n");
        }
        else if ((t - s & 1) && (k % 2 == 0)) printf("-1\n");
        else if (t - s & 1) {
            int l = abs(s - k), r = min(s + k, 2 * n - s - k);
            if (l <= t && t <= r) {
                printf("1\n");
                continue;
            }
            int d = min(abs(l - t), abs(r - t));
            k = min(k, n - k);
            printf("%lld\n", 1 + 2 * ((d + k * 2 - 1) / (k * 2)));
        }
        else if (k & 1) {
            int d = abs(s - t);
            k = min(k, n - k);
            printf("%lld\n", 2 * ((d + k * 2 - 1) / (k * 2)));
        }
        else {
            int l = abs(s - k), r = min(s + k, 2 * n - s - k);
            if (l <= t && t <= r) {
                printf("1\n");
                continue;
            }
            int d1 = min(abs(l - t), abs(r - t)), d2 = abs(s - t);
            k = min(k, n - k);
            printf("%lld\n", min(1 + 2 * ((d1 + k * 2 - 1) / (k * 2)), 2 * ((d2 + k * 2 - 1) / (k * 2))));
        }
    }
    return 0;
}
```

## C. Array Deletion Game <sup style="color: red">补</sup>

我是对博弈论先天性抗拒，但是这道题的性质还真不难，问题也是我们没有人看这道题。逆向思维很容易想到，比较难注意到的性质是，因为左右各差 1 个位置，l + r 相同的要么全必胜要么全必负，二分卡到中间最小的那个合法区间，现在左右端点有一个就不能动了，把移动左端点和移动右端点的情况分别讨论一下取并。这个转化也很巧妙。

```cpp
#include <iostream>

using namespace std;
const int N = 100010;

int a[N];

int main() {
    int n, q;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        a[i] += a[i - 1];
    }
    scanf("%d", &q);
    while (q--) {
        int s;
        scanf("%d", &s);
        int l = 0, r = n / 2;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (a[n - mid] - a[mid] > s) l = mid;
            else r = mid - 1;
        }
        int d = l;
//         cout << d << ' ';
        l = 1 + d, r = n - d + 1;
        while (l < r) {
            int mid = l + r >> 1;
            if (a[n - d] - a[mid - 1] <= s) r = mid;
            else l = mid + 1;
        }
//         cout << l << ' ' ;
        if (l - d & 1) {
//             cout << endl;
            printf("Alice\n");
            continue;
        }
        l = d, r = n - d;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (a[mid] - a[d] <= s) l = mid;
            else r = mid - 1;
        }
//         cout << l << endl;
        if (n - d - l + 1 & 1) {
            printf("Alice\n");
        }
        else printf("Bob\n");
    }
    return 0;
}
```

## E. Mysterious XOR Operation

这道题是我想的 + 我做的，想到的有点慢了，如果没有限制条件，传统的做法就是对每个二进制位分别前缀和，对于每个数枚举数位和前缀和比较，统计答案。加上第奇数个 1 的限制之后统计就稍微复杂了，本来我想着要 dp，但是是不合理的，如果做了线性 dp 相当于把所有数位拆开排列组合了一遍，显然不对；应该做的是统计。后来灵机一动想到无论如何两个后缀 1 个数都是偶数的数的后缀异或之后 1 的个数一定还是偶数，因为只能两个 1 相消偶数 + 偶数 - 偶数还是偶数，于是就解决了。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
int cnt[40][2][2];
 
int main() {
    int n;
    scanf("%d", &n);
    long long res = 0;
    for (int i = 0; i < n; ++i) {
        int t;
        scanf("%d", &t);
        for (int j = 0, k = 0; j < 32; ++j) {
            int c = t >> j & 1;
            res += (long long)cnt[j][c ^ 1][k] << j;
            k ^= t >> j & 1;
        }
        for (int j = 0, k = 0; j < 32; ++j) {
            cnt[j][t >> j & 1][k]++;
            k ^= t >> j & 1;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## H. VI Civilization <sup style="color: red">补</sup>

这道是最可惜的一道，似乎可能是题干比较长[?]没人做，实际上很简单，我们都被骗了，一眼都没看，其实就是一个简单的二分和一个简单的 dp。

虽然但是，如果我看到了去敲代码了可能会弄出来一大堆 Floating Point Exception. 后面补题的时候没特判 mid == 0 的情况出了好几次问题。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 110;
int a[N], k[N], b[N], c[N]; // 需要的科技点 科技点增量 尤里卡需要的生产力 尤里卡减少的科技点
int f[N][N][N]; // 前 i 轮使用了 j 次生产力完成了 k 个科技
int m, s, t, n; // 科技点 胜利需要的科技点 回合限制 总个数

bool check(int mid) {
    int res = 0;
    for (int i = 1; i <= t; ++i) {
        for (int j = 0; j <= i; ++j) {
            for (int l = 0; l <= n; ++l) {
                f[i][j][l] = -0x3f3f3f3f;
                f[i][j][l] = max(f[i][j][l], f[i - 1][j][l] + m + k[l]);
                if (i - (a[l] + m + k[l - 1] - 1) / (m + k[l - 1]) >= 0)
                    f[i][j][l] = max(f[i][j][l], f[i - (a[l] + m + k[l - 1] - 1) / (m + k[l - 1])][j][l - 1]);
                if (mid != 0 && i - (a[l] - c[l] + m + k[l - 1] - 1) / (m + k[l - 1]) >= 0 && j - (b[l] + mid - 1) / mid >= 0)
                    f[i][j][l] = max(f[i][j][l], f[i - (a[l] - c[l] + m + k[l - 1] - 1) / (m + k[l - 1])][j - (b[l] + mid - 1) / mid][l - 1]);
                if (f[i][j][l] >= s) return true;
            }
        }
    }
    return false;
}

int main() {
    scanf("%d%d%d%d", &m, &s, &t, &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d%d%d", &a[i], &k[i], &b[i], &c[i]);
        k[i] += k[i - 1];
    }
    memset(f, -0x3f, sizeof(f));
    f[0][0][0] = 0;
    int l = 0, r = 1000000001;
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    printf("%d\n", l == 1000000001 ? -1 : l);
    return 0;
}
```

## I. Block Combination Minimal Perimeter

超级大水题。

```cpp
#include <iostream>

using namespace std;

int main() {
	int n;
	cin >> n;
	if (n & 1) cout << 2 * ((n + 1) / 2 + n) << endl;
	else cout << 2*((n / 2) + n + 1) << endl;
	return 0;
}
```

## J. Fastest Coverage Problem <sup style="color: blue">队友</sup>

这也是一道简单题，逻辑上来说二分答案就可以，实际上当时写代码的时候并不顺利，WA 了两次才过。

后面我补题的时候也 WA 了好几次，而且 97.6%.

- 没有处理一个 1 都没有的清况；
- 处于最角上四个不合法块夹出来的矩形的中心正好对着格的间隙……这个情况我感觉不太好处理，于是干脆多遍历了一遍，枚举中心点，验证四个角，常数 * 2，变相解决了这个边界问题。

```cpp
#include <iostream>
#include <queue>
#include <vector>
#include <climits>

using namespace std;

vector<vector<int>> mp, f;
int n, m;

bool check(int mid) {
    int mnxpy = INT_MAX, mnxmy = INT_MAX, mxxpy = INT_MIN, mxxmy = INT_MIN;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            // cout << f[i][j] << ' ';
            if (f[i][j] > mid) {
                mnxpy = min(mnxpy, i + j);
                mnxmy = min(mnxmy, i - j);
                mxxpy = max(mxxpy, i + j);
                mxxmy = max(mxxmy, i - j);
            }
        }
        // cout << endl;
    }
    if (mxxpy == INT_MIN) return true;
    else {
        // cout << mxxpy << ' ' << mnxpy << ' ' << mxxmy << ' ' << mnxmy << endl;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                if (max(max(mxxpy - i - j, i + j - mnxpy), max(mxxmy - i + j, i - j - mnxmy)) <= mid) {
                    // cout << i << ' ' << j << ' ' << max(max(mxxpy - i - j, i + j - mnxpy), max(mxxmy - i + j, i - j - mxxmy)) << endl;
                    return true;
                }
            }
        }
        return false;
    }
}

int main() {
    scanf("%d%d", &n, &m);
    mp = vector<vector<int>>(n, vector<int>(m));
    f = vector<vector<int>>(n, vector<int>(m, n * m));
    queue<pair<int, int>> q;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            scanf("%d", &mp[i][j]);
            if (mp[i][j]) {
                f[i][j] = 0;
                q.push({i, j});
            }
        }
    }
    int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
    while (!q.empty()) {
        auto s = q.front();
        q.pop();
        for (int i = 0; i < 4; ++i) {
            auto t = s;
            t.first += dx[i], t.second += dy[i];
            if (t.first >= 0 && t.first < n && t.second >= 0 && t.second < m && f[t.first][t.second] == n * m) {
                f[t.first][t.second] = f[s.first][s.second] + 1;
                q.push(t);
            }
        }
    }
    int l = 0, r = n * m;
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    printf("%d\n", l);
    return 0;
}
```

## K. Perfect Journey <sup style="color: red">补</sup>

佬们放着简单的 H 不做，都来 K 题当卡常高手了……

树上路径只要两个端点确定了那就是一定的，只考虑关键边下到的节点构成的虚树的话顶多只有 m<sup>2</sup> 种路径，只能有 m<sup>2</sup> 种合法的 bitmask，然后做状压 dp，如果常数优秀的话可以恰好过了。

**离谱的问题:**

最后的状压 dp 里有这么一行代码

```cpp
way[j | mask[i]] = ((long long)way[j | mask[i]] + (long long)way[j] * cnt[i] % MOD) % MOD;
```

- 最快的情况，第一个 long long 不加，同时后面的乘法取模
- 慢 600 ms 的情况，第一个 long long 加上，同时后面的乘法取模
- 慢 400 ms 的情况，第一个 long long 不加，同时后面不取模

那个佬可以解释一下为什么😭

```cpp
#include <iostream>
#include <cstring>
#include <bitset>

using namespace std;

const int N = 200010;
const int MOD = 998244353;
int head[N], ver[N * 2], ne[N * 2], tot = 1;
int f[N], fa[N];
bool flag[N];
int id[N];
int mask[N], cnt[N];
int g[1 << 22], way[1 << 22];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x) {
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa[x]) continue;
        fa[y] = x;
        dfs(y);
    }
}

void dfs2(int x) {
    if (flag[x]) f[x] |= 1 << id[x];
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa[x]) continue;
        f[y] |= f[x];
        dfs2(y);
    }
}

int main() {
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    dfs(1);
    for (int i = 0; i < m; ++i) {
        int t;
        scanf("%d", &t);
        int x = ver[t * 2], y = ver[t * 2 ^ 1];
        if (fa[y] == x) swap(x, y);
        flag[x] = true;
        id[x] = i;
    }
    dfs2(1);
    int siz = 0;
    while (k--) {
        int x, y;
        scanf("%d%d", &x, &y);
        int cur_mask = f[x] ^ f[y];
        bool found = false;
        for (int i = 0; i < siz; ++i) {
            if (cur_mask == mask[i]) {
                found = true;
                cnt[i]++;
                break;
            }
        }
        if (!found) {
            mask[siz] = cur_mask, cnt[siz] = 1;
            siz++;
        }
    }
    memset(g, 0x3f, sizeof(g));
    g[0] = 0, way[0] = 1;
    for (int i = 0; i < siz; ++i) {
        for (int j = 0; j < (1 << m); ++j) {
            if (g[j | mask[i]] > g[j] + 1) {
                g[j | mask[i]] = g[j] + 1;
                way[j | mask[i]] = (long long)way[j] * cnt[i] % MOD;
            }
            else if (g[j | mask[i]] == g[j] + 1) {
                way[j | mask[i]] = (way[j | mask[i]] + (long long)way[j] * cnt[i] % MOD) % MOD;
            }
        }
    }
    if (way[(1 << m) - 1]) printf("%d %d\n", g[(1 << m) - 1], way[(1 << m) - 1]);
    else printf("-1\n");
    return 0;
}
```
