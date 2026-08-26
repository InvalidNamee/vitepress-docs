---
title: 2025夏季个人训练赛第十三场
---
# 2025夏季个人训练赛第十三场

## A. Hat Circle

签到题

```cpp
#include <iostream>

using namespace std;

const int N = 1000010;

int a[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) scanf("%d", &a[i]);
    int res = 0;
    for (int i = 0; i < n; ++i) {
        if (a[i] == a[(i + n / 2) % n]) res++;
    }
    printf("%d\n", res);
    return 0;
}
```

## B. Heavy-Light Composition

```cpp
#include <iostream>
#include <cstring>

using namespace std;

char s[110];
int cnt[26];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        memset(cnt, 0, sizeof(cnt));
        scanf("%s", s + 1);
        for (int i = 1; i <= m; ++i) cnt[s[i] - 'a']++;
        bool f = true;
        for (int i = 2; i <= m; ++i) {
            if (cnt[s[i] - 'a'] == 1 && cnt[s[i - 1] - 'a'] == 1 || cnt[s[i] - 'a'] > 1 && cnt[s[i - 1] - 'a'] > 1) {
                f = false;
                break;
            }
        }
        if (f) printf("T\n");
        else printf("F\n");
    }
    return 0;
}
```

## C. Swipe

数据太弱了，错的代码都能过……


## <span style="color: red">D. Painting Roads</span>


## F. kolone

这道也很水，直接模拟就行。

```cpp
#include <iostream>

using namespace std;

char a[30], b[30], res[50];
bool g[26]; // 0, 1 = 1, 2

int main() {
    int n, m, T;
    scanf("%d%d%s%s%d", &n, &m, a, b, &T);
    for (int i = 0; i < m; ++i) g[b[i] - 'A'] = true;
    for (int i = 0; i < n; ++i) res[i] = a[n - i - 1];
    for (int i = 0; i < m; ++i) res[n + i] = b[i];

    while (T--) {
        for (int i = 0; i < n + m - 1; ++i) {
            if (g[res[i] - 'A'] == false && g[res[i + 1] - 'A'] == true) {
                swap(res[i], res[i + 1]);
                i++;
            }
        }
    }
    printf("%s\n", res);
    return 0;
}
```

## G. bus

n<sup>2</sup> dp，$f_i$ 表示前 i 个需要的巴士数目，枚举前面的状态 j 检查中间的人数是否符合要求。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 2510;

int s[N], f[N];
char t[N];

int main() {
    int n, m;
    scanf("%d%d%s", &n, &m, t);
    for (int i = 1; i <= n; ++i) {
        s[i] = s[i - 1] + (t[i - 1] == 'H');
    }
    memset(f, 0x3f, sizeof(f));
    f[0] = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (abs(i - j - (s[i] - s[j]) * 2) <= m || s[i] - s[j] == 0 || s[i] - s[j] == i - j) {
                f[i] = min(f[i], f[j] + 1);
            }
        }
    }
    printf("%d\n", f[n]);
    return 0;
}
```

## H. bard

给每个歌曲编号一下，然后按要求模拟。

```cpp
#include <iostream>
#include <set>
#include <vector>

using namespace std;

const int N = 110;
set<int> s[N];

int main() {
    int n, m, t = 0;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int k;
        bool f = false;
        scanf("%d", &k);
        vector<int> p(k);
        for (int j = 0; j < k; ++j) {
            scanf("%d", &p[j]);
            if (p[j] == 1) f = true;
        }
        if (f) {
            t++;
            for (int j : p) s[j].insert(t);
        }
        else {
            set<int> tmp;
            for (int j : p) {
                for (int song : s[j]) tmp.insert(song);
            }
            for (int j : p) s[j] = tmp;
        }
    }
    for (int i = 1; i <= n; ++i) {
        if (s[i].size() == t) printf("%d\n", i);
    }
    return 0;
}
```