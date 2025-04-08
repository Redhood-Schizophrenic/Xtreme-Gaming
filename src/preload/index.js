import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  notify: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
  customDialog: (page) => ipcRenderer.invoke('custom-dialog', { page }),
  customDialogClose: () => ipcRenderer.invoke('custom-dialog-close'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose API:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
