const fs = require('fs');
const path = require('path');
const { window } = require('vscode');


class FileDB{
    constructor(fileName){
        this.dbFile = path.join(__dirname, '..', '..', '..', `${fileName}.txt`);
        this.content = ''
        this.getToFile()
    }

    // 读取记录
    getToFile(){
        try {
            if (fs.existsSync(this.dbFile)) {
                this.content = fs.readFileSync(this.dbFile).toString();
            }
        } catch (error) {
            window.showInformationMessage('读取本地文件失败！');
        }
    }

    // 保存到硬盘
    saveToFile(content) {
        fs.writeFileSync(this.dbFile, content);
    }
}


class SBdb extends FileDB{
    constructor(fileName){
        super(fileName)
        this.wordSet = new Set()
        this.getWordList()
    }

    getWordList(){
        if (fs.existsSync(this.dbFile)) {
            let fileContent = fs.readFileSync(this.dbFile).toString();
            fileContent.split('\n').forEach(word => {
                this.wordSet.add(word.trim());
            });
        }
        
    }

    // 是否包含单词
    hasWord(word) {
        return this.wordSet.has(word);
    }

    // 添加单词记录
    addWord(word) {
        this.wordSet.add(word.trim());
        const list = Array.from(this.wordSet).map(word => {
            return word.trim();
        });
        this.saveToFile(list.join('\n'));
    }
}




module.exports = {
    FileDB,
    SBdb
};