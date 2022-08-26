$(function(){
    favoriteBtn();
    clearBtn();
    tabs();
    fixedBg();
    fixedCont();
    popupFunc();
    accordion();
    accordion2();
    bottomSheet();
    listDrag();
})
// 이벤트 배너
$(document).ready(function() {
    var swiper = new Swiper('.banner-slider', {
        slidesPerView: 'auto',
        spaceBetween: 8,
        centeredSlides: true
    });
});

// 카테고리 배너
$(document).ready(function() {
    var swiper = new Swiper('.category-slider', {
        slidesPerView: 'auto',
        spaceBetween: 8,
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
    $('.select .btn-round, .select-form li').on('click', function() {
        $(this).siblings().removeClass('on');
        $(this).addClass('on');
    });
});

$(function(){
    var fixButton = $('.wrap-btn-sticky');
    var elHeight = $('.notice-section').outerHeight();
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

$(function(){
    var blurTitle = $('.header-title-left.blur');
    var hederHeight = $('header').outerHeight() - 30;
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var val = hederHeight;
        if  (scroll >= val) {
            blurTitle.fadeIn();
        }else {
            blurTitle.fadeOut();
        }
    });
});


// 관심종목 등록
function favoriteBtn () {
    $('.favorite button').on('click', function() {
        $(this).toggleClass('on');
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

// 공지사항 있을때 버튼 배경색 바뀜
function fixedBg () {
    var fixButton = $('.wrap-btn-sticky');
    var elHeight = $('.notice-section').outerHeight();
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var val = $(document).height() - $(window).height() - elHeight;
        if  (scroll >= val) {
            fixButton.addClass('bg-gray2');
        }else {
            fixButton.removeClass('bg-gray2');
        }
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

function accordion2 () {
    var parent = $('.accordion2>li'); 
    $('.accordion2>li .btn-link').on('click', function() {
        $(this).parents('li').siblings().removeClass('on');
        $(this).parents('li').addClass('on');
    });
}


//레이어 팝업
function popupFunc () {
    var openFunc = $('[data-layer-href]');
    openFunc.on('click', function(){
        var layerHref = $(this).attr('data-layer-href');
        $('[' + layerHref + ']').addClass('popup-open');
        $('[' + layerHref + ']').attr('tabindex',0).focus();
        $('body').addClass('hidden');
        return false;
    })
    
    var closeFunc = $('[data-layer-close], .dim');
    closeFunc.on('click', function(){
        $(this).closest('.layer-pop, .full-pop').removeClass('popup-open');
        $(this).closest('.layer-pop, .full-pop').removeAttr('tabindex');
        $('body').removeClass('hidden');
    })
}

// 토스트 팝업 스크립트
function toast({title = '', message = '', type = 'info', duration = 3000, btns = ''}) {
    const main = document.getElementById('toast-popup')
    if (main) {
        const toast = document.createElement('div')        
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast)
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
    }
}


// 터치 바텀 시트
function bottomSheet() {
    var elNameExists = !!document.getElementsByClassName('sheet');
    if (elNameExists.length) {
        const $ = document.querySelector.bind(document)
        const openSheetButton = $('.open-sheet')
        const sheet = $('.sheet') 
        const sheetContents = sheet.querySelector('.sheet-contents')
        const draggableArea = sheet.querySelector('.draggable-area')

        let sheetHeight

        const setSheetHeight = (value) => {
            sheetHeight = Math.max(0, Math.min(100, value))
            sheetContents.style.height = `${sheetHeight}vh`
            
            if (sheetHeight === 100) { 
                sheetContents.classList.add('fullscreen')
            } else {
                sheetContents.classList.remove('fullscreen')
            }
        }

        const setIsSheetShow = (value) => {
            sheet.setAttribute('aria-hidden', String(!value))
        }

        openSheetButton.addEventListener('click', () => {
            setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
            setIsSheetShow(true)
            document.body.classList.add('hidden')
        })

        sheet.querySelector('.dim').addEventListener('click', () => {
            setIsSheetShow(false)
            document.body.classList.remove('hidden')
        })

        const touchPosition = (event) => 
            event.touches ? event.touches[0] : event
            
        let dragPosition

        const onDragStart = (event) => {
            dragPosition = touchPosition(event).pageY
            sheetContents.classList.add('not-selectable')
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
            sheetContents.classList.remove('not-selectable')
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

        draggableArea.addEventListener('mousedown', onDragStart)
        draggableArea.addEventListener('touchstart', onDragStart)

        window.addEventListener('mousemove', onDragMove)
        window.addEventListener('touchmove', onDragMove)

        window.addEventListener('mouseup', onDragEnd)
        window.addEventListener('touchend', onDragEnd)
    }
}


// 리스트 드래그
function listDrag() {
    const list = document.querySelector('.list-stock')
    const listItem = document.querySelectorAll('.list-item')
    const listHidden = document.querySelector('.list-hidden')
    
    const getMouseOffset = (evt) => {
        const targetRect = evt.target.getBoundingClientRect()
        const offset = {
            x: evt.pageX - targetRect.left,
            y: evt.pageY - targetRect.top
        }
        return offset
    }
    
    const getElementVerticalCenter = (el) => {
        const rect = el.getBoundingClientRect()
        return (rect.bottom - rect.top) / 2
    }
    
    const appendPlacehoder = (evt, idx) => {
        evt.preventDefault()
        if (idx === dragIndex) {
            return
        }
        
        const offset = getMouseOffset(evt)
        const middelY = getElementVerticalCenter(evt.target)
        const placeholder = list.children[dragIndex]
        
        if (offset.y > middelY) {
            list.insertBefore(evt.target, placeholder)
        } else if (list.children[idx + 1]) {
            list.insertBefore(evt.target.nextSibling || evt.target, placeholder)
        }
        return
    }
    
    function sortable(rootEl, onUpdate) {
        var dragEl;
        
        [].slice.call(rootEl.children).forEach(function (itemEl) {
            itemEl.draggable = true;
        });
        
        function _onDragOver(evt) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'name';
            
            var target = evt.target;
            if (target && target !== dragEl && target.nodeName == 'DIV') {
                
                const offset = getMouseOffset(evt)
                const middelY = getElementVerticalCenter(evt.target)
                
                if (offset.y > middelY) {
                    rootEl.insertBefore(dragEl, target.nextSibling)
                } else {
                    rootEl.insertBefore(dragEl, target)
                }
            }
        }
        
        function _onDragEnd(evt) {
            evt.preventDefault();
            
            dragEl.classList.remove('ghost');
            rootEl.removeEventListener('dragover', _onDragOver, false);
            rootEl.removeEventListener('dragend', _onDragEnd, false);
            
            onUpdate(dragEl);
        }
        
        rootEl.addEventListener('dragStart', function (evt) {
            dragEl = evt.target;
            
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('Text', dragEl.textContent);
            
            rootEl.addEventListener('dragover', _onDragOver, false);
            rootEl.addEventListener('dragend', _onDragEnd, false);
            
            setTimeout(function () {
                dragEl.classList.add('ghost');
            }, 0)
        }, false);
    }
    
    sortable(list, function (item) {
        console.log(item);
    })
}