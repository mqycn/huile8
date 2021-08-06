// 配置项
const vscode = require('vscode')

const configAll = []

class Config {
  constructor(key) {
    configAll.push(this)
    this.key = key
    this.changeEvent = new vscode.EventEmitter()
  }

  get value() {
    return vscode.workspace.getConfiguration().get(this.key)
  }

  set value(newVal) {
    this.trigger()
    vscode.workspace.getConfiguration().update(this.key, newVal, true)
  }

  change(func) {
    this.changeEvent.event(func)
  }

  trigger() {
    this.changeEvent.fire(null)
  }
}

module.exports = {
  autoRefresh: new Config('huile8.autoRefresh'),
  readType: new Config('huile8.readType'),
  voiceType: new Config('huile8.voiceType'),
  configReload: vscode.workspace.onDidChangeConfiguration(() => {
    configAll.forEach((item) => item.trigger())
  }),
}
