/**
 * 断点常量(与 styles/breakpoints.css 保持一致)。
 * JS 侧判断设备形态时统一引用这里,别写魔法数字。
 */
export const BP_MOBILE = 768
export const BP_TABLET = 1024

/** 媒体查询字符串,可配合 matchMedia 使用 */
export const MQ = {
  mobile: `(max-width: ${BP_MOBILE - 1}px)`,
  tablet: `(min-width: ${BP_MOBILE}px) and (max-width: ${BP_TABLET - 1}px)`,
  desktop: `(min-width: ${BP_TABLET}px)`,
}
