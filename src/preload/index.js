import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Terminal control functions
  terminals: {
    // Get all terminals
    getAll: () => ipcRenderer.invoke('terminals:getAll'),
    // Get terminal status
    getStatus: (terminalId) => ipcRenderer.invoke('terminals:getStatus', terminalId),
    // Restart terminal
    restart: (terminalId) => ipcRenderer.invoke('terminals:restart', terminalId),
    // Shutdown terminal
    shutdown: (terminalId) => ipcRenderer.invoke('terminals:shutdown', terminalId),
    // Lock terminal
    lock: (terminalId) => ipcRenderer.invoke('terminals:lock', terminalId),
    // Unlock terminal
    unlock: (terminalId) => ipcRenderer.invoke('terminals:unlock', terminalId),
    // Get terminal screenshot
    getScreenshot: (terminalId) => ipcRenderer.invoke('terminals:getScreenshot', terminalId),
  },

  // System functions
  system: {
    // Create backup
    createBackup: () => ipcRenderer.invoke('system:createBackup'),
    // Restore from backup
    restoreBackup: (backupPath) => ipcRenderer.invoke('system:restoreBackup', backupPath),
    // Get system info
    getInfo: () => ipcRenderer.invoke('system:getInfo'),
  },

  // Export functions
  export: {
    // Export data to CSV
    toCsv: (data) => ipcRenderer.invoke('export:toCsv', data),
    // Export data to Excel
    toExcel: (data) => ipcRenderer.invoke('export:toExcel', data),
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
