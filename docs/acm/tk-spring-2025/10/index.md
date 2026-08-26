---
title: 2025 春训第十场
---
# 2025 春训第十场

## **A. 鲁的学生**

大水题，但是我没看到要取模连 WA 两次。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int MOD = 1000000007;

int main() {
    long long res = 0;
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        res += (long long)i * (n - i + 1) % MOD * t % MOD;
        res %= MOD;
    }
    printf("%lld\n", res);
    return 0;
}
```

## B. **鲁的探险**

n 个点 n 条边，而且每个点都至少有 1 度，显然这张图是基环树（一棵树随便加一条边构成的连通的只有一个环的图）构成森林。所有的点最后都会走到对应连通块的环里，随后绕一圈结束；明白了这点那么做法就很简单了，记点 i 的答案为 $val_i$

1. 划分连通块；
    
2. 对每个连通块找到环的位置；
    
3. 对于每个环，环上的点的 $A_i$ 求和赋给这个环上的所有点；
    
4. 从所有环上的点开始搜索反图，更新其他点的 $val_i$。
    

代码比较恶心，如需参考，请谨慎。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;

const int N = 200010;

vector<int> ed[N];
int pre[N];
int a[N], vis[N], tot;
int cir[N];
long long sum[N];
bool mark[N];
bool v[N];
// 这里我原来是把 val 用作标记数组，然后因为有 val 是 0 但是确实访问过的数据导致不是爆栈就是 t
// 发现之后一怒之下开了这个 vvvvv
bool vvvvv[N]; 
long long val[N];

void bfs(int i) {
    queue<int> q;
    q.push(i);
    vis[i] = tot;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : ed[x]) {
            if (vis[y]) continue;
            vis[y] = tot;
            q.push(y);
        }
        if (!vis[pre[x]]) {
            vis[pre[x]] = tot;
            q.push(pre[x]);
        }
    }
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
    }
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &pre[i]);
        ed[pre[i]].push_back(i);
    }
    for (int i = 1; i <= n; ++i) {
        if (!vis[i]) {
            tot++;
            bfs(i);
        }
    }
    queue<int> q;
    for (int i = 1; i <= n; ++i) {
        if (!mark[vis[i]]) {
            mark[vis[i]] = true;
            int x, y;
            for (x = i; !v[x]; x = pre[x]) {
                v[x] = true;
            }
            y = x;
            do {
                cir[y] = vis[i];
                sum[vis[i]] += a[y];
                y = pre[y];
            } while (y != x);
        }
    }
    for (int i = 1; i <= n; ++i) {
        if (cir[i]) {
            q.push(i);
            vvvvv[i] = true;
            val[i] = sum[cir[i]];
        }
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : ed[x]) {
            if (vvvvv[y]) continue;
            vvvvv[y] = true;
            val[y] = val[x] + a[y];
            q.push(y);
        }
    }
    for (int i = 1; i <= n; ++i) {
        printf("%lld\n", val[i]);
    }
    return 0;
}
```

## C. **他会输出啥**

我用 python 写的，实际上用 C++ 区别不大，注意别爆 int 就行。

思路是把第二个循环直接用等差数列求和公式算出来，只跑第一层循环时间复杂度是完全够的的。

```python
def fun(a, b, c):
    if a in range(a, b, c):
        t = len(range(a, b, c))
        return a * t + c * t * (t - 1) // 2
    else:
        return 0
input()
s = input()
a, b, c = map(int, s[s.find('(') + 1:s.find(')')].split(','))
s = input()
d, e, f = s[s.find('(') + 1:s.find(')')].split(',')
if d.isalpha() and e.isalpha():
    print(sum(fun(i, i, int(f)) for i in range(a, b, c)))
elif d.isalpha():
    print(sum(fun(i, int(e), int(f)) for i in range(a, b, c)))
elif e.isalpha():
    print(sum(fun(int(d), i, int(f)) for i in range(a, b, c)))
else:
    print(sum(fun(int(d), int(e), int(f)) for i in range(a, b, c)))
```