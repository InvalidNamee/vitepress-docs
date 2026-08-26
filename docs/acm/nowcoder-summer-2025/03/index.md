---
title: 2025牛客暑期多校训练营3
---
# 2025牛客暑期多校训练营3

这场是 vp 的，大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 7 |
| 赛后补 | 0 |

排名是 305，这套简单一点，但是手慢无啊😭，我们是 7 道题的倒数，第一个 7 道题的是七十多名。

## A. Ad-hoc Newbie	

这道是我做的，我发现有限制 f<sub>i</sub> ≤ i，之后每行至多需要 i 个位置就可以满足要求，利用对称性，如果前 i 个位置填的同时符合第 i 行和前 i - 1 列的要求，沿着对角线对称过去一定还满足，所以问题就简单了，直接随便按要求构造半个矩阵然后对称过去就解决了。

```cpp
#include <iostream>
using namespace std;
const int N = 1500;
int st[N], tp;
int a[N][N], b[N];

int main() {
	int T;
	scanf("%d", &T);
	while (T--) {
		int n;
		scanf("%d", &n);
		for (int i = 1; i <= n; ++i) {
			scanf("%d", &b[i]);
		}
		for (int i = 1; i <= n; ++i) {
			tp = 0;
			for (int j = 0; j < b[i]; ++j) {
				st[++tp] = j;
			}
			for (int j = 1; j <= i; ++j) {
				if (!tp) {
                    // 这里是我之前想多了，其实直接全填 0 就行，相当于没写这个循环。
					for (int k = 0; k <= n; ++k) {
						if (k != b[i] && k != b[j]) {
							a[i][j] = k;
							break;
						}
					}
				}
				else if (st[tp] != b[j]) a[i][j] = st[tp--];
				else if (st[tp] == b[j]) {
					if (tp == 1) {
						for (int k = 0; k <= n; ++k) {
							if (k != b[i] && k != b[j]) {
								a[i][j] = k;
								break;
							}
						}
					}
					else {
						a[i][j] = st[tp - 1];
						st[tp - 1] = st[tp];
						tp--;
					}
				}
			}
		}
		for (int i = 1; i <= n; ++i) {
			for (int j = 1; j <= i; ++j) printf("%d ", a[i][j]);
			for (int j = i + 1; j <= n; ++j) printf("%d ", a[j][i]);
			printf("\n");
		}
	}
	return 0;
}
```

## B. Bitwise Puzzle

这道题也是我做的，思路也比较简单，美中不足的是我没有把情况归纳起来，我是暴力枚举了所有可能的次序都写了一遍，被我做成大模拟了，期间还因为区间归纳的有问题错了两次。

```cpp
#include <iostream>
#include <vector>
 
using namespace std;
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        vector<int> res;
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        if (a == 0 && b == 0) {
            if (c == 0) printf("0\n\n");
            else printf("-1\n");
            continue;
        }
        int ha = -1, hb = -1, hc = -1;
        for (int i = 30; i >= 0; --i) {
            if (a >> i & 1) {
                ha = i;
                break;
            }
        }
        for (int i = 30; i >= 0; --i) {
            if (b >> i & 1) {
                hb = i;
                break;
            }
        }
        for (int i = 30; i >= 0; --i) {
            if (c >> i & 1) {
                hc = i;
                break;
            }
        }
        if (ha <= hb && hb <= hc) {
            int d = hc - hb;
            for (int i = hb; i >= 0; --i) {
                if ((c >> (i + d) & 1) ^ (a >> i & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.pop_back();
            for (int i = d - 1; i >= 0; --i) {
                res.emplace_back(1);
                if (c >> i & 1) res.emplace_back(3);
            }
            res.emplace_back(2);
            res.emplace_back(4);
        }
        else if (hc <= ha && ha <= hb) {
            for (int i = hb; i >= 0; --i) {
                if ((a >> i & 1) ^ (c >> i & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.emplace_back(4);
        }
        else if (ha <= hc && hc <= hb) {
            int d = hb - hc;
            b >>= d;
            for (int i = 0; i < d; ++i) res.emplace_back(2);
            for (int i = hc; i >= 0; --i) {
                if ((a >> i & 1) ^ (c >> i & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.emplace_back(4);
        }
        else if (hb <= ha && ha <= hc) {
            res.emplace_back(4);
            b ^= a;
            int d = hc - ha;
            for (int i = ha; i >= 0; --i) {
                if ((a >> i & 1) ^ (c >> i + d & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.pop_back();
            d = hc - ha;
            for (int i = d - 1; i >= 0; --i) {
                res.emplace_back(1);
                if (c >> i & 1) res.emplace_back(3);
            }
            res.emplace_back(2);
            res.emplace_back(4);
        }
        else if (hb <= hc && hc <= ha) {
            res.emplace_back(4);
            b ^= a;
            for (int i = ha; i >= 0; --i) {
                if ((a >> i & 1) ^ (c >> i & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.emplace_back(4);
        }
        else if (hc <= hb && hb <= ha) {
            res.emplace_back(4);
            b ^= a;
            for (int i = ha; i >= 0; --i) {
                if ((a >> i & 1) ^ (c >> i & 1)) {
                    a ^= b;
                    res.emplace_back(3);
                }
                b >>= 1;
                res.emplace_back(2);
            }
            res.emplace_back(4);
        }
        else {
            return 1;
        }
        printf("%ld\n", res.size());
        for (int i : res) printf("%d ", i);
        printf("\n");
    }
    return 0;
}
```

## D. Distant Control <sup style="color: blue">队友</sup>

赛后补的时候还想错了好几次，用 dp 的惯性我只想到左边长度够了能一直往右开，没想到右边长度够了能往左边开……

```cpp
#include <iostream>

using namespace std;

const int N = 200010;
int a[N];

int solve() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%1d", &a[i]);
        a[i] += a[i - 1];
    }
    for (int i = 1; i <= n - m; ++i) {
        if (a[i + m] - a[i - 1] == 0) return n;
    }
    for (int i = 1; i <= n - m + 1; ++i) {
        if (a[i + m - 1] - a[i - 1] == m) return n;
    }
    return a[n];
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        printf("%d\n", solve());   
    }
    return 0;
}
```

## E. Equal <sup style="color: blue">队友</sup>

这道当时没少踩坑，题解给的是 XOR hashing，我们当时用的是 $O(n \ln n)$ 的方法，刚开始因为没特判只有两个数的情况 WA 了四次，然后好像又因为前面有问题 T 了一次。

```cpp
#include <iostream>
#include <cmath>
#include <vector>
#include <cstdlib>
#include <random>
 
using namespace std;
const int N = 1000010;
const int M = 5000010;
bool f[M];
int a[N];
uint64_t hs[M];
vector<int> primes;
 
void init() {
    mt19937_64 rnd(time(0));
    int n = 5000000;
    for (int i = 2; i <= n; ++i) {
        if (!f[i]) {
            hs[i] = rnd();
            primes.emplace_back(i);
        }
        for (int p : primes) {
            if (i * p > n) break;
            f[i * p] = true;
            hs[i * p] = hs[i] ^ hs[p];
            if (i % p == 0) break;
        }
    }
}
 
int main() {
    init();
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        if (n & 1) {
            printf("YES\n");
            continue;
        }
        else if (n == 2) {
            if (a[1] != a[2]) printf("NO\n");
            else printf("YES\n");
            continue;
        }
        uint64_t h = 0;
        for (int i = 1; i <= n; ++i) {
            h ^= hs[a[i]];
        }
        if (h) printf("NO\n");
        else printf("YES\n");
    }
    return 0;
}
```

## F. Flower <sup style="color: blue">队友</sup>

本场签到题。

```cpp
#include <iostream>

using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, a, b;
        scanf("%d%d%d", &n, &a, &b);
        if (n <= a) printf("Sayonara\n");
        else {
            n %= (a + b);
            if (n > a) printf("0\n");
            else printf("%d\n", n);
        }
    }
    return 0;
}
```

## H. Head out to the Target <sup style="color: blue">队友</sup>

这道没看着呢么难，实际上可以用比较暴力的办法处理，刚开始我们都没意识到，还 WA 了一发，后来注意到的时候我正在写 B 题的大模拟，打断了我五六分钟左右就过了。

然后我刚开始补题的时候又重蹈覆辙，敲了一个数剖 + 线段树上去，又挂了……

```cpp
#include <iostream>
#include <vector>

using namespace std;
const int N = 1000010;
vector<int> ed[N];
int f[N][20];
bool flg[N];
int tr[N * 4];
int n, k;

void dfs(int x) {
    for (int i = 1; i < 20; ++i) {
        f[x][i] = f[f[x][i - 1]][i - 1];
    }
    for (int y : ed[x]) {
        if (y == f[x][0]) continue;
        dfs(y);
    }
}

int main() {
    // freopen("input", "r", stdin);
    scanf("%d%d", &n, &k);
    for (int i = 2; i <= n; ++i) {
        scanf("%d", &f[i][0]);
        ed[f[i][0]].emplace_back(i);
    }
    dfs(1);
    flg[0] = flg[1] = true;
    while (k--) {
        int u, l, r;
        scanf("%d%d%d", &u, &l, &r);
        if (flg[u]) {
            printf("%d\n", l);
            return 0;
        }
        int dis = 0, x = u;
        for (int i = 19; i >= 0; --i) {
            if (!flg[f[x][i]]) {
                x = f[x][i], dis |= 1 << i;
            }
        }
        // cout << "found: " << x << endl;
        // cout << "dis :" << dis << endl;
        // cout << flg[6] << endl;
        if (dis <= r - l) {
            printf("%d\n", l + dis);
            return 0;
        }
        dis -= r - l;
        for (int i = 0; i < 20; ++i) {
            if (dis >> i & 1) u = f[u][i];
        }
        // 暴戾
        // cout << "marking" << endl;
        for (int i = 0; i < r - l + 1; ++i) {
            flg[u] = true;
            // cout << u << ' ';
            u = f[u][0];
        }
//         cout << endl;
        // break;
    }
    // cout << query(8) << endl;
    printf("-1\n");
    return 0;
}
```

## J. Jetton

这道是我写的，刚开始没发现特殊性质，感觉直接暴力也未尝不可，甚至还打表验证了一下，后来不出意外就出意外了，T 了一发之后仔细思考了一下，然后换成一个式子每次 $O (log_2 \left(x + y\right))$ 稳定解决了。

被卡的地方是出现死循环（-1）的情况，不合法情况的循环节可能比较大。

```cpp
#include <iostream>
#include <set>
 
using namespace std;
 
set<pair<int, int> > s;


int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}
 
int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int x, y;
        scanf("%d%d", &x, &y);
        int g = gcd(x, y);
        x /= g, y /= g;
        if (x + y & 1) {
            printf("-1\n");
            continue;
        }
        s.clear();
        s.insert({x, y});
        int t = 0;
        bool f = true;
        while (x && y) {
            if (x > y) swap(x, y);
            y -= x, x *= 2;
            t++;
            if (x > y) swap(x, y);
            if (s.find({x, y}) != s.end()) {
                f = false;
                break;
            }
            s.insert({x, y});
        }
        if (f) printf("%d\n", t);
        else printf("-1\n");
    }
    return 0;
}
```