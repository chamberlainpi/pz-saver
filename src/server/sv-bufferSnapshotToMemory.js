import _ from 'lodash'
import fs from 'fs-extra'
import JSZip from 'jszip'
import dayjs from 'dayjs'
import { readdir } from './sv-extensions.js'

export async function bufferSnapshotToMemory(current, snapshot) {
  const nowFormatted = dayjs().format('YYYY-MM-DD_HH-mm-ss')
  const currentName = current.split('/').pop() + '__' + nowFormatted
  const allFiles = await readdir(current, { depth: 5, bare: true, filterNoDir: true })

  const zip = (snapshot.zip = new JSZip())

  const allChunkedFiles = _.chunk(allFiles, 500)

  for (var chunkedFiles of allChunkedFiles) {
    const chunkedPromises = []

    for (var fullpath of chunkedFiles) {
      ;(fullpath => {
        const relPath = fullpath.replace(current + '/', '')
        chunkedPromises.push(async () => ({
          relPath,
          fullpath,
          buffer: await fs.readFile(fullpath),
        }))
      })(fullpath)
    }

    const chunkedBuffers = await Promise.all(chunkedPromises.map(prom => prom()))
    process.stdout.write('.')

    for (var chunkedBuff of chunkedBuffers) {
      zip.file(chunkedBuff.relPath, chunkedBuff.buffer)
    }
  }

  try {
    gc() //Run the garbage-collector after this long-process as it generates many objects.
  } catch (err) {
    console.log('Should run with V8 flag: --expose-gc')
    process.exit()
  }

  snapshot.dateZippedMS = _.now()
  snapshot.name = currentName

  return { allFiles }
}
