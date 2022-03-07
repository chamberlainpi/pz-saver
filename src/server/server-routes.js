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

    const prettyMem = () => {
      const memResults = _.mapValues(process.memoryUsage(), v => byteSize(v).toString())
      return JSON.stringify(memResults).replace(/[{}"]/g, '').replace(/,/g, ', ')
    }

    for (var fullpath of allFiles) {
      const relPath = fullpath.replace(current + '/', '')
      zip.file(relPath, fs.readFile(fullpath))
    }

    try {
      gc()
    } catch (err) {
      console.log('Should run with V8 flag: --expose-gc')
    }
    currentSnapshot.dateZippedMS = _.now()
    currentSnapshot.name = currentName

    trace('POST::/buffer-snapshot:'.gray, `# files: ${allFiles.length}\n  ${prettyMem().yellow}`)

    const pair = ZIP_SNAPSHOTS.pair.map(p => _.omit(p, 'zip'))
    return { isBuffered: true, pair }
  },

  'POST::/buffer-write-current': async (req, res) => {
    if (ZIP_SNAPSHOTS.isSaving) return { isError: 'Already busy writing ZIP file.' }
    ZIP_SNAPSHOTS.isSaving = true

    const index = req.body.which === 'now' ? ZIP_SNAPSHOTS.index : 1 - ZIP_SNAPSHOTS.index
    const currentSnapshot = ZIP_SNAPSHOTS.pair[index]

    if (!currentSnapshot.zip) {
      ZIP_SNAPSHOTS.isSaving = false
      return { isError: `No ZIP ready yet, might be too early / full cycle didn't happen yet?` }
    }

    const prom = new Promise(_then => {
      const { zip, name } = currentSnapshot
      const outFile = state.ZIP_SNAPSHOT.replace('[name]', name)

      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(outFile))
        .on('finish', () => {
          trace('ZIP finished current: ', outFile)
          ZIP_SNAPSHOTS.isSaving = false
          _then(true)
        })
    })

    const result = await prom

    return { isZipped: result }
  },
})
