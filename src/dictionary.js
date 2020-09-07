// 翻译
const statusBar = require('./status-bar');
const wordApi = require('../dictionary/ECDICT');

// 词典缓存
const localDictionary = {};

// 添加翻译任务
const addWordTask = (list, callback) => {
    const undefinedWords = list.filter(item => !localDictionary[item]);
    //存在 没有翻译结果的单词
    if (undefinedWords.length > 0) {
        statusBar.update('正在翻译中...');
        wordApi.all(undefinedWords).then(datas => {
            datas.forEach(data => {
                if (data.status) {
                    localDictionary[data.word] = {
                        phonetic: data.phonetic,
                        translation: data.translation.replace(/\\n/g, '\n')
                    };
                } else {
                    localDictionary[data.word] = {
                        error: data.message
                    };
                }
            });
            callback();
            statusBar.update('单词分析完毕！');
        });
    }
};

module.exports = {
    localDictionary,
    addWordTask
};