---
title: 2025春训第十三场
---
# 2025春训第十三场

## A. 团结

其实非常简单，但是我中招了😭

他这个操作等价于先把 $\gcd_{i = 1}^{n} A_i$算出来，然后在 1 ～ n 里面选一些数和前面的结果取 gcd，直到结果为 1.

最坏最坏的情况，就是 gcd(n - 1, n) = 1，然后和前面的取 gcd 一定是 1，代价是 3；所以只需要枚举代价是否存在 1 和代价是 2 的两种情况即可。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 100010;

int gcd(int a, int b) {
	return b ? gcd(b, a % b) : a;
}

int a[N];

int main() {
	int n;
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i) {
		scanf("%d", &a[i]);
	}
	int g = a[1];
	if (g == 1) printf("0\n");
	else if (gcd(g, n) == 1) printf("1\n");
	else if (gcd(g, n - 1) == 1) printf("2\n");
	else printf("3\n");
	return 0;
}	
```

## **B. 染色**

简单的 dfs 题，从根开始往下搜，遇到不符合的就染色，统计次数即可。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 100010;
vector<int> ed[N];
int col[N], t[N];
int res;

void dfs(int x) {
	if (col[x] != t[x]) {
		col[x] = t[x];
		res++;
	}
	for (int y : ed[x]) {
		col[y] = col[x];
		dfs(y);
	}
}

int main() {
	int n;
	scanf("%d", &n);
    for (int i = 2; i <= n; ++i) {
    	int p;
    	scanf("%d", &p);
    	ed[p].push_back(i);
	}
	for (int i = 1; i <= n; ++i) {
		scanf("%d", &t[i]);
	}
	dfs(1);
	printf("%d\n", res);
	return 0;
}
```

## C. 三元组

（还在 TLE 但是有戏）

## **E. 思维导图**

一笔画问题，离散 2-2 刚讲了。对于每个连通块，记度数为奇数的点有 k 个，则需要画 $\lceil \frac{k}{2} \rceil$ 次。把连通块的答案累加即可。

```cpp
#include <iostream>
#include <vector>

using namespace std;

const int N = 10010;

int deg[N];
vector<int> ed[N];
int cnt;
bool v[N];

void dfs(int x) {
	if (v[x]) return;
	v[x] = true;
	if (deg[x] & 1) cnt++;
	for (int y : ed[x]) {
		dfs(y);
	}
}

int main() {
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; ++i) {
		int x, y;
		scanf("%d%d", &x, &y);
		ed[x].push_back(y);
		ed[y].push_back(x);
		deg[x]++, deg[y]++;
	} 
	int res = 0;
	for (int i = 1; i <= n; ++i) {
		if (!v[i]) {
			cnt = 0;
			dfs(i);
			if (!cnt) res++;
			else res += (cnt + 1) >> 1;
		}	
	}
	printf("%d\n", res);
	return 0;
}
```

## F. **ESP\_8266**

这就是个单纯的模拟题，没什么需要注意的。

```python
import re
l = []
while True:
    try:
        s = input()
        l.append(s)
    except EOFError:
        break
s = '\n'.join(l)
pos = 0
for i in re.findall(r'\([+-]\d{2}\)', s):
    if i[1] == '+':
        pos += int(i[2:4])
    else:
        pos -= int(i[2:4])
print(pos)
```