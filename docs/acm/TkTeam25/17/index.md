---
title: 2025组队训练赛第 17 场
---
# 2025组队训练赛第 17 场

最红温的一天。

## C. Insertion Sort

<span style="font-size: 30px; color: red; font-weight: Bold;">特判 k >= n！特判 k >= n！特判 k >= n！</span>

被 k > n 搞了，我们本以为他不会 > n 的，也没往那里想，真没想到是因为这里。

剩下的一共有三种情况

- 前 k 个数正好是 $1 \dots k$，那么后面的数（假设有 m 个）需要满足最长上升子序列长度不小于 m - 1，答案是 $k! \cdot ((n - k - 1)^2 + 1)$；
- 在第一种情况的基础上，把 k + 1 换到前面，那么后面的大数需要严格有序，**换下的前面的数可以随意插空**，答案是 $k! \cdot (n - k)$；
- 在第一种情况的基础上，把一个比 k + 1 更大的数换到前面，那么这个大数不能是最长上升子序列的元素，**必须保证后面的严格有序**，答案是 $k! \cdot (n - k - 1)$

求和就是最终答案。

```cpp
#include <iostream>
  
using namespace std;
  
long long jc[60];
int n, k, q;
  
int main() {
    int T;
    scanf("%d", &T);
    for (int t = 1; t <= T; ++t) {
        scanf("%d%d%d", &n, &k, &q);
        jc[0] = 1;
        for (int i = 1; i <= k; ++i) {
            jc[i] = jc[i - 1] * i % q;
        }
        if (n <= k) {
            printf("Case #%d: %lld\n", t, jc[n]);
            continue;
        }
        else if (k == 1) {
            printf("Case #%d: %lld\n",t, 1LL * ((n - 1) * (n - 1) + 1) % q);
            continue;
        }
        printf("Case #%d: %lld\n", t, (((n - k - 1) * (n - k - 1) + 1) % q + 1LL * k * (n - k) % q + (n - k - 1) % q) % q * jc[k] % q);
    }
    return 0;
}

```

## G. Best ACMer Solves the Hardest Problem

当大模拟写就对了，$n^2 \sqrt{n}$ 能过，我不知道这道题为什么 WA 的这么多，我一次就过了，挺奇怪的。

代码复制粘贴冗余的非常严重，不建议这么做，因为虽然一时省事，万一挂了那就是另一个故事了。

```cpp
#include <iostream>
#include <cmath>
#include <cstring>

using namespace std;

const int N = 6010;

bool vis[N][N];
int val[N][N];
int dx[] = {1, -1, 1, -1}, dy[] = {1, 1, -1, -1};

int main() {
    int T;
    scanf("%d", &T);
    for (int t = 1; t <= T; ++t) {
        memset(vis, 0, sizeof(vis));
        printf("Case #%d:\n", t);
        int n, m;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            int x, y, z;
            scanf("%d%d%d", &x, &y, &z);
            vis[x][y] = true;
            val[x][y] = z;
        }
        long long lastans = 0;
        while (m--) {
            int op, x, y;
            scanf("%d%d%d", &op, &x, &y);
            x = (x + lastans) % 6000 + 1, y = (y + lastans) % 6000 + 1;
            if (op == 1) {
                int w;
                scanf("%d", &w);
                vis[x][y] = true;
                val[x][y] = w;
            }
            else if (op == 2) {
                vis[x][y] = false;
            }
            else if (op == 3) {
                int k, w;
                scanf("%d%d", &k, &w);
                int l = sqrt(k);
                for (int i = 0; i <= l; ++i) {
                    int j = sqrt(k - i * i);
                    if (i * i + j * j == k) {
                        if (i == 0 && j == 0) {
                            if (vis[x][y]) val[x][y] += w;
                        }
                        else if (i == 0) {
                            int tx = x, ty = y + j;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) val[tx][ty] += w;
                            }
                            tx = x, ty = y - j;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) val[tx][ty] += w;
                            }
                        }
                        else if (j == 0) {
                            int tx = x + i, ty = y;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) val[tx][ty] += w;
                            }
                            tx = x - i, ty = y;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) val[tx][ty] += w;
                            }
                        }
                        else
                            for (int d = 0; d < 4; ++d) {
                                int tx = x + i * dx[d], ty = y + j * dy[d];
                                if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                    if (vis[tx][ty]) val[tx][ty] += w;
                                }
                            }
                    }
                }
            }
            else {
                int k;
                scanf("%d", &k);
                int l = sqrt(k);
                long long res = 0;
                for (int i = 0; i <= l; ++i) {
                    int j = sqrt(k - i * i);
                    if (i * i + j * j == k) {
                        if (i == 0 && j == 0) {
                            if (vis[x][y]) res += val[x][y];
                        }
                        else if (i == 0) {
                            int tx = x, ty = y + j;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) res += val[tx][ty];
                            }
                            tx = x, ty = y - j;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) res += val[tx][ty];
                            }
                        }
                        else if (j == 0) {
                            int tx = x + i, ty = y;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) res += val[tx][ty];
                            }
                            tx = x - i, ty = y;
                            if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                if (vis[tx][ty]) res += val[tx][ty];
                            }
                        }
                        else
                            for (int d = 0; d < 4; ++d) {
                                int tx = x + i * dx[d], ty = y + j * dy[d];
                                if (tx > 0 && tx <= 6000 && ty > 0 && ty <= 6000) {
                                    if (vis[tx][ty]) res += val[tx][ty];
                                }
                            }
                    }
                }
                lastans = res;
                printf("%lld\n", res);
            }
        }
    }
    return 0;
}
```

## J. How Much Memory Your Code Is Using?

我又挂了一次签到题，原因是没想起来 long double 是 16 个字节。

| type | memory(Byte) |
| --- | --- |
| bool / char | 1 |
| int / float | 4 |
| double / long long | 8 |
| long double / __int128 | 16 |

```cpp
#include <iostream>
#include <sstream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    string row;
    int T, n;
    getline(cin, row);
    T = stoi(row);
    for (int t = 0; t < T; ++t) {
        getline(cin, row);
        n = stoi(row);
        int res = 0;
        for (int i = 0; i < n; ++i) {
            getline(cin, row);
            int e = 0, c = 1;
            stringstream ss(row);
            ss >> row;
            if (row == "bool" || row == "char") e = 1;
            else if (row == "int" || row == "float") e = 4;
            else if (row == "double") e = 8;
            else if (row == "long") {
                ss >> row;
                if (row == "long") e = 8;
                else e = 16;
            }
            else if (row == "__int128") e = 16;
            else {
                cout << row << endl;
                cout << "invalidqwq" << endl;
            }
            ss >> row;
            int l = 0, r = 0;
            for (int j = 0; j < row.length(); ++j) {
                if (row[j] == '[') l = j;
                if (row[j] == ']') r = j;
            }
            if (l && r) {
                c = stoi(row.substr(l + 1, r - l - 1));
            }
            res += e * c;
        }
        cout << "Case #" << t + 1 << ": " << (res + 1023) / 1024 << endl;
    }
    return 0;
}
```

## K. Let the Flames Begin<sup style="color: blue">欠</sup>

约瑟夫问题升级版，感觉能做。

## L. Machining Disc Rotors<sup style="color: red">补</sup>

这个当时急死我了，刚被 C 题卡了边界，又被这道题卡精度。

思路很简单

- 求出来所有交点；
- 检验是否有一条直径合法，根据旋转卡壳的结论，如果有合法的直径一定会有一个合法的并且一个一个端点是顶点的直径，枚举端点验证对称的一端有没有被切掉，如果有合法的直径直接输出；
- 没有合法的直径，还是根据旋转卡壳的结论，一定在端点能取到最大值，就 n<sup>2</sup> 枚举所有的端点，算距离即可。

但是，但是我被他卡精度卡疯了，算上赛时交的，一共错了 19 发，求极角的做法容易被卡，后续在 liuxx 佬的建议下绕过余弦定理算长度，全程不和反三角函数扯上关系，改完之后一次过了。

```cpp
#include <iostream>
#include <cmath>
#define x first
#define y second
using namespace std;
typedef long double LD;
typedef long long LL;
typedef pair<LD, LD> PDD;
const LD eps = 1e-12;
const LD PI = acos(-1);
const int N = 110;

int dcmp(LD a, LD b) {
    if (fabs(a - b) < eps) return 0;
    else if (a < b) return -1;
    else return 1;
}

int sign(LD a) {
    if (fabs(a) < eps) return 0;
    else if (a < 0) return -1;
    else return 1;
}

PDD operator +(PDD a, PDD b) {
    return {a.x + b.x, a.y + b.y};
}

PDD operator -(PDD a, PDD b) {
    return {a.x - b.x, a.y - b.y};
}

PDD operator *(PDD a, LD t) {
    return {a.x * t, a.y * t};
}

PDD operator /(PDD a, LD t) {
    return {a.x / t, a.y / t};
}

LD operator *(PDD a, PDD b) {
    return a.x * b.y - a.y * b.x;
}

PDD rotate(PDD a, LD t) {
    return {a.x * cos(t) - a.y * sin(t), a.x * sin(t) + a.y * cos(t)};
}

LD getlen(PDD a) {
    return sqrt(a.x * a.x + a.y * a.y);
}

PDD normal(PDD a) {
    return a / getlen(a);
}

LD area(PDD a, PDD b, PDD c) {
    return (b - a) * (c - a);
}

PDD a[N][2];

void solve() {
    int n, R, l = 0;
    scanf("%d%d", &n, &R);
    for (int i = 1; i <= n; ++i) {
        int px, py, r;
        scanf("%d%d%d", &px, &py, &r);
        if ((LL)px * px + (LL)py * py < (LL)(r + R) * (r + R) && (LL)px * px + (LL)py * py > (LL)(r - R) * (r - R)) {
            // (R^2 + d^2 - r^2) / 2d = a
            PDD v = {px, py};
            LD d = getlen(v), b = (powl(R, 2) + powl(d, 2) - powl(r, 2)) / (d * 2), c = sqrt(powl(R, 2) - pow(b, 2));
            // cout << b << ' ' << c << endl;
            v = v / d;
            l++;
            a[l][0] = v * b + rotate(v, -PI / 2) * c;
            a[l][1] = v * b + rotate(v, PI / 2) * c;
            // printf("(%Lf, %Lf) (%Lf, %Lf)\n", a[l][0].x, a[l][0].y, a[l][1].x, a[l][1].y);
        }
    }
    if (l == 0) {
        printf("%d.000000\n", R * 2);
        return;
    }
    for (int i = 1; i <= l; ++i) {
        for (int tt = 0; tt < 2; ++tt) {
            auto t = a[i][tt] * -1;
            bool f = true;
            for (int j = 1; j <= l; ++j) {
                if (sign(area(a[j][0], a[j][1], t)) == -1) {
                    f = false;
                    break;
                }
            }
            if (f) {
                printf("%d.000000\n", R * 2);
                return;
            }
        }
    }
    LD res = 0.0;
    for (int i = 1; i <= l; ++i) {
        for (int j = i; j <= l; ++j) {
            for (int k = 0; k < 2; ++k) {
                for (int o = 0; o < 2; ++o) {
                    res = max(res, getlen(a[i][k] - a[j][o]));
                }
            }
        }
    }
    printf("%.10Lf\n", res);
}


int main() {
    int T;
    scanf("%d", &T);
    for (int i = 1; i <= T; ++i) {
        printf("Case #%d: ", i);
        solve();
    }
    return 0;
}
```