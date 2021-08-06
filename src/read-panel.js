// 创建播放窗口
const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const statusBar = require('./status-bar')
const { readType, voiceType } = require('./config')

const viewPath = path.join(__dirname, '..', 'view', 'list.html')
const viewHtml = fs.readFileSync(viewPath, {
  encoding: 'utf-8',
})

function updateWebview(panel, viewHtml, readType) {
  panel.webview.html = viewHtml
    .replace(/\/\* readType = '' \*\//g, `readType = '${readType.value}'`)
    .replace(/\/\* voiceType = '0' \*\//g, `voiceType = '${voiceType.value}'`)
}

let _readPanel

module.exports = function () {
  if (!_readPanel) {
    const activeDocument = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.document
      : null
    const panel = (_readPanel = vscode.window.createWebviewPanel(
      'ReadPanel',
      '会了吧：单词朗读',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    ))

    updateWebview(panel, viewHtml, readType)

    // 读完关闭
    panel.webview.onDidReceiveMessage((_data) => {
      const { word, data } = _data
      statusBar.update(
        [
          `朗读: ${word}`,
          data && data.phonetic ? `音标：[${data.phonetic}]` : '',
        ].join('　')
      )
    })

    // 关闭事件
    panel.onDidDispose(() => {
      _readPanel = null
    })

    // 启动后激活之前的标签
    if (activeDocument) {
      setTimeout(() => {
        vscode.window.showTextDocument(activeDocument)
      }, 200)
    }
  }
  return _readPanel.webview
}
