/**공동인증
 * 파일 이름 : kakao-interface.js
 *
 * 파일 설명 :카카오뱅크 연계 서비스에 대한 정의
 *
 * 작성자 정보 : 임병범
 *
 * 버전 정보 : 1.0
 *
 * 수정 이력 : - 신규개발
 *
 */

var isIOS = commonUtil.isIOS();
var isAndroid = commonUtil.isAndroid();


$(function() {
	var KabangB2bJavascriptInterface = function() {
		return this;
	};
	
	if (isIOS) {
		// 한투 앱으로 이동
		KabangB2bJavascriptInterface.prototype.openApp = function(url){
			var sendData = JSON.stringify({
				msg_type: "open_app",
				msg_content: url
	  		});
			try {
				webkit.messageHandlers.b2bBridge.postMessage(sendData);
			} catch (e) {
				alert(sendData);
			}
		};
		// loading
		KabangB2bJavascriptInterface.prototype.loading =
			function(flag) {
				var sendData = JSON.stringify({
					msg_type: "loading",
					msg_content:flag		// show, hide
				});
				try {
					webkit.messageHandlers.b2bBridge.postMessage(sendData);
				} catch (e) {
					alert(sendData);
				}
			};
		
		// 이용가능 여부 확인 요청
		KabangB2bJavascriptInterface.prototype.serviceAvailable =
			function() {
				var sendData = JSON.stringify({
					msg_type: "serviceAvailable"
				});
				try {
					webkit.messageHandlers.b2bBridge.postMessage(sendData);
				} catch (e) {
					alert(sendData);
				}
			};
		// 정보제공 동의
		KabangB2bJavascriptInterface.prototype.activateTransaction =
			function(transactionKey) {
				var sendData = JSON.stringify({
					msg_type: "activate_transaction",
					msg_content: transactionKey
				});
				try {
					webkit.messageHandlers.b2bBridge.postMessage(sendData);
				} catch (e) {
					alert(sendData);
				}
			};
		// 전자서명
		KabangB2bJavascriptInterface.prototype.signingTransaction =
			function(transactionKey) {
				var sendData = JSON.stringify({
					msg_type: "signing_transaction",
					msg_content: transactionKey
				});
				try {
					webkit.messageHandlers.b2bBridge.postMessage(sendData);
				} catch (e) {
					alert(sendData);
				}
			};
		// 취소 후에 dimsiss도 같이 됨
		KabangB2bJavascriptInterface.prototype.cancelTransaction =
			function(transactionKey) {
				var sendData = JSON.stringify({
					msg_type: "cancel_transaction",
					msg_content: transactionKey
				});
				try {
					webkit.messageHandlers.b2bBridge.postMessage(sendData);
				} catch (e) {
					alert(sendData);
				}
			};
		KabangB2bJavascriptInterface.prototype.close = function(data) {
			var sendData = JSON.stringify({
				msg_type: "close",
				msg_content: data
			});
			webkit.messageHandlers.b2bBridge.postMessage(sendData);
		};
		window.KabangApp = window.KabangApp || {};
		window.KabangApp.KabangB2bJavascriptInterface = KabangB2bJavascriptInterface;
	}
});

