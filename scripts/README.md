# 算法标签脚本

`annotate_algorithm_tags.py` 扫描 ACM Markdown 中尚无 `algorithm-tags` 的二、三级标题，将每个完整 Markdown 文件、候选标题和 solved.ac 标签表发送给 OpenAI-compatible Chat Completions API。LLM 负责区分题目标题与普通小节，并只在有明确依据时给题目选择标签。

脚本默认只显示 diff，不修改文件。只有传入 `--write` 才会原子写入。

## 扫描

扫描所有尚未标注的候选标题，不调用 API：

```bash
npm run tags:scan
```

也可以只扫描指定文件或目录：

```bash
python3 scripts/annotate_algorithm_tags.py --scan-only docs/acm/gplt/
```

## 调用 LLM

配置 API 密钥：

```bash
export LLM_API_KEY='your-api-key'
```

默认模型为 `ds-v4-flash`，请求会显式发送 `"thinking": {"type": "disabled"}`。可以通过环境变量或参数覆盖模型：

```bash
export LLM_MODEL='your-model'
python3 scripts/annotate_algorithm_tags.py --model your-model
```

需要临时启用思考或完全交给服务端默认值时，分别使用 `--thinking enabled` 和 `--thinking default`。

默认请求 `https://api.openai.com/v1/chat/completions`。OpenAI-compatible 服务可以另外配置：

```bash
export LLM_BASE_URL='https://example.com/v1'
```

先处理一个文件并预览 diff：

```bash
npm run tags:suggest -- --limit 1
```

确认结果后写入：

```bash
npm run tags:suggest -- --limit 1 --write
```

脚本会缓存通过校验的 LLM 响应，因此先预览再加 `--write` 不会重复请求。使用 `--refresh` 可以忽略缓存。

## 安全校验

- LLM 必须对每个候选标题返回 `problem`、`section` 或 `uncertain`。
- 只有至少存在一个明确标签的 `problem` 会写入标签；没有明显标签时必须返回 `uncertain` 并保持文件不变。
- 自动标注不会把通用的 `implementation`（实现）作为候选标签，避免用它兜底。
- 确认是普通小节的标题会写入不可见的 `<!-- algorithm-tags-ignore -->`，避免以后重复调用 API；删除该注释即可重新判断。
- 标签必须来自 `data/solved-ac-tags.json`，重复、未知或数量异常都会拒绝整份文件的修改。
- 已有标签、代码块中的伪标题和非 Markdown 文件不会处理。
- 单个文件失败不会写入半成品，最终进程以非零状态退出。

完整参数见：

```bash
python3 scripts/annotate_algorithm_tags.py --help
```

注意：调用 API 时会发送完整 Markdown 文件。请根据所用服务评估代码内容、费用和上下文长度。
