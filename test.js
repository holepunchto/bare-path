const test = require('brittle')
const path = require('.')

test('posix normalize', (t) => {
  for (const [input, expected = input] of [
    ['foo'],
    ['foo/bar'],
    ['foo/bar/..', 'foo'],
    ['foo/bar/../baz', 'foo/baz'],
    ['/foo/'],
    ['/foo/bar/']
  ]) {
    t.is(path.posix.normalize(input), expected, input)
  }
})

test('win32 normalize', (t) => {
  for (const [input, expected = input] of [
    ['foo'],
    ['foo\\bar'],
    ['foo\\bar\\..', 'foo'],
    ['foo\\bar\\..\\baz', 'foo\\baz'],
    ['\\foo\\'],
    ['\\foo\\bar\\'],
    ['/foo/bar/baz/', '\\foo\\bar\\baz\\']
  ]) {
    t.is(path.win32.normalize(input), expected, input)
  }
})
