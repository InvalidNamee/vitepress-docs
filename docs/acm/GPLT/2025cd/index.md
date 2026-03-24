---
title: 第四届成都信息工程大学天梯赛
---
# 第四届成都信息工程大学天梯赛

写了一半，群里发出来官方题解了……<s>但是我码风比他的好，可读性强一点</s>，但是为了<s>强迫症和</s>留作记录，我必须写完😇。所以这篇博客的性质已经从题解 transform 成赛后的感想了。

个人感觉有点像是水赛的感觉，L1 非常顺利，L2 和 L3 的最后两道开始调不出来，最终结果是 190 分(我的 L3-1 的 30 分还被队友吃了😭），L1 拿满，L2 的 3，4 WA，L3 的 2 TLE，3 没看。

我的 windows 还没回来，所以用的机房的编译一下就死机的电脑（但这不是我没存代码的理由），只能事后重敲一遍代码了，顺便回忆一下当时的心情。

## L1 基础级

L1 的 8 道题都非常顺利，没有被卡，可惜速度还是没有 @[xx liu (qwertyuiop)](@liuxx) 快。

### **L1-1 遇见YFffffff**

```python
print('Hello YFffffff')
```

### **L1-2 桃之夭夭，灼灼其华**

```python
n = int(input())
s = max(map(int, input().split()))
print(s, 'sad' if s & 1 else 'love')
```

### **L1-3 体温预警系统**

```python
n = int(input())
if n:
    t = [0 for i in range(4)]
    s = ['zhengchang', 'dire', 'gaore', 'yichangshuju']
    for i in range(n):
        tmp = round(float(input()) * 10)
        if tmp in range(360, 373):
            t[0] += 1
        elif tmp in range(373, 381):
            t[1] += 1
        elif tmp in range(381, 411):
            t[2] += 1
        else:
            t[3] += 1
    print('\n'.join(f'{s[i]}:{t[i]}' for i in range(4) if t[i]))
else:
    print('wuxiaoshuju')
```

### **L1-4 破碎的心，无法挽回的距离**

```cpp
#include <iostream>

using namespace std;

int a[110];

int main() {
    int n, res = 0x3f3f3f3f;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    for (int p = 1; p <= 100; ++p) {
        int s = 0;
        for (int i = 1; i <= n; ++i) {
            s += (a[i] - p) * (a[i] - p);
        }
        res = min(res, s);
    }
    cout << res << endl;
    return 0;
}
```

### **L1-5 心碎？抽卡时间！**

```python
a = list(map(int, input().split()))
b = list(map(int, input().split()))
for i in range(4):
    if a[i] < b[i]:
        print('spider YFffffff')
        break
    else:
        a[i + 1] += (a[i] - b[i]) // 5
else:
    print(a[4] if a[4] else 'QAQ')
```

### **L1-6 字符串糕手**

```python
l = int(input())
s = input()
res = 1000
for i in range(l // 2, l):
    t = s[:i] + s[i::-1]
    res = min(res, i * 2 + 1 - l) if s == (s[:i] + s[i::-1])[:l] else res
    res = min(res, i * 2 - l) if s == (s[:i] + s[i - 1::-1])[:l] else res
print(res)
```

### **L1-7 若敢来氪，必叫你大败而归**

```python
l = []
n, x = map(int, input().split())
for i in range(n):
    a = input().split()
    l.append((-int(a[1]), -int(a[2]), -int(a[3]), int(a[4]), a[0]))

cnt = 0
l.sort()
for i in l:
    if x - i[3] >= 0:
        print(i[4])
        x -= i[3]
        cnt += 1
    else:
        break
print(cnt)
```

### **L1-8 回到她的身边好吗**

```python
n, m, k, p = map(int, input().split())
a = [(0, 0)]
for i in range(m):
    a.append(tuple(map(int, input().split())))
a.append((n, n))
a.sort()
for i in range(1, len(a)):
    if a[i][0] - a[i - 1][1] > k:
        if p and k:
            p, k = p - 1, k - 1
        else:
            print('buguanle', a[i - 1][1])
            break
else:
    print('YES', k)
```

这个时候 L1 顺着做完了，还在沾沾自喜。

## L2 进阶级

实话说我感觉不是很困难的，但是 wa 了两道题。

### **L2-1 来自YFffffff的挑战**

这个策略当时有一定蒙的成分，实际上也是正确的。

```cpp
#include <iostream>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        int n;
        string s, t = "";
        cin >> n >> s;
        if (n == 1 || s[1] >= s[0]) cout << s[0] << s[0] << endl;
        else {
            for (char c : s) {
                if (t.empty() || c <= t.back()) t += c;
                else break;
            }
            cout << t;
            for (int i = t.length() - 1; i >= 0; --i) cout << t[i];
            cout << endl;
        }
    }
    return 0;
}
```

### L2\_2 不要刁难我们了

最短路板子题，做到这儿的时候也还是非常顺利，这时候心态已经被机房电脑磨的差不多了，这次不怪电脑怪我没事先拷过来一份新的编译器，我在本地调试的时候因为 `>>>` 不能连续，auto 遍历 vector 不能用被折磨的要死，还好是一遍过了。

```cpp
#include <iostream>
#include <cstring>
#include <queue>

using namespace std;

const int N = 200010;
vector<pair<int, int>> ed[N];
int w[N];
long long dis[N], cnt[N];
bool vis[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        cin >> x >> y >> z;
        ed[x].push_back({z, y});
        ed[y].push_back({z, x});
    }
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> q;
    memset(dis, 0x3f, sizeof(dis));
    cnt[s] = 1;
    dis[s] = 0;
    q.push({dis[s], s});
    while (!q.empty()) {
        int x = q.top().second;
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (auto [v, y] : ed[x]) {
            if (dis[y] > dis[x] + w[y] + v) {
                dis[y] = dis[x] + w[y] + v;
                cnt[y] = cnt[x];
                q.push({dis[y], y});
            }
            else if (dis[y] == dis[x] + w[y] + v) {
                cnt[y] += cnt[x];
            }
        }
    }
    cout << dis[t] << endl << cnt[t] << endl;
    return 0;
}
```

### **L2-3 花非花，雾非雾**

我 wa 掉的做法是开了个队列存储边，有更改的时候从更改的点出发 dfs 更新所有能更新的点，但是问题在于我 dfs 的路径并不一定是按照边从前到后更新的；其实当时又想到用并查集，但是最后又暂时放弃了。

这道题最后的有效关系图一定是一个森林，每个连通子图都是有向树，边从根指向叶子，其中只有根结点的 a 已经给出，从根到叶子跑一遍 dfs 就可以更新出所有点的 a；用并查集可以维护一个子图内是否已经有一个 a 已经给出的根节点，对于一个 U 关系，两个已经有根的子图连在一起或者子图内部连边可能会矛盾，即使不矛盾这条边也是多余的，所以全部都判定为无效即可。

* ps: dfs 会爆栈，别问我怎么知道的。
    

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

const int N = 40010;
vector<pair<int, int>> ed[N];
int fa[N], a[N];
bool f[N]; // 维护是否已经有根

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) fa[i] = i;
    while (m--) {
        char c;
        cin >> c;
        if (c == 'U') {
            int x, y, w;
            cin >> x >> y >> w;
            int px = getfa(x), py = getfa(y);
            if (px == py || (f[px] & f[py])) continue;
            fa[py] = px;
            f[px] ^= f[py];
            ed[x].push_back({w, y});
            ed[y].push_back({w, x});
        }
        else {
            int x, w;
            cin >> x >> w;
            if (!f[getfa(x)]) {
                a[x] = w;
                f[getfa(x)] = true;
            }
        }
    }
    queue<int> q;
    for (int i = 1; i <= n; ++i) {
        if (a[i]) q.push(i);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (auto [v, y] : ed[x]) {
            if (a[y]) continue;
            a[y] = a[x] ^ v;
            q.push(y);
        }
    }
    for (int i = 1; i <= n; ++i) {
        if (!a[i]) {
            cout << "sad" << endl;
            return 0;
        }
    }
    for (int i = 1; i <= n; ++i) cout << a[i] << ' ';
    cout << endl;
    return 0;
}
```

### **L2-4 是留不住你的冰寒飞影**

我现在还认为滑动窗口是可行的，考场上写的可能逻辑还是有点小问题，本质上我当时写的单调队列只是没有具象化的把点合并了。照着题解的思路写完代码之后发现我当时的问题是维护的范围小了，一个滑动窗口能 0 代价到达的最左端和最右端由左侧第二个和右侧第二个点决定，而不是窗口的左右端点。

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;
int a[N];
int l[N], r[N], t;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, k, m;
        scanf("%d%d%d", &n, &k, &m);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", &a[i]);
        }
        t = 0;
        a[0] = -0x3f3f3f3f, a[n + 1] = 0x3f3f3f3f;
        for (int i = 1; i <= n; ++i) {
            if (i == 1 && a[i + 1] - a[i] > k || i == n && a[i] - a[i - 1] > k) {
                t++;
                l[t] = r[t] = a[i];
            } 
            else if (a[i] - a[i - 1] <= k) {
                l[t] = min(l[t], a[i] - k);
                r[t] = max(r[t], a[i - 1] + k);
            }
            else if (a[i + 1] - a[i] <= k) {
                t++;
                l[t] = r[t] = a[i];
            }
        }
        for (int i = 2; i <= t; ++i) {
            m -= (l[i] - r[i - 1] + k - 1) / k;
        }
        if (m >= 0) printf("Yes\n");
        else printf("No\n");
    }
    return 0;
}
```

## L3 登顶级

### **L3-1 银白之森**

想到敲了二十多分钟基环树 dp 代码，我自己都想笑😇😇😇。这是一张后继图，每个点初度为1，所以构成基环树，然后我就想偏了。其实不用区分环内环外直接一起倍增预处理一下然后把 k 二进制分解算就行。还是忘不了之前一道树上倍增 + 环形dp 的基环树题😮‍💨，我写着写着发现环里面还得倍增，然后用了同一个倍增数组，又写了一会儿才发现问题的严重性，直接把代码全删了重写了一遍。

```cpp
#include <iostream>

using namespace std;

const int N = 100010;

int f[N][50];
long long g[N][50];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &f[i][0]);
        g[i][0] = f[i][0];
    }
    for (int j = 1; j < 50; ++j) {
        for (int i = 1; i <= n; ++i) {
            f[i][j] = f[f[i][j - 1]][j - 1];
            g[i][j] = g[i][j - 1] + g[f[i][j - 1]][j - 1];
        }
    }
    while (m--) {
        int x;
        long long k, res = 0;
        scanf("%d%lld", &x, &k);
        for (int i = 0; i < 50; ++i) {
            if (k >> i & 1) {
                res += g[x][i];
                x = f[x][i];
            }
        }
        printf("%lld\n", res);
    }
    return 0;
}
```

### **L3-2 摸球游戏**

当时矩阵快速幂 t 了，按说不该 t 的；但是这不是重点，重点是：我要向我高中数学老师道歉😭，这道题是一阶线性递推求通项，我把他当二阶的了，甚至还试图找特征方程。2025/03/07 晚上 22:00 我突然意识到了问题的严重性，于是一个不动点求出来等比数列的递推式然后秒了。他的题解太麻烦了，其实这就是一道平平无奇的高中概率题，果然上大学🧠会退化。

计球的总个数为 n，i 次操作后的期望为 $E_i$，根据期望递推，有

$$
E_i = \frac{E_{i - 1}}{n}E_{i - 1} + \frac{n - E_{i - 1}}{n}(E_{i - 1} + 1)
$$

化简得

$$
E_i = \frac{n - 1}{n}E_{i - 1} + 1
$$

计算不动点，解方程 $x = \frac{n - 1}{n}x + 1$得，$x= n$. 所以有

$$
E_i - n = \frac{n - 1}{n}(E_{i - 1} - n)
$$

后面就不用我教了，首项是 n - a，公比是 $\frac{n - 1}{n}$等比数列通向公式直接求 $E_k$即可。

对不起 90 老师，过了半年就忘干净了😭😭😭.

```cpp
#include <iostream>

using namespace std;

int MOD = 1000000007;

long long power(long long n, long long p) {
    long long res = 1, base = n;
    while (p) {
        if (p & 1) res = res * base % MOD;
        base = base * base % MOD;
        p >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    long long a, b, c, k;
    cin >> T;
    while (T--) {
        cin >> a >> b >> k;
        b += a;
        cout << (((a - b + MOD) % MOD * power((b - 1) * power(b, MOD - 2) % MOD, k)) % MOD + b + MOD) % MOD << endl;
    }
    return 0;
}
```

### **L3-3 电荷**

这道自己做是真做不出来，正确的结论是一个 D 合法当且仅当**按 x 排序检查和按 y 排序检查**至少有一个可以通过，其余情况通过适当交换可以转化成按 x 和 y 检查的一种。如果我自己想只能想到按其中一个排序，调代码的时候也是调的非常头疼。

代码还可以压一压，排序和前缀后缀 max 和 min 可以写成一个函数<s>。但是我已经不想看这个💩了</s>

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <vector>

using namespace std;

const int N = 100010;
pair<int, int> a[N];
int pre_mn[N], pre_mx[N], pos_mn[N], pos_mx[N];
int n;

long long pow2(int t) {
    return (long long)t * t;
}

long long calc(int l, int r) {
    if (l == 1 && r == n) return 0;
    int mn = 0x3f3f3f3f, mx = -0x3f3f3f3f;
    if (l != 1) mn = min(mn, pre_mn[l - 1]), mx = max(mx, pre_mx[l - 1]);
    if (r != n) mn = min(mn, pos_mn[r + 1]), mx = max(mx, pos_mx[r + 1]);
    return max(pow2(mx - mn), max(pow2(mx), pow2(mn)) + max(pow2(a[l].first), pow2(a[r].first)));
}

bool check(long long mid) {
    for (int i = 1, j = 1; i <= n; ++i) {
        while (j <= n && (long long)(a[j].first - a[i].first) * (a[j].first - a[i].first) <= mid) {
            if (calc(i, j) <= mid) return true;
            j++;
        }
        if (calc(i, j - 1) <= mid) return true;
    }
    return false;
}

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &a[i].first, &a[i].second);
    }
    sort(a + 1, a + n + 1);
    pre_mn[0] = 0x3f3f3f3f;
    pre_mx[0] = -0x3f3f3f3f;
    pos_mn[n + 1] = 0x3f3f3f3f;
    pos_mx[n + 1] = -0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        pre_mx[i] = max(pre_mx[i - 1], a[i].second);
        pre_mn[i] = min(pre_mn[i - 1], a[i].second);
    }
    for (int i = n; i; --i) {
        pos_mx[i] = max(pos_mx[i + 1], a[i].second);
        pos_mn[i] = min(pos_mn[i + 1], a[i].second);
    }
    long long l = 0, r = 80000000000000000;
    while (l < r) {
        long long mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    
    long long res = l;
    for (int i = 1; i <= n; ++i) swap(a[i].first, a[i].second);
    sort(a + 1, a + n + 1);
    pre_mn[0] = 0x3f3f3f3f;
    pre_mx[0] = -0x3f3f3f3f;
    pos_mn[n + 1] = 0x3f3f3f3f;
    pos_mx[n + 1] = -0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) {
        pre_mx[i] = max(pre_mx[i - 1], a[i].second);
        pre_mn[i] = min(pre_mn[i - 1], a[i].second);
    }
    for (int i = n; i; --i) {
        pos_mx[i] = max(pos_mx[i + 1], a[i].second);
        pos_mn[i] = min(pos_mn[i + 1], a[i].second);
    }
    l = 0, r = 80000000000000000;
    while (l < r) {
        long long mid = l + r >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    res = min(res, l);
    printf("%lld\n", res);
    return 0;
}
```

终于补完了，奖励自己歇一晚上😴😴😴