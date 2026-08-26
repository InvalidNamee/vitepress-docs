---
title: 【数据结构】特殊线性表
---
# 【数据结构】特殊线性表

代码会在结束后更新。

题也是很简单，但是，**太恶心了**，🤮。

- **题面**：来给我实现个栈，你不需要知道我怎么用，你不需要知道我的下标从哪里开始，不需要知道栈顶存不存元素，但是你要给我写对！
- **题面**：我有一个中缀表达式，你给我转成后缀，你只需要知道你的式子里可包含 `+ - * / ( )`，式子长度不大于 20。
- **题面**：我有两个矩阵，给我乘一下，你不需要知道矩阵的大小，但是你占用的内存必须小于 64 MB。

没做之前看上面的话可能感觉不出什么，等你做完了之后，你一定会幡然醒悟。

不要惊讶于下面的一些突然冒出来的结论，因为题目没说，但是据我尝试也只能这样。

## 函数题

观前提醒，**我的能正常通过代码在自测区复制样例然后跑自测全是 TLE**，不要怀疑自己，可能就是题目或者评测机的问题。

### 在一个数组中实现两个堆栈

逻辑上很好实现，从两边往中间存就行。Top1 初始值赋 -1, Top2 初始值赋 MaxSize，否则 MLE。

```cpp
Stack CreateStack( int MaxSize ) {
    Stack st = (Stack)malloc(sizeof(struct SNode));
    st->MaxSize = MaxSize;
    st->Top1 = -1, st->Top2 = MaxSize;
    st->Data = (ElementType *)malloc(sizeof(ElementType) * MaxSize);
    return st;
}

bool Push( Stack S, ElementType X, int Tag ) {
    if (S->Top1 + 1 == S->Top2) {
        printf("Stack Full\n");
        return false;
    }
    if (Tag == 1) {
        S->Data[++S->Top1] = X;
    }
    else {
        S->Data[--S->Top2] = X;
    }
    return true;
}

ElementType Pop( Stack S, int Tag ) {
    if (Tag == 1) {
        if (S->Top1 == -1) {
            printf("Stack 1 Empty\n");
            return ERROR;
        }
        return S->Data[S->Top1--];
    }
    else {
        if (S->Top2 == S->MaxSize) {
            printf("Stack 2 Empty\n");
            return ERROR;
        }
        return S->Data[S->Top2++];
    }
}
```

### 另类堆栈

我没能理解到这个另类堆栈到底怎么另类了，我就是正常的写了一个栈，**我越想让他按照题意另类，他越MLE**。

```cpp
bool Push( Stack S, ElementType X ) {
    if (S->Top == S->MaxSize) {
        printf("Stack Full\n");
        return false;
    }
    S->Data[++S->Top] = X;
    return true;
}

ElementType Pop( Stack S ) {
    if (!S->Top) {
        printf("Stack Empty\n");
        return ERROR;
    }
    return S->Data[S->Top--];
}
```

### 另类循环队列

这道题不怎么毒，按要求模拟就行。

```cpp
bool AddQ( Queue Q, ElementType X ) {
    if (Q->Count == Q->MaxSize) {
        printf("Queue Full\n");
        return false;
    }
    Q->Data[(Q->Front + Q->Count) % Q->MaxSize] = X;
    Q->Count++;
    return true;
}

ElementType DeleteQ( Queue Q ) {
    if (Q->Count == 0) {
        printf("Queue Empty\n");
        return ERROR;
    }
    int res = Q->Data[Q->Front];
    Q->Front = (Q->Front + 1) % Q->MaxSize;
    Q->Count --;
    return res;
}
```

### Deque

Push 和 Pop 是左端，Inject 和 Eject 是右端，按要求模拟即可。

```cpp
Deque CreateDeque() {
    Deque q = malloc(sizeof(struct DequeRecord));
    PtrToNode h = malloc(sizeof(struct Node));
    h->Next = h->Last = NULL;
    q->Front = q->Rear = h;
    return q;
}

int Push( ElementType X, Deque D ) {
    PtrToNode t = malloc(sizeof(struct Node));
    t->Element = X;
    t->Last = D->Front;
    t->Next = D->Front->Next;
    if (t->Next == NULL) D->Rear = t;
    if (D->Front->Next) D->Front->Next->Last = t;
    D->Front->Next = t;
    return 1;
}

ElementType Pop( Deque D ) {
    if (D->Front->Next == NULL) return ERROR;
    int res = D->Front->Next->Element;
    PtrToNode t = D->Front->Next;
    t->Last->Next = t->Next;
    if (t->Next) t->Next->Last = t->Last;
    if (t == D->Rear) D->Rear = D->Front;
    free(t);
    return res;
}

int Inject( ElementType X, Deque D ) {
    PtrToNode t = malloc(sizeof(struct Node));
    t->Element = X;
    D->Rear->Next = t;
    t->Last = D->Rear;
    t->Next = NULL;
    D->Rear = t;
    return 1;
}

ElementType Eject( Deque D ) {
    if (D->Front == D->Rear) return ERROR;
    int res = D->Rear->Element;
    PtrToNode t = D->Rear;
    D->Rear = D->Rear->Last;
    D->Rear->Next = NULL;
    free(t);
    return res;
}
```

## 编程题

### 出栈序列的合法性

每一条都开个栈模拟即可，栈容量超了，或者对应元素取不出来都直接判 NO，其他情况判 YES。

```cpp
#include <iostream>

using namespace std;

const int N = 1010;
int a[N], st[N], tp;
int n, m, k;

bool check() {
    tp = 0;
    for (int i = 1, j = 0; i <= n; ++i) {
        if (a[i] > j) {
            while (a[i] != j) {
                st[++tp] = ++j;
                if (tp > m) {
                    return false;
                }
            }
            tp--;
        }
        else if (tp && st[tp] == a[i]) tp--;
        else return false;
    }
    return true;
}

int main() {
    scanf("%d%d%d", &m, &n, &k);
    while (k--) {
        for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
        if (check()) printf("YES\n");
        else printf("NO\n");
    }
    return 0;
}
```

### 表达式转换

简要说一下流程，开一个栈存积攒的运算符

- 遇到数字直接输出；
- 遇到 '`(`'直接入栈，初始化 '`)`' 优先级最低；
- 遇到运算符：
  - 检查栈顶，如果优先级相等或更高就先弹栈输出栈顶，直到栈空或者栈顶优先级严格低于当前运算符，
  - 当前运算符入栈；
- 遇到 '`)`'，弹栈输出，直到栈顶为 '`(`'，再弹一次不输出。

最后把栈里面剩下的运算符全部输出。

如果发现调怎么调都过不去，请测试这组数据是否正确

**输入**

```
-1+(-2+3.001)-123/0.123
```

**输出**

```
-1 -2 3.001 + + 123 0.123 / -
```

```cpp
#include <iostream>
#include <sstream>
#include <stack>

using namespace std;

stack<char> op;
bool first = true;

int w(char c) {
    if (c == '+' || c == '-') return 1;
    else if (c == '*' || c == '/') return 2;
    else return 0;
}

void calc() {
    if (first) first = true;
    else cout << ' ';
    cout << op.top() ;
    op.pop();
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    string s;
    getline(cin, s);
    stringstream ss(s);
    bool f = true;
    char c;
    while (ss.peek() != EOF) {
        if (isdigit(ss.peek())) {
            if (first) first = false;
            else cout << ' ';
            while (ss.peek() != EOF && (isdigit(ss.peek()) || ss.peek() == '.')) {
                ss >> c;
                cout << c;
            }
            f = false;
            if (ss.peek() == EOF) break;
        }
        else {
            ss >> c;
            if (c == '(') {
                f = true;
                op.push(c);
            }
            else if (c == ')') {
                while (op.top() != '(') calc();
                op.pop();
                f = false;
            }
            else if (f) {
                if (first) first = false;
                else cout << ' ';
                if (c == '-') cout << c;
                while (ss.peek() != EOF && (isdigit(ss.peek()) || ss.peek() == '.')) {
                    ss >> c;
                    cout << c;
                }
                f = false;
            }
            else {
                while (!op.empty() && w(op.top()) >= w(c)) calc();
                op.push(c);
                f = true;
            }
        }
    }
    while (!op.empty()) calc();
    cout << endl;
    return 0;
}
```

### 稀疏矩阵的处理

**不要尝试动态开数组，会 MLE**，时间复杂度可以亏，但是空间一定得开小一点，实测嵌套 map 可以过，2 ms，600 KB。

```cpp
#include <iostream>
#include <map>
#include <tuple>
#include <vector>

using namespace std;

struct Matrix {
    int n, m;
    map<int, map<int, int>> val;

    void input() {
        int k;
        scanf("%d%d%d", &n, &m, &k);
        for (int i = 0; i < k; ++i) {
            int x, y, z;
            scanf("%d%d%d", &x, &y, &z);
            val[x - 1][y - 1] = z;
        }
    }

    Matrix rev() {
        Matrix b = {m, n};
        for (auto [x, mp] : val) {
            for (auto [y, z] : mp) {
                b.val[y][x] = z;
            }
        }
        return b;
    }

    void print(bool f) {
        if (f) {
            printf("    ");
            for (int i = 0; i < m; ++i) printf("%4d", i + 1);
            printf("\n");
            for (int i = 0; i < n; ++i) {
                printf("%4d", i + 1);
                for (int j = 0; j < m; ++j) {
                    if (val.find(i) != val.end() && val[i].find(j) != val[i].end())
                        printf("%4d", val[i][j]);
                    else
                        printf("   0");
                }
                printf("\n");
            }
        }
        else {
            vector<tuple<int, int, int>> v;
            for (auto [x, mp] : val) {
                for (auto [y, z] : mp) {
                    if (z) v.emplace_back(x + 1, y + 1, z);
                }
            }
            printf("Rows=%d,Cols=%d,r=%ld\n", n, m, v.size());
            for (auto [x, y, z] : v) printf("%d %d %d\n", x, y, z);
        }
    }
};

Matrix operator +(Matrix a, Matrix b) {
    Matrix c = {a.n, b.m};
    for (int i = 0; i < a.n; ++i) {
        for (int j = 0; j < a.m; ++j) {
            bool va = a.val.find(i) != a.val.end() && a.val[i].find(j) != a.val[i].end(), vb = b.val.find(i) != b.val.end() && b.val[i].find(j) != b.val[i].end();
            if (va && vb) {
                c.val[i][j] = a.val[i][j] + b.val[i][j];
            }
            else if (va) c.val[i][j] = a.val[i][j];
            else if (vb) c.val[i][j] = b.val[i][j];
        }
    }
    return c;
}

Matrix operator *(Matrix a, Matrix b) {
    Matrix c = {a.n, b.m};
    for (int i = 0; i < a.n; ++i) {
        for (int j = 0; j < b.m; ++j) {
            for (int k = 0; k < a.m; ++k) {
                bool va = a.val.find(i) != a.val.end() && a.val[i].find(k) != a.val[i].end(), vb = b.val.find(k) != b.val.end() && b.val[k].find(j) != b.val[k].end();
                if (va && vb) c.val[i][j] += a.val[i][k] * b.val[k][j];
            }
        }
    }
    return c;
}

int main() {
    char s[2];
    Matrix a, b;
    a.input(), b.input();
    scanf("%s", s);
    printf("The transformed matrix is:\n");
    a.rev().print(s[0] == 'H');
    if (a.n != b.n || a.m != b.m) printf("Can not add!\n");
    else {
        printf("The added matrix is:\n");
        (a + b).print(s[0] == 'H');
    }
    if (a.m != b.n) printf("Can not multiply!\n");
    else {
        printf("The product matrix is:\n");
        (a * b).print(s[0] == 'H');
    }
    return 0;
}
```