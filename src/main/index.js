import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import icon from '../../resources/icon.png?asset'

// Store the main window reference
let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  })

  // CSP is set in the HTML meta tag

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open DevTools in development mode
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}

// Terminal control handlers
function setupTerminalHandlers() {
  // Get all terminals
  ipcMain.handle('terminals:getAll', async () => {
    // This would be implemented to scan the network for terminals
    // For now, return mock data
    return [
      { id: 1, name: 'Terminal 1', status: 'active', ip: '192.168.1.101', group: 'Gaming' },
      { id: 2, name: 'Terminal 2', status: 'active', ip: '192.168.1.102', group: 'Gaming' },
      { id: 3, name: 'Terminal 3', status: 'inactive', ip: '192.168.1.103', group: 'Standard' },
      { id: 4, name: 'Terminal 4', status: 'active', ip: '192.168.1.104', group: 'Premium' }
    ]
  })

  // Get terminal status
  ipcMain.handle('terminals:getStatus', async (_, terminalId) => {
    // This would ping the terminal to get its status
    // For now, return mock data
    return { status: 'active', lastSeen: new Date().toISOString() }
  })

  // Restart terminal
  ipcMain.handle('terminals:restart', async (_, terminalId) => {
    // This would send a restart command to the terminal
    // For now, just return success
    return { success: true, message: `Terminal ${terminalId} restart command sent` }
  })

  // Shutdown terminal
  ipcMain.handle('terminals:shutdown', async (_, terminalId) => {
    // This would send a shutdown command to the terminal
    // For now, just return success
    return { success: true, message: `Terminal ${terminalId} shutdown command sent` }
  })

  // Lock terminal
  ipcMain.handle('terminals:lock', async (_, terminalId) => {
    // This would send a lock command to the terminal
    // For now, just return success
    return { success: true, message: `Terminal ${terminalId} lock command sent` }
  })

  // Unlock terminal
  ipcMain.handle('terminals:unlock', async (_, terminalId) => {
    // This would send an unlock command to the terminal
    // For now, just return success
    return { success: true, message: `Terminal ${terminalId} unlock command sent` }
  })

  // Get terminal screenshot
  ipcMain.handle('terminals:getScreenshot', async (_, terminalId) => {
    // This would capture a screenshot from the terminal
    // For now, return a placeholder
    return { success: true, data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' }
  })
}

// System handlers
function setupSystemHandlers() {
  // Create backup
  ipcMain.handle('system:createBackup', async () => {
    try {
      const date = new Date().toISOString().replace(/:/g, '-')
      const backupPath = path.join(app.getPath('userData'), `backup-${date}.zip`)

      // This would create a backup of the database
      // For now, just create an empty file
      fs.writeFileSync(backupPath, '')

      return { success: true, path: backupPath }
    } catch (error) {
      console.error('Backup error:', error)
      return { success: false, error: error.message }
    }
  })

  // Restore from backup
  ipcMain.handle('system:restoreBackup', async (_, backupPath) => {
    try {
      // This would restore from a backup file
      // For now, just check if the file exists
      if (fs.existsSync(backupPath)) {
        return { success: true, message: 'Backup restored successfully' }
      } else {
        return { success: false, error: 'Backup file not found' }
      }
    } catch (error) {
      console.error('Restore error:', error)
      return { success: false, error: error.message }
    }
  })

  // Get system info
  ipcMain.handle('system:getInfo', async () => {
    return {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      platform: process.platform,
      arch: process.arch,
      userDataPath: app.getPath('userData')
    }
  })
}

// Export handlers
function setupExportHandlers() {
  // Export to CSV
  ipcMain.handle('export:toCsv', async (_, data) => {
    try {
      const { defaultPath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export to CSV',
        defaultPath: path.join(app.getPath('documents'), 'export.csv'),
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
      })

      if (defaultPath) {
        // Convert data to CSV and save
        const csvContent = typeof data === 'string' ? data : 'No data provided'
        fs.writeFileSync(defaultPath, csvContent)
        return { success: true, path: defaultPath }
      } else {
        return { success: false, error: 'Export cancelled' }
      }
    } catch (error) {
      console.error('CSV export error:', error)
      return { success: false, error: error.message }
    }
  })

  // Export to Excel
  ipcMain.handle('export:toExcel', async (_, data) => {
    try {
      const { defaultPath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export to Excel',
        defaultPath: path.join(app.getPath('documents'), 'export.xlsx'),
        filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
      })

      if (defaultPath) {
        // This would convert data to Excel and save
        // For now, just create an empty file
        fs.writeFileSync(defaultPath, '')
        return { success: true, path: defaultPath }
      } else {
        return { success: false, error: 'Export cancelled' }
      }
    } catch (error) {
      console.error('Excel export error:', error)
      return { success: false, error: error.message }
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.xtremegaming.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Setup IPC handlers
  setupTerminalHandlers()
  setupSystemHandlers()
  setupExportHandlers()

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Clean up resources when app is about to quit
app.on('will-quit', () => {
  // Add any cleanup code here if needed
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
