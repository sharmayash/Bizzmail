const electron = require("electron");
const express = require("./server/app");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on("ready", () => {
  express();

  let { width, height } = electron.screen.getPrimaryDisplay().size;

  // create new window

  mainWindow = new BrowserWindow({
    height: height,
    width: width,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      plugins: true
    }
  });

  // Load UI
  mainWindow.loadURL("http://localhost:3001/");

  mainWindow.maximize();

  // Build Menu
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
});

// Template Menu

const template = [];
