// 定义
import { TreeDataProvider, ExtensionContext } from 'vscode';
import { ShanBeiMain } from './ShanBei/main';

type TypeNode = {};

class WordsApp {
  constructor(context: ExtensionContext);
  shanBeiMain:ShanBeiMain
  providerWillMastering: TreeDataProvider;
  providerMastered: TreeDataProvider;
  refresh();
  selected(String: text);
  didMastered(item: TypeNode);
  willMastering(item: TypeNode);
  read(item: TypeNode)
};