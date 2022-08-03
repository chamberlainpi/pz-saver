import _ from 'lodash'
import fs from 'fs-extra'
import { isProcessRunning, readdir, saveData } from './sv-extensions.js'
import { restoreFromZIP } from './sv-restoreFromZIP.js'
import { bufferSnapshotToMemory } from './sv-bufferSnapshotToMemory.js'
import { bufferSnapshotWriteToFile } from './sv-bufferSnapshotWriteToFile.js'

const makeDatedZip = () => ({ zip: null, dateZippedMS: -1, name: 'no-name' })
const ZIP_SNAPSHOTS = {
  index: 0,
  pair: [makeDatedZip(), makeDatedZip()],
}

export const createRoutes = STATE => ({
  'GET::/config': (req, res) => [STATE.config],

  'POST::/config': async (req, res) => {
    STATE.config = req.body

    return await saveData(STATE.config, STATE.YAML_CONFIG)
  },

  'GET::/load-game-folders': async (req, res) => {
    const { pzRoot } = STATE.config
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

  'GET::/status': async (req, res) => {
    const isPZRunning = await isProcessRunning('Zomboid')
    return { isPZRunning }
  },

  'GET::/backups': async (req, res) => {
    const zipFiles = await readdir(STATE.PRIVATE_DIR, {
      filter: '.zip',
      bare: true,
    })

    STATE.zipFiles = zipFiles.map((value, key) => ({ value, key }))

    return STATE.zipFiles
  },

  'PUT::/backup-restore/:id': async (req, res) => {
    if (STATE.isRestoring) return { isError: 'Restoring in progress' }

    const zipInfo = STATE.zipFiles[req.params.id]

    if (!zipInfo) return { isError: 'Zip does not exists' }

    await restoreFromZIP(STATE, zipInfo)

    return { ok: 1, zip: zipInfo.value }
  },

  'DELETE::/backup-delete/:id': async (req, res) => {
    if (STATE.isRestoring) return { isError: 'Restoring in progress' }

    const zipInfo = STATE.zipFiles[req.params.id]

    if (!zipInfo) return { isError: 'Zip does not exists' }

    await fs.unlink(zipInfo.value)

    return { deleted: 1, zip: zipInfo.value }
  },

  'POST::/buffer-snapshot': async (req, res) => {
    if (STATE.isRestoring) return { isError: 'Restoring in progress' }
    if (ZIP_SNAPSHOTS.isSaving) return { isError: 'Saving in progress, cannot buffer a snapshot' }

    ZIP_SNAPSHOTS.index = 1 - ZIP_SNAPSHOTS.index
    const currentSnapshot = ZIP_SNAPSHOTS.pair[ZIP_SNAPSHOTS.index]

    const { current } = STATE.config

    await bufferSnapshotToMemory(current, currentSnapshot)

    const pair = ZIP_SNAPSHOTS.pair.map(p => _.omit(p, 'zip'))
    return { isBuffered: true, pair }
  },

  'POST::/buffer-write-current': async (req, res) => {
    if (STATE.isRestoring) return { isError: 'Restoring in progress' }
    if (STATE.isSaving) return { isError: 'Already busy writing ZIP file.' }

    const index = req.body.which === 'now' ? ZIP_SNAPSHOTS.index : 1 - ZIP_SNAPSHOTS.index
    const currentSnapshot = ZIP_SNAPSHOTS.pair[index]

    return await bufferSnapshotWriteToFile(currentSnapshot, STATE)
  },
})
