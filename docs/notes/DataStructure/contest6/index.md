---
title: 【数据结构】图的操作与应用
---
# 【数据结构】图的操作与应用

防止复制粘贴，代码还是结束之后补上。

更难了，但是感觉不如函数题盲调。

## 函数题

三道题都是板子，一定知道该怎么做，接下来就是如何驯服指针了。

### 邻接矩阵存储图的深度优先遍历

```cpp
void DFS( MGraph Graph, Vertex V, void (*Visit)(Vertex) ) {
    if (Visited[V]) return;
    Visited[V] = true;
    Visit(V);
    for (int i = 0; i < Graph->Nv; ++i) {
        if (i != V && Graph->G[V][i] != INFINITY) DFS(Graph, i, Visit);
    }
}
```

### 邻接表存储图的广度优先遍历

```cpp
typedef struct _node {
    Vertex val;
    struct _node *ne;
} Node;
Node *h, *t;

int empty() {
    return h == NULL;
}

void push(Vertex val) {
    Node *p = (Node *)malloc(sizeof(Node));
    p->val = val, p->ne = NULL;
    if (empty()) h = t = p;
    else t->ne = p, t = p;
}

Vertex pop() {
    Node *p = h;
    h = h->ne;
    if (!h) t = NULL;
    return p->val;
}

void BFS ( LGraph Graph, Vertex S, void (*Visit)(Vertex) ) {
    Visited[S] = true;
    push(S);
    while (!empty()) {
        Vertex x = pop();
        Visit(x);
        for (PtrToAdjVNode iter = Graph->G[x].FirstEdge; iter; iter = iter->Next) {
            Vertex y = iter->AdjV;
            if (!Visited[y]) {
                Visited[y] = true;
                push(y);
            }
        }
    }
}
```

### Count Connected Components

```cpp
int vis[MaxVertexNum];

void dfs(int x, LGraph Graph) {
    if (vis[x]) return;
    vis[x] = true;
    for (PtrToAdjVNode iter = Graph->G[x].FirstEdge; iter; iter = iter->Next) {
        dfs(iter->AdjV, Graph);
    }
}

int CountConnectedComponents( LGraph Graph ) {
    int res = 0;
    for (int i = 0; i < Graph->Nv; ++i) {
        if (!vis[i]) {
            dfs(i, Graph);
            res++;
        }
    }
    return res;
}
```

## 编程题

### 公路村村通

最小生成树板子，我用了 Kruskal。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010, M = 3010;

int fa[N];

int getfa(int x) {
    return x == fa[x] ? x : fa[x] = getfa(fa[x]);
}

struct Edge {
    int w, x, y;
} ed[M];

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) {
        fa[i] = i;
    }
    for (int i = 1; i <= m; ++i) {
        scanf("%d%d%d", &ed[i].x, &ed[i].y, &ed[i].w);
    }
    sort(ed + 1, ed + m + 1, [](Edge a, Edge b) {
        return a.w < b.w;
    });
    int t = 0, res = 0;
    for (int i = 1; i <= m; ++i) {
        int x = getfa(ed[i].x), y = getfa(ed[i].y);
        if (x == y) continue;
        t++;
        res += ed[i].w;
        fa[y] = x;
    }
    if (t != n - 1) printf("-1\n");
    else printf("%d\n", res);
    return 0;
}
```

### 城市间紧急救援

惊现天梯赛 L2 题，而且还不是那种比较水的 L2。

也算是裸的 Dijkstra 板子，但是维护的东西太多了初学非常容易挂，设城市驻扎人数为 a，路径长度为 dis，途径救援队人数最多为 f，最短路条数为 cnt，边权为 e，前驱为 pre，更新的思路是

- $dis_y > dis_x + e$，说明之前的都不在最短路上，直接全部覆盖 $dis_y = dis_x + e,\ f_y = f_x + a_y, \ cnt_y = cnt_x,\ pre_y = x$
- $dis_y = dis_x + e \land f_y > f_x + a_y$，之前的最短路不满足 f 最优覆盖 f 和前驱，之前的 cnt 仍然是最短路，所以累加 cnt，$\ f_y = f_x + a_y, \ cnt_y += cnt_x,\ pre_y = x$
- $dis_y = dis_x + e \land f_y \le f_x + a_y$ 当前这几条不满足 f 的最优性，但是仍然可能是最短路，只更新 cnt，$cnt_y += cnt_x$。

之后还涉及一个根据 pre 输出路径的问题，第一次写也容易出问题。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>

using namespace std;

const int N = 500;

int a[N], dis[N], f[N], pre[N], cnt[N];
bool vis[N];
vector<pair<int, int>> ed[N];

void print(int x) {
    if (pre[x] != -1) {
        print(pre[x]);
        printf(" %d", x);
    }
    else printf("%d", x);
}

int main() {
    int n, m, s, d;
    scanf("%d%d%d%d", &n, &m, &s, &d);
    for (int i = 0; i < n; ++i) scanf("%d", &a[i]);
    for (int i = 0; i < m; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        ed[x].emplace_back(z, y);
        ed[y].emplace_back(z, x);
    }
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
    memset(dis, 0x3f, sizeof(dis));
    memset(pre, -1, sizeof(pre));
    dis[s] = 0;
    cnt[s] = 1;
    f[s] = a[s];
    q.emplace(dis[s], s);
    while (!q.empty()) {
        int x = q.top().second;
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        for (auto [e, y] : ed[x]) {
            if (dis[y] > dis[x] + e) {
                dis[y] = dis[x] + e;
                cnt[y] = cnt[x];
                f[y] = f[x] + a[y];
                pre[y] = x;
                q.emplace(dis[y], y);
            }
            else if (dis[y] == dis[x] + e) {
                if (f[y] < f[x] + a[y]) {
                    f[y] = f[x] + a[y];
                    pre[y] = x;
                }
                cnt[y] += cnt[x];
            }
        }
    }
    printf("%d %d\n", cnt[d], f[d]);
    print(d);
    printf("\n");
    return 0;
}
```

### 关键活动

拓扑排序dp，记完成任务 i 最短时间为 f<sub>i</sub>，关于关键路径，我的思路是对于每个点，给耗时最大的那几条路径的入边建个反图，dp 出结果之后找到 f 最大的点在建的反图跑一遍 bfs，途经的边全标上，然后排序输出。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
#include <algorithm>

using namespace std;

const int N = 110;

vector<tuple<int, int, int>> ed[N];
vector<pair<int, int>> rev[N];
vector<tuple<int, int, int>> res;
int deg[N], f[N];
bool v[N];

int main() {
    int n, m, t = 0;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        ed[x].emplace_back(z, i, y);
        deg[y]++;
    }
    queue<int> q;
    for (int i = 1; i <= n; ++i) {
        if (deg[i] == 0) q.emplace(i);
    }
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        t = max(t, f[x]);
        for (auto [e, i, y] : ed[x]) {
            if (f[y] < f[x] + e) {
                f[y] = f[x] + e;
                rev[y] = {{i, x}};
            }
            else if (f[y] == f[x] + e) {
                rev[y].emplace_back(i, x);
            }
            if (--deg[y] == 0) q.emplace(y);
        }
    }
    bool flag = true;
    for (int i = 1; i <= n; ++i)
        if (deg[i]) {
            flag = false;
            break;
        }
    if (flag) {
        printf("%d\n", t);
        for (int i = 1; i <= n; ++i) {
            if (f[i] == t) {
                v[i] = true;
                q.emplace(i);
            }
        }
        while (!q.empty()) {
            int x = q.front();
            q.pop();
            for (auto [i, y] : rev[x]) {
                res.emplace_back(y, x, i);
                if (v[y]) continue;
                v[y] = true;
                q.emplace(y);
            }
        }
        sort(res.begin(), res.end(), [](tuple<int, int, int> a, tuple<int, int, int> b) {
            return get<0>(a) == get<0>(b) ? get<2>(a) > get<2>(b) : get<0>(a) < get<0>(b);
        });
        for (auto [a, b, _] : res) {
            printf("%d->%d\n", a, b);
        }
    }
    else {
        printf("0\n");
    }
    return 0;
}
```