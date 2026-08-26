---
title: 2025牛客暑期多校训练营8
---
# 2025牛客暑期多校训练营8

大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 4 |
| 赛后补 | 2 |

排名是 412，非常惨……赛时规划的不太好

## A. Insert One <sup style="color: blue">队友</sup>

签到题

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        string s;
        cin >> s;
        if (s[0] == '-') {
            s = s.substr(1);
            string res = min('1' + s, s + '1');
            for (int i = 1; i < s.length(); ++i) {
                res = min(res, s.substr(0, i) + '1' + s.substr(i));
            }
            cout << '-' << res << endl;
        }
        else {
            string res = max('1' + s, s + '1');
            for (int i = 1; i < s.length(); ++i) {
                res = max(res, s.substr(0, i) + '1' + s.substr(i));
            }
            cout << res << endl; 
        }
    }
    return 0;
}
```

## B. Inversion Number Parity <sup style="color: blue">队友</sup>

仍然是一道水题，难度甚至在随机数据生成器不抄错……

```cpp
#include <iostream>

using namespace std;
typedef long long LL;
const int U = (1 << 30) - 1;
LL f1, f2, f3, f4, g, h;

LL get() {
    g = f1 ^ ((1LL << 16) * f1 & U);
    h = g ^ (g / (1 << 5));
    f4 = h ^ (h * 2 & U) ^ f2 ^ f3;
    f1 = f2, f2 = f3, f3 = f4;
    return f4;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, A, B, C, f = 0;
        scanf("%d%d%d%d", &n, &A, &B, &C);
        f1 = A & U, f2 = B & U, f3 = C & U;
        for (int i = 0; i < n; ++i) {
            if (get() % (n - i)) f ^= 1;
        }
        printf("%d", f);
        for (int i = 1; i < n; ++i) {
            int l = get() % n, r = get() % n, d = get() % n + 1;
            if ((abs(r - l) & 1) && (d & 1)) f ^= 1;
            printf("%d", f);
        }
        printf("\n");
    }
    return 0;
}
```

## C. Bernoulli's Principle	<sup style="color: blue">队友</sup>

签到题。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 100010;
pair<LL, int> a[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, H;
        scanf("%d%d", &n, &H);
        for (int i = 1; i <= n; ++i) {
            scanf("%lld", &a[i].first);
            a[i].first *= H - a[i].first;
            a[i].second = i;
        }
        sort(a + 1, a + n + 1);
        for (int i = 1; i <= n; ++i) printf("%d ", a[i].second);
        printf("\n");
    }
    return 0;
}
```

## F. Broken LED Lights <sup style="color: red">补</sup>

二分卡过去的代码，当时场上我写了一半被 G 题打断了（后来 G 题稳稳的过了），暴力未遂……结束之后饭都没想着吃打了一个二分，两发就过了。

```cpp
#include <iostream>
#include <vector>

using namespace std;
vector<int> msk[3][22];
/*
  --0--
 |     |
 5     1
 |     |
  --6--
 |     |
 4     2
 |     |
  --3--
*/
int s[] = {
    0b0111111, // 0: 段 0 1 2 3 4 5 （不亮 6）
    0b0000110, // 1: 段 1 2
    0b1011011, // 2: 段 0 1 6 4 3
    0b1001111, // 3: 段 0 1 6 2 3
    0b1100110, // 4: 段 5 6 1 2
    0b1101101, // 5: 段 0 5 6 2 3
    0b1111101, // 6: 段 0 5 4 3 2 6
    0b0000111, // 7: 段 0 1 2
    0b1111111, // 8: 全亮
    0b1101111  // 9: 段 0 1 2 3 5 6
};
bool f[1 << 21];
int a[110];
int n, m;

int transfer(int x, int m) {
    if (m == 1) return s[x];
    else if (m == 2) return s[x / 10] << 7 | s[x % 10];
    else return (s[x / 100] << 14) | (s[x / 10 % 10] << 7) | s[x % 10];
}

bool check(int mid) {
    for (int mask : msk[m - 1][mid]) {
        bool valid = true;
        for (int i = 1; i <= n; ++i) {
            int ss = transfer(a[i], m) & mask;
            if (f[ss]) {
                valid = false;
                for (int j = 1; j < i; ++j) {
                    int ss = transfer(a[j], m) & mask;
                    f[ss] = false;
                }
                break;
            }
            f[ss] = true;
        }
        if (valid) {
            for (int i = 1; i <= n; ++i) {
                int ss = transfer(a[i], m) & mask;
                f[ss] = false;
            }
            return true;
        }
    }
    return false;
}

void init() {
    for (int k = 0; k < 3; ++k) {
        int l = (k + 1) * 7;
        for (int i = 0; i < (1 << l); ++i) {
            int t = 0;
            for (int j = 0; j < l; ++j) t += i >> j & 1;
            msk[k][t].emplace_back(i);
        }
    }
}

int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        int l = 0, r = m * 7;
        while (l < r) {
            int mid = l + r >> 1;
            if (check(mid)) r = mid;
            else l = mid + 1;
        }
        printf("%d\n", l);
    }
    return 0;
}
```

## G. Changing Minimum Spanning Tree <sup style="color: blue">队友</sup>

考虑 Kruskal 建边的过程，在每次加完全部同一个权值的所有边后在不同连通块加权值介于这个权值和下一个权值之间 (左闭右开) 的边一定会被选入最小生成树。实际统计的时候很恶心，需要考虑不能和他原有的边建重了，最终我们选择了先把重的都算上，跑 Kruskal 的时候存下来 Kruskal 重构树，之后枚举每一条边，在 Kruskal 重构树上找这两个点之间最大边权的最小值，减掉被多加的次数。

前两天调的心态崩了，今天 (2025-08-15) 又回来补了，之前 WA 的原因其实不是 Kruskal 重构树挂了，是因为这一行

```cpp
else if (t == 2) printf("%lld\n", (LL)siz[1] * (n - siz[1]) * k % MOD);
```

`1` 应该是 `getfa(1)`，死都没想到是这儿有问题，好不容易重构了一版，然后原来的代码一改就过了😞。

重构的时候第一版代码用了 vector，然后被 n = 1 的数据卡了个越界访问……

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 100010, M = 200010;
const int MOD = 1000000007;
const int inv2 = 500000004;

struct Edge {
    int x, y, w;
} ed[M];

int head[N * 2], ne[N * 2], ver[N * 2], tot;
int fa[N * 2], siz[N * 2], val[N * 2], f[N * 2][20], dep[N * 2], cnt;
LL s = 0;

void add(int x, int y) {
    ver[++tot] = y;
    ne[tot] = head[x];
    head[x] = tot;
}

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

void dfs(int x) {
    for (int i = 1; i < 20; ++i) f[x][i] = f[f[x][i - 1]][i - 1];
    for (int i = head[x]; i; i = ne[i]) {
        int y = ver[i];
        if (y == f[x][0]) continue;
        f[y][0] = x;
        dep[y] = dep[x] + 1;
        dfs(y);
    }
}

int lca(int x, int y) {
    if (dep[x] < dep[y]) swap(x, y);
    for (int i = 19; i >= 0; --i) {
        if (dep[f[x][i]] >= dep[y]) x = f[x][i];
    }
    if (x == y) return x;
    for (int i = 19; i >= 0; --i) {
        if (f[x][i] != f[y][i]) x = f[x][i], y = f[y][i];
    }
    return f[x][0];
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m, k;
        scanf("%d%d%d", &n, &m, &k);
        s = (LL)n * (n - 1) / 2;
        for (int i = 1; i <= n; ++i) {
            fa[i] = i, siz[i] = 1;
        }
        for (int i = 1; i <= m; ++i) {
            scanf("%d%d%d", &ed[i].x, &ed[i].y, &ed[i].w);
            int x = getfa(ed[i].x), y = getfa(ed[i].y);
            if (x != y) {
                siz[x] += siz[y];
                fa[y] = x;
            }
        }
        int t = 0;
        for (int i = 1; i <= n; ++i) t += fa[i] == i;
        if (t > 2) printf("0\n");
        else if (t == 2) printf("%lld\n", (LL)siz[getfa(1)] * (n - siz[getfa(1)]) * k % MOD);
        else {
            fill(head, head + n * 2 + 1, 0);
            tot = 0;
            for (int i = 1; i <= n; ++i) {
                fa[i] = i, siz[i] = 1;
                fa[i + n] = i + n, siz[i + n] = 0;
            }
            sort(ed + 1, ed + m + 1, [](Edge a, Edge b) {
                return a.w < b.w;
            });
            s = (LL)n * (n - 1) % MOD * inv2 % MOD;
            LL res = s * (ed[1].w - 1) % MOD;
            cnt = n;
            for (int i = 1, j; i <= m; i = j) {
                for (j = i; j <= m && ed[j].w == ed[i].w; ++j) {
                    int x = getfa(ed[j].x), y = getfa(ed[j].y);
                    if (x != y) {
                        cnt++;
                        siz[cnt] = siz[x] + siz[y];
                        fa[x] = fa[y] = cnt;
                        fa[cnt] = cnt;
                        val[cnt] = ed[j].w;
                        add(cnt, x), add(cnt, y);
                        s = ((s + (LL)siz[x] * (siz[x] - 1) % MOD * inv2 % MOD + (LL)siz[y] * (siz[y] - 1) % MOD * inv2 % MOD - (LL)siz[cnt] * (siz[cnt] - 1) % MOD * inv2 % MOD) % MOD + MOD) % MOD;
                    }
                }
                res = (res + s * (ed[j].w - ed[i].w) % MOD) % MOD;
            }
            f[cnt][0] = 0;
            dep[cnt] = 1;
            dfs(cnt);
            for (int i = 1; i <= m; ++i) {
                res -= val[lca(ed[i].x, ed[i].y)] - 1;
            }
            res = (res % MOD + MOD) % MOD;
            printf("%lld\n", res);
        }
    }
    return 0;
}
```

## J. Multiplication in Base the Square Root of -2 <sup style="color: red">补</sup>

~~待我学一下 FFT……然后怒切板子题~~

学成归来了，真就是一道特别纯的板子题，进位逻辑比较简单，很容易想清。

吃了一发 WA，因为 t 数组用了 n 而不是 m😅。

```cpp
#include <iostream>
#include <cmath>
#include <cstring>

using namespace std;

const int N = 300000;
const double PI = acos(-1);

struct Complex {
    double x, y;

    Complex operator +(const Complex &t) const {
        return {x + t.x, y + t.y};
    }

    Complex operator -(const Complex &t) const {
        return {x - t.x, y - t.y};
    }

    Complex operator *(const Complex &t) const {
        return {x * t.x - y * t.y, x * t.y + y * t.x};
    }
} a[N], b[N];
char s[N], t[N];
int rev[N], bit, tot;
int res[N * 2];

void fft(Complex a[], int inv) {
    for (int i = 0; i < tot; ++i) {
        if (i < rev[i]) swap(a[i], a[rev[i]]);
    }
    for (int mid = 1; mid < tot; mid <<= 1) {
        Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
        for (int i = 0; i < tot; i += mid * 2) {
            Complex wk = {1, 0};
            for (int j = 0; j < mid; ++j, wk = wk * w1) {
                Complex x = a[i + j], y = wk * a[i + j + mid];
                a[i + j] = x + y, a[i + j + mid] = x - y;
            }
        }
    }
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        scanf("%s%s", s, t);
        int n = strlen(s) - 1, m = strlen(t) - 1;
        for (int i = 0; i <= n; ++i) a[i] = {double(s[n - i] == '1'), 0};
        for (int i = 0; i <= m; ++i) b[i] = {double(t[m - i] == '1'), 0};
        bit = 0;
        while ((1 << bit) < n + m + 1) bit++;
        tot = 1 << bit;
        for (int i = n + 1; i < tot; ++i) a[i] = {0, 0};
        for (int i = m + 1; i < tot; ++i) b[i] = {0, 0};
        for (int i = 0; i < tot; ++i) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
        fft(a, 1), fft(b, 1);
        for (int i = 0; i < tot; ++i) a[i] = a[i] * b[i];
        fft(a, -1);
        int len = 0;
        for (int i = 0; i <= n + m; ++i) res[i] = int(a[i].x / tot + 0.5);
        for (len = 0; len <= n + m || res[len] || res[len + 1]; len++) {
            if (res[len] > 1) res[len + 2] -= res[len] / 2, res[len] %= 2;
            else if (res[len] < 0) res[len + 2] -= (res[len] - 1) / 2, res[len] = (res[len] % 2 + 2) % 2;
        }
        while (len > 1 && res[len - 1] == 0) len--;
        for (int i = len - 1; i >= 0; --i) putchar(res[i] + 48);
        putchar('\n');
        fill(res, res + len, 0);
    }
    return 0;
}
```