# 部署与搜索索引

站点由 EdgeOne Pages 监听 `main` 分支并自动部署。GitHub Actions 会等待 EdgeOne 确认本次提交已经上线，然后调用 Algolia Crawler API 重新抓取站点，并等待重建任务完成。

## GitHub 配置

在仓库的 **Settings → Secrets and variables → Actions → Secrets** 中添加：

| Secret | 来源 |
| --- | --- |
| `ALGOLIA_CRAWLER_ID` | Algolia Crawler 的 UUID |
| `ALGOLIA_CRAWLER_USER_ID` | Algolia Crawler 设置页中的 User ID |
| `ALGOLIA_CRAWLER_API_KEY` | Algolia Crawler 设置页中的 API Key |

Crawler User ID 和 Crawler API Key 与站点前端使用的 Algolia Application ID、Search API Key 不同，不要将 Crawler 凭据写入源码。

## 一次性设置

1. 添加上述三个 GitHub Secrets。
2. 确认 Algolia Crawler 的起始地址是 `https://docs.starlab.top/`，索引名为 `vitepress-docs`。
3. 建议在 Crawler 配置中加入 `https://docs.starlab.top/sitemap.xml`。
4. 保持 EdgeOne Pages 生产环境关联 `main`，并保持自动部署开启。

VitePress 构建会在产物根目录生成 `deployment-id.txt`，内容为当前 Git 提交号。工作流在推送到 `main` 时运行，也可以在 GitHub Actions 页面手动执行；它会轮询这个文件，只有线上提交号与触发工作流的提交完全一致时才会重爬。等待 EdgeOne 上线、重爬 API 返回错误或任务超时都会使工作流失败。
