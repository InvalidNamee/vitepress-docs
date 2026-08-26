---
title: 2025春训第二十八场
---
# 2025春训第二十八场

## A. 评估

关键在于 $|a_i| \le 1000$，所以可以**开一个长度为 2000 的数组统计一下每个值的个数**，然后 $\Theta(n^2)$ 处理这个 2000 的数组。

```cpp
#include <iostream>

using namespace std;

const int N = 2010;
int a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        a[t + 1000]++;
    }
    long long res = 0;
    for (int i = 0; i <= 2000; ++i) {
        for (int j = i + 1; j <= 2000; ++j) {
            res += (long long)a[i] * a[j] * (i - j) * (i - j);
        }
    }
    printf("%lld\n", res);
    return 0;
}
```

## **B. 拆分数字**

记 n 在**三进制表示下的各位数之和**为 t，想要满足要求的充要条件是 $t \le k \le n\  \land\ t \equiv k\ (mod\ 2)$.

* 首先考虑**边界情况**，如果全用 1 那么需要 n 个；如果选择最优方案，全部按照三进制的表示那么需要 t 个；
    
* 其次考虑**内部**，按照要求，无论怎么拆，一个 3 的幂只能拆成奇数个更小的幂，所以最优方案拆出来的个数的奇偶性和任何方案的奇偶性相同。
    

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        long long n, k;
        scanf("%lld%lld", &n, &k);
        long long bit = 0;
        bool f = false;
        while (n) {
            f ^= (n % 3) & 1;
            bit += n % 3;
            n /= 3;
        }
        if (bit <= k && !(f ^ (k & 1))) printf("Yes\n");
        else printf("No\n");
    }
    return 0;
}
```

## C. 露营

比较水，直接枚举一个中间点向三个点分别连线就行。

```cpp
#include <iostream>

using namespace std;

int dis(pair<int, int> a, pair<int, int> b) {
    return abs(a.first - b.first) + abs(a.second - b.second);
}

int main() {
    pair<int, int> a[3];
    for (int i = 0; i < 3; ++i) scanf("%d%d", &a[i].first, &a[i].second);
    int res = 0x3f3f3f3f;
    for (int i = 0; i <= 1000; ++i) {
        for (int j = 0; j <= 1000; ++j) {
            pair<int, int> cur = {i, j};
            res = min(res, dis(cur, a[0]) + dis(cur, a[1]) + dis(cur, a[2]) + 1);
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## **D. 寻宝**

思路比较简单，实际操作有点复杂

* 能放法术一定是最开始连续放，让前面都是 a，所以先做一个二维 dp 求出来**左上角到每个点路径上最多 a 的个数。**
    
* 遍历一遍 dp 的数组，找到能达到最长 a 的位置（可以是多个），从每个位置跑**记搜（反拓扑序dp）**，dp 出后续的最优路线。
    

这道题需要注意爆空间的问题，**不能每个点都存字符串**，应该存一个方向或者下一个点的位置，比较字典序的时候按照记录的信息递归比较。

另外还要**特判**

* 如果一开始就没有 a，也不能施法的情况。
    
* k 太大的情况。
    

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 1010;

char a[N][N];
int f[N][N];
int n, k;
bool vis[N][N], ne[N][N]; // 0 下 1 右

bool le(int x1, int y1, int x2, int y2) {
    while (x1 != n || y1 != n) {
        if (a[x1][y1] != a[x2][y2]) return a[x1][y1] < a[x2][y2];
        else {
            bool flag = ne[x1][y1];
            x1 = flag ? x1 : x1 + 1, y1 = flag ? y1 + 1 : y1;
            flag = ne[x2][y2];
            x2 = flag ? x2 : x2 + 1, y2 = flag ? y2 + 1 : y2; 
        }
    }
    return true; // 相等，随便了
}

void dp(int x, int y) {
    if (vis[x][y]) return;
    vis[x][y] = true;
    if (x == n && y != n) {
        dp(x, y + 1);
        ne[x][y] = 1;
    }
    else if (x != n && y == n) {
        dp(x + 1, y);
        ne[x][y] = 0;
    }
    else if (x != n && y != n) {
        dp(x + 1, y), dp(x, y + 1);
        if (le(x + 1, y, x, y + 1)) ne[x][y] = 0;
        else ne[x][y] = 1;
    }
}

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%s", a[i] + 1);
    }
    int mxd = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            f[i][j] = max(f[i - 1][j], f[i][j - 1]) + (a[i][j] == 'a');
            if (f[i][j] + k >= i + j - 1) mxd = max(mxd, i + j - 1);
        }
    }
    if (mxd == n * 2 - 1) {
        for (int i = 1; i < 2 * n; ++i) {
            printf("a");
        }
        printf("\n");
    }
    else if (!mxd) {
        dp(1, 1);
        int px = 1, py = 1;
        while (px != n || py != n) {
            printf("%c", a[px][py]);
            bool flag = ne[px][py];
            px = flag ? px : px + 1, py = flag ? py + 1 : py;
        }
        printf("%c\n", a[n][n]);
    }
    else {
        int px = 0, py = 0;
        for (int i = 1; i <= n; ++i) {
            int j = mxd + 1 - i;
            if (f[i][j] + k == i + j - 1) {
                dp(i, j);
                bool flag = ne[i][j];
                int npx = flag ? i : i + 1, npy = flag ? j + 1 : j;
                if (!px || le(npx, npy, px, py)) px = npx, py = npy;
            }
        }
        for (int i = 0; i < mxd; ++i) printf("a");
        while (px != n || py != n) {
            printf("%c", a[px][py]);
            bool flag = ne[px][py];
            px = flag ? px : px + 1, py = flag ? py + 1 : py;
        }
        printf("%c\n", a[n][n]);
    }
    return 0;
}
```

## **E. 饼干**

```python
n, m = map(int, input().split())
print(n // m)
```

## F. 方差

水题++

```cpp
#include <iostream>

using namespace std;

const int N = 100010;
long long a[N];

int main() {
    int n;
    long long ave = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
        ave += a[i];
    }
    ave /= n;
    long long res = 0;
    for (int i = 1; i <= n; ++i) {
        res += (a[i] - ave) * (a[i] - ave);
    }
    printf("%lld\n", res / n);
    return 0;
}
```

## G. 正方形划分

二维的有点乱，思路比较好猜，但是不好操作。

* 对于**操作 0**， 可以用一种**类似二分的思路**（但是在二维空间应该叫四分\[?\]）分别给行号和列号一个左右端点，不断求中间的点，输出目标点相对中间点位置对应的字母，然后缩小区间直到左右端点重叠，循环结束。
    
* 对于**操作 1**，和之前类似，这次是**通过给出的序列确定相对位置**，缩小区间，相当于是反着来的。
    

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int op;
        cin >> op;
        if (!op) {
            int n, x, y;
            cin >> n >> x >> y;
            int lx = 1, ly = 1, rx = 1 << n, ry = 1 << n;
            while (lx != rx || ly != ry) {
                int mid_x = lx + rx >> 1, mid_y = ly + ry >> 1;
                if (x <= mid_x && y <= mid_y) {
                    cout << 'A';
                    rx = mid_x, ry = mid_y;
                }
                else if (x <= mid_x && y > mid_y) {
                    cout << 'B';
                    rx = mid_x, ly = mid_y + 1;
                }
                else if (x > mid_x && y <= mid_y) {
                    cout << 'C';
                    lx = mid_x + 1, ry = mid_y;
                }
                else {
                    cout << 'D';
                    lx = mid_x + 1, ly = mid_y + 1;
                }
            }
            cout << endl;
        }
        else {
            string s;
            cin >> s;
            int n = s.length();
            int lx = 1, ly = 1, rx = 1 << n, ry = 1 << n;
            for (int i = 0; i < n; ++i) {
                if (s[i] == 'A') {
                    rx = lx + rx >> 1;
                    ry = ly + ry >> 1;
                }
                else if (s[i] == 'B') {
                    rx = lx + rx >> 1;
                    ly = (ly + ry >> 1) + 1;
                }
                else if (s[i] == 'C') {
                    lx = (lx + rx >> 1) + 1;
                    ry = ly + ry >> 1;
                }
                else {
                    lx = (lx + rx >> 1) + 1;
                    ly = (ly + ry >> 1) + 1;
                }
            }
            if (lx == rx && ly == ry) cout << n << ' ' << lx << ' ' << ly << endl;
            else return 123;
        }
    }
    return 0;
}
```