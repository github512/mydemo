
/*根据屏幕适配font-size*/

// ;(function (doc, win) {
//      var docEl     = doc.documentElement,
//          resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
//          recalc    = function () {
//              var clientWidth = docEl.clientWidth;
//              if (!clientWidth) return;
//              if(clientWidth>=750){
//                  docEl.style.fontSize = '100px';//屏幕大于750，font-size:100px;
//              }else{
//                  docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
//              }
//          };
//          setTimeout(function(){console.log($('header').height());},1);
//      if (!doc.addEventListener) return;
//      win.addEventListener(resizeEvt, recalc, false);
//      doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window);

/*
author  : zhcool;
date    : 2018/5/15;
version : v0.0.3;
*/


;(function($, window, document,undefined) {

    "use strict";

    var Tfn = function() {
        this.header            = $('header'),
        this.center            = $('#wrapper'),
        this.footer            = $('footer'),
        this.author            = 'zhcool',
        this.windowWidth       = ('innerWidth' in window) ? window.innerWidth : document.documentElement.clientWidth,//屏幕宽度
        this.windowHeight      = ('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight,//屏幕高度
        this.IEnum             = null;//如果是ie浏览器，ie的版本数
        this.isAnimating       = false,//判断轮播动画是否进行中
        this.isAnimating1      = false,//判断下拉动画是否进行中
        this.aniTime           = 600,  //动画时间
        this.isPc              = null,//是否为pc端
        this.rowNode           = [],//页面块节点存储
        this.appDirection      = null,//手机端触摸滑动方向
        this.support           = { animations : Modernizr.cssanimations },//是否支持1，animations
        this.animEndEventNames = {
                'WebkitAnimation' : 'webkitAnimationEnd',
                'OAnimation' : 'oAnimationEnd',
                'msAnimation' : 'MSAnimationEnd',
                'animation' : 'animationend'
            },
        this.animEndEventName = this.animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
        this.onEndAnimation    = function( el, callback ) {//动画所属元素，如果不支持animations回调函数。
            var self = this;
            var onEndCallbackFn = function( ev ) {
                if( self.support.animations ) {
                    if( ev.target != this ) return;
                    this.removeEventListener( self.animEndEventName, onEndCallbackFn );
                }
                if( callback && typeof callback === 'function' ) { callback.call(); }
            };
            if( self.support.animations ) {
                el.addEventListener( self.animEndEventName, onEndCallbackFn );
            }
            else {
                onEndCallbackFn();
            }
        };
        /*var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd',
            'transition'       : 'transitionend'
        },
        this.transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ]; //transition结束事件*/
    };
    Tfn.prototype = {
        //初始化
        init  : function() {
            var self = this;
            if (!!window.ActiveXObject || "ActiveXObject" in window){
                $('body').addClass("ie");
                this.IEnum = parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""));
                if(this.IEnum<9){
                    alert("您的浏览器版本过低，请下载IE9及以上版本");return false;
                }else if(this.IEnum==9){
                    $('body').addClass("ie9");
                }else if(this.IEnum==10){
                    $('body').addClass("ie10");
                }else if(this.IEnum==11){
                    $('body').addClass("ie11");
                }
            }
            this.scrolly();
            this.IsPC();
            // this.storage();
            this.contentInit();
            this.appNav();
            this.downMove();
            imagesLoaded(document.querySelectorAll('img'), function () {
                self.picMove();
                self.webGl_picMove();
            });
            // this.picCut();
            this.dialog();
            this.tabBox();
            this.video_setting();
            if(!this.isPc){
                // this.touchMove();
                this.fullMenu();
            }else{
                this.toTop();
            }
        },
        //transform滚动惯性视差（背景滚动视差）
        scrolly:function () {
            var defaults = {
                wrapper: '#scrolly',
                parent_move : true,//容器跟随惯性滚动
                targets : '.scrolly-el',
                bgParallax : false,//背景惯性滚动
                wrapperSpeed: 0.08,
                targetSpeed: 0.02,
                targetPercentage: 0.1
            };
            var requestAnimationFrame =
                window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
            var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
            var extend = function () {
                // Variables
                var extended = {};
                var deep = false;
                var i = 0;
                var length = arguments.length;
                // Merge the object into the extended object
                var merge = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            extended[prop] = obj[prop];
                        }
                    }
                };
                // Loop through each object and conduct a merge
                for ( ; i < length; i++ ) {
                    var obj = arguments[i];
                    merge(obj);
                }

                return extended;

            };
            var scrolly = function(){
                this.Targets = [];
                this.TargetsLength = 0;
                this.wrapper = '';
                this.windowHeight = 0;
                this.wapperOffset = 0;
            };
            scrolly.prototype = {
                isAnimate: false,
                isResize : false,
                scrollId: "",
                resizeId: "",
                init : function(options){
                    this.settings = extend(defaults, options || {});
                    this.wrapper = document.querySelector(this.settings.wrapper);

                    if(this.wrapper==="undefined"){
                        return false;
                    }
                    this.targets = document.querySelectorAll(this.settings.targets);
                    document.body.style.height = this.wrapper.clientHeight + 'px';

                    this.windowHeight = window.clientHeight;
                    this.attachEvent();
                    this.apply(this.targets,this.wrapper);
                    this.animate();
                    this.resize();
                },
                apply : function(targets,wrapper){
                    if(this.settings.parent_move){
                        this.wrapperInit();
                    }
                    this.targetsLength = targets.length;
                    for (var i = 0; i < this.targetsLength; i++) {
                        var attr = {
                            offset : targets[i].getAttribute('data-offset'),
                            speedX : targets[i].getAttribute('data-speed-x'),
                            speedY : targets[i].getAttribute('data-speed-Y'),
                            percentage : targets[i].getAttribute('data-percentage'),
                            horizontal : targets[i].getAttribute('data-v')
                        };
                        this.targetsInit(targets[i],attr);
                    }
                },
                wrapperInit: function(){
                    this.wrapper.style.width = '100%';
                    this.wrapper.style.position = 'fixed';
                },
                targetsInit: function(elm,attr){

                    this.Targets.push({
                        elm : elm,
                        offset : attr.offset ? attr.offset : 0,
                        offsetTop : $(elm).offset().top,
                        hei : $(elm).height(),
                        horizontal : attr.horizontal ? attr.horizontal : 0,
                        top : 0,
                        left : 0,
                        speedX : attr.speedX ? attr.speedX : 1,
                        speedY : attr.speedY ? attr.speedY : 1,
                        percentage :attr.percentage ? attr.percentage : 0
                    });
                },
                scroll : function(){
                    var scrollTopTmp = document.documentElement.scrollTop || document.body.scrollTop;
                    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    var offsetBottom = this.scrollTop + this.windowHeight;
                    if(this.settings.parent_move){
                        this.wrapperUpdate(this.scrollTop);
                    }
                    for (var i = 0; i < this.Targets.length; i++) {
                        this.targetsUpdate(this.Targets[i]);
                    }
                },
                animate : function(){
                    this.scroll();
                    this.scrollId = requestAnimationFrame(this.animate.bind(this));
                },
                wrapperUpdate : function(){

                    this.wapperOffset += (this.scrollTop - this.wapperOffset) * this.settings.wrapperSpeed;
                    this.wrapper.style.transform = 'translate3d(' + 0 + ',' +  Math.round(-this.wapperOffset* 100) / 100 + 'px ,' + 0 + ')';
                },
                targetsUpdate : function(target){
                    var wH = $(window).height();
                    target.offsetTop = $(target.elm).offset().top;
                    target.top += ((this.scrollTop - target.offsetTop + (wH-target.hei)/2) * Number(this.settings.targetSpeed) * Number(target.speedY) - target.top) * this.settings.targetPercentage;
                    target.left += ((this.scrollTop - target.offsetTop + (wH-target.hei)/2) * Number(this.settings.targetSpeed) * Number(target.speedX) - target.left) * this.settings.targetPercentage;
                    var targetOffsetTop = ( parseInt(target.percentage) - target.top - parseInt(target.offset) );
                    var offsetY = Math.round(targetOffsetTop * -100) / 100;
                    var offsetX = 0;
                    if(target.horizontal){
                        var targetOffsetLeft = ( parseInt(target.percentage) - target.left - parseInt(target.offset) );
                        offsetX = Math.round(targetOffsetLeft * -100) / 100;
                    }
                    if(this.settings.bgParallax){
                        if(target.horizontal){
                            $(target.elm).css({backgroundPosition:  offsetX +'px 50%'});
                        }else{
                            $(target.elm).css({backgroundPosition: '50% ' + offsetY + 'px'});
                        }
                    }else{
                        target.elm.style.transform = 'translate3d(' + offsetX + 'px ,' + offsetY + 'px ,' + 0 +')';
                    }
                },
                resize: function(){
                    var self = this;
                    self.windowHeight = (window.innerHeight || document.documentElement.clientHeight || 0);
                    if( parseInt(self.wrapper.clientHeight) != parseInt(document.body.style.height)){
                        document.body.style.height = self.wrapper.clientHeight + 'px';
                    }
                    self.resizeId = requestAnimationFrame(self.resize.bind(self));
                },
                attachEvent : function(){
                    var self = this;
                    window.addEventListener('resize',(function(){
                        if(!self.isResize){
                            cancelAnimationFrame(self.resizeId);
                            cancelAnimationFrame(self.scrollId);
                            self.isResize = true;
                            setTimeout((function(){
                                self.isResize = false;
                                self.resizeId = requestAnimationFrame(self.resize.bind(self));
                                self.scrollId = requestAnimationFrame(self.animate.bind(self));
                            }),200);
                        }
                    }));

                }
            };
            window.scrolly = new scrolly();
            return scrolly;
        },
        //内容层min-height
        contentInit:function(){
            var self      = this,
                minHeight =self.windowHeight - (self.header.height() + self.footer.height());
            self.center.css('min-height',minHeight+'px');
            $('[data-hei]').each(function(index,e){
                var wid=$(this).width(),
                    hei=parseInt(wid*($(this).attr('data-hei')));
                $(this).css('height',hei+"px");
            });
            $("[data-ahref]").on('click',function () {
                var src = $(this).attr('data-ahref');
                var type = $(this).attr('data-target');
                if(type==1){
                    window.open(src);
                }else{
                    window.location.href=src;
                }
            });
        },

        // 浏览器版本
        version:function(){
            var explorer = window.navigator.userAgent ;
            if (explorer.indexOf("MSIE") >= 0||explorer.indexOf("Trident")>0 ) {
                if(explorer.indexOf("MSIE 5")>0||explorer.indexOf("MSIE 6")>0||explorer.indexOf("MSIE 7")>0||explorer.indexOf("MSIE 8")>0) {
                    return 'LowerIEVersion';
                }else{
                    return 'EdgeOrTrident';
                }
            }
            else if (explorer.indexOf("Maxthon") >= 0) {return 'Maxthon';}
            else if (explorer.indexOf("Firefox") >= 0) {return 'FireFox';}
            else if(explorer.indexOf("Chrome") >= 0){ return 'Chrome';}
            else if(explorer.indexOf("Opera") >= 0){ return 'Opera';}
            else if(explorer.indexOf("Safari") >= 0){ return 'Safari';}
        },

        // 网站标识
        uunn:function(){
            if(this.version()!='LowerIEVersion'&&this.version()=="Chrome") {
                console.log('%cUUNN+','display:block;padding: 0 50px;line-height: 76px;background:#f00;color: #fff; font-size: 40px;border-radius: 6px;')
                console.log('Powered by %cUUNN+%c brand creative vanguard.','color:#f00;font-weight: 900;','');
                console.log('Learn more about us \nplease visit %chttp://www.uunn.cn','text-decoration: underline;');
            }
        },

        //对sessionStorage的操作（只有第一次对浏览网站：有loading动画 ）
        storage:function () {
            var self = this,
                loading = $('#loader'),
                stor = JSON.parse(sessionStorage.getItem('key')),
                info ={call:null};//对网站浏览次数存储
            if(stor==null){
                info.call=1;
                self.uunn();
                sessionStorage.setItem('key',JSON.stringify(info));
            }else{
                info.call=stor.call+1;
                sessionStorage.setItem('key',JSON.stringify(info));
                loading.remove();
            }
        },

        //判断是否为pc端
        IsPC:function(){
            var self = this;
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            self.isPc = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { self.isPc = false; break; }
            }
            return self.isPc;
        },

        //页面切换（针对setinterval）
        VisibilityChange:function ( gofn , backfn ) {
            var hiddenProperty = 'hidden' in document ? 'hidden' :
                'webkitHidden' in document ? 'webkitHidden' :
                    'mozHidden' in document ? 'mozHidden' :
                        null;
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            var onVisibilityChange = function(){
                if (!document[hiddenProperty]) {
                    backfn.call();
                }else{
                    gofn.call();
                }
            };
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        },

        //手机菜单动画
        appNav: function(){
            var self     = this,
                appNav   = $('.app-nav'),
                getApp   = appNav.find('.getAppNav'),
                appUl    = appNav.find('ul'),
                appLi    = appUl.find('li'),
                appDown  = appLi.find('.child-nav'),
                appUlWid = appUl.attr('data-width'),
                showAni  = appUl.attr('data-effect'),
                hideAni  = appUl.attr('data-hideAni');
            appUl.css('width',(this.windowWidth*appUlWid)+'px');
            getApp.on('click',function(e){
                if(self.isAnimating1) return false;
                self.isAnimating1 = true;
                var isActive     = $(this).hasClass('menuActive');
                $(this).toggleClass('menuActive');
                if(isActive){
                    appLi.removeClass(showAni).addClass(hideAni);
                    for(var i=0;i<appDown.length;i++){
                        var _this = $(appDown[i]);
                        if(_this.hasClass('on')){
                            _this.removeClass('on');
                        }
                    }
                    setTimeout(function(){
                        appUl.hide();
                        self.isAnimating1 = false;
                    },self.aniTime);
                }else{
                    appLi.removeClass(hideAni).addClass(showAni);
                    appUl.show();
                    setTimeout(function(){
                        self.isAnimating1 = false;
                    },self.aniTime);
                }

            });
            appLi.on('click',function (e) {
               if($(this).hasClass('child-Down')){
                   var nav = $(this).find('.child-nav');
                   for(var i=0;i<appDown.length;i++){
                       var _this = $(appDown[i]);
                       if(_this.hasClass('on')&&!_this.is(nav)){
                           _this.removeClass('on');
                       }
                   }
                   nav.toggleClass('on');
               }
            });
        },

        //单页menu
        fullMenu: function () {
            var self = this,
                menu_bg = $('.fullMenu'),
                ishave = menu_bg.length<=0 ? true : false;
            if(ishave) return false;

            var ShapeOverlays = function (opts) {
                var elm = opts.svg;
                var menu = opts.el;
                var aItem = opts.aItem,
                showAni  = aItem.getAttribute('data-effect'),
                hideAni  = aItem.getAttribute('data-hideAni');
                var aList = $(aItem).find('.menu-list');
                var path = elm.querySelectorAll('path');
                var numPoints = 2;
                var duration = 600;
                var delayPointsArray = [];
                var delayPointsMax = 0;
                var delayPerPath = 200;
                var timeStart = Date.now();
                var isOpened = false;
                var isAnimating = false;
                function toggle() {
                    isAnimating = true;
                    for (var i = 0; i < numPoints; i++) {
                        delayPointsArray[i] = 0;
                    }
                    if (isOpened === false) {
                        open();
                    } else {
                        close();
                    }
                }
                function open() {
                    isOpened = true;
                    elm.classList.add('is-opened');
                    timeStart = Date.now();
                    renderLoop();
                }
                function close() {
                    isOpened = false;
                    elm.classList.remove('is-opened');
                    timeStart = Date.now();
                    renderLoop();
                }
                function updatePath(time) {
                    var points = [];
                    for (var i = 0; i < numPoints; i++) {
                        var thisEase = isOpened ?
                            (i == 1) ? ease.cubicOut : ease.cubicInOut:
                            (i == 1) ? ease.cubicInOut : ease.cubicOut;
                        points[i] = thisEase(Math.min(Math.max(time - delayPointsArray[i], 0) / duration, 1)) * 100
                    }

                    var str = '';
                    str += (isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
                    for (var i = 0; i < numPoints - 1; i++) {
                        var p = (i + 1) / (numPoints - 1) * 100;
                        var cp = p - (1 / (numPoints - 1) * 100) / 2;
                        str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
                    }
                    str += (isOpened) ? `V 0 H 0` : `V 100 H 0`;
                    return str;
                }
                function render() {
                    if (isOpened) {
                        for (var i = 0; i < path.length; i++) {
                            path[i].setAttribute('d', updatePath(Date.now() - (timeStart + delayPerPath * i)));
                        }
                    } else {
                        for (var i = 0; i < path.length; i++) {
                            path[i].setAttribute('d', updatePath(Date.now() - (timeStart +delayPerPath * (path.length - i - 1))));
                        }
                    }
                }
                function renderLoop() {
                    render();
                    if (Date.now() - timeStart < duration + delayPerPath * (path.length - 1) + delayPointsMax) {
                        requestAnimationFrame(
                            function () {
                                renderLoop();
                            }
                        );
                    }
                    else {
                        isAnimating = false;
                    }
                }

                menu.addEventListener('click',function () {
                    if (isAnimating) {
                        return false;
                    }
                    toggle();
                    if (isOpened === true) {
                        menu.classList.add('is-opened-navi');
                        setTimeout(function () {
                            aItem.classList.add('is-opened');
                        },700);
                        aList.removeClass(hideAni).addClass(showAni);
                    } else {
                        menu.classList.remove('is-opened-navi');
                        aList.removeClass(showAni).addClass(hideAni);
                        self.onEndAnimation(aList[aList.length-1],function(){
                            aItem.classList.remove('is-opened');
                        });
                    }
                });
            };

            (function() {
                var elmHamburger = $('.full-menu_m')[0];
                var gNavItems = document.querySelector('.menu-item');
                var elmOverlay = document.querySelector('.shape-overlays');
                new ShapeOverlays({
                    svg : elmOverlay,
                    el :elmHamburger,
                    aItem:gNavItems
                });
            })();
        },

        //下拉动画
        downMove:function(){
            var self     = this,
                downBox  = $('.layout-down'),
                ishave   = downBox.length<=0 ? true : false;
            if(ishave) return false;
            var downEffect = function (opts) {
                var box      = opts.el,
                    txtBox   = box.find('.downTxt'),
                    down     = box.find('ul'),
                    list     = down.find('li'),
                    showAni  = down.attr('data-effect')||'fadeInDown',
                    hideAni  = down.attr('data-hideAni')||'fadeOutDown';
                var ani = box.attr('data-ani') == 'true' ? true : false;
                var isOpen  = function(){
                        console.log("下拉");
                    },//下拉时回调函数
                    isClose = function(){
                        console.log("未下拉");
                    };//未下拉时回调函数
                function downToggle(e){
                    var isActive = box.attr('data-on') == 'true' ? true : false;
                    if( isActive ) {
                        list.removeClass(showAni).addClass(hideAni);
                        self.onEndAnimation(list[0],function(){
                            down.hide();
                            box.attr('data-ani','false');
                        });
                        // callback on close
                        isClose( e );
                    }
                    else {
                        down.show();
                        list.removeClass(hideAni).addClass(showAni);
                        // callback on open
                        isOpen( e );
                        box.attr('data-ani','false');
                    }
                    isActive = !isActive;
                    box.attr('data-on',isActive);
                }
                box.on('click',function () {
                    if(ani) return false;
                    downToggle(down);
                });
                list.on('click',function(){
                    var txt = $(this).html();
                    txtBox.html(txt);
                });
            };
            downBox.each(function () {
               var _this = $(this);
               new downEffect({
                   el : _this
               });
            });
        },


        //图片切割
        picCut:function () {
            var self   = this,
                Tbox   = $( '.picCut' ),
                ishave   = Tbox.length<=0 ? true : false;
            if(ishave) return false;
            var Tpic   = Tbox.find( 'img' ),
                src    = Tpic.attr('src'),
                rang   = Tbox.attr('data-hei'),
                boxMsg = {'width':Tbox.width(),'height':parseInt(Tbox.width()*rang)},
                rowNum = Tbox.attr( 'data-row' ),
                effect = Tbox.attr( 'data-effect' )||'',
                delay  = Tbox.attr( 'data-delay' )||0,
                colNum = Tbox.attr( 'data-col' );
            var mwid   = boxMsg.width/colNum,
                mhei   = boxMsg.height/rowNum;
            var cut    = null,
                Time   = 0.0;
                cutItem= Tbox.find('.cutItem');
            cutItem.show();
            for(var i  = 0;i<rowNum;i++){
                Time +=parseFloat(delay);
                for(var n = 0;n<colNum;n++){
                    Time +=parseFloat(delay);
                    str    = '<div class="cut animated '+effect+'" style="animation-delay:'+Time+'s;width: '+mwid+'px;height:'+mhei+'px;top:'+mhei*i+'px;left:'+mwid*n+'px;"><img style="width: '+boxMsg.width+'px;height:'+boxMsg.height+'px;top:-'+mhei*i+'px;left:-'+mwid*n+'px;"  src="'+src+'"></div>';
                    Tbox.find('.cutItem').append(str);
                }
            }
            Time = (Time+0.6)*1000;
            setTimeout(function(){
                Tpic.show();
                cutItem.hide();
            },Time);
        },

        //单张图片切换动画(.Tpage,.moveNext,.movePrev);
        picMove:function(){
            var self = this,
                picBox = $('.component'),
                ishave = picBox.length<=0 ? true : false;
            if(ishave) return false;
            var moveEffect = function (opts) {
                var animEndEventNames = {
                        'WebkitAnimation' : 'webkitAnimationEnd',
                        'OAnimation' : 'oAnimationEnd',
                        'msAnimation' : 'MSAnimationEnd',
                        'animation' : 'animationend'
                    },
                    // animation end event name
                    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
                    component        = opts.parent || console.warn("no parent"),
                    navNext          = component.querySelector( '.moveNext' ),
                    navPrev          = component.querySelector( '.movePrev' ),
                    pageChange       = component.querySelector( '.pageChange' ),//可选择页数
                    timer            = null,
                    loop             = opts.loop == 'true' ? true :false,
                    loopTime         = opts.loopTime || 6000;//轮播间隔时间
                function reinit(_this,dir) {
                    var items            = component.querySelector( 'ul.itemwrap' ).querySelectorAll('li'),//图片项
                        itemsCount       = items.length,
                        Tpage            = $(component.querySelector( '.Tpage' )),
                        current          = parseInt(Tpage.attr( 'data-num' )),
                        TpageChange      = component.querySelectorAll( '[data-change]' ),
                        ani              = component.getAttribute('data-ani') == 'true' ? true : false,
                        itemTxt          = component.querySelectorAll( '[data-txt]');
                    clearTimeout(timer);
                    if(dir === 'num'){
                        var Tnum   = _this.attr('data-change');
                    }
                    navigate( dir , Tnum , ani , component,items,itemsCount,Tpage,current,TpageChange,itemTxt);
                }
                function goloop() {
                    if(loop){
                        timer=setTimeout(function () {
                            reinit($(component),'next');
                        },loopTime);
                    }
                }
                function navigate( dir , num , Tani, component, items, itemsCount, Tpage, current, TpageChange, itemTxt) {
                    if( Tani ) return false;
                    component.setAttribute('data-ani','true');
                    clearInterval(loop);
                    var cntAnims = 0;
                    var currentItem = items[ current ];
                    var currentTxt  = $(itemTxt).eq(current);
                    if( dir === 'next' ) {
                        current = current < itemsCount - 1 ? current + 1 : 0;
                    }
                    else if( dir === 'prev' ) {
                        current = current > 0 ? current - 1 : itemsCount - 1;
                    }
                    else if( dir === 'num'){
                        current = parseInt(num);
                    }
                    Tpage.html('0'+(current+1)).attr('data-num',current);
                    $(TpageChange).eq(current).addClass('on').siblings().removeClass('on');
                    var nextItem = items[ current ];
                    var nextTxt  = $(itemTxt).eq(current);
                    var onEndAnimationCurrentItem = function() {
                        this.removeEventListener( animEndEventName, onEndAnimationCurrentItem );
                        classie.removeClass( this, 'current' );
                        currentTxt.removeClass('on txtHide');
                        classie.removeClass( this, dir === 'prev' ? 'navOutPrev' : 'navOutNext' );
                        ++cntAnims;
                        if( cntAnims === 2 ) {
                            component.setAttribute('data-ani','false');
                            goloop();
                        }
                    };

                    var onEndAnimationNextItem = function() {
                        this.removeEventListener( animEndEventName, onEndAnimationNextItem );
                        classie.addClass( this, 'current' );
                        nextTxt.addClass('on').removeClass('txtShow');
                        classie.removeClass( this, dir === 'prev' ? 'navInPrev' : 'navInNext' );
                        ++cntAnims;
                        if( cntAnims === 2 ) {
                            component.setAttribute('data-ani','false');
                            goloop();
                        }
                    };

                    if( self.support.animations ) {
                        currentItem.addEventListener( animEndEventName, onEndAnimationCurrentItem );
                        nextItem.addEventListener( animEndEventName, onEndAnimationNextItem );
                        classie.addClass( currentItem, dir === 'prev' ? 'navOutPrev' : 'navOutNext' );
                        classie.addClass( nextItem, dir === 'prev' ? 'navInPrev' : 'navInNext' );
                        currentTxt.addClass('txtHide');
                        nextTxt.addClass('txtShow');
                    }
                    else {
                        console.log('不支持css3 animated');
                        $(currentItem).hide();
                        $(nextItem).fadeIn(200);
                        setTimeout(function(){
                            classie.removeClass( currentItem, 'current' );
                            classie.addClass( nextItem, 'current' );
                            component.setAttribute('data-ani','false');
                        },200)
                    }
                }
                navNext.addEventListener( 'click', function( ev ) {
                    reinit($(this),'next');
                    ev.preventDefault();
                } );
                navPrev.addEventListener( 'click', function( ev ) {
                    reinit($(this),'prev');
                    ev.preventDefault();
                } );
                var list = pageChange.querySelectorAll( '[data-change]' );
                for(var h=0;h<list.length;h++){
                    list[h].addEventListener( 'click', function( ev ) {
                        var Tcurrent  =parseInt($(component).find('.Tpage').attr('data-num'));
                        if(this.getAttribute('data-change')!=Tcurrent){
                            reinit($(this),'num');
                        }
                        ev.preventDefault();
                    } );
                }
                goloop();
            };
            picBox.each(function () {
                var el = $(this)[0];
                new moveEffect({
                    parent: el,
                    loop:el.getAttribute('data-loop'),
                    loopTime:el.getAttribute('data-loopTime')
                });
            });
        },

        //单张图片切换动画(基于ThreeJS,不支持ie)
        webGl_picMove:function () {
            var self = this,
                picBox = $('.webGL-slider'),
                ishave = picBox.length<=0 ? true : false;
            if(ishave) return false;
            var webGlEffect = function(opts) {
                var pix={};
                var timer = null;
                var right= {
                    vertex: '\n        varying vec2 vUv;\n  void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
                    fragment : '\nvarying vec2 vUv;\nuniform sampler2D texture;uniform sampler2D texture2;uniform sampler2D disp;uniform float dispFactor;uniform float effectFactor;void main() {vec2 uv = vUv;vec4 disp = texture2D(disp, uv);vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);vec4 _texture = texture2D(texture, distortedPosition);vec4 _texture2 = texture2D(texture2, distortedPosition2);vec4 finalTexture = mix(_texture, _texture2, dispFactor);gl_FragColor = finalTexture;}'
                };
                var left= {
                    vertex: '\n        varying vec2 vUv;\n  void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
                    fragment : '\nvarying vec2 vUv;\nuniform sampler2D texture;uniform sampler2D texture2;uniform sampler2D disp;uniform float dispFactor;uniform float effectFactor;void main() {vec2 uv = vUv;vec4 disp = texture2D(disp, uv);vec2 distortedPosition = vec2(uv.x - dispFactor * (disp.r*effectFactor), uv.y);vec2 distortedPosition2 = vec2(uv.x + (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);vec4 _texture = texture2D(texture, distortedPosition);vec4 _texture2 = texture2D(texture2, distortedPosition2);vec4 finalTexture = mix(_texture, _texture2, dispFactor);gl_FragColor = finalTexture;}'
                };
                var up= {
                    vertex: '\n        varying vec2 vUv;\n  void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
                    fragment : '\nvarying vec2 vUv;\nuniform sampler2D texture;uniform sampler2D texture2;uniform sampler2D disp;uniform float dispFactor;uniform float effectFactor;void main() {vec2 uv = vUv;vec4 disp = texture2D(disp, uv);vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r*effectFactor));vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - dispFactor) * (disp.r*effectFactor));vec4 _texture = texture2D(texture, distortedPosition);vec4 _texture2 = texture2D(texture2, distortedPosition2);vec4 finalTexture = mix(_texture, _texture2, dispFactor);gl_FragColor = finalTexture;}'
                };
                var down= {
                    vertex: '\n        varying vec2 vUv;\n  void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
                    fragment : '\nvarying vec2 vUv;\nuniform sampler2D texture;uniform sampler2D texture2;uniform sampler2D disp;uniform float dispFactor;uniform float effectFactor;void main() {vec2 uv = vUv;vec4 disp = texture2D(disp, uv);vec2 distortedPosition = vec2(uv.x, uv.y - dispFactor * (disp.r*effectFactor));vec2 distortedPosition2 = vec2(uv.x, uv.y + (1.0 - dispFactor) * (disp.r*effectFactor));vec4 _texture = texture2D(texture, distortedPosition);vec4 _texture2 = texture2D(texture2, distortedPosition2);vec4 finalTexture = mix(_texture, _texture2, dispFactor);gl_FragColor = finalTexture;}'
                };
                var parent = opts.parent || console.warn("no parent");
                var dispImage = opts.displacementImage || 'dist/img/displacement/1.jpg';
                var images = opts.images,
                    image = void 0,
                    sliderImages = [];
                var prev = $(parent).find('.move-prev');
                var next = $(parent).find('.move-next');
                var intensity = opts.intensity || 1;
                var direction = opts.direction || 'right';
                var loop      = opts.loop == 'true' ? true :false;
                var loopTime  = opts.loopTime || 6000;
                switch(direction)
                {
                    case 'right':
                        pix = right;
                        break;
                    case 'left':
                        pix = left;
                        break;
                    case 'up':
                        pix = up;
                        break;
                    case 'down':
                        pix = down;
                        break;
                }
                var easing = opts.easing || Expo.easeOut;
                var canvasWidth = images[0].clientWidth;
                var canvasHeight = images[0].clientHeight;
                var renderWidth = parent.offsetWidth;
                var renderHeight = parent.offsetHeight;
                var renderW = void 0,
                    renderH = void 0;

                if (renderWidth > canvasWidth) {
                    renderW = renderWidth;
                } else {
                    renderW = canvasWidth;
                }
                renderH = canvasHeight;
                var renderer = new THREE.WebGLRenderer({
                    antialias: false
                });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setClearColor(0x23272A, 1.0);
                renderer.setSize(renderW, renderH);
                parent.appendChild(renderer.domElement);
                if (renderHeight > canvasHeight) {
                    $(renderer.domElement).css('transform','scale('+(renderHeight/canvasHeight)+')');
                }
                var loader = new THREE.TextureLoader();
                loader.crossOrigin = "";
                images.forEach(function (img) {
                    image = loader.load(img.getAttribute('src'));
                    image.magFilter = image.minFilter = THREE.LinearFilter;
                    image.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    sliderImages.push(image);
                });
                var length = sliderImages.length;
                var disp = loader.load(dispImage);
                disp.wrapS = disp.wrapT = THREE.RepeatWrapping;
                var scene = new THREE.Scene();
                scene.background = new THREE.Color(0x23272A);
                var camera = new THREE.OrthographicCamera(renderWidth / -2, renderWidth / 2, renderHeight / 2, renderHeight / -2, 1, 1000);
                camera.position.z = 1;
                var mat = new THREE.ShaderMaterial({
                    uniforms: {
                        effectFactor: { type: "f", value: intensity },
                        dispFactor: { type: "f", value: 0.0 },
                        texture: { type: "t", value: sliderImages[0] },
                        texture2: { type: "t", value: sliderImages[1] },
                        disp: { type: "t", value: disp }
                    },
                    vertexShader: pix.vertex,
                    fragmentShader: pix.fragment,
                    transparent: true,
                    opacity: 1.0
                });
                var geometry = new THREE.PlaneBufferGeometry(parent.offsetWidth, parent.offsetHeight, 1);
                var object = new THREE.Mesh(geometry, mat);
                object.position.set(0, 0, 0);
                scene.add(object);
                var addEvents = function addEvents() {
                    var pagButtons = Array.from(parent.querySelector('.pagination').querySelectorAll('a'));
                    pagButtons.forEach(function (el) {
                        el.addEventListener('click', function () {
                            var ani = parent.getAttribute('data-ani') == 'false' ? false : true;
                            if (!ani) {
                                parent.setAttribute('data-ani','true');
                                $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).removeClass('on');
                                $(this).prevAll('a').addClass('lat2');
                                $(this).addClass('on').removeClass('lat2');
                                $(this).nextAll('a').removeClass('lat2');
                                $(this).nextAll('a').removeClass('on');
                                var slideId = parseInt(this.dataset.slide, 10);
                                $(parent.querySelector('.txt-item').querySelectorAll('li')).fadeOut(300);
                                $(parent.querySelector('.txt-item').querySelectorAll('li')).eq(slideId).fadeIn(1200);
                                change(slideId);
                            }
                        });
                    });
                };
                next.on('click',function () {
                    var ani = parent.getAttribute('data-ani') == 'false' ? false : true;
                    if (!ani) {
                        parent.setAttribute('data-ani','true');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).removeClass('on');
                        var slideId = parseInt(parent.getAttribute('data-cur')) || 0;
                        slideId = slideId < length-1 ? slideId + 1 : 0;
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).prevAll('a').addClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).addClass('on').removeClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).nextAll('a').removeClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).nextAll('a').removeClass('on');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).addClass('on');
                        $(parent.querySelector('.txt-item').querySelectorAll('li')).fadeOut(300);
                        $(parent.querySelector('.txt-item').querySelectorAll('li')).eq(slideId).fadeIn(800);
                        change(slideId);
                    }
                });
                prev.on('click',function () {
                    var ani = parent.getAttribute('data-ani') == 'false' ? false : true;
                    if (!ani) {
                        parent.setAttribute('data-ani','true');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).removeClass('on');
                        var slideId = parseInt(parent.getAttribute('data-cur')) || 0;
                        slideId = slideId > 0 ? slideId - 1 : length-1;
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).prevAll('a').addClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).addClass('on').removeClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).nextAll('a').removeClass('lat2');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).nextAll('a').removeClass('on');
                        $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).addClass('on');
                        $(parent.querySelector('.txt-item').querySelectorAll('li')).fadeOut(300);
                        $(parent.querySelector('.txt-item').querySelectorAll('li')).eq(slideId).fadeIn(800);
                        change(slideId);
                    }
                });
                function change(num) {
                    clearTimeout(timer);
                    mat.uniforms.texture2.value = sliderImages[num];
                    mat.uniforms.texture2.needsUpdate = true;
                    TweenLite.to(mat.uniforms.dispFactor, 1, {
                        value: 1,
                        ease: easing,
                        onComplete: function onComplete() {
                            mat.uniforms.texture.value = sliderImages[num];
                            mat.uniforms.texture.needsUpdate = true;
                            mat.uniforms.dispFactor.value = 0.0;
                            self.isAnimating2 = false;
                            parent.setAttribute('data-cur',num);
                            parent.setAttribute('data-ani','false');
                            myloop();
                        }
                    });
                }
                addEvents();
                setTimeout(function () {
                    $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(0).addClass('on');
                },100)
                function myloop(){
                    if(loop){
                        timer = setTimeout(function () {
                            var ani = parent.getAttribute('data-ani') == 'false' ? false : true;
                            if (!ani) {
                                parent.setAttribute('data-ani','true');
                                var slideId = parseInt(parent.getAttribute('data-cur')) || 0;
                                slideId = slideId < length-1 ? slideId + 1 : 0;
                                change(slideId);
                                if(slideId==0){
                                    $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).removeClass('on');
                                    $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).removeClass('lat2');
                                }
                                setTimeout(function () {
                                    $(parent.querySelector('.pagination').querySelectorAll('[data-slide]')).eq(slideId).addClass('on');
                                },20);
                                $(parent.querySelector('.txt-item').querySelectorAll('li')).fadeOut(300);
                                $(parent.querySelector('.txt-item').querySelectorAll('li')).eq(slideId).fadeIn(1200);
                            }
                        },loopTime);
                    }
                }
                window.addEventListener('resize', function (e) {
                    renderer.setSize(renderW, renderH);
                });
                var animate = function animate() {
                    requestAnimationFrame(animate);
                    renderer.render(scene, camera);
                };
                animate();
                myloop();
            };
            picBox.each(function () {
                var el = $(this)[0];
                var imgs = Array.from(el.querySelectorAll('.img-list'));
                new webGlEffect({
                    parent: el,
                    intensity: el.getAttribute('data-intensity') || undefined,
                    easing: el.getAttribute('data-easing') || undefined,
                    images: imgs,
                    direction:el.getAttribute('data-direction'),
                    displacementImage: el.getAttribute('data-displacement'),
                    loop:el.getAttribute('data-loop'),
                    loopTime:el.getAttribute('data-loopTime')
                });
            });
        },

        //弹窗
        dialog:function(){
            var self          = this,
                have       = $('[data-dialog]'),
                ishave        = have.length<=0 ? true : false;
            if(ishave) return false;
            var dialogEffect = function (opts) {
                var parent = opts.el;
                var dialog = opts.dialog,
                    closeBtn = dialog.find('[data-dialog-close]'),
                    mask     = dialog.find( '.dialog_mask' ),
                    video    = dialog.find('video'),
                    morphEl = dialog.find('.morph-shape');
                if(morphEl.length>0){
                    var path = morphEl[0].querySelector('path'),
                        steps = {
                            open : morphEl[0].getAttribute( 'data-morph-open' ),
                            close : morphEl[0].getAttribute( 'data-morph-close' )
                        };
                }
                var onOpenDialog  = function(){
                    console.log("弹窗打开");
                    var url = parent.attr('data-src');
                    if(morphEl.length>0){
                        anime({
                            targets: path,
                            duration: 400,
                            easing: 'linear',
                            d: steps.open,
                            complete: function() {}
                        });
                    }
                    if(video.length>0){
                        video.attr('src',url);
                        video[0].currentTime=5;
                        video[0].play();
                    }
                };//弹窗打开时回调函数
                var onCloseDialog = function(){
                    console.log("弹窗关闭");
                    if(morphEl.length>0){
                        anime({
                            targets: path,
                            duration: 400,
                            easing: 'linear',
                            d: steps.close,
                            complete: function() {}
                        });
                    }
                    if(video.length>0){
                        video[0].pause();
                    }

                };//弹窗关闭时回调函数
                function dialogToggle(e,isOpen){
                    if( isOpen ) {
                        classie.remove( e, 'dialog--open' );
                        classie.add( e, 'dialog--close' );
                        self.onEndAnimation(e.querySelector( '.dialog_content' ),function(){
                            classie.remove( e, 'dialog--close' );
                            onCloseDialog( );
                        });
                    }
                    else {
                        classie.add( e, 'dialog--open' );
                        // callback on open
                        onOpenDialog( this );
                    }
                    isOpen = !isOpen;
                    e.setAttribute('data-isOpen',isOpen);
                }
                parent.on("click",function () {
                    var isOpen  = dialog.attr('data-isOpen') == 'true' ? true : false;
                    var isclick = dialog.attr('data-isclick');
                    dialogToggle(dialog[0],isOpen);
                    if(isclick == undefined){
                        closeBtn.on('click',function () {
                            dialogToggle(dialog[0],true);
                        });
                        mask.on('click',function () {
                            dialogToggle(dialog[0],true);
                        });
                        dialog.attr('data-isclick','true');
                    }
                });
            };
            have.each(function () {
                var _this = $(this),
                    _dialog = $('#'+_this.attr('data-dialog'));
                new dialogEffect({
                    el:_this,
                    dialog : _dialog
                });
            });
        },

        //tab选项
        tabBox:function () {
            var self   = this,
                Tbox   = $( '.layout-tabBox' ),
                ishave = Tbox.length<=0 ? true : false;
            if(ishave) return false;
            var partItem = Tbox.find('.layout-part'),
                partName = null,
                partChoose = partItem.find('li');
            partChoose.on('click',function (e) {
                partName = $(this).parents('.layout-part').attr('data-part');
                var _this = $(this),
                    item  = $('.'+partName),
                    list  = _this.attr('data-list');
                for(var i=0;i<item.length;i++){
                    var cur = $(item[i]);
                    cur.hide();
                    if(cur.hasClass(list)){
                        cur.show();
                    }
                }
            });
        },

        touchMove:function (el) {
            var self  = this;
            var move = {};
            el.on('touchstart',function(e){
                //获取接触屏幕时的X和Y
                move.endX = 0;
                move.endY = 0;
                move.startX = e.originalEvent.changedTouches[0].pageX;
                move.startY = e.originalEvent.changedTouches[0].pageY;
            });
            el.on('touchmove',function(e) {
                //获取滑动屏幕时的X,Y
                move.endX = e.originalEvent.changedTouches[0].pageX;
                move.endY = e.originalEvent.changedTouches[0].pageY;
            });
            el.on('touchend',function(e) {
                //获取滑动屏幕时的X,Y
                if(move.endX ==0 || move.endY ==0){
                    var distanceX = 0;
                    var distanceY = 0;
                }else{
                    var distanceX = move.endX - move.startX;
                    var distanceY = move.endY - move.startY;
                }
                if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 50) {
                    self.appDirection='left';
                }
                else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < (-50)) {
                    self.appDirection='right';
                }
                else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 50) {
                    self.appDirection='up';
                }
                else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < (-50)) {
                    self.appDirection='down';
                }
            });
        },

        //回到顶部
        toTop:function () {
            var self      = this;
            var top_btn   = $('.toTop'),
                isHave = top_btn.length <= 0 ? true : false;
            if(isHave) return false;
            top_btn.on('click',function () {
                $("html,body").animate({scrollTop:0}, 600);
            });
            $(window).scroll(function(){
                if($(this).scrollTop()>(self.windowWidth/4)){
                    top_btn.addClass('on');
                }else{
                    top_btn.removeClass('on');
                }
            });
        },

        //视频播放
        video_setting:function () {
            var self = this,
                Tplay = $('[data-play]'),
                ishave = Tplay.length<=0 ? true : false;
            if(ishave) return false;
            var medio  = null,
                isplay = null;
            Tplay.on('click',function () {
                var _this = $(this);
                medio = $('#'+$(this).attr('data-play'));
                isplay = $(this).hasClass('on') ? true : false;
                if(isplay){
                    medio[0].pause();
                }else{
                    medio[0].play();
                }
                _this.toggleClass('on');
                medio.one('click',function () {
                    isplay = _this.hasClass('on') ? true : false;
                    console.log(isplay);
                    if(isplay){
                        $(this)[0].pause();
                    }else{
                        $(this)[0].play();
                    }
                    _this.toggleClass('on');
                });
            });
        },

        //页面节点相互监听
        nodeName:function () {
            var self = this,
                node = $('.nodeItem'),
                ishave = node.length<=0 ? true : false;
            if(ishave) return false;
            var name = $('.rowName');
            for(var n=0;n<name.length;n++){
                var row = {};
                var _this = name[n];
                row.id = $(_this).parents('.row').attr('id');
                row.top = $(_this).offset().top - (data.win_h/2);
                self.rowNode.push(row);
            }
            nodeChange();
            function nodeChange(){
                var top = $(document).scrollTop();
                if(top>400){
                    node.addClass('on');
                }else{
                    node.removeClass('on');
                }
                for(var i=self.rowNode.length-1;i>=0;i--){
                    var _this = self.rowNode[i];
                    if(top>=_this.top){
                        $('.nodeItem > a').eq(i).addClass('on').siblings().removeClass('on');
                        break;
                    }
                }
            }
            $(window).scroll(function () {
                nodeChange();
            });
        }

    };

    $.fn.myFn = function() {
        new Tfn().init();
    };
})(jQuery, window, document);

$(document).myFn();

//input[type=range]

$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        $input.css( 'background-size', this.value + '% 100%' );

        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};



