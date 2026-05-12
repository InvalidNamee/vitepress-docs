---
title: 【数据结构】树和二叉树
---
# 【数据结构】树和二叉树

防止复制粘贴，代码还是结束之后补上。

这次稍微变难了点，但是主要问题还是函数题你想调试就只能直接提交，然后盲调；或者补出来他隐藏的函数本地调，**运行测试这个功能跟没有一样**。

## 函数题

### 二叉搜索树中的最近公共祖先

我勒个 LCA 不记录父亲，给我整不会了😇，那我只能暴搜了，如果两个点都在一个子树里，就递归往那个子树搜，直到第一次不在同一边，这次的点就是 LCA。

本来 LCA 可以树上倍增，预处理 $O(n \log n)$，单次查询 $O(\log n)$，然后这题强制单次查询最劣可能达到 $O(n^2)$，不理解。

```cpp
int find(Tree T, int val) {
    if (!T) return 0;
    else if (T->Key == val) return 1;
    else return find(T->Left, val) | find(T->Right, val);
}

int LCA( Tree T, int u, int v ) {
    if (!T) return ERROR;
    // printf(" %d", T->Key);
    if (find(T->Left, u) && find(T->Left, v)) return LCA(T->Left, u, v);
    else if (find(T->Right, u) && find(T->Right, v)) return LCA(T->Right, u, v);
    else if (find(T, u) && find(T, v)) return T->Key;
    else return ERROR;
}
```

### 先序输出叶结点

直接 dfs 即可。

```cpp
void PreorderPrintLeaves( BinTree BT ) {
    if (!BT) return;
    if (!BT->Left && !BT->Right) printf(" %c", BT->Data);
    else {
        PreorderPrintLeaves(BT->Left);
        PreorderPrintLeaves(BT->Right);
    }
}
```

### 求二叉树高度

dfs 回溯的时候统计高度，当前结点的高度 = max{左子树高度，右子树高度} + 1。这种回溯时更新状态的做法有个更专业的名字，叫树形dp，是动态规划的一个分支。

```cpp
int max(int a, int b) {
    return a > b ? a : b;
}

int GetHeight( BinTree BT ) {
    if (!BT) return 0;
    else return max(GetHeight(BT->Left) + 1, GetHeight(BT->Right) + 1);
}
```

### 二叉树的遍历

按要求模拟即可。

```cpp
void InorderTraversal( BinTree BT ) {
    if (!BT) return;
    InorderTraversal(BT->Left);
    printf(" %c", BT->Data);
    InorderTraversal(BT->Right);
}

void PreorderTraversal( BinTree BT ) {
    if (!BT) return;
    printf(" %c", BT->Data);
    PreorderTraversal(BT->Left);
    PreorderTraversal(BT->Right);
}

void PostorderTraversal( BinTree BT ) {
    if (!BT) return;
    PostorderTraversal(BT->Left);
    PostorderTraversal(BT->Right);
    printf(" %c", BT->Data);
}

typedef struct _node {
    struct TNode *val;
    struct _node *ne;
} Node;
Node *h, *t;

int empty() {
    return h == NULL;
}

void push(BinTree val) {
    Node *p = (Node *)malloc(sizeof(Node));
    p->val = val, p->ne = NULL;
    if (empty()) h = t = p;
    else t->ne = p, t = p;
}

BinTree pop() {
    Node *p = h;
    h = h->ne;
    if (!h) t = NULL;
    return p->val;
}

void LevelorderTraversal( BinTree BT ) {
    if (!BT) return;
    push(BT);
    while (!empty()) {
        BinTree x = pop();
        printf(" %c", x->Data);
        if (x->Left) push(x->Left);
        if (x->Right) push(x->Right);
    }
}
```

## 编程题

这几个题都不是很容易，感觉加点数据量可以去 xcpc 当签到题了。

### 哈夫曼编码

做一遍哈夫曼算法，求出来最优树的权值。然后只需要检查是不是前缀码以及权值是否和这个最优的相等。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 64;
int f[128];
string s[N];

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n, m;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> q;
    for (int i = 1; i <= n; ++i) {
        char c;
        int t;
        cin >> c >> t;
        f[c] = t;
        q.emplace(t);
    }
    int w = 0;
    while (q.size() != 1) {
        int a = q.top();
        q.pop();
        int b = q.top();
        q.pop();
        q.emplace(a + b);
        w += a + b;
    }
    cin >> m;
    while (m--) {
        int tw = 0;
        for (int i = 1; i <= n; ++i) {
            char c;
            cin >> c >> s[i];
            tw += s[i].length() * f[c];
        }
        bool flag = true;
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (i == j) continue;
                if (s[j].length() <= s[i].length() && s[j] == s[i].substr(0, s[j].length())) {
                    flag = false;
                    break;
                }
            }
            if (!flag) break;
        }
        if (tw != w || !flag) cout << "No" << endl;
        else cout << "Yes" << endl;
    }
    return 0;
}
```

### 是否完全二叉搜索树

先把树构建出来，然后我的判断逻辑是这样的，bfs 入队的时候允许非空的结点的空的儿子入队，出队的时候如果出现 空 结点 …… 空，这种情况相当于前面缺结点了，就判定为不是。

```cpp
#include <iostream>
#include <queue>

using namespace std;

struct Node {
    int val;
    Node *ls, *rs;
};

Node *insert(Node *u, int val) {
    if (!u) {
        u = new Node;
        u->val = val;
        u->ls = u->rs = nullptr;
        return u;
    }
    else if (val > u->val) u->ls = insert(u->ls, val);
    else u->rs = insert(u->rs, val);
    return u;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int n;
    cin >> n;
    Node *tr = nullptr;
    for (int i = 1; i <= n; ++i) {
        int val;
        cin >> val;
        tr = insert(tr, val);
    }
    queue<Node*> q;
    q.emplace(tr);
    bool first = true;
    int flag = 0;
    while (!q.empty()) {
        Node *x = q.front();
        q.pop();
        if (x == nullptr) {
            if (flag == 0) flag = 1;
        }
        else {
            if (flag == 1) flag = 2;
            if (first) first = false;
            else cout << ' ';
            cout << x->val;
            q.emplace(x->ls);
            q.emplace(x->rs);
        }
    }
    cout << endl;
    cout << (flag != 2 ? "YES" : "NO") << endl;
    return 0;
}
```

### 完全二叉树的层序遍历

这道题关键应该在于一个小性质，对于一个完全二叉树，子树一定都是完全二叉树；一个结点的两个子树中一定至少有一棵满的（假设左子树一共有 n 层，考虑两棵子树排在最后一层，如果不够 2<sup>n</sup>，那右子树是满的，如果超过了，那么左子树是满的），左子树一定不比右子树小，而且两棵子树的大小一定相差不超过 2<sup>n</sup>。因此对于一个序列，<strong>先取最右边的为根，然后枚举哪棵子树是满的，满的那棵子树的大小，有且仅有一个组合是满足所有限制的。</strong>然后按照算出的子树大小分割剩余的序列，**递归生成左右子树**。最后再 bfs 一遍输出。

```cpp
#include <iostream>
#include <queue>

using namespace std;

const int N = 40;

struct Node {
    int val;
    Node *ls, *rs;
};

int a[N];

Node *build(int l, int r) {
    if (l > r) return nullptr;
    Node *u = (Node *)malloc(sizeof(Node));
    u->val = a[r];
    r--;
    for (int i = 1; i <= 5; ++i) {
        int lsize = (1 << i) - 1, rsize = r - l + 1 - lsize;
        if (lsize >= rsize && rsize >= 0 && abs(lsize - rsize) <= (1 << i)) {
            u->ls = build(l, l + lsize - 1), u->rs = build(l + lsize, r);
            break;
        }
        rsize = (1 << i) - 1, lsize = r - l + 1 - rsize;
        if (lsize >= 0 && rsize >= 0 && abs(lsize - rsize) <= (1 << i)) {
            u->ls = build(l, l + lsize - 1), u->rs = build(l + lsize, r);
            break;
        }
    }
    return u;
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
    Node *tr = build(1, n);
    queue<Node*> q;
    q.emplace(tr);
    bool first = true;
    int flag = 0;
    while (!q.empty()) {
        Node *x = q.front();
        q.pop();
        if (x == nullptr) {
            if (flag == 0) flag = 1;
        }
        else {
            if (flag == 1) flag = 2;
            if (first) first = false;
            else cout << ' ';
            cout << x->val;
            q.emplace(x->ls);
            q.emplace(x->rs);
        }
    }
    cout << endl;
    return 0;
}
```

### 银行排队问题之单队列多窗口服务

> 我不能理解，题上说 `这里假设每位顾客事务被处理的最长时间为60分钟`，然后样例给出了 61，如果不管就 wa，如果强制让 p 和 60 取 min 就过了。我只能说诡异。

模拟就行，按照时间遍历顾客，假设现在遍历到第 i 个，开一个数组 ls 维护每个窗口处理完前 i - 1 个顾客需要的时间。考虑当前顾客选择窗口，所有时间小于t<sub>i</sub> 都是等价的，为了方便处理直接改成 t<sub>i</sub>，对后来的顾客也没有影响，现在只需要求 $idx = \argmin_k ls_k$。然后 ls<sub>idx</sub> += t<sub>i</sub>，更新一下这个窗口的任务，之后继续下一个人。

```cpp
#include <iostream>

using namespace std;

const int N = 1010, M = 11;

int ls[M], cnt[M]; // last finish tine
int t[N], p[N];
 

int main() {
    int n, k;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        scanf("%d%d", &t[i], &p[i]);
        p[i] = min(p[i], 60);
    }
    scanf("%d", &k);
    int tot = 0, max_t = 0, lst_t = 0;
    for (int i = 1; i <= n; ++i) {
        int mn_idx = 1;
        for (int j = 1; j <= k; ++j) {
            ls[j] = max(ls[j], t[i]);
            if (ls[j] < ls[mn_idx]) mn_idx = j;
        }
        tot += ls[mn_idx] - t[i];
        max_t = max(max_t, ls[mn_idx] - t[i]);
        ls[mn_idx] += p[i];
        cnt[mn_idx]++;
    }
    for (int i = 1; i <= k; ++i) lst_t = max(lst_t, ls[i]);
    printf("%.1f %d %d\n", (double)tot / n, max_t, lst_t);
    for (int i = 1; i <= k; ++i) {
        if (i != 1) putchar(' ');
        printf("%d", cnt[i]);
    }
    printf("\n");
    return 0;
}
```

### 银行业务队列简单模拟

奇数偶数先单独存一下，然后两个奇数一个偶数一直输出，如果没有了就跳过，直到全输出完。

```cpp
#include <iostream>
#include <queue>

using namespace std;

bool first = true;

void pop(queue<int> &q) {
    if (!q.empty()) {
        if (first) first = false;
        else printf(" ");
        printf("%d", q.front());
        q.pop();
    }
}

int main() {
    queue<int> q1, q2;
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t;
        scanf("%d", &t);
        if (t & 1) q1.emplace(t);
        else q2.emplace(t);
    }
    int f = 1;
    while (!q1.empty() || !q2.empty()) {
        if (f % 3 == 0) pop(q2);
        else pop(q1);
        f = (f + 1) % 3;
    }
    printf("\n");
    return 0;
}
```