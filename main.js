const { app, BrowserWindow, ipcMain, crashReporter } = require('electron');
const path = require('path');
const url = require('url');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
};

// Logger for autoUpdater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let win = null;

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });
  win.maximize();

  // Specify entry point
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file',
    slashes: true
  }));

  if (isDev()) {
    win.toggleDevTools();
  }
  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });

  //signal from core.component to check for update
  ipcMain.on('ready', (coreCompEvent, arg) => {
    if (!isDev()) {
      autoUpdater.checkForUpdates().then(() => {
        log.info('done checking for updates');
        coreCompEvent.sender.send('release-info', autoUpdater.updateInfoAndProvider.info);
      });
      autoUpdater.on('update-available', (event, info) => {
        log.info('update available');
        coreCompEvent.sender.send('available', true);
      });
      autoUpdater.on('update-not-available', (event, info) => {
        log.info('no update available..');
      });
      autoUpdater.on('error', (event, error) => {
        log.info('error');
        coreCompEvent.sender.send('error', error);
      });

      autoUpdater.on('update-downloaded', (event, info) => {
        // autoUpdater.quitAndInstall();
        coreCompEvent.sender.send('update-downloaded');
      });
    }
  })

  ipcMain.once('quit-and-install', (event, arg) => {
    autoUpdater.quitAndInstall();s
  })

  //Check for updates and install
  autoUpdater.autoDownload = false;

  crashReporter.start({
    productName: "ORNL-AMO",
    companyName: "ornl-amo",
    submitURL: "https://ornl-amo.sp.backtrace.io:6098/post?format=minidump&token=9e914fbd14a36589b7e2ce09cf8c3b4b5b3e37368da52bf1dabff576f156126c",
    uploadToServer: true
  });
});

// Listen for message from core.component to either download updates or not
ipcMain.once('update', (event, arg) => {
  log.info('update')
  autoUpdater.downloadUpdate();
});

ipcMain.once('later', (event, arg) => {
  update = null;
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
