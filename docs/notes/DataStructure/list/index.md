---
title: 【数据结构】线性表
---
# 【数据结构】线性表

## 📢 Announcement

- 本系列在讲完之前会**持续更新**。
- 以下代码若未说明**默认维护单链表**。
- 代码下附一个**交互器**，可以直接在本地编译运行加深理解或检验正确性。
- 面对面讲而且还是手写的难免会出现一些小瑕疵或者纰漏，经检验有问题的会修正。
- 因为习惯问题，代码和板书可能会有些许不同。

## 顺序存储

### 代码

```cpp
#include <stdio.h>
#define N 100

typedef struct list {
    int elements[N], length;
} List;
// 纯 C 定义结构体不能直接 List l，但是可以 typedef 一下让他可以
List l; 

void init(List *l) {
    // 初始化: 如果是全局变量可有可无
    l->length = 0;
}

int insert(List *l, int p, int x) {
    // 插入: 把新元素 x 插入到 p 位置 (等价于插入到第 p 个元素前)
    if (p < 0 || p > l->length) return -1; // 下标越界
    int i;
    for (i = l->length - 1; i >= p; --i) {
        l->elements[i + 1] = l->elements[i];
    }
    l->elements[p] = x;
    l->length++;
    return 0;
}

int search(List *l, int x) {
    // 顺序查找: 元素 x 第一次出现的位置
    int i;
    for (i = 0; i < l->length; ++i) {
        if (l->elements[i] == x) return i;
    }
    return -1;
}

int delete(List *l, int p) {
    // 删除: 删除第 p 个元素
    if (p < 0 || p >= l->length) return -1; // 下标越界
    int i;
    for (i = p + 1; i < l->length; ++i) {
        l->elements[i - 1] = l->elements[i];
    }
    l->length--;
    return 0;
}

void print(List *l) {
    if (l->length == 0) {
        printf("[Empty list]\n");
        return;
    }
    int i;
    for (i = 0; i < l->length; ++i) {
        printf("%d ", *(l->elements + i));
    }
    printf("\n");
}

// 下面是交互的部分，如果只是看链表实现的话可以忽略

void clear_input() {
    // 清空输入缓冲，防止错误输入导致死循环
    int c;
    while ((c = getchar()) != '\n' && c != EOF) { }
}

void warn_invalid() {
    printf("Invalid input format\n");
    clear_input();
}

int main() {
    init(&l);
    while (1) {
        int op;
        printf("> ");
        if (scanf("%d", &op) != 1) {
            warn_invalid();
            continue;
        }
        if (op == 1) {
            int p, x;
            if (scanf("%d%d", &p, &x) != 2) {
                warn_invalid();
                continue;
            }
            printf(insert(&l, p, x) ? "Fail\n" : "Success\n");
        }
        else if (op == 2) {
            int x, res;
            if (scanf("%d", &x) != 1) {
                warn_invalid();
                continue;
            }
            res = search(&l, x);
            if (~res) printf("The first occurrance of element %d: %d\n", x, res);
            else printf("Not found\n");
        }
        else if (op == 3) {
            int p;
            if (scanf("%d", &p) != 1) {
                warn_invalid();
                continue;
            }
            printf(delete(&l, p) ? "Fail\n" : "Success\n");
        }
        else if (op == 4) {
            printf("Elegant quit\n");
            break;
        }
        else printf("Invalid Option\n");
        print(&l);
    }
    return 0;
}
```
### 自检

```bash
❯ cd "/Users/star/codes/DataStructure/list/" && gcc 顺序.c -o 顺序 && "/Users/star/codes/DataStructure/list/"顺序
> 输入awa
Invalid input format
> 1 0 1
Success
1 
> 1 0 2
Success
2 1 
> 1 2 3
Success
2 1 3 
> 1 5 5
Fail
2 1 3 
> 1 -1 132
Fail
2 1 3 
> 1 3 4
Success
2 1 3 4 
>  1 4 5
Success
2 1 3 4 5 
> 2 1
The first occurrance of element 1: 1
2 1 3 4 5 
> 2 5
The first occurrance of element 5: 4
2 1 3 4 5 
> 2 awa
Invalid input format
> 2 123
Not found
2 1 3 4 5 
> 3 3
Success
2 1 3 5 
> 3 1
Success
2 3 5 
> 3 123
Fail
2 3 5 
> 4
Elegant quit
```

## 链式存储

### 代码

```c
#include <stdio.h>
#include <stdlib.h>
#define N 100

int a[N];

typedef struct node {
    int element;
    struct node *next;
} Node;

int get_length(Node *h) {
    // 查询长度
    int res = 0;
    for (Node *p = h; p; p = p->next) {
        res++;
    }
    return res;
}

Node *find_x(Node *h, int x) {
    // 查找值为 x 的第一个结点的指针
    for (Node *p = h; p; p = p->next) {
        if (p->element == x) return p;
    }
    return NULL;
}

Node *find(Node *h, int p) {
    // 查找第 p 个元素的指针
    if (p < 0) return NULL;
    Node *t = h;
    while (p-- && t) {
        t = t->next;
    }
    return t;
}

Node *insert(Node *h, int p, int x) {
    // 在第 p 个元素之前插入 x
    if (p == 0) {
        Node *t = malloc(sizeof(Node));
        t->element = x;
        t->next = h;
        return t;
    }
    Node *pre = find(h, p - 1);
    if (!pre) return h; // 失败了
    Node *t = malloc(sizeof(Node));
    t->element = x;
    t->next = pre->next;
    pre->next = t;
    return h;
}

Node *delete(Node *h, int p) {
    // 删除第 p 个元素
    if (p == 0) {
        Node *t = h->next;
        free(h);
        return t;
    }
    Node *pre = find(h, p - 1);
    if (!pre || !pre->next) return h;
    Node *t = pre->next;
    pre->next = t->next;
    free(t);
    return h;
}

Node *create(int a[], int n) {
    // 顺序构造一个链表
    Node *h = NULL, *t = NULL;
    for (int i = 0; i < n; ++i) {
        Node *cur = malloc(sizeof(Node));
        cur->element = a[i];
        if (i == 0) h = cur;
        else t->next = cur;
        t = cur;
    }
    return h;
}

Node *create_rev(int a[], int n) {
    // 逆序构造一个链表
    Node *h = NULL;
    for (int i = n - 1; i >= 0; --i) {
        Node *cur = malloc(sizeof(Node));
        cur->element = a[i];
        cur->next = h;
        h = cur;
    }
    return h;
}

void print(Node *h) {
    printf("[List]: ");
    for (Node *p = h; p; p = p->next) {
        printf("%d ", p->element);
    }
    printf("\n");
}

void free_memory(Node *h) {
    while (h) {
        Node *ne = h->next;
        free(h);
        h = ne;
    }
}

void clear_input() {
    // 清空输入缓冲，防止错误输入导致死循环
    int c;
    while ((c = getchar()) != '\n' && c != EOF) { }
}

void warn_invalid() {
    printf("Invalid input format\n");
    clear_input();
}

int main() {
    Node *h = NULL;
    while (1) {
        int op;
        printf("> ");
        if (scanf("%d", &op) != 1) {
            warn_invalid();
            continue;
        }
        if (op == 0) {
            int n, invalid = 0;
            if (scanf("%d", &n) != 1) {
                warn_invalid();
                continue;
            }
            for (int i = 0; i < n; ++i) {
                if (scanf("%d", &a[i]) != 1) {
                    warn_invalid();
                    invalid = 1;
                    break;
                }
            }
            if (invalid) continue;
            free_memory(h);
            h = create(a, n);
        }
        else if (op == 1) {
            int p, x;
            if (scanf("%d%d", &p, &x) != 2) {
                warn_invalid();
                continue;
            }
            h = insert(h, p, x);
        }
        else if (op == 2) {
            int x;
            if (scanf("%d", &x) != 1) {
                warn_invalid();
                continue;
            }
            Node *res = find_x(h, x);
            if (res != NULL) printf("The first occurrance of element %d: %p\n", x, res);
            else printf("Not found\n");
        }
        else if (op == 3) {
            int p;
            if (scanf("%d", &p) != 1) {
                warn_invalid();
                continue;
            }
            h = delete(h, p);
        }
        else if (op == 4) {
            free_memory(h);
            printf("Elegant quit\n");
            break;
        }
        else printf("Invalid Option\n");
        print(h);
    }
    return 0;
}
```

### 自检

```bash
❯ cd "/Users/star/codes/DataStructure/list/" && gcc 链式.c -o 链式 && "/Users/star/codes/DataStructure/list/"链式
> 0
5
2 1 3 5 4
[List]: 2 1 3 5 4 
> 1 3 6
[List]: 2 1 3 6 5 4 
> 1 2 7
[List]: 2 1 7 3 6 5 4 
> 1 10 222
[List]: 2 1 7 3 6 5 4 
> 1 -1 222
[List]: 2 1 7 3 6 5 4 
> 2 1  
The first occurrance of element 1: 0x104129b00
[List]: 2 1 7 3 6 5 4 
> 2 6
The first occurrance of element 6: 0x1041299c0
[List]: 2 1 7 3 6 5 4 
> 2 123
Not found
[List]: 2 1 7 3 6 5 4 
> 2 3
The first occurrance of element 3: 0x104129b10
[List]: 2 1 7 3 6 5 4 
> 3 5
[List]: 2 1 7 3 6 4 
> 2 4
The first occurrance of element 4: 0x1041299b0
[List]: 2 1 7 3 6 4 
> 0 
3
3 1 2
[List]: 3 1 2 
> 2 3
The first occurrance of element 3: 0x1041299a0
[List]: 3 1 2 
> 2 1
The first occurrance of element 1: 0x1041299e0
[List]: 3 1 2 
> 2 2
The first occurrance of element 2: 0x1041299f0
[List]: 3 1 2 
> 4
Elegant quit
```
这种写法查找元素对应的是指针，可以大概验证一下，比如最后三条 `0x1041299e0` - `0x1041299a0` = 64，地址差 64 个 bit，一个 int 和一个指针分别是 4，正好 8 个 byte，8 * 8 = 64。

### *双链表（带头节点）

这份代码是很久之前用 c++ 手写的一个带头结点的双链表，根据题目的要求只写了构造，插入和删除，可供参考。

```cpp
#include <cstdio>

struct Node {
    int val;
    Node *pre, *ne;

    Node() {
        val = 0;
        pre = nullptr;
        ne = nullptr;
    }
};

int main() {
    int n, k, l = 0;
    Node *h = new Node, *t = new Node;
    h->ne = t, t->pre = h;
    scanf("%d%d", &n, &k);
    Node *lst = h;
    for (int i = 1; i <= n; ++i) {
        Node *tmp = new Node;
        scanf("%d", &tmp->val);
        tmp->pre = lst; 
        tmp->ne = lst->ne;
        lst->ne = tmp;
        tmp->ne->pre = tmp;
        lst = lst->ne;
        l++;
    }
    while (k--) {
        char s[2];
        scanf("%s", s);
        if (s[0] == 'D') {
            int x;
            scanf("%d", &x);
            Node *tmp = h->ne;
            if (x > l) continue;
            for (int i = 0; i < x; ++i) tmp = tmp->ne;
            tmp->pre->ne = tmp->ne;
            tmp->ne->pre = tmp->pre;
            delete tmp;
            l--;
        }
        else {
            int x, y;
            scanf("%d%d", &x, &y);
            Node *tmp = h->ne;
            if (x > l) x = l;
            for (int i = 0; i < x; ++i) tmp = tmp->ne;
            Node *p = new Node;
            p->val = y;
            p->pre = tmp->pre;
            tmp->pre->ne = p;
            p->ne = tmp;
            tmp->pre = p;
            l++;
        }
    }
    printf("%d\n", l);
    Node *tmp = h->ne;
    while (tmp != t) {
        printf("%d ", tmp->val);
        tmp = tmp->ne;
    }
    printf("\n");
    return 0;
}
/**************************************************************
	Problem: 9828
	Language: C++
	Result: 正确
	Time:1 ms
	Memory:1304 kb
****************************************************************/
```