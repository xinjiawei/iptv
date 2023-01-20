const assert = require('assert');
const cheerio = require('cheerio');
const promisify = require('util').promisify;
const fs = require('fs')
var axios = require('axios');

const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)


async function getlist(second) {
	let token2 = await read('./token2.json');
	let cookie = await read('./cookies.json');
	console.log(token2.toString());
	console.log(cookie.toString());
    setTimeout(() => {
		var config = {
		  method: 'post',
		  url: 'http://192.168.49.11:33200/EPG/jsp/getchannellistHWCTC.jsp?conntype=4&UserToken=' + token2 + '&tempKey=760000000000000000000000000000&stbid=990060&SupportHD=1&UserID=ip15600000000@itv&Lang=1',
		  headers: { 
		  'Cookie' : 'JSESSIONID=' + cookie }
		};

		axios(config)
		.then(function (response) {
		  const $ = cheerio.load(response.data);
					var str1 = $.html('script');
					//console.log(str1);
					var count = str1.match(new RegExp(/ChannelCount','(.*?)'\)/))[1];
					write('./list.m3u', "#EXTM3U" + '\n')
					//console.log(count);
					for (i = 1; i - 1 < 300; i++) {
						var tv = str1.match(new RegExp(/CTCSetConfig\('Channel','(.*?),TimeShift\=/))[1];
						var name = str1.match(new RegExp(/ChannelName\="(.*?)",UserChannelID/))[1];
						var url = tv.match(new RegExp(/\|(.*?)"/))[1];
						//console.log(i);
						//console.log(name);
						//console.log(url);

						/*
						var finalInfo = new Object();
						finalInfo.name = name;
						finalInfo.url = url;
						var finalInfoStr = JSON.stringify(finalInfo);
						console.log(finalInfoStr);
						*/


						var buffname = Buffer.from(name);
						var buffurl = Buffer.from(url);						
						//console.log(buffinfo.toString());
						let ws = fs.createWriteStream('./list.m3u', {autoClose:false,flags:'a'});
						let flag1 = ws.write("#" + "EXTINF:"  + "-1" + " ," + buffname + '\n' + buffurl + '\n');
						//next
						str1 = str1.replace(/Authentication\.CTCSetConfig\('Channel'(.*?)\);/i, '/');

					}
		})
		.catch(function (error) {
		  console.log(error);
		});

			}, second);

}

//00000000000000000000000000000000000000000000000000000
async function doit() {

	await getlist(2000)
}

doit()
