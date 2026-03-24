---
title: 2025组队训练赛第 16 场
---
# 2025组队训练赛第 16 场

2025-09-25 所有欠的题都补上了。

## 📢 Announcement

- **Q:** 前面的组队训练为什么都没有？
- **A:** 组队训练的时候在上小学期，偶尔会打打，但是没空写博客。

## A. Scrambled Scrabble

带悔贪心，先贪心的构造一个，大概策略是

- 因为 y 比较灵活，先暂时拎出来不管，最后补空子用；
- 因为 n 和 g 能构成组合，在边界情况下能塞入更多的辅音字母，所以辅音优先选 n，第二选其他，其他也没有了再选 g，g 也没有了就用 y；
- 元音没有什么讲究，优先用不是 y 的，不够了用 y 补。

按照这个策略构造下来，最后剩余的 y 一定小于 3 个，分情况讨论

- 如果剩余 0 个，再调整都不会更优，直接输出答案；
- 如果剩余 1 个或 2 个，考虑 g 作为辅音单独填入的情况，如果还有单独的 n，**用多余的 y 把 g 腾出来然后 g 给 n**。

统计这个反悔的操作比较复杂，很容易挂，**不要学我随意起了几个变量名**，挂了之后一看自己都看不懂自己写了什么。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length();
    int yuan = 0, y = 0, fu = 0, cn = 0, cg = 0; // 元音，i，辅音，n，g 的个数
    for (char c : s) { 
        if (c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U') {
            yuan++;
        }
        else if (c == 'Y') y++;
        else if (c == 'N') cn++;
        else if (c == 'G') cg++;
        else fu++;
    }
    int res = 0, tg = cn, ug = 0; // 答案，用过的 n 的数量，用过的 g 的数量（显然这是后加的，和前面的统计方法不一样，但是统计的是一类东西）
    while (true) {
        int bk[6] = {yuan, y, fu, cn, cg, ug};
        if (cn) cn--;
        else if (fu) fu--;
        else if (cg) cg--, ug++;
        else if (y) y--;
        else break;
        if (yuan) yuan--;
        else if (y) y--;
        else {
            yuan = bk[0], y = bk[1], fu = bk[2], cn = bk[3], cg = bk[4], ug = bk[5];
            break;
        }
        if (cn) cn--;
        else if (fu) fu--;
        else if (cg) cg--, ug++;
        else if (y) y--;
        else {
            yuan = bk[0], y = bk[1], fu = bk[2], cn = bk[3], cg = bk[4], ug = bk[5];
            break;
        }
        res += 3;
    }
    tg -= cn;
    res += min(tg, cg);
    tg -= min(tg, cg); // 第一次挂是因为这里少减了
    cg = max(0, cg - tg);
    if (y == 1) {
        if (ug && tg) res++;
    } 
    else if (y == 2) {
        if (ug >= 2 && tg >= 2) res += 2;
        else if (ug && tg) res++;
    }
    cout << res << endl;
    return 0;
}
```

## B. ICPC Square

- 先把 d < s 特判掉，因为不能动；
- 如果 n 特别大，最优的方案是把 s 先趋近于 d，然后乘二；
- 如果 n 不是特别大，考虑验证 $\lfloor \frac{n}{s} \rfloor \cdot s$ 合不合法，如果合法，那就是他了；如果不合法，$\left( \lfloor \frac{n}{s} \rfloor - 1\right) \cdot s$ 一定合法。不合法只有一种可能，就是 s 是一个大的奇数，那么只需要减成偶数，最后一步乘二即可达到。

```cpp
#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>

using namespace std;

typedef long long LL;

LL n, d, s;

bool check(LL t) {
    int l = sqrt(t);
    vector<LL> v;
    for (int i = 2; i <= l; ++i) {
        if (t % i == 0) {
            while (t % i == 0) {
                t /= i;
                v.emplace_back(i);
            }
        }
    }
    if (t != 1) v.emplace_back(t);
    reverse(v.begin(), v.end());
    LL cur = s;
    for (LL p : v) {
        if (cur * (p - 1) > d) return false;
        else cur *= p;
    }
    return true;
}

int main() {
    scanf("%lld%lld%lld", &n, &d, &s);
    if (s > d) printf("%lld\n", s);
    else {
        LL t = (d / s) * s;
        if (t * 2 <= n) printf("%lld\n", t * 2);
        else {
            t = n / s;
            if (!check(t)) printf("%lld\n", s * (t - 1));
            else printf("%lld\n", s * t);
        }
    }
    return 0;
}
```

## C. Saraga

枚举公共字符 c，找到 s 除了首字符的第一次出现，t 除了尾字符的最后一次出现，找个最短的。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;

char s[N], t[N];

int main() {
    int n, m;
    scanf("%s%s", s, t);
    n = strlen(s), m = strlen(t);
    char c = 0;
    int l = n, r = 0;
    for (char i = 'a'; i <= 'z'; ++i) {
        int tl = -1, tr = -1;
        for (int k = 1; k < n; ++k) {
            if (s[k] == i) {
                tl = k;
                break;
            }
        }
        for (int k = m - 2; k >= 0; --k) {
            if (t[k] == i) {
                tr = k;
                break;
            }
        }
        if (tl != -1 && tr != -1 && tl - tr < l - r) {
            l = tl, r = tr;
            c = i;
        }
    }
    if (!c) {
        printf("-1\n");
    }
    else {
        for (int i = 0; i < l; ++i) putchar(s[i]);
        putchar(c);
        for (int i = r + 1; i < m; ++i) putchar(t[i]);
        putchar('\n');
    }
    return 0;
}
```

## G. X Aura<sup style="color: red">补</sup>

这道没时间了，怪我写挂字符串哈希和二分拖慢进度了。

因为图是强连通的，所以只要有一个负环，全都得是 INVALID，**没有负环就意味着所有的环都是 0**，因为保证 x 是奇数，反着走的长度一定是正着走的相反数，如果不是 0，这个环正着走反着走一定有一个是负环。所有环都是 0 意味着这是个有势场的场函数，路径长度与路径选择无关，横着竖着维护两组前缀和，每组数据都直着走两段即可。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 1010;
int a[N][N];
LL row[N][N], col[N][N];

int get_dis(int i, int j, int k, int l, int x) {
    int res = 1, t = a[k][l] - a[i][j];
    for (int i = 0; i < x; ++i) res *= t;
    return res;
}

int main() {
    int n, m, x;
    scanf("%d%d%d", &n, &m, &x);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            scanf("%1d", &a[i][j]);
        }
    }
    bool valid = true;
    for (int i = 1; i < n; ++i) {
        for (int j = 1; j < m; ++j) {
            if (get_dis(i, j, i + 1, j, x) + get_dis(i + 1, j, i + 1, j + 1, x) + get_dis(i + 1, j + 1, i, j + 1, x) + get_dis(i, j + 1, i, j, x) != 0) {
                valid = false;
                break;
            }
        }
        if (!valid) break;
    }
    int q;
    scanf("%d", &q);
    if (!valid) {
        while (q--) printf("INVALID\n");
    }
    else {
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                col[i][j] = col[i - 1][j] + get_dis(i - 1, j, i, j, x);
                row[i][j] = row[i][j - 1] + get_dis(i, j - 1, i, j, x);
            }
        }
        while (q--) {
            int i, j, k, l;
            scanf("%d%d%d%d", &i, &j, &k, &l);
            LL res = 0;
            // i -> k
            if (i <= k) res -= col[k][j] - col[i][j];
            else res += col[i][j] - col[k][j];
            // j -> l
            if (j <= l) res -= row[k][l] - row[k][j];
            else res += row[k][j] - row[k][l];
            printf("%lld\n", res);
        }
    }
    return 0;
}
```

## H. Missing Separators

这个 oj 的数据太水或者是 spj 错了，一些不正确的贪心做法也判对了（为什么没判对我的😭）

对于两个连续的子段，两个子段能成为字典的连续的两次，当且仅当第一个是第二个的前缀或两个子段 lcp 后的第一个字符满足小于关系，找 lcp 可以用二分 + 字符串哈希。

$f_{i, j}$ 维护上一刀切在 i 前面，下一刀切在 j 前面的最大段数，枚举 i 和 j，考虑二分从 i，j 开始的 lcp 的长度(记为 l)，检验下一个字符是否合法或者是否是前缀，如果满足其一，$f_{i, j}$ 能转移到 $f_{j, j + l + 1}$，即 $f_{j, j + l + 1} = \max \{ f_{i, j} + 1, f_{j, j + l + 1} \}$，当然后续的点也可以转移，遍历的时候前缀 max 一下即可，时间复杂度是 $O(n^2 \log n)$，正好能卡过。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 5010;
char s[N];
int f[N][N], g[N][N];
uint64_t h1[N], p1[N], h2[N], p2[N];
vector<pair<int, int>> res;

bool check(int i, int j, int l) {
    return h2[i + l - 1] - h2[i - 1] * p2[l] == h2[j + l - 1] - h2[j - 1] * p2[l];
}

int main() {
    int n;
    scanf("%s", s + 1);
    n = strlen(s + 1);
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; ++i) {
        h2[i] = h2[i - 1] * 1331 + (uint64_t)(s[i] - 'A' + 1);
        p2[i] = p2[i - 1] * 1331;
    }
    memset(f, -0x3f, sizeof(f));
    f[1][0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = i; j <= n; ++j) {
            if (f[i][j] <= f[i][j - 1]) {
                g[i][j] = g[i][j - 1];
                f[i][j] = f[i][j - 1];
            }
            int l = 0, r = min(n - j + 1, j - i);
            while (l < r) {
                int mid = l + r + 1 >> 1;
                if (check(i, j, mid)) l = mid;
                else r = mid - 1;
            }
            if (l == j - i || s[j + l] > s[i + l]) {
                if (f[j][j + l + 1] < f[i][j] + 1) {
                    g[j][j + l + 1] = i;
                    f[j][j + l + 1] = f[i][j] + 1;
                }
            }
        }
        if (f[i][n + 1] <= f[i][n]) {
            g[i][n + 1] = g[i][n];
            f[i][n + 1] = f[i][n];
        }
    }
    int p = 0;
    for (int i = 1; i <= n; ++i) {
        if (f[i][n + 1] > f[p][n + 1]) p = i;
    }
    printf("%d\n", f[p][n + 1]);
    int l = p, r = n + 1;
    while (l != r) {
        res.emplace_back(l, r);
        swap(l, r);
        l = g[r][l];
    }
    reverse(res.begin(), res.end());
    for (auto [l, r] : res) {
        for (int i = l; i < r; ++i) putchar(s[i]);
        putchar('\n');
    }
    return 0;
}
```

## I. Microwavable Subsequence

我自己想的时候没完全想出来，我想到用树状数组维护某个元素是否出现了，只能写出来一个 $m^2 log n$ 的做法，这里可以直接前缀和，变成 $m^2$，反正都是 T。

看了题解之后恍然大悟，考虑之前的一道签到题 [P1638 逛画展](https://www.luogu.com.cn/problem/P1638)，用相同的思路就可以做到用树状数组同时维护所有的类型的最后一次出现，于是就可以枚举每个位置 i，直接在树状数组上查出来最后一次出现夹在 i 和这个元素上次出现位置之间的元素个数，问题就解决了。因为这里统计的是对数，每种组合都需要加个 1。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int N = 300010;

int head[N], ne[N];
int tr[N];
int n, m;

void add(int x, int v) {
    for (; x <= n; x += x & -x) {
        tr[x] += v;
    }
}

int query(int x) {
    int res = 0;
    for (; x; x -= x & -x) {
        res += tr[x];
    }
    return res;
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        ne[i] = head[t];
        head[t] = i;
    }
    long long res = 0;
    for (int i = 1; i <= n; ++i) {
        res += query(i) - query(ne[i]);
        if (ne[i]) add(ne[i], -1);
        add(i, 1);
    }
    int c = 0;
    for (int i = 1; i <= m; ++i) if (head[i]) c++;
    printf("%lld\n", res + (LL)c * (c - 1) / 2 + (LL)c * (m - c));
    return 0;
}
```

## M. Mirror Maze

按要求模拟即可，非常好过。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;

const int N = 210;
char mp[N][N];
bool vis[N][N];
int n, m, cnt_mirror;
vector<string> res;

bool check(int tx, int ty, int x, int y) {
    memset(vis, 0, sizeof(vis));
    int t = 0;
    do {
        x += tx, y += ty;
        // cout << x << ' ' << y << endl;
        if (mp[x][y] == '/' || mp[x][y] == '\\') {
            if (mp[x][y] == '/') {
                swap(tx, ty);
                tx *= -1, ty *= -1;
            }
            else {
                swap(tx, ty);
            }
            if (vis[x][y]) continue;
            else vis[x][y] = true, t++;
        } 
    } while (x > 0 && x <= n && y > 0 && y <= m);
    return t == cnt_mirror;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        cin >> (mp[i] + 1);
        for (int j = 1; j <= m; ++j) {
            if (mp[i][j] != '.') cnt_mirror++;
        }
    }
    for (int i = 1; i <= m; ++i) {
        if (check(1, 0, 0, i)) res.emplace_back("N" + to_string(i));
    }
    for (int i = 1; i <= m; ++i) {
        if (check(-1, 0, n + 1, i)) res.emplace_back("S" + to_string(i));
    }
    for (int i = 1; i <= n; ++i) {
        if (check(0, -1, i, m + 1)) res.emplace_back("E" + to_string(i));
    }
    for (int i = 1; i <= n; ++i) {
        if (check(0, 1, i, 0)) res.emplace_back("W" + to_string(i));
    }
    cout << res.size() << endl;
    for (string s : res) cout << s << ' ';
    if (!res.empty()) cout << endl;
    return 0;
}
```
