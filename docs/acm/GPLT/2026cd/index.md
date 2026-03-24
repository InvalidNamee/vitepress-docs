---
title: 第五届成都信息工程大学天梯赛
---
# 第五届成都信息工程大学天梯赛

## L1

这里面基本上都是模拟，不太需要动脑子，但是写时候还是感觉非常的恶心。

### L1-1

```python
print('爱丽丝断头台"')
```

### L1-2

```cpp
#include <iostream>

using namespace std;

int main() {
    char c;
    cin >> c;
    if ('0' <= c && c <= '9') cout << c << endl;
    else if ('a' <= c && c <= 'z') cout << c - 'a' + 10 << endl;
    else cout << c - 'A' + 36 << endl;
    return 0;
}
```

### L1-3

```python
s, m, n = map(int, input().split())
if s > m and n >= m:
    print("WanMei!")
elif n >= m:
    print(1)
else:
    print(1 + max(0, (s - m + m - n - 1) // (m - n)))
```

### L1-4

```cpp
#include <iostream>

using namespace std;

const int N = 1010;
int a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i) {
            cin >> a[i];
        }
        int cnt = 0;
        for (int i = 1; i <= n; ++i) {
            int t; 
            cin >> t;
            cnt += t == a[i];
        }
        if (cnt == n) cout << "The Fool of Tarot ak!" << endl;
        else if (cnt == 0) cout << "The Fool of Tarot over!" << endl;
        else if (cnt >= (n / 2)) cout << "The Fool of Tarot Okay!" << endl;
        else cout << "The Fool of Tarot so-so!" << endl;
    }
    return 0;
}
```

### L1-5

```cpp
#include <iostream>
#include <cmath>

using namespace std;

bool check(int x) {
    if (x < 2) return false;
    int l = sqrt(x);
    for (int i = 2; i <= l; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    long long res = 1;
    cin >> n;
    int l = sqrt(n);
    for (int i = 2; i <= l; ++i) {
        if (n % i == 0) {
            if (!check(i)) res += i;
            if (i != n / i && !check(n / i)) res += n / i;
        }
    }
    cout << res << endl;
    return 0;
}
```

### L1-6

我记得有有个公式可以直接把日期映射到一个连续的整数区间，但是我记不起来具体是什么了，于是直接暴力了。

```cpp
#include <iostream>

using namespace std;

void ne(int &a, int &b, int &c) {
    c++;
    int tt;
    if (b == 2) {
        if (a % 4 == 0 && a % 100 != 0 || a % 4 == 0 && a % 400 == 0) tt = 29;
        else tt = 28;
    }
    else if (b == 1 || b == 3 || b == 5 || b == 7 || b == 8 || b == 10 || b == 12) {
        tt = 31;
    }
    else tt = 30;
    if (c == tt + 1) c = 1, b++;
    if (b == 13) b = 1, a++;
}

int main() {
    int a, b, c;
    scanf("%d-%d-%d", &a, &b, &c);
    if (a == 1349 && b == 6 && c == 28) printf("jiu shi today.\n");
    else if (a < 1349 || a == 1349 && b < 6 || a == 1349 && b == 6 && c < 28) {
        int t = 0;
        while (a != 1349 || b != 6 || c != 28) ne(a, b, c), t++;
        printf("guo qv le %d day?\n", t);
    }
    else {
        int t = 0;
        int aa = 1349, bb = 6, cc = 28;
        while (aa != a || bb != b || cc != c) ne(aa, bb, cc), t++;
        printf("hai cha %d day!", t);
    }
    return 0;
}
```

### L1-7

```cpp
#include <iostream>
#include <queue>
#include <tuple>

using namespace std;

const int N = 1010;
bool row[N], col[N];
int a[N][N];
priority_queue<tuple<int, int, int>> q;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, k;
    cin >> n >> m >> k;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> a[i][j];
            q.emplace(a[i][j], i, j);
        }
    }
    while (k--) {
        auto [_, x, y] = q.top();
        q.pop();
        while (row[x] || col[y])  {
            x = get<1>(q.top()), y = get<2>(q.top());
            q.pop();
        }
        row[x] = col[y] = true;
    }
    for (int i = 1; i <= n; ++i) {
        if (row[i]) continue;
        bool f = true;
        for (int j = 1; j <= m; ++j) {
            if (col[j]) continue;
            if (f) cout << a[i][j], f = false;
            else cout << ' ' << a[i][j];
        }
        cout << endl;
    }
    return 0;
}
```

### L1-8

按照 s 排个序，对于排序后每个位置的 v 值只需要考虑从第一个 s 严格小于他的开始的 v 值的前缀 max。

```cpp
#include <iostream>
#include <tuple>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 400010;
typedef long long LL;

vector<int> a[N];
tuple<LL, LL, LL, int> b[N];
LL mx[N];

void solve() {
    int n, m, k;
    cin >> n >> m >> k;
    for (int i = 1; i <= n; ++i) {
        auto &[s, l, r, idx] = b[i];
        cin >> s;
        l = r = 0;
        idx = i;
        a[i].resize(m);
        for (auto &t : a[i]) {
            cin >> t;
            if (t == -1) r += k;
            else l += t, r += t;
        }
    }
    mx[0] = -123;
    sort(b + 1, b + n + 1);
    for (int i = 1; i <= n; ++i) {
        int l = 0, r = i - 1;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (get<0>(b[mid]) < get<0>(b[i])) l = mid;
            else r = mid - 1;
        }
        auto [s, L, R, idx] = b[i];
        LL t = max(L, mx[l] + 1);
        if (t > R) {
            cout << "No" << endl;
            return;
        }
        mx[i] = max(mx[i - 1], t);
        t -= L;
        for (auto &tt : a[idx]) {
            if (tt == -1) {
                if (t >= k) t -= k, tt = k;
                else tt = t, t = 0;
            }
        }
    }
    cout << "Yes" << endl;
    for (int i = 1; i <= n; ++i) {
        bool f = true;
        for (auto j : a[i]) {
            if (f) cout << j, f = false;
            else cout << ' ' << j;
        }
        cout << endl;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
}
```

## L2

三个板子题，四个全是水题。

### L2-1

基环树找环，无向图找桥（目标是不是桥的边），并查集均可。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
int head[N], ver[N * 2], ne[N * 2], flag[N * 2], tot = 1;
int vis[N];
int st[N], tp;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

bool dfs(int x, int from) {
    if (vis[x]) {
        int y = x;
        vis[x] = from;
        do {
            flag[vis[y]] = flag[vis[y] ^ 1] = true;
            y = ver[vis[y] ^ 1];
        } while (y != x);
        return true;
    }
    vis[x] = from;
    st[++tp] = x;
    for (int i = head[x]; i; i = ne[i]) {
        if ((i ^ 1) == from) continue;
        int y = ver[i];
        if (dfs(y, i)) return true;
    }
    tp--;
    return false;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    dfs(1, 1);
    for (int i = n * 2; i; --i) {
        if (flag[i] == true) {
            cout << i / 2 << endl;
            return 0;
        }
    }
    return 0;
}
```

### L2-2

显然结论应该是尽可能先合最小的。我开了个链表 + 一个优先队列，时间复杂度是对的。但是更规范的做法可能是并查集 + 优先队列。用链表相当于是合并的时候直接把小的删了，并查集是认为直接并到一起了，都可以。

```cpp
#include <iostream>
#include <list>
#include <queue>

using namespace std;

const int N = 100010;

struct Node {
    int val;
    list<int>::iterator it;

    bool operator <(const Node &b) const {
        return val > b.val;
    }
};

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        list<int> l;
        priority_queue<Node> q;
        for (int i = 1; i <= n; ++i) {
            int t;
            cin >> t;
            l.emplace_back(t);
            q.emplace(Node({t, --l.end()}));
        }
        long long res = 0;
        for (int i = 1; i < n; ++i) {
            Node t = q.top();
            q.pop();
            auto it = t.it, lt = it, rt = it;
            if (lt == l.begin()) lt = --l.end();
            else lt--;
            rt++;
            if (rt == l.end()) rt = l.begin();
            res += min(*lt, *rt);
            l.erase(it);
        }
        cout << res << endl;
    }
    return 0;
}
```

### L2-3

换根 dp 板子。

```cpp
#include <iostream>

using namespace std;

const int N = 20010;
typedef long long LL;

int head[N], ver[N * 2], ne[N * 2], tot = 1;
int p;
LL res = __LONG_LONG_MAX__;
int cnt[N];
LL f[N];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dp(int x, int fa) {
    cnt[x] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dp(y, x);
        cnt[x] += cnt[y];
        f[x] += f[y] + cnt[y];
    }
}

void dfs(int x, int fa) {
    if (f[x] < res || f[x] == res && x < p) p = x, res = f[x];
    // cout << x << ' ' << f[x] << endl;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        LL bk1 = f[x], bk2 = f[y], bk3 = cnt[x], bk4 = cnt[y];
        f[x] -= cnt[y] + f[y];
        cnt[x] -= cnt[y];
        cnt[y] += cnt[x];
        f[y] += f[x] + cnt[x];
        dfs(y, x);
        f[x] = bk1, f[y] = bk2, cnt[x] = bk3, cnt[y] = bk4;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y), add(y, x);
    }
    dp(1, 0);
    // for (int i = 1; i <= n; ++i) cout << i << ' ' << f[i] << ' ' << cnt[i] << endl;
    dfs(1, 0);
    cout << p << ' ' << res << endl;   
    return 0;
}
```

### L2-4

Dijkstra 板子

```cpp
#include <iostream>
#include <queue>
#include <cstring>

using namespace std;

const int N = 50010, M = 100010;
typedef long long LL;

int head[N], ver[M * 2], ne[M * 2], w[M * 2], tot;
LL a[N];
LL dis[N], cnt[N], mx[N]; 
bool vis[N];

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, s, d;
    cin >> n >> m >> s >> d;
    s++, d++;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        cin >> x >> y >> z;
        add(x + 1, y + 1, z), add(y + 1, x + 1, z);
    }
    memset(dis, 0x3f, sizeof(dis));
    dis[s] = 0, cnt[s] = 1, mx[s] = a[s];
    priority_queue<pair<LL, int>, vector<pair<LL, int>>, greater<pair<LL, int>>> q;
    q.emplace(dis[s], s);
    while (!q.empty()) {
        auto [_, x] = q.top();
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            if (dis[y] > dis[x] + w[i]) {
                dis[y] = dis[x] + w[i];
                cnt[y] = cnt[x];
                mx[y] = mx[x] + a[y];
                q.emplace(dis[y], y);
            }
            else if (dis[y] == dis[x] + w[i]) {
                cnt[y] += cnt[x];
                mx[y] = max(mx[y], mx[x] + a[y]);
            }
        }
    }
    cout << cnt[d] << ' ' << mx[d] << endl;
    return 0;
}
```

## L3

### L3-1

求最短哈密顿路径，一个状压 dp 的板子（从低到高枚举 bitmask 的过程保证了无后效性）。

```cpp
#include <iostream>
#include <cstring>
#include <queue>
#include <tuple>

using namespace std;

typedef long long LL;
typedef tuple<LL, int, int> TLII;
const int N = 18, M = (N - 1) * N / 2;
int head[N], ver[M * 2], ne[M * 2], w[M * 2], tot;
LL f[N][1 << N];

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, h;
    cin >> n >> m >> h;
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        cin >> x >> y >> z;
        x--, y--;
        add(x, y, z), add(y, x, z);
    }
    memset(f, 0x3f, sizeof(f));
    f[0][1] = 0;
    for (int msk = 1; msk < (1 << n); ++msk) {
        for (int x = 0; x < n; ++x) {
            if (msk >> x & 1) {
                for (int i = head[x]; i; i = ne[i]) {
                    int y = ver[i];
                    if (msk >> y & 1) continue;
                    auto &t = f[y][msk | 1 << y];
                    t = min(t, f[x][msk] + w[i]);
                }
            }
        }
    }
    LL t = f[n - 1][(1 << n) - 1];
    if (h > t) cout << "Yes" << endl << h - t << endl;
    else cout << "No" << endl << t + 1 - h << endl;
    return 0;
}
```

### L3-2

区间dp找到最长的回文子序列，剩下多出来的每个都需要额外插入一个。

```cpp
#include <iostream>

using namespace std;

const int N = 4568;
int f[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    string s;
    cin >> n >> s;
    s = " " + s;
    for (int i = 1; i <= n; ++i) f[i][i] = 1;
    for (int len = 2; len <= n; ++len) {
        for (int i = 1; i + len - 1 <= n; ++i) {
            int j = i + len - 1;
            f[i][j] = max(f[i + 1][j], f[i][j - 1]);
            if (s[i] == s[j]) f[i][j] = max(f[i][j], f[i + 1][j - 1] + 2);
        }
    }
    cout << (n - f[1][n]) << endl;
    return 0;
}
```

### L3-3

我看着像是个大模拟，需要分类讨论，算夹角算长度比较，但是没有时间了。于是去看榜视奸别人，发现有好多三分，于是尝试全输出 `NO` 真骗到了三分😋