// 状态栏
const vscode = require('vscode');
const { CommandRefresh } = require('./const');

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBar.show();
statusBar.tooltip = '会了吧';
statusBar.command = CommandRefresh;

const statusDefault = '自动分析单词';

let timerTask

module.exports = {
  update(message) {
    statusBar.text = message;
    timerTask && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
      statusBar.text = statusDefault
    }, 5000)
  }
} 