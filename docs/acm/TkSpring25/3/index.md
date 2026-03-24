---
title: 2025春训第三场
---
# 2025春训第三场

考场上只做出来了 A、C、D、F。我真的敲高精了，而且甚至加法取模都敲了，刚开始 B 有一个样例是错的，带沟里之后回不来了，考完之后被 @[xx liu (qwertyuiop)](@liuxx) 大佬一句话敲醒了😇。数学题确实有点不好想，当时也是尽力了。

## A. 字符串比对

签到题

```cpp
#include <iostream>

using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    if (a.length() != b.length()) cout << 1 << endl;
    else {
        bool f1 = true, f2 = true;
        for (int i = 0; i < a.length(); ++i) {
            if (a[i] != b[i]) f1 = false;
            if (toupper(a[i]) != toupper(b[i])) f2 = false;
        }
        if (f1) cout << 2 << endl;
        else if (f2) cout << 3 << endl;
        else cout << 4 << endl;
    }
    return 0;
}
```

## B. 数学小店的奇妙兑换

高精度除法 `n / (k - 1)`.

```cpp
#include <iostream>
#include <vector>
#define int long long

using namespace std;

vector<int> div(vector<int> a, int b) {
    vector<int> res(a.size(), 0);
    long long t = 0;
    for (int i = a.size() - 1; i >= 0; --i) {
        t = t * 10 + a[i];
        res[i] = t / b;
        t %= b;
    }
    while (res.back() == 0 && res.size() > 1) res.pop_back();
    return res;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    vector<int> n;
    string s;
    int k;
    cin >> s >> k;
    n.resize(s.length());
    for (int i = 0; i < s.length(); ++i) {
        n[i] = s[s.length() - i - 1] - '0';
    }
    vector<int> res = div(n, k - 1);
    for (int i = res.size() - 1; i >= 0; --i) {
        cout << res[i];
    }
    cout << endl;
    return 0;
}
```

## C. 染色

正向维护很困难，但是反向处理很简单，因为不用考虑这次染色的点会不会被后续的操作改变，给行和列各开一个删除标记，染色之后打上标记，每次操作完之后后续操作的行数或者列数 -1。

```cpp
#include <iostream>
#include <stack>

using namespace std;

struct Query
{
    int op, u, c;  
};
bool vis[100010][2];
long long cnt[100010];
stack<Query> st;

int main() {
    int n, m, k, q;
    scanf("%d%d%d%d", &n, &m, &k, &q);
    for (int i = 1; i <= q; ++i) {
        int op, u, c;
        scanf("%d%d%d", &op, &u, &c);
        st.push({op, u, c});
    }
    while (!st.empty()) {
        auto [op, u, c] = st.top();
        st.pop();
        if (op == 0) {
            if (!vis[u][op]) {
                cnt[c] += n;
                vis[u][op] = true;
                m--;
            }
        }
        else {
            if (!vis[u][op]) {
                cnt[c] += m;
                vis[u][op] = true;
                n--;
            }
        }
    }
    for (int i = 1; i <= k; ++i) printf("%lld ", cnt[i]);
    printf("\n");
    return 0;
}
```

## D. 魔法传送门

因为答案乘的倍数就是二进制的位数，可以把每一份答案直接分摊到每个二进制位，开一个状态数组记录当前状态之前的全部状态的每个二进制位提供的方案数总和。遍历到一个状态的时候，先枚举二进制位更新答案，再枚举二进制位用新答案更新状态数组。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int MOD = 998244353;

int a[200010];
long long f[200010], s[30];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        memset(s, 0, sizeof(s));
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            if (i == 1) f[i] = 1;
            else {
                f[i] = 0;
                for (int j = 0; j < 30; ++j) {
                    if (a[i] >> j & 1) f[i] = (f[i] + s[j]) % MOD;
                }
            }
            for (int j = 0; j < 30; ++j) {
                if (a[i] >> j & 1) s[j] = (s[j] + f[i]) % MOD;
            }
        }
        printf("%lld\n", f[n]);
    }
    return 0;
}
```

## E. 同余方程 (fang)

注意到 a 是连续区间，而 b² 和 c³ 是离散的，可以把 a 捏到 b² 或者 c³ 中；又因为题目要求 a ≤ b ≤ c，把 a 捏到 b² 中更好维护。具体的，需要动态维护一个长度为 k 的数组，记录 a + b² mod k 的每种结果的方案数，在从 1 到 n 枚举 b 的过程中更新每个可能的 c 对应的答案，累加即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

long long tr[1000010];
int n, k;

void add(int u, int v) {
    u++;
    for (; u <= k; u += u & -u) {
        tr[u] += v;
    }
}

long long query(int u) {
    u++;
    long long res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

int main() {
    int T;
    scanf("%d", &T);
    for (int t = 1; t <= T; ++t) {
        memset(tr, 0, sizeof(tr));
        scanf("%d%d", &n, &k);
        long long res = 0;
        for (int i = 1; i <= n; ++i) {
            long long l = (long long)i * i + 1, r = (long long)i * i + i;
            add(0, (r - l + 1) / k);
            r -= (r - l + 1) / k * k;
            if (l <= r) {
                l %= k, r %= k;
                if (l <= r) add(l, 1), add(r + 1, -1);
                else add(0, 1), add(r + 1, -1), add(l, 1);
            }
            res += query((long long)i * i * i % k);
        }
        printf("Case %d: %lld\n", t, res);
    }
    return 0;
}
```

## F. 计算器 (monitor)

就是简单的模拟题，写一个 8 的然后复制粘贴，适当删减就可以得到别的。

```cpp
#include <iostream>
#include <vector>

using namespace std;

vector<vector<char>> trans(int n, int t) {
    vector<vector<char>> res(3 + t * 2, vector<char>(t + 2, ' '));
    if (n == 0) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[1 + i][t + 1] = res[2 + t + i][0] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 1) {
        for (int i = 0; i < t; ++i) {
            res[1 + i][t + 1] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 2) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][t + 1] = res[2 + t + i][0] = '|';
        }
    }
    else if (n == 3) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][t + 1] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 4) {
        for (int i = 1; i <= t; ++i) {
            res[1 + t][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[1 + i][t + 1] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 5) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 6) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[2 + t + i][0] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 7) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][t + 1] = res[2 + t + i][t + 1] = '|';
        }
    }
    else if (n == 8) {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[1 + i][t + 1] = res[2 + t + i][0] = res[2 + t + i][t + 1] = '|';
        }
    }
    else {
        for (int i = 1; i <= t; ++i) {
            res[0][i] = res[1 + t][i] = res[2 + t * 2][i] = '-';
        }
        for (int i = 0; i < t; ++i) {
            res[1 + i][0] = res[1 + i][t + 1] = res[2 + t + i][t + 1] = '|';
        }
    }
    return res;
}

void print(vector<vector<char>> t) {
    for (auto i : t) {
        for (auto j : i) putchar(j);
        putchar('\n');
    }
}

void cat(vector<vector<char>> &a, vector<vector<char>> b) {
    for (int i = 0; i < a.size(); ++i) {
        a[i].push_back(' ');
        a[i].insert(a[i].end(), b[i].begin(), b[i].end());
    }
}

int main() {
    int n;
    char s[10];
    while (scanf("%d%s", &n, s), n && s[0] != 0) {
        auto res = trans(s[0] - 48, n);
        for (int i = 1; s[i]; ++i) {
            cat(res, trans(s[i] - 48, n));
        }
        print(res);
        putchar('\n');
    }
    return 0;
}
```