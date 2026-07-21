# bare-path

Path manipulation library for JavaScript.

```
npm i bare-path
```

## Usage

```js
const path = require('bare-path')

path.join('foo', 'bar') // foo/bar on posix, foo\bar on windows
```

## License

Apache-2.0

<!-- bare-refgen:api start -->

## API

### Joining and resolving

#### `path.join(...paths: string[]): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L13)

Joins all given path segments using the platform-specific separator, then normalizes the result.

**Parameters**

| Parameter | Type       | Default | Description                                             |
| --------- | ---------- | ------- | ------------------------------------------------------- |
| `paths`   | `string[]` | —       | The path segments to join together, in the order given. |

**Throws**

- `TypeError` — thrown if any path segment is not a string.

#### `path.resolve(...args: string[]): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L19)

Resolves a sequence of paths or path segments into an absolute path.

**Parameters**

| Parameter | Type       | Default | Description                                                                                       |
| --------- | ---------- | ------- | ------------------------------------------------------------------------------------------------- |
| `args`    | `string[]` | —       | The path segments to resolve, processed from right to left until an absolute path is constructed. |

**Returns** `string` — Falls back to the current working directory (or that of the resolved drive, on Windows) if none of the given segments is absolute.

**Throws**

- `TypeError` — thrown if any path segment is not a string.

#### `path.normalize(path: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L15)

Normalizes `path`, resolving `.` and `..` segments.

**Parameters**

| Parameter | Type     | Default | Description            |
| --------- | -------- | ------- | ---------------------- |
| `path`    | `string` | —       | The path to normalize. |

**Throws**

- `TypeError` — thrown if `path` is not a string.

#### `path.relative(from: string, to: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L17)

Returns the relative path from `from` to `to`.

**Parameters**

| Parameter | Type     | Default | Description                                 |
| --------- | -------- | ------- | ------------------------------------------- |
| `from`    | `string` | —       | The path to resolve the relative path from. |
| `to`      | `string` | —       | The path to resolve the relative path to.   |

**Returns** `string` — Both `from` and `to` are resolved to absolute paths before comparing, and an empty string is returned if they resolve to the same path.

**Throws**

- `TypeError` — thrown if `from` or `to` is not a string.

### Inspecting paths

#### `path.basename(path: string, suffix?: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L5)

Returns the last portion of `path`, similar to the Unix `basename` command.

**Parameters**

| Parameter | Type     | Default | Description                                                                     |
| --------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `path`    | `string` | —       | The path to extract the last portion from.                                      |
| `suffix?` | `string` | —       | An optional suffix to remove from the end of the result, if it matches exactly. |

**Returns** `string` — An empty string if `suffix` equals `path` exactly.

**Throws**

- `TypeError` — thrown if `path`, or a defined `suffix`, is not a string.

#### `path.dirname(path: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L7)

Returns the directory name of `path`, similar to the Unix `dirname` command.

**Parameters**

| Parameter | Type     | Default | Description                                  |
| --------- | -------- | ------- | -------------------------------------------- |
| `path`    | `string` | —       | The path to extract the directory name from. |

**Throws**

- `TypeError` — thrown if `path` is not a string.

#### `path.extname(path: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L9)

Returns the extension of `path`, from the last `.` to the end of the string.

**Parameters**

| Parameter | Type     | Default | Description                             |
| --------- | -------- | ------- | --------------------------------------- |
| `path`    | `string` | —       | The path to extract the extension from. |

**Returns** `string` — An empty string if `path` has no `.` in its last segment, or if that segment's only `.` is its first character (e.g. a dotfile).

**Throws**

- `TypeError` — thrown if `path` is not a string.

#### `path.isAbsolute(path: string): boolean`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L11)

Returns `true` if `path` is an absolute path.

**Parameters**

| Parameter | Type     | Default | Description       |
| --------- | -------- | ------- | ----------------- |
| `path`    | `string` | —       | The path to test. |

**Returns** `boolean` — On Windows, a drive-qualified path such as `C:\foo` is also absolute; on POSIX, only paths starting with `/` are absolute.

**Throws**

- `TypeError` — thrown if `path` is not a string.

#### `path.toNamespacedPath(path: string): string`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L21)

Converts `path` to a namespace-prefixed path on Windows; returns `path` unchanged on POSIX.

**Parameters**

| Parameter | Type     | Default | Description          |
| --------- | -------- | ------- | -------------------- |
| `path`    | `string` | —       | The path to convert. |

**Returns** `string` — On Windows, resolves `path` and prefixes UNC paths with `\\?\UNC\` and drive-letter paths with `\\?\`; other paths (including non-string input) are returned unchanged.

### Platform variants and separators

#### `path.sep: '/' | '\\'`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L2)

The platform-specific path segment separator: `\` on Windows, `/` elsewhere.

#### `path.delimiter: ':' | ';'`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L3)

The platform-specific path delimiter: `;` on Windows, `:` elsewhere.

#### `path.posix`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L23)

The POSIX-specific implementation of the `path` methods.

#### `path.win32`

[source](https://github.com/holepunchto/bare-path/blob/v3.1.1/index.d.ts#L24)

The Windows-specific implementation of the `path` methods.

<!-- bare-refgen:api end -->
