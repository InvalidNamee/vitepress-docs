---
title: The 2022 ICPC Asia East Continent Final Contest
---
# The 2021 ICPC Asia East Continent Final Contest

qoj 链接：[https://qoj.ac/contest/1041](https://qoj.ac/contest/1041)

如果代码是我写的或者是后来补的，我会贴一下我这儿留着的代码，如果是我参与的我会写一下思路。

过了 A, B, I, L 五道题，罚时 494，找不到奖牌数量了，不过肯定有有铜牌。

## A. DFS Order

签到题，树形 DP，深度是最小 DFS 序，n - 子树大小 + 1是最大 DFS 序。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 100010;
int head[N], ver[N], ne[N], tot;
int f[N][2], cnt[N];
int n;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dfs(int x) {
    cnt[x] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        f[y][0] = f[x][0] + 1;
        dfs(y);
        cnt[x] += cnt[y];
        f[y][1] = n - cnt[y] + 1;
    }
}

void solve() {
    cin >> n;
    tot = 0;
    memset(head, 0, sizeof(int) * (n + 1));
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        add(x, y);
    }
    f[1][0] = f[1][1] = 1;
    dfs(1);
    for (int i = 1; i <= n; ++i) {
        cout << f[i][0] << ' ' << f[i][1] << endl;
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

## I. Future Coder

签到题，我把合法的数对归位了三类。

- 不大于 0 的数 - 大于 0 的数
- 1 和 1
- 1 和其他正数

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        long long npos = 0, one = 0, pos = 0;
        for (int i = 1; i <= n; ++i) {
            int t;
            cin >> t;
            if (t <= 0) npos++;
            else if (t == 1) one++;
            else pos++;
        }
        cout << npos * (one + pos) + (one * (one - 1)) / 2 + one * pos << endl;
    }
    return 0;
}
```

## L. Fenwick Tree

参与了，但是最后一版代码不是我的。思路是在树状数组上自底向上做树形 DP（不用真的建出来树），从当前不进行操作完全不可能满足的点开始往后传一个标记，如果一个位置有两个以上的标记，能直接通过改前面加的数来满足要求，现在前面成了一个整体，标记重置成 1 次，继续往后做。


## B. Beautiful String

$n^2$ 枚举 $s_2 s_3$ 枚举分界点，找前面的这个组合的前缀和后面的这个组合出现的次数。但是常数卡的很严重，我们的哈希 + unordered_map 开 o2 优化极限的过了。

