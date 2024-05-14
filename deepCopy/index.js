export function deepCopy(obj, map = new WeakMap()) {
  if (obj === null)
    return obj
  if (obj instanceof Date)
    return new Date(obj)
  if (obj instanceof RegExp)
    return new RegExp(obj)
  if (typeof obj !== 'object')
    return obj

  if (map.has(obj))
    return map.get(obj)

  const copy = Array.isArray(obj) ? [] : {}
  map.set(obj, copy)

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      copy[key] = deepCopy(obj[key], map)
  }

  return copy
}

export function deepCopy2(obj) {
  return JSON.parse(JSON.stringify(obj))
}
