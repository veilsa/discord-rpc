const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

var rpc = require("discord-rpc");
const client = new rpc.Client({ transport: 'ipc' });
if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    frame:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('kaydet', function (e, bilgiler) {

  if (isNaN(bilgiler.clientid)) {
    return;
  }

  client.on('ready', () => {

    client.request('SET_ACTIVITY', {
      pid: process.pid,
      activity: {
        details: bilgiler.details,
        assets: {
          large_image: bilgiler.large_image,
          large_text: bilgiler.large_image_text,
          small_image: bilgiler.small_image,
          small_text: bilgiler.small_image_text
        },
        buttons: [{ label: bilgiler.label, url: bilgiler.url }]
      }
    })
  })

  client.login({ clientId: bilgiler.clientid }).catch(console.error);
});