const electron = require("electron");
const {BrowserWindow,app,ipcMain} = electron;
let fexplorer = require("./electron-components/fexplorer.js");

let mainWindow;

app.on("ready",()=>{
   mainWindow = new BrowserWindow({ minHeight: 600, minWidth: 800 });
   mainWindow.loadURL(`file://${__dirname}/ui/index.html`);
   // Load Components
   new fexplorer(mainWindow,ipcMain); // file explorer
});

app.on("window-all-close",()=>{
   app.exit();
});


