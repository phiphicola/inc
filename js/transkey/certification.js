// Mac Address 와 아이피 전송 처리 함수
// form obj, true or false

if( typeof $TF_UTIL !== 'undefined' ){
	if($TF_UTIL.IS_NON_ACTIVEX) {
		//if(ytMain) CertManX = ytMain;
	}
}

function setParamSubmitForm_cert(f, b_alert,callback_success,callback_fail) {
	/*
	BSTR　GetMacAddress(long mode)
	mode  -	0 : MAC Address,	1 : MAC;IP , 	2 : IP

	디바이스 선택(상위 4비트)
	0 (0)  : first Device , 	1 (16) : default Device, 	2 (32) : All Device
	(ex) 모든 디바이스의 MAC과 IP를 추출 하는 경우: 32+1
	 */
	var ret = '';
	var mac = '';
	var ip = '';
	var hkey = '';
	var nkey = '';


	var n_param = 0;
	if($TF_UTIL.IS_OS_WIN){
		if($TF_UTIL.IS_NON_ACTIVEX) {
			n_param =6+32;
			if(CertManX.doubleClickBlock(arguments.callee)) return;
		}else{
			CertManX.SetSessionServicePort("12846725");
		}
	}
	if($TF_UTIL.IS_NON_ACTIVEX && !$TF_UTIL.IS_MOBILE){
		CertManX.GetPCIdentity("", 0, function(ret){
			if (ret) {
				mac = CertManX.GetToken(ret, "mac");
				hkey = CertManX.GetToken(ret, "hkey");
				nkey = CertManX.GetToken(ret, "nkey");

				elementAddf(f.name, "user_mac_address", mac);//mac address
				elementAddf(f.name, "user_mac_hkey", hkey);//H Key
				elementAddf(f.name, "user_mac_nkey", nkey);//n Key
				CertManX.GetMacAddress(2,function(ip){
					elementAddf(f.name, "user_mac_ip", ip);//IP address
					if(callback_success) callback_success();
				});
			}else {
				CertManX.GetLastErrorCode(function(ErrCode){
					if (ErrCode == 2044) {
						if (b_alert) alert("[certification.js]단말정보획득 실패 : 세션인증이 되지 않았습니다.");
						$TF_UTIL.error('[certification.js]단말정보획득 실패 : 세션인증이 되지 않았습니다.');
						if(callback_fail) callback_fail();
						else return false;
					}
					if (b_alert) alert("[certification.js]단말정보획득 실패 : " + ErrCode);
					$TF_UTIL.error('[certification.js]단말정보획득 실패 : ' + ErrCode);
					if(callback_fail) callback_fail();
					else return false;
				});
			}
		});
	}else if($TF_UTIL.IS_OS_WIN){
		var ret =CertManX.GetPCIdentity("", 0);

		ip = CertManX.GetMacAddress(2);
		if(ret){
			mac = CertManX.GetToken(ret, "mac");
			hkey = CertManX.GetToken(ret, "hkey");
			nkey = CertManX.GetToken(ret, "nkey");
			elementAddf(f.name, "user_mac_address", mac);//mac address
			elementAddf(f.name, "user_mac_ip", ip);//IP address
			elementAddf(f.name, "user_mac_hkey", hkey);//H Key
			elementAddf(f.name, "user_mac_nkey", nkey);//n Key
			if(callback_success) callback_success();
		}else{
			var ErrCode = CertManX.GetLastErrorCode();
			if (ErrCode == 2044) {
				if (b_alert) {
					alert("[certification.js]단말정보획득 실패 : 세션인증이 되지 않았습니다.");
				}

				$TF_UTIL.error('[certification.js]단말정보획득 실패 : 세션인증이 되지 않았습니다.');
				if(callback_fail) callback_fail();
				else return false;
			}

			if (b_alert) {
				alert("[certification.js]단말정보획득 실패 : " + ErrCode);
			}
			$TF_UTIL.error('[certification.js]단말정보획득 실패 : ' + ErrCode);
			if(callback_fail) callback_fail();
			else return false;
		}
	} else if (!$TF_UTIL.IS_MOBILE && !$TF_UTIL.IS_OS_WIN) {
		 XecureWeb.Wif(7, SERVER_CERT,function(PC_IDENTITY){
			 elementAddf(f.name, "pc_identity", PC_IDENTITY);
		 }); // 전자봉투로 암호화 된 PC 정보 추출
	} else {
		//TODO: iPad 단말정보 추출이 필요합니다..
	}
}
// 공인인증
function sessionManage(sessionID) {
	// Session IDN값을 이용하여 구분
	// 인증서환경을 client에서 유지하기위해 세션관리자 호출
	if (CertManX.SetServiceMode("한투증권", sessionID) == false) {
		alert(CertManX.GetLastErrorMsg());
	}
}

function orderSignOnlyCert(orderSignForm) {

	if($TF_UTIL.IS_NON_ACTIVEX) {
		CertManX.UnSetMatchedContext(function(rtn){
			if(!rtn) return false;


		});

	}else{

		if (!CertManX.UnsetMatchedContext()) {
			//alert('false');
			return false;
		}
		// 공인인증서로 로그인인 경우 호출...
		CertManX.SetWrongPasswordLimit(1);

		CertManX.SetCertNewUrlInfo("https://" + window.location.hostname + "/main/customer/guide/PubCertRenew.jsp");

		//*********************************************************************
		//CertManX.SetKeySaferMode(1); // 키보드 보안 모듈 연동 ( 소프트캠프 5, 킹스 1 )
		//CertManX.SetPasswordEncMode(17); // 인증서 비밀번호 메모리 암호화
		var ret = CertManX.SetMatchedContextExt("", "", "", 256 + 0 + 1); // 인증서 선택
		//*********************************************************************
		// 주문시마다 비번 입력
		//var ret = CertManX.SetMatchedContextExt("", "" , "", 256+10+0);

		if (ret == "") { // 인증오류시 처리
			var errCode = CertManX.GetLastErrorCode();
			if (errCode == 1001 || errCode == 2417) { //비밀번호 입력 오류
				alert(CertManX.GetLastErrorMsg());
			} else if (errCode == 8164 || errCode == 8160) { // HSM 비번 오류
				alert("HSM 비밀번호 입력오류");
			} else if (errCode == 2500) {
				alert("PC 에 인증서가 없습니다.\n인증서를 발급받으신 후 다시 접속하시거나\n다른 PC에서 인증서를 발급받으신 경우\n인증서를 디스켓에 복사하신 후 A 드라이브에\n넣으시기 바랍니다. ");
			} else if (errCode == 2501) {
				//if(index == "1"){
				alert("인증서 선택이 사용자에 의해 취소 되었습니다.");
				//}else{
				//alert("인증서 로그인 취소");
				//}
			} else if (errCode == 2508) {

			} else {
				alert("기타오류");
			}

			return "";
		}

		var orderSignValue = CertManX.SignDataB64("", ret, 0);

		if (orderSignValue == "") {
			alert(CertManX.GetLastErrorMsg());
			return "";
		}

		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달
		orderSignForm.orderPlainTextHidden.value = ret;
		orderSignForm.orderSignHidden.value = orderSignValue;
		orderSignForm.orderSignSizeHidden.value = orderSignValue.length;

		return ret;
	}
}

function orderSign(userDN, authPwd, orderSignForm, plainText, callback) {
	return orderSign1(userDN, authPwd, orderSignForm, plainText, callback);
}

function orderSign1(userDN, authPwd, orderSignForm, plainText, callback) {

	$SM.sign(userDN, '', plainText, function(dn, sign) {
		orderSignForm.orderPlainTextHidden.value = plainText;
		orderSignForm.orderSignHidden.value = sign;
		orderSignForm.orderSignSizeHidden.value = sign.length;
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달

		callback(dn, sign);
	});
}

function orderSign2(userDN, authPwd, orderSignForm, plainText, cnt, secretSeq, secretSeqValue) {

	$SM.sign(userDN, '', plainText, function(dn, sign) {
		var tokenArray = plainText.split('$');

		//alert('len=' + tokenArray.length );
		var tot_plainText = '';

		for (var i = 0; i < cnt; i++) {
			tokenArray[i] += secretSeq + "#" + secretSeqValue + "#";
			//alert(tokenArray[i]);

			$SM.b64(tokenArray[i], function(sign) {
				if (i == 0) tot_plainText = sign;
				else
					tot_plainText += '$' + sign;
			});
		}

		orderSignForm.orderPlainTextHidden.value = plainText;
		orderSignForm.orderSignHidden.value = tot_plainText;
		orderSignForm.orderSignSizeHidden.value = tot_plainText.length;
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달

		callback(dn, sign);
	});
}

function orderSignHSM(userDN, authPwd, orderSignForm, plainText, callback) {
	$SM.sign(userDN, '', plainText, function(dn, sign) {
		orderSignForm.orderPlainTextHidden.value = plainText;
		orderSignForm.orderSignHidden.value = sign;
		orderSignForm.orderSignSizeHidden.value = sign.length;
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달

		var hsm_cert = -1;
		try {
			// 보안토큰 인증서 여부 판별
			var before_hsm_cert = CertManX.VerifyDataB64(sign, 1);
			$TF_UTIL.log(before_hsm_cert);

			hsm_cert = CertManX.GetToken(before_hsm_cert, "hsm");
			$TF_UTIL.log(hsm_cert);

			var query = TF_Base64.decode(sign);
			var data = $TF_UTIL.queryToObject(query);
			hsm_cert = data['hsm'];
		} catch (e) {
			throw new Error('VerifyDataB64 오류');
		}

		callback(dn, sign, hsm_cert);
	});
}

function orderSign9(userDN, authPwd, orderSignForm, plainText, callback) {
	$SM.sign(userDN, '', plainText, function(dn, sign) {
		orderSignForm.orderPlainTextHidden.value = plainText;
		orderSignForm.orderSignHidden.value = orderSignValue;
		orderSignForm.orderSignSizeHidden.value = orderSignValue.length;
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달
		callback(dn, sign);
	});
}

function orderSignOnlyCert2(login_id, userDN, succesFn, failFn) {
	$SM.sign(userDN, '', succesFn, failFn);
}

function MsgFrmShow(nType) {
	var sMsg = "";
	if (nType == 8) sMsg = "인증서 비밀번호입력 오류횟수 초과\n인증서 비밀번호를 7회 이상 틀리셨습니다.";
	else if (nType == 14) sMsg = "인증서 선택이 사용자에 의해 취소되었습니다.";
	else if (nType == 15) sMsg = "요청된 작업이 실패하였습니다. \n확인 후 다시 입력해 주십시요.";
	else if (nType == 27) sMsg = "인증서 선택에 실패하였습니다.";
	else
		sMsg = "공인인증처리에 실패하였습니다.";

	alert(sMsg);
	var result = 0;

	return result;
}

function fillStr(str, count)
{
    var i;
    var temp = "";
    for(i=0; i<count; i++)
        temp += str;

    return temp;
}

function zeroFormat(value, count, pos, str) {
	if (count == null) count = 2;
	if (pos == null) pos = 0;
	if (str == null) str = "0";

	var len = count - String(value).length;

	if (len > 0) {
		if (pos == 0) {
			return fillStr(str, len) + value;
		} else {
			return value + fillStr(str, len);
		}
	} else {
		return value;
	}
}

function LogOutProc() {
	$TF_UTIL.logout();
	//location.href = "/main/member/logout/logout.jsp?returnUrl=/main/member/login/login.jsp";
}

function PWMsgFrmShow(nCount) {
	//alert("인증서 비밀번호 : "+nCount+"회 오류");
	alert("전자서명 비밀번호 " + nCount + "회오류입니다. 7회오류시 인증서 로그인 할 수 없습니다. \n보안토큰(HSM)이용시 보안토큰 비밀번호를 입력해주십시오.");
}


function orderSignOnlyCert3(DN, orderSignForm, callback) {
	$SM.sign(DN, '', function(dn, sign) {
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달
		orderSignForm.orderPlainTextHidden.value = dn;
		orderSignForm.orderSignHidden.value = sign;
		orderSignForm.orderSignSizeHidden.value = sign.length;
		callback(dn, sign);
	});
}

//=======================================================================================
//지로 공과금용 큰 사이즈 공인인증서
//2012.07.27 추가
//2012.07.30 : (금백)상품거래>펀드거래/RP거래/신탁거래  사용추가
//=======================================================================================
function orderSignOnlyCert4(userDN, orderSignForm, plainText, callback) {
	$SM.sign(userDN, '', plainText, function(dn, sign) {
		// Base64로 인코딩된 로그인전자서명(원문,서명값,인증서)을 검증페이지로 전달
		orderSignForm.orderPlainTextHidden.value = dn;
		orderSignForm.orderSignHidden.value = sign;
		orderSignForm.orderSignSizeHidden.value = sign.length;
		callback(dn, sign);
	});
}