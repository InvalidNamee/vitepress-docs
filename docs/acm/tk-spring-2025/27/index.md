---
title: 2025春训第二十七场
---
# 2025春训第二十七场

## A. 序列

逻辑非常简单，先输出 k 个 0 之后 01 交替输出直到把 0 用完，最后输出剩下的 1.

```cpp
#include <iostream>

using namespace std;

int main() {
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i <= k; ++i) {
        printf("0");
        m--;
    }
    while (n || m) {
        if (n) printf("1"), n--;
        if (m) printf("0"), m--;   
    }
    printf("\n");
    return 0;
}
```

## **B. 异或之力**

也比较容易，不难想到**最优方案是取 11111…0**，因为这是个偶数，对半分异或 = 0；任意从中间断开，然后异或还是原数，答案是 $2^{n} - 2$.

需要特判 2，因为 2 只能分出正整数 1，答案是 0.

```cpp
#include <iostream>

using namespace std;

const int MOD = 1e9 + 7;
int power(int n, int p) {
    long long res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int main() {
    int n;
    cin >> n;
    if (n <= 2) cout << 0 << endl;
    else cout << (power(2, n) - 2 + MOD) % MOD << endl;
    return 0;
}
```

## **C. 队伍集结**

看着吓人，实则不是，直接暴力 $\Theta(n^4)$ **预处理所有区间的最小不满度**，然后开一个二维状态 $f_{i, j}$ 表示以 i 结尾的区间加了 j 个汇合点时不满都的最小值，枚举最后一段区间 dp 即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 210;
long long d[N], f[N][N], s[N][N];

int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) {
        int a, b;
        cin >> a >> b;
        d[a + 1] += b;
    }
    memset(f, 0x3f, sizeof(f));
    memset(s, 0x3f, sizeof(s));
    for (int i = 1; i <= 201; ++i) {
        for (int j = i; j <= 201; ++j) {
            for (int k = i; k <= j; ++k) {
                long long res = 0;
                for (int l = i; l <= j; ++l) {
                    res += (long long)(l - k) * (l - k) * d[l];
                }
                s[i][j] = min(s[i][j], res);
            }
        }
    }
    f[0][0] = 0;
    for (int i = 1; i <= 201; ++i) {
        for (int j = 1; j <= k; ++j) { // 使用次数
            for (int l = 1; l <= i; ++l) {
                f[i][j] = min(f[i][j], f[l - 1][j - 1] + s[l][i]);
            }
        }
    }
    cout << f[201][k] << endl;
    return 0;
}
```

## D. **花**

子树在 dfs 序下一定是一段连续区间，把节点**按 dfs 序建一棵线段树**维护单点修改和区间查询即可。

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;

const int N = 200010;

vector<int> ed[N];
int dfn[N], cnt[N], t;
int tr[N * 4];
int a[N];

void dfs(int x, int fa) {
    dfn[x] = ++t;
    cnt[x] = 1;
    for (int y : ed[x]) {
        if (y == fa) continue;
        dfs(y, x);
        cnt[x] += cnt[y];
    }
}

void pushup(int u) {
    tr[u] = max(tr[u << 1], tr[u << 1 | 1]);
}

void modify(int u, int l, int r, int p, int val) {
    if (l == r) tr[u] = val;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, val);
        else modify(u << 1 | 1, mid + 1, r, p, val);
        pushup(u);
    }
}

int query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
        if (qr > mid) res = max(res, query(u << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    for (int i = 1; i < n; ++i) {
        int a, b;
        scanf("%d%d", &a, &b);
        ed[a].push_back(b);
        ed[b].push_back(a);
    }
    dfs(1, 0);
    for (int i = 1; i <= n; ++i) {
        modify(1, 1, n, dfn[i], a[i]);
    }
    while (m--) {
        int op;
        scanf("%d", &op);
        if (op == 1) {
            int u, w;
            scanf("%d%d", &u, &w);
            modify(1, 1, n, dfn[u], w);
        }
        else {
            int u;
            scanf("%d", &u);
            printf("%d\n", query(1, 1, n, dfn[u], dfn[u] + cnt[u] - 1));
        }
    }
    return 0;
}
```

## **E. 分糖果**

水题

```cpp
#include <iostream>

using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (b + a - 1) / a << endl;
    return 0;
}
```

## **F. 新字典**

水题

```cpp
#include <iostream>

using namespace std;

int p[26];

char check(string a, string b) {
    int l = min(a.length(), b.length());
    for (int i = 0; i < l; ++i) {
        if (a[i] != b[i]) return p[a[i] - 'a'] < p[b[i] - 'a'] ? 's' : 't';
    }
    return a.length() < b.length() ? 's' : 't';
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    string s, t;
    cin >> s >> t;
    int T;
    cin >> T;
    while (T--) {
        string dic;
        cin >> dic;
        for (int i = 0; i < 26; ++i) p[dic[i] - 'a'] = i;
        cout << check(s, t) << endl;
    }
    return 0;
}
```

## **G. 机器人**

二分答案，需要注意**二分下界是** $\max_{i=1}^na_i$，初始任务也是任务😭

```cpp
#include <iostream>
#include <vector>
#include <climits>
#define int long long

using namespace std;

const int N = 100010;
int n, m, t;
int a[N];

bool check(int mid) {
    long long cnt = 0;
    for (int i = 1; i <= m; ++i) {
        cnt += max(0ll, (mid - a[i]) / t);
    }
    return cnt >= n;
}

signed main() {
    cin >> n >> m >> t;
    int l = 0, r = 1000000000000;
    for (int i = 1; i <= m; ++i) {
        cin >> a[i];
        l = max(l, a[i]);
    }
    while (l < r) {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    cout << l << endl;
    return 0;
}
```

## **H. 游戏**

基础的二维 dp， $f_{i, j}$ 表示**第 i 天还剩 j 资源能获得的最大强度值**，每天枚举所有的 j 和买不买更新状态。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 5010;
int f[N][N];

int main() {
    int n;
    scanf("%d", &n);
    memset(f, -0x3f, sizeof(f));
    f[0][0] = 0;
    for (int i = 1; i <= n; ++i) {
        int a, b;
        scanf("%d%d", &a, &b);
        for (int j = 0; j < i; ++j) {
            // 不买
            f[i][j + 1] = max(f[i][j + 1], f[i - 1][j]);
            // 买
            if (j + 1 >= a) {
                f[i][j + 1 - a] = max(f[i][j + 1 - a], f[i - 1][j] + b);
            }
        }
    }
    int res = 0;
    for (int i = 0; i <= n; ++i) res = max(res, f[n][i]);
    printf("%d\n", res);
    return 0;
}
```

## **I. ABB**

水题

```cpp
#include <iostream>
#include <set>

using namespace std;

set<string> a;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    string s;
    cin >> s;
    for (int i = 0; i < s.length() - 2; ++i) {
        if (s[i] != s[i + 1] && s[i + 1] == s[i + 2]) a.insert(s.substr(i, 3));
    }
    cout << a.size() << endl;
    return 0;
}
```

## J. 负重爬楼梯

水题（线性 dp）

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100010;
int a[N];
long long f[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    memset(f, 0x3f, sizeof(f));
    f[1] = a[1];
    f[0] = 0;
    for (int i = 2; i <= n; ++i) {
        f[i] = min(f[i - 2] + a[i], f[i - 1] + a[i]);
    }
    printf("%lld\n", min(f[n], f[n - 1]));
    return 0;
}
```

## **K. 洒水器**

直接暴力维护等差数列不好维护，但是我们可以维护等差数列的**差分数列**，等差数列公差一定，所以这个差分数列可以**再用它的差分数列**维护，最后前缀和两次输出答案即可。

需要特判左边界，不需要特判右边界，因为已经出界了无所谓了。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;
long long s[N];
int p[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &p[i]);
    }
    for (int i = 1; i <= n; ++i) {
        int w;
        scanf("%d", &w);
        int lp = max(p[i] - w + 1, 1), rp = min(p[i] + w - 1, m);
        s[lp] += w - abs(p[i] - lp);
        s[lp + 1] -= w - abs(p[i] - lp);
        s[lp + 1] += 1;
        s[p[i] + 1] -= 2;
        s[rp + 2]++;
    }
    for (int i = 1; i <= m; ++i) {
        s[i] += s[i - 1];
    }
    for (int i = 1; i <= m; ++i) {
        s[i] += s[i - 1];
        printf("%lld ", s[i]);
    }
    printf("\n");
    return 0;
}
```