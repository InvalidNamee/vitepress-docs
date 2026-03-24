---
title: 2025组队训练赛第 21 场
---
# 2025组队训练赛第 21 场

## A. Vote

~~究竟是谁写了 190 行线段树挂了之后突然发现不用开线段树。~~

考虑每次 2 和 3 操作，就是从对方的人里面选绝对值最小的几组变成 1 或者 -1，然后剩余的绝对值最小的一组中取一部分变成 1 或 -1，假设一共有 n 次 1 操作，均摊下来一共只需要 n 次，所以放心开两个优先队列就能过。

```cpp
#include <iostream>
#include <queue>
#define int long long
 
using namespace std;
 
typedef long long LL;
const int N = 200010;
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q1, q2;
 
signed main() {
    int q;
    LL zcnt = 0, s1 = 0, s2 = 0;
    scanf("%lld", &q);
    while (q--) {
        int op;
        scanf("%lld", &op);
        if (op == 1) {
            int x, y;
            scanf("%lld%lld", &x, &y);
            if (y == 0) zcnt += x;
            else if (y > 0) q1.emplace(y, x), s1 += x;
            else q2.emplace(-y, x), s2 += x;
        }
        else {
            int k;
            scanf("%lld", &k);
            if (op == 2) {
                if (s1 >= k) {
                    printf("0\n");
                    continue;
                }
                k -= s1;
                if (k <= zcnt) {
                    pair<int, int> t;
                    if (!q1.empty() && q1.top().first == 1) t = q1.top(), q1.pop();
                    else t = {1, 0};
                    s1 += k;
                    t.second += k;
                    q1.push(t);
                    printf("%lld\n", k);
                }
                else {
                    pair<int, int> t;
                    if (!q1.empty() && q1.top().first == 1) t = q1.top(), q1.pop();
                    else t = {1, 0};
                    t.second += k;
                    s1 += k;
                    q1.push(t);
 
                    k -= zcnt;
                    // printf("%lld\n", k);
                    LL res = zcnt;
                    while (k && k >= q2.top().second) {
                        k -= q2.top().second;
                        res += (LL)(q2.top().first + 1) * q2.top().second;
                        s2 -= q2.top().second;
                        q2.pop();
                    }
                    if (k) {
                        auto t = q2.top();
                        q2.pop();
                        t.second -= k;
                        s2 -= k;
                        res += (LL)(t.first + 1) * k;
                        q2.push(t);
                    }
                    printf("%lld\n", res);
                    zcnt = 0;
                }
            }
            else {
                if (s2 >= k) {
                    printf("0\n");
                    continue;
                }
                k -= s2;
                if (k <= zcnt) {
                    pair<int, int> t;
                    if (!q2.empty() && q2.top().first == 1) t = q2.top(), q2.pop();
                    else t = {1, 0};
                    s2 += k;
                    t.second += k;
                    q2.push(t);
                    printf("%lld\n", k);
                }
                else {
                    pair<int, int> t;
                    if (!q2.empty() && q2.top().first == 1) t = q2.top(), q2.pop();
                    else t = {1, 0};
                    t.second += k;
                    s2 += k;
                    q2.push(t);
 
                    k -= zcnt;
                    LL res = 0;
                    while (k && k >= q1.top().second) {
                        k -= q1.top().second;
                        res += (LL)(q1.top().first + 1) * q1.top().second;
                        s1 -= q1.top().second;
                        q1.pop();
                    }
                    if (k) {
                        auto t = q1.top();
                        q1.pop();
                        t.second -= k;
                        res += (LL)(t.first + 1) * k;
                        s1 -= k;
                        q1.push(t);
                    }
                    printf("%lld\n", res);
                    zcnt = 0;
                }
            }
        }
    }
    return 0;
}
```

## G. Juan

## I. news

最后结果每四项一定成一个等差数列，先暴力一下前几次凑成 4 的倍数，然后归纳一下规律就可以算出来。

## J. message

不加限制的话，按照要求会构造出一个基环树森林。最终答案要求只能有一个入度为 2 的点，画在图上就是一个环 + 一条链。每个连续的 3 2 组合会贡献一个入度为 2 的点，所以这样的组合至多只能有一个，于是只能 3 全放一起，2 全放一起才有可能行。接下来 dfs 一遍验证一下是否连通即可。

```cpp
#include <iostream>
#include <cstring>
 
using namespace std;
 
const int N = 100010;
 
int ver[N * 2], ne[N * 2], head[N], tot, t;
bool vis[N];
 
void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}
 
void dfs(int x) {
    if (vis[x]) return;
    vis[x] = true;
    t++;
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        dfs(y);
    }
}
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, c2 = 0;
        scanf("%d", &n);
        tot = 0;
        memset(head, 0, sizeof(int) * (n + 1));
        memset(vis, 0, sizeof(bool) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            int t;
            scanf("%d", &t);
            c2 += t == 2;
        }
        for (int i = 1; i <= c2; ++i) {
            add(i, (i + 1) % n + 1);
            add((i + 1) % n + 1, i);
        }
        for (int i = c2 + 1; i <= n; ++i) {
            add(i, (i + 2) % n + 1);
            add((i + 2) % n + 1, i);
        }
        t = 0;
        dfs(1);
        if (t == n) printf("Yes\n");
        else printf("No\n");
    }
    return 0;
}
```

## L. clothes

## M. kingdom