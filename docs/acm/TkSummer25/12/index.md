---
title: 2025夏季个人训练赛第十二场
---
# 2025夏季个人训练赛第十二场

## A. 小凯逛超市

开一个二维背包，统计方案数即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 410;
const int MOD = 1000000007;
long long f[N][N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        memset(f, 0, sizeof(f));
        f[0][0] = 1;
        int n, m, v;
        scanf("%d%d%d", &n, &m, &v);
        for (int i = 1; i <= n; ++i) {
            int t;
            scanf("%d", &t);
            for (int j = 1; j <= m; ++j) {
                for (int k = t; k <= v; ++k) {
                    f[j][k] = (f[j][k] + f[j - 1][k - t]) % MOD;
                }
            }
        }
        long long res = 0;
        for (int i = 1; i <= v; ++i) {
            res = (res + f[m][i]) % MOD;
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## F. 小凯在长跑

签到题。

```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int d, r, x, y;
        scanf("%d%d%d%d", &d, &r, &x, &y);
        if (abs(y) <= d) printf("%d\n", abs(r - abs(x)));
        else printf("%d\n", (int)(0.5 + fabs((double)r - sqrt(x * x + (abs(y) - d) * (abs(y) - d)))));
    }
    return 0;
}
```

## G. 小凯用git

一个相对简单的大模拟，据别的佬的描述，这道题数据好像不太干净，可能会把对的代码判错。

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <sstream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 5010;

vector<vector<int>> fa;
bool vis[N];

bool check(int x, int t) { // x 的祖先是否包含 t
    if (vis[x]) return false;
    vis[x] = true;
    if (x == t) return true;
    else {
        for (int y : fa[x]) {
            if (check(y, t)) return true;
        }
        return false;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        fa = vector<vector<int>>(2);
        map<string, int> mp = {{"main", 1}};
        int n;
        cin >> n;
        string cmd, cur = "main";
        getline(cin, cmd);
        while (n--) {
            getline(cin, cmd);
            stringstream ss(cmd);
            string bin;
            ss >> bin;
            if (bin == "commit") {
                fa.push_back(vector<int>({mp[cur]}));
                mp[cur] = fa.size() - 1;
            }
            else if (bin == "branch") {
                string s;
                ss >> s;
                if (s == "-d") { // 删除分支
                    ss >> s;
                    if (mp.find(s) != mp.end()) mp.erase(s);
                }
                else {
                    int node;
                    ss >> s;
                    if (mp.find(s) != mp.end()) continue; // 已经存在
                    else if (ss >> node) { // 如果有 [node]
                        mp[s] = node;
                    }
                    else { // 没有 id 当前分支指向节点
                        mp[s] = mp[cur];
                    }
                }
            }
            else if (bin == "merge") { // 合并分支
                string s;
                ss >> s;
                bool f1, f2;
                memset(vis, 0, sizeof(bool) * fa.size());
                f1 = check(mp[cur], mp[s]);
                memset(vis, 0, sizeof(bool) * fa.size());
                f2 = check(mp[s], mp[cur]);
                if (!f1 && !f2) { // 都不包含
                    fa.push_back(vector<int>({mp[cur], mp[s]}));
                    mp[cur] = fa.size() - 1;
                }
                else if (f2) { // 后者包含前者
                    mp[cur] = mp[s];
                }
            }
            else if (bin == "checkout") { // 切换分支
                ss >> cur;
            }
            else if (bin == "reset") {
                int node;
                if (ss >> node) { // 如果有 [node]
                    mp[cur] = node;
                }
            }
            else {
                cout << "qwq" << endl;
                return 123;
            }
        }
        cout << mp.size() << endl;
        for (auto [s, node] : mp) cout << s << ' ' << node << endl;
        cout << fa.size() - 1 << endl;
        for (int i = 1; i < fa.size(); ++i) {
            cout << fa[i].size() << ' ';
            sort(fa[i].begin(), fa[i].end());
            for (int node : fa[i]) cout << node << ' ';
            cout << endl;
        }
    }
    return 0;
}
```

## <span style="color: red">欠多-1道题</span>

## J. 小凯做梦

$$
\begin{align}
    d_{i, j} &= d_i + d_j - 2 \cdot \text{lca}\left(i, j\right)\\
    d_{i, j} &\equiv d_i + d_j\ (\bmod 2)
\end{align}\\
\ \\
\begin{align}
    d_{i, j} &\equiv d_{j, k} \equiv d_{i, k}\ (\bmod 2)\\
    d_{i, j} &\equiv d_i + d_j\ (\bmod 2)\\
    d_{j, k} &\equiv d_j + d_k\ (\bmod 2)\\
    d_{i, k} &\equiv d_i + d_k\ (\bmod 2)\\
    \rArr d_i &\equiv d_i \equiv d_k\ (\bmod 2)
\end{align}
$$

所以应该统计到根距离为奇数和偶数的点数，各三次方相加。

(i, j, k) 和 (i, k, j) 是两种不同的情况，要考虑顺序。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 500010;

int head[N], ne[N * 2], ver[N * 2], w[N * 2], tot;
int dis[N];

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

void dp(int x, int fa) {
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i], val = w[i];
        if (y == fa) continue;
        dis[y] = dis[x] ^ val;
        dp(y, x);
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        tot = 0;
        memset(head, 0, sizeof(int) * (n + 1));
        for (int i = 1; i < n; ++i) {
            int x, y, z;
            scanf("%d%d%d", &x, &y, &z);
            z = z & 1;
            add(x, y, z), add(y, x, z);
        }
        dis[1] = 0;
        dp(1, 0);
        long long cnt[2] = {};
        for (int i = 1; i <= n; ++i) cnt[dis[i]]++;
        printf("%lld\n", cnt[0] * cnt[0] * cnt[0] + cnt[1] * cnt[1] * cnt[1]);
    }
    return 0;
}
```