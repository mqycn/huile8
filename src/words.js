// 获取当前打开页面的单词
const vscode = require('vscode');
const WordProvider = require('./word-provider');
const { hasMastered, addMastered, removeMastered } = require('./storage');

class WordsApp {

  constructor(context) {
    // 创建 Provider
    this.providerMastered = new WordProvider(context);
    this.providerWillMastering = new WordProvider(context);

    // 监听文件窗口
    vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
    this.onActiveEditorChanged();
  }

  // 打开的文件
  onActiveEditorChanged() {
    if (vscode.window.activeTextEditor) {
      if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
        this.refresh();
      }
    }
  }

  // 清空单词列表
  dataInit() {
    this.providerMastered.clear();
    this.providerWillMastering.clear();
    return this;
  }

  // 分析新打开文件包含的单词
  refresh() {
    const wordsSet = new Set();
    const text = vscode.window.activeTextEditor.document.getText();
    text.replace(/([A-Za-z][a-z]+)/g, ($1, $2) => {
      wordsSet.add($2.toLowerCase());
      return '-';
    });

    // 单词整理，暂时先都放到 还不会
    const { providerWillMastering, providerMastered } = this.dataInit();
    Array.from(wordsSet).forEach(word => {
      if (hasMastered(word)) {
        providerMastered.list.push(word);
      } else {
        providerWillMastering.list.push(word);
      }
    });

    // 更新并清空Set
    providerMastered.flush();
    providerWillMastering.flush();
    wordsSet.clear();

    // 分析完毕
    vscode.window.showInformationMessage('所有包含的单词分析完毕！');
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
    vscode.window.showInformationMessage(`TODO: 播放${item}`);
  }
};

module.exports = {
  WordsApp
};

