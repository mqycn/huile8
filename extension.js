// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
const { WordsApp } = require('./src/words');
const { CommandDidMastered, CommandRefresh, CommandAnalyse, CommandWillMastering, CommandRead, ShanBeiLogin, ShanBeiSaveWord } = require('./src/const');

/**
 * 激活
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { window, commands } = vscode;
	const { registerTreeDataProvider } = window;
	const { registerCommand } = commands;

	const app = new WordsApp(context);

	registerTreeDataProvider('huile8-will-mastering-main', app.providerWillMastering);
	registerTreeDataProvider('huile8-will-mastering', app.providerWillMastering);
	registerTreeDataProvider('huile8-mastered', app.providerMastered);

	registerCommand(CommandRefresh, () => { app.refresh(); });
	registerCommand(CommandDidMastered, (item) => { app.didMastered(item); });
	registerCommand(CommandWillMastering, (item) => { app.willMastering(item); });
	registerCommand(CommandRead, (item) => { app.read(item); });
	registerCommand(CommandAnalyse, () => { app.selected(); });
	registerCommand(ShanBeiLogin, () => { app.shanBeiMain.getShanBeiToken() });
	registerCommand(ShanBeiSaveWord, (item) => { app.shanBeiMain.save(item)});
};

function deactivate() {
	// 卸载
};

module.exports = {
	activate,
	deactivate
};