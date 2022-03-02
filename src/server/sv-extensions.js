import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import yaml from 'yaml'

export async function readdir(rootDir, opts = {}) {
  opts = _.defaults(opts, { depth: 1, private: false, nodir: true })

  async function _recursive(dir, depth, results = []) {
    if (depth < 1) return

    let dirs = await fs.readdir(dir)

    dirs = dirs.map(d => {
      const path = dir + '/' + d
      const isDir = fs.statSync(path).isDirectory()

      return { path, isDir, depth: opts.depth - depth, basename: d }
    })

    const dirsFiltered = dirs.filter(({ basename, isDir }) => {
      if (!opts.private && basename.startsWith('.')) return false
      if (opts.filterNoDir && isDir) return false

      return true
    })

    for (var d of dirs) {
      if (!d.isDir) continue
      await _recursive(d.path, depth - 1, results)
    }

    results.push(...dirsFiltered)

    return results
  }

  return await _recursive(rootDir, opts.depth)
}

export function makeRoutesFromObj(fastify, routeObj) {
  _.forOwn(routeObj, (value, key) => {
    let [method, route] = key.split('::').map(s => s.trim())
    method = method.toLowerCase()

    fastify[method](route, value)
  })
}

export async function tryLoadFile(uri, fallbackData) {
  uri = path.resolve(uri)
  const dir = path.dirname(uri)

  if (!fs.existsSync(dir)) {
    await fs.mkdirp(dir)
    return fallbackData
  }

  if (!fs.existsSync(uri)) {
    return fallbackData
  }

  const data = await fs.readFile(uri, 'utf8')

  return yaml.parse(data)
}
