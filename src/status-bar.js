// 状态栏
const vscode = require('vscode');
const { CommandRefresh } = require('./const');
const { autoRefresh } = require('./config');

let defaultStatus;

const getStatus = () => {
  defaultStatus = autoRefresh.value ? '自动分析单词' : '点击分析单词';
  return defaultStatus
}

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBar.text = getStatus();
statusBar.show();
statusBar.tooltip = '会了吧';
statusBar.command = CommandRefresh;

autoRefresh.change(() => {
  statusBar.text = getStatus();
});

let timerTask
module.exports = {
  update(message) {
    statusBar.text = message;
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
      statusBar.text = defaultStatus;
    }, 5000);
  }
}