---
title: 2025牛客暑期多校训练营1
---
# 2025牛客暑期多校训练营1

同样也是 vp 的，大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 4 |
| 赛后补 | 2 |

重现赛排名 166，这套比较难，简单的做完之后到后面集体罚坐了😴。

不得不说，出题人非常喜欢卡常，后来补的两道题都和卡常沾点边。

## E. Endless Ladders

又是我贡献了全场唯一的罚时，左边界第一个数被卡了，如果 d < 4 左边那一项就成负数了。

```cpp
#include <iostream>
 
using namespace std;
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long l, r;
        scanf("%lld%lld", &l, &r);
        long long d = abs(r * r - l * l);
        printf("%lld\n", max(0LL, d / 4 - 1) + (d + 1) / 2 - 1);
 
    }
    return 0;
}
```

## G. Symmetry Intervals <span style="color: blue"><sup>队友</sup></span>

全场第二水的题。

## H. Symmetry Intervals 2 <span style="color: red"><sup>补</sup></span>

上一道题的升级版，传说比赛的时候常数小的暴力能卡过去，后来改了时间限制，我想到了预处理每个分段，但是没想到对齐的方法，题解看完之后就明白了，把两半的二进制状态用位运算分别拆出来再拼接就可以实现。

```cpp
#include <iostream>

using namespace std;

const int N = 100000;
const int b = 16;
unsigned short s[N];
bool t[N];
tuple<int, int, int> f[1 << b]; // lz, rz, ms

void println(unsigned short x) {
    for (int i = 0; i < b; ++i) cout << (x >> i & 1);
    cout << endl;
}

unsigned short get(int p, int l) {
    int id = p / b, pos = p % b;
    if (l <= b - pos) return s[id] >> pos;
    else {
        // println((((1 << (l - (b - pos))) - 1) & s[id + 1]) << (b - pos));
        return (s[id] >> pos) | (((1 << (l - (b - pos))) - 1) & s[id + 1]) << (b - pos);
    }
} 

int main() {
    for (int mask = 0; mask < (1 << b); ++mask) {
        int lz = 0, rz = 0, ms = 0;
        int i, j;
        for (i = 0; i < b; ++i) {
            if (mask >> i & 1) break;
            else lz++;
        }
        for (j = 15; j >= 0; --j) {
            if (mask >> j & 1) break;
            else rz++;
        }
        if (lz == b) f[mask] = {b, 0, 0};
        else {
            int cur = 0;
            for (; i <= j; ++i) {
                if (mask >> i & 1) {
                    ms += (cur + 1) * cur / 2;
                    cur = 0;
                }
                else cur++;
            }
            f[mask] = {lz, rz, ms};
        }
    }
    int n, m, q;
    scanf("%d%d", &n, &q);
    m = (n + b - 1) / b;
    for (int i = 0; i < n; ++i) {
        int c;
        scanf("%1d", &c);
        s[i / b] |= c << (i % b);
    }
    while (q--) {
        int op;
        scanf("%d", &op);
        if (op == 1) {
            int l, r;
            scanf("%d%d", &l, &r);
            l--, r--;
            t[l / b] ^= 1, t[r / b] ^= 1;
            s[l / b] ^= (1 << (l % b)) - 1;
            s[r / b] ^= (1 << (r % b + 1)) - 1;
        }
        else {
            int l, x, y;
            scanf("%d%d%d", &l, &x, &y);
            x--, y--;
            bool flp = false;
            for (int i = 0; i < m; ++i) {
                flp ^= t[i];
                t[i] = false;
                if (flp) s[i] = ~s[i];
                // for (int j = 0; j < min(b, n - b * i); ++j) cout << (s[i] >> j & 1);
            }
            // cout << endl;
            long long res = 0, cur = 0;
            int lim = l / b * b;
            for (int i = 0; i < lim; i += b) {
                unsigned short b1 = get(x + i, b), b2 = get(y + i, b);
                // println(b1 ^ b2);
                auto [lz, rz, ms] = f[b1 ^ b2];
                if (lz == b) cur += b;
                else {
                    // cout << lz << ' ' << ms << ' ' << rz << endl;
                    cur += lz;
                    res += cur * (cur + 1) / 2 + ms;
                    cur = rz;
                }
            }
            if (l % b != 0) {
                unsigned short b1 = get(x + lim, l - lim), b2 = get(y + lim, l - lim);
                for (int i = 0; i < l - lim; ++i) {
                    if ((b1 >> i & 1) ^ (b2 >> i & 1)) {
                        res += cur * (cur + 1) / 2;
                        cur = 0;
                    }
                    else cur++;
                }
            }
            if (cur) res += cur * (cur + 1) / 2;
            printf("%lld\n", res);
        }
    }
    return 0;
}
```

## I. Iron Bars Cutting <span style="color: red"><sup>补</sup></span>

这道也很重量级，主要也是卡常，还卡空间，$\Theta (n^4)$ 比较好想，在 dp 的数组里排序再二分属实就有点不好想了，另外

```
>>> 420 ** 3 * 8 / 1024 ** 2
565.24658203125
```
按说开一个 420<sup>3</sup> 的 long long 数组就该爆空间了，实际上开了两份也没爆，可能是没利用的空间被优化了吧……

提交记录里面给的内存占用只有 503932 KB.

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
using namespace std;

typedef long long LL;
const int N = 421;
pair<LL, LL> f[N][N][N];
LL mn[N][N][N];
LL s[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%lld", &s[i]);
            s[i] += s[i - 1];
        }
        for (int len = 2; len <= n; ++len) {
            for (int i = 1; i <= n - len + 1; ++i) {
                int j = i + len - 1, t = (int)ceil(log2(s[j] - s[i - 1]));
                for (int k = i; k < j; ++k) {
                    LL b = abs((s[k] - s[i - 1]) - (s[j] - s[k]));
                    LL v1, v2;
                    int l = i - 1, r = k - 1;
                    if (l == r) v1 = 0;
                    else {
                        // cout << b << endl;
                        while (l < r) {
                            int mid = l + r + 1 >> 1;
                            if (f[i][k][mid].first <= b) l = mid;
                            else r = mid - 1;
                        }
                        if (l == i - 1) {
                            f[i][j][k] = {5000000000000, 5000000000000};
                            continue;
                        }
                        v1 = f[i][k][l].second;
                    }
                    l = k, r = j - 1;
                    if (l == r) {
                        v2 = 0;
                    }
                    else {
                        while (l < r) {
                            int mid = l + r + 1 >> 1;
                            if (f[k + 1][j][mid].first <= b) l = mid;
                            else r = mid - 1;
                        }
                        if (l == k) {
                            f[i][j][k] = {5000000000000, 5000000000000};
                            continue;
                        }
                        v2 = f[k + 1][j][l].second;
                    }

                    f[i][j][k] = {b, v1 + v2 + min(s[k] - s[i - 1], s[j] - s[k]) * t};
                }
                if (len != n) {
                    sort(f[i][j] + i, f[i][j] + j);
                    for (int k = i + 1; k < j; ++k) {
                        f[i][j][k].second = min(f[i][j][k].second, f[i][j][k - 1].second);
                    }
                }
            }
        }
        for (int i = 1; i < n; ++i) {
            printf("%lld ", f[1][n][i].second == 5000000000000 ? -1 : f[1][n][i].second);
        }
        printf("\n");
    }
    return 0;
}
```

## K. Museum Acceptance <span style="color: blue"><sup>队友</sup></span>

按照他的条件，把边看成点只能是很多个环，稍微恶心一点的点在编号和去重

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <stack>
#include <algorithm>

using namespace std;

const int N = 200010;
unordered_map<long long, int> mp;
int ne[N * 3], res[N * 3];
bool vis[N * 3];
int h[N];

int main() {
    int n, m = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int q;
        scanf("%d", &q);
        vector<int> t(q);
        for (int j = 0; j < q; ++j) {
            scanf("%d", &t[j]);
            if (i < t[j]) {
                mp[(long long)i * N + t[j]] = m++;
                mp[(long long)t[j] * N + i] = m++;
            }
        }
        t.emplace_back(t[0]);
        for (int j = 0; j < q; ++j) {
            ne[mp[(long long)t[j] * N + i]] = (mp[(long long)i * N + t[j + 1]]);
        }
        h[i] = mp[(long long)i * N + t[0]];
    }
    for (int i = 1; i <= m; ++i) {
        if (!vis[i]) {
            int x = i;
            vector<int> cir;
            while (!vis[x]) {
                vis[x] = true;
                cir.emplace_back(x);
                x = ne[x];
            }
            sort(cir.begin(), cir.end());
            int t = 0;
            for (int j = 0; j < cir.size(); ++j) {
                if (j == cir.size() - 1 || (cir[j] ^ cir[j + 1]) != 1) t++;
            }
            for (int j : cir) {
                res[j] = t;
            }
        }
    }
    for (int i = 1; i <= n; ++i) {
        printf("%d\n", res[h[i]]);
    }
    return 0;
}
```

## L. Numb Numbers <span style="color: blue"><sup>队友</sup></span>

离散化 + 权值线段树可以直接莽过去，~~然后我就又在补题的时候被边界卡了~~

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <cstring>

using namespace std;
typedef long long LL;
const int N = 200010;
LL a[N], b[N];
int tr[N * 8];
vector<pair<int, int>> qu;
vector<LL> values;
int m;

void clear_tree(int u, int l, int r) {
    tr[u] = 0;
    if (l == r) return;
    else {
        int mid = l + r >> 1;
        clear_tree(u << 1, l, mid), clear_tree(u << 1 | 1, mid + 1, r);
    }
}

void pushup(int u) {
    tr[u] = tr[u << 1] + tr[u << 1 | 1];
}

void modify(int u, int l, int r, int p, int v) {
    if (l == r) tr[u] += v;
    else {
        int mid = l + r >> 1;
        if (p <= mid) modify(u << 1, l, mid, p, v);
        else modify(u << 1 | 1, mid + 1, r, p, v);
        pushup(u);
    }
}

int query_kth(int u, int l, int r, int k) {
    if (l == r) return l;
    else {
        int mid = l + r >> 1;
        if (tr[u << 1] >= k) return query_kth(u << 1, l, mid, k);
        else return query_kth(u << 1 | 1, mid + 1, r, k - tr[u << 1]);
    }
}

int query_cnt(int u, int l, int r, int ql, int qr) {
    if (ql > qr) return 0;
    if (ql <= l && r <= qr) return tr[u];
    else {
        int mid = l + r >> 1;
        int res = 0;
        if (ql <= mid) res = query_cnt(u << 1, l, mid, ql, qr);
        if (qr > mid) res += query_cnt(u << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }
}

void print(int u, int l, int r) {
    if (l == r) cout << tr[u] << ' ';
    else {
        int mid = l + r >> 1;
        print(u << 1, l, mid), print(u << 1 | 1, mid + 1, r);
    }
}

int get_idx(LL val) {
    return lower_bound(values.begin(), values.begin() + m, val) - values.begin() + 1;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, q;
        scanf("%d%d", &n, &q);
        qu.resize(q);
        values.clear();
        for (int i = 1; i <= n; ++i) {
            scanf("%lld", &a[i]);
            b[i] = a[i]; // 备份一份
            values.emplace_back(a[i]);
        }
        for (int i = 0; i < q; ++i) {
            scanf("%d%d", &qu[i].first, &qu[i].second);
            a[qu[i].first] += qu[i].second;
            values.emplace_back(a[qu[i].first]);
        }
        sort(values.begin(), values.end());
        m = unique(values.begin(), values.end()) - values.begin();
        // memset(tr, 0, sizeof(int) * m * 4 + 1);
        clear_tree(1, 1, m);
        for (int i = 1; i <= n; ++i) {
            modify(1, 1, m, get_idx(b[i]), 1);
        }
        // print(1, 1, m);
        // cout << endl;
        int mid = (n + 1) >> 1;
        for (auto [i, k] : qu) {
            modify(1, 1, m, get_idx(b[i]), -1);
            b[i] += k;
            modify(1, 1, m, get_idx(b[i]), 1);
            int t = query_kth(1, 1, m, mid);
            int res = query_cnt(1, 1, m, 1, t);
            if (res > mid) res = query_cnt(1, 1, m, 1, t - 1);
            // print(1, 1, m);
            // cout << endl;
            printf("%d\n", res);
            // cout << endl;
        }
        // for (auto i : values) printf("%d ", i);
        // printf("\n");
        // cout << endl;
    }
    return 0;
}
```