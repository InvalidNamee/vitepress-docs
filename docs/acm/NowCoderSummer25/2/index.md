---
title: 2025牛客暑期多校训练营2
---
# 2025牛客暑期多校训练营2

当时我们都在家，所以是回学校之后 vp 的，大概情况是这样的

| STATUS | COUNT |
| --- | --- |
| AC | 5 |
| 赛后补 | 3 |

重现赛排名 514，中途出了一些情况，当时三个人都相当红温，最后一人卡一道愣是一个都没调出来😡

## A. Another Day of Sun

这道是我写的，比较简单的线性 dp，本场唯二没有罚时的题之一。

```cpp
#include <iostream>
#include <cstring>

using namespace std;
const int N = 500010;
const int MOD = 998244353;

int a[N];
long long f[N][2], g[N][2];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) {
            g[i][0] = g[i][1] = 0;
            f[i][0] = f[i][1] = 0;
            scanf("%d", &a[i]);
        }
        f[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            if (a[i] == -1) {
                f[i][0] = (f[i - 1][0] + f[i - 1][1]) % MOD;
                f[i][1] = (f[i - 1][1] + f[i - 1][0]) % MOD;
                g[i][0] = (g[i - 1][0] + g[i - 1][1]) % MOD;
                g[i][1] = (g[i - 1][0] + f[i - 1][0] + g[i - 1][1]) % MOD;
            }
            else if (a[i] == 1) {
                f[i][1] = (f[i - 1][1] + f[i - 1][0]) % MOD;
                g[i][1] = (g[i - 1][0] + f[i - 1][0] + g[i - 1][1]) % MOD;
            }
            else {

                f[i][0] = (f[i - 1][0] + f[i - 1][1]) % MOD;
                g[i][0] = (g[i - 1][0] + g[i - 1][1]) % MOD;
            }
        }
        printf("%lld\n", (g[n][0] + g[n][1]) % MOD);
    }
    return 0;
}
```

## B. Bitwise Perfect <span style="color: blue"><sup>队友</sup></span>

这道当时出现了离谱的问题，其实刚开始队友想到的结论就是对的，但是挂在了一个知识盲区，看下面的代码

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 512, t = 32;
    cout << (a >> t) << endl;
    return 0;
}
```

你以为他会是 0，实际上他移了一圈又回去了，输出了 512，错的代码就是是因为这个地方右移越界了。

代码量很小，除了上面那个坑别的地方不容易错，所以没自己写。

## D. Donkey Thinks... <span style="color: red"><sup>补</sup></span>

在背包的基础上增加了如果留空了，就每个物体扣 d<sub>i</sub>，切入点是 v 很小，能放进去的物品数就很少，对于容量 v - u，最多就只能放 $\sum_{i = 1}^{v - u}\frac{v - u}{i} \approx \ln \left(u - v\right)$ 个，死去的高数还在追我。

当时主要的问题应该是 n 是 1e5，V 是 500，不敢相信 $\Theta(nV + V^3\log V)$ 能过。

另外还学到了一点优化的小方法

- vector 的 emplace_back 比 push_back 快很多；
- 用 nth_element 可以近似 $\Theta(n)$ 把第 k 小的数放到第 k 位，然后再遍历一遍就可以近似线性的找出来前 k 个元素。

```cpp
#include <iostream>
#include <vector>
#include <cstring>
#include <algorithm>

using namespace std;

typedef long long LL;
const int N = 510;
LL f[N];
vector<pair<LL, LL>> a[N]; // first 是快乐，second 是易碎

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, v;
        scanf("%d%d", &n, &v);
        for (int i = 1; i <= v; ++i) {
            a[i].clear();
        }
        for (int i = 1; i <= n; ++i) {
            int h, s, d;
            scanf("%d%d%d", &h, &s, &d);
            a[s].emplace_back(h, d);
        }
        LL res = 0;
        for (int u = 0; u < v; ++u) {
            fill(f + 1, f + v - u + 1, -2500000000000000);
            for (int i = 1; i <= v - u; ++i) {
                int k = (v - u) / i;
                LL mid = -2500000000000000;
                if (a[i].size() > k) {
                    nth_element(a[i].begin(), a[i].begin() + k - 1, a[i].end(), [&u](pair<LL, LL> a, pair<LL, LL> b) {
                        return a.first - a.second * u > b.first - b.second * u;
                    });
                    mid = a[i][k - 1].first - a[i][k - 1].second * u;
                    for (int j = v - u; j >= i; --j) {
                        f[j] = max(f[j], f[j - i] + mid);
                    }
                }
                for (pair<LL, LL> item : a[i]) {
                    if (item.first - item.second * u > mid) {
                        for (int j = v - u; j >= i; --j) {
                            f[j] = max(f[j], f[j - i] + item.first - item.second * u);
                        }
                    }
                }
            }
            res = max(res, f[v - u]);
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

## F. Field of Fire

题很水，我写的，而且 -3，我在反思了……

挂掉的原因也很离谱

- 开区间 (l, r) 长度我写的 r - l + 1，应该是 r - l - 1;
- 特殊情况需要把整个区间全覆盖了，我写的是 s[1]++, s[n]--，然而应该是是 s[n + 1]--，另外，赛后发现这个统计是比较多余的，而且还有很大的犯错风险，如果在下面的循环里一并统计风险会小很多。

```cpp
#include <iostream>
#include <vector>
#include <cstring>
using namespace std;

const int N = 500010;
int a[N], s[N];
vector<int> fire;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        fire.clear();
        int n, t;
        scanf("%d%d", &n, &t);
        memset(s, 0, sizeof(int) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%1d", &a[i]);
            if (a[i] == 1) fire.push_back(i);
        }
        for (int i : fire) {
            int l = i - t, r = i + t;
            if (r - l + 1 >= n) {
                s[1]++;
                break;
            }
            if (l <= 0) {
                s[1]++, s[r + 1]--;
                s[n + l]++;
            }
            else if (r > n) {
                s[l]++;
                s[1]++, s[r - n + 1]--;
            }
            else {
                s[l]++, s[r + 1]--;
            }
        }
        int cur_cnt = 0;
        s[0] = 0;
        for (int i = 1; i <= n; ++i) {
            s[i] += s[i - 1];
            if (s[i]) cur_cnt++;
        }
        if (fire.size() == 1) {
            printf("%d\n", max(0, n - t - 2));
        }
        else {
            int d = 0;
            for (int i = 0; i < (int)fire.size(); ++i) {
                int l = fire[i], r = fire[(i + 1) % fire.size()];
                if (l + 1 == r) continue;
                if (l > r) r += n;
                d = max(d, min(r - l - 1, t * 2) - min(t + 1, r - l - 1));
            }
            printf("%d\n", n - (cur_cnt - d));
        }
    }
    return 0;
}
```
## G. Geometry Friend <span style="color: red"><sup>补</sup></span>

这道题当时也是差一点，队友的思路是对的，但是发生了

- 循环内外变量重名（不致命）
- 被卡精度（致命）

大概有这几点经验和教训

- 能用 long long 不用 double
- 用 atan2 比 acos 算出来的更精准一点

原理上问题不是很大。

```cpp
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;
typedef long long LL;
const int N = 500010;

LL x[N], y[N];

LL cha(LL x1, LL y1, LL x2, LL y2) {
    return x1 * y2 - x2 * y1;
}

LL p(LL x) {
    return x * x;
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        LL px, py, mx = 0;
        scanf("%d%lld%lld", &n, &px, &py);
        for (int i = 1; i <= n; ++i) {
            scanf("%lld%lld", &x[i], &y[i]);
        }
        bool f = false;
        for (int i = 1; i <= n; ++i) {
            int j = i % n + 1;
            if (cha(x[i] - px, y[i] - py, x[j] - px, y[j] - py) < 0) {
                f = true;
                break;
            }
            mx = max(mx, p(x[i] - px) + p(y[i] - py));
        }
        if (f) {
            printf("%.15f\n", acos(0) * 4);
        }
        else {
            vector<pair<LL, LL>> a;
            for (int i = 1; i <= n; ++i) {
                if (mx == p(x[i] - px) + p(y[i] - py)) {
                    a.emplace_back(x[i], y[i]);
                }
            }
            a.emplace_back(a[0]);
            double res = 0;
            for (int i = 0; i < a.size() - 1; ++i) {
                int j = i + 1;
                double t = atan2(cha(a[i].first - px, a[i].second - py, a[j].first - px, a[j].second - py), (a[i].first - px) * (a[j].first - px) + (a[i].second - py) * (a[j].second - py));
                if (t <= 0) t += acos(0) * 4;
                res = max(res, t);
            }
            printf("%.15f\n", res);
        }
    }
    return 0;
}
```

## H. Highway Upgrade <span style="color: red"><sup>补</sup></span>

这道也是我的锅，想的和题解完全一样，做法也完全一样，但是写挂了，挂的原因

- 因为要建反图，和边相关的数组应该开两倍，因为一些数组开 int 一些数组开 long long，不知道什么情况边权的数组被挤下去了，然后没看到，忘记 * 2；
- 读入循环边界写错，似乎是把边数 m 写成了 n，恰好样例的 n = m，没有发现问题，后续检查的时候也没发现；
- 算直线交点用了 double 疑似精度不够出了点问题；

之后要注意的地方

- 无效点（不可达点）需要剔除，第一版没注意到，后面改了；
- 凸包题解的做法是按照斜率排序，而我按照截距排的，可能需要多加限制条件（但是我加对了，没挂在这儿）。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <queue>

using namespace std;
typedef long long LL;

const int N = 100010, M = 300010;

int head[N], head_rev[N], ver[M * 2], ne[M * 2], tot;
LL dis[N], dis_rev[N];
bool vis[N];
LL t[M * 2], w[M * 2];
pair<LL, LL> f[M];
int g[M];
pair<int, int> qu[M];
LL res[M];

void add(int *head, int x, int y, LL z, LL a) {
	ver[++tot] = y;
	ne[tot] = head[x];
	head[x] = tot;
	t[tot] = z;
	w[tot] = a;
}

void dijkstra(int *head, LL *dis, int s) {
	priority_queue<pair<LL, int>, vector<pair<LL, int>>, greater<pair<LL, int>>> q;
	q.push({0LL, s});
	dis[s] = 0;
	while (!q.empty()) {	
		int x = q.top().second;
		q.pop();
		if (vis[x]) continue;
		vis[x] = true;
		for (int i = head[x]; i; i = ne[i]) {
			int y = ver[i];
			if (dis[y] > dis[x] + t[i]) {
				dis[y] = dis[x] + t[i];
				q.push({dis[y], y});
			}
		}
	}
}

int main() {
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	int T;
	cin >> T;
	while (T--) {
		int n, m, q;
		cin >> n >> m;
		memset(head, 0, sizeof(int) * (n + 1));
		memset(head_rev, 0, sizeof(int) * (n + 1));
		memset(dis, 0x3f, sizeof(LL) * (n + 1));
		memset(dis_rev, 0x3f, sizeof(LL) * (n + 1));
		memset(vis, 0, sizeof(bool) * (n + 1));
		tot = 0;
		for (int i = 1; i <= m; ++i) {
			int x, y;
			LL z, a;
			cin >> x >> y >> z >> a;
			add(head, x, y, z, a);
			add(head_rev, y, x, z, a);
		}
		
		cin >> q;
		memset(res, 0x3f, sizeof(LL) * (q + 1));
		for (int i = 1; i <= q; ++i) {
			cin >> qu[i].first;
			qu[i].second = i;
		}
		sort(qu + 1, qu + q + 1);
		
		dijkstra(head, dis, 1);
		memset(vis, 0, sizeof(bool) * (n + 1));
		dijkstra(head_rev, dis_rev, n);
		int ttt = 0;
		for (int x = 1; x <= n; ++x) {
			for (int i = head[x]; i; i = ne[i]) {
				int y = ver[i];
				if (dis[x] == dis[0] || dis_rev[x] == dis[0]) continue;
				else f[++ttt] = {dis[x] + dis_rev[y] + t[i], w[i]};
			}
		}

		sort(f + 1, f + ttt + 1, [](pair<LL, LL> a, pair<LL, LL> b) {
			return a.first == b.first ? a.second > b.second : a.first < b.first;
		});
		int len = 0;
		for (int i = 1; i <= ttt; ++i) {
			if (i != 1 && f[i].first == f[g[len]].first) continue;
			while (len > 1 && (__int128_t)(f[i].first - f[g[len]].first) * (f[g[len]].second - f[g[len - 1]].second)  <= (__int128_t)(f[g[len]].first - f[g[len - 1]].first) * (f[i].second - f[g[len]].second)) {
                len--;
			}
			g[++len] = i;
		}
		for (int i = 1, j = 1; i <= q; ++i) {
			res[qu[i].second] = f[g[j]].first - f[g[j]].second * qu[i].first;
			while (j < len && res[qu[i].second] > f[g[j + 1]].first - f[g[j + 1]].second * qu[i].first) {
				j++;
				res[qu[i].second] = f[g[j]].first - f[g[j]].second * qu[i].first;
			}
		}
		for (int i = 1; i <= q; ++i) {
			cout << res[i] << '\n';
		}
	}
	return 0;
}
```

## I. Identical Somehow <span style="color: blue"><sup>队友</sup></span>

这个签到题非常水，就两行。

## L. Love Wins All <span style="color: blue"><sup>队友</sup></span>

这道也简单，我刚开始看错条件，以为是基环树 dp (题解上也提了一嘴)，但是无所谓，它被队友秒了。

~~要是真成基环树 dp 了，那就有意思了.~~

```cpp
#include <iostream>
#include <vector>
#include <cstring>

using namespace std;

const int N = 500010;
const int MOD = 998244353;
bool vis[N];
int ne[N];
long long pre[N], suf[N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        memset(vis, 0, sizeof(int) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &ne[i]);
        }
        vector<int> cir;
        int odd = 0;
        for (int i = 1; i <= n; ++i) {
            if (!vis[i]) {
                int x = i, cnt = 0;
                do {
                    vis[x] = true;
                    cnt++;
                    x = ne[x];
                } while (!vis[x]);
                cir.emplace_back(cnt);
                odd += cnt & 1;
            }
        }
        if (odd > 2) printf("0\n");
        else if (odd == 2) {
            long long res = 1;
            for (int cnt : cir) {
                if (cnt & 1) res = res * cnt % MOD;
                else res = res * (cnt > 2 ? 2 : 1) % MOD;
            }
            printf("%lld\n", res);
        }
        else {
            long long res = 0;
            pre[0] = 1;
            for (int i = 1; i <= cir.size(); ++i) {
                pre[i] = pre[i - 1] * (cir[i - 1] > 2 ? 2 : 1) % MOD;
            }
            suf[cir.size() + 1] = 1;
            for (int i = cir.size(); i; --i) {
                suf[i] = suf[i + 1] * (cir[i - 1] > 2 ? 2 : 1) % MOD;
            }
            for (int i = 1; i <= cir.size(); ++i) {
                res = (res + pre[i - 1] * suf[i + 1] % MOD * ((long long)cir[i - 1] * cir[i - 1] / 4)) % MOD;
            }
            printf("%lld\n", res);
        }
    }    
    return 0;
}
```