const electron = require('electron')

electron.app.on('window-all-closed', () => {
  electron.app.quit()
})

electron.app.whenReady().then(() => {
  const w = new electron.BrowserWindow({show: false})
  w.maximize()
  w.loadFile('public/index.html')
  w.show()
})
