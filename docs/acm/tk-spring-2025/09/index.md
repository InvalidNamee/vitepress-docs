---
title: 2025春训第九场
---
# 2025春训第九场

## **A. 鲁的智力**

我刚开始看到这道题之后默默的放弃了，选择了后面的 dp 题。

* 最小排名：至少有多少个人比他分数高。
    
* 最大排名：至少有多少个人比他分数低。
    

两边都是考虑极限情况，以第一种为例。一个人要想稳定的分数比另一个人高，那必然每道题都比另一个高，于是问题转化成至少有几个人每道题分数都比他高。设第 i 道题的排名是 $a_i$，考虑一道题的时候，情况是确定的，这道题比他高的人肯定满足所有题都比他高；两道题的时候，考虑边界情况——第二道题比他高的人和第一道题比他高的人最大程度的不重叠，所以人数应该是 $\max\{0, a_2 + a_1 - m - 1\}$；现在相当于前两道题已经合成一道大的题了，再不断往下计算就能算出来最后的结果。第二种同理。

```cpp
#include <iostream>

using namespace std;

int a[1010];

int main() {
    int n, m, l, r;
    cin >> n >> m;
    l = r = m - 1;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        l = max(0, a[i] + l - m);
        r = max(0, (m - a[i]) + r - (m - 1));
    }
    cout << l + 1 << endl << m - r << endl;
    return 0;
}
```

## B. **鲁的女孩**

最优的配对方案是一个正序一个倒序一一配对。关键的性质是 1 ≤ a, b ≤ 100，开两个数组记录 \[1, 100\] 每个数的个数，然后双指针扫描一次即可得出答案。事实可以证明，挺容易写挂的（比如我）

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

int a[210], b[210];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        int ta, tb;
        cin >> ta >> tb;
        a[ta]++, b[tb]++;
        int mx = -0x3f3f3f3f;
        int l = 0, r = 101;
        int lc = 0, rc = 0;
        while (l <= 100 && r > 0) {
            if (lc && rc) {
                mx = max(mx, l + r);
                int tmp = min(lc, rc);
                lc -= tmp, rc -= tmp;
            }
            if (!rc) rc = b[--r];
            if (!lc) lc = a[++l];
        }
        cout << mx << endl;
    }
    return 0;
}
```

## C. **鲁的石板**

**前排警告**，最好别用 vector 一直申请内存容易 TLE😭

这题好像有数学的方法可以一个式子秒了，没关系，我会一个矩阵快速幂秒了。

线性 dp 的方法是开一个状态数组 f\[N\]\[2\]，f\[i\]\[0\] = 表示涂到第 i 块且第 i 块颜色和第一块一致的方案数，f\[i\]\[1\] 表示涂到第 i 块且第 i 块颜色和第一块不一致的方案数，答案是 f\[n\]\[1\]。

$$
f_{i, 0} = f_{i - 1, 1}
$$

$$
f_{i, 1} = (m - 1)f_{i - 1, 0} + (m - 2)f_{i - 1, 1}
$$

用矩阵乘法写这个递推式

$$
\begin{pmatrix} f_{i - 1, 0} & f_{i - 1, 1} \end{pmatrix} \begin{pmatrix} 0 & m - 1\\ 1 & m - 2 \end{pmatrix} = \begin{pmatrix} f_{i, 0} & f_{i, 1} \end{pmatrix}
$$

显然答案是 $[\begin{pmatrix} m & 0\end{pmatrix}\begin{pmatrix} 0 & m - 1 \\ 1 & m - 2 \end{pmatrix}^{n - 1}]_{1, 2}$，即 $m\begin{pmatrix} 0 & m - 1 \\ 1 & m - 2 \end{pmatrix}^{n - 1}_{1, 2}$.

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int MOD = 1000000007;

long long mat[2][2], res[2][2], a[2][2], b[2][2];

void mul(long long a[][2], long long b[][2]) {
    static long long t[2][2];
    t[0][1] = t[0][0] = t[1][1] = t[1][0] = 0;
    for (int k = 0; k < 2; ++k) {
        for (int i = 0; i < 2; ++i) {
            for (int j = 0; j < 2; ++j) {
                t[i][j] = (t[i][j] + a[i][k] * b[k][j] % MOD) % MOD;
            }
        }
    }
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 2; ++j) {
            a[i][j] = t[i][j];
        }
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m;
        scanf("%d%d", &n, &m);
        if (n == 1) {
            cout << m << endl;
            continue;
        }
        mat[0][0] = 0, mat[0][1] = m - 1, mat[1][0] = 1, mat[1][1] = m - 2;
        res[0][0] = res[1][1] = 1, res[0][1] = res[1][0] = 0;
        n--;
        while (n) {
            if (n & 1) mul(res, mat);
            mul(mat, mat);
            n >>= 1;
        }
        printf("%d\n", (long long)m * res[0][1] % MOD);
    }
    return 0;
}
```

## **D. 游览计划**

提供一个暴力的解法，具体有多暴力见下图，差点拼尽全力无法战胜了……

![](5902439e-7856-415e-aca9-352307ee119c.png)

暴力的流程是

1. 对于每一个点跑一遍 bfs 找到到所有其他点的最短路；
    
2. 对于每一个点找到最短路最长的三个点，记下来；
    
3. 暴力枚举中间点 B, C，枚举到 B 距离最长的三个 A，到 C 距离最长的三个 D，过滤所有A, B, C, D 重复情况，把路径加起来更新答案。
    

这个做法显然是正确的，存了三个最远的点保证了最坏的情况下也不至于全部冲突。

* 代码后续更新了一下，不会 997ms 了。
    

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 4010, M = 5010;
int head[N], ne[M * 2], ver[M * 2], tot;
int d[N][N], q[N], hh, tt;
int mxp[N][3];

inline void read(int &_) {
    _ = 0;
    char c = getchar();
    while (!isdigit(c)) c = getchar();
    while (isdigit(c)) _ = _ * 10 + c - 48, c = getchar();
}

inline void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

int main() {
    int n, m;
    read(n), read(m);
    for (int i = 1; i <= m; ++i) {
        int x, y;
        read(x), read(y);
        add(x, y);
        add(y, x);
    }
    memset(d, -1, sizeof(d));
    for (int i = 1; i <= n; ++i) {
        hh = tt = 0;
        d[i][i] = 0;
        q[tt] = i;
        while (hh <= tt) {
            int x = q[hh++];
            if (d[i][x] >= d[i][mxp[i][0]]) {
                mxp[i][2] = mxp[i][1], mxp[i][1] = mxp[i][0];
                mxp[i][0] = x;
            }
            else if (d[i][x] >= d[i][mxp[i][1]]) {
                mxp[i][2] = mxp[i][1];
                mxp[i][1] = x;
            }
            else if (d[i][x] >= d[i][mxp[i][2]]) {
                mxp[i][2] = x;
            }
            for (int j = head[x]; j; j = ne[j]) {
                int y = ver[j];
                if (~d[i][y]) continue;
                d[i][y] = d[i][x] + 1;
                q[++tt] = y;
            }
        }
    }
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j < i; ++j) {
            for (int k = 0; k < 3; ++k) {
                if (mxp[i][k] == j) continue;
                for (int p = 0; p < 3; ++p) {
                    if (i != mxp[j][p] && mxp[i][k] != mxp[j][p])
                        res = max(res, d[mxp[i][k]][i] + d[i][j] + d[j][mxp[j][p]]);
                }
            }
        }
    }
    printf("%d\n", res);
    return 0;
}
```