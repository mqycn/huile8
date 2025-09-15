// 单词列表
const vscode = require('vscode');
const { CommandRead } = require('./const');
const path = require('path');
const { localDictionary, addWordTask } = require('./dictionary');
const statusBar = require('./status-bar');

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

    // 更新列表
    this.changeTreeDataEmitter.fire(undefined);
    statusBar.update('单词分析完毕！');

    // 创建翻译任务
    addWordTask(this.list, () => {
      this.flush();
    });

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
    this.data = localDictionary[word];
  };

  get command() {
    return {
      command: CommandRead,
      title: `播放 ${this.word}`,
      arguments: [this]
    };
  }

  get tooltip() {
    if (!this.data) {
      return 'loading...';
    }
    
    if (this.data.phonetic) {
      return [
        `音标：[${this.data.phonetic}]`,
        `解释：${this.data.translation ? this.data.translation.replace(/\n/g, '\n　　　') : ''}`
      ].join('\n');
    } else {
      return this.data.translation ? this.data.translation.replace(/\n/g, '\n　　　') : '';
    }
  }

  get iconPath() {
		return {
			light: path.join(__filename, '..', 'resources', 'light', 'icon.svg'),
			dark: path.join(__filename, '..', 'resources', 'dark', 'icon.svg')
		};
	}

  get description() {
    return this.data && this.data.translation ?
      this.data.translation.replace(/\n/g, '、')
      : '未收录';
  };

  get contextValue() {
    return 'word';
  };
};

class WordGroup extends vscode.TreeItem {
  constructor(element) {
    super(element.prefix.toUpperCase());
    this.description = `共${element.children.length}个`;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.tooltip = `${element.prefix.toUpperCase()}开头的单词${this.description}`;
  };
}