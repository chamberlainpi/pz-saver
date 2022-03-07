import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import yaml from 'yaml'
import { exec } from 'child_process'

export async function readdir(rootDir, opts = {}) {
  opts = _.defaults(opts, { depth: 1, private: false, nodir: true })

  if (_.isString(opts.filter)) {
    const ext = opts.filter
    opts.filter = p => p.includes(ext)
  }
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
      if (opts.filter && !opts.filter(basename)) return false

      return true
    })

    for (var d of dirs) {
      if (!d.isDir) continue
      await _recursive(d.path, depth - 1, results)
    }

    results.push(...dirsFiltered)

    return results
  }

  const allResults = await _recursive(rootDir, opts.depth)

  if (opts.bare) return allResults.map(p => p.path)

  return allResults
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

const OS_PROCESS_RUNNING = {
  win32: `tasklist`,
  darwin: `ps -ax | grep $PROC`,
  linux: `ps -A`,
}
export async function isProcessRunning(names) {
  if (_.isString(names)) {
    names = { win32: names, darwin: names, linux: names }
  }

  const { platform } = process
  const processName = names[platform].toLowerCase()
  const cmd = !(platform in OS_PROCESS_RUNNING) ? false : OS_PROCESS_RUNNING[platform].replace('$PROC', processName)

  return new Promise((_then, _catch) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) _catch(err)

      _then(stdout.toLowerCase().includes(processName))
    })
  })
}
