---
title: 2025春训第四场
---
# 2025春训第四场

因为后面有一场校赛，这场训练赛没什么印象了。

## A. 美丽数

* 先考虑合法情况，从高位到低位从小到大试填。该位填 i 合法当且仅当 i 和上一位不相等且用掉一次 i 之后剩下的状态是合法状态（即个数最大的数的个数不大于 $\lceil \frac{\text{总数}}{2} \rceil$）
    
* 如果填到某一位时，任何 i 都不合法，那么整体就不合法，输出 -1.
    

```cpp
#include <iostream>
#include <vector>

using namespace std;

int cnt[10];

int main() {
    int T;
    cin >> T;
    while (T--) {
        vector<int> res;
        int s = 0;
        for (int i = 0; i < 10; ++i) {
            cin >> cnt[i];
            s += cnt[i];
        }
        int pre = 0;
        while (s) {
            bool flag = false;
            for (int i = 0; i < 10; ++i) {
                if (i != pre && cnt[i]) {
                    int mx = 0;
                    for (int j = 0; j < 10; ++j) {
                        if (i == j) continue;
                        mx = max(mx, cnt[j]);
                    }
                    if (s - 1 - 2 * mx >= -1 && s - 1 - 2 * (cnt[i] - 1) >= 0) {
                        flag = true;
                        res.push_back(i);
                        s--;
                        cnt[i]--;
                        pre = i;
                        break;
                    }
                }
            }
            if (!flag) break;
        }
        if (s) cout << -1;
        for (int i : res) cout << i;
        cout << endl;
    }
    return 0;
}
```

## B. **军训**

大水题，如果相邻两个位置的数相差不为 1，就需要切割一次。

```cpp
#include <iostream>

using namespace std;

int a[1000010];

int main() {
    int n, t = 0;
    scanf("%d", &n);
    a[0] = -1;
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        if (a[i] != a[i - 1] + 1 && a[i] != a[i - 1] - 1) t++;
    }
    printf("%d\n", t - 1);
    return 0;
}
```

## D. **发工资**

经典的贪心问题，把区间按照右端点排序，对于每一个区间，查找区间内最靠左的金砖给他，找不到就跳过。

```cpp
#include <iostream>
#include <algorithm>
#include <map>

using namespace std;

pair<int, int> a[1000010];
map<int, int> s;

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i].first, &a[i].second);
    }
    for (int i = 1; i <= m; ++i) {
        int c;
        scanf("%d", &c);
        s[c]++;
    }
    sort(a + 1, a + n + 1, [](pair<int, int> a, pair<int, int> b) {
        return a.second < b.second;
    });
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        auto it = s.lower_bound(a[i].first);
        if (it != s.end() && it->first <= a[i].second) {
            it->second--;
            if (it->second == 0) s.erase(it);
            res++;
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## **E. 筹备计划**

最优解应该是开两个权值线段树，分别维护中位数和合法位置。对于每次查询，查询第一个线段树找到中位数，然后在第二个线段树中查左侧第一个和右侧第一个合法位置，比较两个位置的结果即可；比较时还需要再开一个线段树维护前缀和和后缀和。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;

struct SegmentTree
{
    long long tr[N * 4];
    int tag[N * 4];

    SegmentTree() {
        memset(tag, -1, sizeof(tag));
    }

    void pushup(int u) {
        tr[u] = tr[u << 1] + tr[u << 1 | 1];
    }

    void pushdown(int u, int l, int r) {
        if (~tag[u]) {
            int mid = l + r >> 1;
            tag[u << 1] = tag[u << 1 | 1] = tag[u];
            if (tag[u]) tr[u << 1] = mid - l + 1, tr[u << 1 | 1] = r - mid;
            else tr[u << 1] = tr[u << 1 | 1] = 0;
            tag[u] = -1;
        }
    }

    void modify(int u, int l, int r, int p, long long v) {
        if (l == r) tr[u] += v;
        else {
            pushdown(u, l, r);
            int mid = l + r >> 1;
            if (p <= mid) modify(u << 1, l, mid, p, v);
            else modify(u << 1 | 1, mid + 1, r, p, v);
            pushup(u);
        }
    }

    void modify(int u, int l, int r, int ql, int qr, int v) {
        if (ql <= l && r <= qr) {
            if (v) tr[u] = r - l + 1;
            else tr[u] = 0;
            tag[u] = v;
        }
        else {
            pushdown(u, l, r);
            int mid = l + r >> 1;
            if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
            if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
            pushup(u);
        }
    }

    long long query(int u, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tr[u];
        else {
            pushdown(u, l, r);
            long long res = 0;
            int mid = l + r >> 1;
            if (ql <= mid) res = query(u << 1, l, mid, ql, qr);
            if (qr > mid) res += query(u << 1 | 1, mid + 1, r, ql, qr);
            return res;
        }
    }

    int kth_element(int u, int l, int r, long long k) {
        if (l == r) return l;
        else {
            pushdown(u, l, r);
            int mid = l + r >> 1;
            if (tr[u << 1] >= k) return kth_element(u << 1, l, mid, k);
            else return kth_element(u << 1 | 1, mid + 1, r, k - tr[u << 1]);
        }
    }
} cnt, pos, sum;
int n, q;

long long calc(int p) {
    long long res = 0;
    if (p > 1) res = (long long)p * cnt.query(1, 1, n, 1, p - 1) - sum.query(1, 1, n, 1, p - 1);
    if (p < n) res += (long long)(-p) * cnt.query(1, 1, n, p + 1, n) + sum.query(1, 1, n, p + 1, n);
    return res;
}

int main() {
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        cnt.modify(1, 1, n, i, t);
        sum.modify(1, 1, n, i, (long long)t * i);
    }
    pos.modify(1, 1, n, 1, n, 1);
    while (q--) {
        int t, a, b;
        scanf("%d%d%d", &t, &a, &b);
        if (t == 1) {
            cnt.modify(1, 1, n, a, b);
            sum.modify(1, 1, n, a, (long long)a * b);
        }
        else if (t == 2) {
            cnt.modify(1, 1, n, a, -b);
            sum.modify(1, 1, n, a, -(long long)a * b);
        }
        else if (t == 3) {
            pos.modify(1, 1, n, a, b, 1);
        }
        else {
            pos.modify(1, 1, n, a, b, 0);
        }
        int p = cnt.kth_element(1, 1, n, cnt.query(1, 1, n, 1, n) + 1 >> 1);
        int pre_cnt = pos.query(1, 1, n, 1, p), l = -1, r = -1;
        if (pre_cnt) l = pos.kth_element(1, 1, n, pre_cnt);
        if (pre_cnt < pos.query(1, 1, n, 1, n)) r = pos.kth_element(1, 1, n, pre_cnt + 1);
        if (~l && ~r) {
            if (calc(l) <= calc(r)) printf("%lld\n", l);
            else printf("%lld\n", r);
        }
        else if (~l) printf("%lld\n", l);
        else if (~r) printf("%lld\n", r);
        else printf("-1\n");
    }
    return 0;
}
```

我当时用的更暴力的两个 log 的做法卡过去了——线段树只打标记，用二分查找找到合法位置，浪费了线段树本身的分治结构。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;
long long tr[N], sum[N];
int s[N * 4], lazy[N * 4];
int n, q;

inline void pushup(int u) {
    s[u] = s[u << 1] + s[u << 1 | 1];
}

inline void pushdown(int u, int l, int r) {
    if (~lazy[u]) {
        int mid = l + r >> 1;
        s[u << 1] = lazy[u] * (mid - l + 1), s[u << 1 | 1] = lazy[u] * (r - mid);
        lazy[u << 1] = lazy[u << 1 | 1] = lazy[u];
        lazy[u] = -1;
    }
}

inline void modify(int u, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) {
        s[u] = (r - l + 1) * v;
        lazy[u] = v;
    }
    else {
        pushdown(u, l, r);
        int mid = l + r >> 1;
        if (ql <= mid) modify(u << 1, l, mid, ql, qr, v);
        if (qr > mid) modify(u << 1 | 1, mid + 1, r, ql, qr, v);
        pushup(u);
    }
}

inline int smt_query(int u, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return s[u];
    else {
        pushdown(u, l, r);
        int mid = l + r >> 1, res = 0;
        if (ql <= mid) res = smt_query(u << 1, l, mid, ql, qr);
        if (qr > mid) res += smt_query(u << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }
}

inline void add(int u, int k) {
    int tmp = u;
    for (; u <= n; u += u & -u) {
        tr[u] += k;
        sum[u] += (long long)tmp * k;
    }
}

inline long long query(int u) {
    long long res = 0;
    for (; u; u -= u & -u) {
        res += tr[u];
    }
    return res;
}

inline long long qs(int u) {
    long long res = 0;
    for (; u; u -= u & -u) {
        res += sum[u];
    }
    return res;
}

inline long long f(int p) {
    return (long long)p * query(p) * 2 - qs(p) * 2 + qs(n) - (long long)query(n) * p;
}

void smt_print() {
    for (int i = 1; i <= n; ++i) {
        printf("%d ", smt_query(1, 1, n, i, i));
    }
    printf("\n");
}

void print() {
    for (int i = 1; i <= n; ++i) {
        printf("%d ", query(i) - query(i - 1));
    }
    printf("\n");
    for (int i = 1; i <= n; ++i) {
        printf("%d ", qs(i) - qs(i - 1));
    }
    printf("\n");
}

int main() {
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        add(i, t);
    }
    memset(lazy, -1, sizeof(lazy));
    while (q--) {
        int t, a, b;
        scanf("%d%d%d", &t, &a, &b);
        if (t == 1) {
            add(a, b);
        }
        else if (t == 2) {
            add(a, -b);
        }
        else if (t == 3) {
            modify(1, 1, n, a, b, 0);
        }
        else {
            modify(1, 1, n, a, b, 1);
        }
        int l = 1, r = n;
        long long s = query(n);
        while (l < r) {
            int mid = l + r >> 1;
            if (query(mid) * 2 >= s) r = mid;
            else l = mid + 1;
        }
        if (smt_query(1, 1, n, l, l) == 0) printf("%d\n", l);
        else {
            int L, R;
            int p = l;
            l = 0, r = p;
            while (l < r) {
                int mid = l + r + 1 >> 1;
                if (smt_query(1, 1, n, mid, p) < p - mid + 1) l = mid;
                else r = mid - 1;
            }
            L = l;
            l = p, r = n + 1;
            while (l < r) {
                int mid = l + r >> 1;
                if (smt_query(1, 1, n, p, mid) < mid - p + 1) r = mid;
                else l = mid + 1;
            }
            R = l;
            if (L == 0 && R == n + 1) printf("-1\n");
            else if (L == 0) printf("%d\n", R);
            else if (R == n + 1) printf("%d\n", L);
            else if (f(L) <= f(R)) printf("%d\n", L);
            else printf("%d\n", R);
        }
    }
    return 0;
}
```