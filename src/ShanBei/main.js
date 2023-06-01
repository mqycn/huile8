const { FileDB, SBdb } = require("./fileDB")
const { Config } = require("./config")
const { getShanBeiToken } = require("./login-shanbei")
const { ShanBeiService } = require("./shanbei-service")
const { window } = require('vscode');

class ShanBeiMain {
    constructor(context,providerMastered, providerWillMastering) {
        this.context = context
        this.providerMastered = providerMastered
        this.providerWillMastering = providerWillMastering
        this.shanBeiWord = Config.getInstance().shanbeiWord
        this.shanBeiService = new ShanBeiService()
    }

    getShanBeiToken() {
        getShanBeiToken()
    }

    async save(word) {
        try {
            let res = await this.shanBeiService.save([word])
            if(res.msg === '添加成功' && !this.shanBeiWord.hasWord(word)){
                this.shanBeiWord.addWord(word)
                window.showInformationMessage(`添加成功`);
                this.providerMastered.flush()
                this.providerWillMastering.flush()
            }
        } catch {
            console.log("添加失败")
        }
    }
}

module.exports = {
    ShanBeiMain
}