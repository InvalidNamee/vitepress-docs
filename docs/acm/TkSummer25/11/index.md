---
title: 2025夏季个人训练赛第十一场
---
# 2025夏季个人训练赛第十一场

越做越麻……

## A. 战斗爽

重要的性质，对同一个敌人的攻击一定是连续的，如果一个敌人已经是剩余血量最低，攻击最低，编号最小，那么他被攻击后血量更低，所以他还是最低的。

排序之后挨个打就可以了。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 10010;

struct Node {
    int hp, atk, id;

    bool operator <(const Node &_) const {
        if (hp != _.hp) return hp < _.hp;
        else if (atk != _.atk) return atk < _.atk;
        else return id < _.id;
    }
} a[N];
int mx[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, u, k;
        long long hp;
        scanf("%d%d%d%lld", &n, &u, &k, &hp);
        for (int i = 1; i <= n; ++i) {
            scanf("%d%d", &a[i].atk, &a[i].hp);
            a[i].id = i;
        }
        sort(a + 1, a + n + 1);
        mx[n + 1] = 0;
        for (int i = n; i; --i) {
            mx[i] = max(mx[i + 1], a[i].atk);
        }
        int res = 0, liv_max = 0;
        for (int i = 1; i <= n; ++i) {
            int t = (a[i].hp >= u ? 1 + (a[i].hp - u + u / 2 - 1) / (u / 2): 1);
            if (t <= k) {
                hp -= (long long)(t - 1) * max(liv_max, mx[i]);
                if (hp > 0) res++;
                hp -= max(liv_max, mx[i + 1]);
            }
            else {
                hp -= (long long)k * max(liv_max, mx[i]);
                liv_max = max(liv_max, mx[i + 1]);
            }
            if (hp <= 0) break;
        }
        printf("%d\n", res);
    }
    return 0;
}
```

## E. 持家

先打折再减免一定比先减免再打折更优，枚举用几个打折用几个减免，先打折后减免即可。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        vector<double> a;
        vector<long long> b;
        int P, n, k;
        scanf("%d%d%d", &P, &n, &k);
        a.push_back(1.0), b.push_back(0);
        for (int i = 1; i <= n; ++i) {
            int t, p;
            scanf("%d%d", &t, &p);
            if (!t) a.push_back((double)p / 10);
            else b.push_back((long long)p);
        }
        sort(a.begin() + 1, a.end());
        sort(b.begin() + 1, b.end(), greater<long long>());
        for (int i = 1; i < a.size(); ++i) a[i] *= a[i - 1];
        for (int i = 1; i < b.size(); ++i) b[i] += b[i - 1];
        double res = P;
        for (int i = max(0, k + 1 - (int)b.size()); i <= min(k, (int)a.size() - 1); ++i) {
            res = min(res, (double)P * a[i] - b[k - i]);
        }
        printf("%.2f\n", max(0.0, res));
    }
    return 0;
}
```

## F. 进步

树状数组的板子题。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;
long long tr[N];
int a[N];
int n, m;

void add(int u, long long val) {
    for (; u <= n; u += u & -u) {
        tr[u] += val;
    }
}

long long query(int u) {
    long long res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long res = 0;
        scanf("%d%d", &n, &m);
        memset(tr, 0, sizeof(long long) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
            add(i, a[i]);
        }
        int idx = 0;
        for (int i = 1; i <= m; ++i) {
            int op, x, y;
            scanf("%d%d%d", &op, &x, &y);
            if (op == 1) {
                add(x, y - a[x]);
                a[x] = y;
            }
            else {
                long long t = query(y) / 100 - query(x - 1) / 100;
                res ^= t * (++idx);
            }
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## H. 制衡

比较简单的二维 dp，状态 $f_{i, j}$ 表示第 i 个数在第 j 组的最大开心值

$$
f_{i, j} = a_{i, j} + \max_{k = 1}^j f_{i - 1, k}
$$

第一维可以直接压掉，防止爆空间。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 1000010;
long long f[N], mx[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, k;
        scanf("%d%d", &n, &k);
        memset(f, 0, sizeof(long long) * (k + 1));
        memset(mx, 0, sizeof(long long) * (k + 1));
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= k; ++j) {
                int t;
                scanf("%d", &t);
                f[j] = mx[j] + t;
                mx[j] = max(max(mx[j], mx[j - 1]), f[j]);
            }
        }
        printf("%lld\n", mx[k]);
    }
    return 0;
}
```