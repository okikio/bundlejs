// Based on https://github.com/sindresorhus/path-is-absolute/blob/main/index.js
export const isAbsolute = (path: string) => {
    return path.length > 0 && path.charAt(0) === '/';
}

// Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts
export const extname = (path: string) => {
    const m = /(\.[a-zA-Z0-9]+)$/.exec(path);
    return m ? m[1] : "";
}

/** 
 * Everything below this line is based off of https://github.com/egoist/play-esbuild/blob/main/src/lib/path.ts 
 */
 export const assertPath = (path: string) => {
    if (typeof path !== "string") {
        throw new TypeError(
            `Path must be a string. Received ${JSON.stringify(path)}`
        )
    }
}

export const CHAR_DOT = 46; /* . */
export const CHAR_FORWARD_SLASH = 47; /* / */

// Resolves . and .. elements in a path with directory names
export const normalizeString = (
    path: string,
    allowAboveRoot: boolean,
    separator: string,
    isPathSeparator: (code: number) => boolean
): string => {
    let res = ""
    let lastSegmentLength = 0
    let lastSlash = -1
    let dots = 0
    let code: number | undefined
    for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) code = path.charCodeAt(i)
        else if (isPathSeparator(code!)) break
        else code = CHAR_FORWARD_SLASH

        if (isPathSeparator(code!)) {
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (
                    res.length < 2 ||
                    lastSegmentLength !== 2 ||
                    res.charCodeAt(res.length - 1) !== CHAR_DOT ||
                    res.charCodeAt(res.length - 2) !== CHAR_DOT
                ) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator)
                        if (lastSlashIndex === -1) {
                            res = ""
                            lastSegmentLength = 0
                        } else {
                            res = res.slice(0, lastSlashIndex)
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator)
                        }
                        lastSlash = i
                        dots = 0
                        continue
                    } else if (res.length === 2 || res.length === 1) {
                        res = ""
                        lastSegmentLength = 0
                        lastSlash = i
                        dots = 0
                        continue
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`
                    else res = ".."
                    lastSegmentLength = 2
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i)
                else res = path.slice(lastSlash + 1, i)
                lastSegmentLength = i - lastSlash - 1
            }
            lastSlash = i
            dots = 0
        } else if (code === CHAR_DOT && dots !== -1) {
            ++dots
        } else {
            dots = -1
        }
    }
    return res
}

export const isPosixPathSeparator = (code: number): boolean => {
    return code === CHAR_FORWARD_SLASH
}

export const normalize = (path: string): string => {
    assertPath(path)

    if (path.length === 0) return "."

    const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH
    const trailingSeparator =
        path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH

    // Normalize the path
    path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator)

    if (path.length === 0 && !isAbsolute) path = "."
    if (path.length > 0 && trailingSeparator) path += "/"

    if (isAbsolute) return `/${path}`
    return path
}

export const join = (...paths: string[]): string => {
    if (paths.length === 0) return "."
    let joined: string | undefined
    for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i]
        assertPath(path)
        if (path.length > 0) {
            if (!joined) joined = path
            else joined += `/${path}`
        }
    }
    if (!joined) return "."
    return normalize(joined)
}

export const urlJoin = (url: string, ...args: string[]) => {
    const u = new URL(url)
    u.pathname = join(u.pathname, ...args)
    return u.toString()
}