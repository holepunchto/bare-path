const posix = makePath(false)
const win32 = makePath(true)

posix.win32 = win32
win32.posix = posix

module.exports = process.platform === 'win32' ? win32 : posix

function makePath (windows) {
  const path = {}

  path.posix = path
  path.win32 = path

  const sep = path.sep = windows ? '\\' : '/'

  if (windows) {
    path.isAbsolute = function isAbsolute (p) {
      if (p.length === 0) return false
      return (p[0] === '\\' || p[0] === '/') ||
        (p.length === 2 && p[1] === ':') ||
        (p.length > 2 && p[1] === ':' && (p[2] === '\\' || p[2] === '/'))
    }

    path.root = function root (p) {
      if (p.length === 0) return ''

      return (p[0] === '\\' || p[0] === '/')
        ? p[0]
        : (p.length === 2 && p[1] === ':')
            ? p
            : (p.length > 2 && p[1] === ':' && (p[2] === '\\' || p[2] === '/'))
                ? p.slice(0, 3)
                : ''
    }
  } else {
    path.isAbsolute = function isAbsolute (p) {
      return p.length > 0 && p[0] === '/'
    }

    path.root = function root (p) {
      return path.isAbsolute(p) ? '/' : ''
    }
  }

  path.basename = function basename (p) {
    let end = p.length - 1
    while (end > 0 && p[end] === sep) end--
    if (end <= 0) return ''
    return p.slice(p.lastIndexOf(sep, end) + 1, end + 1)
  }

  path.dirname = function dirname (p) {
    let end = p.length - 1
    while (end > 0 && p[end] === sep) end--
    if (end === 0) end = 1
    if (end < 0) return '.'
    let start = p.lastIndexOf(sep, end)
    if (start === 0) start = 1
    if (start === -1) return '.'
    return p.slice(0, start)
  }

  path.extname = function extname (p) {
    const i = p.lastIndexOf('.')
    return i === -1 ? '' : p.slice(i)
  }

  path.resolve = function resolve (...args) {
    let resolved = ''
    for (let i = args.length - 1; i >= -1; i--) {
      const part = i === -1 ? process.cwd() : args[i]
      resolved = path.join(part, resolved)
      if (path.isAbsolute(resolved)) break
    }
    return resolved
  }

  path.join = function join (p, ...parts) {
    for (const part of parts) p += sep + part
    return path.normalize(p)
  }

  path.normalize = function normalize (p) {
    if (windows === true) {
      let i = -1
      while ((i = p.indexOf('/', i + 1)) !== -1) p = p.slice(0, i) + sep + p.slice(i + 1)
    }

    const root = path.root(p)
    const isAbsolute = root !== ''

    let i = root.length
    let out = ''

    while (i < p.length) {
      let j = p.indexOf(sep, i)

      if (j === -1) j = p.length

      const part = p.slice(i, j)
      i = j + 1

      if (part === '') {
        continue
      }

      if (part === '.') {
        continue
      }

      if (part === '..') {
        const l = out.lastIndexOf(sep)
        if (l === -1 || out.slice(l + 1) === '..') {
          if (isAbsolute) out = ''
          else out += out ? sep + '..' : '..'
        } else {
          out = out.slice(0, l)
        }
        continue
      }

      out += out ? sep + part : part
    }

    if (root) out = root + out

    return out || '.'
  }

  return path
}
