---
title: 【数据结构】一般线性表
---
# 【数据结构】一般线性表

代码会在结束后更新，题都很简单，恶心的一点是**不给数据范围让用户自己试**。

## 函数题

### 带头结点的链式表操作集

```cpp
List MakeEmpty() {
    return malloc(sizeof(struct LNode));
}

Position Find( List L, ElementType X ) {
    while (L) {
        if (L->Data == X) return L;
        L = L->Next;
    }
    return ERROR;
}

bool Insert( List L, ElementType X, Position P ) {
    while (L && L->Next != P) {
        L = L->Next;
    }
    if (!L) {
        printf("Wrong Position for Insertion\n");
        return false;
    }
    List t = malloc(sizeof(struct LNode));
    t->Data = X;
    t->Next = L->Next, L->Next = t;
    return true;
}

bool Delete( List L, Position P ) {
    if (!P) {
        printf("Wrong Position for Deletion\n");
        return false;
    }
    while (L && L->Next != P) {
        L = L->Next;
    }
    if (!L || !L->Next) {
        printf("Wrong Position for Deletion\n");
        return false;
    }
    L->Next = P->Next;
    free(P);
    return true;
}
```

### 求链表的倒数第m个元素

```cpp
ElementType Find( List L, int m ) {
    int len = 0;
    for (List t = L; t; t = t->Next) len++;
    m = len - m;
    while (L && m--) L = L->Next;
    return L ? L->Data : ERROR;
}
```

### 单链表分段逆转

一段一段做，段内反转，同时需要记录下一个点和这段最左边的点的地址，段间连起来，**第 4 个点段错误是因为没有特判 n < k 爆掉了**，别问我怎么知道的。

```cpp
void K_Reverse( List L, int K ) {
    int len = 0;
    for (List p = L; p; p = p->Next) len++;
    len--;
    if (len < K) return;
    len = len / K * K;
    List h = L, cur, pre, tmp;
    L = L->Next;
    for (int i = 0; i < len; i += K) {
        cur = L, pre = L, tmp = NULL;
        L = L->Next;
        for (int j = 1; j < K; ++j) {
            tmp = L->Next;
            L->Next = pre;
            pre = L;
            L = tmp;
        }
        h->Next = pre;
        h = cur;
    }
    h->Next = tmp;
}
```

### 共享后缀的链表

先往后移动长的链表的头指针，对齐之后同时右移，直到重合，类似暴力的 lca 的做法。

```cpp
PtrToNode Suffix( List L1, List L2 ) {
    int l1 = 0, l2 = 0;
    for (List p = L1->Next; p; p = p->Next) l1++;
    for (List q = L2->Next; q; q = q->Next) l2++;
    if (l1 > l2) for (int i = 0; i < l1 - l2; ++i) L1 = L1->Next;
    else for (int i = 0; i < l2 - l1; ++i) L2 = L2->Next;
    while (L1 && L1 != L2) L1 = L1->Next, L2 = L2->Next;
    return L1;
}
```

## 编程题

### 两个有序链表序列的合并

参考[归并排序的合并](https://oi-wiki.org/basic/merge-sort/#%E5%90%88%E5%B9%B6)。

```cpp
#include <iostream>
#include <list>

using namespace std;

int main() {
    list<int> a, b, c; // STL！爽！
    int t;
    while (scanf("%d", &t), t != -1) a.emplace_back(t);
    while (scanf("%d", &t), t != -1) b.emplace_back(t);
    auto h1 = a.begin(), h2 = b.begin();
    while (h1 != a.end() && h2 != b.end()) {
        if (*h1 <= *h2) c.emplace_back(*h1++);
        else c.emplace_back(*h2++);
    }
    while (h1 != a.end()) c.emplace_back(*h1++);
    while (h2 != b.end()) c.emplace_back(*h2++);
    if (c.empty()) printf("NULL");
    for (auto h = c.begin(); h != c.end(); h++) {
        if (h == c.begin()) printf("%d", *h);
        else printf(" %d", *h);
    }
    return 0;
}
```

### 一元多项式的乘法与加法运算

其实就是一个高精乘法和高精加法，而且不用进位。个人感觉他的本意是想考链表，但是数据给太小了，直接开 2000 的数组就能跑过去。如果 p 给个 10<sup>6</sup> 以上那就得老老实实用链表了。

```cpp
#include <iostream>

using namespace std;
const int N = 1010;
int a[N], b[N], c[N * 2];

int main() {
    int n, m;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t, p;
        scanf("%d%d", &t, &p);
        a[p] = t;
    }
    scanf("%d", &m);
    for (int i = 1; i <= m; ++i) {
        int t, p;
        scanf("%d%d", &t, &p);
        b[p] = t;
    }
    for (int i = 0; i <= 1000; ++i) {
        for (int j = 0; j <= 1000; ++j) {
            c[i + j] += a[i] * b[j];
        }
    }
    bool print = false;
    for (int i = 2000; i >= 0; --i) {
        if (c[i]) {
            if (!print) print = true, printf("%d %d", c[i], i);
            else printf(" %d %d", c[i], i);
        }
    }
    if (!print) printf("0 0\n");
    else printf("\n");
    for (int i = 0; i <= 1000; ++i) a[i] += b[i];
    print = false;
    for (int i = 1000; i >= 0; --i) {
        if (a[i]) {
            if (!print) print = true, printf("%d %d", a[i], i);
            else printf(" %d %d", a[i], i);
        }
    }
    if (!print) printf("0 0\n");
    else printf("\n");
    return 0;
}
```

### 多项式 A 除以 B

这道其实是高精除法，本意应该也是想考链表，但是实测数组开 10<sup>4</sup> 能过，p 给个 10<sup>5</sup> 以上差不多就能卡掉数组了。

```cpp
#include <iostream>
#include <cmath>

using namespace std;

const int N = 10010;
const double eps = 0.05;
double a[N], b[N], c[N];

void print(double a[]) {
    int t = 0;
    for (int i = 0; i <= 10000; ++i) {
        if (fabs(a[i]) >= eps) t++;
    }
    if (!t) printf("0 0 0.0\n");
    else {
        printf("%d", t);
        for (int i = 10000; i >= 0; --i) {
            if (fabs(a[i]) >= eps) printf(" %d %.1lf", i, a[i]);
        }
        printf("\n");
    }
}

int main() {
    int n, m, l1 = 0, l2 = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int t, p;
        scanf("%d%d", &p, &t);
        l1 = max(l1, p);
        a[p] = t;
    }
    scanf("%d", &m);
    for (int i = 1; i <= m; ++i) {
        int t, p;
        scanf("%d%d", &p, &t);
        l2 = max(l2, p);
        b[p] = t;
    }
    for (int i = l1 - l2; i >= 0; --i) {
        if (a[i + l2]) {
            c[i] = a[i + l2] / b[l2];
            for (int j = 0; j <= l2; ++j) {
                a[i + j] -= c[i] * b[j];
            }
        }
    }
    print(c);
    print(a);
    return 0;
}
```