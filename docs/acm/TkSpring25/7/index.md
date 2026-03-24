---
title: 2025春训第七场
---
# 2025春训第七场

这训练赛怎么越来越水了，C 考场上没做出来，D 调了很久，但是实际上都不怎么算难，剩下的四道就是纯粹的大水题了。

## A. 抽牌

我代码写的比较麻烦，实际上没必要。

* 答案为 0：已经满足其中一个条件了；
    
* 答案为 1：花色相同的牌中，有两个相同或者差 1 或 2；
    
* 答案为 2：以上都不满足。
    

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> t[128];

int main() {
    for (int i = 0; i < 3; ++i) {
        char c;
        int tmp;
        cin >> tmp >> c;
        t[c].push_back(tmp);
    }
    int res = 3;
    for (int i = 0; i < 128; ++i) {
        if (!t[i].empty()) {
            sort(t[i].begin(), t[i].end());
            if (t[i].size() == 1) res = min(res, 2);
            else if (t[i].size() == 2) {
                if (t[i][1] - t[i][0] == 2 || t[i][1] - t[i][0] == 1) res = min(res, 1);
                else res = min(res, 2);
                if (t[i][0] == t[i][1]) res = min(res, 1);
            }
            else if (t[i].size() == 3) {
                if (t[i][0] + 1 == t[i][1] && t[i][1] + 1 == t[i][2]) {
                    res = 0;
                    break;
                }
                else if (t[i][0] == t[i][1] && t[i][1] == t[i][2]) {
                    res = 0;
                    break;
                }
                else if (t[i][0] == t[i][1] || t[i][1] == t[i][2]) {
                    res = min(res, 1);
                }
                else if (t[i][1] - t[i][0] == 2 || t[i][1] - t[i][0] == 1 || t[i][2] - t[i][1] == 2 || t[i][2] - t[i][1] == 1) {
                    res = min(res, 1);
                }
            }
        }
    }
    printf("%d\n", res);
    return 0;
}
```

## B. 区间求和

直接前缀和 + map/二分 就行。

* ps：别学我把 int 爆了。
    

```cpp
#include <iostream>
#include <vector>
#include <map>
#define int long long

using namespace std;

map<long long, int> mp;

signed main() {
    long long res = 0;
    int n, m;
    scanf("%lld%lld", &n, &m);
    vector<long long> s(n + 1, 0);
    mp[0] = 1;
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &s[i]);
        s[i] += s[i - 1];
        res += mp[s[i] - m];
        mp[s[i]] ++;
    }
    printf("%lld\n", res);
    return 0;
}
```

## C. **鲁的要塞**

对于一组要塞，他们的的指挥中心的横(纵)坐标必然是他们横(纵)坐标的中位数，个数为偶数的情况任取中间的两个点都是可以的，所以中心的坐标一定在已有的数值中选；暴力枚举已经给出的点横纵坐标自由组合，对每个点分别求距离，排序前缀和更新答案即可。

* ps：别学我把 int 爆了。
    

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#define int long long

using namespace std;

int p[110][2];
int a[110], b[110];

signed main() {
    int n, k;
    scanf("%lld%lld", &n, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld%lld", &p[i][0], &p[i][1]);
    }
    memset(a, 0x3f, sizeof(a));
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            for (int k = 1; k <= n; ++k) {
                b[k] = abs(p[i][0] - p[k][0]) + abs(p[j][1] - p[k][1]);
            }
            sort(b + 1, b + n + 1);
            for (int k = 1; k <= n; ++k) {
                b[k] += b[k - 1];
                a[k] = min(a[k], b[k]);
            }        
        }
    }
    for (int i = 1; i <= k; ++i) printf("%lld\n", a[i]);
    return 0;
}
```

## **D. 能源晶体**

这是一道 dp 题。

* **关键性质：**题目中的方案数等价于用总长为 n 的长度为 \[1, k\] 的单调不减的线段右端点对齐覆盖 \[1, k\] 这个区间的方案数。这么做解除了 k 个位置的限制，并且仍然保持了 k 元组的有序性（这里的线段长包括端点，长度为 l，表示最后 l 个数都 +1）
    
* **定义状态：**$f_{i, j}$，表示目前用了 i 个模块，最后一条线段长度为 j 的方案数，答案显然是 $f_{n, k}$.
    
* **状态转移：**$f_{i, j} = \sum_{l = 1}^{j}{f_{i - l, l}}$，求和可以在 dp 的过程中用前缀和优化，时间复杂度降到 $O(nk)$.
    

```cpp
#include <iostream>

using namespace std;

const int MOD = 998244353;

int f[5010][5010];
int n, k;

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= k; ++i) f[0][i] = 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= k; ++j) {
            if (j <= i) f[i][j] = (f[i][j - 1] + f[i - j][j]) % MOD;
            else f[i][j] = f[i][j - 1];
        }
    }
    cout << ((f[n][k] - f[n][k - 1]) % MOD + MOD) % MOD << endl;
    return 0;
}
```

## E. 资料页数

鉴定为水题，把脚注的行数捆绑到行里面暴力模拟即可。

```cpp
#include <iostream>
#include <vector>
#include <set>

using namespace std;

const int N = 200010;
vector<int> ed[N];
int f[N];
int n, m, k;

bool dp(int x, int fa) {
    f[x] = 1;
    int t = 0;
    for (int y : ed[x]) {
        if (y == fa) continue;
        if (!dp(y, x)) return false;
        if (f[y]) t++;
        f[x] += f[y];
    }
    if (t > 2) return false;
    else if (t == 2) {
        if (f[x] != k) return false;
        else f[x] = 0;
    }
    else {
        f[x] %= k;
    }
    return true;
}

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 1; i < n * k; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].push_back(y);
        ed[y].push_back(x);
    }
    if (dp(1, 1)) cout << "Yes" << endl;
    else cout << "No" << endl;
    return 0;
}
```

## F. **再破难关**

代码量略大的水题，把状态压成 16 位二进制数，状态个数一共只有 $2^{16}$个，直接 bfs 即可。

```cpp
#include <iostream>
#include <queue>
#include <cstring>

using namespace std;

queue<int> q;

int s = 0, t = 0;
int f[100000];
int g[4][4];

void to_g(int mask) {
    for (int i = 0; i < 16; ++i) {
        g[i / 4][i % 4] = mask >> i & 1;
    }
}

int to_s() {
    int res = 0;
    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4; ++j) {
            res |= g[i][j] << (i * 4 + j);
        }
    }
    return res;
}

int main() {
    memset(f, -1, sizeof(f));
    int s, t;
    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4; ++j) {
            scanf("%1d", &g[i][j]);
        }
    }
    s = to_s();

    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4; ++j) {
            scanf("%1d", &g[i][j]);
        }
    }
    t = to_s();
    
    f[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        if (x == t) {
            printf("%d\n", f[x]);
            return 0;
        }
        to_g(x);
        for (int i = 0; i < 4; ++i) {
            for (int j = 0; j < 4; ++j) {
                if (i < 3 && g[i][j] != g[i + 1][j]) {
                    swap(g[i][j], g[i + 1][j]);
                    int y = to_s();
                    if (!(~f[y])) {
                        f[y] = f[x] + 1;
                        q.push(y);
                    }
                    swap(g[i][j], g[i + 1][j]);
                }
                if (j < 3 && g[i][j] != g[i][j + 1]) {
                    swap(g[i][j], g[i][j + 1]);
                    int y = to_s();
                    if (!(~f[y])) {
                        f[y] = f[x] + 1;
                        q.push(y);
                    }
                    swap(g[i][j], g[i][j + 1]);
                }
            }
        }
    }
    return 0;
}
```