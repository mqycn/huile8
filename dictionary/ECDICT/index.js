const path = require('path');
const fs = require('fs');

const getWordsInfo = (prefix, words) => {
    const db = path.join(__dirname, `${prefix}.json`);
    const datas = JSON.parse(fs.readFileSync(db, 'utf-8'));
    return words.map(word => {
        if (word in datas) {
            let raw = word;
            let phonetic = null;
            let translation = datas[word];
            if (typeof translation == 'object') {
                raw = translation.w || word;
                phonetic = translation.p;
                translation = translation.t;
            }
            return {
                status: true,
                word,
                raw,
                phonetic,
                translation
            };
        } else {
            return {
                status: false,
                word,
                message: '单词未收录'
            };
        }
    });
};

const ecdictApi = {
    prefix(word) {
        return word.substr(0, 2);
    },
    one(word) {
        return new Promise((resolve, reject) => {
            resolve(getWordsInfo(this.prefix(word), [word])[0]);
        });
    },
    all(words) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { //防止阻塞其他任务
                const results = [];
                const caches = {};
                words.forEach(word => {
                    const prefix = this.prefix(word);
                    const node = caches[prefix] = caches[prefix] || [];
                    node.push(word);
                });
                Object.keys(caches).forEach(prefix => {
                    getWordsInfo(prefix, caches[prefix]).forEach(item => {
                        results.push(item);
                    });
                });
                resolve(results);
            }, 100);
        });
    }
}

module.exports = ecdictApi;