var CertService = {
	CERT_URL: '/tfcommon/include/SK_CertCheckDNLoginSign.jsp',

	setFailPass: function(usid,callback,callbackfail){
		showProgressBar();
		jQuery.post(
			CertService.CERT_URL,
			VestAjaxExt("cmd=setFailPass&USID="+(usid!==undefined?usid:"")+"&resultType=JSON"),
			function(result) {
				hideProgressBar();
				var pwdCount = result.TCNT;
				if (pwdCount < 7){
					alert("전자서명 비밀번호 " + parseInt(pwdCount) + "회오류입니다. 7회오류시 인증서 로그인 할 수 없습니다. \n보안토큰(HSM)이용시 보안토큰 비밀번호를 입력해주십시오.");
					if(callback) callback(result);
					else CertManX.UnSetMatchedContext();
				} else {
					var message = [];
					message.push(
							"전자서명 비밀번호를 7회 오류 입력하여 인증서 사용이 제한됩니다.\n\n",
							"Sign Korea 인증서를 사용하고자 하시는 경우 \n'인증센터' - '공인인증서 재발급' 또는 '공인인증서 발급' 메뉴를 이용하여\n인증서를 재발급 또는 발급 받으신 후 로그인하시기 바랍니다.\n\n",
							"타기관인증서를 사용하고자 하시는 경우 \n'인증센터' - '타기관인증서등록' 메뉴를 이용하여\n인증서를 등록한 후 로그인하시기 바랍니다.\n",
							"(타기관 인증서의 재발급은 해당 인증서 발급기관에서 받으셔야 합니다.)\n\n",
							"추후 망각한 전자서명 비밀번호가 기억나서 \n해당 인증서를 다시 사용하고자 하실 경우에는 \n'인증센터' - '타기관인증서 등록' 메뉴를 이용하여 \n인증서를 등록한 후 정상적으로 사용하실 수 있습니다."
					);
					alert(message.join(''));
					if(callbackfail){
						callbackfail(result);
					}else{
						$TF_UTIL.logout();
					}
				}
			}
		);
	},
	setSuccesPass: function(sign,usid,callback) {
		showProgressBar();
		jQuery.post(CertService.CERT_URL, VestAjaxExt("cmd=setSuccesPass&SignData="+sign+"&USID="+(usid!==undefined?usid:"")+"&resultType=JSON",true),function(result){
			hideProgressBar();
			var RTN = result.RTN;
			var MSG = result.MSG;
			if (RTN!="0") alert(MSG);
			else callback(result);
		});
	}
};