const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', '..', '..', 'huile8-mastered-list.txt');

const masteredList = new Set();

// 读取记录
if (fs.existsSync(dbFile)) {
    const json = fs.readFileSync(dbFile).toString();
    json.split('\n').forEach(word => {
        masteredList.add(word.trim());
    });
}

// 保存到硬盘
function saveToFile() {
    const list = Array.from(masteredList).map(word => {
        return word;
    });
    fs.writeFileSync(dbFile, list.join('\n'));
}

// 是否包含单词
function hasMastered(item) {
    return masteredList.has(item);
}

// 添加单词记录
function addMastered(item) {
    masteredList.add(item);
    saveToFile();
}

// 删除单词记录
function removeMastered(item) {
    masteredList.delete(item);
    saveToFile();
}

module.exports = {
    hasMastered,
    addMastered,
    removeMastered
};