---
title: 2025组队训练赛第 20 场
---
# 2025组队训练赛第 20 场

## F. Heron and His Triangle

用海伦公式推出来的结论打出来前几个的表，发现是 4, 14, 52, 194, 724, 2702，非常眼熟，递推式是 $a_i = 4a_{i - 1} - a_{i - 2}$，打表发现只有前 53 项有效，直接开 int128 打表即可。

```cpp
#include <iostream>
 
using namespace std;
 
__int128_t a[100];
 
void print(__int128_t x) {
    if (x) {
        print(x / 10);
        printf("%d", int(x % 10));
    }
}
 
__int128_t read() {
    __int128_t res = 0;
    char c = getchar();
    while (!isdigit(c)) c = getchar();
    while (isdigit(c)) res = res * 10 + c - 48, c = getchar();
    return res;
}
 
int main() {
    __int128_t t = 1;
    for (int i = 1; i <= 30; ++i) t *= 10;
    a[0] = 2, a[1] = 4;
    for (int i = 2; i <= 53; ++i) {
        a[i] = a[i - 1] * 4 - a[i - 2];
    }
    int T = read();
    while (T--) {
        __int128_t n = read();
        for (int i = 1; i <= 53; ++i) {
            if (a[i] >= n) {
                print(a[i]);
                putchar('\n');
                break;
            }
        }
    }
    return 0;
}
```

## G. Infnite Fraction Path <sup>补</sup>

基环树森林比较多个串的前缀的字典序，可以**倍增 + 字符串**哈希解决。当时我们三个人对着两个 log 的倍增 + 二分优化常数，快绝望的时候才茅塞顿开，倍增已经处理好了，为啥还二分😅。

## L. Little Boxes

a + b + c + d，当心爆 long long。

```python
n = int(input())
for _ in range(n):
    print(sum(map(int, input().split())))
```

## K. Rabbits

最左侧和最右侧的一个空隙一定是会浪费掉的，选一个小的浪费，剩下的空位数就是答案。

```cpp
#include <iostream>
#include <algorithm>
#include <queue>
 
using namespace std;
 
const int N = 10010;
 
int a[N];
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        sort(a + 1, a + n + 1);
        printf("%d\n", a[n] - a[1] + 1 - n - min(a[2] - a[1] - 1, a[n] - a[n - 1] - 1));
    }
    return 0;
}
```

## L. Tree II

当一条边两边的点数都至少为 k 时，这条边一定可以在所有颜色的交集里面。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
const int N = 200010;
 
int ver[N * 2], ne[N * 2], head[N], tot;
int cnt[N];
int n, k, res;
 
void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}
 
void dfs(int x, int fa) {
    cnt[x] = 1;
    // f[x] = 0;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dfs(y, x);
        if (cnt[y] >= k && n - cnt[y] >= k) res++;
        cnt[x] += cnt[y];
    }
}

void solve() {
    scanf("%d%d", &n, &k);
    tot = 0, res = 0;
    memset(head, 0, sizeof(int) * (n + 1));
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }
    dfs(1, 0);
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