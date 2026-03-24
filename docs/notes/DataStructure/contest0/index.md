---
title: 【数据结构】C语言测试题
---
# 【数据结构】C语言测试题

## 📢 Annoucnement

- 这场不计分，**如果计分会在结束后发博客**，如果题目太多会开个仓库发。
- 因为题比较多，每道题都比较简单，所以只大概说说思路。

另外说一下感受吧，我感觉虽然一直训练，但是感觉遇到瓶颈了，越打越乏力，想切几道水题释放释放压力，十道题竟然做了一个多小时，属实不应该。这套题非常基础，如果有一定的底子应该是可以直接秒的。**很多题数据范围不给，让用户猜**。

## 函数题

### 长整数转化成16进制字符串

开一个栈先从低位到高位存一下，然后不断取栈顶存到 p 里面就行。

```cpp
void f( long int x, char *p ) {
    if (x == 0) {
        p[0] = 48, p[1] = 0;
        return;
    }
    int l = 0;
    if (x < 0) p[l++] = '-', x = -x;
    char tt[34] = {0};
    int len = 0;
    while (x) {
        int t = x % 16;
        char c;
        if (t < 10) c = t + 48;
        else c = t - 10 + 'A';
        tt[len++] = c;
        x /= 16;
    }
    for (int i = len - 1; i >= 0; --i) p[l++] = tt[i];
    p[l] = 0;
}
```

### 数组循环右移

开个临时数组存一下右移之后的结果，然后复制回来，**注意 m 可能大于 n，最好先取个模**。

```cpp
void ArrayShift( int a[], int n, int m ) {
    m %= n;
    int b[MAXN], i;
    for (i = 0; i < n - m; ++i) {
        b[i + m] = a[i];
    }
    for (i = 0; i < m; ++i) {
        b[i] = a[i + n - m];
    }
    for (i = 0; i < n; ++i) {
        a[i] = b[i];
    }
}
```

### 有序表的增删改查操作

除了二分，上课都讲了，需要灵活应用一下，二分记一下板子就行，我这里二分写挂一次。

```cpp
int lower_bound(int a[], int value) {
    int l = 0, r = Count;
    while (l < r) {
        int mid = l + r >> 1;
        if (a[mid] >= value) r = mid;
        else l = mid + 1;
    }
    return l;
}

int insert(int a[ ], int value) {
    int p = lower_bound(a, value);
    if (a[p] == value) return -1;
    for (int i = Count; i > p; --i) {
        a[i] = a[i - 1];
    }
    a[p] = value;
    Count++;
    return 0;
}

int del(int a[ ], int value) {
    int p = lower_bound(a, value);
    if (a[p] != value) return -1;
    for (int i = p; i < Count - 1; ++i) {
        a[i] = a[i + 1];
    }
    Count--;
    return 0;
}

int modify(int a[ ], int value1, int value2) {
    if (a[lower_bound(a, value1)] != value1 || a[lower_bound(a, value2)] == value2) return -1;
    del(a, value1), insert(a, value2);
    return 0;
}

int query(int a[ ], int value) {
    int p = lower_bound(a, value);
    if (a[p] != value) return -1;
    else return p;
}
```

### 建立学生信息链表

按要求模拟即可。

```cpp
void input() {
    int num, score;
    char name[20];
    while (scanf("%d%s%d", &num, name, &score), num) {
        struct stud_node *cur = malloc(sizeof(struct stud_node));
        cur->num = num, cur->score = score;
        strcpy(cur->name, name);
        if (!head) head = cur;
        else tail->next = cur;
        tail = cur;
    }
}
```

### 链表逆置

开个变量存一下前驱，顺着遍历一遍，依次把 next 指向前驱。

```cpp
struct ListNode *reverse( struct ListNode *head ) {
    struct ListNode *pre = NULL;
    while (head) {
        // printf("%p ", head);
        struct ListNode *tmp = head->next;
        head->next = pre;
        pre = head;
        head = tmp;
    }
    return pre;
}
```

### 求自定类型元素序列的中位数

数据量有点大，不能直接暴力，因为他限制 c 语言，只能自己写一个 $n\log n$ 的排序了，我感觉归并排序好写，就写的归并排序。

```cpp
ElementType b[MAXN];

void msort(ElementType a[], ElementType b[], int l, int r) {
    if (l == r) return;
    int mid = l + r >> 1;
    msort(a, b, l, mid), msort(a, b, mid + 1, r);
    int h = l, h1 = l, h2 = mid + 1;
    while (h1 <= mid && h2 <= r) {
        if (a[h1] <= a[h2]) b[h++] = a[h1++];
        else b[h++] = a[h2++];
    }
    while (h1 <= mid) b[h++] = a[h1++];
    while (h2 <= r) b[h++] = a[h2++];
    for (int i = l; i <= r; ++i) a[i] = b[i];
}

ElementType Median( ElementType A[], int N ) {
    msort(A, b, 0, N - 1);
    return A[N / 2];
}
```

### 使用函数输出一个整数的逆序数

参考第一道的思路，甚至比第一道还简单，不用转进制，不断取最后一位加到结果的最后一位即可。

```cpp
int reverse( int number ) {
    int res = 0;
    while (number) {
        res = res * 10 + number % 10;
        number /= 10;
    }
    return res;
}
```

## 编程题

### 素数对猜想

如果不会筛法，暴力判素数 $O(n\sqrt{n})$ 理论能过，我代码用的线筛。

```cpp
#include <stdio.h>
#define N 100010

int v[N], prime[N], l;

int main() {
    int n, res = 0;
    scanf("%d", &n);
    for (int i = 2; i <= n; ++i) {
        if (v[i] == 0) {
            v[i] = i;
            if (i - prime[l] == 2) res++;
            prime[++l] = i;
        }
        for (int j = 1; j <= l; ++j) {
            if (prime[j] > v[i] || prime[j] > n / i) break;
            v[i * prime[j]] = prime[j];
        }
    }
    printf("%d\n", res - 1);
    return 0;
}
```

### 数列求和-加强版

答案非常大，需要高精，但是这道题比较特殊，可以先认为，从低到高第 i 位（从 0 计数）为 a * (n - i)，然后模拟一下进位，逆序输出。

```cpp
#include <stdio.h>
#define N 200000

int res[N];

int main() {
    int a, n;
    scanf("%d%d", &a, &n);
    for (int i = 0; i < n; ++i) {
        res[i] = a * (n - i);
    }
    for (int i = 0; i < n * 2; ++i) {
        res[i + 1] += res[i] / 10;
        res[i] %= 10;
    }
    int f = 0;
    for (int i = n * 2; i >= 0; --i) {
        if (res[i]) f = 1;
        if (f) putchar(res[i] + 48);
    }
    if (!f) putchar(48);
    putchar('\n');
    return 0;
}
```

### 乘法口诀数列

按要求模拟即可，但是要注意，**行末不能输出空格，会格式错误**。

```cpp
#include <stdio.h>
#define N 1000

int a[N];

int main() {
    int n;
    scanf("%d%d%d", &a[1], &a[2], &n);
    for (int i = 1, j = 2; j <= n; ++i) {
        int t = a[i] * a[i + 1];
        if (t < 10) a[++j] = t;
        else a[++j] = t / 10, a[++j] = t % 10;
    }
    for (int i = 1; i <= n; ++i) {
        if (i == 1) printf("%d", a[i]);
        else printf(" %d", a[i]);
    }
    return 0;
}
```