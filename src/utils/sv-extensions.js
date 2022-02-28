import _ from 'lodash'
import fs from 'fs-extra'

export async function readdir(dir, opts = {}) {
  opts = _.defaults(opts, { depth: 1, private: false, nodir: true })

  async function _recursive(dir, results, depth) {
    let dirs = await fs.readdir(dir)

    dirs = dirs.map(d => {
      const path = dir + '/' + d
      const isDir = fs.statSync(path).isDirectory()

      return { path, isDir, basename: d }
    })

    const dirsFiltered = dirs.filter(({ basename, isDir }) => {
      if (!opts.private && basename.startsWith('.')) return false
      if (opts.filterNoDir && isDir) return false

      return true
    })

    for (d of dirs) {
      if (!d.isDir) continue
      await _recursive(d.path, results, depth - 1)
    }

    if (depth > 1) {
    }

    results.push(...dirsFiltered.map(d => d.path))
  }

  const results = []

  _recursive(dir, results, opts.depth)

  return results
}
