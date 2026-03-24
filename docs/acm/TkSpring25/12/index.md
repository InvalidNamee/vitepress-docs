---
title: 2025春训第十二场
---
# 2025春训第十二场

## **A. 拼写检查**

按要求模拟就行，只需要注意 **如果要检查的单词在词表中出现，则原样输出该单词。**

```python
s = input()
n = int(input())
l = [input() for _ in range(n)]
if s in l:
    print(s)
else:
    for t in l:
        f = False
        if (len(s) == len(t)):
            if (sum(s[i] != t[i] for i in range(len(s))) == 1):
                f = True
        elif (len(s) == len(t) + 1):
            for i in range(len(s)):
                if (s[:i] + s[i + 1:] == t):
                    f = True
                    break
        elif (len(s) == len(t) - 1):
            for i in range(len(t)):
                if (s == t[:i] + t[i + 1:]):
                    f = True
                    break
        if f:
            print(t)
            break
    else:
        print('NOANSWER')
```

## **B. 翻转**

有点类似线性dp的思想，核心问题就是 0 和 1 的分界点在哪。预处理把右侧全变成 1 的操作数。

* 特别的对于 i = n， 时如果是 s\[i\] = 0，翻转一次；如果 s\[i\] = 1，不用翻转；
    

* 其他情况，如果 s\[i\] = 1，不用动；如果 s\[i\] = 0 并且 s\[i + 1\] = 0，不用消耗翻转次数（因为把对于 \[s\[i + 1\], n\] 的最后一次翻转改成对于 \[s\[i\], n\] 的翻转就行），否则翻转两次（先把后面全变 0，然后一起变成 1）。
    

然后从左到右遍历，枚举分界点，遍历到 i 时把 i 变成 1，然后考虑当前翻转次数的奇偶性

* 如果是偶数，后面的序列不变，可以直接用前面维护的结果；
    
* 如果是奇数，后面序列翻转，如果 s\[i + 1\] 本来是 1，那只能再翻转一次了；如果 s\[i + 1\] 本来是 0，说明维护的时候已经翻转了一次，直接把最后一次无效翻转撤销掉即可。
    

```cpp
#include <iostream>

using namespace std;

int a[100010], b[100010];

int main() {
    int n, t = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%1d", &a[i]);
    }
    a[n + 1] = 1;
    for (int i = n; i; --i) {
        if (a[i] || a[i + 1] == a[i]) b[i] = b[i + 1];
        else if (i == n) b[i] = 1;
        else b[i] = b[i + 1] + 2;
    }
    int res = b[1];
    for (int i = 1; i <= n; ++i) {
        if ((a[i] ^ (t & 1)) && a[i] != a[i - 1]) t++;
        res = min(res, t + ((t & 1) ? (a[i + 1] ? b[i + 1] + 1 : b[i + 1] - 1) : b[i + 1]));
    }
    printf("%d\n", res);
    return 0;
}
```

## C. 集合

比较暴力的做法（容易爆空间），可以用分治的思想，预处理 k 小的，暴力 k 大的，平均每次查询只需要 1000 次左右计算。

```cpp
#include <iostream>
#include <unordered_map>

using namespace std;

unordered_map<int, int> s;
int n;
struct FenwickTree
{
    int val[100001];
    bool mark[100001];
    void add(int u) {
        if (mark[u]) return;
        mark[u] = true;
        for (; u <= n; u += u & -u) {
            val[u] += 1;
        }
    }
    int query(int u) {
        int res = 0;
        for (; u; u -= u & -u) {
            res += val[u];
        }
        return res;
    }
} tr[101];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int q;
    cin >> q;
    n = q;
    while (q--) {
        char c;
        int x;
        cin >> c >> x;
        if (c == '+') {
            if (s[x] == 0) {
                for (int i = 1; i <= 100; ++i) {
                    if (x % i == 0) {
                        if (x / i <= 100000) tr[i].add(x / i);
                    }
                }
            }
            s[x]++;
        }
        else {
            if (x > 100) {
                int i;
                for (i = 1; s[i * x]; ++i);
                cout << i * x << endl;
            }
            else {
                int l = 1, r = 100000;
                while (l < r) {
                    int mid = l + r >> 1;
                    if (tr[x].query(mid) < mid) r = mid;
                    else l = mid + 1;
                }
                cout << l * x << endl;
            }
        }
    }
    return 0;
}
```

不那么暴力的做法，因为没有删除操作，所以对于每一个 k，后一次得到的答案一定是在前一次答案的后面，于是把较小的 k 打上标记，每次查询从标记开始往后面查即可（但是我没想到，还在暴力树状数组+二分）。

## D. 计数

线性dp，大概思路很好想，比较难做到的是不重不漏，我🧠不行，于是写了个 $O(2^n \times n^3)$的大暴力对拍拍出来了。

每个 $A_i$ 只能有被删和不被删两种情况，令 $f_{i, 0}$ 表示只考虑 \[1, i\] 这个区间的内的数的情况下第 i 个数不被删的方案数，$f_{i, 1}$ 表示被删的方案数。

如果 $A_i$ 前有比他小的数，记第一个比他小的数为 $A_j$。

* 首先考虑 $f_{i, 0}$，$A_i$ 可以删的区间有 \[k, i - 1\]，其中 j + 1 ≤ k ≤ i - 1，在不全删掉的情况下，从左到右删和从右到左删一定是不重复的，所以方案数是 $\sum_{k = j + 1}^{i - 1} f_{i, 0}$；如果 \[j + 1, i - 1\] 全删掉了，方案数就是 j 的方案数 $f_{j, 0} + f_{j, 1}$，合并一下有
    
$$
f_{i, 0} = \sum_{k = j}^{i - 1} f_{k, 0} + f_{j, 1}
$$
    
* 考虑 $f_{i, 1}$，$A_i$ 可以被 $A_j$ 删也可以被能删掉 $A_j$ 的点删，所以
    
$$
f_{i, 1} = f_{j, 0} + f_{j, 1}
$$
    

如果没有比他小的数， 他可以 \[k, i - 1\]，1 ≤ k ≤ i - 1，方案数就是不全删的方案数 + 全删的方案数（就是 1）

$$
f_{i, 0} = \sum_{k = 1}^{i - 1}f_{k, 0} + 1
$$

他不可能被左边的删掉，所以 $f_{i, 1} = 0$.

```cpp
#include <iostream>

using namespace std;

const int MOD = 998244353;
const int N = 300010;

int st[N], tp;
long long f[N][2], s[N];
int a[N];

int main() {
    int n;
    scanf("%d", &n);
    s[0] = 1;
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &a[i]);
        while (tp && a[i] <= a[st[tp]]) tp--;
        if (!tp) {
            f[i][0] = s[i - 1];
        }
        else {
            f[i][0] = (((s[i - 1] - s[st[tp] - 1] + f[st[tp]][1]) % MOD) + MOD) % MOD;
            f[i][1] = (f[st[tp]][0] + f[st[tp]][1]) % MOD;
        }
        s[i] = (s[i - 1] + f[i][0]) % MOD;
        st[++tp] = i;
    }
    printf("%lld\n", (f[n][0] + f[n][1]) % MOD);
    return 0;
}
```

📎 大暴力，枚举所有子序列，挨个检查合法性（如果一个点被删了，那么一定有一个比他小的点没有被删，并且这两个点路径上的所有点都被删了）。

```cpp
#include <iostream>

using namespace std;

int a[20];

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    int t = 0;
    for (int mask = 0; mask < (1 << n); ++mask) {
        bool big_f = true;
        for (int i = 1; i <= n; ++i) {
            if (((mask >> (i - 1)) ^ 1) & 1) {
                bool f = false;
                for (int j = 1; j <= n; ++j) {
                    if ((mask >> (j - 1)) & 1) {
                        if (a[j] < a[i]) {
                            bool ck = true;
                            int l = min(i, j), r = max(i, j);
                            for (int ii = l + 1; ii < r; ++ii) {
                                if (mask >> (ii - 1) & 1) {
                                    ck = false;
                                    break;
                                }
                            }
                            if (ck) {
                                f = true;
                                break;
                            }
                        }
                    }
                }
                if (!f) {
                    big_f = false;
                    break;
                }
            }
        }        
        t += big_f;
    }
    cout << t << endl;
    return 0;
}
```