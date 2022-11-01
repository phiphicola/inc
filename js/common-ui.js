$(function(){
    clearBtn();
    tabs();
    titBlur();
    fixedCont();
    popupFunc();
    tooltipFunc();
    accordion();
    bottomSheet();
    checkOS();
})

// 이벤트 배너
$(document).ready(function() {
    var swiper = new Swiper('.banner-slider', {
        slidesPerView:'auto',
        spaceBetween:8,
        centeredSlides:true
    });
});

// 카테고리 배너
$(document).ready(function() {
    var swiper = new Swiper('.main-slider, .category-slider', {
        slidesPerView:'auto',
        spaceBetween:8,
        watchSlidesProgress:true
    });
});

// 호가 선택 //삭제 될 수 있음
$(function(){
    $('.column .check').on('click', function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });
});

// 버튼 선택 //삭제 될 수 있음
$(function(){
    $('.select button, .select-form li').on('click', function() {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
    });
});

// 숫자 버튼 누를때 효과
$(function(){
    $('.input-buttons button').on('touchstart', function() {
        $(this).addClass('active');
    });
    
    $('.input-buttons button').on('touchend', function() {
        $(this).removeClass('active');
    });
});

// 공지사항 있을때 버튼 배경색 바뀜
$(function(){
    var fixButton = $('.wrap-btn-sticky');
    var elHeight = $('.notice-wrap').outerHeight();
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var val = $(document).height() - $(window).height() - elHeight;
        if  (scroll >= val) {
            fixButton.addClass('bg-gray2');
        }else {
            fixButton.removeClass('bg-gray2');
        }
    });
});

// 계좌상세 더보기
$(function(){
    $('.viewhide .more-view').on('click', function() {
        $('.viewhide').find('.add-list').show();
        $(this).hide();
    });
});

// 인풋 포커스 시 버튼 따라올라옴 방지
$(function(){
    var fixBtn = $('.wrap-btn-fixed');    
    $('.input-type').on('focus', function() {
        fixBtn.addClass('sticky');
    })
    $('.input-type').on('blur', function() {
        fixBtn.removeClass('sticky');
    })
    
});

$(function(){
    $('iframe').on('load', function() {
        var iHeight = $(this).contents().find('body')[0].scrollHeight;
        $(this).attr("height", iHeight);
    })
});

// 타이틀 블러
function titBlur () {
    var blurTitle = $('.blur');
    var hederHeight = $('header').outerHeight();
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var val = hederHeight;
        var valPercent = (scroll / val);
        // console.log(valPercent)
            blurTitle.css({
                "opacity" :valPercent
            });
    });
}

// 검색 삭제
function clearBtn () {
    $('.btn-clear').on('click', function(e) {
        e.preventDefault();
        $(this).prev('input').val('');
     });
}

// 공통 탭
function tabs () {
    $('.tabs ul li:first-child').addClass('on');
    $('.tab-content').hide();
    $('.tab-content:first').show();
    $('.tabs ul li').on('click', function() {
        $('.tabs ul li').removeClass('on');
        $(this).addClass('on');
        $('.tab-content').hide();
        
        var activeTab = $(this).find('button').attr('data-target');
        $(activeTab).show();
        return false;
    });
}

// 호가 정보 스크롤 시 디자인 변경
function fixedCont () {
    var fixRate = $('.rate-container.fix');
    $('.price-list').scroll(function() {
        if  ($(this).scrollTop() >= 10) {
            fixRate.addClass('fixed');
        }else {
            fixRate.removeClass('fixed');
        }
    });    
}

// 아코디언 ui
function accordion () {
    $('.accordion li').on('click', function() {
        $(this).toggleClass('on');
        $(this).siblings().removeClass('on');
        $('.list-sub').stop().slideUp(100);
        $('.on .list-sub').stop().slideDown(100);
        return false;
     });
}
//레이어 팝업
function popupFunc () {
    var openFunc = $('[data-layer-href]');
    openFunc.on('click', function(){
        var layerHref = $(this).attr('data-layer-href');
        if ($('[' + layerHref + ']').hasClass('full-pop')) {
            $('[' + layerHref + ']').addClass('full-popup-open');  
        } else {
            $('[' + layerHref + ']').addClass('popup-open');    
        }        
        $('[' + layerHref + ']').attr('tabindex', ++tabIndex).focus();
        $('body').addClass('hidden');
        return false;
    })
    
    var closeFunc = $('[data-layer-close], .dim, .select-form li button');
    closeFunc.on('click', function(){
        $(this).closest('.layer-pop, .full-pop').removeClass(['popup-open','full-popup-open' ]);
        $(this).closest('.layer-pop, .full-pop').removeAttr('tabindex');
        popUtil.decreaseTabIndex();
    })
}

//툴팁
function tooltipFunc () {
    var openTrigger = $('.tooltip-cont .btn-trigger');
    openTrigger.on('click', function(e){
        $(this).next('.tooltip-view').toggleClass('open');
        e.stopPropagation();
    })    
    $('body').on('click', function(){
        openTrigger.next('.tooltip-view').removeClass('open');
    })
}

function scrCenter() {
    const winHeight = document.getElementById('scrollCeter')
    winHeight.scrollIntoView({block:'center'})
}

// 토스트 팝업 스크립트
function toast({title = '', message = '', type = 'info', duration = 3000, btns = ''}) {
    
    if($('#toast-popup').length == 0){
		$(".contents").append('<div id="toast-popup"></div>');
	}
	
    const main = document.getElementById('toast-popup')
    
    if (main) {
        const toast = document.createElement('div')        
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast)
            main.classList.remove('show')
        }, duration + 1000)
        
        toast.onclick = function (e) {
            if (e.target.closest('.toast-close')) {
                main.removeChild(toast)
                clearTimeout(autoRemoveId)
            }
        }       
        
        const delay = (duration / 1000).toFixed(2)
        
        toast.classList.add('toast', `toast-${type}`)
        toast.style.animation = `slideInBottom ease .3s, fadeOut linear 1s ${delay}s forwards`
        
        
        toast.innerHTML = `
            <div class="toast-body">
                <h3 class="toast-title">${title}</h3>
                <div class="toast-msg">${message}</div>
            </div>
            ${btns}             
        `
    main.appendChild(toast)
    main.classList.add('show')
    }
}

// 터치 바텀 시트
function bottomSheet() {
    const bottomSheetCont = $('.sheet')  
    if (bottomSheetCont.length) {
        const $ = document.querySelector.bind(document)
        const openSheetButton = $('.open-sheet')
        const sheet = $('.sheet') 
        const sheetContents = sheet.querySelector('.sheet-contents')
        const draggableArea = sheet.querySelector('.draggable-area')
        var targetSheet = '';
        var $targetSheet = '';
        var targetSheetContents = '';
        var $targetSheetContents = '';
        var targetSheetDrag = '';
        var $targetSheetDrag = '';

        let sheetHeight

        const setSheetHeight = (value) => {
            sheetHeight = Math.max(0, Math.min(100, value))
            targetSheetContents.style.height = `${sheetHeight}vh`
            
            if (sheetHeight === 100) { 
                targetSheetContents.classList.add('fullscreen')
            } else {
                targetSheetContents.classList.remove('fullscreen')
            }
        }

        const setIsSheetShow = (value) => {
            targetSheet.setAttribute('aria-hidden', String(!value))
        }
        
        jQuery('.open-sheet').on('click', function () {
            var openSheetHref = jQuery(this).attr('data-sheet-trigger');
            $targetSheet = jQuery('[data-sheet-target=' + openSheetHref + ']')
            targetSheet = $targetSheet[0];
            $targetSheetContents = $targetSheet.find('.sheet-contents');
            targetSheetContents = $targetSheetContents[0];
            $targetSheetDrag = $targetSheet.find('.draggable-area');
            targetSheetDrag = $targetSheetDrag[0];
            
            
            setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
            setIsSheetShow(true)
            document.body.classList.add('hidden')
            
            targetSheetDrag.addEventListener('mousedown', onDragStart)
            targetSheetDrag.addEventListener('touchstart', onDragStart)

            window.addEventListener('mousemove', onDragMove)
            window.addEventListener('touchmove', onDragMove)

            window.addEventListener('mouseup', onDragEnd)
            window.addEventListener('touchend', onDragEnd)
        })
        
        jQuery('.sheet .dim, .sheet').on('click', function () {
            setIsSheetShow(false)
            document.body.classList.remove('hidden')
        })

        const touchPosition = (event) => 
            event.touches ? event.touches[0] :event
            
        let dragPosition

        const onDragStart = (event) => {
            dragPosition = touchPosition(event).pageY
            $targetSheetContents.addClass('not-selectable')
            draggableArea.style.cursor = document.body.style.cursor = 'grabbing'
        }

        const onDragMove = (event) => {
            if (dragPosition === undefined) return
            
            const y = touchPosition(event).pageY
            const deltaY = dragPosition - y
            const deltaHeight = deltaY / window.innerHeight * 100
            
            setSheetHeight(sheetHeight + deltaHeight)
            dragPosition = y 
        }

        const onDragEnd = () => {
            dragPosition = undefined
            $targetSheetContents.addClass('not-selectable')
            draggableArea.style.cursor = document.body.style.cursor = ''
            
            if (sheetHeight < 25) {
                setIsSheetShow(false)
                document.body.classList.remove('hidden')
            } else if (sheetHeight > 75) {
                setSheetHeight(100)
            } else {
                setSheetHeight(50)
            }
        }

        
    }
}

function autoFrameHeight () {
    $('.terms-import iframe').on('load', function(){
        if(this.contentDocument) {
            $(this).height(this.contentDocument.documentElement.scrollHeight);
        } else {
            $(this).height(this.contentWindow.document.body.scrollHeight);
        }
    })
}

// os체크
function checkOS() {
    var varUA = navigator.userAgent.toLocaleLowerCase();
        
    if(varUA.indexOf('android') > -1){
        document.body.classList.add('aos')
        return 'android';
    } else if(varUA.indexOf('iphone') > -1){
        document.body.classList.add('ios')
        jQuery('.search-wrap input').each(function(){
            jQuery(this).bind('focus', function(){
                jQuery('.full-pop').css({
                    'background-color':'red'
                })
            })
        })
        return 'ios';
    }
}