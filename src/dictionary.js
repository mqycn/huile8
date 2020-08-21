// 翻译

const { match } = require("assert");

// 词典缓存
const localDictionary = {};

// 添加翻译任务
const addWordTask = (list, callback) => {
    const undefinedWords = list.filter(item => !localDictionary[item]);
    //存在 没有翻译结果的单词
    if (undefinedWords.length > 0) {

        // TODO 获取单词解释
        setTimeout(() => {
            undefinedWords.forEach(word => {
                localDictionary[word] = Math.random() > 0.5 ? 'TODO: 来自百度API' : 'TODO: 来自有道';
            });
            callback();
        }, 1000);
    }
};

module.exports = {
    localDictionary,
    addWordTask
};