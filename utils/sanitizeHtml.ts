const allowedTags = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul'
])

const globalAttributes = new Set(['class', 'title'])
const tagAttributes: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan'])
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value)

const isSafeUrl = (value: string) => {
  const normalized = value.trim().replaceAll(/\s+/g, '').toLowerCase()

  return (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('tel:') ||
    normalized.startsWith('/') ||
    normalized.startsWith('#')
  )
}

const sanitizeAttributes = (tagName: string, attrs: string) => {
  const allowedForTag = tagAttributes[tagName] || new Set<string>()
  const sanitized: string[] = []
  const pattern = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(attrs))) {
    const name = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ''

    if (name.startsWith('on') || name === 'style' || name === 'srcdoc') continue
    if (!globalAttributes.has(name) && !allowedForTag.has(name)) continue
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue

    sanitized.push(`${name}="${escapeHtml(value)}"`)

    if (tagName === 'a' && name === 'target' && value === '_blank') {
      sanitized.push('rel="noopener noreferrer"')
    }
  }

  return sanitized.length ? ` ${sanitized.join(' ')}` : ''
}

export const sanitizeHtml = (html: string) => {
  const source = html.trim()

  if (!source) return ''

  if (!hasHtmlTag(source)) {
    return escapeHtml(source).replaceAll(/\r?\n/g, '<br>')
  }

  return source
    .replaceAll(/<script[\s\S]*?<\/script>/gi, '')
    .replaceAll(/<style[\s\S]*?<\/style>/gi, '')
    .replaceAll(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replaceAll(/<object[\s\S]*?<\/object>/gi, '')
    .replaceAll(/<embed[\s\S]*?<\/embed>/gi, '')
    .replaceAll(/<\/?([a-z][\w:-]*)([^<>]*)>/gi, (match, rawName: string, attrs: string) => {
      const tagName = rawName.toLowerCase()

      if (!allowedTags.has(tagName)) return escapeHtml(match)
      if (match.startsWith('</')) return `</${tagName}>`
      if (tagName === 'br' || tagName === 'hr') return `<${tagName}>`

      return `<${tagName}${sanitizeAttributes(tagName, attrs)}>`
    })
}
