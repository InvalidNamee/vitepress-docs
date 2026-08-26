---
title: CSES Introductory Problems
---
# CSES Introductory Problems

这些是寒假集训新做的题，之前做过的不会再专门写一遍题解了，如果需要代码可以看[仓库](https://github.com/InvalidNamee/OJ-AC-Repository-for-UPC/tree/main/AC_code/CSES%E7%B3%BB%E5%88%97/3833_Introductory_Problems)。

## Raab Game I

首先，两个人的总分一定不会比牌数多，其次一个人合法的得分范围是 $\left[1, n - 1\right]$，只需要排序一下全部往后错一位就可以得到这两个边界，所以对于一个合法的结果一定满足

$$
\begin{align}
    a + b \le n\\
    a \neq 0\\
    b \neq 0
\end{align}
$$

不难发现平局不管出什么牌对其他的大小关系都没有影响，所以不妨先抽最后面的把平局的都打完，然后把剩下的排序，**根据胜场数轮换其中一个人的出牌顺序**就可以了。我的策略是打完平局之后，把 $a$ 的出牌顺序全部往后错 $b$ 位，让他输掉前 $b$ 场，赢后 $a$ 场。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        vector<int> va, vb;
        int n, a, b;
        cin >> n >> a >> b;
        if (a + b > n || (!a || !b) && (a | b)) {
            cout << "NO" << endl;
            continue;
        }
        while (a + b != n) {
            va.emplace_back(n), vb.emplace_back(n);
            n--;
        }
        if (n == 1) {
            cout << "NO" << endl;
            continue;
        }
        for (int i = 1; i <= n; ++i) {
            va.emplace_back((i + b - 1) % n + 1), vb.emplace_back(i);
        }
        cout << "YES" << endl;
        for (int i : va) cout << i << ' ';
        cout << endl;
        for (int i : vb) cout << i << ' ';
        cout << endl;
    }
    return 0;
}
```

## Mex Grid Construction

我刚开始看错题了，我本来以为鸽子里填的是一行和一列的 mex 值，又读了一遍之后发现只是前面的 mex 值，所以直接模拟即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 110;
int a[N][N];
bool f[N * 2];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= i; ++j) {
            memset(f, 0, sizeof(f));
            for (int k = 1; k < j; ++k) f[a[i][k]] = true;
            for (int k = 1; k < i; ++k) f[a[k][j]] = true;
            for (int k = 0; k < 200; ++k) {
                if (!f[k]) {
                    a[i][j] = a[j][i] = k;
                    break;
                }
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            cout << a[i][j] << ' ';
        }
        cout << endl;
    }
    return 0;
}
```

## Knight Moves Grid

经过查阅资料，这个 Knight 可以等价代换成中国象棋的**马**，边权为 1 的图上的最短路直接 bfs 即可。

```cpp
#include <iostream>
#include <cstring>
#include <queue>

using namespace std;

const int N = 1010;
const int dx[] = {1, 1, -1, -1, 2, 2, -2, -2}, dy[] = {2, -2, 2, -2, 1, -1, 1, -1};
int v[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    memset(v, -1, sizeof(v));
    v[1][1] = 0;
    queue<pair<int, int>> q;
    q.emplace(1, 1);
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        for (int i = 0; i < 8; ++i) {
            int tx = x + dx[i], ty = y + dy[i];
            if (v[tx][ty] == -1 && 0 < tx && tx <= n && 0 < ty && ty <= n) {
                v[tx][ty] = v[x][y] + 1;
                q.emplace(tx, ty);
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) cout << v[i][j] << ' ';
        cout << endl;
    }
    return 0;
}
```

## Grid Coloring I

一个位置合法，当且仅当和当前不一样，和左侧不一样，和上方不一样，但是每个位置有四个选择，所以**一定能选出一个合法的**，直接模拟即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 510;
int a[N][N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    memset(a, -1, sizeof(a));
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            char c;
            cin >> c;
            a[i][j] = (c - 'A') % 4;
            for (int k = 0; k < 4; ++k) {
                if (a[i][j] != k && a[i - 1][j] != k && a[i][j - 1] != k) {
                    a[i][j] = k;
                    break;
                }
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cout << char(a[i][j] + 'A');
        }
        cout << endl;
    }
    return 0;
}
```

## String Reorder

假设现在还剩 $n$ 个字符，出现次数最多的字符的出现次数为 $cnt$。如果一上来就 $cnt > \lceil\frac{n}{2}\rceil$，那一定不合法，反之合法。确保全局合法之后从前到后一个一个选

- $n\ \text{is odd}\ \land\ \lceil\frac{n}{2}\rceil = cnt$，只能选出现次数最多的，保证合法性
- 否则，贪心选最小的，保证字典序

```cpp
#include <iostream>

using namespace std;
const int N = 100010;
int cnt[26];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, mxp = 0;
    string s;
    cin >> s;
    n = s.length();
    for (char c : s) cnt[c - 'A']++;
    for (int j = 0; j < 26; ++j) {
        if (cnt[j] > cnt[mxp]) mxp = j;
    }
    if (cnt[mxp] > (n + 1 >> 1)) {
        cout << -1 << endl;
        return 0;
    }
    for (int i = 1, ls = -1; i <= n; ++i) {
        int pos = -1;
        if ((n - i + 1 & 1) && cnt[mxp] == (n - i + 2 >> 1)) pos = mxp;
        else for (int j = 0; j < 26; ++j) {
            if (cnt[j] && j != ls) {
                pos = j;
                break;
            }
        }
        cout << char(pos + 'A');
        cnt[pos]--;
        for (int j = 0; j < 26; ++j) {
            if (cnt[j] > cnt[mxp]) mxp = j;
        }
        ls = pos;
    }
    cout << endl;
    return 0;
}
```