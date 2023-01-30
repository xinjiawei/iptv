const assert = require('assert');
const cheerio = require('cheerio');
//const CryptoJS =require('crypto-js');
const crypto = require('crypto');
const promisify = require('util').promisify; //引入promisify函数，简化promise代码
const fs = require('fs');
const request = require('request');
var axios = require('axios');
var FormData = require('form-data'); //
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

var mac = "50:01:00:00:00:00";
var iptv_account = "ip15600000000@itv";
var iptv_passwd = "";
var stbid = "00100399000000000000000000000000";
//var uuid = "86567a02-1677-40ef-9ccd-1e9656874654"; //经过验证，uuid随机生成即可
var tempkey = "768B4A3E000000000000000000000000";

/*
其他参数请根据自己所在地区进行更改
STBVersion
STBType
areaId
templateName
*/



function getip(resolve, reject) {
    const uuid = crypto.randomUUID();
	var options = {
		'method': 'GET',
		'url': 'http://192.168.4.145:9000/registerData/registerData.ac?opt=100&data=' + stbid + '|10.78.197.58|100|'+ uuid +'||' + mac + '|Hi3798MV100|V100R005C10LHED02B012|EC6108V9U_pub_hbjdx|4.4.2|0|Huawei|Hi3798M|RTKFHDHDR|RTK|640x480|0|QM|3.1.1.05',
		'headers': {}
	};
	
	request(options, function(error, response) {
		if (error) throw new Error(error);
		//console.log(response.body);
		json = JSON.parse(response.body);
		ip = json.networkip;
		console.log(Date() + "--getip--ip:" + ip + "---- uuid:" + uuid);
		resolve(ip);
	});
}


//0000000000000000000000000000000000000000000000000000
function gettoken1(resolve, reject) {
	var options = {
		'method': 'GET',
		'url': 'http://192.168.49.11:33200/EPG/jsp/authLoginHWCTC.jsp?UserID=' + iptv_account + '&VIP',
		'headers': {
			'Referer': 'http://192.168.49.11:33200/EPG/jsp/AuthenticationURL?UserID=' + iptv_account + '&Action=Login'
		}
	};
	request(options, function(error, response) {
		if (error) throw new Error(error);
		//console.log(response.body);
		const $ = cheerio.load(response.body);
		var str1 = $.html('script');
		token1 = str1.match(new RegExp(/authform\.userToken\.value\s\=\s"(.*?)";/))[1];
		
		console.log(Date() + "--gettoken1--已得到token1,token1为：" + token1);
		resolve(token1);

	});

}
//000000000000000000000

//00000000000000000000000000000000000000000000000000
function encry(param,resolve,reject) {
	var key = new Buffer.from(param.key);
	var iv = null;
	var plaintext = param.plaintext;
	var alg = param.alg;
	var autoPad = param.autoPad;
	var token1 = param.token1;
	var ip = param.ip;
	try {
		//encrypt  
		var cipher = crypto.createCipheriv(alg, key, iv);
		cipher.setAutoPadding(autoPad); //default true
		var ciph = cipher.update(plaintext, 'utf8', 'hex');
		ciph += cipher.final('hex');
		encryptData = ciph.toString().toUpperCase();
		var NowTime2 = new Date();
		console.log(NowTime2 + "--ency--已得到加密验证码,加密验证码为：" + encryptData);
		return encryptData;
	} catch(err){
	    console.log(err);
	}
}
function gettoken2(param,resolve,reject){
    var encryptData = param.encryptData;
	var token1 = param.token1;
	new Promise((resolve, reject) => {
        try{
    
    	    var options = {
    			'method': 'GET',
    			'url': 'http://192.168.49.11:33200/EPG/jsp/ValidAuthenticationHWCTC.jsp?UserID=' + iptv_account + '&Lang=1&SupportHD=1&NetUserID&Authenticator=' + encryptData + '&STBType=EC6108V9U_pub_hbjdx&STBVersion=V100R005C10LHED02B012&conntype=4&STBID=' + stbid + '&templateName=hbdxggpt&areaId=8130728&userToken=' + token1 + '&userGroupId=1&productPackageId=-1&mac=' + mac + '&UserField=2&SoftwareVersion=V100R005C10LHED02B012&IsSmartStb=0&desktopId&stbmaker&VIP',
    			'headers': {}
    		};
    		request(options, function(error, response) {
    			if (error) throw new Error(error);
    			//console.log(response.body);
    			const $ = cheerio.load(response.body);
    			var str1 = $.html('script');
    			//console.log(str1);
    			var token2 = str1.match(new RegExp(/Authentication\.CTCSetConfig\('UserToken','(.*?)'\)/))[1];
    			//console.log(str2);
    			var NowTime2 = new Date();
    			console.log(NowTime2 + "--ency--已获取token2,token2为：" + token2);
    			var coo = response.headers['set-cookie'].toString();
    			var jsesid = coo.match(new RegExp(/JSESSIONID\=(.*?);\sDomain/))[1];
    			console.log(NowTime2 + "--ency--已获取cookies,cookies为：" + jsesid);
    			//resolve();
    			resolve([token2,jsesid]);
    		});
    	} catch (err) {
    		console.log(err);
    		write('/app/log/encyerr.log', err);
    	}
	}).then(function(result){
	    getChannelList(result[0],result[1]);
	})
}

//00000000000000000000000000000000000000000000000000000


async function getChannelList(token2,cookie) {
    console.log(Date() + "----开始获取channelList----");
	console.log(Date() + "------channelList已得到token2,token2为：" + token2.toString());
	console.log(Date() + "------channelList已得到cookie,cookie为：" + cookie.toString());
  let promise = new Promise((resolve, reject) => {
		var config = {
		  method: 'post',
		  url: 'http://192.168.49.11:33200/EPG/jsp/getchannellistHWCTC.jsp?conntype=4&UserToken=' + token2 + '&tempKey=' + tempkey + '&stbid=990060&SupportHD=1&UserID=' + iptv_account + '&Lang=1',
		  headers: { 
		  'Cookie' : 'JSESSIONID=' + cookie }
		};

		axios(config)
		.then(function (response) {
		  const $ = cheerio.load(response.data);
					var str1 = $.html('script');
					//console.log(str1);
					var channelcount = str1.match(new RegExp(/ChannelCount','(.*?)'\)/))[1];
					write('/app/list/list.m3u', "#EXTM3U" + '\n');
					//console.log(count);
					for (i = 0; i  < channelcount; ++i) {
						var tv = str1.match(new RegExp(/CTCSetConfig\('Channel','(.*?),TimeShift\=/))[1];
						var name = str1.match(new RegExp(/ChannelName\="(.*?)",UserChannelID/))[1];
						var url = tv.match(new RegExp(/\|(.*?)"/))[1];
						var buffname = Buffer.from(name);
						var buffurl = Buffer.from(url);						
						//console.log(buffinfo.toString());
						let ws = fs.createWriteStream('/app/list/list.m3u', {autoClose:false,flags:'a'});
						let flag1 = ws.write("#" + "EXTINF:"  + "-1" + " ," + buffname + '\n' + buffurl + '\n');
						//next
						str1 = str1.replace(/Authentication\.CTCSetConfig\('Channel'(.*?)\);/i, '/');
						//console.log("for: " + i);
					}
					console.log("getlist1 finish");
					resolve(1);
		})
		.catch(function (error) {
		  console.log(error);
		  reject(error);
		});
  });

	let result = await promise;
	console.log("getepg start");
	getepg();
}

//00000000000000000000000000000000000000000000000000000


async function getepg() {
	var data = new FormData();
	await data.append('myfile', fs.createReadStream('/app/list/list.m3u'));
		var config = {
		  method: 'post',
		  url: 'http://epg.51zmt.top:8000/api/upload/',
		  headers: { 
		    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', 
		    'Accept-Encoding': 'gzip, deflate', 
		    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7', 
		    'Cache-Control': 'no-cache', 
		    ...data.getHeaders()
		},
		data : data
		};
	
		axios(config)
		.then(function (response) {
			var info = response.data.match(new RegExp(/<p>(.*?)<a/))[1];
		  console.log("info:" + info);
		  var url1 = response.data.match(new RegExp(/href\="(.*?)">/))[1];
		  console.log("url: " + url1);
		  var config2 = {
			  method: 'get',
			  url: url1,
			  headers: {
			    'Accept-Language': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
			  }
			};
			
			axios(config2)
			.then(function (response) {
			  console.log("code: " + JSON.stringify(response.status));
			  write('/app/list/epglist.m3u', response.data);
			})
			.catch(function (error) {
			  console.log(error);
			});

		})
		.catch(function (error) {
		  console.log(error);
		});

}

function catcherr(error){
    console.log(Date() + "--catcherr--：" + error);
}
//00000000000000000000000000000000000000000000000000000


function doit() {
    
    try {
        var p1 = new Promise(getip).then(function (result) {
            // promise resolve的值组在多个then可以传递
            //var ip = result;
            console.log('------------p1：' + result);
            var p3 = new Promise(gettoken1).then(function(result) {
                console.log('------------p3：' + result);
                var text = "999999" + "$" + token1 + "$" + iptv_account + "$" + stbid + "$" + ip + "$" + mac + "$$CTC";
                console.log(Date() + "--3desEncryption--已得到前置码,前置码为：" + text);
                    new Promise(function (resolve, reject) {
                        resolve(encry({alg: 'des-ede3',autoPad: true,key: '119115110000000000000000',plaintext: text,token1: token1,ip: ip}));
                    }).then(function (result) {
                        console.log('------------p5：' + result);
                        return new Promise(function (resolve, reject) {
                            console.log("------------gettoken2----：" + token1 + "----" + encryptData);
                            gettoken2({token1: token1,encryptData: encryptData});
                        })
                    })
                
            })
        });

    } catch(error) {
        catcherr(error);
    }
}


doit();