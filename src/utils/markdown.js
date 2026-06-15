/**
 * Markdown 渲染:markdown-it + highlight.js,渲染后用 DOMPurify 净化防 XSS。
 * 同时为标题注入 id 锚点,供文章详情页生成目录(TOC)。
 */
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({
  html: true, // 允许原始 HTML,但渲染后会经 DOMPurify 净化
  linkify: true,
  breaks: false,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
      } catch {
        /* 忽略,降级为转义文本 */
      }
    }
    return md.utils.escapeHtml(code)
  },
})

/** 将标题文本转为锚点 slug */
function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w一-龥-]/g, '')
}

// 重写 heading_open 渲染:注入唯一 id
const defaultHeadingOpen =
  md.renderer.rules.heading_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const inline = tokens[idx + 1]
  const text = inline && inline.type === 'inline' ? inline.content : ''
  let id = slugify(text)
  // 保证 id 唯一
  env.tocSlugs = env.tocSlugs || {}
  if (env.tocSlugs[id] != null) {
    env.tocSlugs[id] += 1
    id = `${id}-${env.tocSlugs[id]}`
  } else {
    env.tocSlugs[id] = 0
  }
  token.attrSet('id', id)
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

// DOMPurify:渲染后净化,放行锚点跳转所需的 id/target/rel
function sanitize(html) {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['id', 'target', 'rel'],
  })
}

/**
 * 渲染 Markdown 为安全 HTML 字符串。
 * @param {string} src Markdown 原文
 * @returns {string} 已净化的 HTML
 */
export function renderMarkdown(src) {
  if (!src) return ''
  return sanitize(md.render(src))
}

/**
 * 渲染并同时提取目录(TOC)。
 * @param {string} src
 * @returns {{ html: string, toc: Array<{ id: string, text: string, level: number }> }}
 */
export function renderWithToc(src) {
  if (!src) return { html: '', toc: [] }
  const env = {}
  const tokens = md.parse(src, env)
  const toc = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.type === 'heading_open') {
      const level = Number(t.tag.slice(1)) // h2 -> 2
      const inline = tokens[i + 1]
      const text = inline && inline.type === 'inline' ? inline.content : ''
      const id = t.attrGet('id')
      // 只收 h1~h3,避免目录过深
      if (level <= 3) toc.push({ id, text, level })
    }
  }
  const html = sanitize(md.renderer.render(tokens, md.options, env))
  return { html, toc }
}

/**
 * 净化任意 HTML(如评论内容,内容应为纯文本但仍做一道防护)。
 * @param {string} html
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html || '')
}
