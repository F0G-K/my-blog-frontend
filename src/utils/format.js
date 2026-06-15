/**
 * 轻量格式化工具(不引第三方日期库)。
 */

function pad(n) {
  return String(n).padStart(2, '0')
}

/** 解析后端日期(datetime / 时间戳)为 Date,失败返回 null */
function toDate(value) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** 格式化为 YYYY-MM-DD */
export function formatDate(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 格式化为 YYYY-MM-DD HH:mm */
export function formatDateTime(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 相对时间(刚刚 / x 分钟前 / x 小时前 / x 天前 / 具体日期) */
export function fromNow(value) {
  const d = toDate(value)
  if (!d) return ''
  const diff = Date.now() - d.getTime()
  const min = 60 * 1000
  const hour = 60 * min
  const day = 24 * hour
  if (diff < min) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`
  return formatDate(d)
}
