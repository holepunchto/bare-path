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

test('posix extname', (t) => {
  for (const [input, expected = ''] of [
    ['foo'],
    ['foo.ext', '.ext'],
    ['foo/bar'],
    ['foo/bar.ext', '.ext'],
    ['./foo'],
    ['./foo.ext', '.ext']
  ]) {
    t.is(path.posix.extname(input), expected, input)
  }
})

test('posix extname', (t) => {
  for (const [input, expected = ''] of [
    ['foo'],
    ['foo.ext', '.ext'],
    ['foo/bar'],
    ['foo/bar.ext', '.ext'],
    ['./foo'],
    ['./foo.ext', '.ext']
  ]) {
    t.is(path.posix.extname(input), expected, input)
  }
})

test('win32 extname', (t) => {
  for (const [input, expected = ''] of [
    ['foo'],
    ['foo.ext', '.ext'],
    ['foo/bar'],
    ['foo/bar.ext', '.ext'],
    ['foo//bar.ext', '.ext'],
    ['./foo'],
    ['.\\foo'],
    ['./foo.ext', '.ext'],
    ['.\\foo.ext', '.ext']
  ]) {
    t.is(path.win32.extname(input), expected, input)
  }
})

test('resolve of a relative path uses the current working directory', (t) => {
  const resolved = path.resolve('foo')

  t.ok(path.isAbsolute(resolved))
})

test('join throws on non-string components', (t) => {
  for (const value of [0, 1, false, true, null, undefined, {}, [], NaN]) {
    t.exception.all(
      () => path.posix.join('foo', value, 'bar'),
      /must be of type string/,
      `posix ${typeof value} (${String(value)})`
    )
    t.exception.all(
      () => path.win32.join('foo', value, 'bar'),
      /must be of type string/,
      `win32 ${typeof value} (${String(value)})`
    )
  }
})

test('join still skips empty string components', (t) => {
  t.is(path.posix.join('foo', '', 'bar'), 'foo/bar')
  t.is(path.win32.join('foo', '', 'bar'), 'foo\\bar')
})

test('path APIs throw on non-string arguments', (t) => {
  for (const impl of [path.posix, path.win32]) {
    t.exception.all(() => impl.normalize(42), /must be of type string/)
    t.exception.all(() => impl.isAbsolute(42), /must be of type string/)
    t.exception.all(() => impl.dirname(42), /must be of type string/)
    t.exception.all(() => impl.basename(42), /must be of type string/)
    t.exception.all(() => impl.extname(42), /must be of type string/)
    t.exception.all(() => impl.resolve('foo', 42), /must be of type string/)
    t.exception.all(() => impl.relative('foo', 42), /must be of type string/)
    t.exception.all(() => impl.relative(42, 'foo'), /must be of type string/)
    t.exception.all(() => impl.basename('foo', 42), /must be of type string/)
  }
})

test('toNamespacedPath returns non-strings unchanged', (t) => {
  t.is(path.win32.toNamespacedPath(42), 42)
  t.is(path.posix.toNamespacedPath(42), 42)
})
