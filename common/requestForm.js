// http 请求
var http = require("http");
var config = require("../config");
var querystring = require("querystring")

function request(type, path, param, callback, errback) {
    var postData = querystring.stringify(param);
    var postDataLength = postData.length
    var options = {
        encoding: null,
        hostname: "kzgm.bbshjz.cn",
        // 端口号 https默认端口 443， http默认的端口号是80
        port: 8000,
        path: path,
        method: type,
        // 伪造请求头
        headers: {
            Cookie: config.cookie,
            Accept: "application/json, text/javascript, */*; q=0.01",
            // 去除gzip 不然请求回来的是乱码
            // "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            Connection: "keep-alive",
            Host: "kzgm.bbshjz.cn:8000",
            'Content-length': postDataLength,
            "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255",
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    var req = http.request(options, function (res) {
        // 定义json变量来接收服务器传来的数据
        var json = "";
        // res.on方法监听数据返回这一过程，"data"参数表示数数据接收的过程中，数据是一点点返回回来的，这里的chunk代表着一条条数据
        res.on("data", function (chunk) {
            json += chunk; //json由一条条数据拼接而成
        });
        // "end"是监听数据返回结束，callback（json）利用回调传参的方式传给后台结果再返回给前台
        res.on("end", function () {
            callback(json);
        });
    });

    req.on("error", function (error) {
        console.log("error", error);
        typeof errback === "function" && errback(error);
    });
    // post 请求传参
    req.write(postData);
    // 终止请求
    req.end();
}
module.exports = request;