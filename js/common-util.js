// data mapper 공통
var dataUtil = {
	setData : function(formId, jsonData){
		var frm = null;
		if(typeof formId === "string"){
			frm = $("#"+formId).find("[data-name]");
		}else if (typeof formId === "object"){
			frm = formId.find("[data-name]");
		}
		
		$.each(jsonData, function(key, value){
			$.each(frm, function(){
				if($(this).data('name') == key){
					var prefix = $(this).data('prefix') == null ? "":$(this).data('prefix');
					var postfix = $(this).data('postfix') == null ? "":$(this).data('postfix');				
					switch($(this).prop('tagName').toLowerCase()){
						// data-name을 이용한 세팅이 필요 시 아래에 tag를 추가하고 방법을 작성한다.
						case "span":
						case "p":
						case "li":
						case "h3":
						case "dd":
							$(this).html(prefix + dataUtil.dataFormatter(value, $(this).data('type')) + postfix);
							break;
						case "input" :
							if($(this).attr("type") == "text" || $(this).attr("type") == "hidden"){
								$(this).val(prefix + dataUtil.dataFormatter(value, $(this).data('type')) + postfix);
							}
							break;
						case "select":
							break;
						case "img":
								$(this).attr("src", "/inc/img/stcokImg/"+value+".png");
							break;
						case "div":
							if($(this).data('type') == "img"){
								var img = new Image();
								img.src = "/inc/img/stcokImg/"+value+".png";
								img.addEventListener('error', function(){
									$(this).attr("style", "display:none");
								});	
								$(this).append(img);		
							}else{
								$(this).html(dataUtil.dataFormatter(value, $(this).data('type')));
							}
							break;
						case "button":
							if($(this).data('type') == "fav"){
								// 관심종목
								$(this).addClass(value);
								$(this).data("jongCode", jsonData[$(this).data("info").split("|")[0]]);
								$(this).data("jongName", jsonData[$(this).data("info").split("|")[1]]);
							} else {
								$(this).text(prefix + dataUtil.dataFormatter(value, $(this).data('type')) + postfix);
							}
							break;
						default :
							$(this).text(prefix + dataUtil.dataFormatter(value, $(this).data('type')) + postfix);
							break;
					}
					
					// 컬러옵션
					// 값을 세팅하는 영역에 등락률에 따라 text색상을 변경해야하는 경우(금액과 등락율이 함께있는 곳에서만 사용가능 -> 등락율 값으로 검은색을 표시해야해서.)
					// 등락율을 세팅하는 span~기타영역 에 아래와 같은 값을 준다.
					// data-option : 영역 색상을 주어야 하는 case (evlu한가지일거같아서 나중에 변경필요.)  
					// 				 이 옵션이 있는 영역의 data-name값이 양수, 음수, 0 에 따라 값이 변경된다.
					// data-area : stock-decrease, stock-increase class가 들어가야 할 곳의 id값 선언
					if($(this).data('option') != null){
						switch($(this).data('option')){
							case "등락율" :	// 등락율
							// 1/상한, 2/상승, 3/보합, 4/하한, 5/하락 체크 필요
									var str = $(this).closest('[data-name=color_area]').attr('class');
									switch (jsonData[$(this).data('sign')]){
										case "1":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-upper " + str);
										break;
										case "2":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-increase " + str);
										break;
										case "3":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-steady " + str);
										break;
										case "4":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-lower " + str);
										break;
										case "5":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-decrease " + str);
										break;
										
									}
								break;
							case "금액" : 
									var str2 = $(this).closest('[data-name=color_area]').attr('class');
									
									switch (jsonData[$(this).data('sign')]){
										case "1":
										case "2":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("color-red " + str2);
										break;
										case "3":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass(str2);
										break;
										case "4":
										case "5":
											$(this).closest('[data-name=color_area]').attr('class', '').addClass("color-blue " + str2);
										break;
										
									}
								break;							
							default : 
									if(Number(value) > 0){
										// 플러스
										$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-increase " + str);
									}else if(Number(value) == 0){
										// 0
										$(this).closest('[data-name=color_area]').attr('class', '').addClass(str);
									}else{
										// 마이너스(파란색)
										$(this).closest('[data-name=color_area]').attr('class', '').addClass("stock-decrease " + str);
									}
									
								break;
						}
					}
				}
			});
		});
		
	},
	
	// data-name을 이용한 데이터 작성 시 data formatting방법을 작성한다.
	dataFormatter : function(data, dataType){
		switch(dataType){
			case "amt" : 
				return formatUtil.amt(data);
			case "amt_removeSign" : 
				return formatUtil.amt(data).replaceAll("-","").replaceAll("+","");
			case "amt_korean" : 
				return formatUtil.transKoreanAlt(data);
			case "amtRt2" : 
				return formatUtil.amtRt2(data);
			case "date" :
				return  formatUtil.date(data, '', '.');
			case "time" :
				return  formatUtil.date('', data, '');
			case "timeMin" :
				return  formatUtil.date('', data, '').substr(0,5);
			case "rt2" :
				return  formatUtil.rt(data, '2');
			case "imgText" :
				return data.substr(0,1);
			default : 
				return data;
		}
	}
};


var formatUtil = {
	// 금액 formatting
	amt : function(num){
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		num = Number(num+"").toFixed(0); // 숫자를 문자열로 변환, 소수점 삭제
		while (reg.test(num)) num = num.replace(reg, '$1' + ',' + '$2');
		return num;
	},
	amtRt2 : function(num){
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		num = Number(num+"").toFixed(2); // 숫자를 문자열로 변환, 소수점 삭제
		while (reg.test(num)) num = num.replace(reg, '$1' + ',' + '$2');
		console.log(num);
		return num;
	},
	// 날짜 formatting
	date : function(sDate, sTime, sDelimeter){
		var sResult	= "";
	
		if ( sDate != null && sDate.length >= 8 )
		{
			sResult	+= sDate.substring(0,4);
			sResult	+= sDelimeter;
			sResult	+= sDate.substring(4,6);
			sResult	+= sDelimeter;
			sResult	+= sDate.substring(6,8);
			if ( sTime != null && sTime.length >= 6 )
			{
				sResult += " ";
			}
		}
	
		if ( sTime != null && sTime.length == 14 )
		{
			sResult += sTime.substring(8,10);
			sResult	+= ":";
			sResult += sTime.substring(10,12);
			sResult	+= ":";
			sResult += sTime.substring(12,14);
		} else if ( sTime != null && sTime.length == 6 )
		{
			sResult += sTime.substring(0,2);
			sResult	+= ":";
			sResult += sTime.substring(2,4);
			sResult	+= ":";
			sResult += sTime.substring(4,6);
		}else if ( sTime != null && sTime.length == 4 ){
			// 시, 분만 원할경우 4글자로 잘라서 보낸다.
			sResult += sTime.substring(0,2);
			sResult	+= ":";
			sResult += sTime.substring(2,4);
		}
	
		return sResult;
	},
	// 수익률 formatting
    rt : function(num, nIndex)
     {
     	return Number(num+"").toFixed(nIndex)+'%';
	 },
	// 계좌번호 
	account : function(account, bankCd){
     	var sResult	= "";
	
		if (bankCd == "KAKAO") { //카카오계좌
			sResult	+= account.substring(0,4);
			sResult	+= "-";
			sResult	+= account.substring(4,6);
			sResult	+= "-";
			sResult	+= account.substring(6);
		} else { //한투계좌
			if(account.length == 8) {
				sResult	+= account + "-01";
			} else if(account.length == 10) {
				sResult	+= account.substring(0,8);
				sResult	+= "-";
				sResult	+= account.substring(8,10);
			} else {
				sResult	+= account;
			}
		}
		return sResult;
    },
	// delComma
	delComma : function(strValue){
		var strlength = strValue.length;
		var tempStr="";
		var i;
	
		for(i=0; i<strlength; i++)
		{
			tempStr = strValue.substring(i,i+1);
			if(tempStr == ",")
			{
				strValue = strValue.substring(0,i)+strValue.substring(i+1);
				strlength--;
			}
		}
		return strValue;
	},
	// 계좌 Split
    getAccountNumber : function(objSelect, nIndex){
     	var account_name = objSelect.options[objSelect.selectedIndex].value;
     	var arrAcct=account_name.split("!");

     	if (  arrAcct.length > nIndex )
     		return arrAcct[nIndex];
     	else
     		return "";
     },
     // 금액 한글로 바꾸기 (천단위는 숫자)
     transKoreanAlt : function(val) {   
    	var strKor = "";
    	var srcNumber = formatUtil.delComma(val,",");  	
    	console.log(val);
    	var	num1 = srcNumber.length;//숫자의 길이를 구한다.   
    	var src1 = srcNumber.substr(0,1);//입력숫자의 첫번째를 잘라낸다
    	var src2 = srcNumber.substr(1,num1);//'0'다음의 숫자를 잘라낸다
    
    	if(num1 == 0 && srcNumber == ""){
			return "";
		}else if(num1 == 1 && srcNumber == 0){
			srcNumber = "0";
		//	return "0";
    	}
    	else if(src1 == 0){    
			srcNumber = src2;
		}
    	
    	if(srcNumber != "") {
    		var i, j=0, k=0;
    		var han1 = new Array("","1","2","3","4","5","6","7","8","9");
    		var han2 = new Array("","만 ","억 ","조 ");
    		//var han3 = new Array("","십","백","천");
    		var result="", hangul = srcNumber + "";
    		var str = new Array(), str2="";
    		var strTmp = new Array();
    		for(i=hangul.length; i > 0; i=i-4)
    		{
    			str[j] = hangul.substring(i-4,i); //4자리씩 끊는다.
    			if(j == 0) {
					result = formatUtil.amt(str[0]);
				} else {
					
					for(k=str[j].length;k>0;k--) {
	    				strTmp[k] = (str[j].substring(k-1,k))?str[j].substring(k-1,k):"";
	    				strTmp[k] = han1[parseInt(strTmp[k],10)];
	    				if(strTmp[k] == '') strTmp[k] += '0';
	    				str2 = strTmp[k] + str2;
	    			}
	    			str[j] = str2;
	    			
    				if(str[j] != '0000') {
						if(result == 0){
							result = formatUtil.amt(str[j])+han2[j];
						}else {
							result = formatUtil.amt(str[j])+han2[j]+result;
						}
					}
				}
    			j++; str2 = "";
			}
    		strKor = result + "원";    		
    	}
    	return strKor;
    }
};

var popUtil = {
	openPop : function(divId, data){
		
		var type = $("#"+divId).attr('data-poptype'); 
		
		if(type == "slide"){
	        $("#" + divId).addClass('popup-open');
	        $("#" + divId).attr('tabindex', ++tabIndex).focus();
		}else{	// (type == "full")
		
			// full 팝업 열릴 때 로딩 추가
			$("body").append('<div class="loading-spinner"><span class="spinner"></span></div>');
			$("#" + divId).load(data.url, function(){
				if(data.param != undefined) {
					window[data.callback](data.param);
				} else if(data.callback != undefined) {
					window[data.callback]();
				}
            	$("#" + divId).addClass('full-popup-open');    
				$("#" + divId).attr('tabindex', ++tabIndex).focus();
				
			});
			$(".loading-spinner").remove();
		}
		$('body').addClass('hidden');
		
		var closeFunc = $("#"+divId).find('[data-layer-close], .dim, .select-form li button');
	    closeFunc.on('click', function(){
			console.log($(this).closest('[data-poptype]').data('poptype'));
			if($(this).closest('[data-poptype]').data('poptype') == "slide"){
				$(this).closest('.layer-pop').removeClass('popup-open');
	       		$(this).closest('.layer-pop').removeAttr('tabindex');
			}else{
				$(this).closest('.full-pop').removeClass('full-popup-open');
	       		$(this).closest('.full-pop').removeAttr('tabindex');
			}
			popUtil.decreaseTabIndex();
	    });
		
	},
	closePop : function(divId){
		var type = $("#"+divId).attr('data-poptype'); 
		if($("#"+divId).hasClass("popup-open")){
			type = "slide";
		}else{
			type = "full";
		}
		if(type == "slide"){
	        $("#" + divId).closest('.layer-pop').removeClass('popup-open');
	        $("#" + divId).closest('.layer-pop').removeAttr('tabindex');
		}else{	// (type == "full")
	        $("#" + divId).closest('.full-pop').removeClass('full-popup-open');
	        $("#" + divId).closest('.full-pop').removeAttr('tabindex');
	 //       $("#" + divId).html('');	// 임시 주석 이상이 있는지 한동안 주시
		}
		popUtil.decreaseTabIndex();
	},
	closeFullPop : function(pop){
		var popFull = null;
		if(typeof pop === "string"){
			if("#".indexOf(pop) != 0) {
				pop = "#" + pop;
			}
			popFull = $(pop);
		}else if (typeof pop === "object") {
			popFull = pop;
		}
        popFull.closest('.full-pop').removeClass('full-popup-open');
        popFull.closest('.full-pop').removeAttr('tabindex');
        popUtil.decreaseTabIndex();
	},
	alertPop : function(divId, msg1, msg2){
		$("#" + divId).addClass('popup-open');
	    $("#" + divId).attr('tabindex', ++tabIndex).focus();
	    
	    if(msg1 != undefined && msg1 != '') {
		    $("#" + divId).find(".text-box").html(msg1);
		}
		
		if(msg2 != undefined && msg2 != '') {
		    $("#" + divId).find(".label-text").html(msg2);
		}
	    
	    $("#" + divId).find("[data-layer-close]").on("click", function(){
			$("#" + divId).removeClass('popup-open');
	        $("#" + divId).removeAttr('tabindex');
		});
	},
	confirmPop : function(divId, data, msg1, msg2){
		$("#" + divId).addClass('popup-open');
	    $("#" + divId).attr('tabindex', ++tabIndex).focus();
	    
	    if(msg1 != undefined && msg1 != '') {
		    $("#" + divId).find(".text-box").html(msg1);
		}
		
		if(msg2 != undefined && msg2 != '') {
		    $("#" + divId).find(".label-text").html(msg2);
		}
		
	    // 아니오 버튼
	    $("#" + divId + " .wrap-btn button").eq(0).on("click", function(){
			$("#" + divId).removeClass('popup-open');
	        $("#" + divId).removeAttr('tabindex');
		});
		
		// 예 버튼
		$("#" + divId + " .wrap-btn button").eq(1).on("click", function(){
			if(data.param != undefined) {
				window[data.callback](data.param);
			} else if(data.callback != undefined) {
				window[data.callback]();
			}
			
			$("#" + divId).removeClass('popup-open');
	        $("#" + divId).removeAttr('tabindex');
		});
	},
	confirmPop2 : function(divId, data, func1, func2){
		$("#" + divId).addClass('popup-open');
	    $("#" + divId).attr('tabindex', ++tabIndex).focus();
	    
	    if(data.title != undefined && data.title != '') {
		    $("#" + divId).find(".pop-info-tit").html(data.title).removeAttr('hidden');
		}else{
			$("#" + divId).find(".pop-info-tit").html('').attr('hidden', true);
		}
	    
	    if(data.msg1 != undefined && data.msg1 != '') {
		    $("#" + divId).find(".text-box").html(data.msg1);
		}
		
		if(data.msg2 != undefined && data.msg2 != '') {
		    $("#" + divId).find(".label-text").html(data.msg2);
		}
		
		$("#" + divId + ' button').eq(0).text((data.btn1 != undefined && data.btn1 != '') ? data.btn1:'취소');
		$("#" + divId + ' button').eq(1).text((data.btn2 != undefined && data.btn2 != '') ? data.btn2:'확인');
	    
	    // 아니오 버튼
	    $("#" + divId + " .wrap-btn button").eq(0).on("click", function(){
			func1();
		});
		
		// 예 버튼
		$("#" + divId + " .wrap-btn button").eq(1).on("click", function(){
			func2();
		});
		
	}, errorPop : function(errorCode, errorMessage, callBack){
		// error alert실행
		if(errorMessage == ''){
			errorMessage = '오류가 발생했습니다.';
		}
		var popStr = '';
		popStr += '<div id="layer-pop-error" class="layer-pop popup-open" modal-popup="" tabindex="'+ (++tabIndex) +'" data-poptype="slide">'+
			'<div class="modal-content">' + 
				'<div class="pop-content">' +
		            '<div class="pop-info-txt">' +
		                '<span>'+errorMessage+'</span>' +
		            '</div>' +
		        	'<div class="label-text">'+errorCode+'</div>'+
		  		'</div>' +
		        '<div class="wrap-btn">' +
		            '<button type="button" class="btn-lg bg-primary btn-half" id="error-pop-close">확인</button>' +
		        '</div>' +
		    '</div>' + 
			'<div class="dim"></div>'+
		'</div>';
		
		$(popStr).appendTo('body');
		$("#error-pop-close").off('click').on('click', function(){
			popUtil.closePop('layer-pop-error');
			$('#layer-pop-error').remove();
			if(typeof callBack == 'function'){
				callBack();	
			}
		});
	}, decreaseTabIndex : function(){
		tabIndex--;
		if(0 >= tabIndex){
			$("body").removeClass("hidden");
			tabIndex = 0;
		}
	}
};


var commonUtil = {
	
	// 종목 이미지 가져오기
    getJongmokImg : function(jongCode, jongName){
		var img = new Image();

		img.src = "/inc/img/stcokImg/"+jongCode+".png";
		
		if(img.complete) {
			return '<img src="/inc/img/stcokImg/'+jongCode+'.png" alt="">';
		} else {
			return '<span>'+jongName+'</span>';	
		}
	},
	// 텍스트 허용 자리수 이후 ... 생략
	getTxtLength : function(str, len){
		if(str.length > len) {
			str = str.substring(0, len)+" ...";
		}
		return str;
	},
	// 오늘 날짜 가져오기
    getToday : function(delim){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();
		var day = today.getDate();

		if ((month + 1) < 10) {
			month = '0' + (month + 1);
		} else {
			month = month + 1;
		}

		if(day < 10){
			day = '0' + day;
		}

		if(delim!=undefined){
			return year + delim + month + delim + day;
		} else {
			return year + '' +month + '' + day;
		}
	},
	// 현재 시간 가져오기
    getTime : function(t){
		var rtn = "";
		var today = new Date();
		var hour = today.getHours();
		var minite = today.getMinutes();
		var second = today.getSeconds();
		
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (minite < 10) {
			minite = '0' + minite;
		}
		if (second < 10) {
			second = '0' + second;
		}
		
		rtn = t.replaceAll("HH", hour).replaceAll("mm", minite).replaceAll("ss", second);
		
		console.log(rtn);

		return rtn;
	},
	addDate : function(today, range, cnt ){
		var date = new Date(today.substr(0,4), parseInt(today.substr(4,2))-1, today.substr(6,2));
		
		if(range == "Y" || range == "y"){
			date.setFullYear(date.getFullYear() + cnt);
		}else if(range == "M" || range == "m"){
			// 입력일자가 말일이고 월계산일경우 말일체크가 필요
			var firstDate = new Date(date.getFullYear(), date.getMonth() + cnt, 1);
			var lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);
			
			var result = firstDate;
			if(date.getDate() > lastDate.getDate()){
				result.setDate(lastDate.getDate());
			}else{
				result.setDate(date.getDate());
			}
			date = result;
			
		}else if(range == "D" || range == "d"){
			date.setDate(date.getDate() + cnt);
		}
		
		var ry = date.getFullYear();
		var rm = date.getMonth() +1;
		var rd = date.getDate();
		
		if(rm < 10){
			rm = "0"+rm;
		}
		if(rd < 10){
			rd = "0"+rd;
		}
		return "" + ry + rm + rd;
	},
	// 특정 field 값으로 sort (현재 숫자만 가능 문자 필요할 시 추가)
	getListSortable (list, field, type) {
		if(type == "ASC") {
			list.sort(function(a,b) {
				return a[field] - b[field];
			})
		} else {
			list.sort(function(a,b) {
				return b[field] - a[field];
			})
		}
		
	},
	// 문자열에서 숫자만 가져오기
	getNumber(str) {
		var regex = /[^0-9]/g;
		return str.replace(regex, "");
	},
	getOsInfo(){
		var agent = window.navigator.userAgent.toLowerCase();
		var os_gubun = "";
		if(agent.indexOf("android") > -1){
			os_gubun = "android";
		}else if(agent.indexOf("iphone") > -1) {
			os_gubun = "ios";
		}else if(agent.indexOf("ipad") > -1) {
			os_gubun = "ios";
		}
		return os_gubun;
	},
	isAndroid : function() {
		return ( commonUtil.getOsInfo() == "android");
	},
	isIOS : function() {
		return ( commonUtil.getOsInfo() == "ios");
	}
	
} 

var chartDate = {
	getNow : function(){
		return new Date(formatUtil.date(commonUtil.getToday(), '', '-')).getTime();
	},
	getHourPrev : function(cnt){
		return new Date(formatUtil.date(commonUtil.getToday(), '', '-')).getTime() + (600000*6 * cnt);
	},
	getDayPrev : function(cnt){
		return new Date(formatUtil.date(commonUtil.addDate(commonUtil.getToday(), 'D', cnt), '', '-')).getTime();
	},
	getMonthPrev : function(cnt){
		return new Date(formatUtil.date(commonUtil.addDate(commonUtil.getToday(), 'M', cnt), '', '-')).getTime();
	},
	getYearPrev : function(cnt){
		return new Date(formatUtil.date(commonUtil.addDate(commonUtil.getToday(), 'Y', cnt), '', '-')).getTime();
	}
	
};
