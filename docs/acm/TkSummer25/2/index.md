---
title: 2025夏季个人训练赛第二场
---
# 2025夏季个人训练赛第二场

BCD 之前都做过，写了个 A 之后什么都不会了……

## A. 迷宫大门

我不知道什么原理，但是贪心就行了，能匹配就尽量匹配算出来的数正好是对的。

```cpp
#include <iostream>

using namespace std;

const int N = 500010;

int a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int b, c;
        scanf("%d%d", &b, &c);
        a[i] = b + c;
    }
    int res = 0, l = 0, r = a[1];
    for (int i = 2; i <= n; ++i) {
        if (a[i] < l) l = 0, r = a[i];
        else {
            res++;
            l = a[i] - l;
            r = max(0, a[i] - r);
            swap(l, r); // 这里是为了防止原来的变量被覆盖
        }
    }
    printf("%d\n", res);
    return 0;
}
```
## B. 分数统计2

用并查集算一下最多人数，然后利用等比数列求和公式用高精算 $2^n - 1$ 即可。

```cpp
#include <iostream>
#include <vector>
 
using namespace std;
 
int fa[10010], cnt[10010];
 
int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        fa[i] = i;
        cnt[i] = 1;
    }
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        x = getfa(x), y = getfa(y);
        if (x != y) fa[y] = x, cnt[x] += cnt[y];
    }
    int mx = 0;
    for (int i = 1; i <= n; ++i) {
        if (i == fa[i]) mx = max(mx, cnt[i]);
    }
    vector<int> res(1, 1);
    for (int i = 1; i <= mx; ++i) {
        for (int &t : res) t *= 2;
        for (int i = 0; i < res.size(); ++i) {
            if (res[i] > 9) {
                if (i == res.size() - 1) {
                    if (res.size() < 100) res.push_back(res[i] / 10);
                } 
                else res[i + 1] += res[i] / 10;
                res[i] %= 10;
            }
        }
    }
    for (int i = res.size() - 1; i; --i) cout << res[i];
    cout << res[0] - 1 << endl;
    return 0;
}
```

## C. 朋友

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
 
using namespace std;
 
vector<int> f[10010];
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int x, y;
        cin >> x >> y;
        f[x].push_back(y);
        f[y].push_back(x);
    }
    int p = 1;
    for (int i = 1; i <= n; ++i) {
        if (f[i].size() > f[p].size()) p = i;
    }
    sort(f[p].begin(), f[p].end());
    for (int i : f[p]) {
        cout << i << ' ';
    }
    cout << endl;
    return 0;
}
```

## D. 跳棋

单调队列优化的 dp，维护滑动窗口的最小值。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
long long f[1000010], a[1000010];
int q[1000010];
 
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, l, r;
    cin >> n >> l >> r;
    memset(f, 0x3f, sizeof(f));
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    int hh = 0, tt = -1;
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        while (hh <= tt && q[hh] + r + 1 < i) hh++;
        if (i - l - 1 >= 0) {
            while (hh <= tt && f[q[tt]] >= f[i - l - 1]) tt--;
            q[++tt] = i - l - 1;
        }
        if (hh <= tt) f[i] = f[q[hh]] + a[i];
    }
    if (f[n] >= 0x3f3f3f3f3f3f3f3f) cout << -1 << endl;
    else cout << f[n] << endl;
    return 0;
}
```