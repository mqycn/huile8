const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db.db');

const ecdictDb = {
    open() {
        this.Db = new sqlite3.Database(dbPath);
    },
    close() {
        if (this.Db) {
            this.Db.close();
            this.Db = null;
        }
    },
    query(word, callback) {
        if (!this.Db) {
            this.open();
        }
        const sql = `select * from ecdict where word="${word}"`;
        this.Db.all(sql, (err, rows) => {
            if (err) {
                callback(null);
            } else {
                if (rows.length > 0) {
                    callback(rows[0]);
                } else {
                    callback(null);
                }
            }
        });
    }
};

const ecdictApi = {
    query(word, onFinish) {
        return new Promise((resolve, reject) => {
            ecdictDb.query(word, (res) => {
                onFinish && onFinish();
                if (!res) {
                    resolve({
                        status: false,
                        word,
                        message: '单词未收录'
                    })
                } else {
                    resolve({
                        status: true,
                        word,
                        phonetic: res.phonetic,
                        translation: res.translation
                    })
                }
            });
        });
    },
    end() {
        ecdictDb.close();
    },
    one(word) {
        return this.query(word, this.end);
    },
    all(words) {
        return new Promise((resolve, reject) => {
            Promise.all(words.map(word => this.query(word))).then((values) => {
                this.end();
                resolve(values);
            });
        });
    }
}

module.exports = ecdictApi;