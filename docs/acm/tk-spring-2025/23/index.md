---
title: 2025春训第二十三场
---
# 2025春训第二十三场

昨天栽在二分了，今天写了四个二分一个也没挂，爽😋

## A. 互质划分

事实上，只需要 n / 2 即可，如果所有 2 的倍数都能分开了，那其他的更能分开。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    long long n;
    cin >> n;
    cout << max(1LL, n >> 1) << endl;
    return 0;
}
```

## **B. 出租车**

对于每一个居民二分最短距离，在根据最短距离二分出来左右边界的位置，然后检查边界是否合法，最后更新答案； $\Theta(n\log^2 n)$完全够了。

```cpp
#include <iostream>

using namespace std;

const int N = 200010;

int p[N], id[N], s[N], res[N];
int n, m;

int findl(long long val) {
    int l = 1, r = n + m;
    while (l < r) {
        int mid = (l + r) >> 1;
        if (p[mid] >= val) r = mid;
        else l = mid + 1;
    }
    return l;
}

int findr(int val) {
    int l = 1, r = n + m;
    while (l < r) {
        int mid = (l + r + 1) >> 1;
        if (p[mid] <= val) l = mid;
        else r = mid - 1;
    }
    return l;
}


int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n + m; ++i) {
        scanf("%d", &p[i]);
    }
    for (int i = 1; i <= n + m; ++i) {
        scanf("%d", &id[i]);
        s[i] = s[i - 1] + id[i];
    }
    for (int i = 1; i <= n + m; ++i) {
        if (!id[i]) {
            int l = 0, r = 1000000000;
            while (l < r) {
                int mid = (l + r) >> 1;
                if (s[findr((long long)p[i] + mid)] - s[findl((long long)p[i] - mid) - 1]) r = mid;
                else l = mid + 1;
            }
            int L = findl((long long)p[i] - l), R = findr((long long)p[i] + l);
            // cout << L << ' ' << R << endl;
            if (id[L] && id[R])
                if (p[i] - p[L] <= p[R] - p[i]) res[L]++;
                else res[R]++;
            else if (id[L]) res[L]++;
            else if (id[R]) res[R]++;
            else return 213;
        }
    }
    for (int i = 1; i <= n + m; ++i) {
        if (id[i]) printf("%d ", res[i]);
    }
    printf("\n");
    return 0;
}
```

## **C. 木雕玩具**

继续二分，**二分答案**，然后验证需要的人数是否 ≥ 3 即可。以普遍理性而论，应该可以线性 dp 解决，但是这不影响我一直写挂……

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 200010;

int a[N], n;

bool check(int mid) {
    int t = 0, cur = -0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        if (a[i] - cur > mid) {
            t++;
            cur = a[i] + mid;
        }
    }
    return t <= 3;
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    sort(a + 1, a + n + 1);
    int l = 0, r = 1000000000;
    while (l < r) {
        int mid = (l + r) >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    printf("%d\n", l);
    return 0;
}
```

## **E. 足球联赛**

It is a 签到题。

```cpp
#include <iostream>

using namespace std;

int res[30];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        if (c > d) res[a] += 3;
        else if (c == d) res[a]++, res[b]++;
        else res[b] += 3;
    }
    for (int i = 1; i <= n; ++i) {
        cout << res[i] << ' ';
    }
    cout << endl;
    return 0;
}
```

## **F. 果汁**

用贪心的思想，**尽可能的往右边倒**，给后面更多的可能；同时这么做不影响前面的收益，因为想喝到必须全倒满，如果可以喝到的话先倒前面的和先倒后面的收益一样。

```cpp
#include <iostream>
#include <map>

using namespace std;

const int N = 30010;

int v[N];

void solve() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        scanf("%d", &v[i]);
    }
    v[m + 1] = 0x3f3f3f3f;
    map<int, int> mp;
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        mp[t]++;
    }
    int res = 0;
    for (auto [i, t] : mp) {
        if (v[i + 1] >= t) v[i + 1] -= t;
        else {
            t -= v[i + 1], v[i + 1] = 0;
            res += max(0, t - v[i]);
        }
    }
    printf("%d\n", res);
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        solve();
    }
    return 0;
}
```