import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import JSZip from 'jszip'
import { wait } from './sv-extensions.js'

export async function restoreFromZIP(STATE, zipInfo) {
  STATE.isRestoring = true

  const spinner = ora().start()
  spinner.color = 'gray'

  const STATUS = (str, color = 'gray') => {
    spinner.color = color
    spinner.text = `Backup Restoring: ${str}`
  }

  STATUS('Deleting previous content...')

  await wait(1000)

  await fs.emptyDir(STATE.config.current)

  STATUS('Loading ZIP content...')

  const zipContent = await fs.readFile(zipInfo.value)
  const zip = await JSZip.loadAsync(zipContent)

  const allWriteOperations = []

  zip.forEach((relPath, file) => {
    allWriteOperations.push({ relPath, file })
  })

  let fileCount = 0
  const errors = []

  const writeFileOrFolder = async ({ relPath, file }) => {
    const fixSlash = str => str.replace(/\\/g, '/')
    const absPath = fixSlash( path.join(STATE.config.current, relPath) )
    const exists = fs.existsSync(absPath)

    try {
      if (absPath.endsWith('/')) {
        if (!exists) {
          await fs.mkdirp(absPath)
        }
      } else {
        const buff = await file.async('nodebuffer')
        await fs.writeFile(absPath, buff)
      }
    } catch (err) {
      errors.push('Could not write: ' + absPath + ' ' + exists)
    }
  }

  for (var writeOp of allWriteOperations) {
    fileCount++
    STATUS(`Writing files & folders... ${fileCount}/${allWriteOperations.length}`)
    await writeFileOrFolder(writeOp)
  }

  STATE.isRestoring = false
  spinner.succeed(`Restored ${allWriteOperations.length} files & folders from: ${zipInfo.value.split('/').pop()}`)

  if (errors.length) {
    trace(errors.join('\n').red)
  }
}
