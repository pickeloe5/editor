const electron = require('electron')

const editorJS = {}
for (const key of ['getConfig', 'save', 'load'])
  editorJS[key] = (...args) =>
    electron.ipcRenderer.invoke(key, ...args)

electron.contextBridge.exposeInMainWorld('editorJS', editorJS)
