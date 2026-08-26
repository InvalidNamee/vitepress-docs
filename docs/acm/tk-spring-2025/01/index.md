---
title: 2025春训第一场
---
# 2025春训第一场

考场上只做出来了 A、B、C、D，而且 C 和 D 做的很煎熬，E 是因为知识的缺失，F 那一条关键的性质不太好想。

## A. 好的序列

签到题，最长上升子序列变体，但是前置状态是固定的，直接开一个标记数组即可。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

int f[100010], a[100010];

int main() {
    memset(f, -1, sizeof(f));
    int n, res = 0;
    cin >> n;
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        if (f[a[i] - 1] != -1) {
            f[a[i]] = f[a[i] - 1] + 1;
            res = max(res, f[a[i]]);
        }
    }
    cout << res << endl;
    return 0;
}
```

## B. 一路向上

对于每个点向比他高的点建边，拓扑排序找最长的路径即可。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 1000010;
int dx[] = {-1, 1, 0, 0}, dy[] = {0, 0, 1, -1};
int ver[N * 4], head[N], ne[N * 4], deg[N], tot;
int a[N], f[N];

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    deg[y]++;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            scanf("%d", &a[(i - 1) * m + j]);
        }
    }
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            for (int k = 0; k < 4; ++k) {
                int ti = i + dx[k], tj = j + dy[k];
                if (ti > 0 && ti <= n && tj > 0 && tj <= m && a[(i - 1) * m + j] < a[(ti - 1) * m + tj]) {
                    add((i - 1) * m + j, (ti - 1) * m + tj);
                }
            }
        }
    }
    queue<int> q;
    for (int i = 1; i <= n * m; ++i) {
        if (deg[i] == 0) {
            f[i] = 1;
            q.push(i);
        }
    }
    int res = 0;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        res = max(res, f[x]);
        for (int i = head[x]; i; i = ne[i]) {
            int y = ver[i];
            f[y] = max(f[y], f[x] + 1);
            if (--deg[y] == 0) q.push(y);
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## C. 神使

每轮票只可能投到战力值最大的或者最小的，所以按照 $a_i$ 排序，不断比较头和尾的票数进行淘汰，直到剩下最后一个。

```cpp
#include <iostream>
#include <algorithm>
#include <unordered_map>

using namespace std;

const int N = 1000010;
pair<int, int> a[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i].first;
        a[i].second = i;
    }
    sort(a + 1, a + n + 1);
    int h = 1, t = n;
    while (h < t) {
        int m = a[h].first + a[t].first >> 1;
        int l = h, r = t;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            if (a[mid].first <= m) l = mid;
            else r = mid - 1;
        }
        if (l - h + 1 >= t - l) t--;
        else h++;
    }
    cout << a[h].second << endl;
    return 0;
}
```

## D. 遥远的她

$(x_1,y_1)$和 $(x_2, y_2)$ 之间互相可达，当且仅当 $||x_1 - x_2| - |y_1 - y_2||\  \%\ 2 = 0$.

把坐标系旋转 45˚（我这里是顺时针旋转的），把单位长度设置成 $\frac{\sqrt{2}}{2}$，每组内按其中一个分量排序，另一个分量用数状数组维护，最后除以2即可。

```cpp
#include <iostream>
#include <map>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 200010;

pair<long long, long long> f[2][N];
int len[2];
long long tr[N];
int cnt[N], m;

void add(int u, long long v) {
    for (; u <= m; u += u & -u) {
        tr[u] += v;
        cnt[u]++;
    }
}

int qcnt(int u) {
    int res = 0;
    for (; u; u -= u & -u) {
        res += cnt[u];
    }
    return res;
}

long long query(int u) {
    long long res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int x, y;
        cin >> x >> y;
        int t = (x & 1) ^ (y & 1);
        f[t][++len[t]] = {x, y};
    }
    long long s = 0;
    for (int t = 0; t < 2; ++t) {
        m = 0;
        memset(tr, 0, sizeof(tr));
        memset(cnt, 0, sizeof(cnt));
        map<int, int> mp;
        for (int i = 1; i <= len[t]; ++i) {
            f[t][i] = {f[t][i].first - f[t][i].second, f[t][i].first + f[t][i].second};
            mp[f[t][i].second];
        }
        sort(f[t] + 1, f[t] + 1 + len[t]);
        for (auto &i : mp) i.second = ++m;
        long long ps = 0;
        for (int i = 1; i <= len[t]; ++i) {
            int tt = qcnt(mp[f[t][i].second]);
            s += f[t][i].first * (i - 1) - ps + f[t][i].second * tt - query(mp[f[t][i].second]) * 2 - f[t][i].second * (i - tt - 1) + query(m);
            ps += f[t][i].first;
            add(mp[f[t][i].second], f[t][i].second);
        }
    }
    cout << s / 2 << endl;
    return 0;
}
```

## E. **spongebob**

这道题是后来补的，显然最后叠加出来的函数是单峰的，用三分求峰值即可。

* 需要注意：三分的 rps 应该比题目要求的小，因为最坏的情况有 3e5 个 1e6 倍的 x 叠加。
    

```cpp
#include <iostream>
#include <cmath>

using namespace std;

const int N = 300010;
int a[N], b[N], n;

double sum(double x) {
    double res = 0;
    for (int i = 1; i <= n; ++i) {
        res += fabs(x * a[i] + (double)b[i]);
    }
    return res;
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i], &b[i]);
    }
    double l = -1e6, r = 1e6;
    while (r - l > 1e-12) {
        double mid1 = (l * 2 + r) / 3, mid2 = (l + r * 2) / 3;
        if (sum(mid1) > sum(mid2)) l = mid1;
        else r = mid2;
    }
    printf("%lf\n", sum((l + r) / 2));
    return 0;
}
```

## F. **patrick**

每个 h 对应的答案可以用数状数组或者线段树在线维护，我这里用的数状数组。

* 考虑**每个点和他左侧点的关系**，初始化 $a_0 = a_{n + 1} = 0$, 对于每个 $i \in [1, n] $ , 若 $a_i > a_{i - 1}$，此时会在 $h \in [a_{i - 1} + 1, a_i]$ 时额外产生一座岛，所以把区间内的答案 +1。
    

* 需要维护的操作：区间修改，单点查询（可以通过差分数组转化成单点修改，前缀和查询）。
    

```cpp
#include <iostream>

using namespace std;

const int N = 500010;
int tr[N], a[N];

void add(int u, int v) {
    for (; u <= 500000; u += u & -u) {
        tr[u] += v;
    }
}

int query(int u) {
    int res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

int main() {
    int n, q, last = 0;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        if (a[i] > a[i - 1]) add(a[i - 1] + 1, 1), add(a[i] + 1, -1);
    }
    while (q--) {
        char op[2];
        scanf("%s", op);
        if (op[0] == 'Q') {
            int c;
            scanf("%d", &c);
            c ^= last;
            printf("%d\n", last = query(c));
        }
        else {
            int p, v;
            scanf("%d%d", &p, &v);
            p ^= last, v ^= last;
            if (a[p] > a[p - 1]) add(a[p - 1] + 1, -1), add(a[p] + 1, 1);
            if (a[p + 1] > a[p]) add(a[p] + 1, -1), add(a[p + 1] + 1, 1);
            a[p] = v;
            if (a[p] > a[p - 1]) add(a[p - 1] + 1, 1), add(a[p] + 1, -1);
            if (a[p + 1] > a[p]) add(a[p] + 1, 1), add(a[p + 1] + 1, -1);
        }
    }
    return 0;
}
```