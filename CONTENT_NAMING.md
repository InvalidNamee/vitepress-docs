# 内容命名规范

本规范适用于 `docs/` 中今后新增的页面、目录和静态资源。历史内容可在维护时逐步迁移，不要求一次性重命名。

## 路径

- 路径只使用小写 ASCII 字母、数字和短横线（`-`）。
- 多个单词使用短横线连接，不使用驼峰或下划线。
- 年份使用四位数，例如 `2026`，不使用 `26`。
- 平台或赛事缩写在路径中也使用小写，例如 `cses`、`icpc`、`upcpc`。
- 名称应能说明内容，避免未经说明的缩写。

示例：

```text
docs/acm/nowcoder-summer-2026/
docs/acm/icpc-xian-2025/
docs/notes/discrete-math/
docs/notes/deep-learning-basics/
```

## 有序内容

- 场次、章节等编号至少使用两位数字：`00`、`01`、`02`、……。
- 每篇有序内容使用 `NN/index.md`，相关图片与页面放在同一目录。
- 系列首页使用系列目录下的 `index.md`。

示例：

```text
docs/acm/nowcoder-summer-2026/
├── index.md
├── 01/
│   ├── index.md
│   └── solution-diagram.png
└── 02/
    └── index.md
```

## 静态资源

- 文件名使用小写 `kebab-case`。
- 使用能够表达图片内容的名称，避免 `image.png`、`Sketch.png`、UUID 等无语义名称。
- 页面专用资源优先与该页面的 `index.md` 放在同一目录。

## 重命名

- 已发布页面重命名时，必须同步更新站内链接和资源引用。
- 每个发生变化的公开路径都要追加到仓库根目录的 `redirects.json`。
- `redirects.json` 是平台无关的映射清单；部署到具体平台时，应将其转换为该平台支持的永久重定向配置。
