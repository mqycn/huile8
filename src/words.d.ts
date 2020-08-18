// 定义
import { TreeDataProvider, ExtensionContext } from 'vscode';

type TypeNode = {};

class WordsApp {
  constructor(context: ExtensionContext);
  providerWillMastering: TreeDataProvider;
  providerMastered: TreeDataProvider;
  refresh();
  didMastered(item: TypeNode);
  willMastering(item: TypeNode);
  read(item: TypeNode)
};