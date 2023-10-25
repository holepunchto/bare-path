const posix = makePath(false)
const win32 = makePath(true)

posix.win32 = win32.win32 = win32
posix.posix = win32.posix = posix

module.exports = process.platform === 'win32' ? win32 : posix

function makePath (windows) {
  const path = {}

  const sep = path.sep = windows ? '\\' : '/'

  path.isAbsolute = windows
    ? function isAbsolute (p) {
      if (p.length === 0) return false
      return (p[0] === '\\' || p[0] === '/') ||
        (p.length === 2 && p[1] === ':') ||
        (p.length > 2 && p[1] === ':' && (p[2] === '\\' || p[2] === '/'))
    }
    : function isAbsolute (p) {
      return p.length > 0 && p[0] === '/'
    }

  path.root = windows
    ? function root (p) {
      if (p.length === 0) return ''

      return (p[0] === '\\' || p[0] === '/')
        ? p[0]
        : (p.length === 2 && p[1] === ':')
            ? p
            : (p.length > 2 && p[1] === ':' && (p[2] === '\\' || p[2] === '/'))
                ? p.slice(0, 3)
                : ''
    }
    : function root (p) {
      return path.isAbsolute(p) ? '/' : ''
    }

  path.toNamespacedPath = windows
    ? function toNamespacedPath (p) {
      if (p.length === 0) return ''

      const r = path.resolve(p)
      if (r.length <= 2) return p

      if (r[0] === '\\') {
        if (r[1] === '\\') {
          if (r[2] !== '?' && r[2] !== '.') {
            return '\\\\?\\UNC\\' + r.slice(2)
          }
        }
      } else if (r[1] === ':' && (r[2] === '\\' || r[2] === '/')) {
        return '\\\\?\\' + r
      }

      return p
    }
    : function toNamespacedPath (p) {
      return p
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
      if (part.length === 0) continue
      resolved = path.join(part, resolved)
      if (path.isAbsolute(resolved)) break
    }
    return resolved
  }

  path.join = function join (p, ...parts) {
    for (const part of parts) {
      if (part.length === 0) continue
      p += sep + part
    }
    return path.normalize(p)
  }

  path.normalize = function normalize (p) {
    if (windows === true) {
      let i = -1
      while ((i = p.indexOf('/', i + 1)) !== -1) p = p.slice(0, i) + sep + p.slice(i + 1)
    }

    const root = path.root(p)
    const isAbsolute = root !== ''
    const hasTrailingSep = p[p.length - 1] === sep

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
    if (hasTrailingSep) out += sep

    return out || '.'
  }

  return path
}
