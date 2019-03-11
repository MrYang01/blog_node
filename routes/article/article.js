var mongoose = require("mongoose");
var database_name = "mongodb://localhost:27017/yzh_blog";

// var db = mongoose.connect(database_name);
var articleSchema = new mongoose.Schema({
    articleId: {type: Number},
    label: {type: Number},
    authorId: {type: Number, default: 1},
    status: {type: Number},
    title: {type: String},
    content: {type: String},
    time: {},
});
// var articleModel = db.model("article", articleSchema);

let dbData = {
    select(collectionName, params, callback){
        mongoose.connect(database_name, (err,db) => {
            var collectionModel = db.model(collectionName, articleSchema);
            collectionModel.find(params,(err, result) => {
                callback(err, result);
            })
        })
    },
    update(collectionName, params, data, callback){
        mongoose.connect(database_name, (err, db) => {
            var collectionModel = db.model(collectionName, articleSchema);
            collectionModel.update(params, data, (err, result) => {
                callback(err, result);
            })
        })
    },
    add(collectionName, data, callback){
        mongoose.connect(database_name, (err, db) => {
            var collectionModel = db.model(collectionName, articleSchema);
            var articleEntity = new collectionModel(data);
            articleEntity.save((err, result) => {
                callback(err, result);
            })
        })
    },
    remove(collectionName, params, callback){
        mongoose.connect(database_name, (err, db) => {
            var collectionModel = db.model(collectionName, articleSchema);
            collectionModel.remove(params.articleId, (err, result) => {
                callback(err, result);
            })
        })
    }
}

module.exports = dbData;
