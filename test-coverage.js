const test = require('brittle')
const path = require('.')

// ============================================================
// basename
// ============================================================

test('posix basename', (t) => {
  t.is(path.posix.basename('/foo/bar/baz.txt'), 'baz.txt')
  t.is(path.posix.basename('/foo/bar/baz'), 'baz')
  t.is(path.posix.basename('/foo/bar/'), 'bar')
  t.is(path.posix.basename('/'), '')
  t.is(path.posix.basename(''), '')
  t.is(path.posix.basename('baz'), 'baz')
})

test('posix basename with suffix', (t) => {
  t.is(path.posix.basename('/foo/bar/baz.txt', '.txt'), 'baz')
  t.is(path.posix.basename('/foo/bar/baz.txt', '.md'), 'baz.txt')
  t.is(path.posix.basename('file.tar.gz', '.tar.gz'), 'file')
  t.is(path.posix.basename('file.txt', '.txt'), 'file')
})

test('win32 basename', (t) => {
  t.is(path.win32.basename('\\foo\\bar\\baz.txt'), 'baz.txt')
  t.is(path.win32.basename('\\foo\\bar\\'), 'bar')
  t.is(path.win32.basename('c:\\'), '')
  t.is(path.win32.basename(''), '')
})

test('win32 basename with suffix', (t) => {
  t.is(path.win32.basename('\\foo\\bar\\baz.txt', '.txt'), 'baz')
  t.is(path.win32.basename('\\foo\\bar\\file.tar.gz', '.tar.gz'), 'file')
})

// ============================================================
// dirname
// ============================================================

test('posix dirname', (t) => {
  t.is(path.posix.dirname('/foo/bar/baz.txt'), '/foo/bar')
  t.is(path.posix.dirname('/foo/bar'), '/foo')
  t.is(path.posix.dirname('/foo'), '/')
  t.is(path.posix.dirname('/'), '/')
  t.is(path.posix.dirname(''), '.')
  t.is(path.posix.dirname('foo'), '.')
})

test('posix dirname edge cases', (t) => {
  t.is(path.posix.dirname('foo/bar'), 'foo')
  t.is(path.posix.dirname('foo/bar/'), 'foo')
  t.is(path.posix.dirname('///foo'), '/')
  t.is(path.posix.dirname('a/b/c/d'), 'a/b/c')
})

test('win32 dirname', (t) => {
  t.is(path.win32.dirname('\\foo\\bar\\baz.txt'), '\\foo\\bar')
  t.is(path.win32.dirname('\\foo\\bar'), '\\foo')
  t.is(path.win32.dirname('\\foo'), '\\')
  t.is(path.win32.dirname(''), '.')
  t.is(path.win32.dirname('c:\\'), 'c:\\')
})

// ============================================================
// isAbsolute
// ============================================================

test('posix isAbsolute', (t) => {
  t.ok(path.posix.isAbsolute('/'))
  t.ok(path.posix.isAbsolute('/foo'))
  t.ok(path.posix.isAbsolute('/foo/bar'))
  t.absent(path.posix.isAbsolute(''))
  t.absent(path.posix.isAbsolute('foo'))
  t.absent(path.posix.isAbsolute('./foo'))
  t.absent(path.posix.isAbsolute('../foo'))
})

test('win32 isAbsolute', (t) => {
  t.ok(path.win32.isAbsolute('c:\\'))
  t.ok(path.win32.isAbsolute('c:/'))
  t.ok(path.win32.isAbsolute('\\\\server\\share'))
  t.absent(path.win32.isAbsolute(''))
  t.absent(path.win32.isAbsolute('foo'))
  t.absent(path.win32.isAbsolute('.\\foo'))
})

// ============================================================
// relative
// ============================================================

test('posix relative', (t) => {
  t.is(path.posix.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'), '../../impl/bbb')
  t.is(path.posix.relative('/data/aaa', '/data/bbb'), '../bbb')
  t.is(path.posix.relative('/a', '/a/b/c'), 'b/c')
  t.is(path.posix.relative('/a/b/c', '/a'), '../..')
  t.is(path.posix.relative('/a/b/c', '/a/b/c'), '')
  t.is(path.posix.relative('/', '/a'), 'a')
})

test('posix relative with same root', (t) => {
  t.is(path.posix.relative('/a/b/c', '/a/b/c/d/e'), 'd/e')
  t.is(path.posix.relative('/a/b/c/d/e', '/a/b/c'), '../..')
})

test('win32 relative', (t) => {
  t.is(path.win32.relative('c:\\orandea\\test\\aaa', 'c:\\orandea\\impl\\bbb'), '..\\..\\impl\\bbb')
  t.is(path.win32.relative('c:\\a', 'c:\\a\\b\\c'), 'b\\c')
})

// ============================================================
// sep / delimiter
// ============================================================

test('posix sep and delimiter', (t) => {
  t.is(path.posix.sep, '/')
  t.is(path.posix.delimiter, ':')
})

test('win32 sep and delimiter', (t) => {
  t.is(path.win32.sep, '\\')
  t.is(path.win32.delimiter, ';')
})

// ============================================================
// edge cases across functions
// ============================================================

test('non-string arguments throw TypeError', (t) => {
  t.exception(() => path.posix.basename(null))
  t.exception(() => path.posix.dirname(undefined))
  t.exception(() => path.posix.isAbsolute(42))
  t.exception(() => path.posix.relative('/a', 123))
  t.exception(() => path.posix.resolve('/a', null))
  t.exception(() => path.win32.basename(undefined))
  t.exception(() => path.win32.dirname(null))
})

test('empty string handling', (t) => {
  t.is(path.posix.resolve(''), path.posix.cwd ? path.posix.cwd() : '')
  t.is(path.posix.join(''), '.')
  t.is(path.posix.join('', ''), '.')
})

test('win32 toNamespacedPath', (t) => {
  const nsPath = path.win32.toNamespacedPath('\\foo\\bar')
  t.ok(nsPath.length > 0)
})

test('posix toNamespacedPath returns unchanged', (t) => {
  t.is(path.posix.toNamespacedPath('/foo/bar'), '/foo/bar')
  t.is(path.posix.toNamespacedPath('C:\\foo'), 'C:\\foo')
})
