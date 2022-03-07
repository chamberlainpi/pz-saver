import fs from 'fs-extra'
import _ from 'lodash'
import path from 'path'
import yaml from 'yaml'
import { readdir } from './sv-extensions.js'
import byteSize from 'byte-size'
import JSZip from 'jszip'
import dayjs from 'dayjs'

const makeDatedZip = () => ({ zip: null, dateZippedMS: -1, name: 'no-name' })
const ZIP_SNAPSHOTS = {
  index: 0,
  isSaving: false,
  pair: [makeDatedZip(), makeDatedZip()],
}

async function saveData(data, uri) {
  const yamlStr = yaml.stringify(data)

  await fs.writeFile(uri, yamlStr, 'utf8')
  return { isOK: true, data }
}

export const createRoutes = state => ({
  'GET::/': (req, res) => 'Hello World',
  'GET::/count': (req, res) => [state.count],
  'GET::/config': (req, res) => [state.config],

  'POST::/config': async (req, res) => {
    state.config = req.body

    return await saveData(state.config, state.YAML_CONFIG)
  },

  'GET::/load-game-folders': async (req, res) => {
    const { pzRoot } = state.config
    const pzSaves = pzRoot.includes('/Saves') ? pzRoot : `${pzRoot}/Saves`

    const allGameSaves = await readdir(pzSaves, { depth: 2 })

    const filteredGameSaves = allGameSaves //
      .filter(p => p.isDir && p.depth === 1)
      .map(p => {
        const { atimeMs, mtimeMs, ctimeMs, birthtimeMs } = fs.statSync(p.path)
        return { ..._.omit(p, 'isDir'), stat: { atimeMs, mtimeMs, ctimeMs, birthtimeMs } }
      })

    return filteredGameSaves
  },

  'GET::/status': (req, res) => {
    return {
      isBaselineSnapped: state.baselineObjs != null,
      isCurrentSnapped: state.currentObjs != null,
      report: state.report,
    }
  },

  'GET::/backups': async (req, res) => {
    const zipFiles = await readdir(state.PRIVATE_DIR, {
      filter: '.zip',
      bare: true,
    })

    state.zipFiles = zipFiles.map((value, key) => ({ value, key }))

    return state.zipFiles
  },

  'PUT::/backup-restore/:id': async (req, res) => {
    const zipInfo = state.zipFiles[req.params.id]

    if (!zipInfo) return { isError: 'Zip does not exists' }

    const zipContent = await fs.readFile(zipInfo.value)
    const zip = await JSZip.loadAsync(zipContent)

    const allWriteOperations = []

    zip.forEach((relPath, file) => {
      allWriteOperations.push({ relPath, file })
    })

    console.clear()

    const writeFileOrFolder = async ({ relPath, file }) => {
      const absPath = path.join(state.config.current + '\\test', relPath)

      if (absPath.endsWith('\\') && !fs.existsSync(absPath)) {
        trace('Make dir: '.yellow, relPath)
        return await fs.mkdirp(absPath)
      }

      trace('Writing: '.green, relPath)
      const buff = await file.async('nodebuffer')
      return await fs.writeFile(absPath, buff)
    }

    await Promise.all(allWriteOperations.map(writeFileOrFolder))

    return { ok: 1, zip: zipInfo.value }
  },

  'DELETE::/backup-delete/:id': async (req, res) => {
    const zipInfo = state.zipFiles[req.params.id]

    if (!zipInfo) return { isError: 'Zip does not exists' }

    await fs.unlink(zipInfo.value)

    return { deleted: 1, zip: zipInfo.value }
  },

  'POST::/baseline-snapshot': async (req, res) => {
    const { baseline } = state.config
    const baselineFiles = await readdir(baseline, { depth: 5 })
    state.baselineObjs = toPathObjects(baselineFiles, baseline)

    return { isOK: true, baselineObjs: state.baselineObjs != null }
  },

  'POST::/buffer-snapshot': async (req, res) => {
    ///////////////////////////////////////////////////////////////////////////////////////
    if (ZIP_SNAPSHOTS.isSaving) return { isError: 'Saving in progress, cannot buffer a snapshot' }

    const { current } = state.config
    const nowFormatted = dayjs().format('YYYY-MM-DD_HH-mm-ss')
    const currentName = current.split('/').pop() + '__' + nowFormatted
    const allFiles = await readdir(current, { depth: 5, bare: true, filterNoDir: true })

    ZIP_SNAPSHOTS.index = 1 - ZIP_SNAPSHOTS.index

    const currentSnapshot = ZIP_SNAPSHOTS.pair[ZIP_SNAPSHOTS.index]

    const zip = (currentSnapshot.zip = new JSZip())
    // currentSnapshot.allFiles = allFiles

    const prettyMem = () => _.mapValues(process.memoryUsage(), v => byteSize(v).toString())
    const now = _.now()
    // trace('process.memoryUsage() BEFORE', now, prettyMem())

    for (var fullpath of allFiles) {
      const relPath = fullpath.replace(current + '/', '')
      zip.file(relPath, fs.readFile(fullpath))
      // trace('Zipping', relPath)
    }

    try {
      gc()
    } catch (err) {
      console.log('Should run with V8 flag: --expose-gc')
    }

    currentSnapshot.dateZippedMS = now
    currentSnapshot.name = currentName

    trace('process.memoryUsage() AFTER', now, prettyMem())

    const pair = ZIP_SNAPSHOTS.pair.map(p => _.omit(p, 'zip'))
    return { isBuffered: true, pair }
  },

  'POST::/buffer-write-current': async (req, res) => {
    ZIP_SNAPSHOTS.isBusy = true
    const currentSnapshot = ZIP_SNAPSHOTS.pair[ZIP_SNAPSHOTS.index]

    const prom = new Promise(_then => {
      const { zip, name } = currentSnapshot
      const outFile = state.ZIP_SNAPSHOT.replace('[name]', name)

      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(outFile))
        .on('finish', () => {
          trace('ZIP finished current: ', outFile)
          ZIP_SNAPSHOTS.isBusy = false
          _then(true)
        })
    })

    const result = await prom

    return { isZipped: result }
  },

  'POST::/save-snapshot': async (req, res) => {
    const { report } = state
    if (!state.report) return { isError: 'No report object created yet.' }

    const zip = new JSZip()
    const allFiles = [...report.added, ...report.modified] // ...report.accessed, ...report.statusChanged]

    for (var f of allFiles) {
      const fullpath = `${report.meta.current}/${f}`

      zip.file(f, fs.readFile(fullpath))
    }

    const prom = new Promise(_then => {
      const now = dayjs().format('YYYY-MM-DD_HH-mm-ss')
      const baselineName = state.config.baseline.split('/').pop() + '__' + now
      const outFile = state.ZIP_SNAPSHOT.replace('[name]', baselineName)

      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(outFile))
        .on('finish', () => {
          trace('ZIP finished: ', outFile)
          _then(true)
        })
    })

    const result = await prom

    return { isZipped: result }
  },

  'GET::/file-diffs-compare': async (req, res) => {
    const { baselineObjs } = state
    if (!baselineObjs) {
      return { isError: 'Missing baseline snapshot' }
    }

    const { baseline, current } = state.config
    const currentFiles = await readdir(current, { depth: 5 })

    const dateCompared = new Date()
    const currentObjs = toPathObjects(currentFiles, current)
    state.currentObjs = currentObjs
    const report = {
      meta: { dateCompared, baseline, current },
      added: [],
      modified: [],
      accessed: [],
      statusChanged: [],
    }

    const sizes = []

    for (var shortPath in currentObjs) {
      const curr = currentObjs[shortPath]
      const base = baselineObjs[shortPath]
      let isConsidered = false

      if (!base) {
        report.added.push(shortPath)
        isConsidered = true
      } else {
        // if (curr.atimeMs > base.atimeMs) {
        //   report.accessed.push(shortPath)
        //   isConsidered = true
        // }

        if (curr.mtimeMs > base.mtimeMs) {
          report.modified.push(shortPath)
          isConsidered = true
        }

        // if (curr.ctimeMs > base.ctimeMs) {
        //   report.statusChanged.push(shortPath)
        //   isConsidered = true
        // }
      }

      if (isConsidered) {
        sizes.push(curr.size)
      }
    }

    report.meta.totalSize = sizes.reduce((acc, size) => acc + size, 0)
    report.meta.totalSizePretty = byteSize(report.meta.totalSize).toString()

    state.report = report

    return report
  },
})

const toPathObjects = (files, baseURL) => {
  const results = {}

  for (var file of files) {
    if (file.isDir) continue
    const shortPath = file.path.replace(baseURL + '/', '')
    const { size, atimeMs, mtimeMs, ctimeMs } = fs.statSync(file.path)
    results[shortPath] = { size, atimeMs, mtimeMs, ctimeMs }
  }

  return results
}
