
/*
 * TAB切换
 *
 * @param {string} btn 切换按钮选择器
 * @param {string} content 切换内容选择器
 * @param {function=} callback 切换后的回调
*/
function tab(btn, content, callback) {
    $('body').on('click', btn, function() {
        var index = $(this).index(btn);
        $(btn).removeClass('current').eq(index).addClass('current');
        $(content).hide().eq(index).show();
        if (typeof callback === 'function') {
            callback(index);
        }
    });
}

/*
 * Slide滑动
 * @param {string} wrap 外层元素选择器
 * @param {string} item 子元素选择器
 * @param {string} side 方向
*/
function slide (wrap, item, side) {
    var content = $(item).parent();
    var wrapW = $(wrap).width();
    var itemW = $(item).outerWidth(true);
    var itemSize = $(item).size();
    var offsetLeft = content.position().left;
    var offset = parseInt(content.css('left'), 10);

    if (side === 'left') {
        offset = offset >= 0 ? 0 : offset + itemW;
    }
    else if (side === 'right') {
        offset = (Math.abs(offset) + 3 * itemW >= itemW * itemSize) ? offset : offset - itemW;
    }
    if (!content.is(':animated')) {
        content.animate({left: offset}, 400);
    } 
}

// js获取url参数值
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

// layout-five
tab('.course-tab li', '.course-bd');

// layout-ten
tab('.attended-school-tab li', '.attended-school-bd')

var dataReg = {
    m: /^1[3-9]\d{9}$/
}
// 验证表单
function check (element) {
    var error = $(element).parents('form').find('.error-tips');
    var datatype = $(element).attr('datatype');
    var value = $(element).val();

    if (!value) {
        error.html($(element).attr('nullmsg'));
        $(element).addClass('error');
        return false;
    }
    if (datatype && !dataReg[datatype].test(value)) {
        error.html($(element).attr('errormsg'));
        $(element).addClass('error');
        return false;
    }

    error.html('');
    $(element).removeClass('error');
    return true;
}

// 报名表单失去焦点验证
$('body').on('blur', '#applyForm input, #bottomApplyForm input, #rightApplyForm input', function () {
    check(this);
});

// 提交报名
var applyFlag = true;
$('body').on('click', '#applySubmit, #bottomApplySubmit, #rightApplySubmit', function () {
    var form = $(this).parents('form');
    var content = form.serialize() + '&activity_id=96&huodong_af=' + getQueryString('tgfrom');
    var error = form.find('.error-tips');
    var btnTxt = $(this).html();
    var result = false;
    var self = this;

    // 提交前验证
    form.find('input, select').each(function () {
        result = check(this);
        return result;
    });

    if (result && applyFlag) {
        applyFlag = false;
        $(self).html('提交中...');
        // 报名
        $.ajax({
            url: 'http://www.ieduchina.com/index.php?m=activity&c=index&a=ajax_activity_baoming',
            type: 'POST',
            dataType: 'json',
            data: content,
            success: function (data) {
                if (data.status == 1) {
                    form[0].reset();
                    $('.popup-apply').hide();
                    applySuccess();
                }
                else if (data.status == 0) {
                    error.html(data.info);
                }
                applyFlag = true;
                $(self).html(btnTxt);
            },
            error: function () {
                applyFlag = true;
                $(self).html(btnTxt);
            }
        })
    }
    
});

// 报名成功
var applySuccessTime = 3;
function applySuccess() {
    var popup = $('.popup');
    var popupApply = $('.popup-apply');
    var successUI = $('.apply-success');
    var time = $('#successCloseTime');
    popupApply.hide();
    popup.show();
    successUI.show();
    if (applySuccessTime < 0) {
        popup.hide();
        applySuccessTime = 3;
        return false;
    }
    time.html(applySuccessTime);
    applySuccessTime--;
    setTimeout(function () {
        applySuccess();
    }, 1000);
}

// 关闭报名弹窗
$('body').on('click', '#popupClose', function () {
    $('.popup').hide();
});

// 显示报名弹窗
$('body').on('click', '.showApplyBtn, .book, .linkTosignUp, .specialist-item .specialist-info .yuyue', function () {
    $('.popup').show();
    $('.popup-apply').show();
    $('.apply-success').hide();
});

// 专家滑动
$('body').on('click', '#specialistLeft', function () {
    slide('.specialist-content', '.specialist-item li', 'left');
});
$('body').on('click', '#specialistRight', function () {
    slide('.specialist-content', '.specialist-item li', 'right');
});


// 幻灯片轮播图
$('.photos').attr('data-setting','{"width":1000,"height":235,"postWidth":460,"postHeight":235,"autoPlay":"true"}');
Carousel.init($('.photos'));

//主流课程动效
$(".course-title li").on("click",function(){
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
    $(".course-cont li").eq($(this).index()).show().siblings().hide();

})

//左侧导航显隐藏
$(window).scroll(function(){
    // console.log($(this).scrollTop());
    if($(this).scrollTop()<600){
        $(".layout-left").hide();
    }else{
        $(".layout-left").fadeIn();;
    }
})

//cc客服显隐藏
$("#ccBox").on("click",function(){
   
    if($(".kf_qycn_com_cckf_inpage_chat_window")[0].style["display"] == 'none'){
        $(".kf_qycn_com_cckf_inpage_chat_window")[0].style["display"] = 'block';
        $(".kf_qycn_com_cckf_inpage_chat_window_min")[0].style["display"] = 'none';
    }
    // if($(".kf_qycn_com_cckf_inpage_chat_window")[0].style["display"] == 'block'){
    //     $(".kf_qycn_com_cckf_inpage_chat_window")[0].style["display"] = 'none';
    //     $(".kf_qycn_com_cckf_inpage_chat_window_min")[0].style["display"] = 'block';
    // }
    
})