// 单词列表
const vscode = require('vscode');
const { CommandRead } = require('./const');
const path = require('path');

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
    const tree = [];
    let element = {};
    this.list.sort().forEach(word => {
      let prefix = word.substr(0, 1);
      if (element.prefix != prefix) {
        element = {
          prefix,
          children: []
        };
        tree.push(element);
      }
      element.children.push(word);
    });
    this.tree = tree;
    this.changeTreeDataEmitter.fire(undefined);
  }

  // 获取子节点
  getChildren(element) {
    if (!element) {
      return this.tree;
    } else {
      return element.children;
    }
  }

  // 获取元素内容
  getTreeItem(element) {
    if (typeof element === 'object') {
      return new WordGroup(element);
    } else {
      return new WordItem(element);
    }
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

  get iconPath() {
    return {
      light: path.join(__filename, '..', 'resources', 'light', 'icon.svg'),
      dark: path.join(__filename, '..', 'resources', 'dark', 'icon.svg')
    }
  };

  get contextValue() {
    return 'word';
  }
};

class WordGroup extends vscode.TreeItem {
  constructor(element) {
    super(element.prefix.toUpperCase());
    this.description = `共${element.children.length}个`;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  };
}