// JavaScript Document

var data={
	win_w:$(window).width(),
	win_h:$(window).height(),
    Tpage:0,
    choosePage:null,
    isAni:false
};

var init=function(){
};

$(document).ready(function(){
    new alan.scrollAnimate();
	init();
    indexFn.water();
    indexFn.pic_slider();
    indexFn.new_list();
    indexFn.new_box();
    // indexFn.pro_box();
});

window.onload=function () {
	$('[data-hei]').each(function(index,e){
		var wid=$(this).width(),
			hei=parseInt(wid*($(this).attr('data-hei')));
		$(this).css('height',hei+"px");
	});
}

$(window).resize(function() {
  	$('[data-hei]').each(function(){
		var wid=$(this).width(),
            hei=parseInt(wid*($(this).attr('data-hei')));
		$(this).css('height',hei+"px");
	});
});

var indexFn = {
    water : function () {

        var cv = document.getElementById('water');
        var ctx = cv.getContext('2d');
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        var step =0;
        var bowidth = cv.width/5;
        var poswidth = cv.width/1.2;
        var a = ctx.createLinearGradient(0,0,0,cv.height);
        a.addColorStop(0,'#79bd28');
        a.addColorStop(1,'#00653b');
        function loop () {
            ctx.clearRect(0,0,cv.width,cv.height);
            step++;
            ctx.fillStyle = a;
            var angle = step*Math.PI/180;
            var deltaHeight   = Math.sin(angle) * bowidth;
            var deltaHeightRight   = Math.cos(angle) * bowidth;
            ctx.beginPath();
            ctx.moveTo(poswidth,0);
            ctx.bezierCurveTo(poswidth+deltaHeight,cv.height/2,poswidth+deltaHeightRight,cv.height/2,poswidth,cv.height);
            ctx.lineTo(0, cv.height);
            ctx.lineTo(0, 0);
            ctx.lineTo(poswidth,0);
            ctx.closePath();
            ctx.fill();
            requestAnimFrame(loop);
        }
        loop();
    },
    pic_slider : function () {
        var slider = function (opts) {
            var box = opts.parent,
                list = box.find('li'),
                txt_box  = opts.txt_box,
                txt_list = txt_box.find('li'),
                page_box = opts.page_box,
                page_list = page_box.find('li'),
                isAni = false,
                cur = 0;
            page_list.on('click',function () {
                if(isAni) return false;
                isAni = true;
               var _this = $(this),
                   index = _this.index();
               if(index == cur){
                   isAni = false;
                   return false;
               }
                list.eq(cur).addClass('move').removeClass('on');
                list.eq(index).addClass('cur_move');
                txt_list.eq(index).addClass('move').siblings().removeClass('on');
               setTimeout(function () {
                   list.eq(cur).removeClass('move');
                   list.eq(index).addClass('on').removeClass('cur_move');
                   for(var n =1;n<=(page_list.length-1);n++){
                       var num = index+n;
                       var rang = num - page_list.length;
                       num = num < page_list.length - 1 ? num : (0+rang);
                       if(n==1){
                           list.eq(num).addClass('n1').siblings().removeClass('n1');
                       }
                       if(n==2){
                           list.eq(num).addClass('n2').siblings().removeClass('n2');
                       }
                   }
                   cur = index;
               },700);
               setTimeout(function () {
                   txt_list.eq(index).addClass('on').removeClass('move');
                   isAni = false;
               },1200);
               _this.addClass('on').siblings().removeClass('on');
            });
        };
        $('.pro-slider').each(function () {
            var _this  = $(this),
                txt    = _this.parents('.home-pro-list').find('.msg-box'),
            page = $('#'+$(this).attr('data-slide'));
            new slider({
                parent:_this,
                page_box: page,
                txt_box : txt
            })
        });
    },
    new_list :function () {
        var slider = function (opts) {
            var box = opts.parent,
                item = opts.items,
                pic_item = opts.pic_item;
            item.find('li').on('mouseenter',function () {
               var _this = $(this),
                   index = _this.index();
               pic_item.find('.pic-list').eq(index).addClass('on').siblings().removeClass('on');
            });
        };
        $('.new-list').each(function () {
            var el = $(this),
                item = el.find('.new-item'),
                pic_item = el.find('.pic-item');
            new slider({
                parent : el,
                items   : item,
                pic_item : pic_item
            });
        });
    },
    new_box : function () {
        var tab = function (opts) {
            var box = opts.box,
                isAni = false,
                _tab = box.find('.new-tab'),
                item = box.find('.new-list'),
                list = _tab.find('li'),
                prev = _tab.find('.n-prev'),
                next = _tab.find('.n-next'),
                cur  = 0,
                length = list.length - 1;
            prev.addClass('v-hide');
            prev.on('click',function () {
                swiper_go(cur,'prev');
            });
            next.on('click',function () {
                swiper_go(cur,'next');
            });
            list.on('click',function () {
                var num = $(this).attr('data-cur');
                swiper_go(num,'num');
            });
            function swiper_go(index,type) {
                if(isAni) return false;
                isAni = true;
                var left = 0;
                if(type == 'prev'){
                    cur = index>0 ? (index-1) : length;
                }
                if(type == 'next'){
                    cur = index<length ? (index+1) : 0;
                }
                if(type == 'num'){
                    cur = index;
                }
                if(cur==0){
                    prev.addClass('v-hide');
                }else{
                    prev.removeClass('v-hide');
                }
                if(cur==length){
                    next.addClass('v-hide');
                }else{
                    next.removeClass('v-hide');
                }
                list.eq(cur).addClass('on').siblings().removeClass('on');
                item.eq(cur).show().siblings('.new-list').hide();
                setTimeout(function () {
                    isAni = false;
                },100);
            }
        }
        $('.new-box').each(function () {
            var el = $(this);
            new tab({
                box : el
            });
        });
    },
    pro_box : function () {
        var tabs = function (opts) {
            var box = opts.box,
                isAni = false,
                _tab = opts.tab,
                item = _tab.find('.home-pro-list'),
                list = box.find('li'),
                href = box.find('.type-more'),
                cur  = 0,
                length = list.length - 1;
            var url = list.eq(0).attr('data-url');
            href.attr('href',url);
            list.on('click',function () {
                var num = $(this).attr('data-cur');
                var url = $(this).attr('data-url');
                href.attr('href',url);
                swiper_go(num,'num');
            });
            function swiper_go(index,type) {
                if(isAni) return false;
                isAni = true;
                var left = 0;
                if(type == 'prev'){
                    cur = index>0 ? (index-1) : length;
                }
                if(type == 'next'){
                    cur = index<length ? (index+1) : 0;
                }
                if(type == 'num'){
                    cur = index;
                }
                list.eq(cur).addClass('on').siblings('li').removeClass('on');
                item.eq(cur).addClass('on').siblings().removeClass('on');
                setTimeout(function () {
                    isAni = false;
                },100);
            }
        }
        $('.pro-tab').each(function () {
            var el = $(this),
                pros = $(this).prevAll('.home-pro');
            new tabs({
                box : el,
                tab : pros
            });
        });
    }
};








