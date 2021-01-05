// 获取当前打开页面的单词
const vscode = require('vscode');
const WordProvider = require('./word-provider');
const { hasMastered, addMastered, removeMastered } = require('./storage');
const getWords = require('./parse');
const readPanel = require('./read-panel');
const statusBar = require('./status-bar');
const { configReload, autoRefresh } = require('./config');

class WordsApp {

  constructor(context) {
    // 创建 Provider
    this.providerMastered = new WordProvider(context);
    this.providerWillMastering = new WordProvider(context);

    // 监听文件窗口
    vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
    this.onActiveEditorChanged();

    // 监听配置改变
    context.subscriptions.push(configReload);
  }

  // 打开的文件
  onActiveEditorChanged() {
    autoRefresh.value && this.refresh();
  }

  // 清空单词列表
  dataInit() {
    this.providerMastered.clear();
    this.providerWillMastering.clear();
    return this;
  }

  // 检查编辑器
  checkEditor() {
    if (!vscode.window.activeTextEditor) {
      statusBar.update('请切换到代码文件');
    } else if (vscode.window.activeTextEditor.document.uri.scheme !== 'file') {
      statusBar.update('只支持本地文件');
    } else {
      return true
    }
  }

  // 分析新打开文件包含的单词
  refresh() {
    if (this.checkEditor()) {
      statusBar.update('单词分析中...');
      this.analyse(vscode.window.activeTextEditor.document.getText())
    }
  }

  // 分析选文本
  selected() {
    if (this.checkEditor()) {
      statusBar.update('分析选中代码中...');
      this.analyse(vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection))
    }
  }

  // 分析结果
  analyse(text) {
    // 单词整理，暂时先都放到 还不会
    const { providerWillMastering, providerMastered } = this.dataInit();
    getWords(text).forEach(word => {
      if (hasMastered(word)) {
        providerMastered.list.push(word);
      } else {
        providerWillMastering.list.push(word);
      }
    });

    // 更新并清空Set
    providerMastered.flush();
    providerWillMastering.flush();
  }

  // 还不会 -> 已学会
  didMastered(item) {
    addMastered(item);
    this.providerMastered.push(item);
    this.providerWillMastering.remove(item);
  }

  // 已学会 ->  还不会
  willMastering(item) {
    removeMastered(item);
    this.providerMastered.remove(item);
    this.providerWillMastering.push(item);
  }

  // 阅读
  read(item) {
    readPanel().postMessage(item);
  }
};

module.exports = {
  WordsApp
};

