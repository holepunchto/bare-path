const test = require('brittle')
const path = require('.')

test('exposes posix and win32 implementations', (t) => {
  t.is(typeof path.posix, 'object')
  t.is(typeof path.win32, 'object')
  t.is(path.posix.posix, path.posix)
  t.is(path.posix.win32, path.win32)
  t.is(path.win32.win32, path.win32)
  t.is(path.win32.posix, path.posix)
})

test('separators and delimiters', (t) => {
  t.is(path.posix.sep, '/')
  t.is(path.posix.delimiter, ':')
  t.is(path.win32.sep, '\\')
  t.is(path.win32.delimiter, ';')
})

test('posix normalize', (t) => {
  for (const [input, expected] of [
    ['', '.'],
    ['.', '.'],
    ['..', '..'],
    ['foo', 'foo'],
    ['foo/bar', 'foo/bar'],
    ['foo//bar', 'foo/bar'],
    ['foo/./bar', 'foo/bar'],
    ['foo/../bar', 'bar'],
    ['foo/bar/..', 'foo'],
    ['foo/bar/../baz', 'foo/baz'],
    ['/foo/', '/foo/'],
    ['/foo/bar/', '/foo/bar/'],
    ['/', '/'],
    ['//', '/'],
    ['///', '/'],
    ['/../', '/'],
    ['/foo/../..', '/'],
    ['a/b/c/../../d', 'a/d'],
    ['./foo', 'foo'],
    ['../foo', '../foo'],
    ['../../foo', '../../foo'],
    ['a/..', '.'],
    ['ab/..', '.'],
    ['a/b/../..', '.'],
    ['../../..', '../../..'],
    ['x/../../y', '../y'],
    ['foo/..', '.'],
    ['/foo/bar//baz/asdf/quux/..', '/foo/bar/baz/asdf'],
    ['a//b//c', 'a/b/c'],
    ['a/./b/./c', 'a/b/c']
  ]) {
    t.is(path.posix.normalize(input), expected, input)
  }
})

test('win32 normalize', (t) => {
  for (const [input, expected] of [
    ['', '.'],
    ['foo', 'foo'],
    ['foo\\bar', 'foo\\bar'],
    ['foo\\\\bar', 'foo\\bar'],
    ['foo\\.\\bar', 'foo\\bar'],
    ['foo\\..\\bar', 'bar'],
    ['C:\\temp\\\\foo\\bar\\..\\', 'C:\\temp\\foo\\'],
    ['C:\\', 'C:\\'],
    ['C:', 'C:.'],
    ['c:/foo/bar', 'c:\\foo\\bar'],
    ['\\\\server\\share\\dir\\..\\file', '\\\\server\\share\\file'],
    ['\\\\server\\share', '\\\\server\\share\\'],
    ['\\\\?\\C:\\foo\\bar', '\\\\?\\C:\\foo\\bar'],
    ['/foo/bar/baz/', '\\foo\\bar\\baz\\'],
    ['\\foo\\', '\\foo\\'],
    ['\\foo\\bar\\', '\\foo\\bar\\'],
    ['a\\b\\c\\..\\..\\d', 'a\\d'],
    ['C:..\\foo', 'C:..\\foo'],
    ['C:foo\\..', 'C:.'],
    ['a\\..', '.'],
    ['ab\\..', '.'],
    ['/', '\\']
  ]) {
    t.is(path.win32.normalize(input), expected, input)
  }
})

test('posix isAbsolute', (t) => {
  for (const [input, expected] of [
    ['', false],
    ['foo', false],
    ['/foo', true],
    ['/', true],
    ['./foo', false],
    ['../foo', false]
  ]) {
    t.is(path.posix.isAbsolute(input), expected, input)
  }
})

test('win32 isAbsolute', (t) => {
  for (const [input, expected] of [
    ['', false],
    ['C:\\foo', true],
    ['C:foo', false],
    ['\\foo', true],
    ['\\\\server\\share', true],
    ['foo', false],
    ['/foo', true],
    ['c:/', true],
    ['C:', false]
  ]) {
    t.is(path.win32.isAbsolute(input), expected, input)
  }
})

test('posix join', (t) => {
  for (const [input, expected] of [
    [['foo', 'bar', 'baz'], 'foo/bar/baz'],
    [['/foo', 'bar'], '/foo/bar'],
    [['foo', '', 'bar'], 'foo/bar'],
    [['foo', '..', 'bar'], 'bar'],
    [[], '.'],
    [['.'], '.'],
    [['', ''], '.'],
    [['foo/', '/bar'], 'foo/bar']
  ]) {
    t.is(path.posix.join(...input), expected, JSON.stringify(input))
  }
})

test('win32 join', (t) => {
  for (const [input, expected] of [
    [['foo', 'bar'], 'foo\\bar'],
    [['C:\\', 'foo'], 'C:\\foo'],
    [['\\\\server\\share', 'foo'], '\\\\server\\share\\foo'],
    [['foo', '..', 'bar'], 'bar'],
    [['\\\\', 'foo', 'bar'], '\\foo\\bar'],
    [['//server', 'share'], '\\\\server\\share\\'],
    [['\\\\\\foo', 'bar'], '\\foo\\bar'],
    [[], '.'],
    [['', ''], '.']
  ]) {
    t.is(path.win32.join(...input), expected, JSON.stringify(input))
  }
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

test('posix dirname', (t) => {
  for (const [input, expected] of [
    ['', '.'],
    ['/', '/'],
    ['//', '/'],
    ['foo', '.'],
    ['/foo', '/'],
    ['/foo/bar', '/foo'],
    ['foo/bar', 'foo'],
    ['/foo/bar/', '/foo'],
    ['foo/', '.'],
    ['/foo/bar/baz', '/foo/bar'],
    ['a/b/', 'a'],
    ['./foo', '.']
  ]) {
    t.is(path.posix.dirname(input), expected, input)
  }
})

test('win32 dirname', (t) => {
  for (const [input, expected] of [
    ['', '.'],
    ['C:\\', 'C:\\'],
    ['C:\\foo', 'C:\\'],
    ['C:\\foo\\bar', 'C:\\foo'],
    ['C:foo', 'C:'],
    ['\\\\server\\share', '\\\\server\\share'],
    ['\\\\server\\share\\foo', '\\\\server\\share\\'],
    ['foo\\bar', 'foo'],
    ['\\foo', '\\'],
    ['C:', 'C:'],
    ['foo', '.'],
    ['C:\\foo\\bar\\', 'C:\\foo'],
    ['a', '.'],
    ['\\', '\\']
  ]) {
    t.is(path.win32.dirname(input), expected, input)
  }
})

test('posix basename', (t) => {
  for (const [input, expected] of [
    [['', ''], ''],
    [['/'], ''],
    [['foo'], 'foo'],
    [['/foo/bar'], 'bar'],
    [['/foo/bar.txt'], 'bar.txt'],
    [['/foo/bar.txt', '.txt'], 'bar'],
    [['/foo/bar.txt', '.xt'], 'bar.txt'],
    [['foo/bar/'], 'bar'],
    [['/foo/bar.txt', '.TXT'], 'bar.txt'],
    [['bar.txt', '.txt'], 'bar'],
    [['bar.txt', 'txt'], 'bar.'],
    [['.txt', '.txt'], ''],
    [['file.txt', '.txt'], 'file'],
    [['a/b/c'], 'c'],
    [['/a/b/c/'], 'c']
  ]) {
    t.is(path.posix.basename(...input), expected, JSON.stringify(input))
  }
})

test('win32 basename', (t) => {
  for (const [input, expected] of [
    [['C:\\foo\\bar.txt'], 'bar.txt'],
    [['C:\\foo\\bar.txt', '.txt'], 'bar'],
    [['C:foo'], 'foo'],
    [['\\\\server\\share\\file.txt'], 'file.txt'],
    [['foo\\bar.txt', '.txt'], 'bar'],
    [['C:'], ''],
    [['C:\\'], ''],
    [['dir\\file.js', '.js'], 'file'],
    [['foo\\bar.txt', '.xt'], 'bar.txt']
  ]) {
    t.is(path.win32.basename(...input), expected, JSON.stringify(input))
  }
})

test('posix extname', (t) => {
  for (const [input, expected] of [
    ['', ''],
    ['foo', ''],
    ['foo.txt', '.txt'],
    ['foo.', '.'],
    ['.foo', ''],
    ['foo.bar.baz', '.baz'],
    ['/foo/bar.txt', '.txt'],
    ['foo/', ''],
    ['.', ''],
    ['..', ''],
    ['foo..bar', '.bar'],
    ['a.b/c', ''],
    ['/a/b.c/d', ''],
    ['./foo', ''],
    ['./foo.ext', '.ext']
  ]) {
    t.is(path.posix.extname(input), expected, input)
  }
})

test('win32 extname', (t) => {
  for (const [input, expected] of [
    ['foo', ''],
    ['foo.ext', '.ext'],
    ['foo/bar', ''],
    ['foo/bar.ext', '.ext'],
    ['foo//bar.ext', '.ext'],
    ['./foo', ''],
    ['.\\foo', ''],
    ['./foo.ext', '.ext'],
    ['.\\foo.ext', '.ext'],
    ['C:\\foo.txt', '.txt'],
    ['C:\\foo\\bar.txt', '.txt'],
    ['foo\\bar.txt', '.txt'],
    ['C:foo.txt', '.txt'],
    ['a.b\\c', ''],
    ['C:\\foo.bar.baz', '.baz'],
    ['foo.txt\\', '.txt'],
    ['C:\\a\\b\\', ''],
    ['foo\\.bar', '']
  ]) {
    t.is(path.win32.extname(input), expected, input)
  }
})

test('posix relative between absolute paths', (t) => {
  for (const [input, expected] of [
    [['/a/b/c', '/a/b/d'], '../d'],
    [['/a/b', '/a/b/c/d'], 'c/d'],
    [['/a/b/c', '/a/b'], '..'],
    [['/', '/a'], 'a'],
    [['/a/b', '/a/b'], ''],
    [['/foo/bar/baz', '/foo/bar/baz/qux'], 'qux'],
    [['/foo/bar', '/foo'], '..'],
    [['/foo', '/'], '..'],
    [['/foo', '/foobar'], '../foobar'],
    [['/', '/'], '']
  ]) {
    t.is(path.posix.relative(...input), expected, JSON.stringify(input))
  }
})

test('posix relative returns empty string for identical inputs', (t) => {
  t.is(path.posix.relative('foo/bar', 'foo/bar'), '')
})

test('win32 relative between absolute paths', (t) => {
  for (const [input, expected] of [
    [['C:\\a\\b\\c', 'C:\\a\\b\\d'], '..\\d'],
    [['C:\\a\\b', 'C:\\a\\b\\c'], 'c'],
    [['C:\\a\\b\\c', 'C:\\a'], '..\\..'],
    [['C:\\foo', 'D:\\bar'], 'D:\\bar'],
    [['C:\\a\\b', 'C:\\a\\b'], ''],
    [['\\\\server\\share\\a', '\\\\server\\share\\b'], '..\\b'],
    [['C:\\', 'C:\\foo'], 'foo'],
    [['C:\\foo', 'C:\\'], '..'],
    [['C:\\', 'D:\\'], 'D:\\'],
    [['C:\\foo\\bar', 'C:\\'], '..\\..'],
    [['C:\\foo', 'C:\\foo\\bar\\baz'], 'bar\\baz'],
    [['\\\\server\\share\\', '\\\\server\\share\\a'], 'a'],
    [['\\\\server\\share', '\\\\server\\share\\foo'], 'foo'],
    [['C:\\a', 'C:\\a\\b'], 'b'],
    [['\\\\s\\h\\a', '\\\\s\\h'], '..']
  ]) {
    t.is(path.win32.relative(...input), expected, JSON.stringify(input))
  }
})

test('win32 relative returns empty string for identical inputs', (t) => {
  t.is(path.win32.relative('foo\\bar', 'foo\\bar'), '')
})

test('posix resolve of absolute paths is deterministic', (t) => {
  for (const [input, expected] of [
    [['/foo', 'bar', 'baz'], '/foo/bar/baz'],
    [['/foo/bar', './baz'], '/foo/bar/baz'],
    [['/foo/bar', '/tmp/file/'], '/tmp/file'],
    [['/a/b', '../c'], '/a/c'],
    [['/foo', ''], '/foo']
  ]) {
    t.is(path.posix.resolve(...input), expected, JSON.stringify(input))
  }
})

test('win32 resolve of absolute paths is deterministic', (t) => {
  for (const [input, expected] of [
    [['C:\\foo', 'bar', 'baz'], 'C:\\foo\\bar\\baz'],
    [['C:\\foo\\bar', '.\\baz'], 'C:\\foo\\bar\\baz'],
    [['C:\\foo\\bar', 'D:\\tmp'], 'D:\\tmp'],
    [['\\\\server\\share', 'foo'], '\\\\server\\share\\foo'],
    [['C:\\a\\b', '..\\c'], 'C:\\a\\c'],
    [['\\'], '\\'],
    [['\\foo'], '\\foo'],
    [['C:\\a', '\\b'], 'C:\\b'],
    [['\\a', '\\b'], '\\b']
  ]) {
    t.is(path.win32.resolve(...input), expected, JSON.stringify(input))
  }
})

test('win32 resolve of relative paths uses the current working directory', (t) => {
  const resolved = path.win32.resolve('foo', 'bar')

  t.ok(resolved.charCodeAt(0) === 0x5c, 'is rooted')
  t.ok(resolved.endsWith('\\foo\\bar'))
})

test('win32 resolve of a drive-relative path uses that drive', (t) => {
  const resolved = path.win32.resolve('C:foo')

  t.ok(resolved.startsWith('C:\\'))
  t.ok(resolved.endsWith('\\foo'))
})

test('win32 resolve prefers the last device specified', (t) => {
  const resolved = path.win32.resolve('D:\\x', 'C:foo')

  t.ok(resolved.startsWith('C:\\'))
  t.ok(resolved.endsWith('\\foo'))
})

test('resolve of a relative path uses the current working directory', (t) => {
  const resolved = path.resolve('foo')

  t.ok(path.isAbsolute(resolved))
})

test('resolve with no arguments returns an absolute path', (t) => {
  t.ok(path.isAbsolute(path.resolve()))
})

test('win32 toNamespacedPath converts absolute paths', (t) => {
  for (const [input, expected] of [
    ['', ''],
    ['C:\\foo\\bar', '\\\\?\\C:\\foo\\bar'],
    ['\\\\server\\share\\foo', '\\\\?\\UNC\\server\\share\\foo'],
    ['\\\\?\\C:\\foo', '\\\\?\\C:\\foo'],
    ['C:\\', '\\\\?\\C:\\'],
    ['\\\\.\\pipe\\x', '\\\\.\\pipe\\x']
  ]) {
    t.is(path.win32.toNamespacedPath(input), expected, input)
  }
})

test('posix toNamespacedPath returns its argument unchanged', (t) => {
  t.is(path.posix.toNamespacedPath('/foo/bar'), '/foo/bar')
  t.is(path.posix.toNamespacedPath('foo'), 'foo')
})

test('throw on non-string arguments', (t) => {
  for (const p of [path.posix, path.win32]) {
    t.exception.all(() => p.normalize(42), /TypeError/)
    t.exception.all(() => p.isAbsolute(42), /TypeError/)
    t.exception.all(() => p.dirname(42), /TypeError/)
    t.exception.all(() => p.basename(42), /TypeError/)
    t.exception.all(() => p.extname(42), /TypeError/)
    t.exception.all(() => p.resolve('foo', 42), /TypeError/)
    t.exception.all(() => p.relative('foo', 42), /TypeError/)
    t.exception.all(() => p.relative(42, 'foo'), /TypeError/)
    t.exception.all(() => p.basename('foo', 42), /TypeError/)
  }
})

test('toNamespacedPath returns non-strings unchanged', (t) => {
  t.is(path.win32.toNamespacedPath(42), 42)
  t.is(path.posix.toNamespacedPath(42), 42)
})
