---
title: The 2023 ICPC Asia East Continent Final Contest
---
qoj 链接：[https://qoj.ac/contest/1522](https://qoj.ac/contest/1522)

如果代码是我写的或者是后来补的，我会贴一下我这儿留着的代码，如果是我参与的我会写一下思路。

过了 B, E, F, K, L 五道题，罚时 521，大概是铜首接近银的水平。

## B. Roman Master

签到题，从右往左尽可能多选。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        string s;
        cin >> s;
        vector<int> r;
        reverse(s.begin(), s.end());
        for (char c : s) {
            int t = c == 'I' ? 1 : 5;
            if (r.empty()) r.emplace_back(t);
            else if (t == 1) {
                if (r.back() == 1 || r.back() == 2) r.back()++;
                else if (r.back() == 5) r.back()--;
                else r.emplace_back(1);
            }
            else {
                if (r.back() <= 3) r.back() += 5;
                else r.emplace_back(5);
            }
        }
        if (r.back() == 0) r.pop_back();
        for (int i = r.size() - 1; i >= 0; --i) cout << r[i];
        cout << endl;
    }
    return 0;
}
```

## E. Colorful Graph<sup style="color: blue">(未参与)</sup>

完全没有参与，总之很顺利，十几分钟就解决了。

## F. Dot Product

我们猜测这个很难达成，一个有序的排列，当且仅当相邻两个交换的时候还可能满足。那么就先统计一遍逆序对，然后线性 DP，每次考虑最后两个是否交换。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

typedef long long LL;
const int N = 500010;
int a[N], inv[N], tr[N], n;
LL f[N][2]; // 0 是没有交换过，1 是交换过

void add(int x, int v) {
    for (; x <= n; x += x & -x) {
        tr[x] += v;
    }
}

int query(int x) {
    int res = 0;
    for (; x; x -= x & -x) {
        res += tr[x];
    }
    return res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        cin >> n;
        memset(tr, 0, sizeof(int) * (n + 1));
        for (int i = 1; i <= n; ++i) {
            cin >> a[i];
            inv[a[i]] = i;
        }
        LL cnt = 0;
        for (int i = n; i; --i) {
            cnt += query(a[i]);
            add(a[i], 1);
        }
        f[0][1] = cnt;
        f[0][0] = cnt;
        for (int i = 1; i <= n; ++i) {
            f[i][0] = min(f[i - 1][0], f[i - 1][1]);
            if (i > 1) f[i][1] = min(f[i - 2][0], f[i - 2][1]) - (inv[i - 1] > inv[i]);
            else f[i][1] = 1e18;
        }
        cout << min(f[n][0], f[n][1]) << endl;
    }
    return 0;
}
```

## K. Best Carry Player 4

这个题吃了七发罚时。其实思路并不难，前期我们的思路有问题。后来发现我的认为和他们等价的想法好像不等价，而且是对的，然后我重构代码，一直出各种问题。这个真是我的。

核心就是如何尽可能少浪费大数。先把两个数位数对齐，给少的那个补 0，这个直接补进去对答案没有影响，本身顺序就是自己定的。考虑凑 m - 1，能凑的全凑了，个数记为 t1，然后在剩余的里面凑不小于 m 的，个数记为 t2，分类讨论

- 如果 t2 不为 0，那么很显然，能让 t1 对的 m - 1 都进位，答案是 t1 + t2；
- 如果 t2 为 0，那么首先检查剩下还没有配对的数里面能不能找出一个换进已经配对的组使得这组能进位，只需要分别统计一下配过对的最小值，如果在剩余的数发现比对应最小值大的还有就可以，否则不行
  - 如果可以，答案是 t1；
  - 如果不行，在考虑能不能拆掉已经配对的组来进位
    - 组数小于 2，或者所有的已经配对的组都是同一对数的情况下不行，那根本就不能进位，答案是 0（我们最后就是栽到这儿的）；
    - 否则虽然拆了一对，但是至少能进位了，答案是 t1 - 1。 

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
typedef long long LL;
const int N = 500010;

LL a[N], b[N];

void solve()
{
    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
    }
    for (int i = 0; i < n; ++i) {
        cin >> b[i];
    }
    LL c1 = 0, c2 = 0;
    for (int i = 0; i < n; ++i) c1 += a[i];
    for (int i = 0; i < n; ++i) c2 += b[i];
    if (c1 < c2) a[0] += abs(c1 - c2);
    else b[0] += abs(c1 - c2);
    // for (int i = 0; i < n; ++i) cout << a[i] << ' ';
    // cout << endl;
    // for (int i = 0; i< n; ++i) cout << b[i] << ' ';
    // cout << endl;
    LL t = 0;
    int mna = 0x3f3f3f3f, mnb = 0x3f3f3f3f;
    for (int i = 0; i < n; ++i) {
        int tt = min(a[i], b[n - i - 1]);
        t += tt;
        if (tt) mna = min(mna, i);
        if (tt) mnb = min(mnb, n - i - 1);
        a[i] -= tt, b[n - i - 1] -= tt;
    }
    LL t2 = 0;
    for (int i = 0, j = n - 1; i < n && j >= 0; ++i) {
        while (a[i] && j >= 0 && i + j >= n) {
            int tt = min(a[i], b[j]);
            a[i] -= tt;
            b[j] -= tt;
            t2 += tt;
            if (!b[j]) j--;
        }
    }
    if (t2) cout << t + t2 << endl;
    else  {
        bool f = false;
        for (int i = 0; i < n; ++i) {
            if ((i > mna && a[i]) || (i > mnb && b[i])) {
                f = true;
                break;
            }
        }
        if (f) cout << t << endl;
        else if (mna + mnb == n - 1 || mna == 0x3f3f3f3f) cout << 0 << endl;
        else cout << max(0LL, t - 1) << endl;
    }
}

signed main()
{
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int T;
    cin >> T;
    while (T--)
    {
        solve();
    }
}
```

## L. Binary vs Ternary<sup style="color: blue">(未参与)</sup>

好像是一个朴实无华的字符串模拟，打表能发现在前面有 1 的情况下能用一次操作正好消掉一个 0 或者一个 1，先消的 1 的个数一样，然后还有一种操作能在 1 后面补 0。上面的这几种每个最多只会操作 2 次，操作次数也是对的。