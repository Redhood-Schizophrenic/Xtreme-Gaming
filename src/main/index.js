import { app, shell, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'


let dialogWindow = null;
let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });


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
    mainWindow.webContents.openDevTools();
    // Ensure URL uses forward slashes for Windows compatibility
    const rendererUrl = process.env['ELECTRON_RENDERER_URL'].replace(/\\/g, '/');
    mainWindow.loadURL(rendererUrl)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // IPC for Native Notification
  ipcMain.handle('show-notification', (_, { title, body }) => {
    try {
      const notification = new Notification({
        title,
        body,
        silent: false
      });
      notification.show();
      return true;
    } catch (error) {
      console.error('Notification error:', error);
      return false;
    }
  });

  // IPC for custom dialog close - defined once outside the dialog handler
  ipcMain.handle('custom-dialog-close', () => {
    if (dialogWindow) {
      dialogWindow.close();
      dialogWindow = null;
      return { success: true };
    }
    return { success: false };
  });

  // IPC for custom dialog box
  ipcMain.handle('custom-dialog', (_, { page }) => {
    if (dialogWindow) {
      dialogWindow.focus();
      return { success: false, message: 'Dialog already open' };
    }

    dialogWindow = new BrowserWindow({
      width: 600,
      height: 400,
      resizable: false,
      minimizable: false,
      maximizable: false,
      parent: BrowserWindow.getAllWindows(),
      modal: true,
      show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    });

    // Handle dialog closed by user (X button)
    dialogWindow.on('closed', () => {
      dialogWindow = null;
    });

    dialogWindow.removeMenu();
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      // Ensure forward slashes for URLs - important for Windows compatibility
      const normalizedPage = page.split(/[\\\/]/).join('/');
      // Ensure the base URL also uses forward slashes
      const baseUrl = process.env['ELECTRON_RENDERER_URL'].replace(/\\/g, '/');
      const url = `${baseUrl}/${normalizedPage}`;
      dialogWindow.loadURL(url)
    } else {
      // For production, we need to load the HTML file and then navigate to the correct route
      dialogWindow.loadFile(join(__dirname, '../renderer/index.html'))
      // Wait for the page to load, then navigate to the correct route
      dialogWindow.webContents.once('did-finish-load', () => {
        dialogWindow.webContents.executeJavaScript(`window.location.hash = '${page}'`)
      })
    }
    dialogWindow.once('ready-to-show', () => {
      dialogWindow.show()
    });

    return { success: true };
  });

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
