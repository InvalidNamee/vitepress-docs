---
title: 【数据结构】在线测试1
---
# 【数据结构】在线测试1

三道题相对都比较水，T1 和 T2 一遍过，T3 wa 了一发，错的特别蠢。

## T1 (20 分)

删除在 (minD, maxD) 范围内的数。可以**双指针**做，用 i 遍历数组，j 表示当前该覆盖的位置，因为只可能往前挪动，在一个数组中操作不会冲突。

```cpp
List Delete(List L, ElementType minD, ElementType maxD) {
    int i, j;
    for (i = 0, j = 0; i <= L->Last; ++i) {
        if (L->Data[i] >= maxD || L->Data[i] <= minD) {
            L->Data[j++] = L->Data[i];
        }
    }
    L->Last = j - 1;
    return L;
}
```

## T2 (30 分)

需要实现

- 链表查找第一个大于 val 的数，并在前面插入 val；
- 链表翻转。

很简单的模拟，注意边界别挂就好。

```cpp
void Insert(List L, ElementType val) {
    List pre = L;
    L = L->Next;
    while (L && L->Data < val) pre = L, L = L->Next;
    List cur = (List)malloc(sizeof(struct LNode));
    cur->Data = val;
    cur->Next = pre->Next;
    pre->Next = cur;
}

void Reverse(List L) {
    List p = L->Next, pre = NULL, tmp = NULL;
    while (p) {
        tmp = p->Next;
        p->Next = pre;
        pre = p;
        p = tmp;
    }
    L->Next = pre;
}
```

## T3 (20 分)

计算 n 以内的所有 Fibonacci 数，并统计递归暴力计算一个 Fibonacci 数过程中，每个下标经过的次数。

实话说，这拓展题比前面的简单，因为 Fibonacci 数增长是指数级的，在限制 c 语言并且不取模的情况下数据量大概在三四十，直接**暴力统计**就能做。

<del>没把数据拉到 1e6 再加个模 998244353 不是很认可</del>

```c
#include <stdio.h>
#define N 100

int f[N];

void work(int n) {
    f[n]++;
    if (n == 1 || n == 0) return;
    else work(n - 1), work(n - 2);
}

int main() {
    int n;
    scanf("%d", &n);
    work(n);
    int a = 0, b = 0, c;
    for (int i = 0; i <= n; ++i) {
        if (i >= 2) {
            c = a + b;
            a = b;
            b = c;
        }
        printf("Fib(%d)=%d,spn=%d\n", i, i == 0 ? 0 : b, f[i]);
    }
    return 0;
}
```