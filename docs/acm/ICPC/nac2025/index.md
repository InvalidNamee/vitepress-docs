---
title: 【NAC2025】2025 拼题A XCPC 系统测试赛
---
这场相当于 vp 了一下 NAC2025，最大的感受就是看英文体面太折磨了，看不懂不致命，理解错了自以为看懂了最致命。

结束之后 OMS 客户端直接自己退了代码看不到了，之前做过的题的代码也是根据记忆重写的，下面的题是按照难度顺序排列的。

## K. SLA Tomography

这道题题目特别难读，里面一大堆的专业的词汇，读了好半天理解了之后发现就是一个简单的贪心，对每个单调不增的子段新开辟一块宽度为 当前子段最大值 - 上一个子段最小值 + 1 的空间存多出来的，直接就秒了。

```cpp
#include <iostream>

using namespace std;
typedef long long LL;

int main() {
    int n;
    scanf("%d", &n);
    LL cur, pre = 0, res = 1;
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &cur);
        if (cur > pre) res += cur - pre + 1;
        pre = cur;
    }
    printf("%lld\n", res);
    return 0;
}
```

## H. Ornaments on a Tree

按我的理解，这是一道略简单一点的树形 dp，洛谷上题解说是贪心，但是说的其实是一个意思。当时我翻译的这道题，然后想出来思路之后讲了一下，没问题就去写了，期间想错，改状态转移方程少改一个 WA 一发。

我维护了一个 f<sub>i</sub> 表示当前点的固定答案，当前点可以随意填时当前填 0，否则当前填固定值；r<sub>i</sub> 表示孩子都尽可能往大了填时当前点自己最大还能填到多少，如果是固定值那么 r = 0。

状态转移也简单，让孩子都贪心的填最大，特判溢出的情况，如果没有调整空间就输出 -1， 如果还有就调到能填的最大值。

```cpp
#include <iostream>
#include <vector>
using namespace std;
const int N = 200010;
typedef long long LL;
vector<int> ed[N];
LL a[N], f[N], r[N];
int n, k;

bool dp(int x, int fa) {
    LL ls = 0, rs = 0;
    for (int y : ed[x]) {
        if (y == fa) continue;
        if (!dp(y, x)) return false;
        ls += a[y] == -1 ? 0 : a[y];
        rs += r[y];
        f[x] += f[y];
    }
    if (ls + a[x] > k) return false;
    if (a[x] != -1) f[x] += min(a[x] + rs, k - ls); // 第一发的这里的 k 没有减 ls
    else if (rs >= k - ls) f[x] += k - ls, r[x] = 0;
    else f[x] += rs, r[x] = k - ls - rs;
    return true;
}

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i) {
        scanf("%lld", &a[i]);
    }
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].emplace_back(y);
        ed[y].emplace_back(x);
    }
    if (!dp(1, 0)) printf("-1\n");
    else printf("%lld\n", f[1] + r[1]);
    return 0;
}
```

## B. Circle of Leaf <sup style="color: blue">队友</sup>

他们在研究 A 的时候我往后读题，发现这个似乎可做，队友先研究明白了，思路刚开始就是对的，而且很完整，低级错误 WA 三发。

后来还发生了

<table>
  <tr><td>下午</td><td>我 : “你怎么不取模”</td></tr>
  <tr><td>晚上</td><td>洛谷 : “Wrong Answer.wrong answer On line 1 column 1, read -, expected 3.”</td></tr>
</table>

现在唯一的心理安慰是：我至少没把模数抄错。

f<sub>i, 0</sub> 表示当前连通块到根节点除了 leaf path 还有连边的方案数，f<sub>i, 1</sub> 表示当前连通块只能通过通过 leaf path 连接根节点的方案数。

枚举删 leaf path 还是指向父亲的边进行状态转移。

```cpp
#include <iostream>
#include <vector>

using namespace std;

typedef long long LL;
const int N = 200010;
const int MOD = 998244353;
vector<int> ed[N];
LL f[N][2]; // 0：没有额外的边 1：有额外的边

void dp(int x) {
    f[x][0] = f[x][1] = 1;
    vector<LL> s1, suf, s0;
    for (int y : ed[x]) {
        dp(y);
        s1.emplace_back(f[y][1]);
        s0.emplace_back((f[y][0] + f[y][1]) % MOD);
        f[x][0] = (f[x][0] * ((f[y][0] + f[y][1]) % MOD)) % MOD;
    }
    if (s0.empty()) return;
    suf = s0;
    suf.emplace_back(1LL);
    for (int i = suf.size() - 2; i >= 0; --i) {
        suf[i] = (suf[i] * suf[i + 1]) % MOD;
    }
    f[x][1] = 0;
    LL pre = 1;
    for (int i = 0; i < s0.size(); ++i) {
        f[x][1] = (f[x][1] + (pre * s1[i] % MOD * suf[i + 1] % MOD)) %MOD;
        pre = (pre * s0[i]) % MOD;
    }
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i < n; ++i) {
        int x, y;
        scanf("%d%d", &x, &y);
        ed[x].emplace_back(y);
    }
    dp(1);
    printf("%lld\n", f[1][0]);
    return 0;
}
```

## L. Solar Farm <sup style="color: red">补</sup>

这道题通过率低的可怜,当时我们都感觉在正方形周围暴力一个小区间能过……然而没有，WA 了好几发，后来调大了一下区间长度，然后就莫名其妙的过了。

```cpp
#include <iostream>
#include <cmath>

using namespace std;
typedef long long LL;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        LL r, w, h;
        scanf("%lld%lld%lld", &r, &w, &h);
        if (w < h) swap(w, h);
        LL res = 0;
        LL w_cnt = ((long double)r * sqrtl(2) / w);
        for (LL i = max(1LL, w_cnt - 1000); i <= w_cnt + 1000; ++i) {
            if ((__int128_t)i * w * i * w + h * h > (__int128_t)r * r * 4) break;
            LL j = floorl(sqrtl(r * r * 4 - i * i * w * w) / h);
            if ((__int128_t)i * i * w * w + (__int128_t)j * j * h * h > (__int128_t)r * r * 4) j--;
            res = max(res, i * j);
        }
        printf("%lld\n", res);
    }
    return 0;
}
```
## D. Geometry Rush <sup style="color: red">补</sup>

这道很可惜，难度还行，属于是相见恨晚了，最后四十分钟发现他的时候已经来不及了，当时情急之下想麻烦了，又写线段交又写特判的，最后挂了没调出来。

实际上甚至线段交都不用写，遍历每个小于 w 的 i，求一下两条折线中间夹的两个整数边界，然后和上一次维护的边界取 max 和 min 更新。测试表明数据没有专门卡这种一个竖线分多段的情况，如果处理不当也会挂掉（比如我洛谷上过了，然后被自己卡掉了）。

```
6 4 5 5
0 5
1 5
2 0
2 2
2 3
5 5
0 -5
0 -1
5 -1
0 -5
```

其他小细节也容易挂，比如一定要找最后一条终点在 i 的线段，判断奇偶性是否合法……

```cpp
#include <iostream>
#define x first
#define y second
using namespace std;
typedef long long LL;
typedef pair<LL, LL> PLL;
const int N = 100010;

PLL a[N], b[N]; // 上下边界

PLL operator -(PLL a, PLL b) {
    return {a.x - b.x, a.y - b.y};
}

LL operator *(PLL a, PLL b) {
    return a.x * b.y - a.y * b.x;
}

int area(PLL a, PLL b, PLL c) {
    LL prod = (b - a) * (c - a);
    if (prod == 0) return 0;
    else if (prod < 0) return -1;
    else return 1;
}

int main() {
    int n, m, l1 = 0, l2 = 0;
    LL w, h;
    scanf("%d%d%lld%lld", &n, &m, &w, &h);
    for (int i = 1; i <= n; ++i) {
        PLL p;
        scanf("%lld%lld", &p.x, &p.y);
        if (l1 >= 2 && p.x == a[l1].x && p.x == a[l1 - 1].x) a[l1] = p; // 竖线只留两端
        else a[++l1] = p;
    }
    for (int i = 1; i <= m; ++i) {
        PLL p;
        scanf("%lld%lld", &p.x, &p.y);
        if (l2 >= 2 && p.x == b[l2].x && p.x == b[l2 - 1].x) b[l2] = p;
        else b[++l2] = p;
    }
    LL lt = 0, rt = 0;
    for (int i = 1, j = 1, k = 1; i <= w; ++i) {
        while (j < l1 - 1 && a[j + 1].x < i) j++;
        while (j < l1 - 1 && a[j + 2].x == i) j++;
        while (k < l2 - 1 && b[k + 1].x < i) k++;
        while (k < l2 - 1 && b[k + 2].x == i) k++;
        LL L, R, l, r;
        if (a[j].x == a[j + 1].x) R = min(a[j].y, a[j + 1].y) - 1; // 特判共线
        else {
            l = -h, r = h;
            while (l < r) {
                LL mid = l + r + 1 >> 1;
                if (area(a[j], a[j + 1], {(LL)i, mid}) == -1) l = mid; // 上边界右侧
                else r = mid - 1;
            }
            R = l; 
        }
        if (b[k].x == b[k + 1].x) L = max(b[k].y, b[k + 1].y) + 1;
        else {
            l = -h, r = h;
            while (l < r) {
                LL mid = l + r >> 1;
                if (area(b[k], b[k + 1], {(LL)i, mid}) == 1) r = mid; // 下边界左侧
                else l = mid + 1;
            }
            L = l;
        }
        if (i & 1) { // 奇偶性
            if (!(L & 1)) L++;
            if (!(R & 1)) R--;
        }
        else {
            if (L & 1) L++;
            if (R & 1) R--;
        }
        lt = max(lt - 1, L);
        rt = min(rt + 1, R);
        if (lt > rt) {
            printf("impossible\n");
            return 0;
        }
    }
    printf("%lld %lld\n", lt, rt);
    return 0;
}
```

还差个 A 题数学题🤯