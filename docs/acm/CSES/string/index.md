---
title: CSES String Algorithm
---
# CSES String Algorithm

更新ing

 - 2026-01-18：还差两道目测和后缀数组有关系，明天再学。

> [!NOTE]
> 前三道是之前写过的，有些不严谨的地方懒得改了，字符串哈希参考后面的冲突率更低。

## Word Combinations

用 kmp 把词在串里出现的位置算出来标记上，然后做线性 DP。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int MOD = 1000000007;
int ne[1000010], f[5010];
vector<int> l[5010];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s, t;
    int n, k;
    cin >> s;
    n = s.length();
    cin >> k;
    while (k--) {
        cin >> t;
        for (int i = 2, j = 0; i <= t.length(); ++i) {
            while (j && t[i - 1] != t[j]) j = ne[j];
            if (t[i - 1] == t[j]) j++;
            ne[i] = j;
        }
        for (int i = 1, j = 0; i <= n; ++i) {
            while (j && s[i - 1] != t[j]) j = ne[j];
            if (s[i - 1] == t[j]) j++;
            if (j == t.length()) {
                l[i].push_back(t.length());
                j = ne[j];
            }
        }
    }
    f[0] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j : l[i]) {
            f[i] = (f[i] + f[i - j]) % MOD;
        }
    }
    cout << f[n] << endl;
    return 0;
}
```

## String Matching

KMP 纯板子。

```cpp
#include <iostream>

using namespace std;

int ne[1000010];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s, t;
    int res = 0;
    cin >> s >> t;
    for (int i = 2, j = 0; i <= t.length(); ++i) {
        while (j && t[i - 1] != t[j]) j = ne[j];
        if (t[i - 1] == t[j]) j++;
        ne[i] = j;
    }
    for (int i = 0, j = 0; i < s.length(); ++i) {
        while (j && s[i] != t[j]) j = ne[j];
        if (s[i] == t[j]) j++;
        if (j == t.length()) {
            res++;
            j = ne[j];
        }
    }
    cout << res << endl;
    return 0;
}
```

## Finding Borders

暴力枚举，用字符串哈希比较。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int MOD = 1000000007;
long long H[1000010], p[1000010];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    p[0] = 1;
    int n = s.length();
    for (int i = 1; i <= n; ++i) {
        H[i] = (H[i - 1] * 26 + (s[i - 1] - 'a')) % MOD;
        p[i] = p[i - 1] * 26 % MOD;
    }
    for (int i = 1; i < n; ++i) {
        if (H[i] == ((H[n] - H[n - i] * p[i] % MOD) % MOD + MOD) % MOD) {
            cout << i << ' ';
        }
    }
    cout << endl;
    return 0;
}
```

## Finding Periods

> [!NOTE]
> 这道题看了题解。

哈希暴力对比就行了，我在想什么，调和级数级别的时间复杂度完全可以接受。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1000010;
uint64_t h1[N], h2[N], p1[N], p2[N];

uint64_t get1(int l, int r) {
    return h1[l - 1] * p1[r - l + 1] - h1[r];
}

uint64_t get2(int l, int r) {
    return h2[l - 1] * p2[r - l + 1] - h2[r];
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length();
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; ++i) {
        p1[i] = p1[i - 1] * 131;
        p2[i] = p2[i - 1] * 1331;
        h1[i] = h1[i - 1] * 131 + s[i - 1];
        h2[i] = h2[i - 1] * 1331 + s[i - 1];
    }
    for (int i = 1; i <= n; ++i) {
        bool f = true;
        for (int j = i + 1; j <= n; j += i) {
            int len = min(n - j + 1, i);
            if (get1(1, len) != get1(j, j + len - 1) || get2(1, len) != get2(j, j + len - 1)) {
                f = false;
                break;
            }
        }
        if (f) cout << i << ' ';
    }
    cout << endl;
    return 0;
}
```

## Minimal Rotation

比较两个串的大小可以用哈希 + 二分（二分第一个哈希值不一样的前缀，比较最后一位大小）优化成 log，然后暴力处理时间复杂度就成了 $O(n \log n)$。

怎么会有人蠢到暴力枚举能少枚举呢😭，wa 了好几发。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 2000010;
uint64_t h1[N], h2[N], p1[N], p2[N];

uint64_t get1(int l, int r) {
    return h1[l - 1] * p1[r - l + 1] - h1[r];
}

uint64_t get2(int l, int r) {
    return h2[l - 1] * p2[r - l + 1] - h2[r];
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length(), p = 1;
    s = " " + s + s;
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n * 2; ++i) {
        p1[i] = p1[i - 1] * 131;
        p2[i] = p2[i - 1] * 1331;
        h1[i] = h1[i - 1] * 131 + s[i];
        h2[i] = h2[i - 1] * 1331 + s[i];
    }
    for (int i = 2; i <= n; ++i) {
        int l = 1, r = n + 1;
        while (l < r) {
            int mid = l + r >> 1;
            if (get1(p, p + mid - 1) != get1(i, i + mid - 1) || get2(p, p + mid - 1) != get2(i, i + mid - 1)) r = mid;
            else l = mid + 1;
        }
        if (l == n + 1) continue;
        else if (s[i + l - 1] < s[p + l - 1]) p = i;
    }
    cout << s.substr(p, n) << endl;
    return 0;
}
```

## Longest Palindrome

仍然可以哈希 + 二分，正着和反着分别维护一遍哈希表，然后暴力枚举中间点下标，二分回文子串的长度。我感觉可能是因为自然溢出需要都是同一个串的前缀所以会出错，这里哈希需要取模。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
typedef long long LL;
const int N = 1000010;
const int MOD = 998244353;
int64_t h1[N], h2[N], h1r[N], h2r[N], p1[N], p2[N];

int64_t get1(int l, int r) {
    return (h1[r] - h1[l - 1] * p1[r - l + 1] % MOD + MOD) % MOD;
}

int64_t get2(int l, int r) {
    return (h2[r] - h2[l - 1] * p2[r - l + 1] % MOD + MOD) % MOD;
}

int64_t get1r(int l, int r) {
    return (h1r[l] - h1r[r + 1] * p1[r - l + 1] % MOD + MOD) % MOD;
}

int64_t get2r(int l, int r) {
    return (h2r[l] - h2r[r + 1] * p2[r - l + 1] % MOD + MOD) % MOD;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length(), p = 1, len = 1;
    s = " " + s;
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; ++i) {
        p1[i] = p1[i - 1] * 131 % MOD;
        p2[i] = p2[i - 1] * 1331 % MOD;
        h1[i] = (h1[i - 1] * 131 + s[i]) % MOD;
        h2[i] = (h2[i - 1] * 1331 + s[i]) % MOD;
    }
    for (int i = n; i; --i) {
        h1r[i] = (h1r[i + 1] * 131 + s[i]) % MOD;
        h2r[i] = (h2r[i + 1] * 1331 + s[i]) % MOD;
    }
    for (int i = 2; i < n; ++i) {
        int l = 0, r = min(n - i, i - 1);
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (get1(i + 1, i + mid) == get1r(i - mid, i - 1) && get2(i + 1, i + mid) == get2r(i - mid, i - 1)) l = mid;
            else r = mid - 1;
        }
        if (l * 2 + 1 > len) p = i - l, len = l * 2 + 1;
    }
    for (int i = 1; i < n; ++i) {
        int l = 0, r = min(n - i, i);
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (get1(i + 1, i + mid) == get1r(i - mid + 1, i) && get2(i + 1, i + mid) == get2r(i - mid + 1, i)) l = mid;
            else r = mid - 1;
        }
        if (l * 2 > len) p = i - l + 1, len = l * 2;
    }
    cout << s.substr(p, len) << endl;
    return 0;
}
```

## Required Substring

可以 DP，维护 $f_{i, j}$ 表示前 $i$ 个并且末尾已经匹配了 $j$ 个的方案数，已经成功匹配一次的全算到 $f_{i, m}$ 里面。更新的时候考虑试填字母模拟 KMP 的过程，找到填完之后仍能匹配几个。

```cpp
#include <iostream>
#include <set>
using namespace std;
typedef long long LL;
const int MOD = 1000000007;
const int N = 1010, M = 110;
LL f[N][M];
int ne[M];
set<int> s;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    string s;
    cin >> n >> s;
    m = s.length();
    for (int i = 2, j = 0; i <= m; ++i) {
        while (j && s[i - 1] != s[j]) j = ne[j];
        if (s[i - 1] == s[j]) j++;
        ne[i] = j;
    }
    f[0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        f[i][m] = f[i - 1][m] * 26 % MOD;
        for (int j = 0; j < m; ++j) {
            set<char> ss;
            for (char c = 'A'; c <= 'Z'; ++c) ss.insert(c);
            int k = j;
            while (k) {
                f[i][k + 1] = (f[i][k + 1] + f[i - 1][j] * ss.count(s[k])) % MOD;
                ss.erase(s[k]);
                k = ne[k];
            }
            f[i][1] = (f[i][1] + f[i - 1][j] * ss.count(s[0])) % MOD;
            ss.erase(s[0]);
            f[i][0] = (f[i][0] + f[i - 1][j] * ss.size()) % MOD;
        }
    }
    cout << f[n][m] << endl;
    return 0;
}
```

## Palindrome Queries

可以用哈希，正向和反向哈希值一样就说明是回文的，动态的哈希可以用树状数组或者线段树做。我用了树状数组。

```cpp
#include <iostream>
#include <set>
using namespace std;
typedef long long LL;
const int N = 200010, MOD = 998244353;

LL p1[N], p2[N];
int n;
struct FenwickTree {
    LL tr[N];

    void add(int u, LL val) {
        for (; u <= n; u += u & -u) {
            tr[u] = (tr[u] + val) % MOD;
        }
    }

    LL query(int u) {
        LL res = 0;
        for (; u; u -= u & -u) {
            res = (res + tr[u]) % MOD;
        }
        return res;
    }
} tr1, tr2, tr1r, tr2r;

LL power(LL n, LL p) {
    LL res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int m;
    string s;
    cin >> n >> m >> s;
    s = " " + s;
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; ++i) {
        p1[i] = p1[i - 1] * 131 % MOD;
        p2[i] = p2[i - 1] * 1331 % MOD;
    }
    for (int i = 1; i <= n; ++i) {
        tr1.add(i, p1[n - i] * s[i]);
        tr2.add(i, p2[n - i] * s[i]);
        tr1r.add(i, p1[i - 1] * s[i]);
        tr2r.add(i, p2[i - 1] * s[i]);
    }
    while (m--) {
        int op;
        cin >> op;
        if (op == 1) {
            int k;
            char x;
            cin >> k >> x;
            tr1.add(k, -p1[n - k] * s[k]);
            tr2.add(k, -p2[n - k] * s[k]);
            tr1r.add(k, -p1[k - 1] * s[k]);
            tr2r.add(k, -p2[k - 1] * s[k]);
            s[k] = x;
            tr1.add(k, p1[n - k] * s[k]);
            tr2.add(k, p2[n - k] * s[k]);
            tr1r.add(k, p1[k - 1] * s[k]);
            tr2r.add(k, p2[k - 1] * s[k]);
        }
        else {
            int l, r;
            cin >> l >> r;
            LL h1 = (tr1.query(r) - tr1.query(l - 1) + MOD) % MOD * power(p1[n - r], MOD - 2) % MOD;
            LL h2 = (tr2.query(r) - tr2.query(l - 1) + MOD) % MOD * power(p2[n - r], MOD - 2) % MOD;
            LL h1r = (tr1r.query(r) - tr1r.query(l - 1) + MOD) % MOD * power(p1[l - 1], MOD - 2) % MOD;
            LL h2r = (tr2r.query(r) - tr2r.query(l - 1) + MOD) % MOD * power(p2[l - 1], MOD - 2) % MOD;
            cout << (h1 == h1r && h2 == h2r ? "YES" : "NO") << endl;
        }
    }
    return 0;
}
```

## Finding Patterns

AC 自动机（实际上最好用优化版的 Trie 图）的板子，需要注意打访问标记否则时间复杂度不对。

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;
typedef long long LL;
const int N = 500010;

int trie[N][26], ne[N], tot = 0;
bool v[N];
vector<int> flag[N];
bool res[N];

void insert(string t, int flg) {
    int p = 0;
    for (char c : t) {
        if (trie[p][c - 'a']) p = trie[p][c - 'a'];
        else trie[p][c - 'a'] = ++tot, p = tot;
    }
    flag[p].emplace_back(flg);
}

void build() {
    queue<int> q;
    for (int i = 0; i < 26; ++i) {
        if (trie[0][i]) q.emplace(trie[0][i]);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int i = 0; i < 26; ++i) {
            int &y = trie[x][i];
            if (!y) y = trie[ne[x]][i];
            else {
                ne[y] = trie[ne[x]][i];
                q.emplace(y);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s, t;
    int n, m;
    cin >> s >> m;
    n = s.length();
    for (int i = 1; i <= m; ++i) {
        cin >> t;
        insert(t, i);
    }
    build();
    for (int i = 1, j = 0; i <= n; ++i) {
        j = trie[j][s[i - 1] - 'a'];
        int p = j;
        while (p && !v[p]) {
            for (int idx : flag[p]) res[idx] = true;
            v[p] = true;
            p = ne[p];
        }
    }
    for (int i = 1; i <= m; ++i) {
        cout << (res[i] ? "YES" : "NO") << endl;
    }
    return 0;
}
```

## Counting Patterns

AC 自动机板子，如果不优化可能会造成 TLE，先不下传答案，都记到第一个匹配的位置，最后拓扑排序一并更新答案，保证时间复杂度是线性的。

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;
typedef long long LL;
const int N = 500010;

int trie[N][26], ne[N], f[N], deg[N], tot = 0;
bool v[N];
string t[N];
vector<int> flag[N];

void insert(string t, int flg) {
    int p = 0;
    for (char c : t) {
        if (trie[p][c - 'a']) p = trie[p][c - 'a'];
        else trie[p][c - 'a'] = ++tot, p = tot;
    }
    flag[p].emplace_back(flg);
}

void build() {
    queue<int> q;
    for (int i = 0; i < 26; ++i) {
        if (trie[0][i]) q.emplace(trie[0][i]);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int i = 0; i < 26; ++i) {
            int &y = trie[x][i];
            if (!y) y = trie[ne[x]][i];
            else {
                ne[y] = trie[ne[x]][i];
                deg[ne[y]]++;
                q.emplace(y);
            }
        }
    }
}

int query(string t) {
    int p = 0;
    for (char c : t) {
        p = trie[p][c - 'a'];
    }
    return f[p];
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n, m;
    cin >> s >> m;
    n = s.length();
    for (int i = 1; i <= m; ++i) {
        cin >> t[i];
        insert(t[i], i);
    }
    build();
    for (int i = 1, j = 0; i <= n; ++i) {
        j = trie[j][s[i - 1] - 'a'];
        f[j]++;
    }
    queue<int> q;
    for (int i = 0; i <= tot; ++i) {
        if (!deg[i]) q.emplace(i);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        f[ne[x]] += f[x];
        if (--deg[ne[x]] == 0) q.emplace(ne[x]);
    }
    for (int i = 1; i <= m; ++i) {
        cout << query(t[i]) << endl;
    }
    return 0;
}
```

## Pattern Positions

还是 AC 自动机的板子，这次是找第一次出现的位置。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;
typedef long long LL;
const int N = 500010;

int trie[N][26], ne[N], tot = 0;
int res[N];
bool v[N];
string t[N];
vector<int> flag[N];

void insert(string t, int flg) {
    int p = 0;
    for (char c : t) {
        if (trie[p][c - 'a']) p = trie[p][c - 'a'];
        else trie[p][c - 'a'] = ++tot, p = tot;
    }
    flag[p].emplace_back(flg);
}

void build() {
    queue<int> q;
    for (int i = 0; i < 26; ++i) {
        if (trie[0][i]) q.emplace(trie[0][i]);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int i = 0; i < 26; ++i) {
            int &y = trie[x][i];
            if (!y) y = trie[ne[x]][i];
            else {
                ne[y] = trie[ne[x]][i];
                q.emplace(y);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n, m;
    cin >> s >> m;
    n = s.length();
    for (int i = 1; i <= m; ++i) {
        cin >> t[i];
        insert(t[i], i);
    }
    build();
    for (int i = 1, j = 0; i <= n; ++i) {
        j = trie[j][s[i - 1] - 'a'];
        int p = j;
        while (p && !v[p]) {
            for (int idx : flag[p]) res[idx] = i;
            v[p] = true;
            p = ne[p];
        }
    }
    for (int i = 1; i <= m; ++i) {
        if (!res[i]) cout << -1 << endl;
        else cout << res[i] - t[i].length() + 1 << endl;
    }
    return 0;
}
```

## Distinct Substrings

这个是后缀自动机的板子题，结点 i 子串数量就是 $len(i) - len(fa(i))$，全部求和即可。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 200010;

int last = 1, tot = 1;
struct Node {
    int len, fa;
    int ch[26];
} node[N];

void extend(int c) {
    int p = last, np = last = ++tot;
    node[np].len = node[p].len + 1;
    for (; p && !node[p].ch[c]; p = node[p].fa) node[p].ch[c] = tot;
    if (!p) node[np].fa = 1;
    else {
        int q = node[p].ch[c];
        if (node[q].len == node[p].len + 1) node[np].fa = q;
        else {
            int nq = ++tot;
            node[nq] = node[q], node[nq].len = node[p].len + 1;
            node[np].fa = node[q].fa = nq;
            for (; p && node[p].ch[c] == q; p = node[p].fa) node[p].ch[c] = nq;
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n;
    cin >> s;
    for (char c : s) extend(c - 'a');
    long long res = 0;
    for (int i = 1; i <= tot; ++i) {
        res += node[i].len - node[node[i].fa].len;
    }
    cout << res << endl;
    return 0;
}
```

## Distinct Subsequences

> [!NOTE]
> 这道题看了题解。

线性 DP，从左到右考虑每一位填不填，唯一可能算重的情况是 `... a ... a`，第二个 `a` 和第一个 `a` 只选一个且中间一个也没选，减掉一份前面的即可。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 500010, MOD = 1000000007;
int ls[26];
LL f[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n;
    cin >> s;
    n = s.length();
    s = " " + s;
    f[0] = 1;
    for (int i = 1; i <= n; ++i) {
        int c = s[i] - 'a';
        if (!ls[c]) f[i] = f[i - 1] * 2 % MOD;
        else f[i] = ((f[i - 1] * 2 - f[ls[c] - 1]) % MOD + MOD) % MOD;
        ls[c] = i;
    }
    cout << (f[n] + MOD - 1) % MOD << endl;
    return 0;
}
```

## Repeating Substring

构建后缀自动机的时候记录一下最长的路径是从哪里来的，或者在后缀自动机上 dfs，限制只能走长度 + 1 的边（这样能保证是字典序最小的一个，不会因为没有 spj 被卡掉）。

```cpp
#include <iostream>

using namespace std;

const int N = 200010;

int last = 1, tot = 1;
struct Node {
    int len, fa;
    int ch[26];
} node[N];
int f[N];
bool v[N];
int head[N], ne[N], ver[N], cnt;

void add(int x, int y) {
    ver[++cnt] = y;
    ne[cnt] = head[x];
    head[x] = cnt;
}

void extend(int c) {
    int p = last, np = last = ++tot;
    node[np].len = node[p].len + 1;
    f[np] = 1;
    for (; p && !node[p].ch[c]; p = node[p].fa) node[p].ch[c] = np;
    if (!p) node[np].fa = 1;
    else {
        int q = node[p].ch[c];
        if (node[q].len == node[p].len + 1) node[np].fa = q;
        else {
            int nq = ++tot;
            node[nq] = node[q], node[nq].len = node[p].len + 1;
            node[np].fa = node[q].fa = nq;
            for (; p && node[p].ch[c] == q; p = node[p].fa) node[p].ch[c] = nq;
        }
    }
}

void dfs(int x) {
    for (int i = head[x]; i; i = ne[i]) {
        dfs(ver[i]);
        f[x] += f[ver[i]];
    }
}

string res;
int mxlen;

bool dfs2(int x) {
    if (v[x]) return false;
    v[x] = true;
    if (f[x] != 1 && mxlen == node[x].len) {
        return true;
    }
    else {
        for (int i = 0; i < 26; ++i) {
            if (node[x].len + 1 == node[node[x].ch[i]].len) {
                res += 'a' + i;
                if (dfs2(node[x].ch[i])) return true;
                res.pop_back();
            }
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    int n;
    cin >> s;
    for (char c : s) extend(c - 'a');
    for (int i = 2; i <= tot; ++i) {
        add(node[i].fa, i);
    }
    dfs(1);
    for (int i = 1; i <= tot; ++i) {
        if (f[i] != 1) mxlen = max(mxlen, node[i].len);
    }
    if (mxlen == 0) {
        cout << -1 << endl;
        return 0;
    }
    dfs2(1);
    cout << res << endl;
    return 0;
}
```

## String Functions

第一行可以用字符串哈希 + 二分做，第二行其实就是 KMP 的 next 数组。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;
uint64_t h1[N], h2[N], p1[N], p2[N];
int ne[N];

uint64_t get1(int l, int r) {
    return h1[l - 1] * p1[r - l + 1] - h1[r];
}

uint64_t get2(int l, int r) {
    return h2[l - 1] * p2[r - l + 1] - h2[r];
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    int n = s.length();
    s = " " + s;
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= n; ++i) {
        h1[i] = h1[i - 1] * 131 + s[i];
        h2[i] = h2[i - 1] * 1331 + s[i];
        p1[i] = p1[i - 1] * 131;
        p2[i] = p2[i - 1] * 1331;
    }
    for (int i = 1; i <= n; ++i) {
        if (i == 1) {
            cout << 0 << ' ';
            continue;
        }
        int l = 0, r = n - i + 1;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (get1(1, 1 + mid - 1) == get1(i, i + mid - 1) && get2(1, 1 + mid - 1) == get2(i, i + mid - 1)) l = mid;
            else r = mid - 1;
        }
        cout << l << ' ';
    }
    cout << endl;
    for (int i = 2, j = 0; i <= n; ++i) {
        while (j && s[i] != s[j + 1]) j = ne[j];
        if (s[i] == s[j + 1]) j++;
        ne[i] = j;
    }
    for (int i = 1; i <= n; ++i) {
        cout << ne[i] << ' ';
    }
    cout << endl;
    return 0;
}
```

## Inverse Suffix Array

> [!NOTE]
> 这道题看了题解，刚学完一个新知识点上来就活用性质真的很难。

后缀数组就是一个字符串所有的后缀（根据第一个元素的位置编号）排序后的下标序列，是一个排列，这道题让根据已有的后缀数组构造出一个序列。首先按照后缀数组 sa 的顺序字符大小单调不减，只需要考虑什么时候有可能会变大。我们顺着 sa 的顺序填，假设当前需要填第 i 个，上一个填的是 c

- 当前面存在一个 j 使得，$inv(sa(i) + 1) < inv(sa(j) + 1) \land s(sa(j)) = c$，形象化的理解就是你后面有一个前缀一样的，现在你不改你的字典序就比之前填的小了，这是不允许的.
- $sa(i) = n$，相当于上一个的边界情况

开线段树维护一下区间 max。

```cpp
#include <iostream>

using namespace std;
const int N = 100010;
int sa[N], inv[N], n;
char tr[N * 4], s[N];

void modify(int u, int l, int r, int p, char v) {
    if (l == r) tr[u] = v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        tr[u] = max(tr[u << 1], tr[u << 1 | 1]);
    }
}

char query(int u, int l, int r, int ql, int qr) {
    if (ql > qr) return 0;
    else if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        char res = 0;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    char cur = 'a';
    cin >> n; 
    for (int i = 1; i <= n; ++i) cin >> sa[i], inv[sa[i]] = i;
    for (int i = 1; i <= n; ++i) {
        if (sa[i] == n) {
            if (i != 1) cur++;
            s[sa[i]] = cur;
            continue;
        }
        else cur = max(cur, char(query(1, 1, n, inv[sa[i] + 1], n) + 1));
        if (cur > 'z') {
            cout << -1 << endl;
            return 0;
        }
        s[sa[i]] = cur;
        modify(1, 1, n, inv[sa[i] + 1], s[sa[i]]);
    }
    cout << (s + 1) << endl;
    return 0;
}
```

## String Transform

## Substring Order I

涉及到子串，又是后缀自动机。在**后缀自动机上沿着拓扑逆序 DP**（可以用记搜）统计如果走某一条边能让位次增大多少，有了这个值之后一步一步模拟就能得到目标子串了。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;
int last = 1, tot = 1;
struct Node {
    int len, fa;
    int ch[26];
} node[N];
LL cnt[N];

void extend(int c) {
    int p = last, np = last = ++tot;
    node[np].len = node[p].len + 1;
    for (; p && !node[p].ch[c]; p = node[p].fa) node[p].ch[c] = np;
    if (!p) node[np].fa = 1;
    else {
        int q = node[p].ch[c];
        if (node[q].len == node[p].len + 1) node[np].fa = q;
        else {
            int nq = ++tot;
            node[nq] = node[q], node[nq].len = node[p].len + 1;
            node[q].fa = node[np].fa = nq;
            for (; p && node[p].ch[c] == q; p = node[p].fa) node[p].ch[c] = nq;
        }
    }
}

void dfs(int x) {
    if (cnt[x]) return;
    cnt[x] = 1;
    for (int i = 0; i < 26; ++i) {
        if (node[x].ch[i]) dfs(node[x].ch[i]);
        cnt[x] += cnt[node[x].ch[i]];
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL k;
    string s;
    cin >> s >> k;
    for (char c : s) extend(c - 'a');
    dfs(1);
    int cur = 1;
    while (k) {
        for (int i = 0; i < 26; ++i) {
            if (k > cnt[node[cur].ch[i]]) k -= cnt[node[cur].ch[i]];
            else {
                cout << char(i + 'a');
                k--;
                cur = node[cur].ch[i];
                break;
            }
        }
    }
    cout << endl;
    return 0;
}
```

## Substring Order II

除了需要统计重复的子串的个数之外，和上道题基本上完全一样。需要注意一些细节，我直接复制粘贴代码然后把 k 减成负的了导致死循环 OLE😭

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;
int last = 1, tot = 1;
struct Node {
    int len, fa;
    int ch[26];
} node[N];
LL cnt[N], f[N];
int head[N], ne[N], ver[N], idx;

void add(int x, int y) {
    ver[++idx] = y;
    ne[idx] = head[x];
    head[x] = idx;
}

void extend(int c) {
    int p = last, np = last = ++tot;
    node[np].len = node[p].len + 1;
    f[np] = 1;
    for (; p && !node[p].ch[c]; p = node[p].fa) node[p].ch[c] = np;
    if (!p) node[np].fa = 1;
    else {
        int q = node[p].ch[c];
        if (node[q].len == node[p].len + 1) node[np].fa = q;
        else {
            int nq = ++tot;
            node[nq] = node[q], node[nq].len = node[p].len + 1;
            node[q].fa = node[np].fa = nq;
            for (; p && node[p].ch[c] == q; p = node[p].fa) node[p].ch[c] = nq;
        }
    }
}

void dfs1(int x) {
    for (int i = head[x]; i; i = ne[i]) {
        dfs1(ver[i]);
        f[x] += f[ver[i]];
    }
}

void dfs(int x) {
    if (cnt[x]) return;
    cnt[x] = f[x];
    for (int i = 0; i < 26; ++i) {
        if (node[x].ch[i]) dfs(node[x].ch[i]);
        cnt[x] += cnt[node[x].ch[i]];
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    LL k;
    string s;
    cin >> s >> k;
    for (char c : s) extend(c - 'a');
    for (int i = 2; i <= tot; ++i) add(node[i].fa, i);
    dfs1(1);
    dfs(1);
    int cur = 1;
    while (k > 0) {
        for (int i = 0; i < 26; ++i) {
            if (k > cnt[node[cur].ch[i]]) k -= cnt[node[cur].ch[i]];
            else {
                cout << char(i + 'a');
                k -= f[node[cur].ch[i]];
                cur = node[cur].ch[i];
                break;
            }
        }
    }
    cout << endl;
    return 0;
}
```

## Substring Distribution

同样是后缀自动机的板子，每个结点 $i$ 能贡献长度为 $\left[len(fa(i)) + 1, len(i)]\right$ distinct sucstring 各一个，维护差分数组，最后前缀和输出。

```cpp
#include <iostream>

using namespace std;

typedef long long LL;
const int N = 200010;
int last = 1, tot = 1;
struct Node {
    int len, fa;
    int ch[26];
} node[N];
LL a[N];

void extend(int c) {
    int p = last, np = last = ++tot;
    node[np].len = node[p].len + 1;
    for (; p && !node[p].ch[c]; p = node[p].fa) node[p].ch[c] = np;
    if (!p) node[np].fa = 1;
    else {
        int q = node[p].ch[c];
        if (node[q].len == node[p].len + 1) node[np].fa = q;
        else {
            int nq = ++tot;
            node[nq] = node[q], node[nq].len = node[p].len + 1;
            node[q].fa = node[np].fa = nq;
            for (; p && node[p].ch[c] == q; p = node[p].fa) node[p].ch[c] = nq;
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    cin >> s;
    for (char c : s) extend(c - 'a');
    for (int i = 2; i <= tot; ++i) {
        a[node[node[i].fa].len + 1]++, a[node[i].len + 1]--;
    }
    for (int i = 1; i <= s.length(); ++i) {
        a[i] += a[i - 1];
        cout << a[i] << ' ';
    }
    cout << endl;
    return 0;
}
```