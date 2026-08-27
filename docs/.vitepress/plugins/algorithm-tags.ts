import type MarkdownIt from 'markdown-it'

export interface AlgorithmTag {
  id: string
  nameZh: string
  nameEn: string
}

export interface AlgorithmTagsOptions {
  tags: readonly AlgorithmTag[]
}

interface AlgorithmTagsTokenMeta {
  tags: AlgorithmTag[]
}

const directivePattern = /^\s*<!--\s*algorithm-tags\s*:\s*([\s\S]*?)\s*-->\s*$/
const tagIdPattern = /^[a-z0-9_]+$/
const supportedHeadingTags = new Set(['h2', 'h3'])

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sourceLocation(env: unknown, line: number | undefined): string {
  const page = env as { path?: string; relativePath?: string }
  const path = page.relativePath ?? page.path ?? 'unknown Markdown file'
  return line === undefined ? path : `${path}:${line}`
}

export function algorithmTagsPlugin(
  md: MarkdownIt,
  options: AlgorithmTagsOptions,
): void {
  const tagsById = new Map<string, AlgorithmTag>()

  for (const tag of options.tags) {
    if (tagsById.has(tag.id)) {
      throw new Error(`[algorithm-tags] duplicate tag id in tag list: ${tag.id}`)
    }

    tagsById.set(tag.id, tag)
  }

  md.core.ruler.after('block', 'algorithm-tags', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]

      if (token.type !== 'html_block') continue

      const match = token.content.match(directivePattern)
      if (!match) continue

      const line = token.map ? token.map[0] + 1 : undefined
      const location = sourceLocation(state.env, line)
      const previousToken = state.tokens[index - 1]

      if (
        previousToken?.type !== 'heading_close' ||
        !supportedHeadingTags.has(previousToken.tag)
      ) {
        throw new Error(
          `[algorithm-tags] ${location} must appear immediately after a level-two or level-three heading`,
        )
      }

      const ids = match[1].split(',').map((id) => id.trim())

      if (ids.length === 0 || ids.some((id) => id.length === 0)) {
        throw new Error(`[algorithm-tags] ${location} contains an empty tag id`)
      }

      const invalidIds = ids.filter((id) => !tagIdPattern.test(id))
      if (invalidIds.length > 0) {
        throw new Error(
          `[algorithm-tags] ${location} contains invalid tag ids: ${invalidIds.join(', ')}`,
        )
      }

      const duplicateIds = ids.filter((id, idIndex) => ids.indexOf(id) !== idIndex)
      if (duplicateIds.length > 0) {
        throw new Error(
          `[algorithm-tags] ${location} contains duplicate tag ids: ${[...new Set(duplicateIds)].join(', ')}`,
        )
      }

      const unknownIds = ids.filter((id) => !tagsById.has(id))
      if (unknownIds.length > 0) {
        throw new Error(
          `[algorithm-tags] ${location} contains unknown solved.ac tag ids: ${unknownIds.join(', ')}`,
        )
      }

      token.type = 'algorithm_tags'
      token.tag = ''
      token.nesting = 0
      token.content = ''
      token.children = null
      token.meta = {
        tags: ids.map((id) => tagsById.get(id)!),
      } satisfies AlgorithmTagsTokenMeta
    }
  })

  md.renderer.rules.algorithm_tags = (tokens, index) => {
    const { tags } = tokens[index].meta as AlgorithmTagsTokenMeta
    const items = tags
      .map((tag) => {
        const id = escapeHtml(tag.id)
        const nameZh = escapeHtml(tag.nameZh)
        const nameEn = escapeHtml(tag.nameEn)

        return `<li class="algorithm-tag" data-tag-id="${id}" data-tag-name-en="${nameEn}" title="${nameEn}"><span class="algorithm-tag__name">${nameZh}</span><span class="algorithm-tag__id" aria-hidden="true">${id}</span></li>`
      })
      .join('')

    return `<ul class="algorithm-tags" aria-label="算法标签">${items}</ul>\n`
  }
}
