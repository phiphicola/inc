
$(function(){
    if(typeof window !== 'undefined'){
		
		fn_setKey();
	}
});

function fn_setKey(){
	//하기 정보들은 로그인 시 session storage에 저장
	if(localStorage.getItem("personalKey") == '' || localStorage.getItem("personalKey") == undefined || localStorage.getItem("personalKey") == null){
		var url = '/realTime/realTime.jsp?cmd=getKeyInfo'
		var data = {};
		$.ajax({
			type : "POST",
			url : url,
			accept : "application/json",
			data : JSON.stringify(data),
			dataType : "json",
			contentType :"application/json;charset=utf-8",
			cache : false,
			success : function(data) {
				var result = data.result;
				localStorage.setItem("appKey", result.appkey);
				localStorage.setItem("appSecret", result.appsecret);
				localStorage.setItem("personalKey", result.personalseckey);
			},
			complete : function() {
				
			},
			error : function(xhr, status, error) {
				alert("에러발생:" + error + "\n" + status + "\n" + xhr);
			}
		});
		
//		localStorage.setItem("appKey", "BSNblyPuRnCg83mHrhbaifwu8joFVnP4nYAn");
//		localStorage.setItem("appSecret", "Dunh9IRbp+rDqU/XFxXZlPFLhfiI3XZZPcLYrcUcMIqxymbT8NKdXGRneG9EqBkdCYowGqkSVgWZ1nw5sCLv21F0rzyeyD2zJCqKi60U7gYMvXB6+mrE2JHcG2McMzUntGf4OuHMojnfPh5eg5ZcC0h2Q3ZxNq28IjXzh9curyuHR8lhcco=");
//		localStorage.setItem("personalKey", "KjgohQkR2ixc7rgTRv4xtX2wXU9dEOXAP/2GsQSwgB2KvZEupmolmuBXg0Aw07du9GO7pPSKpNHsAvjNSZxCZN1mn7j3nd6bSidtvnrVQlpKZnGwM5XQIm02BS8uAzEM9Zb9xHYysunsb8QIIAv1eUZU0p+u9K6VZFes6yrL1TfOZD/fdTA=");
	}
} 

//appkey
function fn_getAppKey(){
	return localStorage.getItem("appKey");
}

function fn_getAppSecret(){
	return localStorage.getItem("appSecret");
}

function fn_getPersonalKey(){
	return localStorage.getItem("personalKey");
}

/*** Start	unicode replace step ********************************************************/	
var escapable = /[\x00-\x1f\ud800-\udfff\u200c\u2028-\u202f\u2060-\u206f\ufff0-\uffff]/g;
function filterUnicode(quoted)	{
	escapable.lastIndex = 0;
	if (!escapable.test(quoted))	return quoted;
	
	return quoted.replace (escapable, function(a){
		return '';
	});
}

var ping=0;
var pingpong=0;	// pingpong count

var w;	
var stockcode="";

var g_app_key = "";
var g_appsecret = "";
var g_personalseckey = "";

var isLocal = false; //개발/로컬 테스트 구분 

function wsConnectC(stockCodeIn, is_H0STASP0, is_H0STCNT0){

	stockcode = stockCodeIn;
	try	{
		if(isLocal){
			url = "ws://localhost:8090" //local test
		}else{
			url = "wss://channel-dev.koreainvestment.com/openapi-realtime/"
		}

		w = new WebSocket(url);
	}	catch (e)	{
		console.log(e);
	}
	
	// websocket standby
	w.onopen = function() {
		console.log("[Connection OK]");	
		console.log("[OPS(WebSocket) Test Ready.]");
		if(is_H0STASP0){
			init_H0STASP0();
		}
		if(is_H0STCNT0){
			init_H0STCNT0();
		}
        
	}
	
	// websocket close
	w.onclose = function(e) {
		console.log("[CONNECTION CLOSED]");
	}
	
	w.onmessage = function(e) {
		// unicode 처리
		var recvdata = filterUnicode(e.data);
		
		// 첫데이터가 0이나 1일경우 수신된 실시간 데이터 이므로 다음 단계를 통해 처리한다.
		if (recvdata[0] == 0|| recvdata[0] == 1){
			var strArray = recvdata.split('|');	// 구분자로 문자열 자르기
			
			var trid = strArray[1];		// Tr ID 
			var bodydata = (strArray[3]);	// 수신받은 데이터 중 실시간데이터 부분
			
			if (strArray[0] == 0)	{	// 암호화 미처리 step
				if (trid == "H0STASP0")	{	// 주식호가
					// 수신 받은 데이터를 사용하기 위해 구분자 값으로 split 처리를 한다.
					var strResult = bodydata.split('^');
					getData_H0STASP0(strResult);
				} else if (trid == "H0STCNT0")	{	//주식체결가 
					// 수신 받은 데이터를 사용하기 위해 구분자 값으로 split 처리를 한다.
					var strResult = bodydata.split('^');
					getData_H0STCNT0(strResult);
				}
			}
		} else	{   
			// 첫데이터가 암호화 구분값이 아닌 데이터는 요청에 대한 응답데이터 이거나 heartbeat 데이터
			console.log("[RECV] < "+"["+recvdata.length+"] "+recvdata);
			const json = e.data;
			
			try	{
				var obj = JSON.parse(json);
				var trid = obj.header.tr_id;
				var encyn = obj.header.encrypt;
			}	catch (e)	{
				console.log(" ERROR : ["+e+"]");
			}
			
			if (trid == "PINGPONG")	{		// pingpong step
				ping+=1;
				//pingpong+=1;
				console.log ("pingpong ["+pingpong+"]");
				/** pingpond 횟수가 5회 넘어가면 화면 reload 및 console clear 처리를 한다 */
				if (pingpong == 5)	{
					//console.clear();
					pingpong = 0;
					//location.reload();
				}
				console.log("[RECV] < "+"["+recvdata.length+"]"+recvdata+"["+ping+"]");

				// 수신받은 pingpong 데이터를 send 하기위해 변수에 저장
				var result = e.data;
				/** pingpong send stop **/
				w.send(result);
				console.log("[SEND_p] > "+"["+result.length+"] "+result);								
				pingpong+=1;
			}	else if (trid == "H0STASP0")	{
				var rt_cd = obj.body.rt_cd;
				if (obj.body.msg1.includes("UNSUBSCRIBE"))
				{
					if (obj.body.msg1.includes("SUCCESS"))
						console.log("[RECV] : 주식호가 등록요청해지 성공하였습니다.");
					else if (rt_cd == '1')
						console.log("[RECV] : 주식호가 등록요청해지 실패하였습니다. ["+obj.body.msg1+"]");
				}	else	if (obj.body.msg1.includes("MAX SUBSCRIBE OVER"))	{
					console.log("[RECV] : 주식호가 등록요청 실패하였습니다. MSG["+obj.body.msg1+"]");
					alert("주식호가 등록초과 입니다.");
				} else	{
					console.log("[RECV] : 주식호가 등록요청 성공하였습니다.");
				}
			}
		}
	//console.log(e.data);
	}
	
	var result = '{"header": {"authoriztion":"","appkey":"'+g_app_key+'","appsecret":"'+g_appsecret+'","personalseckey":"'+g_personalseckey+'","custtype":"P","tr_type":"1","content-type":"utf-8"},"body": {"input": {"tr_id":"H0STASP0","tr_key":"'+stockcode+'"}}}';
	
	console.log("[SEND] > ["+result.length+"] "+result);
	
	try	{
		// 만들어진 json 데이터를 websocket으로 전송한다.
		w.send(result);
	} catch(e) {
		console.log(e);
	}
}

function init_H0STASP0(){
	g_app_key=fn_getAppKey();
	g_appsecret=fn_getAppSecret();
	g_personalseckey=fn_getPersonalKey();

	// 주식호가 등록용 json 데이터를 만드는 부분
	var result = '';
	if(isLocal){
		result = '{setType:"SET",trId:"H0STASP0",code:"' + stockcode + '"}'; //local test
	}else{
		result = '{"header": {"authoriztion":"","appkey":"'+g_app_key+'","appsecret":"'+g_appsecret+'","personalseckey":"'+g_personalseckey+'","custtype":"P","tr_type":"1","content-type":"utf-8"},"body": {"input": {"tr_id":"H0STASP0","tr_key":"'+stockcode+'"}}}';
	}

	// top align 의 info 영역에 처리결과를 출력한다.
	console.log("[SEND] : 주식호가등록요청");
	console.log("[SEND] > ["+result.length+"] "+result);
	try	{
		// 만들어진 json 데이터를 websocket으로 전송한다.
		w.send(result);
	} catch(e) {
		console.log(e);
	}
}

function init_H0STCNT0(){
	g_app_key=fn_getAppKey();
	g_appsecret=fn_getAppSecret();
	g_personalseckey=fn_getPersonalKey();

	// 주식호가 등록용 json 데이터를 만드는 부분
	var result = '';
	if(isLocal){
		result = '{"setType":"SET","trId":"H0STCNT0","code":"' + stockcode + '"}'; //local test
	}else{
		result = '{"header": {"authoriztion":"","appkey":"'+g_app_key+'","appsecret":"'+g_appsecret+'","personalseckey":"'+g_personalseckey+'","custtype":"P","tr_type":"1","content-type":"utf-8"},"body": {"input": {"tr_id":"H0STCNT0","tr_key":"'+stockcode+'"}}}';
	}

	// top align 의 info 영역에 처리결과를 출력한다.
	console.log("[SEND] : 주식체결등록요청");
	console.log("[SEND] > ["+result.length+"] "+result);
	try	{
		// 만들어진 json 데이터를 websocket으로 전송한다.
		w.send(result);
	} catch(e) {
		console.log(e);
	}
}

function close_H0STASP0(){
	g_app_key=fn_getAppKey();
	g_appsecret=fn_getAppSecret();
	g_personalseckey=fn_getPersonalKey();

	// 주식호가 등록용 json 데이터를 만드는 부분
	var result = '';
	if(isLocal){
		result = '{setType:"SET",trId:"H0STASP0",code:"' + stockcode + '"}'; //local test
	}else{
		result = '{"header": {"authoriztion":"","appkey":"'+g_app_key+'","appsecret":"'+g_appsecret+'","personalseckey":"'+g_personalseckey+'","custtype":"P","tr_type":"2","content-type":"utf-8"},"body": {"input": {"tr_id":"H0STASP0","tr_key":"'+stockcode+'"}}}';
	}

	// top align 의 info 영역에 처리결과를 출력한다.
	console.log("[SEND] : 주식호가해제요청");
	console.log("[SEND] > ["+result.length+"] "+result);
	try	{
		// 만들어진 json 데이터를 websocket으로 전송한다.
		w.send(result);
	} catch(e) {
		console.log(e);
	}
}

function close_H0STCNT0(){
	g_app_key=fn_getAppKey();
	g_appsecret=fn_getAppSecret();
	g_personalseckey=fn_getPersonalKey();

	// 주식호가 등록용 json 데이터를 만드는 부분
	var result = '';
	if(isLocal){
		result = '{"setType":"SET","trId":"H0STCNT0","code":"' + stockcode + '"}'; //local test
	}else{
		result = '{"header": {"authoriztion":"","appkey":"'+g_app_key+'","appsecret":"'+g_appsecret+'","personalseckey":"'+g_personalseckey+'","custtype":"P","tr_type":"2","content-type":"utf-8"},"body": {"input": {"tr_id":"H0STCNT0","tr_key":"'+stockcode+'"}}}';
	}

	// top align 의 info 영역에 처리결과를 출력한다.
	console.log("[SEND] : 주식체결해제요청");
	console.log("[SEND] > ["+result.length+"] "+result);
	try	{
		// 만들어진 json 데이터를 websocket으로 전송한다.
		w.send(result);
	} catch(e) {
		console.log(e);
	}
}
