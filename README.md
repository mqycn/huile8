# 会了吧

*还在因为 变量中 包含不认识的单词 头大吗？*

*还在因为 看不懂 英文注释/文档 掉头发吗 ？*

*还在因为 各种机器翻译的内容 云里雾里吗 ？*

**您的救星来了！！！用了“会了吧”，轻松“学会啦”**


# 使用流程

安装后，点击源码文件，会自动分析所有包含的单词，不在 **已掌握单词列表** 中的单词会自动添加到 **陌生单词** 列表

![使用教程](https://www.miaoqiyuan.cn/products/vscode-huile8/help/help.gif)

单词后面可以显示 单词解释

鼠标悬停可以显示 音标和解释

点击单词可以朗读本单词

![使用教程](https://www.miaoqiyuan.cn/products/vscode-huile8/help/tips.gif)

# 已掌握单词列表文件

在 **已掌握单词列表文件** 中的单词，不会在 *陌生单词* 列表中显示

## 自动处理

在 **陌生单词** 中的单词，点击 图标 可以 将 单词添加到 **已掌握单词列表文件**

在 **已掌握单词** 中的单词，点击 图标 可以 将 单词 从 **已掌握单词列表文件** 中 删除

![使用教程](https://www.miaoqiyuan.cn/products/vscode-huile8/help/edit.gif)



## 手工设置

也可以手工编辑 **[用户目录]/.vscode/huile8-mastered-list.txt** ，设置已掌握单词：

```text
console
log
hello
world
```

## 第三方词库
- 当前仅支持扇贝单词英语版的生词本

### 使用前提
1. 拥有扇贝单词英语版微信登录账号。

### 在VsCode中使用
1. `ctrl + shfit + p` 输入 登录扇贝英语 回车。
2. 在弹出来的网页中点击微信扫码登录，并使用手机微信扫码登录。
3. 登录成功后，鼠标滑过单词会出现添加到 扇贝英语生词本 点击后即可添加到扇贝英语生词本。



## 离线词库

[skywind3000/ECDICT](https://github.com/skywind3000/ECDICT)

[fxsjy/diaosi](https://github.com/fxsjy/diaosi)



## 功能实现

- [x] 源码单词分析
- [x] 点击播放读音
- [x] 悬停显示单词解释
- [x] 第三方背词软件 （扇贝单词）
- [ ] 禅模式(循环播放陌生单词)
- [ ] 陌生单词列表



## 二次开发

```bash
# 0、安装VS Code开发环境
npm install -g yo generator-code vsce

# 1、代码克隆
git clone https://github.com/mqycn/huile8.git

# 2、更新词库 (从 gitee.com 获取词库)
npm run dict.init
npm run dict.update

# 如果从 github.com 获取词库，请执行
npm run dict.init-github
npm run dict.update

# 3、vscode 调试
# 按 F5 启动调试

# 4、打包
npm run publish
```
