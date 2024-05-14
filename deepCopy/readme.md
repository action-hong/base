# 深拷贝

## 什么是深拷贝

mdn 的概况：

> 对象的深拷贝是指其属性与其拷贝的源对象的属性不共享相同的引用 (指向相同的底层值) 的副本。因此，当你更改源或副本时，可以确保不会导致其他对象也发生更改；也就是说，你不会无意中对源或副本造成意料之外的更改。这种行为与浅拷贝的行为形成对比，在浅拷贝中，对源或副本的更改可能也会导致其他对象的更改 (因为两个对象共享相同的引用)。

顾名思义递归地复制一个对象的所有属性，保证其属性结构一致、但不共享相同的引用。当更改源对象或副本时，不会导致其他对象发生变化

## 深拷贝的作用与应用场景

- 需要用到某个对象，且可能会对其进行改动，但不希望改变原来的对象 (可能有很多个地方使用)，这时就可以使用深拷贝

## 分析各种深拷贝实现的弊端

### 使用 `JSON` 来序列化

```js
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

上诉方法较为简单，对应可序列化的对象很好用，但是也有一定的缺陷：

- 无法处理函数、`Symbol`，`Regex`，`Date`
- 无法处理循环引用

### 使用 `structuredClone`

它允许将源中的[可转移对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Transferable_objects)转移到新的副本，但同样也有缺陷：

- 在克隆一个不可序列化的对象时会失败，同 `JSON.stringify()` 一样
- 无法处理循环引用

## 实现深拷贝

这里我们来手动实现一个深拷贝

```js
function deepCopy(obj) {
  if (obj === null)
    return obj

  if (typeof obj !== 'object')
    return obj
  const copy = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      copy[key] = deepCopy(obj[key])
  }
  return map
}
```

这里我们只考虑可序列化的场景：

- 原始类型就直接返回
- 对象的话，判断是数组还是对象，以此遍历递归拷贝

接下来，需要考虑处理 `Date`、`Regex` 的情况：

```js
function deepCopy(obj) {
  if (obj === null)
    return obj

  if (typeof obj !== 'object')
    return obj

  if (obj instanceof Date)
    return new Date(obj)
  if (obj instanceof RegExp)
    return new RegExp(obj)
  // ...
}
```

接着我们考虑循环引用的情况，因为循环引用即两个对象之间通过属性相互引用，因此我们需要在拷贝对象前，就将副本提前存起来，下次碰到同一个对象，直接将之前存好的副本拿出来用，这样就解决循环引用的问题了

办法也很容易，我们使用 `WeakMap`，用源对象作为 key：

```js
function deepCopy(obj, map = new WeakMap()) {
  // ...

  // 检查是否已经处理过了，返回
  if (map.has(obj))
    return map.get(obj)

  const copy = Array.isArray(obj) ? [] : {}
  // 提前存起来，不然下面递归时碰到循环引用就死循环了
  map.set(obj, copy)

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      copy[key] = deepCopy(obj[key], map)
  }

  return copy
}
```

这样一个简单的深度拷贝功能就完成了

## 深拷贝性能优化

如何优化？

## 压力测试

- 仓库里先写了几个单测
