const { getService } = require("./http")
const { window } = require('vscode');

class ShanBeiService{
    constructor(){
        this.service = getService()
    }

    save(data){
        let json ={
            "business_id": 6,
            "words": data
        }
        return new Promise((resolve, reject)=>{
            this.service.post('/wordscollection/words_bulk_upload', json).then((res)=>{
                if('task_id' in res){
                    let query = `business_id=6&task_id=${res.task_id}`
                    return this.service.get(`/wordscollection/words_bulk_upload?${query}`)
                }
                reject({ msg:"添加失败" })
            }).then((res)=>{
                if(data.length = res.total_count){
                    window.showInformationMessage(`添加成功`);
                    resolve({ msg:"添加成功" })
                }else{
                    window.showInformationMessage(`添加失败，失败的单词为${res.failed_words}`);
                    reject({ msg:"添加失败" })
                }
            }).catch((err)=>{
                console.log(err)
                reject({ msg:"添加失败" })
            })
        })
    }
}


module.exports = {
    ShanBeiService
}


