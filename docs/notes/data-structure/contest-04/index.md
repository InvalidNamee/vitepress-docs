---
title: 【数据结构】在线测试2
---
# 【数据结构】在线测试2

三道题相对都比较水，都是一遍过。

## T1

创建一个栈，压栈（如果空间不够重新申请两倍的），弹栈。

```cpp
Stack CreateStack(int MaxSize) {
    Stack st = (Stack)malloc(sizeof(struct SNode));
    st->MaxSize = MaxSize;
    st->Top = -1;
    st->Data = (ElementType *)malloc(sizeof(ElementType) * MaxSize);
    return st;
}

void Push(Stack S, ElementType x) {
    if (IsFull(S)) {
        ElementType *a = S->Data;
        S->Data = (ElementType *)malloc(sizeof(ElementType) * S->MaxSize * 2);
        for (int i = 0; i < S->MaxSize; ++i) S->Data[i] = a[i];
        S->MaxSize *= 2;
    }
    S->Data[++S->Top] = x;
}

ElementType Pop(Stack S) {
    return S->Data[S->Top--];
}
```

## T2

链表存队列的，入队出队，需要特判一下空队列。

```cpp
void AddQ(Queue Q, QueueElementType x) {
    PtrToNode t = (PtrToNode)malloc(sizeof(struct Node));
    t->Qdata = x;
    t->Next = NULL;
    if (IsEmpty(Q)) Q->Front = Q->Rear = t;
    else Q->Rear->Next = t, Q->Rear = t;
}

QueueElementType DeleteQ(Queue Q) {
    PtrToNode t = Q->Front;
    QueueElementType res = t->Qdata;
    Q->Front = Q->Front->Next;
    if (!Q->Front) Q->Rear = NULL;
    return t;
}
```

## T3

KMP 的 next 数组，就是求最长公共前后缀，但是我忘了，本来准备现推。

**但是**他 `int Next[100]`，那我可要暴力了，最好不要学我。

```cpp
#include <string.h>
int cmp(char *s, char *t, int l) {
    for (int i = 0; i < l; ++i) {
        if (s[i] != t[i]) return 0;
    }
    return 1;
}

void NextValue(char *s, int *ne) {
    int n = strlen(s);
    ne[0] = -1;
    for (int i = 1; i < n; ++i) {
        for (int j = i - 1; j >= 0; --j) {
            if (cmp(s, s + i - j, j)) {
                ne[i] = j;
                break;
            }
        }
    }
}
```