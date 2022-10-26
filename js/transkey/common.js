
function xSubmitAjax(formObj, settings, spinnerFlag) {
	
	var resultOption = {
		success : function(data, textStatus, jqXHR) {
			if(data.status == 500){
				console.log(data);
				var json = data.errDs;
				popUtil.errorPop(json.errCd, json.errMsg);
			}else{
				if (settings !== undefined && settings.success) {
					if(settings.recvenc != undefined && settings.recvenc && typeof VestDec == 'function'){
						try{
							data = JSON.parse(VestDec(data));
						}catch(e){
							if( e instanceof SyntaxError){
								alert('데이터(JSON) 수신중 오류가 발생했습니다.\n['+e +']');
								return;
							}else{
								alert('데이터 수신중 오류가 발생했습니다.\n['+e +']');
							}
						}
					}
					settings.success(data, textStatus, jqXHR);
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if(jqXHR != 'makeSignData'){
				var msg="";
				var errCd = "";
				if (jqXHR.status === 0) {
		            msg = '네트워크 연결이 되어있지 않습니다.';
		        } else if (jqXHR.status == 404) {
		            msg = '서버를 찾을 수 없습니다. [404]';
		        } else if (jqXHR.status == 500) {
		            msg = '오류가 발생했습니다.[500].';
		        } else if (textStatus === 'parsererror') {
		            msg = '데이터 수신 오류가 발생했습니다.[JSON parse failed.]';
		        } else if (textStatus === 'timeout') {
		            msg = '송신중 타임아웃이 발생했습니다.';
		        } else if (textStatus === 'abort') {
		            msg = '송신 중 요청이 취소 되었습니다.';
		        } else {
		            msg = jqXHR.responseJSON.MSGCODE;
		            errCd = jqXHR.responseJSON.MESSAGE;
		        }
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
				popUtil.errorPop(errCd, msg);
			
			}
			// 토뱅용 로딩바 작업 완료시 로딩바 넣어줄것

			if (settings !== undefined && settings.error) {
				settings.error(jqXHR, textStatus, errorThrown);
			}
			
			
		},
		complete : function() {
			if (settings !== undefined && settings.complete) {
				settings.complete();
			}
			
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
		beforeSend : function() {

			if (settings !== undefined && settings.beforeSend) {
				settings.beforeSend();
			}

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

		}
	};
	var defaultOption = {
			enc : false,		//미사용
			async : true,
			loadingBar : true,	// 로딩바
			type : 'post',		//
			secure : true,		// 보안모듈동작 여부
			recvenc :false		// 수신시 복호화여부
	};

	var ajaxOption;

	if (formObj !== null && formObj !== undefined) {

		if(!(formObj instanceof jQuery)) {
			formObj =jQuery(formObj);
		}

		if (typeof mtk !== 'undefined' && mtk != null) 	{
			mtk.fillEncData();
		}

		ajaxOption = {
			cache : false,
			url : formObj.attr("action"),
			data : settings.data ? settings.data : formObj.serialize()
		};

		if(typeof settings.data == 'object') {
			ajaxOption.data = formObj.serializeObject();
			jQuery.extend(true, ajaxOption.data, settings.data);
		}

		jQuery.extend(true, ajaxOption, defaultOption);

		if (settings) {
			jQuery.extend(true, ajaxOption, settings);
		}

		jQuery.extend(ajaxOption, resultOption);

	} else {

		ajaxOption = {
		    cache : false,
			url : settings.url,
			data : settings.data
		};

		jQuery.extend(true, ajaxOption, defaultOption);
		if (settings) {
			jQuery.extend(true, ajaxOption, settings);
		}
		jQuery.extend(true, ajaxOption, resultOption);

		//폼없으면 보안 작동 안함
		//폼없어도 보안보듈 작동 시키자..
		ajaxOption.secure = true;
	}
//	// 토뱅용 로딩바 작업 완료시 로딩바 넣어줄것


	if('object' == typeof ajaxOption.data) {
		ajaxOption.data = jQuery.param(ajaxOption.data);
	}

	if(ajaxOption.secure) {
		if('function' == typeof VestAjax) {
			ajaxOption.data = VestAjax(ajaxOption.data);
		}
	} else {
		ajaxOption.data = ajaxOption.data + "&_r_=" + Math.random();
	}

	return jQuery.ajax(ajaxOption);
}
