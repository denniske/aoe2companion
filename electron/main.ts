import { app, BrowserWindow, screen, ipcMain, Notification } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as Electrolytic from 'electrolytic';

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

let electrolyticToken = null;

const electrolytic = Electrolytic({
  appKey: 'IpANYN0DRa84xPpmvQ9Z',
});

electrolytic.on('token', token => {
  electrolyticToken = token;
  console.log('user token', token);
});

function showNotification (payload) {
  const notification = new Notification(payload);
  notification.once('click', (event) => {
    win.webContents.send('electrolytic-notification', payload);
  });
  notification.show();
}

electrolytic.on('push', (payload) => {
  console.log('got push notification', payload);
  console.log('isVisible', win.isVisible());
  showNotification(payload);
  // win.show();
})

electrolytic.on('config', (updatedConfig) => {
  console.log('look ma, updated config!', updatedConfig);
});

ipcMain.on('get-electrolytic-token', (event, arg) => {
  const sendTokenToApp = token => {
    event.sender.send('get-electrolytic-token-response', token);
    electrolytic.off('token', sendTokenToApp);
  };
  if (electrolyticToken) {
    sendTokenToApp(electrolyticToken);
  } else {
    electrolytic.on('token', sendTokenToApp);
  }
});

const debug = true && serve;
const width = 450 + (debug ? 557 : 0);

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    x: size.width - width - 50,
    y: 50,
    frame: false,
    transparent: true,
    resizable: false,
    width: width,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {
    if (debug) {
      win.webContents.openDevTools();
    }

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });

    // win.loadURL('http://localhost:4200');
    // win.loadURL('https://app.aoe2companion.com');
    // win.loadURL('http://192.168.178.10:19006');
    // win.loadURL('http://localhost:19006');
    win.loadURL(serve ? 'http://localhost:19006' : 'https://app.aoe2companion.com');
    // win.setIgnoreMouseEvents(true);

    // const el = win.getBrowserView().webContents. document.getElementsByTagName('body')[0];
    // console.log('el', el);
    // el.addEventListener('mouseenter', () => {
    //   console.log('mouseenter');
    //   win.setIgnoreMouseEvents(true, { forward: true })
    // })
    // el.addEventListener('mouseleave', () => {
    //   console.log('mouseleave');
    //   win.setIgnoreMouseEvents(false)
    // })

  } else {
    win.loadURL('https://app.aoe2companion.com');
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, 'dist/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));
  }

  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
