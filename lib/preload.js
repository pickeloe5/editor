const electron = require('electron')

const nativeApi = {}
for (const key of ['save', 'load'])
  nativeApi[key] = (...args) =>
    electron.ipcRenderer.invoke(key, ...args)

electron.contextBridge.exposeInMainWorld('nativeApi', nativeApi)
