'use strict';
Array.prototype.quicksort = function(compare) {
  // if (typeof compare !== 'function' || this.length <= 1) {
  //   return this
  // }
  const stack = []
  stack.push([0, this.length - 1])
  while (stack.length) {
    let _ = stack.pop()
    let i = _[0], l = _[0]
    let j = _[1], r = _[1]
    let mid = this[Math.floor((l + r) / 2)]
    do {
      while (this[i] < mid) i++
      while (this[j] > mid) j--
      if (i <= j) {
        let t = this[i]
        this[i] = this[j]
        this[j] = t
        i ++
        j --
      }
    } while (i <= j)
    if (i < r) stack.push([i, r])
    if (l < j) stack.push([l, j])
  }
  return this
}

const arr1 = [3,1,2,4,8,3,4,1,2,5,6,10,50,12,3,5,6,7,8]
const arr2 = [3,1,2,4,8,3,4,1,2,5,6,10,50,12,3,5,6,7,8]
console.time('quicksort')
arr1.quicksort()
console.timeEnd('quicksort')
console.log(arr1)

console.time('sort')
arr2.sort((a, b) => a - b)
console.timeEnd('sort')
console.log(arr2)

function quicksort2 (arr) {
  if (!arr || arr.length < 2) return arr
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr[pivotIndex]
  const left = []
  const right = []
  arr.forEach((v, i) => {
    if (i === pivotIndex) return
    if (v < pivot) {
      left.push(v)
    } else {
      right.push(v)
    }
  })
  return [...left, pivot, ...right]
}

let arr3 = [3,1,2,4,8,3,4,1,2,5,6,10,50,12,3,5,6,7,8]
console.time('quicksort2')
arr3 = quicksort2(arr3)
console.timeEnd('quicksort2')
console.log(arr3)
