import { WindowController } from './window-controller';

import { app, Tray, nativeImage, Menu, ipcMain } from 'electron';
import path = require('path');

export class TrayController {
  windowController: WindowController;
  tray!: Electron.Tray;
  constructor(windowController: WindowController) {
    this.windowController = windowController;
    this.init();
  }

  init() {
    this.tray = new Tray(this.createTrayIcon(0));

    const context = Menu.buildFromTemplate([
      { label: 'Quit', click: () => this.cleanupAndQuit() }
    ]);

    this.tray.setContextMenu(context);

    this.tray.on('click', () => this.fireClickEvent());

    ipcMain.on('updateUnread', (value: number) => {
      this.tray.setImage(this.createTrayIcon(value));
    });
  }

  createTrayIcon(value: number) {
    const iconPath = value
      ? '../../assets/outlook_linux_unread.png'
      : '../../assets/outlook_linux_black.png';
    return nativeImage.createFromPath(path.join(__dirname, iconPath));
  }

  fireClickEvent() {
    this.windowController.toggleWindow();
  }

  cleanupAndQuit() {
    app.exit(0);
  }
}