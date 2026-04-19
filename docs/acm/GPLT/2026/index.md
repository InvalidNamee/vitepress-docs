---
title: GPLT-全国赛2026
---
# GPLT-全国赛2026

总体来说还是非常简单的，最终的情况是 L1，L2 满分，L3-1 30 分, L3-2 12 分, L3-3 10 分。

## L1

全都是水题。

### L1-1

```python
print('Building the Future, One Line of Code at a Time.')
```

### L1-2

```python
n = int(input())
print(n * 15)
```

### L1-3

```python
a, b = map(int, input().split())
print(b - a)
if (b - a > 250):
    print('jiu ting tu ran de...')
elif b - a <= 0:
    print('hai sheng ma?')
else:
    print('nin tai cong ming le!')
```

### L1-4

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        int t;
        cin >> t;
        if (t < 1700) res++;
    }
    cout << res << endl;
    return 0;
}
```

### L1-5

```cpp
#include <iostream>
#include <map>

using namespace std;

map<int, int> mp;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int a, b;
        cin >> a >> b;
        if (mp.find(a) != mp.end()) {
            mp[a] |= b;
        }
        else mp[a] = b;
    }
    bool f = true;
    for (auto [a, b] : mp) {
        if (b == 0) {
            if (f) cout << a;
            else cout << ' ' << a;
            f = false;
        }
    }
    if (f) cout << "NONE" << endl;
    return 0;
}
```

### L1-6

```cpp
for _ in range(11):
    print(len(input()), end='')
```

### L1-7

```python
n = int(input())
a = list(map(int, input().split()))
mx, mn, avg = max(a), min(a), sum(a) // n

print(mx, mn, avg)
l = [(i + 1) for i in range(n) if a[i] > avg * 2]
if l:
    print(' '.join(str(i) for i in l))
else:
    print('Normal')
```

### L1-8

当时出了一小会儿事故，需要注意边界，防止 RE。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int t;
    cin >> t;
    string s;
    cin >> s;
    while (t--) {
        int op;
        cin >> op;
        if (op == 1) {
            string tt;
            cin >> tt;
            int cnt = 0;
            bool f = true;
            if (s.length() < tt.length()) {
                cout << -1 << endl;
                continue;
            }
            for (int i = 0; i < s.length() - tt.length() + 1; ++i) {
                if (s.substr(i, tt.length()) == tt) {
                    if (f) cout << i, f = false;
                    else cout << ' ' << i;
                    cnt++;
                }
                if (cnt == 3) break;
            }
            if (f) cout << -1 << endl;
            else cout << endl;
        }
        else if (op == 2) {
            int p;
            string tt;
            cin >> p >> tt;
            s.insert(p, tt);
            cout << s << endl;
        }
        else {
            int l, r;
            cin >> l >> r;
            reverse(s.begin() + l, s.begin() + r + 1);
            cout << s << endl;
        }
    }
    return 0;
}
```

## L2

### L2-1

直接开两个数组模拟即可，非常的简单。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

vector<pair<int, int>> a, b;

bool f = true;

void print(int a) {
    if (f) cout << a + 1, f = false;
    else cout << ' ' << a + 1;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, t;
    cin >> n >> t;
    a.resize(n);
    for (int i = 0; i < n; ++i) {
        cin >> a[i].first;
        a[i].second = i;
    }
    int curt = 0;
    while (!a.empty()) {
        for (auto &[aa, bb] : a) {
            if (aa <= t) print(bb);
            else b.emplace_back(aa, bb), curt += aa;
        }
        if (b.empty()) break;
        t = curt / b.size();
        curt = 0;
        a = b;
        b.clear();
        reverse(a.begin(), a.end());
    }
    cout << endl;
    return 0;
}
```

### L2-2

二分查找，直接用 upper_bound 就解决了。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    vector<pair<int, int>> a(n);
    int mx = 0;
    for (int i = 0; i < n; ++i) {
        cin >> a[i].first;
        a[i].second = i + 1;
        mx = max(a[i].first, mx);
    }
    sort(a.begin(), a.end());
    bool f = true;
    for (auto [aa, bb] : a) {
        if (aa == mx) {
            if (f) cout << bb, f = false;
            else cout << ' ' << bb;
        }
    }
    cout << endl;
    int t;
    cin >> t;
    while (t--) {
        int q;
        cin >> q;
        auto p = upper_bound(a.begin(), a.end(), make_pair(q, 0));
        if (p == a.end()) cout << 0 << endl;
        else cout << p->second << endl;
    }
    return 0;
}
```

### L2-3

树形 DP，就是找根到每个叶子路径上的最小值，然后把最大的几个输出。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <cstring>

using namespace std;

const int N = 100010;
vector<pair<int, int>> ed[N];
int dis[N], deg[N];

void dfs(int x) {
    for (auto [y, val] : ed[x]) {
        dis[y] = min(val, dis[x]);
        dfs(y);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int fa, val;
        cin >> fa >> val;
        ed[fa].emplace_back(i, val);
        deg[fa]++;
    }
    dis[0] = 0x3f3f3f3f;
    dfs(0);
    int mx = 0;
    for (int i = 0; i < n; ++i) {
        if (deg[i] == 0) mx = max(mx, dis[i]);
    }
    cout << mx << endl;
    bool f = true;
    for (int i = 0; i < n; ++i) {
        if (dis[i] == mx && deg[i] == 0) {
            if (f) cout << i, f = false;
            else cout << ' ' << i;
        }
    }
    cout << endl;
    return 0;
}
```

### L2-4

直接按要求搜即可，非常简单。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <cstring>

using namespace std;

const int N = 10010;
vector<pair<int, int>> ed[N];
int dis[N], deg[N];
vector<int> seq;
bool vis[N];

void print_seq() {
    bool f = true;
    for (auto x : seq) {
        if (f) cout << x, f = false;
        else cout << "->" << x;
    }
    cout << endl;
    seq.clear();
}

void dfs(int x) {
    if (vis[x]) return;
    seq.emplace_back(x);
    vis[x] = true;
    if (ed[x].empty()) return;
    for (auto [_, y] : ed[x]) {
        if (!vis[y]) {
            dfs(y);
            return;
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        cin >> x >> y >> z;
        ed[x].emplace_back(-z, y);
    }
    for (int i = 1; i <= n; ++i) sort(ed[i].begin(), ed[i].end());
    int q;
    cin >> q;
    while (q--) {
        int x;
        cin >> x;
        memset(vis, 0, sizeof(vis));
        dfs(x);
        print_seq();
    }
    return 0;
}
```

## L3

依然是第一个送分，后两个不会。

### L3-1

开两个优先队列，一个放老人，一个放其他人，然后按要求模拟。

```cpp
#include <iostream>
#include <algorithm>
#include <queue>
#include <cstring>

using namespace std;

const int N = 10010;

struct Node {
    int t1, t2, age;
    string id;

    bool operator <(const Node &a) const {
        return t2 > a.t2;
    }
} a[N];
bool vis[N];
int b[N];

priority_queue<Node> q1, q2;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i].t1 >> a[i].t2 >> a[i].id >> a[i].age;
        b[a[i].t2] = i;
    }
    for (int i = 1, j = 1, tt = 0; tt < n; ++i) {
        if (i <= n && a[b[i]].t1 <= i && !vis[a[b[i]].t2]) {
            vis[a[b[i]].t2] = true;
            // cout << a[b[i]].t2 << endl;
            cout << i << ' ' << a[b[i]].id << endl;
            tt++;
        }
        else {
            while (j <= n && a[j].t1 <= i) {
                if (a[j].age >= 80) q2.emplace(a[j]);
                else q1.emplace(a[j]);
                j++;
            }
            while (!q1.empty() && vis[q1.top().t2]) q1.pop();
            while (!q2.empty() && vis[q2.top().t2]) q2.pop();
            // cout << vis[q2.top().t2] << endl;
            // exit(0);
            if (!q2.empty()) {
                cout << i << ' ' << q2.top().id << endl;
                vis[q2.top().t2] = true;
                q2.pop();
                tt++;
            }
            else if (!q1.empty()) {
                cout << i << ' ' << q1.top().id << endl;
                vis[q1.top().t2] = true;
                q1.pop();
                tt++;
            }
        }
    }
    return 0;
}
```
### L3-2

大概率是网络流，什么点覆盖独立集之类的，大概率会补。

先贴个暴力的代码了。

> [!WARNING]
> 这是个 12 分的暴力的代码！

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100010;
int a[N][2];
int b[N * 2];
int res, n;

void dfs(int x, int t) {
    if (t > res) return;
    if (x == n) {
        res = t;
        return;
    }
    if (b[a[x][0]] || b[a[x][1] + n]) dfs(x + 1, t);
    else {
        b[a[x][0]] = 1;
        dfs(x + 1, t + 1);
        b[a[x][0]] = 0;
        b[a[x][1] + n] = 1;
        dfs(x + 1, t + 1);
        b[a[x][1] + n] = 0;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        cin >> n;
        res = n;
        for (int i = 0; i < n; ++i) cin >> a[i][0] >> a[i][1];
        dfs(0, 0);
        cout << res + n << endl;
    }
    return 0;
}
```

### L3-3

我直接打暴力了高达 10 分。

> [!WARNING]
> 这是个 10 分的暴力的代码。

```cpp
#include <iostream>
#include <algorithm>
#include <queue>
#include <cstring>

using namespace std;

int res;
vector<int> a, b;

void dfs(int x) {
    if (x == b.size()) {
        bool f = true;
        for (int i = 0; i < b.size(); ++i) {
            if (a[b[i]] != b[a[i]]) {
                f = false;
                break;
            }
        }
        if (f) res++;
        return;
    }
    for (int i = 0; i < b.size(); ++i) {
        b[x] = i;
        dfs(x + 1);
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        a = vector<int>(n), b = vector<int>(n);
        for (auto &i : a) cin >> i, i--;
        for (int i = 0; i < n; ++i) b[i] = i;
        int t = 1;
        for (int i = 1; i <= n; ++i) t *= i;
        res = 0;
        dfs(0);
        cout << res << endl;
    }
    
    return 0;
}
```