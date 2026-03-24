---
title: 快速傅立叶变换 (FFT)
---
# 快速傅立叶变换 (FFT)

日后可能发展成 acwing 的数学专题打卡记录，和计算几何一样，所以 slug 先给了 math-acwing，但是目前还没多余的时间学数学，最可能用到什么学什么。

## FFT

### AcWing 3122. 多项式乘法

```cpp
#include <iostream>
#include <cmath>

using namespace std;

const int N = 300000;
const double PI = acos(-1);
struct Complex {
    double x, y;
    
    Complex operator +(const Complex &t) const {
        return {x + t.x, y + t.y};
    }

    Complex operator -(const Complex &t) const {
        return {x - t.x, y - t.y};
    }

    Complex operator *(const Complex &t) const {
        return {x * t.x - y * t.y, x * t.y + y * t.x};
    }
} a[N], b[N];
int rev[N], tot, bit;

void fft(Complex a[], int inv) {
    for (int i = 0; i < tot; ++i) {
        if (i < rev[i]) swap(a[i], a[rev[i]]);
    }
    for (int mid = 1; mid < tot; mid <<= 1) {
        Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
        for (int i = 0; i < tot; i += mid * 2) {
            Complex wk = {1, 0};
            for (int j = 0; j < mid; ++j, wk = wk * w1) {
                Complex x = a[i + j], y = wk * a[i + j + mid];
                a[i + j] = x + y, a[i + j + mid] = x - y;
            }
        }
    }
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 0; i <= n; ++i) scanf("%lf", &a[i].x);
    for (int i = 0; i <= m; ++i) scanf("%lf", &b[i].x);
    while ((1 << bit) < n + m + 1) bit++;
    tot = 1 << bit;
    for (int i = 0; i < tot; ++i) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
    fft(a, 1), fft(b, 1);
    for (int i = 0; i < tot; ++i) a[i] = a[i] * b[i];
    fft(a, -1);
    for (int i = 0; i < n + m + 1; ++i) {
        printf("%d ", int(a[i].x / tot + 0.5));
    }
    printf("\n");
    return 0;
}
```

### AcWing 3123. 高精度乘法II

复数乘法运算符写挂，回扣计算几何的向量叉积写挂。

```cpp
#include <iostream>
#include <cstring>
#include <cmath>

using namespace std;
const int N = 300000;
const double PI = acos(-1);

struct Complex {
    double x, y;

    Complex operator +(const Complex &t) const {
        return {x + t.x, y + t.y};
    }

    Complex operator -(const Complex &t) const {
        return {x - t.x, y - t.y};
    }

    Complex operator *(const Complex &t) const {
        return {x * t.x - y * t.y, x * t.y + y * t.x};
    }
} a[N], b[N];
char s[N], t[N];
int rev[N], bit, tot;
int res[N];

void fft(Complex a[], int inv) {
    for (int i = 0; i < tot; ++i) {
        if (i < rev[i]) swap(a[i], a[rev[i]]);
    }
    for (int mid = 1; mid < tot; mid <<= 1) {
        Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
        for (int i = 0; i < tot; i += mid * 2) {
            Complex wk = {1, 0};
            for (int j = 0; j < mid; ++j, wk = wk * w1) {
                Complex x = a[i + j], y = wk * a[i + j + mid];
                a[i + j] = x + y, a[i + j + mid] = x - y;
            }
        }
    }
}

int main() {
    scanf("%s%s", s, t);
    int n = strlen(s) - 1, m = strlen(t) - 1;
    for (int i = 0; i <= n; ++i) a[i] = {double(s[n - i] - 48), 0};
    for (int i = 0; i <= m; ++i) b[i] = {double(t[m - i] - 48), 0};
    while ((1 << bit) < n + m + 1) bit++;
    tot = 1 << bit;
    for (int i = 0; i < tot; ++i) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
    fft(a, 1), fft(b, 1);
    for (int i = 0; i < tot; ++i) a[i] = a[i] * b[i];
    fft(a, -1);
    int len = 0;
    for (int i = 0; i <= n + m; ++i) {
        res[i] = int(a[i].x / tot + 0.5);
    }
    for (len = 0; len <= n + m || res[len]; ++len) {
        res[len + 1] += res[len] / 10, res[len] %= 10;
    }
    while (len > 1 && res[len - 1] == 0) len--;
    for (int i = len - 1; i >= 0; --i) putchar(res[i] + 48);
    putchar('\n');
    return 0;
}
```