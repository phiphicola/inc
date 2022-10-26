$(function(){
	clickEvent();
});

// ajax호 공통
/**
	json데이터를 입력받아서 ajax호출
	url
	jsonData
	successCallback
	completeCallback
 */
function fn_callAjaxFromJsonData(url, jsonData, successCallback, completeCallback){ 
	var spinnerFlag = completeCallback;
	
	if(spinnerFlag == null || spinnerFlag == undefined || spinnerFlag == "") {
		spinnerFlag = false;
	}
	
	if(spinnerFlag) {
		if(sessionStorage.getItem("isLocal")){
			var spinner = '<div class="loading-spinner"><span class="spinner"></span></div>';
			$(".contents").append(spinner);
		}else{
			if (!window.KabangB2bJavascriptInterface) {
				window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
			}
			KabangB2bJavascriptInterface.loading("show");	
		}
		
	}
	
	$.ajax({
		type : "POST",
		url : url,
		accept : "application/json",
		data : JSON.stringify(jsonData),
		dataType : "json",
		contentType :"application/json;charset=utf-8",
		cache : false,
		success : function(xhr, status, error) {
			if(xhr.status == 500){
				console.log(xhr);
				var json = xhr.errDs;
				popUtil.errorPop(json.errCd, json.errMsg);
			}else{
				successCallback(xhr);	
			}
		},
		complete : function() {
			if(spinnerFlag) {
				if(sessionStorage.getItem("isLocal")){
					$(".loading-spinner").remove();
				}else{
					if (!window.KabangB2bJavascriptInterface) {
						window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
					}
					KabangB2bJavascriptInterface.loading("hide");
				}
			}
		},
		error : function(xhr, status, error) {
			alert("에러발생:" + error + "\n" + status + "\n" + xhr);
		}
	});
}
function fn_callAsyncAjaxFromJsonData(url, jsonData, successCallback, completeCallback){
	// 이쪽은 따로 손봐야 될 것 같아유...
	
	$.ajax({
		type : "POST",
		url : url,
		async:false,
		accept : "application/json",
		data : JSON.stringify(jsonData),
		dataType : "json",
		contentType : "application/json;charset=utf-8",
		cache : false,
		success : function(xhr, status, error) {
			if(xhr.status == 500){
				console.log(xhr);
				var json = xhr.errDs;
				popUtil.errorPop(json.errCd, json.errMsg);
			}else{
				successCallback(xhr);	
			}
		},
		complete : completeCallback,
		error : function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
			var json = JSON.parse(xhr.responseText);
			popUtil.errorPop(json.errCd, json.errMsg);
		}
	});
}
/**
	form id를 입력받아서 form안의 데이터를 json문자열로 변경하여 ajax호출
	url
	jsonData
	successCallback
	completeCallback
 */
function fn_callAjaxFromFormData(url, formId, successCallback, completeCallback){
	var spinnerFlag = completeCallback;
	
	if(spinnerFlag == null || spinnerFlag == undefined || spinnerFlag == "") {
		spinnerFlag = false;
	}
	
	if(spinnerFlag) {
		if(sessionStorage.getItem("isLocal")){
			var spinner = '<div class="loading-spinner"><span class="spinner"></span></div>';
			$(".contents").append(spinner);
		}else{
			if (!window.KabangB2bJavascriptInterface) {
				window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
			}
			KabangB2bJavascriptInterface.loading("show");	
		}
	}
	
	var frm = $("#"+formId).serializeArray();
    var obj = {};
    for(const element of frm) {
		var node = obj[element['name']];
		if('undefined' !== typeof node && node !== null){
			if($.isArray(node)){
				node.push(element['value']);	
			}else{
				obj[element['name']] = [node, element['value']]
			}
		}else{
			 obj[element['name']] = element['value'];
		}
    }
    console.log(JSON.stringify(obj)); 
    
	$.ajax({
		type : "POST",
		url : url,
		accept : "application/json",
		data : JSON.stringify(obj),
		dataType : "json",
		contentType : "application/json;charset=utf-8",
		cache : false,
		success : function(xhr, status, error) {
			if(xhr.status == 500){
				console.log(xhr);
				var json = xhr.errDs;
				popUtil.errorPop(json.errCd, json.errMsg);
			}else{
				successCallback(xhr);	
			}
		},
		complete : function() {
			if(spinnerFlag) {
				if(sessionStorage.getItem("isLocal")){
					$(".loading-spinner").remove();
				}else{
					if (!window.KabangB2bJavascriptInterface) {
						window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
					}
					KabangB2bJavascriptInterface.loading("hide");
				}
			}
		},
		error : function(xhr, status, error) {
			alert("에러발생:" + error + "\n" + status + "\n" + xhr);
		}
	});
}

/*
	공통 버튼 클릭 이벤트 
*/
function clickEvent(){
	// 공지사항 이동
	$(".wrap-btn-notice button").eq(0).on('click', function(){
		$("<form />", {action: "/main/main.jsp?prgmId=notice", method:"POST"}).appendTo('body').submit(); 
	});
	// faq이동
	$(".wrap-btn-notice button").eq(1).on('click', function(){
		$("<form />", {action: "/main/main.jsp?prgmId=faq", method:"POST"}).appendTo('body').submit(); 
	});
	// 닫기버튼 클릭
	$(".btn-close").on('click', function(){
		fn_closeService();
	});
	// 이전버튼 클릭 (추후 수정 가능)
	$(".btn-prev").on('click', function(){
		fn_historyBack();
	});
}

function fn_closeService(){
	//닫기 alert 실행
		$('<div id="layer-pop-exit" class="layer-pop popup-open" modal-popup="" tabindex="0">'+
			'<div class="modal-content">' + 
				'<div class="pop-content">' +
		       //   '<div class="pop-info-tit">팝업의 타이틀</div>' +
		            '<div class="pop-info-txt">' +
		       //       '<p class="stock-name"></p>' +
		                '<span>국내주식 서비스 이용을<br/>종료하시겠어요?</span>' +
		            '</div>' +
		       //   '<div class="label-text">실제 주문시점 부족금액과<br>차이가 발생할 수 있어요.</div>' +
		        '</div>' +
		        '<div class="wrap-btn">' +
		            '<button type="button" class="btn-lg btn-line btn-half" data-layer-close="">아니요</button>' +
		            '<button type="button" class="btn-lg bg-primary btn-half">네</button>' +
		        '</div>' +
		    '</div>' + 
			'<div class="dim"></div>'+
		'</div>'
		).appendTo('body');
		
		$('#layer-pop-exit button').eq(0).on('click', function(){
	        $(this).closest('.layer-pop, .full-pop').removeClass('popup-open');
	        $(this).closest('.layer-pop, .full-pop').removeAttr('tabindex');
	        $('body').removeClass('hidden');
	        $("#layer-pop-exit").remove();
		});
		$('#layer-pop-exit button').eq(1).on('click', function(){
			if (!window.KabangB2bJavascriptInterface) {
				window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
			}
			KabangB2bJavascriptInterface.close("00");
		}); 
}
var tabIndex = 0;
var backPressTime = "";
onBackPressed = function(){
	// 빠르게 두번 클릭 시 앱 닫기
	/*
	if((new Date().getTime() - backPressTime) < 500){
		fn_closeService();
		return true;
	}else{
		backPressTime = new Date().getTime();
		if(backPressTime != ""){
			setTimeout(function(){
				fn_historyBack();
			}, 500);
		}else{
			fn_historyBack();
		}
	}*/
	
	fn_historyBack();
	return true;
}

function fn_historyBack(){
	// 팝업 여부 체크
	if(tabIndex > 0){
	//	var popId = $(".full-popup-open[tabindex="+tabIndex+"]").attr("id");
		var popId = $("[tabindex="+tabIndex+"]").attr("id");	// 모든 팝업으로 변경
		console.log(popId);
		if(popId == "layer-pop-password"){
			$("#layer-pop-transferPrice").removeClass("full-popup-open");
			 
			// password 는 닫는 방식 상이
			closePopPassword();
		}else if($("#"+popId).attr("open-option") == ""){
			 $('.dim').click();
		}else{
			popUtil.closePop(popId);	
		}
	}else{
		if($(".btn-prev").hasClass("stop")) {
			// 뒤로가기 외에 화면에서 다른 액션을 해야 할 때 각 화면 클래스에 stop 추가 후 fn_prevStep로 버튼 제어 필요 
			fn_prevStep();
		} else {
			// 현재화면이 홈인 경우 서비스 종료 / 닫기
			if(typeof isHome == "undefined"){ isHome = false; }
			if(isHome){
				fn_closeService();
			}else{
				location.href = "/main/main.jsp";	
			}
		}
	}
	return true;
}

// 관심종목 등록
function favoriteEvntBind(formId) {
	// 로그인 여부 체크하여 비로그인상태면 가입 유도 alert 생성
	// TODO :: 로그인여부 체크방법 추후 수정 필요
	
	console.log(sessionStorage.getItem('isLogin'));
	var isLogin = sessionStorage.getItem('isLogin') == "Y" ? true:false;
	if(isLogin){
		$('#'+formId+' .favorite button').on('click', function() {
			console.log($(this).hasClass('on'));
			console.log($(this).data());
			if($(this).hasClass('on')){
				// 관심종목 삭제
				favWorkUtil.remove($(this).data('jongCode'), $(this).data('jongName'), $(this));
			}else {
				// 관심종목 등록
				favWorkUtil.add($(this).data('jongCode'), $(this).data('jongName'), $(this));
			}
	     });
	}else{
		$('#'+formId+' .favorite button').on('click', function() {
			// 관심종목을 등록하고 주식매매를 시작해볼까요?
			$('<div id="layer-pop-exit" class="layer-pop popup-open" modal-popup="" tabindex="0">'+
				'<div class="modal-content">' + 
					'<div class="pop-content">' +
			       //   '<div class="pop-info-tit">팝업의 타이틀</div>' +
			            '<div class="pop-info-txt">' +
			       //       '<p class="stock-name"></p>' +
			                '<span>관심종목을 등록하고<br/>주식매매를 시작해볼까요?</span>' +
			            '</div>' +
			       //   '<div class="label-text">실제 주문시점 부족금액과<br>차이가 발생할 수 있어요.</div>' +
			        '</div>' +
			        '<div class="wrap-btn">' +
			            '<button type="button" class="btn-lg btn-line btn-half" data-layer-close="">아니요</button>' +
			            '<button type="button" class="btn-lg bg-primary btn-half">네</button>' +
			        '</div>' +
			    '</div>' + 
				'<div class="dim"></div>'+
			'</div>'
			).appendTo('body');
			
			$('#layer-pop-exit button').eq(0).on('click', function(){
		        $(this).closest('.layer-pop, .full-pop').removeClass('popup-open');
		        $(this).closest('.layer-pop, .full-pop').removeAttr('tabindex');
		        $('body').removeClass('hidden');
		        $("#layer-pop-exit").remove();
			});
			$('#layer-pop-exit button').eq(1).on('click', function(){
				// 네 버튼
				if (!window.KabangB2bJavascriptInterface) {
					window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
				}
				var trxKey = sessionStorage.getItem("joinTrxKey");
				sessionStorage.removeItem("joinTrxKey");
				if(trxKey != "" && trxKey != null){
					KabangB2bJavascriptInterface.activateTransaction(trxKey);	
				}
			}); 
			
	    });
	}
}

// 종목관련 유틸
var stockUtil = {
	// 종목상세 페이지로 이동하기
	goStockMain : function(jongCode, jongName){
		$("<form />", {action: "/stock/stock.jsp", method:"POST"})
		.append($('<input />', {type:'hidden', name:'jongCode', value:jongCode}))
		.append($('<input />', {type:'hidden', name:'jongName', value:jongName}))
		.appendTo('body').submit();
	}
};

// 한국투자앱으로 바로가기
function goToApp(param) {
	var url = "";
	if (!window.KabangB2bJavascriptInterface) {
		window.KabangB2bJavascriptInterface = new window.KabangApp.KabangB2bJavascriptInterface();
	}
	if(commonUtil.isIOS()){
		switch(param.type){
			case "1" :	// 종목상세
				url = "mtsrn://content?SSO_SCREENNO=0800&openData=" + param.PDNO + "&jCode=" + param.PDNO;
				break;
			case "2" : // 주식잔고조회
				url = "mtsrn://content?SSO_SCREENNO=0819";
				break;
			case "3" : // 거래내역조회
				url = "mtsrn://content?SSO_SCREENNO=0258";
				break;
			default : 
				break;
		}
	
		setTimeout( function () {
			var visitedAt = (new Date()).getTime(); // 방문 시간
			if ( (new Date()).getTime() - visitedAt < 2000 ) {
				url = "https://itunes.apple.com/kr/app/id1621986905";
				KabangB2bJavascriptInterface.openApp(url);
			}
		} ,500 );
		setTimeout( function () {
			KabangB2bJavascriptInterface.openApp(url);
		} ,0 );
	
	}else{
		switch(param.type){
			case "1" :	// 종목상세
				url = "https://m.koreainvestment.com/app/mtsrenewal.jsp?type=06&SSO_SCREENNO=0800&openData=" + param.PDNO;
				break;
			case "2" : // 주식잔고조회
				url = "https://m.koreainvestment.com/app/mtsrenewal.jsp?type=04&SSO_SCREENNO=0819";
				break;
			case "3" : // 거래내역조회
				url = "https://m.koreainvestment.com/app/mtsrenewal.jsp?type=04&SSO_SCREENNO=0258";
				break;
			default : 
				break;
		}
		KabangB2bJavascriptInterface.openApp(url);
	}
}

var favWorkUtil = {
	add : function(jongCode, jongName, star){
		var param = {
			  mksc_shrn_iscd : jongCode
			, hts_kor_isnm : jongName
		};
		var url = "/stock/stockFavorite.jsp?cmd=addFavoriteOne";
		fn_callAsyncAjaxFromJsonData(url, param, function (data){
			if(data.DATA.err_cd != "0000"){
				popUtil.errorPop(data.DATA.err_cd, data.DATA.err_message);
			}else{
				star.toggleClass('on');
			}
			return true;
		}, null);
	},
	remove : function(jongCode, jongName, star){
		var param = {
			  mksc_shrn_iscd : jongCode
			, hts_kor_isnm : jongName
		};
		var url = "/stock/stockFavorite.jsp?cmd=removeFavoriteOne";
		fn_callAsyncAjaxFromJsonData(url, param, function (data){
			if(data.DATA.err_cd != "0000"){
				popUtil.errorPop(data.DATA.err_cd, data.DATA.err_message);
			}else{
				star.toggleClass('on');
			}
			return true;
		}, null);
	}
};

var passwordUtil = {
	getPassword : function(){
		return localStorage.getItem('password') == null || localStorage.getItem('password') == 'undefinded' ? "" : localStorage.getItem('password');
	},
	setPassword : function(data){
		localStorage.setItem('password', data);
	}
};