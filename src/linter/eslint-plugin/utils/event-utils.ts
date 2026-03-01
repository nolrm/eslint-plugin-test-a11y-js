/**
 * Event handler detection utilities
 *
 * Provides functions to detect event handlers on JSX and Vue elements
 * for accessibility validation rules.
 */


/**
 * JSX click event handler names
 */
const JSX_CLICK_HANDLERS = [
  'onClick',
  'onClickCapture',
]

/**
 * JSX keyboard event handler names
 */
const JSX_KEYBOARD_HANDLERS = [
  'onKeyDown',
  'onKeyDownCapture',
  'onKeyUp',
  'onKeyUpCapture',
  'onKeyPress',
  'onKeyPressCapture',
]

/**
 * JSX mouse event handler names (excluding click)
 */
const JSX_MOUSE_HANDLERS = [
  'onMouseDown',
  'onMouseDownCapture',
  'onMouseUp',
  'onMouseUpCapture',
  'onMouseOver',
  'onMouseOverCapture',
  'onMouseOut',
  'onMouseOutCapture',
  'onMouseEnter',
  'onMouseLeave',
]

/**
 * JSX focus event handler names
 */
const JSX_FOCUS_HANDLERS = [
  'onFocus',
  'onFocusCapture',
  'onBlur',
  'onBlurCapture',
]

/**
 * Vue click event handler names
 */
const VUE_CLICK_HANDLERS = [
  'click',
  '@click',
  'v-on:click',
]

/**
 * Vue keyboard event handler names
 */
const VUE_KEYBOARD_HANDLERS = [
  'keydown',
  'keyup',
  'keypress',
  '@keydown',
  '@keyup',
  '@keypress',
  'v-on:keydown',
  'v-on:keyup',
  'v-on:keypress',
]

/**
 * Vue mouse event handler names (excluding click)
 */
const VUE_MOUSE_HANDLERS = [
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  '@mousedown',
  '@mouseup',
  '@mouseover',
  '@mouseout',
  '@mouseenter',
  '@mouseleave',
  'v-on:mousedown',
  'v-on:mouseup',
  'v-on:mouseover',
  'v-on:mouseout',
  'v-on:mouseenter',
  'v-on:mouseleave',
]

/**
 * Vue focus event handler names
 */
const VUE_FOCUS_HANDLERS = [
  'focus',
  'blur',
  '@focus',
  '@blur',
  'v-on:focus',
  'v-on:blur',
]

// Module-level Sets for O(1) attribute name lookups (JSX)
const JSX_CLICK_HANDLERS_SET = new Set(JSX_CLICK_HANDLERS)
const JSX_KEYBOARD_HANDLERS_SET = new Set(JSX_KEYBOARD_HANDLERS)
const JSX_MOUSE_HANDLERS_SET = new Set(JSX_MOUSE_HANDLERS)
const JSX_FOCUS_HANDLERS_SET = new Set(JSX_FOCUS_HANDLERS)
const JSX_ALL_HANDLERS_SET = new Set([
  ...JSX_CLICK_HANDLERS,
  ...JSX_KEYBOARD_HANDLERS,
  ...JSX_MOUSE_HANDLERS,
  ...JSX_FOCUS_HANDLERS,
])

// Precomputed Vue event name sets (stripped of @/v-on: prefix) to avoid regex in hot path
const VUE_CLICK_HANDLER_SET = new Set(VUE_CLICK_HANDLERS)
const VUE_CLICK_EVENT_NAMES = new Set(['click'])

const VUE_KEYBOARD_HANDLER_SET = new Set(VUE_KEYBOARD_HANDLERS)
const VUE_KEYBOARD_EVENT_NAMES = new Set(['keydown', 'keyup', 'keypress'])

const VUE_MOUSE_HANDLER_SET = new Set(VUE_MOUSE_HANDLERS)
const VUE_MOUSE_EVENT_NAMES = new Set(['mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'])

const VUE_FOCUS_HANDLER_SET = new Set(VUE_FOCUS_HANDLERS)
const VUE_FOCUS_EVENT_NAMES = new Set(['focus', 'blur'])

const VUE_ALL_HANDLER_SET = new Set([...VUE_CLICK_HANDLERS, ...VUE_KEYBOARD_HANDLERS, ...VUE_MOUSE_HANDLERS, ...VUE_FOCUS_HANDLERS])
const VUE_ALL_EVENT_NAMES = new Set([...VUE_CLICK_EVENT_NAMES, ...VUE_KEYBOARD_EVENT_NAMES, ...VUE_MOUSE_EVENT_NAMES, ...VUE_FOCUS_EVENT_NAMES])

/**
 * Check if a JSX element has a click handler
 */
export function hasJSXClickHandler(node: any): boolean {
  return node.attributes?.some((attr: any) =>
    attr.type !== 'JSXSpreadAttribute' && attr.name?.name && JSX_CLICK_HANDLERS_SET.has(attr.name.name)
  ) ?? false
}

/**
 * Check if a JSX element has a keyboard handler
 */
export function hasJSXKeyboardHandler(node: any): boolean {
  return node.attributes?.some((attr: any) =>
    attr.type !== 'JSXSpreadAttribute' && attr.name?.name && JSX_KEYBOARD_HANDLERS_SET.has(attr.name.name)
  ) ?? false
}

/**
 * Check if a JSX element has a mouse handler (excluding click)
 */
export function hasJSXMouseHandler(node: any): boolean {
  return node.attributes?.some((attr: any) =>
    attr.type !== 'JSXSpreadAttribute' && attr.name?.name && JSX_MOUSE_HANDLERS_SET.has(attr.name.name)
  ) ?? false
}

/**
 * Check if a JSX element has a focus handler
 */
export function hasJSXFocusHandler(node: any): boolean {
  return node.attributes?.some((attr: any) =>
    attr.type !== 'JSXSpreadAttribute' && attr.name?.name && JSX_FOCUS_HANDLERS_SET.has(attr.name.name)
  ) ?? false
}

/**
 * Check if a JSX element has any event handler (single attribute pass)
 */
export function hasJSXEventHandler(node: any): boolean {
  return node.attributes?.some((attr: any) =>
    attr.type !== 'JSXSpreadAttribute' && attr.name?.name && JSX_ALL_HANDLERS_SET.has(attr.name.name)
  ) ?? false
}

/**
 * Helper to check Vue attribute with various prefixes
 */
function hasVueEventAttribute(node: any, handlerSet: Set<string>, eventNames: Set<string>): boolean {
  const startTag = node.startTag
  if (!startTag?.attributes) return false

  return startTag.attributes.some((attr: any) => {
    if (attr.key?.name && handlerSet.has(attr.key.name)) {
      return true
    }
    if (attr.directive && attr.key?.name?.name === 'on') {
      const argument = attr.key?.argument?.name
      return argument && eventNames.has(argument)
    }
    return false
  })
}

/**
 * Check if a Vue element has a click handler
 */
export function hasVueClickHandler(node: any): boolean {
  return hasVueEventAttribute(node, VUE_CLICK_HANDLER_SET, VUE_CLICK_EVENT_NAMES)
}

/**
 * Check if a Vue element has a keyboard handler
 */
export function hasVueKeyboardHandler(node: any): boolean {
  return hasVueEventAttribute(node, VUE_KEYBOARD_HANDLER_SET, VUE_KEYBOARD_EVENT_NAMES)
}

/**
 * Check if a Vue element has a mouse handler (excluding click)
 */
export function hasVueMouseHandler(node: any): boolean {
  return hasVueEventAttribute(node, VUE_MOUSE_HANDLER_SET, VUE_MOUSE_EVENT_NAMES)
}

/**
 * Check if a Vue element has a focus handler
 */
export function hasVueFocusHandler(node: any): boolean {
  return hasVueEventAttribute(node, VUE_FOCUS_HANDLER_SET, VUE_FOCUS_EVENT_NAMES)
}

/**
 * Check if a Vue element has any event handler (single attribute pass)
 */
export function hasVueEventHandler(node: any): boolean {
  return hasVueEventAttribute(node, VUE_ALL_HANDLER_SET, VUE_ALL_EVENT_NAMES)
}

export {
  JSX_CLICK_HANDLERS,
  JSX_KEYBOARD_HANDLERS,
  JSX_MOUSE_HANDLERS,
  JSX_FOCUS_HANDLERS,
  VUE_CLICK_HANDLERS,
  VUE_KEYBOARD_HANDLERS,
  VUE_MOUSE_HANDLERS,
  VUE_FOCUS_HANDLERS,
}
