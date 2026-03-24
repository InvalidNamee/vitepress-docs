---
title: 2025春训第十八场
---
# 2025春训第十八场

废掉了，拼尽全力无法战胜，做的时候感觉自己差点爆零，以 3 / 8 的优异成绩拿下榜一。这套题前面的题都是主打一个直觉上的欺骗，后面难的不会做。

## **A. 序列重排**

首先，结论是答案只可能是 0, 1, 2。

* 序列中 0 的个数不超过 $\lfloor \frac{n + 1}{2} \rfloor$，把 **0 穿插到其他数中间**肯定是可以放得下的，所以**答案是 0**；
    
* 如果不满足上述条件，0 不能都穿插到其他数中间，那么一定有相邻的数加起来是 0，只能考虑剩余的数，我们要尽可能空出来最小的数。首先考虑空出来 1，除非除了 0 都是 1，否则让任意一个 不是 1 的数和一大堆 0 相邻，剩下的 1 都放一块，这样 1 就能空出来了，**所以如果至少有一个数不是 1，那么答案是 1**；如果全是 1，那没办法空出 1 了，就尽可能空出 2，显然是可行的，**把 0 和 1 交叉放**，所有的和都是 0 或者 1，就空出了 2，所以**答案是 2**。
    

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int a[1000010];

int main() {
    int n, zcnt = 0, m = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[++m]);
        if (!a[m]) zcnt++;
    }
    sort(a + 1, a + m + 1);
    if (zcnt <= (n + 1) / 2) printf("0\n");
    else if (a[m] == 1) printf("2\n");
    else printf("1\n");
    return 0;
}
```

## B. **划分**

这道题也是，只是看起来难，但是实际上只需要预处理前缀和，只考虑分成两段的情况即可。

Why？因为假设最大的结果是分成多块得到的，那么随意找一个分块的边界为参考点左侧分一块右侧分一块，最大公约数显然不变，所以**分两段一定会包含所有分多块的情况**。

```cpp
#include <iostream>

using namespace std;

long long gcd(long long a, long long b) {
    return b ? gcd(b, a % b) : a;
}

const int N = 100010;
long long s[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &s[i]);
        s[i] += s[i - 1];
    }
    long long res = 0;
    for (int i = 1; i < n; ++i) {
        res = max(res, gcd(s[n] - s[i], s[i]));
    }
    printf("%lld\n", res);
    return 0;
}
```

## **C. 蛋糕**

可以用贪心的思想，能不切就不切，实在是迫不得已了再切。

首先把 n 二进制拆分，从低到高遍历二进制位，如果这一位是 1 而且正好有现成的那就直接用一个现成的，然后把**剩下的蛋糕两两配对组成大的给后面备用**；如果没有，就从**右边找最近的有蛋糕的位置**，一直切直到有，然后用掉一个切出来的；如果是 0 不用处理，直接把手上的都组成大的给后面备用。

一轮流程跑下来之后就能凑出来 n 了。

**正确性：**如果能凑出来，那么手上的蛋糕总和一定不小于 n，对于**低位剩下的零头他无法对任何高位做出贡献**，即使切割大的来给他补一下也是无效操作，因为一来就是 2 个，剩下的零头还是凑不回去，他注定只能剩着，把多余的往高位凑已经最大程度的利用了所有二进制位。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

int cnt[64];

int main() {
    long long n, tot = 0;
    int m;
    scanf("%lld%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        long long t;
        scanf("%lld", &t);
        cnt[(int)(log2(t) + 0.3)]++;
        tot += t;
    }
    if (tot < n) {
        printf("-1\n");
        return 0;
    }
    int res = 0;
    for (int i = 0; i < 64; ++i) {
        if (i > 0) cnt[i] += cnt[i - 1] / 2, cnt[i - 1] %= 2;
        if (n >> i & 1) {
            if (cnt[i]) cnt[i]--;
            else {
                int p = -1;
                for (int j = i; j < 64; ++j) {
                    if (cnt[j]) {
                        p = j;
                        break;
                    }
                }
                for (int j = p; j > i; --j) {
                    cnt[j]--;
                    cnt[j - 1] += 2;
                    res++;
                }
                if (!cnt[i]) return 123;
                cnt[i]--;
            }
        }
    }
    printf("%d\n", res);
    return 0;
}
```