var express = require('express');
var router = express.Router();
var dbData = require('./article');
var URL = require('url');

let sendData = {
    code: 0,
    msg: '',
    data: '',
    success: false,
};

router.get('/getArticle', function(req, res, next) {
    console.log("\n_____________________");
    var params = URL.parse(req.url, true).query;
    console.log(params);
    dbData.select('articles', params, (err, result) => {
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
        console.log(result);
        res.send(JSON.stringify(sendData));
    })
});
router.post('/editArticle', function(req, res, next) {
    console.log("\n_____________________");
    var data = '';
    if(req.method !== 'POST') {
        sendData.code = 0;
        sendData.msg = "方法不被允许";
        sendData.success = false;
        sendData.data = "";
        res.send(JSON.stringify(sendData));
    }
    //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
    req.on('data', function (chunk) {
        // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
        data += chunk;
    });

    // 3.当接收表单提交的数据完毕之后，就可以进一步处理了
    //注册end事件，所有数据接收完成会执行一次该方法
    req.on('end', function () {

        //（1）.对url进行解码（url会对中文进行编码）
        data = decodeURI(data);
        console.log(data);

        /**post请求参数不能使用url模块解析，因为他不是一个url，而是一个请求体对象 */

            //（2）.使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
            //querystring是nodejs内置的一个专用于处理url的模块，API只有四个，详情见nodejs官方文档
        var dataObject = querystring.parse(data);
        console.log(dataObject);
    });
    dbData.add('articles', params, (result) => {
        console.log("result: " + result);
        res.send(JSON.stringify(result));
    })

});

// router.use('',deleteRoute);
module.exports = router;
