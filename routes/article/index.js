var express = require('express');
var router = express.Router();
var dbData = require('./article');
var URL = require('url');

function sendData(err, result){
    let sendData = {
        code: 0,
        msg: '',
        data: '',
        success: false,
    };
    if(err){
        sendData.code = 0;
        sendData.data = err;
        sendData.msg = "查询失败";
        sendData.success = false;
    }else {
        sendData.code = 1;
        sendData.data = result;
        sendData.msg = "查询成功";
        sendData.success = true;
    }
    return JSON.stringify(sendData);
}

router.get('/getArticle', function(req, res, next) {
    console.log("\n_____________________");
    var params = URL.parse(req.url, true).query;
    if( params.articleId ){
        params.articleId = Number(params.articleId)
    }
    dbData.select('articles', params, (err, result) => {
        res.send(sendData(err,result[0]));
    })
});
router.post('/editArticle', function(req, res, next) {
    console.log("\n_____________________");
    let articleId = Number(req.body.articleId);
    req.body.time = new Date().getTime();
    if(articleId){
        dbData.update("articles", {articleId: articleId}, req.body, (err, result) => {
            if(err) {
                res.send(sendData(err, result));
                return;
            }
            dbData.select("articles", {articleId: articleId}, (err, result) => {
                res.send(sendData(err, result[0]))
            })
        });
    }else {
        dbData.select('articles', {}, (err, result) => {
            req.body.articleId = +(result[result.length - 1].articleId + 1);
            dbData.add('articles', req.body, (err, result) => {
                res.send(sendData(err, result));
            })
        })
    }
});

module.exports = router;
