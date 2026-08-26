---
title: 2025春训第十一场
---
# 2025春训第十一场

刚开始一看发现啥都不会，细看发现以为简单的很复杂，以为很复杂的很简单。

## A. 游戏

约数尽可能多，所以应该让约数尽可能小，那就让他都是 2，找一个最大的 i，使得 l ≤ (1 « i) ≤ r 即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    int l, r;
    cin >> l >> r;
    for (int i = 30; i >= 0; --i) {
        if (l <= (1 << i) && (1 << i) <= r) {
            cout << i << endl;
            return 0;
        }
    }
    return 0;
}
```

## **B. 或**

只需要依次考虑每个二进制位是否含 1。于是可以从第 0 位开始一位一位找这个范围内是否包含一个 1 即可。

```cpp
#include <iostream>

using namespace std;

int main() {
    int t;
    scanf("%d", &t);
    while (t--) {
        int l, r;
        scanf("%d%d", &l, &r);
        long long res = 0;
        for (int i = 0; i < 30; ++i) {
            if (l < r || (l & 1) || (r & 1)) res |= 1 << i;
            l >>= 1, r >>= 1;
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## C. **最长子序列**

非常反直觉的一道题，看上去很简单，实际上很恶心。

长度很好算，直接开个桶标记一下就行，主要问题是如何构造出字典序最小的合法子序列。不难想出要**让尽可能靠前的位置选到最优解**，所以可以基于贪心的思想构造。

1. 维护每个元素出现的位置序列第一次出现的位置和最后出现的位置；
    
2. 从小到大遍历最后出现的位置，设该位置是 a 最后出现的位置，把前面的**所有没有选过的**元素加入备选集合；
    
3. 根据奇偶性贪心地从备选集合里选出**当前最优**的那个数，同时保证这个数如果在备选集合重复出现，选择的一定是**最左边的一个**，输出这个数；
    
4. 将这个数所在位置左侧的所有备选项**全部删掉**，如果删掉的一个元素在右侧仍有出现则通过位置序列找到第一个合法位置更新第一次出现的位置；
    
5. 如果这个数不是 a 则转 3，如果是 a 则结束挑选转 2。
    

解释第 5 条步骤：a 的存在限制了其他元素可选的位置，如果先选了 a 的位置后面其他元素，那么 a 就一定选不到了；但是如果 a 已经选走了，那么 a 将不会对其他元素的选择产生限制，因此可以扩大挑选范围以保证最优。

```cpp
#include <iostream>
#include <set>
#include <cstring>

using namespace std;

const int N = 300010;
int a[N], fp[N], p[N], ne[N]; // fp 是第一次出现的位置，ne 是下一次出现的位置，p 是维护 ne 的过程量
multiset<int> s; // 备选集合
bool v[N];
int ls[N]; // 最后出现的位置

int main() {
    int n, m = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        if (!fp[a[i]]) {
            m++;
            fp[a[i]] = i;
            p[a[i]] = i;
        }
        else {
            ne[p[a[i]]] = i;
            p[a[i]] = i;
        }
    }
    printf("%d\n", m);
    bool f = true; // true: 找最大 false: 找最小
    for (int i = n, t = 0; i; --i) {
        if (!v[a[i]]) {
            ne[i] = n + 1;
            v[a[i]] = true, ls[m - t++] = i;
        }
    }
    memset(v, 0, sizeof(v));
    int lstp = 0; // 上次出现的位置
    for (int i = 1; i <= m; ++i) {
        for (int j = ls[i - 1] + 1; j <= ls[i]; ++j) {
            if (!v[a[j]]) s.insert(a[j]);
        }
        if (v[a[ls[i]]]) continue;
        while (!s.empty()) {
            multiset<int>::iterator it;
            if (f) it = --s.end();
            else it = s.begin();
            int num = *it;
            v[num] = true;
            printf("%d ", num);
            s.erase(num); // 全部删掉
            for (int j = lstp + 1; j <= fp[num]; ++j) {
                if (!v[a[j]]) {
                    s.erase(s.find(a[j])); // 只删一个
                    while (fp[a[j]] < fp[num]) fp[a[j]] = ne[fp[a[j]]];
                }
            }
            lstp = fp[num];
            f ^= 1;
            if (num == a[ls[i]]) break;
        }
    }
    printf("\n");
    return 0;
}
```

## E. 精灵球

数据分层，预处理间隔不大于 1000 的查询，暴力处理间隔大于 1000 的查询，最坏 1e8 的计算量完全可以过。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
int a[N];
long long b[1010][1010];

int main() {
    int n, q;
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        for (int j = 1; j <= 1000; ++j) {
            b[j][i % j] += a[i];
        }
    }
    while (q--) {
        int op, x, y;
        scanf("%d%d%d", &op, &x, &y);
        if (op == 1) {
            if (x <= 1000) 
                printf("%lld\n", b[x][y % x]);
            else {
                long long res = 0;
                for (int i = y; i <= n; i += x) res += a[i];
                for (int i = y - x; i > 0; i -= x) res += a[i];
                printf("%lld\n", res);
            }
        }
        else {
            for (int j = 1; j <= 1000; ++j) {
                b[j][x % j] += y - a[x];
            }
            a[x] = y;
        }
    }
    return 0;
}
```

## **F. 钢条(stick)**

我一直在从切割的角度看，没想到从切出的段的角度看。

首先 n 是没用的，只看 k 即可。切了 k 刀之后会切出来 k + 1 段，只要有一段长度 ≥ $\frac{n}{2}$就不合法，每一段 ≥ $\frac{n}{2}$的概率是相等的而且是独立的（因为不可能两段都满足，和总长度为 n 矛盾），都是 $\frac{1}{2 ^ k}$，所以不合法概率是 $\frac{k + 1}{2 ^ k}$，合法概率是 $1 - \frac{k + 1}{2 ^ k}$。

```cpp
#include <iostream>

using namespace std;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int main() {
    int n, m;
    cin >> n >> m;
    int a = m + 1, b = 1 << m;
    int g = gcd(a, b);
    cout << (b - a) / g << '/' << b / g << endl;
    return 0;
}
```