---
title: 2025春训第六场
---
# 2025春训第六场

感觉这次做的还行，主要还是简单题多了一点。数学题赛后被 GPT 秒了，而我追着 GPT 问了半天……

## **A. 魔法石**

签到题，但是有点绕（我就被坑了）。有解的条件是三个数都相等或者两个数相等，另一个比这两个小；前者直接输出三个相等的，后者输出一个较大的和两个较小的即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int main() {
    long long a[3];
    scanf("%lld%lld%lld", &a[0], &a[1], &a[2]);
    sort(a, a + 3);
    if (a[0] != a[1] && a[1] != a[2]) printf("NO\n");
    else if (a[1] < a[2]) printf("NO\n");
    else printf("YES\n%lld %lld %lld\n", a[1], a[0], a[0]);
    return 0;
}
```

## B. **回文立方数**

直接枚举 $i \in [1, \lfloor \sqrt[3]{N} \rfloor]$，验证 i³ 是否回文，找最大的即可。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

bool check(long long t) {
    string s = to_string(t);
    for (int i = 0; i < s.length(); ++i) {
        if (s[i] != s[s.length() - i - 1]) return false;
    }
    return true;
}

int main() {
    long long n, t = 0;
    cin >> n;
    for (int i = 1; (long long)i * i * i <= n; ++i) {
        if (check((long long)i * i * i)) {
            t = (long long)i * i * i;
        }
    }
    printf("%lld\n", t);
    return 0;
}
```

## C. gcd

还没问明白 GPT，但是强迫症趋势我必须在第七场前发第六场，所以先🐦一下。

这是事后不知道什么原理过了的代码，似乎要求 a 是 b - a 的倍数而且和 b - a 二进制位不重叠。

```cpp
#include <iostream>

using namespace std;
 
int main(){
    int n;
    cin >> n;
    long long ans = 0;
    for (int d = 1; d <= n; d++){
        for (int a = d; a + d <= n; a += d) {
            if ((a ^ (a + d)) == d) {
                ans++;
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

## E. **摘Galo**

类似树形背包问题，树形dp回溯的时候用孩子的 f 数组更新父亲的 f 数组，最后父亲的 $f_1 = min\{f_1, w\}$，注意优化常数，容易被卡成 TLE。

```cpp
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

const int N = 100010;

int head[N], ne[N], ver[N], tot;
int w[N];
vector<long long> f[N];
int cnt[N];
int n, k;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

void dp(int x) {
    cnt[x] = 1;
    long long s = 0;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        dp(y);
        cnt[x] += cnt[y];
        for (int j = min(k + 1, cnt[x]); j; --j) {
            for (int l = min(cnt[y], j); l >= 0; --l) {
                f[x][j] = max(f[x][j], f[x][j - l] + f[y][l]);
            }
        }
    }
    f[x][1] = max(f[x][1], (long long)w[x]);
}

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 2; i <= n; ++i) {
        int f;
        scanf("%d%d", &f, &w[i]);
        add(f, i);
    }
    for (int i = 1; i <= n; ++i) {
        f[i] = vector<long long>(k + 2, 0);
    }
    dp(1);
    long long res = 0;
    for (int i = 0; i <= k + 1; ++i) {
        res = max(res, f[1][i]);
    }
    printf("%lld\n", res);
    return 0;
}
```

## F. 队列安排

排序，从小到大排就行。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

long long a[100010];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
    }
    sort(a + 1, a + n + 1);
    long long s = 0;
    for (int i = 1; i < n; ++i) {
        a[i] += a[i - 1];
        s += a[i];
    }
    printf("%lld\n", s);
    return 0;
}
```