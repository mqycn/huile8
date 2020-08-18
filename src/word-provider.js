// 单词列表
const vscode = require('vscode');
const { CommandRead } = require('./const');

module.exports = class WordProvider {
  constructor(context) {
    this.context = context;
    this.changeTreeDataEmitter = new vscode.EventEmitter();
    this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
    this.list = [];
  }

  // 清空单词
  clear() {
    this.list = [];
    this.flush();
  }

  // 添加 单词
  push(word) {
    if (this.list.indexOf(word) == -1) {
      this.list.push(word);
      this.flush();
    }
  }

  // 删除单词
  remove(word) {
    this.list = this.list.filter(item => word != item);
    this.flush();
  }

  // 刷新
  flush() {
    this.list.sort();
    this.changeTreeDataEmitter.fire(undefined);
  }

  // 获取子节点
  getChildren() {
    return this.list;
  }

  // 获取元素内容
  getTreeItem(element) {
    return new WordItem(element);
  }
};

class WordItem extends vscode.TreeItem {
  constructor(word) {
    super(word);
    this.word = word;
  };

  get command() {
    return {
      command: CommandRead,
      title: `播放 ${this.word}`,
      arguments: [this.word]
    };
  }

  get tooltip() {
    return 'TODO: 翻译内容';
  }
};