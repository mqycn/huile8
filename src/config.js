// 配置项
const vscode = require("vscode");

const configAll = [];

class Config {
    constructor(key) {
        configAll.push(this);
        this.key = key;
        this.changeEvent = new vscode.EventEmitter();
    }

    get value() {
        return vscode.workspace.getConfiguration().get(this.key);
    }

    set value(newVal) {
        this.trigger();
        vscode.workspace.getConfiguration().update(this.key, newVal, true);
    }

    change(func) {
        this.changeEvent.event(func);
    }

    trigger() {
        this.changeEvent.fire(null);
    }
}

module.exports = {
    autoRefresh: new Config("huile8.autoRefresh"),
    gistId: new Config("huile8.gistId"),
    gistToken: new Config("huile8.gistToken"),
    youdaoAppKey: new Config("huile8.youdaoAppKey"),
    baiduApiKey: new Config("huile8.baiduApiKey"),
    baiduSecretKey: new Config("huile8.baiduSecretKey"),
    configReload: vscode.workspace.onDidChangeConfiguration(() => {
        configAll.forEach((item) => item.trigger());
    }),
};
