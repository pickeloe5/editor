const path = require('path')
const electron = require('electron')
const fs = require('fs')

if (process.argv.length < 3) {
  electron.app.quit()
  throw new Error('Expected path from command line')
}

const FILE_PATH = path.join('.', process.argv[2])
const PRELOAD_PATH = path.join(__dirname, 'preload.js')

electron.app.on('window-all-closed', () => {
  electron.app.quit()
})

const bridge = {
  save(e, text) {
    fs.writeFileSync(FILE_PATH, text)
  },
  load(e) {
    if (!fs.existsSync(FILE_PATH))
      return ''
    return fs.readFileSync(FILE_PATH).toString()
  }
}

electron.app.whenReady().then(() => {
  for (const key in bridge)
    electron.ipcMain.handle(key, bridge[key])
  const w = new electron.BrowserWindow({
    show: false, webPreferences: {preload: PRELOAD_PATH}})
  w.maximize()
  w.loadFile('public/index.html')
  w.show()
})
