const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
// const co = require('co');
// connection URL
const mongoUrl = "mongodb://127.0.0.1:27017/evidence-manager";

DBClient = {};
DBClient.dbObject = null;

/**
 * 接続用。mongoUrlは固定とする
 */
DBClient.connect = function(callback) {
    MongoClient.connect(mongoUrl, function(err, db) {
        DBClient.dbObject = db;
        assert.equal(null, err);
        console.log("Connected successfully to server");
        callback();
    });
}

/**
 * 指定したデータを取得する
 * @return promise
 */
DBClient.get = function(collectionName, opt_where, opt_limit) {
    assert.notEqual(DBClient.dbObject, null);

    var collection = DBClient.dbObject.collection(collectionName);
    var result;
    if (opt_where) {
        result = collection.find(opt_where);
    } else {
        result = collection.find();
    }
    if (opt_limit !== undefined && opt_limit !== null) {
        result = result.limit(opt_limit);
    }
    return result.toArray();
}

/**
 * aggregateを使用してデータを取得する
 * @return promise
 */
DBClient.aggregate = function(collectionName, pipeline) {
    assert.notEqual(DBClient.dbObject, null);

    var collection = DBClient.dbObject.collection(collectionName);
    return new Promise(function(resolve, reject){
        collection.aggregate(pipeline, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

/**
 * distinctで取得する
 * @return promise
 */
DBClient.distinct = function(collectionName, key) {
    assert.notEqual(DBClient.dbObject, null);
    var collection = DBClient.dbObject.collection(collectionName);
    return collection.distinct(key);
};

/**
 * 指定したCollectionに値をinsertする
 * データがない場合は処理しない
 */
DBClient.insert = function (collectionName, data, callback) {
    assert.notEqual(DBClient.dbObject, null);

    // dataがない場合は抜ける
    if (!data) {
        console.log("no Data");
        callback();
        return;
    }

    var collection = DBClient.dbObject.collection(collectionName);

    // var iid = data.iid;
    collection.insertOne(data, function(err, result) {
        assert.equal(err, null);
        console.log("Insert OK!");
        if (callback) {
            callback();
        }
    });
}

/**
 * 接続をcloseする
 */
DBClient.close = function () {
        console.log("close");
        DBClient.dbObject.close();
}
