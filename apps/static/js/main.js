
var alan = (function(document, undefined) {
    var readyRE = /complete|loaded|interactive/;
    var idSelectorRE = /^#([\w-]+)$/;
    var classSelectorRE = /^\.([\w-]+)$/;
    var tagSelectorRE = /^[\w-]+$/;
    var translateRE = /translate(?:3d)?\((.+?)\)/;
    var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

    var $ = function(selector, context) {
        context = context || document;
        if (!selector)
            return wrap();
        if (typeof selector === 'object')
            if ($.isArrayLike(selector)) {
                return wrap($.slice.call(selector), null);
            } else {
                return wrap([selector], null);
            }
        if (typeof selector === 'function')
            return $.ready(selector);
        if (typeof selector === 'string') {
            try {
                selector = selector.trim();
                if (idSelectorRE.test(selector)) {
                    var found = document.getElementById(RegExp.$1);
                    return wrap(found ? [found] : []);
                }
                return wrap($.qsa(selector, context), selector);
            } catch (e) {}
        }
        return wrap();
    };

    var wrap = function(dom, selector) {
        dom = dom || [];
        Object.setPrototypeOf(dom, $.fn);
        dom.selector = selector || '';
        return dom;
    };

    /**
     * querySelectorAll
     * @param {type} selector
     * @param {type} context
     * @returns {Array}
     */
    $.qsa = function(selector, context) {
        context = context || document;
        return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    };


    $.uuid = 0;

    $.data = {};

    $.insertAfter = function(elem,tarElem){
        var parent = tarElem.parentNode;
        if (parent.lastChlid == tarElem) {
            parent.appendChild(elem);
        }else{
            parent.insertBefore(elem,tarElem.nextSibling);
        }
    };

    // 查找兄弟元素
    $.getSiblings = function(o){
        var a = [];
        var p = o.previousSibling;
        while(p){
            if(p.nodeType === 1){
                a.push(p);
            }
            p = p.previousSibling;
        }
        a.reverse();

        var n = o.nextSibling;
        while(n){
            if(n.nodeType === 1){
                a.push(n);
            }
            n = n.nextSibling;
        }
        return a;
    };

    $.toggleClass = function( elem, c ) {
        if(elem.classList.contains(c)){
            elem.classList.remove(c);
        }else{
            elem.classList.add(c);
        }
    };

    /* 移动端点击事件模拟PC端hover事件
    * class1,选择匹配的元素
    * class2,匹配元素里的a元素，阻止它跳转
    * */
    $.touchToHover = function (class1,class2) {

        [].slice.call(document.querySelectorAll(class1)).forEach( function( el) {
            el.querySelector(class2).addEventListener( 'touchstart', function(e) {
                console.log(this);
                //e.stopPropagation();
                e.preventDefault();
            }, false );
            el.addEventListener( 'touchstart', function(e) {
                $.toggleClass( this, 'cs-hover' );
            }, false );
        });
    };

    $.getStyle = function(elem,attr){
        return elem.currentStyle ? elem.currentStyle[attr] : window.getComputedStyle(elem,false)[attr];
    };

    $.getElemPosition = function(elem){
        var oPositon = elem.getBoundingClientRect();
        return {
            top:oPositon.top,
            bottom:oPositon.bottom,
            left:oPositon.left,
            right:oPositon.right,
        };
    };

    $.Event = {
        on:function(elem,type,handler){
            if (elem.addEventListener) {
                elem.addEventListener(type,handler,false);
            }else if(elem.attachEvent){
                elem.attachEvent('on'+type,handler);
            }else{
                elem['on'+type] = handler;
            }
        },
        off:function(elem,type,handler){
            if (elem.removeEventListener) {
                elem.removeEventListener(type,handler,false);
            }else if (elem.detachEvent) {
                elem.detachEvent('on'+type,handler);
            }else{
                elem['on'+type] = null;
            }
        },
        getEvent:function(event){ //将它放在事件处理程序的开头，可以确保获取事件。
            return event ? event : window.event;
        },
        getTarget:function(event){ //目标元素
            return event.target || event.srcElement;
        },
        preventDefault:function(event){ //取消默认
            if (event.preventDefault) {
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        },
        stopPropagation:function(event){ //阻止冒泡
            if (event.stopPropagation) {
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        },
        getRelatedTarget:function(event){//获得相关元素
            if (event.relatedTarget) {
                return event.relatedTarget;
            }else if (event.toElement) {
                return event.toElement;
            }else if (event.fromElement) {
                return event.fromElement;
            }else{
                return null;
            }
        },
        getButton:function(event){ //获取鼠标按钮
            if (alan.isSupported2) {
                return event.button;
            }else{
                switch(event.button){
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        },
        getWheelDelta:function(event){ //滚轮的事件
            if (event.wheelDelta) {
                return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
            }else{
                return -event.detail * 40;
            }
        },
        getCharCode:function(event){
            if (typeof event.charCode == 'number') {
                return event.charCode;
            }else{
                return event.keyCode;
            }
        }
    };

    /**
     * 在连续整数中取得一个随机数
     * @param  {number}
     * @param  {number}
     * @param  {string} 'star' || 'end' || 'both'  随机数包括starNum || endNum || both
     * @return 一个随机数
     */
    $.mathRandom = function(starNum,endNum,type){
        var num = endNum - starNum;
        switch (type) {
            case 'star' : return parseInt(Math.random()*num + starNum,10);
            case 'end' : return Math.floor(Math.random()*num + starNum) + 1;
            case 'both' : return Math.round(Math.random()*num + starNum);
            default : console.log('没有指定随机数的范围');
        }
    };

    // 获得数组中最小值
    $.getArrayMin = function(array) {
        /*var min = array[0];
         array.forEach(function (item) {
         if(item < min){
         min = item;
         }
         });
         return min;*/

        return Math.min.apply(Math,array);
    };

    // 获得数组中最大值
    $.getArrayMax = function (array) {
        return Math.max.apply(Math,array);
    };

    // 数组去重复
    $.getArrayNoRepeat = function (array) {
        var noRepeat = [];
        var data = {};
        array.forEach(function (item) {
            if(!data[item]){
                noRepeat.push(item);
                data[item] = true;
            }
        });
        return noRepeat;
    };

    $.isArray = function(val){
        return Array.isArray(val) || Object.prototype.toString.call(val) === '[object Array]';
    };
    $.isFunction = function(val){
        return Object.prototype.toString.call(val) == '[object Function]';
    };
    $.isRegExp = function(val){
        return Object.prototype.toString.call(val) == '[object RegExp]';
    };

    $.isMacWebkit = (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Version") !== -1);
    $.isFirefox = (navigator.userAgent.indexOf("Firefox") !== -1);

    //
    $.fn = {
        each: function(callback) {
            [].every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
            });
            return this;
        }
    };

    //兼容 AMD 模块
    if (typeof define === 'function' && define.amd) {
        define('alan', [], function() {
            return $;
        });
    }
    return $;
})(document);


// 滚动动画
(function ($) {
    /*
    * 需要在css文件里添加 .scroll-animate.animated {visibility: hidden;} 样式，解决"闪一下"的bug
    * .disable-hover {pointer-events: none;} 也需要加在样式表中
    * 如果滚动事件失效，查看body元素是否设置了 {height:100%}，它会影响滚动事件。
    * */

    var ScrollAnimate = function (opt) {
        this.opt = opt || {};
        this.className = this.opt.className || '.scroll-animate'; // 获取集合的class
        this.animateClass = this.opt.animateClass || 'animated';  // 动画依赖的class
        this.elem = document.querySelectorAll(this.className);    // 需要滚动展示的元素
        this.position = [];                                       // 所有元素的offsetTop距离数组
        this.windowHeight = ('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight;
        this.time = null;
        this.body = document.body;
        this.init();
    };
    ScrollAnimate.prototype = {
        getPosition:function () {
            var self = this;
            self.position.length = 0;  // 重置数组
            [].slice.call(self.elem).forEach(function (elem) {
                if(elem.classList.contains('father')){
                    var children = elem.querySelectorAll(elem.getAttribute('data-child'));
                    var delay = parseFloat(elem.getAttribute('data-delay'));
                    [].slice.call(children).forEach(function (obj,index) {
                        obj.classList.add('animated');
                        obj.style.visibility = 'hidden';

                        if(obj.getAttribute('data-delay')){
                            obj.style.animationDelay = obj.getAttribute('data-delay') + 's';
                        }else{
                            obj.style.animationDelay = delay * index + 's';
                        }
                    })
                }else if(elem.classList.contains('font-fadeIn')){
                    elem.style.visibility = 'hidden';
                }else{
                    elem.classList.add('animated');
                }

                self.position.push(self.getOffsetTop(elem));
            });
        },
        getOffsetTop:function(element){
            var top;
            while (element.offsetTop === void 0) {
                element = element.parentNode;
            }
            top = element.offsetTop;
            while (element = element.offsetParent) {
                top += element.offsetTop;
            }
            return top;
        },
        scrollEvent:function () {
            var self = this;

            self.body.classList.add('disable-hover');
            clearTimeout(self.time);
            self.time = setTimeout(function () {
                self.body.classList.remove('disable-hover');
            },100);

            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

            self.position.forEach(function (item,index) {
                var currentElem = self.elem[index];
                var effect = currentElem.getAttribute('data-effect') || 'fadeInUp';
                var Tclass = currentElem.getAttribute('data-Tclass') || 'go';
                var flag = (scrollTop + self.windowHeight - 50 >item) ? true : false;

                // 判断当前元素是否有father，得知将动画应用到当前元素还是当前元素到子元素。
                if(currentElem.classList.contains('father')){
                    var children = currentElem.querySelectorAll(currentElem.getAttribute('data-child'));

                    if(flag){
                        [].slice.call(children).forEach(function (item) {

                            if(item.style.visibility == 'hidden'){
                                item.style.visibility = 'visible';

                                // 判断是否为滚动数字效果的元素
                                // 数字滚动的效果，默认都放在father的容器里，因为这个效果一般都是多个同时出现。
                                if(item.classList.contains('count-up')){
                                    //self.countUp(item,true);
                                }else{
                                    if(item.getAttribute('data-effect')){
                                        item.classList.add(item.getAttribute('data-effect'));
                                    }else{
                                        item.classList.add(effect);
                                    }
                                }

                            }
                        })
                    }else{
                        [].slice.call(children).forEach(function (item) {
                            if(item.style.visibility == 'visible'){
                                /*if(item.classList.contains('count-up')){
                                    self.countUp(item,false);      // 传入false，告诉函数清空计时器。
                                }*/


                                if(item.getAttribute('data-effect')){
                                    item.classList.remove(item.getAttribute('data-effect'));
                                }else{
                                    item.classList.remove(effect);
                                }
                                item.style.visibility = 'hidden';
                            }
                        });
                    }
                }else if(currentElem.classList.contains('font-fadeIn')){  // 文字淡入到效果
                    if(flag && currentElem.style.visibility == 'hidden'){
                        self.fontEffect(currentElem);
                    }else if(!flag && currentElem.style.visibility == 'visible'){
                        currentElem.style.visibility = 'hidden'
                    }
                }else if(currentElem.classList.contains('classGo')){  //滚动到位置添加动画类
                    if(flag){
                        currentElem.style.visibility = 'visible';
                        currentElem.classList.add(Tclass);
                    }else{
                        if(currentElem.style.visibility == 'visible'){
                            currentElem.classList.remove(Tclass);
                            currentElem.style.visibility = 'hidden';
                        }
                    }
                }else{
                    if(flag){
                        currentElem.style.visibility = 'visible';
                        currentElem.classList.add(effect);
                        currentElem.style.animationDelay = currentElem.getAttribute('data-delay') + 's';

                    }else{
                        if(currentElem.style.visibility == 'visible'){
                            currentElem.classList.remove(effect);
                            currentElem.style.visibility = 'hidden';
                        }
                    }
                }
            })
        },
        countUp:function (elem,isTrue) {
            // 效果不理想，放弃了。

            if(isTrue){
                elem.innerHtml = '';

                var time = elem.getAttribute('data-time');
                var sum = elem.getAttribute('data-text');
                var speed = Math.ceil(time / 100);
                var increment = Math.round(sum / speed);
                var number = 1;
                elem.timer = setInterval(function () {
                    if(number < sum){
                        number += increment;
                        elem.innerText = number;
                    }else{
                        elem.innerText = sum;
                        clearInterval(elem.timer);
                    }
                },100);

                console.log(speed);
            }else{
                console.log('清空定时器');
                clearInterval(elem.timer);

            }

        },
        fontEffect:function (elem) {
            var array = elem.getAttribute('data-text').split('');
            var delay = elem.getAttribute('data-delay');
            var effect = elem.getAttribute('data-effect') || 'fadeIn';
            elem.innerHTML = '';
            var Fragment = document.createDocumentFragment();
            array.forEach(function (item,i) {
                var span = document.createElement("font");
                span.className='animated';
                span.classList.add(effect);
                if(delay){
                    span.style.animationDelay = delay * i + 's';
                }else{
                    span.style.animationDelay = 0.1 * i + 's';
                }
                span.innerText = item;
                Fragment.appendChild(span);
            });
            elem.style.visibility = 'visible';
            elem.appendChild(Fragment);
        },
        init:function () {
            var self = this;

            if(self.elem.length < 1){
                console.log('滚动动画对象集合为零');
                return;
            }

            self.scrollEvent = self.scrollEvent.bind(this);

            setTimeout(function () {
                self.getPosition(); // 获取每个元素的位置，存放在一个数组。
                self.scrollEvent();

                var _scrollEvent = throttlePro(self.scrollEvent,100,300);


                document.addEventListener('scroll',_scrollEvent,false);

                // 改变窗口大小，重新初始化一些数据
                window.onresize = function () {
                    //console.log('resize the window');
                    throttle(function () {
                        self.windowHeight = ('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight;
                        self.getPosition();
                        self.scrollEvent();
                    })
                };
            },0);

        }
    };
    setTimeout(function () {
        $.scrollAnimate = ScrollAnimate;
    },10);
})(alan);

// 函数截流
function throttle(method,context){
    clearTimeout(method.tId);
    method.tId = setTimeout(function(){
        method.call(context);
    },500);
}
function throttlePro(fn, delay, mustRunDelay){
    var timer = null;
    var t_start;
    return function(){
        var context = this, args = arguments, t_curr = +new Date();
        clearTimeout(timer);
        if(!t_start){
            t_start = t_curr;
        }
        if(t_curr - t_start >= mustRunDelay){
            fn.apply(context, args);
            t_start = t_curr;
        }
        else {
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        }
    };
}


//菜单添加激活条
(function($) {
    $.fn.lavaLamp = function(o) {
        o = $.extend({
            fx: "linear",
            speed: 500,
            click: function() {}
        }, o || {});
        return this.each(function() {
            var b = $(this),
                noop = function() {},
                $back = $('<div class="back"><div style="float:left;"></div></div>').appendTo(b),
                $li = $("li", this),
                curr = $("li.current-cat", this)[0] || $($li[0]).addClass("current-cat")[0];
            $li.not(".back").hover(function() {
                move(this)
            }, noop);
            $(this).hover(noop, function() {
                move(curr)
            });
            $li.click(function(e) {
                setCurr(this);
                return o.click.apply(this, [e, this])
            });
            setCurr(curr);

            function setCurr(a) {
                $back.css({
                    "left": a.offsetLeft + "px",
                    "width": a.offsetWidth + "px"
                });
                curr = a
            }

            function move(a) {
                $back.each(function() {
                    $(this).dequeue()
                }).animate({
                    width: a.offsetWidth,
                    left: a.offsetLeft
                }, o.speed, o.fx)
            }
        })
    }
})(jQuery);



;(function ($) {
    var Marqueen = function (opt) {
        this.opt = opt || {};
        this.elem = document.querySelector(this.opt.className);
        this.speed = this.opt.speed || 20;
        this.isStep = this.opt.isStep;
        this.ul = this.elem.querySelector('ul');
        this.liHeight = this.elem.querySelector('li').offsetHeight;
        this.ulHeight = this.ul.offsetHeight *  -1;
        this.y = 0;
        this.interval = null;
        this.timeout = null;
        this.reg=/\-?[0-9]+/g;
        //this.reg2=/\-?[0-9]+\.?[0-9]*/g;  //可能包含小数点的
        this.init();
    };
    Marqueen.prototype = {
        move:function () {
            var self = this;
            self.y --;
            self.ul.style.webkitTransform='translateY('+self.y+'px)';
            var nowY = self.ul.style.webkitTransform.match(self.reg)[0];

            if(self.isStep && ((-nowY) % (-self.liHeight) ===0)){
                clearInterval(self.interval);
                self.interval = null;
                self.timeout = setTimeout(function(){
                    self.interval = setInterval(self.move,self.speed);
                },2000);
            }


            if(nowY == self.ulHeight){
                self.y = 0;
                self.ul.style.transform='translateY(0px)';

            }

        },
        init:function () {
            var self = this;
            self.move = self.move.bind(self);
            self.ul.innerHTML += self.ul.innerHTML;
            self.interval = setInterval(self.move,self.speed);

            self.elem.onmouseover = function(){
                clearInterval(self.interval);
                self.interval = null;
                clearTimeout(self.timeout);
            };
            self.elem.onmouseout = function(){
                if(self.interval == null){
                    self.interval = setInterval(self.move,self.speed)
                }
            };

        }
    };
    $.Marqueen = Marqueen;
})(alan);





// 自定义滚动条
(function($){
    function ScrollBar(opt){
        this.opt = opt || {};
        this.scrollBox = document.getElementsByClassName(this.opt.elem)[0];
        this.scrollBar = this.scrollBox.getElementsByClassName('scroll-bar')[0];
        this.scrollBtn = this.scrollBox.getElementsByClassName('scroll-btn')[0];
        this.scrollCon = this.scrollBox.getElementsByClassName('scroll-con')[0];

        this.scrollBtnHeight = this.scrollBtn.offsetHeight;         // 按钮的高度
        this.scrollBoxHeight = this.scrollBox.offsetHeight;         // 容器的高度
        this.scrollBarHeight = this.scrollBoxHeight;                // 滚动条的高度
        this.scrollConHeight = this.scrollCon.scrollHeight - this.scrollBoxHeight; // 文章可以滚动内容高度

        this.MAXDIS = this.scrollBarHeight - this.scrollBtnHeight;  // 可拖动最大距离
        this.scrollBarPosition = this.scrollBar.getBoundingClientRect().top; // 滚动条基于文档的Y距离
        this.mouseClickPosition;                                    // 鼠标点击在按钮的距离
        this.init();
    }
    ScrollBar.prototype = {
        scrollTop:function(dis){

            var self = this;
            var _scrollTop = dis * self.scrollConHeight / self.MAXDIS;
            self.scrollCon.scrollTop = _scrollTop;
        },
        atuoMoveBtn:function(scrollTop){
            var self = this;
            var _moveY = scrollTop * self.MAXDIS / self.scrollConHeight;
            self.scrollBtn.style.top = _moveY + 'px';
        },
        mouseMoveEvent:function(event){
            var self = this;
            var dis = event.clientY - self.scrollBarPosition - self.mouseClickPosition;

            // 限制范围
            dis > self.MAXDIS && (dis = self.MAXDIS);
            dis < 0 && (dis = 0);

            self.scrollBtn.style.top = dis + 'px';

            self.scrollTop(dis);
        },
        mouseUpEvent:function(event){
            var self = this;
            self.scrollCon.classList.remove('scrolling');
            document.removeEventListener('mousemove',self._MoveEvent,false);
            document.removeEventListener('mouseup',self._UpEvent,false);

        },
        wheelEvent:function(event){
            var self = this;
            var e = event || window.event;
            var deltaY = e.deltaY * -30  ||    // wheel 事件
                e.wheelDeltaY/4 ||    // mousewheel 事件  chrome
                (e.wheelDeltaY === undefined &&    // 如果没有2D属性
                e.wheelDelta/4) ||    // 那么就用1D的滚轮属性
                e.detail * -10 ||    // firefox的DOMMouseScroll事件
                0 ;     // 属性未定义
            if ($.isMacWebkit) {
                deltaY /= 30;
            }

            if ($.isFirefox && e.type !== "DOMMouseScroll") {
                self.scrollCon.removeEventListener('DOMMouseScroll',self._wheelEvent,false);
            }

            if(!e.ctrlKey){
                if(deltaY > 0){
                    //console.log(deltaY);
                    self.scrollCon.scrollTop -= 20;
                }else{
                    self.scrollCon.scrollTop += 20;
                }
                self.atuoMoveBtn(self.scrollCon.scrollTop);
            }


            e.preventDefault();
            e.stopPropagation();
        },
        init:function(){
            this._MoveEvent = this.mouseMoveEvent.bind(this);
            this._UpEvent = this.mouseUpEvent.bind(this);
            this._wheelEvent = this.wheelEvent.bind(this);

            var self = this;
            // 拖动滚轮的事件
            self.scrollBtn.onmousedown = function(event){
                var e = event || window.event;

                // 每次点击都获取一次按钮位置，以得到鼠标与按钮顶部的距离
                var scrollBtnPosition = this.offsetTop;
                self.mouseClickPosition = e.clientY - self.scrollBarPosition - scrollBtnPosition;

                self.scrollCon.classList.add('scrolling'); // 防止拖动的时候选中文字

                document.addEventListener('mousemove',self._MoveEvent,false);
                document.addEventListener('mouseup',self._UpEvent,false);
            };

            // 滚动内容的事件
            self.scrollCon.addEventListener('mousewheel',self._wheelEvent,false);

            // firefox
            if ($.isFirefox) {
                self.scrollCon.addEventListener('DOMMouseScroll',self._wheelEvent,false);
            }
        }
    };
    $.ScrollBar = ScrollBar;
})(alan);






