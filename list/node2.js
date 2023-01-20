const assert = require('assert');
const cheerio = require('cheerio');
//const CryptoJS =require('crypto-js');
const crypto = require('crypto');
const promisify = require('util').promisify  //引入promisify函数，简化promise代码
const fs = require('fs')
const request = require('request');

const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)


async function getip() {
	var options = {
		'method': 'GET',
		'url': 'http://192.168.4.145:9000/registerData/registerData.ac?opt=100&data=001000000000000000000000000|10.78.197.58|100|86567a02-0000-0000-0000-1e9656874654||50:01:6B:00:00:00|Hi3798MV100|V100R005C10LHED02B012|EC6108V9U_pub_hbjdx|4.4.2|0|Huawei|Hi3798M|RTKFHDHDR|RTK|640x480|0|QM|3.1.1.05',
		'headers': {}
	}
	request(options, function(error, response) {
		if (error) throw new Error(error);
		//console.log(response.body);
		json = JSON.parse(response.body);
		ip = json.networkip;
		write('./ip.json', ip)
		var NowTime2 = new Date();
		console.log(NowTime2 + "----已得到ip,ip为：" + ip);
	});
}

//00000000000000000
/*
getip(options,function(ip) {
	console.log(ip)
})
*/
//0000000000000000000000000000000000000000000000000000
async function gettoken1() {
	var options = {
		'method': 'GET',
		'url': 'http://192.168.49.11:33200/EPG/jsp/authLoginHWCTC.jsp?UserID=ip15621640000@itv&VIP',
		'headers': {
			'Referer': 'http://192.168.49.11:33200/EPG/jsp/AuthenticationURL?UserID=ip15621640000@itv&Action=Login'
		}
	}
	request(options, function(error, response) {
		if (error) throw new Error(error);
		//console.log(response.body);
		const $ = cheerio.load(response.body);
		var str1 = $.html('script');
		token1 = str1.match(new RegExp(/authform\.userToken\.value\s\=\s"(.*?)";/))[1];
		write('./token1.json', token1)
		var NowTime2 = new Date();
		console.log(NowTime2 + "----已得到token1,token1为：" + token1);

	})

}
//000000000000000000000

//00000000000000000000000000000000000000000000000000
async function ency(param) {
	try {
		var key = new Buffer.from(param.key);
		var iv = null
		var plaintext = param.plaintext
		var alg = param.alg
		var autoPad = param.autoPad
		//encrypt  
		var cipher = crypto.createCipheriv(alg, key, iv);
		cipher.setAutoPadding(autoPad) //default true
		var ciph = cipher.update(plaintext, 'utf8', 'hex');
		ciph += cipher.final('hex');
		encryptData = ciph.toString().toUpperCase();
		write('./ency.json', encryptData);
		var NowTime2 = new Date();
		console.log(NowTime2 + "----已得到验证码,验证码为：" + encryptData);
		let token1 = await read('./token1.json');
		//000000000
		var options = {
			'method': 'GET',
			'url': 'http://192.168.49.11:33200/EPG/jsp/ValidAuthenticationHWCTC.jsp?UserID=ip15621640000@itv&Lang=1&SupportHD=1&NetUserID&Authenticator=' + encryptData + '&STBType=EC6108V9U_pub_hbjdx&STBVersion=V100R005C10LHED02B012&conntype=4&STBID=0010000000000000000000000000000&templateName=hbdxggpt&areaId=81300000&userToken=' + token1 + '&userGroupId=1&productPackageId=-1&mac=50:01:6B:00:00:00&UserField=2&SoftwareVersion=V100R005C10LHED02B012&IsSmartStb=0&desktopId&stbmaker&VIP',
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
			console.log(NowTime2 + "----已获取token2,token2为：" + token2);
			write('./token2.json', token2);
			var coo = response.headers['set-cookie'].toString();
			var jsesid = coo.match(new RegExp(/JSESSIONID\=(.*?);\sDomain/))[1];
			console.log(NowTime2 + "----已获取cookies,cookies为：" + jsesid);
			write('./cookies.json', jsesid);
		});

		//000000000




	} catch (err) {
		console.log(err);
		write('./encyerr.json', err)
	}

}
//00000000000000000000000000000000000000000000000000000
async function getlist(second) {
	let token2 = await read('./token2.json');
	let cookie = await read('./cookies.json');
	console.log(token2.toString());
	console.log(cookie.toString());
    setTimeout(() => {
			var options = {
					'method': 'POST',
					'url': 'http://192.168.49.11:33200/EPG/jsp/getchannellistHWCTC.jsp?conntype=4&UserToken=' + token2 + '&tempKey=768B0000000000000000000&stbid=990060&SupportHD=1&UserID=ip15600000000@itv&Lang=1',
					'headers': {
						'Cookie': 'JSESSIONID=' + cookie
					}
				};
				request(options, function(error, response) {
					if (error) throw new Error(error);
					//console.log(response.body);


					const $ = cheerio.load(response.body);
					var str1 = $.html('script');
					//console.log(str1);
					var count = str1.match(new RegExp(/ChannelCount','(.*?)'\)/))[1];
					//console.log(count);
					for (i = 1; i - 1 < 1; i++) {
						var tv = str1.match(new RegExp(/CTCSetConfig\('Channel','(.*?),TimeShift\=/))[1];
						var name = str1.match(new RegExp(/ChannelName\="(.*?)",UserChannelID/))[1];
						var url = tv.match(new RegExp(/\|(.*?)"/))[1];
						//console.log(i);
						//console.log(name);
						//console.log(url);

						//定义对象
						var finalInfo = new Object();
						//为对象赋值
						finalInfo.name = name;
						finalInfo.url = url;
						//将对象转换为json格式
						var finalInfoStr = JSON.stringify(finalInfo);
						console.log(finalInfoStr);
						//next
						str1 = str1.replace(/Authentication\.CTCSetConfig\('Channel'(.*?)\);/i, '/');

					}
					write('./list.m3u', finalInfoStr);
				});



			}, second);








}
//00000000000000000000000000000000000000000000000000000
async function doit() {
	await getip()
	await gettoken1()
	let ip = await read('./ip.json')
	let token1 = await read('./token1.json')
	var text = "999999" + "$" + token1 + "$ip15600000000@itv$0010000000000000000000000$" + ip + "$50:01:6b:00:00:00$$CTC";
	var NowTime2 = new Date();
	console.log(NowTime2 + "----已得到前置码,前置码为：" + text);
	let encryptData = await ency({
		alg: 'des-ede3',
		//3des-ecb  
		autoPad: true,
		key: '119115110000000000000000',
		plaintext: text,
	})
	//await getlist(2000)
}

doit()
