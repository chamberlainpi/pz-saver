import _ from 'lodash'
import fs from 'fs-extra'
import ora from 'ora'

export async function bufferSnapshotWriteToFile(snapshot, STATE) {
  STATE.isSaving = true

  if (!snapshot.zip) {
    STATE.isSaving = false
    return { isError: `No ZIP ready yet, might be too early / full cycle didn't happen yet?` }
  }

  const spinner = ora().start()
  spinner.color = 'gray'

  const STATUS = (str, color = 'gray') => {
    spinner.color = color
    spinner.text = `Creating Backup: ${str}`
  }

  STATUS('Writing ZIP...')

  const result = await new Promise(_then => {
    const { zip, name } = snapshot
    const outFile = STATE.ZIP_SNAPSHOT.replace('[name]', name)

    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(outFile))
      .on('finish', () => {
        spinner.succeed('ZIP finished! ' + outFile)
        _then(true)
      })
  })

  STATE.isSaving = false

  return { isZipped: result }
}
