---
title: 2025夏季个人训练赛第二十九场
---
# 2025夏季个人训练赛第二十九场

早上不知道要不要打，交了一道题，后来说可以不打了，但是来都来了，所以又打了一上午……

## B. 甜点

其实就是个多重背包问题，二进制拆分一下暴力做两次就可以了。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;
const int N = 210;
const int M = 50010;

int t[N], u[N], v[N];
int x[N], y[N], z[N];
int f[M];

int main() {
    memset(f, 0x3f, sizeof(f));
    int n, m, p, k;
    scanf("%d%d%d%d", &n, &m, &p, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d%d", &t[i], &u[i], &v[i]);
    }
    for (int i = 1; i <= m; ++i) {
        scanf("%d%d%d", &x[i], &y[i], &z[i]);
    }
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int b = 0; b < 8; ++b) {
            if (v[i] > (1 << b)) {
                v[i] -= (1 << b);
                int tt = (1 << b) * t[i], uu = (1 << b) * u[i];
                if (p - tt < 0) f[p] = min(f[p], uu);
                else 
                    for (int j = p - tt; j < p; ++j) {
                        f[p] = min(f[p], f[j] + uu);
                    }
                for (int j = p - 1; j >= tt; --j) {
                    f[j] = min(f[j], f[j - tt] + uu);
                }
            }
            else {
                int tt = v[i] * t[i], uu = v[i] * u[i];
                if (p - tt < 0) f[p] = min(f[p], uu);
                else
                    for (int j = p - tt; j < p; ++j) {
                        f[p] = min(f[p], f[j] + uu);
                    }
                for (int j = p - 1; j >= tt; --j) {
                    f[j] = min(f[j], f[j - tt] + uu);
                }
                break;
            }
        }
    }
    int minu = f[p];
    printf("%d\n", minu);
    memset(f, 0x3f, sizeof(f));
    f[0] = 0;
    for (int i = 1; i <= m; ++i) {
        for (int b = 0; b < 8; ++b) {
            if (z[i] > (1 << b)) {
                z[i] -= (1 << b);
                int tt = (1 << b) * x[i], uu = (1 << b) * y[i];
                if (minu - tt < 0) f[minu] = min(f[minu], uu);
                else
                    for (int j = minu - tt; j < minu; ++j) {
                        f[minu] = min(f[minu], f[j] + uu);
                    }
                for (int j = minu - 1; j >= tt; --j) {
                    f[j] = min(f[j], f[j - tt] + uu);
                }
            }
            else {
                int tt = x[i] * z[i], uu = y[i] * z[i];
                if (minu - tt < 0) f[minu] = min(f[minu], uu);
                else
                    for (int j = minu - tt; j < minu; ++j) {
                        f[minu] = min(f[minu], f[j] + uu);
                    }
                for (int j = minu - 1; j >= tt; --j) {
                    f[j] = min(f[j], f[j - tt] + uu);
                }
                break;
            }
        }
    }
    if (f[minu] <= k) printf("%d\n", f[minu]);
    else printf("FAIL\n");
    return 0;
}
```

## C. 喜爱

直接暴力就行了，顶多 60 位，(59 * (59 + 1)) / 2 + 1 = 1771，一共就这点数。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <bitset>

using namespace std;

typedef long long LL;
vector<LL> v;

void init() {
    v.emplace_back(0);
    for (int b = 1; b <= 60; ++b) {
        LL msk = (1LL << b) - 1;
        for (int i = b - 2; i >= 0; --i) {
            v.emplace_back(msk ^ (1LL << i));
            // cout << bitset<60>(msk ^ (1LL << i)) << endl;
        }
    }
}

int count(LL x) {
    if (x == -1) return 0;
    else {
        int l = 0, r = v.size() - 1;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (v[mid] <= x) l = mid;
            else r = mid - 1;
        }
        return l + 1;
    }
}

int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        LL l, r;
        scanf("%lld%lld", &l, &r);
        printf("%d\n", count(r) - count(l - 1));
    }
    return 0;
}
```

## D. 计算

我发现了一种稍微取巧一点的做法，开一个 stringstream 初始化一下原来的表达式，每次读入的时候 peek 一下检验是数字还是字符，然后直接用对应的数据类型 >> 就读进去了，其他地方还是正常的中缀表达式求值，开两个栈模拟即可。

刚开始我其实没用 peek，是真读进来一个字符检查一下如果 isdigit 再开一个 int 读，然后被 100 卡了，先读一个 1，然后新的 int 读进来一个 0，然后这个数字就变成 10 了😭

```cpp
#include <iostream>
#include <sstream>
#include <map>

using namespace std;

int num[50], tp1;
char op[50], tp2;
map<char, int> mp = {{'(', 0}, {'+', 1}, {'-', 1}, {'*', 2}, {'/', 2}, {'^', 3}};

void calc() {
    int &n1 = num[tp1 - 1], n2 = num[tp1], o = op[tp2];
    if (o == '+') n1 += n2;
    else if (o =='-') n1 -= n2;
    else if (o == '*') n1 *= n2;
    else if (o == '/') n1 /= n2;
    else if (o == '^') {
        int bs = n1;
        n1 = 1;
        for (int i = 0; i < n2; ++i) n1 *= bs;
    }
    tp1--, tp2--;
}

int main() {
    string s;
    cin >> s;
    stringstream ss(s);
    char c;
    while (ss.peek() != EOF) {
        if (isdigit(ss.peek())) {
            int t;
            ss >> t;
            num[++tp1] = t;
        }
        else {
            char c;
            ss >> c;
            if (c == '(') op[++tp2] = c;
            else if (c == ')') {
                while (op[tp2] != '(') calc();
                tp2--;
            }
            else {
                while (mp[op[tp2]] >= mp[c]) calc();
                op[++tp2] = c;
            }
        }
    }
    while (tp1 > 1) calc();
    printf("%d\n", num[tp1]);
    return 0;
}
```

## E. 子序列连续和

很水，前缀和 + 二分。

```cpp
#include <iostream>

using namespace std;
const int N = 100010;
long long a[N];

int main() {
    int n, s;
    scanf("%d%d", &n, &s);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
        a[i] += a[i - 1];
    }
    int res = 0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        int l = 0, r = i;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (a[i] - a[mid] >= s) l = mid;
            else r = mid - 1;
        }
        if (a[i] - a[l] >= s) res = min(res, i - l);
    }
    printf("%d\n", res == 0x3f3f3f3f ? 0 : res);
    return 0;
}
```

## G. 苹果树（tree）<sup style="color: red">补</sup>

这道当时没想到，后来看了题解，统计的是每条树边被非树边覆盖的次数，枚举边统计答案

- 如果没有覆盖，这条边是一个桥，删了他之后剩下的非树边随便删，贡献 m；
- 如果覆盖一次，删这条树边只能同时删覆盖他的非树边，贡献 1；
- 如果覆盖多次，那删了这条边无论怎么删别的都是连通的，贡献 0.

问题就转化成了一个树上差分。

```cpp
#include <iostream>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 300010;
vector<int> ed[N];
int s[N], f[N][20], dep[N];
int n, m;
LL res;

void dfs(int x) {
    for (int i = 1; i < 20; ++i) {
        f[x][i] = f[f[x][i - 1]][i - 1];
    }
    for (int y : ed[x]) {
        if (y == f[x][0]) continue;
        f[y][0] = x;
        dep[y] = dep[x] + 1;
        dfs(y);
    }
}

int lca(int x, int y) {
    if (dep[y] > dep[x]) swap(x, y);
    for (int i = 19; i >= 0; --i) {
        if (dep[f[x][i]] >= dep[y]) x = f[x][i];
    }
    if (x == y) return x;
    for (int i = 19; i >= 0; --i) {
        if (f[x][i] != f[y][i]) {
            x = f[x][i], y = f[y][i];
        }
    }
    return f[x][0];
}

void dfs2(int x) {
    for (int y : ed[x]) {
        if (y == f[x][0]) continue;
        dfs2(y);
        if (s[y] == 0) res += m;
        else if (s[y] == 1) res++;
        s[x] += s[y];
    }
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].emplace_back(y);
        ed[y].emplace_back(x);
    }
    dep[1] = 0;
    dfs(1);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        s[x]++, s[y]++;
        s[lca(x, y)] -= 2;
    }
    dfs2(1);
    printf("%lld\n", res);
    return 0;
}
```

## I. 狼和羊的故事 <sup style="color: red">补</sup>

开一个源点一个汇点 🐑 (->空地) ->🐺 求最小割

```cpp
#include <iostream>
#include <cstring>
#include <queue>

using namespace std;

const int N = 10010;
int head[N], ne[N * 6], ver[N * 6], w[N * 6], tot = 1;
int mp[110][110], dis[N], pre[N];
bool vis[N];
int n, m;
int S, T;
int cur[N], dep[N];

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

int id(int x, int y) {
    return (x - 1) * m + y;
}

bool bfs() {
    memset(dep, 0, sizeof(dep));
    cur[S] = head[S];
    dep[S] = 1;
    queue<int> q;
    q.emplace(S);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dep[y] || !w[i]) continue;
            dep[y] = dep[x] + 1;
            cur[y] = head[y];
            if (y == T) return true;
            q.emplace(y);
        }
    }
    return false;
}

int find(int x, int lim) {
    if (x == T) return lim;
    int flow = 0;
    for (int i = cur[x]; i && flow < lim; i = ne[i]) {
        int y = ver[i];
        if (dep[y] == dep[x] + 1 && w[i]) {
            int t = find(y, min(w[i], lim - flow));
            if (!t) dep[y] = -1;
            w[i] -= t, w[i ^ 1] += t, flow += t;
        }
    }
    return flow;
}

int dinic() {
    int res = 0, flow;
    while (bfs()) while (flow = find(S, 0x3f3f3f3f)) res += flow;
    return res;
}

int main() {
    scanf("%d%d", &n, &m);
    int t = n * m + 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m;++j) {
            scanf("%d", &mp[i][j]);
            if (mp[i][j] == 1) {
                add(0, id(i, j), N), add(id(i, j), 0, 0);
                if (i < n && mp[i + 1][j] != 1) add(id(i, j), id(i + 1, j), 1), add(id(i + 1, j), id(i, j), 0);
                if (j < m && mp[i][j + 1] != 1) add(id(i, j), id(i, j + 1), 1), add(id(i, j + 1), id(i, j), 0);
            }
            else if (mp[i][j] == 2) {
                add(id(i, j), t, N), add(t, id(i, j), N);
                if (i < n && mp[i + 1][j] != 1) add(id(i, j), id(i + 1, j), 0), add(id(i + 1, j), id(i, j), 1);
                if (j < m && mp[i][j + 1] != 1) add(id(i, j), id(i, j + 1), 0), add(id(i, j + 1), id(i, j), 1);
            }
            else {
                if (i < n) {
                    if (mp[i + 1][j] == 0) add(id(i, j), id(i + 1, j), 1), add(id(i + 1, j), id(i, j), 1);
                    else if (mp[i + 1][j] == 1) add(id(i, j), id(i + 1, j), 0), add(id(i + 1, j), id(i, j), 1);
                    else add(id(i, j), id(i + 1, j), 1), add(id(i + 1, j), id(i, j), 0);
                }
                if (j < m) {
                    if (mp[i][j + 1] == 0) add(id(i, j), id(i, j + 1), 1), add(id(i, j + 1), id(i, j), 1);
                    else if (mp[i][j + 1] == 1) add(id(i, j), id(i, j + 1), 0), add(id(i, j + 1), id(i, j), 1);
                    else add(id(i, j), id(i, j + 1), 1), add(id(i, j + 1), id(i, j), 1);
                }
            }
        }
    }
    S = 0, T = t;
    printf("%d\n", dinic());
    return 0;
}
```