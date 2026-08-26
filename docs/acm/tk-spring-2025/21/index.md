---
title: 2025春训第二十一场
---
# 2025春训第二十一场

## A. **傻鹿尖塔**

每次临死前贪心选择前面能选的最大的即可，但是需要注意**不要直接中途 break，会影响之后的读入** 😭😭😭

```cpp
#include <iostream>
#include <queue>

using namespace std;

int n, m, k;
int a[100010];
priority_queue<int> q;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        while (!q.empty()) q.pop();
        bool fail = false;
        scanf("%d%d%d", &n, &m, &k);
        for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
        for (int i = 1; i <= n; ++i) {
            m -= a[i];
            q.push(a[i]);
            if (m <= 0 && !q.empty() && k) {
                k--;
                m += q.top();
                q.pop();
            }
            if (m <= 0) {
                fail = true;
                printf("%d\n", i - 1);
                break;
            }
        }
        if (!fail) printf("%d\n", n);
    }
    return 0;
}
```

## B. **树联网**

树形 dp 统计子树大小即可。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;

int head[N], ne[N * 2], ver[N * 2], w[N * 2], tot;
int cnt[N], n;
long long res = 0;

void add(int x, int y, int z) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
    w[tot] = z;
}

void dp(int x, int fa) {
    cnt[x] = 1;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == fa) continue;
        dp(y, x);
        cnt[x] += cnt[y];
        res += (long long)w[i] * abs(n - cnt[y] * 2);
    }
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i < n; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        add(x, y, z);
        add(y, x, z);
    }
    dp(1, 0);
    printf("%lld\n", res);
    return 0;
}
```

剩下的不会了😇