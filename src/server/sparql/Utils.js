
// source: https://stackoverflow.com/a/42773837
export function * subsets (array, offset = 0) {
  while (offset < array.length) {
    const first = array[offset++]
    for (const subset of subsets(array, offset)) {
      subset.push(first)
      yield subset
    }
  }
  yield []
}
