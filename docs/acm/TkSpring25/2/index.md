---
title: 2025春训第二场
---
# 2025春训第二场

考场上只做出来了 A、B、C，拼尽全力无法战胜数学题😭😭😭。

D 一开始想错了方向，各种分解质因数把自己搞头疼了都，事后暴力莽出来了；E 事后打表打了 20min 以惊人的毅力拿下（别急，还有反转）。

## A. 矩形

把三个矩形的左下角坐标取 max，右上角坐标取 min，就是重叠部分的矩形。

* ps：注意判断是否重叠，否则不重叠的可能会负负得正，然后 WA.
    

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    long long x1, y1, x2, y2;
    long long a1, b1, a2, b2;
    cin >> x1 >> y1 >> x2 >> y2;
    cin >> a1 >> b1 >> a2 >> b2;
    x1 = max(x1, a1), y1 = max(y1, b1), x2 = min(x2, a2), y2 = min(y2, b2);
    cin >> a1 >> b1 >> a2 >> b2;
    x1 = max(x1, a1), y1 = max(y1, b1), x2 = min(x2, a2), y2 = min(y2, b2);
    if (x2 - x1 <= 0 || y2 - y1 <= 0) cout << 0 << endl;
    else cout << max(0ll, (x2 - x1) * (y2 - y1)) << endl;
    return 0;
}
```

这么水的题还有人用 AI 写，还被抓了😲.

## B. 全球通勤

每条边的 VIP 是相互独立的，直接差分前缀和统计每条边经过的次数，最后遍历一次算出来每条边的最优解加起来即可。

* ps：注意 l 可能大于 r，可能需要 swap 一下。
    

```cpp
#include <cstdio>
#include <iostream>

using namespace std;

const int N = 5000010;
int a[N], b[N], c[N];
int t[N];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i < n; ++i) {
        scanf("%d%d%d", &a[i], &b[i], &c[i]);
    }
    while (m--) {
        int l, r;
        scanf("%d%d", &l, &r);
        if (l > r) swap(l, r);
        t[l]++, t[r]--;
    }
    long long res = 0;
    for (int i = 1; i < n; ++i) {
        t[i] += t[i - 1];
        res += min(t[i] * a[i], t[i] * c[i] + b[i]);
    }
    printf("%lld\n", res);
    return 0;
}
```

## C. 社交网络

不能继续执行操作的情况只有一种，任何一个点所在的连通块都是完全图。所以直接找连通块，统计连通块的点数和边数算出每个连通块的操作次数累加即可。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 200010;
vector<int> ed[N];
int id[N], tot;
int cnt[N], ed_cnt[N];

void dfs(int x) {
    if (id[x]) return; 
    id[x] = tot;
    cnt[tot]++;
    for (int y : ed[x]) {
        dfs(y);
    }
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 0; i < m; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].push_back(y);
        ed[y].push_back(x);
    }
    for (int i = 1; i <= n; ++i) {
        sort(ed[i].begin(), ed[i].end());
        ed[i].erase(unique(ed[i].begin(), ed[i].end()), ed[i].end());
    }
    for (int i = 1; i <= n; ++i) {
        if (!id[i]) {
            ++tot;
            dfs(i);
        }
    }
    for (int i = 1; i <= n; ++i) {
        ed_cnt[id[i]] += ed[i].size();
    }
    long long res = 0;
    for (int i = 1; i <= tot; ++i) {
        res += (long long)cnt[i] * (cnt[i] - 1) / 2 - ed_cnt[i] / 2;
    }
    cout << res << endl;
    return 0;
}
```

## D. 数数

我的做法有点暴力，但是时间复杂度是没有问题的。

* 首先考虑暴力如何解决，直接枚举指数 i in \[2, 60\]，底数 j in \[1, $n^{\frac{1}{i}}$\]，把所有 $j^i$去重统计个数。
    
* 不难发现暴力的瓶颈在 $\sqrt{n}$ 上，如果 i 从 3 开始枚举，那么就不会 TLE，所以干脆直接从 3 枚举，如果 $j^i$，是平方数就直接忽略，最后一次性加进去一个 $\sqrt n$ 即可。
    
* n = 1e18 时时间复杂度是 1e6 级别的， 完全可行。
    

```cpp
#include <iostream>
#include <cmath>
#include <unordered_set>

using namespace std;

long long power(long long n, long long p) {
    long long res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base;
        base = base * base;
        p >>= 1;
    }
    return res;
}

unordered_set<long long> s;

int main() {
    long long n;
    cin >> n;
    for (int i = 60; i >= 3; --i) {
        for (int j = (long long)pow(n, 1.0 / i); j; --j) {
            long long t = power(j, i);
            if (power((int)sqrt(t), 2) != t) s.insert(t);
        }
    }
    cout << s.size() + (int)(sqrt(n) + 1e-9) << endl;
    return 0;
}
```

## E. **出题 (problem)**

我能力不足，找不到选择策略，只能暴搜了😭

* **迭代加深：**因为要求方案字典序最小，所以必须优先搜小的，然而优先搜小的可能会导致递归层数增长过快爆栈或者 TLE，所以用迭代加深一步步试探可行性更高。
    

* **剪枝1:** 当前序列最后一位大于 n 时，直接不用搜了。
    
* **剪枝2:** 当前序列最后一位的 2^cnt 倍小于 n 时，一定不合法，即使不断翻倍也无法在指定步数内到达 n。（其中cnt = 后续空位数）
    

```cpp
#include <iostream>
#include <vector>

using namespace std;

int cur[20];
int n;

bool dfs(int x, int d) {
    if (x > d) {
        if (cur[x - 1] == n) return true;
        else return false;
    }
    if (cur[x - 1] > n || (long long)cur[x - 1] * (1 << (d - x + 1)) < n) return false;
    for (int i = 0; i < x; ++i) {
        for (int j = 0; j <= i; ++j) {
            if (cur[i] + cur[j] > cur[x - 1]) {
                cur[x] = cur[i] + cur[j];
                if (dfs(x + 1, d)) return true;
            }
        }
    }
    return false;
}

int main() {
    scanf("%d", &n);
    int l;
    cur[0] = 1;
    for (l = 1; !dfs(1, l); ++l);
    for (int i = 1; i <= l; ++i) {
        printf("%d ", cur[i]);
    }
    printf("\n");
    return 0;
}
```

### **WARNINGS**

* **不要用 vector** 频繁 push\_back 和 pop\_back，会严重超时！！！<s>害我打了 20min 表</s>
    
* 注意**常数**优化，能算一次就不算第二次，否则搜索规模会指数级扩大。
    

## F. 连续段 (row[)](https://icpc.upc.edu.cn/problem.php?cid=4080&pid=5)

这道题目前 0/0，我量力而为💔