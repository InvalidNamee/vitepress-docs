---
title: 2025夏季个人训练赛第八场
---
# 2025夏季个人训练赛第八场

前面五道都是签到题水平的。

## A. Conveyor Belt Sushi

```cpp
#include <iostream>

using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a * 3 + b * 4 + c * 5 << endl;
    return 0;
}
```

## B. Dusa And The Yobis

```cpp
#include <iostream>

using namespace std;

int main() {
    int d, t;
    cin >> d;
    while (cin >> t) {
        if (d <= t) break;
        else d += t;
    }
    cout << d << endl;
    return 0;
}
```

## C. Bronze Count

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> sc, bk;

int main() {
    int n;
    scanf("%d", &n);
    sc.resize(n);
    for (int i = 0; i < n; ++i) {
        scanf("%d", &sc[i]);
    }
    bk = sc;
    sort(sc.begin(), sc.end());
    auto ls = unique(sc.begin(), sc.end());
    sort(sc.begin(), ls, greater<int>());
    int cnt = 0;
    cout << sc[2] << ' ';
    for (int s : bk) {
        if (s == sc[2]) cnt++;
    }
    cout << cnt << endl;
    return 0;
}
```

## D. Troublesome Keys

枚举 silly key 可能的多有情况挨个验证即可。

```cpp
#include <iostream>

using namespace std;

char check(string s, string t, char a, char b) {
    bool flag = false;
    for (char c : s) {
        if (b == c) return 0;
        if (a == c) flag = true;
    }
    if (!flag) return 0;
    char res = 0;
    for (int i = 0, j = 0; i <= s.length(); ++i) {
        if (s[i] == t[j]) j++;
        else if (s[i] == a && t[j] == b) j++;
        else if (res == 0 || res == s[i]) res = s[i];
        else return 0;
    }
    return res == 0 ? '-' : res;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s, t;
    cin >> s >> t;
    for (char i = 'a'; i <= 'z'; ++i) {
        for (char j = 'a'; j <= 'z'; ++j) {
            if (i == j) continue;
            else {
                char c = check(s, t, i, j);
                if (c) {
                    cout << i << ' ' << j << endl;
                    cout << c << endl;
                    return 0;
                }
            }
        }
    }
    return 0;
}
```

## E. Harvest Waterloo

dfs 就可以了。

```cpp
#include <iostream>
#include <vector>

using namespace std;

int n, m, res;
vector<vector<char>> mp;
vector<vector<bool>> vis;

int val(char c) {
    if (c == 'S') return 1;
    else if (c == 'M') return 5;
    else return 10;
}

void dfs(int x, int y) {
    if (vis[x][y] || mp[x][y] == '*') return;
    vis[x][y] = true;
    res += val(mp[x][y]);
    if (x < n - 1) dfs(x + 1, y);
    if (y < m - 1) dfs(x, y + 1);
    if (x > 0) dfs(x - 1, y);
    if (y > 0) dfs(x, y - 1);
}


int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> n >> m;
    mp = vector<vector<char>>(n, vector<char>(m));
    vis = vector<vector<bool>>(n, vector<bool>(m));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            cin >> mp[i][j];
        }
   }
    int x, y;
    cin >> x >> y;
    dfs(x, y);
    cout << res << endl;
    return 0;
}
```

## H. Beautiful Garden

找不对称的点最极限的位置，p 的取法有 不对称点最靠近边界的 x 坐标的距离 - 1 种，q 同理。

```cpp
#include <iostream>

using namespace std;

const int N = 2010;

char s[N][N];

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, m;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) {
            scanf("%s", s[i] + 1);
        }
        int lx = n / 2, ly = m / 2, rx = 0, ry = 0;
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                if (s[i][j] != s[n - i + 1][j] || s[i][j] != s[i][m - j + 1]) {
                    // cout << "! " << i << ' ' << j << endl;
                    lx = min(lx, i), ly = min(ly, j);
                    rx = max(rx, i), ry = max(ry, j);
                }
            }
        }
        printf("%d\n", min(lx - 1, n - rx) * min(ly - 1, m - ry));
    }
    return 0;
}
```

## I. Maximum Mode

二分一个数量的边界值，数量大于等于这个值的数可以取，否则不能取，在能取的里面选一个最大的就是答案。

```cpp
#include <iostream>
#include <map>

using namespace std;

map<int, int> mp;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n, k;
        scanf("%d%d", &n, &k);
        for (int i = 1; i <= n; ++i) {
            int t;
            scanf("%d", &t);
            mp[t]++;
        }
        int l = 0, r = n;
        while (l < r) {
            int mid = l + r >> 1;
            int t = 0;
            for (auto [_, cnt] : mp) {
                t += max(0, cnt - mid + 1);
            }
            if (t <= k + 1) r = mid;
            else l = mid + 1;
        }
        int res = -1;
        for (auto [val, cnt] : mp) {
            if (cnt >= l) res = max(res, val);
        }
        cout << res << endl;
        mp.clear();
    }
    return 0;
}
```