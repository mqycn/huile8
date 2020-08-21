// 获取当前打开页面的单词
const vscode = require('vscode');
const WordProvider = require('./word-provider');
const { hasMastered, addMastered, removeMastered } = require('./storage');
const getWords = require('./parse');

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
    const text = vscode.window.activeTextEditor.document.getText();

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

    // 请求播放
    this.getReadView().postMessage(item);

  }

  // 创建播放窗口
  getReadView() {
    if (!this.$__readPanel) {
      const panel = this.$__readPanel = vscode.window.createWebviewPanel(
        'ReadPanel',
        '会了吧：单词朗读',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      // WebView内容
      panel.webview.html = `
          <h1>朗读页面</h1>
          <script>
          const vscode = acquireVsCodeApi();
          window.addEventListener('message', event => {
            const message = event.data;
            const utterance = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(utterance);
            vscode.postMessage(message);
          });
          </script>
        `;

      // 读完关闭
      panel.webview.onDidReceiveMessage((message) => {
        vscode.window.showInformationMessage(`朗读: ${message}`);
      });

      // 关闭事件
      panel.onDidDispose(() => {
        this.$__readPanel = null;
      });
    }
    return this.$__readPanel.webview;
  }
};

module.exports = {
  WordsApp
};

