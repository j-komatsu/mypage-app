const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // 追加：React アプリを読み込む
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorDescription);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        app.emit('ready');
    }
});

mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorDescription);
    console.error('URL:', validatedURL);
    console.error('Error Code:', errorCode);
});

mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Console: ${message} (source: ${sourceId}, line: ${line})`);
});

console.log("アプリの起動を開始しています...");
mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'))
  .then(() => console.log("index.html が正常に読み込まれました"))
  .catch((error) => console.error("index.html の読み込みに失敗しました:", error));
