---
title: 2025春训第二十二场
---
# 2025春训第二十二场

## A. 染色

数据非常小，直接暴力就可以，非常保险。

```cpp
#include <iostream>

using namespace std;

int main() {
    int l1, r1, l2, r2;
    cin >> l1 >> r1 >> l2 >> r2;
    int res = 0;
    for (int i = 0; i <= 100; ++i) {
        if (l1 <= i && i < r2 && l2 <= i && i < r1) {
            res++;
        }
    }
    cout << res << endl;
    return 0;
}
```

## **B. 石头称重**

本来很简单的题刚开始被我想复杂了，当然，还有别的因素影响，导致卡了不到一个小时……

其实很简单，因为**前面元素的和一定不大于后面的元素**，所以情况一共有 $2^n$ 种，而且选后面的无论如何都比任意选前面的大。

这让我想到了**二进制**，每个数可以看做一个数位，选和不选是 0 和 1，完全满足上面的规律，例如 3(110) 一定小于 4(001)。

因为第一个二进制数是 0，我们令 k = k - 1，这样就完全和二进制对上了，接下来只需要对 k 进行二进制分解把对应的位置加上就是答案。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

const int N = 60;
long long w[N], s[N], k;
int n;

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &w[i]);
        s[i] = s[i - 1] + w[i];
    }
    scanf("%lld", &k);
    if (k > (1ll << n)) printf("-1\n");
    else {
        k--;
        long long res = 0;
        for (int i = 0; i < n; ++i) {
            if (k >> i & 1) res += w[i + 1];
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## **C. 字符串**

这道题也有那么一点纸老虎的样子，看着无从下手，但是如果发现了就非常简单。

先考虑极限的情况，再考虑一般情况

* 区间长度为 2，两个字符必须不同；
    
* 区间长度为 3，三个字符必须互不相同；
    
* 区间长度为 4，允许一个字符在两端各出现一次；
    
* 长度更长的区间如果出现最多的字符**间隔都不小于 2** 依然是合法的。
    

得出结论，只要相同字符间隔 ≥ 2 即可。于是就好办了，开一个状态 $f_{i, j, k}$ 表示第 i 个位置选了 j，上一个位置选了 k 的方案数，线性 dp 即可。

一个位置的字符选择受到前两个字符的影响，所以需要同时记录两个状态，这样从 i - 1 到 i 的时候就可以做到不重不漏。

```cpp
#include <iostream>

using namespace std;

const int N = 5010;
const int MOD = 998244353;

char s[N];
int cnt[N];
long long f[N][27][27];

int main() {
    int n;
    scanf("%d", &n);
    scanf("%s", s + 1);
    f[0][26][26] = 1; // 用了一种不可能的情况表示边界，这种情况会在 i = 3 的时候消失
    for (int i = 1; i <= n; ++i) {
        if (s[i] != '?') {
            int t = s[i] - 'a';
            for (int j = 0; j <= 26; ++j) {
                for (int k = 0; k <= 26; ++k) {
                    if (j == t || k == t) continue;
                    f[i][t][j] += f[i - 1][j][k];
                    f[i][t][j] %= MOD;
                }
            }
        }
        else {
            for (int t = 0; t < 26; ++t) {
                for (int j = 0; j <= 26; ++j) {
                    for (int k = 0; k <= 26; ++k) {
                        if (j == t || k == t) continue;
                        f[i][t][j] += f[i - 1][j][k];
                        f[i][t][j] %= MOD;
                    }
                }
            }
        }
    }
    long long res = 0;
    for (int i = 0; i <= 26; ++i) {
        for (int j = 0; j <= 26; ++j) {
            res = (res + f[n][i][j]) % MOD;
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## **D. 喵喵**

这道题相对简单一点（因为虽然流程有点麻烦，但是一看容易看出来办法）

求一下最短路同时记录**编号最小的前驱**，结束后从 1 号开始沿着记录的**最短路的逆路径跑 dfs**，**在搜索树上树形 dp** 统计答案即可。

```cpp
#include <iostream>
#include <queue>
#include <vector>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 10010;

vector<pair<int, int>> ed[N];
int a[N], dis[N], pre[N], t;
long long res;
bool vis[N];

void dijkstra() {
    memset(dis, 0x3f, sizeof(dis));
    priority_queue<pair<int, int>> q;
    dis[1] = 0;
    q.push({0, 1});
    while (!q.empty()) {
        int x = q.top().second;
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (auto [i, y] : ed[x]) {
            if (dis[y] > dis[x] + i) {
                dis[y] = dis[x] + i;
                pre[y] = x;
                q.push({-dis[y], y});
            }
            else if (dis[y] == dis[x] + i) {
                pre[y] = min(pre[y], x);
            }
        }
    }
}

void dfs(int x, int l) {
    if (vis[x]) return;
    vis[x] = true;
    for (auto [i, y] : ed[x]) {
        if (vis[y]) continue;
        if (x == pre[y]) {
            dfs(y, l + i);
            a[x] += a[y];
        }
    }
    res = max(res, (long long)a[x] * (l - t));
}

int main() {
    int n, m;
    scanf("%d%d%d", &n, &m, &t);
    for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        ed[x].push_back({z, y});
        ed[y].push_back({z, x});
    }
    dijkstra();
    memset(vis, 0, sizeof(vis));
    for (int i = 1; i <= n; ++i) {
        sort(ed[i].begin(), ed[i].end(), [](pair<int, int> a, pair<int, int> b) { 
            return a.second < b.second;
        });
    }
    dfs(1, 0);
    printf("%lld\n", res);
    return 0;
}
```

## **E. 变量定义**

比较水，没什么好说的，按要求做就行。

```python
keys = ["include", "using", "namespace", "return", "main", "int", "float", "double", "string", "char"]
n = int(input().strip())

def check(s: str):
    if s in keys:
        return 'No'
    if s[0] == '_' or s[0].isalpha():
        for c in s:
            if c != '_' and not c.isalnum():
                return 'No'
        return 'Yes'
    else:
        return 'No'

for _ in range(n):
    s = input()
    print(check(s.strip()))
```

## **F. 跳远比赛**

我因为 check 函数写挂$\textcolor{green}{+11}$……

典型的二分答案题，二分最大值，贪心验证即可。具体的，验证的时候应该贪心的取尽可能最左边的点，给后的选择留更多的余地，感性上这是正确的（事实上也是正确的）。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 100010;
const long long MAXN = 1000000000000000000;
typedef long long LL;
pair<LL, LL> a[N];
int n, m;

bool check(LL mid) {
    if (mid == 0) return true;
    LL cnt = 0, ls = -MAXN;
    for (int i = 1; i <= m; ++i) {
        // 这里的判断逻辑很容易挂，别问我怎么知道的
        if (ls + mid > a[i].second) continue;
        if (a[i].first - ls < mid) ls = ls + mid;
        else ls = a[i].first;
        cnt += (a[i].second - ls) / mid + 1;
        ls += (a[i].second - ls) / mid * mid;
    }
    return cnt >= n;
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        scanf("%lld%lld", &a[i].first, &a[i].second);
    }
    sort(a + 1, a + m + 1);
    LL l = 0, r = MAXN;
    while (l < r) {
        LL mid = (l + r + 1) >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    printf("%lld\n", l);
    return 0;
}
```

## **G. 宝藏**

这道题也很简单，看着像是个图论，实际上是个二维 dp，图都不用建出来。记 $f_{i, j} $ 表示走到 i 点用了 j 体力的时宝藏价值的最大值。$f_{i, 0}$ 其实就是 i 山洞领一次的宝藏价值。更新状态时从低到高枚举 j，对于每一个 j 枚举所有边

$$
f_{y, j} = \max\{{f_{y, j}, f_{x, j - w} + A_y}\}
$$

把所有的 f 取 max 可以。

```cpp
#include <iostream>

using namespace std;

const int M = 10010;
const int N = 1010;
struct ed {
    int x, y, z;
} ed[M];
int f[N][510];

int main() {
    int res = 0;
    int n, m, t;
    scanf("%d%d%d", &n, &m, &t);
    for (int i = 1; i <= n; ++i) scanf("%d", &f[i][0]);
    for (int i = 1; i <= m; ++i) scanf("%d%d%d", &ed[i].x, &ed[i].y, &ed[i].z);
    for (int i = 1; i <= t; ++i) {
        for (int j = 1; j <= m; ++j) {
            auto &[x, y, z] = ed[j];
            if (i >= z) {
                f[y][i] = max(f[y][i], f[x][i - z] + f[y][0]);
                res = max(res, f[y][i]);
            }
        }
    }
    printf("%d\n", res);
    return 0;
}
```