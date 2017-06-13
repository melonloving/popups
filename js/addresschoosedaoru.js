/**
 * @客服会员列表
 * @author 林建凯25819
 *
 */
//alert('抓到了');
var firstLoadMember = 0, SessionStorageCount=0;
$(function () {
    serviceMemberList.init();
    $(".surplus_Num").blur(function () {
        if (!/^\d+$/.test($(this).val())) {
            layer.msg("权益剩余次数只能为非负整数");
            $(this).val(0);
            $(this).focus();
        }
    });
    $(".surplus_Num").change(function () {
        $(".check_div input[type=checkbox]").prop("checked", false);
        $(this).parent().find("input[type=checkbox]").prop("checked", true);
        $("#insureStatus").val("");
        if (!/^\d+$/.test($(this).val())) {
            layer.msg("权益剩余次数只能为非负整数");
            $(this).val(0);
            $(this).focus();
        }

    });
    //投保状态和权益剩余次数只能选一个
    $("#insureStatus")
        .change(function() {
            if ($("#insureStatus").val() != "") {
                $(".check_div input[type=checkbox]").prop("checked", false);
            }
        });
    $(".check_div input[type=checkbox]").change(function (e) {
        var boolCheck = $(this).prop("checked");
        $("#insureStatus").val("");
        $(".check_div input[type=checkbox]").prop("checked", false);
        if (boolCheck) {
            $(this).prop("checked", true);
        }
    });
});

var serviceMemberList = createRootVariable();

/**
 * 全局的配置对象，包含各个模块共用的常量
 * @type {Object}
 */
serviceMemberList.config = {
    quickFilterResult: [],
    highFilterResult: [],
    page: null,
    addressAjaxData: null,
},

/**
 * 全局的DOM事件，每个模块的DOM事件请写在自己的模块里
 * @type {Object}
 */
serviceMemberList.events = {
    '#commonFilter&label[for^="commonFilter"]': {
        click: function(root, e) {
            serviceMemberList.handles.checkboxEvent(e);
            var commonFilterChecked = $("#commonFilter").find("input[type='checkbox']:checked");
            var thisvalue = $(this).attr("data-value");
            serviceMemberList.config.quickFilterResult.map(function (item, index) {
                if (item.type == "CommonQuery") {
                    item.text = commonFilterChecked.next("label").attr("data-text") || "";
                    item.value = commonFilterChecked.next("label").attr("data-value") || "";
                }
                if (item.type == 'IsRemoveQuitMember' && thisvalue == "13") {
                    //退会退群去掉排除退会会员标签
                    item.text = "";
                    item.value = "";
                }
            })
            serviceMemberList.handles.setSelectedLabel();
        }
    },
    '#equityWarning&label[for^="equityWarning"]': {
        click: function(root, e) {
            serviceMemberList.handles.checkboxEvent(e);
            var equityWarningChecked = $("#equityWarning").find("input[type='checkbox']:checked");
            serviceMemberList.config.quickFilterResult.map(function (item, index) {
                if (item.type == "RightsWarning") {
                    item.text = equityWarningChecked.next("label").attr("data-text") || "";
                    item.value = equityWarningChecked.next("label").attr("data-value") || "";
                }
            })
            serviceMemberList.handles.setSelectedLabel();
        }
    },
	'#healthLevel&label[for^="healthLevel"]': {
        click: function(root, e) {
            serviceMemberList.handles.checkboxEvent(e);
            var healthLevelChecked = $("#healthLevel").find("input[type='checkbox']:checked");
            serviceMemberList.config.quickFilterResult.map(function (item, index) {
                if (item.type == "HealthLevel") {
                    item.text = healthLevelChecked.next("label").attr("data-text") || "";
                    item.value = healthLevelChecked.next("label").attr("data-value") || "";
                }
            })
            serviceMemberList.handles.setSelectedLabel();
        }
    },
    '#quickFilter&label[for^="quickFilter"]': {
        click: function(root, e) {
            serviceMemberList.handles.checkboxEvent(e);
            serviceMemberList.handles.highFilterLinkage();
        }
    },
    //快捷查询placehoder变化
    '#quickQuery': {
        change: function (root, e){
            var placeholder = $(this).find("option:selected").attr("data-placeholder");
            $("#quickText").attr("placeholder", "请输入" + placeholder).val("");
        }
    },
    //只看受益人
    '#onlyFavoree': {
        change: function(root, e){
            var onlyFavoreeValue = $(this).prop("checked") ? "1" : "";
            var onlyFavoreeText = $(this).prop("checked") ? "只看受益人" : "";
            serviceMemberList.config.quickFilterResult.map(function (item, index) {
                if (item.type == "IsBeneficiary") {
                    item.text = onlyFavoreeText;
                    item.value = onlyFavoreeValue;
                }
            });
            serviceMemberList.handles.setSelectedLabel();
            serviceMemberList.handles.getServiceMemberConditionStaticNum();
            serviceMemberList.handles.GetHealthLevelPercentStatic();
        }
    },
    //排除退会会员
    '#excludeMembers':{
        change:function(root,e){
            var isExcludeMemberValue=$(this).prop('checked')?'1':'';
            var isExcludeMemberText = $(this).prop('checked') ? '排除退会会员' : '';
            serviceMemberList.config.quickFilterResult.map(function(item,index){
                if(item.type=='IsRemoveQuitMember'){
                    item.text=isExcludeMemberText;
                    item.value = isExcludeMemberValue;
                }
            });
            serviceMemberList.handles.setSelectedLabel();
            serviceMemberList.handles.getServiceMemberConditionStaticNum();
        }
    },
    //tip-cont的位置
    '#serviceMemberFilter&.icon-info-sign': {
    	mouseover: function(root, e){
    		var contWidth = $(this).next(".filter-tip-cont").outerWidth();
    		var signLeft = $(this).offset().left;
    		var allWidth = document.body.offsetWidth;
    		if(contWidth + signLeft > allWidth){
    			$(this).next(".filter-tip-cont").css({
    				"left": "initial",
    				"right": "120%"
    			})
    		}
    	}
    },
    //查询
    "#queryBtn": {
        click: function(root, e){
            serviceMemberList.handles.quickQueryLabel();
        }
    },
    '#highFilterBtn': {
        click: function(root, e) {
            $("#filterDialog").eDialog('show');
            serviceMemberList.handles.initFilterDialog();
        }
    },
    //年龄范围的判断
    "#ageRange&input": {
        blur: function (root, e) {
           if (parseInt($(this).val()) <= 0 || parseInt($(this).val()) > 200) {
               $(this).val("").trigger("change");
           }
           if (parseInt($(this).val()) >= 0 && $(this).val().substr(0,1) == "0") {
               $(this).val("").trigger("change");
           }
           if ($(this).attr('id') == 'minAge') {
               var minValue = parseInt($(this).val());
               var maxValue = parseInt($(this).next().val());
               if (minValue > maxValue && $(this).next().val() !== "" && $(this).val() !== "") {
                   $(this).val("").trigger("change");
               }
           } else {
               var minValue = parseInt($(this).prev().val());
               var maxValue = parseInt($(this).val());
               if (minValue > maxValue && $(this).prev().val() !== "" && $(this).val() !== "") {
                   $(this).val("").trigger("change");
               }
           }
        }
    },
    //生日的自定义弹窗
    '#birthday': {
        change: function(root, e){
            var selectVal = $(this).find("option:selected").text();
            $(".memberBirthVal").text(selectVal);
            if($(this).val() == 3){
                $("#memberBirth").eDialog('show');
                $("#memberBirth").find(".eui-dialog-mask").addClass("show");
            }else{
                $("#memberBirth").find("input").val("");
            }
        }
    },
    "#memberBirth&.eui-btn-cancel, .eui-dialog-btn-close": {
        click: function(root, e){
            $("#memberBirth").eDialog('hide');
            $("#memberBirth").find(".eui-dialog-mask").removeClass("show");
            $("#birthday").val("");
            $(".memberBirthVal").text('--请选择--');
            $("#memberBirth").find("input").val("");
        }
    },
    "#memberBirth&.eui-btn-secondary": {
        click: function(root, e){
            var birthBeginVal = $("#memberBirthBeginTime").val();
            var birthEndVal = $("#memberBirthEndTime").val();
            var beginYear = birthBeginVal.split("-")[0]||"";
            var endYear = birthEndVal.split("-")[0] || "";
            if((!birthBeginVal) && (!birthEndVal)){
                layer.msg('请输入生日');
                return;
            }else if(beginYear != "" && endYear !== "" && beginYear !== endYear){
               	layer.msg("不允许跨年，请重新选择!");
               	return;
            }else if((!birthBeginVal) || (!birthEndVal)){
                $("#birthday").val('member');
                if(birthBeginVal){
                    $(".memberBirthVal").text(birthBeginVal);
                }
                if(birthEndVal){
                    $(".memberBirthVal").text(birthEndVal);
                }
            }else{
                $("#birthday").val('member');
                $(".memberBirthVal").text(birthBeginVal + ',' + birthEndVal);
            }
            $("#memberBirth").eDialog('hide');
            $("#memberBirth").find(".eui-dialog-mask").removeClass("show");
        }
    },
    //点击日期，隐藏常用地
    '.filter-box&.filter-item[data-type="dateRange"] input': {
        click: function(root, e){
           $("#usualAddress").find(".address-content").slideUp().removeClass("show");
        }
    },
    '#filterDialog&.eui-btn-cancel': {
        click: function(root, e){
            $("#filterDialog").eDialog('hide');
        }
    },
    '#confirmBtn': {
        click: function(root, e){
            serviceMemberList.handles.saveFilterData();
            $("#filterDialog").eDialog('hide');
        }
    },
    //删除标签
    '#selectedItem&.filterResult li i': {
        click: function(root, e){
            var className = $(this).parent('li').attr('class');
            var servicerInfoStorage = [];
            if(sessionStorage.serviceMemberListServicerInfo){
            	servicerInfoStorage = JSON.parse(sessionStorage.serviceMemberListServicerInfo);
            }
            switch (className){
                case "highFilter": {
                    var tagId = $(this).parent('li').find('span').attr('data-tagId');
                    serviceMemberList.config.highFilterResult.map(function (item, index){
                        if(item.id == tagId){
                            item.text = "";
                            item.value = "";
                        }
                    });
                    break;
                }
                case "CommonQuery": {
                    $("#commonFilter").find('input').prop("checked",false);
                    serviceMemberList.config.quickFilterResult.map(function (item, index) {
                        if (item.type == "CommonQuery") {
                            item.text =  "";
                            item.value = "";
                        }
                    })
                    break;
                }
                case "RightsWarning": {
                    $("#equityWarning").find('input').prop("checked",false);
                    serviceMemberList.config.quickFilterResult.map(function (item, index) {
                        if (item.type == "RightsWarning") {
                            item.text =  "";
                            item.value = "";
                        }
                    })
                    break;
                }
                case "quickQuery": {
                    $("#quickText").val("");
                    break;
                }
                case "IsBeneficiary": {
                    $("#onlyFavoree").prop("checked",false);
                    serviceMemberList.config.quickFilterResult.map(function (item, index) {
                        if (item.type == "IsBeneficiary") {
                            item.text =  "";
                            item.value = "";
                        }
                    })
                    break;
                }
                case "IsRemoveQuitMember":{
                    $("#excludeMembers").prop("checked",false);
                    serviceMemberList.config.quickFilterResult.map(function (item, index) {
                        if (item.type == "IsRemoveQuitMember") {
                            item.text =  "";
                            item.value = "";
                        }
                    })
                    break;
                }
                case "departmentSearch": {
					$("#treeviewdep").find("option:selected").val("").text("请选择客服所在部门");
					$("#departmentSearch #treeview-ddlDeptart .list-group li.node-selected").trigger("click");
					servicerInfoStorage.forEach(function(item,index){
						if(item.type == "departmentSearch"){
							servicerInfoStorage.splice(item);
						}
					})
                }
                case "servicerSearch": {
                	$("#servicerSearch .eui-input").val("").attr("data-id", "");
                	servicerInfoStorage.forEach(function(item,index){
						if(item.type == "servicerSearch"){
							servicerInfoStorage.splice(item);
						}
					})
                }
                case "HealthLevel":{
                    $("#healthLevel").find('input').prop("checked",false);
                    serviceMemberList.config.quickFilterResult.map(function (item, index) {
                        if (item.type == "HealthLevel") {
                            item.text =  "";
                            item.value = "";
                        }
                    })
                    break;
                }
            }
            $(this).parent('li').remove();
            if($(".filterResult").find('li').length == 0){
                $("#selectedItem").addClass('none');
            }
            serviceMemberList.handles.initFilterDialog();
            serviceMemberList.handles.getServicerMemberList(1);
            serviceMemberList.handles.getServiceMemberConditionStaticNum();
            serviceMemberList.handles.GetHealthLevelPercentStatic();
            sessionStorage.serviceMemberListHighFilterResult = JSON.stringify(serviceMemberList.config.highFilterResult);
            sessionStorage.serviceMemberListQuickFilterResult = JSON.stringify(serviceMemberList.config.quickFilterResult);
            sessionStorage.serviceMemberListQuickQuery = "";
            sessionStorage.serviceMemberListServicerInfo = JSON.stringify(servicerInfoStorage);
        }
    },
    //全部清除
    '#selectedItem&#delAllBtn': {
        click: function(root, e){
            if(serviceMemberList.config.highFilterResult){
                serviceMemberList.config.highFilterResult.map(function (item, index){
                    item.text = "";
                    item.value = "";
                })
            }
            $("#quickText").val("");
            $("#commonFilter").find('input').prop("checked",false);
            $("#equityWarning").find('input').prop("checked",false);
            $("#onlyFavoree").prop("checked",false);
            $("#excludeMembers").prop("checked",false);
            $("#healthLevel").find('input').prop("checked",false);
            serviceMemberList.config.quickFilterResult.map(function (item, index) {
                item.text =  "";
                item.value = "";
            })
            $("#treeviewdep").find("option:selected").val("").text("请选择客服所在部门");
            $("#departmentSearch #treeview-ddlDeptart .list-group li.node-selected").trigger("click");
			$("#servicerSearch .eui-input").val("").attr("data-id", "");

            $("#selectedItem").find('.filterResult li').remove();
            $("#selectedItem").addClass('none');
            serviceMemberList.handles.initFilterDialog();
            serviceMemberList.handles.getServicerMemberList(1);
            serviceMemberList.handles.getServiceMemberConditionStaticNum();
            serviceMemberList.handles.GetHealthLevelPercentStatic();
            sessionStorage.serviceMemberListHighFilterResult = JSON.stringify(serviceMemberList.config.highFilterResult);
            sessionStorage.serviceMemberListQuickFilterResult = JSON.stringify(serviceMemberList.config.quickFilterResult);
            sessionStorage.serviceMemberListQuickQuery = "";
            sessionStorage.serviceMemberListServicerInfo = [];
        }
    },
    '#serviceMemberList&.eui-btn-sort': {
        change: function(root, e, state){
            $(this).parent().siblings().find('.eui-btn-sort').removeClass('eui-btn-sort-active eui-btn-sort-desc eui-btn-sort-asce');
            var needSort = {
                dataValue: $(this).attr("data-value"),
                dataState: state
            }
            sessionStorage.serviceMemberListNeedSort = JSON.stringify(needSort);
            serviceMemberList.handles.getServicerMemberList(1);
        }
    },
    '#serviceMemberList&.memberInfo i': {
        mouseenter: function(root, e){
            $(this).find(".orderList").addClass("show");
            serviceMemberList.handles.getServicerMemberOrderList($(this));
        },
        mouseleave: function(root, e){
            $(this).find(".orderList").removeClass("show");
        }
    },
    "#serviceMemberList&.detailBtn": {
        click: function(root, e){
            var memberId = $(this).parents("tr").attr("data-memberId");
            serviceMemberList.handles.alertEditDialog(memberId,8,false);
        }
    },
    '#servicerSearch&.eui-input': {
    	blur: function(root, e){
    		if(!$(this).attr("data-id")){
    			$(this).val("");
    		}
    	}
    },
    '#serviceMemberList&.confirmExitGroupBtn': {
        click: function (root, e) {
            serviceMemberList.handles.getExitGroupList($(this));
            $("#exitGroup").eDialog('show');
        }
    },
    '#serviceMemberList&.confirmExitYaokeGroupBtn': {
        click: function (root, e) {
            var orderid = $(this).attr("data-orderid");
            var memberid = $(this).parents("tr").attr("data-memberId");
            var servicetype = $(this).attr("data-servicetype");
            serviceMemberList.handles.memberExitGroup(orderid, memberid, servicetype);
        }
    },
    '#exitGroup&.eui-btn-secondary': {
        click: function (root, e) {
            var orderid = $(this).attr("data-orderid");
            var memberid = $(this).attr("data-memberId");
            var servicetype = $(this).attr("data-servicetype");
            serviceMemberList.handles.memberExitGroup(orderid, memberid, servicetype);
        }
    },
    '#exitGroup&.eui-btn-cancel': {
        click: function (root, e) {
            $("#exitGroup").eDialog('hide');
        }
    }
};

/**
 * 包含所有模块可用的公共工具函数
 */
serviceMemberList.helpers = {
};

/**
 * 包含全局的处理函数
 * @type {Object}
 */
serviceMemberList.handles = {
    //checkbox单选
    checkboxEvent: function(e) {
        e.preventDefault();
        var ele = $(e.target);
        var labelForInput = ele.siblings('#' + ele.attr('for'));
        var checked = labelForInput.prop('checked');
        labelForInput.prop('checked', !checked);
        //目的是为了单选
        //不使用radio的原因是radio必须要有一项选中
        if (!checked) {
            labelForInput.siblings('input[type="checkbox"]').prop('checked', false);
        }
    },

    //省份城市插件
    getUsualAddress: function(){
//  	alert(1);
        $.ajax({
//          url: '/Sell/CustomerService/Home/GetAreaInfoByJson',
			url:'address.json',
            dataType: 'json',
            success: function (data) {
                serviceMemberList.config.addressAjaxData = data;
                $("#usualAddress").selectAddress({
                    data: data,
                    grade: 3,
                    IsNeedSaveButton: 1,
                });
                serviceMemberList.handles.getSessionStorage();
                serviceMemberList.handles.initFilterDialog();
            },
            error: function (error) {
                console.log(error)
            }
        })
    },

    //保存高级筛选弹窗的数据
    saveFilterData: function(){
        var quickFilterChecked = $("#quickFilter").find("input[type='checkbox']:checked");
        var healthLevelSelectChecked=$("#healthLevelSelect").find("option:checked");
        serviceMemberList.config.quickFilterResult.map(function (item, index) {
            if (item.type == "CommonQuery") {
                item.text = quickFilterChecked.next("label").text() || "";
                item.value = quickFilterChecked.next("label").attr("data-value") || "";
            }
            if(item.type=="HealthLevel"){
                item.value = healthLevelSelectChecked.val() || "";
                item.text =  $("#healthLevel").find('label[data-value="' + item.value + '"]').attr("data-text") || "";
            }
        })

        serviceMemberList.config.highFilterResult = [];
        $(".filter-box").find(".filter-item").each(function(index, item){
            var type = $(item).attr('data-type');
            var name = $(item).find('.filter-item-caption').text();
            var control = $(item).find('.filter-item-control');
            var value, text, id;
            switch (type) {
                case 'select': {
                    id = control.find('select').attr('id');
                    value = control.find('select').val();
                    text = control.find('select option:selected').text();
                    break;
                }
                case 'birth': {
                    id = control.find('select').attr('id');
                    value = control.find('select').val();
                    if(value == null){
                        value = 3;
                        text = control.find('.memberBirthVal').text();
                    }else{
                        text = control.find('select option:selected').text();
                    }
                    break;
                }
                case 'area': {
                    id = control.find('.select-address').attr('id');
                    value = control.find('.select-container').attr('data-value');
                    text = control.find('.select-container').text();
                    break;
                }
                case 'age':
                case 'dateRange': {
                    var inputArray = $.makeArray(control.find('input'));
                    id = control.attr('id');
                    value = inputArray.map(function (elem, i) {
                                return $(elem).val();
                            }).join();
                    if(value == ','){
                        value = '';
                    }
                    text = value;
                    break;
                }
                case 'MYDLevel':
                case 'quanyiLevel':{
                    id = control.find('select').attr('id');
                    value = control.find('select').val();
                    text = control.find('select option:selected').text();
                    break;
                }
            }
            var item = {
                id: id,
                name: name,
                value: value,
                text: text,
                type: type
            }
            serviceMemberList.config.highFilterResult.push(item);
        });
        //剩余可用权益
        if ($("#check_tj").prop("checked")) {
            var item = {
                id: "check_tj",
                name: "健康体检剩余" + $("#check_tj").next().next().val()+"次",
                value: $("#check_tj").next().next().val(),
                text: "",
                type: "check_tj"
            }
            serviceMemberList.config.highFilterResult.push(item);
        }
        if ($("#check_gny").prop("checked")) {
            var item = {
                id: "check_gny",
                name: "国内游剩余" + $("#check_gny").next().next().val() + "次",
                value: $("#check_gny").next().next().val(),
                text: "",
                type: "check_gny"
            }
            serviceMemberList.config.highFilterResult.push(item);
        }
        if ($("#check_zbgt").prop("checked")) {
            var item = {
                id: "check_zbgt",
                name: "周边跟团游剩余" + $("#check_zbgt").next().next().val() + "次",
                value: $("#check_zbgt").next().next().val(),
                text: "",
                type: "check_zbgt"
            }
            serviceMemberList.config.highFilterResult.push(item);
        }
        if ($("#check_yl").prop("checked")) {
            var item = {
                id: "check_yl",
                name: "周周活动剩余" + $("#check_yl").next().next().val() + "次",
                value: $("#check_yl").next().next().val(),
                text: "",
                type: "check_yl"
            }
            serviceMemberList.config.highFilterResult.push(item);
        }

        serviceMemberList.handles.setSelectedLabel();
    },

    //创建已选标签
    setSelectedLabel: function(){
        $("#selectedItem").removeClass('none');
        $(".filterResult").find('li.highFilter').remove();
        serviceMemberList.config.highFilterResult.map(function (item, index) {
            if (item.value) {
                if (item.type == "check_tj" || item.type == "check_gny" || item.type == "check_zbgt" || item.type == "check_yl") {
                    $(".filterResult").append('<li class="highFilter"><span data-tagId="' + item.id + '">' + item.name + '</span><i></i></li>');
                } else {
                    $(".filterResult").append('<li class="highFilter"><span data-tagId="' + item.id + '">' + item.name + '：' + item.text + '</span><i></i></li>');
                }
            }
        })
        serviceMemberList.config.quickFilterResult.map(function (item, index) {
            $(".filterResult").find('li.' + item.type).remove();
            if (item.value){
                $(".filterResult").append('<li class="'+ item.type +'"><span>'+ item.text +'</span><i></i></li>');
            }
            //常用筛选的联动与历史记录保持的操作
            if (item.type == "CommonQuery") {
                $("#commonFilter").find('input').prop("checked",false);
                if(item.value){
                    $("#commonFilter").find('label[data-value="' + item.value + '"]').prev("input").prop("checked", true);
                }
            }
            if (item.type == "RightsWarning") {
                $("#equityWarning").find('input').prop("checked",false);
                if(item.value){
                    $("#equityWarning").find('label[data-value="' + item.value + '"]').prev("input").prop("checked", true);
                }
            }
            if (item.type == "IsBeneficiary") {
                $("#onlyFavoree").prop("checked",false);
                if(item.value){
                    $("#onlyFavoree").prop("checked", true);
                }
            }
            if(item.type=="IsRemoveQuitMember"){
                $("#excludeMembers").prop("checked",false);
                if(item.value){
                    $("#excludeMembers").prop("checked", true);
                }
            }
			if(item.type=="HealthLevel"){
			    $("#healthLevel").find('input').prop("checked",false);
               if(item.value){
                    $("#healthLevel").find('label[data-value="' + item.value + '"]').prev("input").prop("checked", true);
                }
            }
        })
        if($(".filterResult").find('li').length == 0){
            $("#selectedItem").addClass('none');
        }
        //防止重复跑列表  第二次跑缓存时才加载
        if (SessionStorageCount > 0) {
            serviceMemberList.handles.getServicerMemberList(1);
        }
        sessionStorage.serviceMemberListHighFilterResult = JSON.stringify(serviceMemberList.config.highFilterResult);
        sessionStorage.serviceMemberListQuickFilterResult = JSON.stringify(serviceMemberList.config.quickFilterResult);
    },

    //快捷查询的标签
    quickQueryLabel: function(){
        var phone = /^1\d{10}$/;
        var num = /^[0-9]*$/;
        var queryVal = $("#quickQuery").val();
        var querySelectedText = $("#quickQuery").find("option:selected").text();
        var queryInputText = $("#quickText").val().trim();
        $(".filterResult").find('li.quickQuery').remove();
        sessionStorage.serviceMemberListQuickQuery = "";
        if (queryInputText != '' && queryInputText != null) {
            if(queryVal == "MobileAndMemberId"){
                if (num.test(queryInputText)) {
                    if (phone.test(queryInputText)) {
                        querySelectedText = "手机号码";
                        queryVal = "Mobile";
                    } else {
                        querySelectedText = "会员ID";
                         queryVal = "MemberId";
                    }
                }else{
                    layer.alert("请输入正确的会员ID或手机号！", {
                        icon: 0
                    });
                    return false;
                }
            }
            if(queryVal == "OrderId"){
                if (!num.test(queryInputText)) {
                    layer.alert("请输入正确的百旅订单号！", {
                        icon: 0
                    });
                    return false;
                }
            }
            $("#selectedItem").removeClass('none');
            var quickQueryText = querySelectedText + '：' + queryInputText;
            $(".filterResult").append('<li class="quickQuery" data-type="'+ queryVal +'"><span data-value="'+ queryInputText +'">'+ quickQueryText +'</span><i></i></li>');
            var quickQuery = {
                selectValue: queryVal,
                dataValue: queryInputText,
                dataText: quickQueryText
            }
            sessionStorage.serviceMemberListQuickQuery = JSON.stringify(quickQuery);
        }
		//客服部门和工号
		var servicerInfo = [];
		$(".filterResult").find('li.departmentSearch').remove();
		$(".filterResult").find('li.servicerSearch').remove();
		sessionStorage.serviceMemberListServicerInfo = [];
		if($("#treeviewdep").val() !== "" && $("#treeviewdep").val() != "0" && $("#treeviewdep").val()){
			var departmentSearchText = $("#treeviewdep").find("option:selected").text();
			var departmentSearchId = $("#treeviewdep").val();
			servicerInfo.push({
				type: 'departmentSearch',
				text: departmentSearchText,
				id: departmentSearchId
			})
			$("#selectedItem").removeClass('none');
            $(".filterResult").append('<li class="departmentSearch" data-id="'+ departmentSearchId +'"><span>'+ departmentSearchText +'</span><i></i></li>');
            sessionStorage.serviceMemberListServicerInfo = JSON.stringify(servicerInfo);
		}
		if($("#servicerSearch .eui-input").val() !== "" && $("#servicerSearch .eui-input").attr("data-id")){
			var servicerSearchText = $("#servicerSearch .eui-input").val();
			var servicerSearchId = $("#servicerSearch .eui-input").attr("data-id");
			servicerInfo.push({
				type: 'servicerSearch',
				text: servicerSearchText,
				id: servicerSearchId
			})
			$("#selectedItem").removeClass('none');
            $(".filterResult").append('<li class="servicerSearch" data-id="'+ servicerSearchId +'"><span>'+ servicerSearchText +'</span><i></i></li>');
            sessionStorage.serviceMemberListServicerInfo = JSON.stringify(servicerInfo);
		}
		if($(".filterResult").find('li').length == 0){
            $("#selectedItem").addClass('none');
        }
        serviceMemberList.handles.getServicerMemberList(1);
    },

    //初始化高级筛选的弹窗
    initFilterDialog: function(){
        serviceMemberList.config.quickFilterResult.map(function (item, index) {
            if (item.type == "CommonQuery") {
                $("#quickFilter").find('input').prop("checked",false);
                if(item.value){
                    $("#quickFilter").find('label[data-value="' + item.value + '"]').prev("input").prop("checked", true);
                }
            }
            if (item.type == "HealthLevel") {
                $("#healthLevelSelect").val(item.value);
            }
        });
        serviceMemberList.handles.highFilterLinkage();
        if(serviceMemberList.config.highFilterResult){
            serviceMemberList.config.highFilterResult.map(function(item, index){
                if(!item.value){
                    switch (item.type) {
                        case 'select': {
                            $("#"+ item.id).val("");
                            break;
                        }
                        case 'birth': {
                            $("#"+ item.id).val("").trigger('change');
                            $("#memberBirth").find("input").val("");
                            break;
                        }
                        case 'area': {
                            $("#usualAddress .address-emptyBtn").trigger('click');
                            $("#usualAddress .address-saveBtn").trigger('click');
                            break;
                        }
                        case 'age':
                        case 'dateRange': {
                            $("#"+ item.id).find("input").val("");
                            break;
                        }
                        case 'quanyiLevel':
                            $("#quanyiLevelSelect").val("");
                            break;
                        case 'MYDLevel':
                            $("#MYDLevelSelect").val("");
                            break;
                        case 'check_tj':
                            $("#check_tj").prop("checked", false);
                            $("#check_tj").next().next().val(0);
                            break;
                        case 'check_gny':
                            $("#check_gny").prop("checked", false);
                            $("#check_gny").next().next().val(0);
                            break;
                        case 'check_zbgt':
                            $("#check_zbgt").prop("checked", false);
                            $("#check_zbgt").next().next().val(0);
                            break;
                        case 'check_yl':
                            $("#check_yl").prop("checked", false);
                            $("#check_yl").next().next().val(0);
                            break;
                    }
                }
            });
        }
    },

    //高级筛选与日期,生日等的联动
    highFilterLinkage: function(){
        $(".filter-item[data-type='dateRange']").find('input').attr("disabled", false);
        $("#birthday").attr("disabled", false);
        $('#groupStatus').attr("disabled",false);
        var quickFilterChecked = $("#quickFilter").find("input[type='checkbox']:checked");
        if(quickFilterChecked.length){
            var quickVal = quickFilterChecked.next("label").attr('data-value');
            switch (quickVal){
                case "2": {
                    $("#appointTime").find("input").attr("disabled", true).val("");
                    break;
                }
                case "3":{
                    $("#appointTime").find("input").attr("disabled", true).val("");
                    break;
                }
                case "4": {
                    $("#birthday").val("").trigger('change').attr("disabled", true);
                    $("#memberBirth").find("input").val("");
                    break;
                }
                case "7":
                case "8":{
                    $('#groupStatus').attr("disabled",true);
                    break;
                }
            }
        }

        var equityWarningChecked = $("#equityWarning").find("input[type='checkbox']:checked");
        if(equityWarningChecked.length){
            $("#membershipTime").find("input").attr("disabled", true);
        }
    },

    //获取常用筛选和权益预警的会员数目
    getServiceMemberConditionStaticNum: function(){
        var params = {};
        serviceMemberList.config.quickFilterResult.map(function (item, index){
            if(item.type==='IsBeneficiary'||item.type==='IsRemoveQuitMember'){
                params[item.type] = item.value==''?0:item.value;
            }
        });
        
        //被托管人
        var trusteeshipArray = []; 
        var trusteeshipString = '';
        for(var i = 0;i<$('.trusteeship .eui-checkbox').length;i++){
            var _thisEle = $($('.trusteeship .eui-checkbox')[i]);
            if(_thisEle.prop('checked')){
                trusteeshipArray.push(_thisEle.next('label').find('.trusteeshipNum').text());
            }
        }
        trusteeshipString = trusteeshipArray.join(',');
        params.ClientTCNums = trusteeshipString;

        var departmentSearchTag = $(".filterResult").find('li.departmentSearch');
        var servicerSearchTag = $(".filterResult").find('li.servicerSearch');
        var tempDepartIds = departmentSearchTag.length == 0 ? "" : departmentSearchTag.attr("data-id");
        if (tempDepartIds == "" && $("#treeviewdep").val() != "0" && $("#treeviewdep").val()) {
            tempDepartIds = $("#treeviewdep").val();
        }
        params.ChargeDepartId = tempDepartIds;
        params.ChargeJobNum = servicerSearchTag.length == 0 ? "" : servicerSearchTag.attr("data-id");
        $.ajax({
            url: '/Sell/CustomerService/WeChatServiceMemberList/ServiceMemberConditionStatic',
            data: params,
            dataType: 'json',
            success: function(data) {
                if (data.ResCode == 1000) {
                    var data = data.Data;
                    $("#commonFilter").find("label i").each(function(index, item) {
                        $(item).removeClass("none");
                        var dataKey = $(item).attr("data-key");
                        $(item).text(data[dataKey]);
                        if (data[dataKey] == 0) {
                            $(item).addClass("none");
                        }
                    });
                    $("#equityWarning").find("label i").each(function(index, item) {
                        $(item).removeClass("none");
                        var dataKey = $(item).attr("data-key");
                        $(item).text(data[dataKey]);
                        if (data[dataKey] == 0) {
                            $(item).addClass("none");
                        }
                    });
                    //$("#healthLevel").find("label i").each(function(index, item) {
                    //    $(item).removeClass("none");
                    //    var dataKey = $(item).attr("data-key");
                    //    $(item).text(data[dataKey]);
                    //    if (data[dataKey] == 0) {
                    //        $(item).addClass("none");
                    //    }
                    //});
                }
                //else if (data.ResCode == 202) {
                //    $("#commonFilter").find("label i").each(function(index, item) {
                //        $(item).addClass("none");
                //    });
                //    $("#equityWarning").find("label i").each(function(index, item) {
                //        $(item).addClass("none");
                //    });
                //}
            },
            error: function(error) {
                console.log(error);
            }
        });
    },

    //分页
    initPagerView: function(curr, count){
        serviceMemberList.config.pager= new PagerView('pager');
        serviceMemberList.config.pager.index = 1;
        serviceMemberList.config.pager.size = 10;
        serviceMemberList.config.pager.onclick = function(index){
            serviceMemberList.handles.getServicerMemberList(index);
        };
    },

    //获取会员列表信息
    getServicerMemberList: function(index) {
        //判断是否有权限
        if (serviceMemberList.config.hasOperatePermission && firstLoadMember != 0 ) {
            serviceMemberList.handles.getServiceMemberConditionStaticNum();
            serviceMemberList.handles.GetHealthLevelPercentStatic();
        }
        firstLoadMember++;
        var params = {};
        params.CurrentPage = index;
        params.PageSize = 10;
        var currSortBtn = $('#serviceMemberList').find('.eui-btn-sort-active');
        params.SortType = currSortBtn.attr('data-value') || "";
        var asceType = currSortBtn.length > 0 && currSortBtn.hasClass('eui-btn-sort-asce') ? 1 : 0;
        var descType = currSortBtn.length > 0 && currSortBtn.hasClass('eui-btn-sort-desc') ? 2 : 0;
        params.IsDescOrAsc = asceType == 0 ? descType : asceType;

        //高级筛选参数
        $("#filterDialog .filter-box").find(".filter-item").each(function(index, item){
            var type = $(item).attr('data-type');
            var control = $(item).find('.filter-item-control');
            switch (type) {
                case 'select': {
                    var selectParam = control.find('select').attr('data-param');
                    params[selectParam] = control.find('select').val();
                    break;
                }
                case 'birth': {
                    params.Birthday = control.find('select').val();
                    if(params.Birthday == null){
                        params.Birthday = 3
                    }
                    params.BirthdayBeginTime = $("#memberBirthBeginTime").val();
                    params.BirthdayEndTime = $("#memberBirthEndTime").val();
                    break;
                }
                case 'area': {
                    var addressId = $("#usualAddress").find('.select-container').attr("data-value");
                    var addressArr = addressId ? addressId.split("-") : [];
                    params.HDProvinceId = addressArr[0] || '';
                    params.HDCityId = addressArr[1] || '';
                    params.HDCountyId = addressArr[2] || '';
                    break;
                }
                case 'age':
                case 'dateRange': {
                    control.find('input').each(function(index, item){
                        var dateparam = $(item).attr("id");
                        dateparam = dateparam.replace(/\b\w+\b/g, function(word){
                          return word.substring(0,1).toUpperCase()+word.substring(1);
                        });
                        params[dateparam] = $(item).val();
                    });
                    break;
                }
                case 'quanyiLevel':
                    params.MHLQuanyiLevel=control.find('select').val();
                    break;
                case 'MYDLevel':
                    params.MHLMYDLevel=control.find('select').val();
                    break;
            }
        });
        //剩余可用权益
        if ($("#check_tj").prop("checked")) {
            params.SurplusRights_tj = 1;
            params.SurplusRightsCount_tj = $("#check_tj").next().next().val();
        }
        if ($("#check_gny").prop("checked")) {
            params.SurplusRights_gny = 4;
            params.SurplusRightsCount_gny = $("#check_gny").next().next().val();
        }
        if ($("#check_zbgt").prop("checked")) {
            params.SurplusRights_zbgt = 2;
            params.SurplusRightsCount_zbgt = $("#check_zbgt").next().next().val();
        }
        if ($("#check_yl").prop("checked")) {
            params.SurplusRights_zbgt = 3;
            params.SurplusRightsCount_zbgt = $("#check_yl").next().next().val();
        }
        //快捷筛选参数
        serviceMemberList.config.quickFilterResult.map(function (item, index){
            params[item.type] = item.value;
        });

        //快捷查询参数
        var concatKeyArrs = ['Mobile', 'MemberId', 'MemberName', 'RecentRemark', 'OrderId'];
        for (var i = 0; i < concatKeyArrs.length; i++) {
                params[concatKeyArrs[i]] = '';
        }
        var quickQueryItem = $(".filterResult").find('li[class="quickQuery"]')
        if(quickQueryItem.length){
            quickQueryItem.each(function (index, item){
                var itemType = $(item).attr("data-type");
                params[itemType] =  $(item).find("span").attr("data-value");
            })
        }
        //活跃度查询
        var healthLevelChecked=$("#healthLevel").find("input:checked");
        healthLevelChecked.map(function (){
            params.MHLHelthLevel=$(this).next("label").attr("data-value");
        });
        //被托管人
        var trusteeshipArray = []; 
        var trusteeshipString = '';
        for(var i = 0;i<$('.trusteeship .eui-checkbox').length;i++){
            var _thisEle = $($('.trusteeship .eui-checkbox')[i]);
            if(_thisEle.prop('checked')){
                trusteeshipArray.push(_thisEle.next('label').find('.trusteeshipNum').text());
            }
        }
        trusteeshipString = trusteeshipArray.join(',');
        params.ClientTCNums = trusteeshipString;

		 var departmentSearchTag = $(".filterResult").find('li.departmentSearch');
		 var servicerSearchTag = $(".filterResult").find('li.servicerSearch');
		 var tempDepartIds = departmentSearchTag.length == 0 ? "" : departmentSearchTag.attr("data-id");
		 if (tempDepartIds == "" && $("#treeviewdep").val() != "0" && $("#treeviewdep").val()) {
		     tempDepartIds = $("#treeviewdep").val();
		 }
		 params.ChargeDepartId = tempDepartIds;
		 params.ChargeJobNum = servicerSearchTag.length == 0 ? "" : servicerSearchTag.attr("data-id");

        var xhr = serviceMemberList.handles.getServicerMemberList.xhr;
        if (xhr != null && xhr.readyState !== 4) {
            xhr.abort();
        }
        serviceMemberList.handles.getServicerMemberList.xhr = $.ajax({
            url: '/Sell/CustomerService/WeChatServiceMemberList/GetServicerMemberList',
            type: 'POST',
            data: params,
            dataType: "json",
            timeout: 20000,
            beforeSend: function () {
                eLoading.show();
            },
            success: function (data) {
                eLoading.hide();
                $("#serviceMemberList tbody").empty();
                if(data.Success && data.Data != null){
                    serviceMemberList.handles.setServicerMemberList(data.Data);
                }else{
                    $("#serviceMemberList tbody").append('<tr><td colspan="9" style="text-align: center;">暂无数据</td></tr>');
                    //if(data.Code == '201'){
                    //	layer.msg(data.Msg);
                    //}
                }
                serviceMemberList.config.pager.index = index;
                serviceMemberList.config.pager.itemCount = data.RecordCount;
                serviceMemberList.config.pager.render();
            },
            error: function (error) {
                eLoading.hide();
                console.log(error)
            }
        })
    },

    //拼接会员列表数据
    setServicerMemberList: function(listData){
        var listHtml = "";
        listData.forEach(function(item,index){
            listHtml += '<tr data-memberId="' + item.MemberId + '">';
            if (item.Sex) {
                item.Sex = item.Sex == 1 ? "（男）" : "（女）";
            } else {
                item.Sex = "";
            }
            var iconHtml = "";
            iconHtml += (item.IsPurchaser) ? '<i class="purchaser" data-value="0"><em class="orderList"></em></i>' : '';
            if (item.OrderId != 0) {
                if (item.CustomerType!=1) {
                    iconHtml += (item.IsGoldenCareVersion) ? '<i class="golden" data-value="1"><em class="orderList"></em></i>' : '';
                    iconHtml += (item.IsWhiteGoldenRomanticVesion) ? '<i class="whiteGolden" data-value="2"><em class="orderList"></em></i>' : '';
                    iconHtml += (item.IsPlatinumRomanticVesion) ? '<i class="platinum" data-value="4"><em class="orderList"></em></i>' : '';
                    iconHtml += (item.IsImportantVesion) ? '<i class="important" data-value="8"><em class="orderList"></em></i>' : '';
                    iconHtml += (item.IsBusinessVesion) ? '<i class="business" data-value="16"><em class="orderList"></em></i>' : '';
                }
            } else {
                iconHtml += (item.IsGoldenCareVersion) ? '<i class="golden" data-value="1"><em class="orderList"></em></i>' : '';
                iconHtml += (item.IsWhiteGoldenRomanticVesion) ? '<i class="whiteGolden" data-value="2"><em class="orderList"></em></i>' : '';
                iconHtml += (item.IsPlatinumRomanticVesion) ? '<i class="platinum" data-value="4"><em class="orderList"></em></i>' : '';
                iconHtml += (item.IsImportantVesion) ? '<i class="important" data-value="8"><em class="orderList"></em></i>' : '';
                iconHtml += (item.IsBusinessVesion) ? '<i class="business" data-value="16"><em class="orderList"></em></i>' : '';
            }
            listHtml += '<td><div class="memberInfo" data-membername="' + item.MemberName + '">' + item.MemberName + item.Sex + iconHtml + '</div><div class="mobile"><i></i>' + item.Mobile + '</div></td>';
            listHtml += '<td><label class="healthLevelStatus healthLevelColor'+item.MHLHelthLevel+'">'+item.MHLHelthLevelDesc+'</label></td>'
            if (!item.Birthday || item.Birthday == "1900-01-01" || item.Birthday=="1970-01-01") {
                listHtml += '<td>--</td>';
            }else{
                listHtml += '<td><div>'+ item.Age +'岁</div><div>（'+ item.Birthday +'）</div></td>';
            }
            item.HDCityName = item.HDCityName ? '-' + item.HDCityName : "";
            item.HDCountyName = item.HDCountyName ? '-' + item.HDCountyName : "";
            listHtml += '<td>'+ item.HDProvinceName + item.HDCityName + item.HDCountyName + '</td>';
            listHtml += '<td>'+ item.RightsInterval +'</td>';
            listHtml += '<td>' + item.AvailablePoints + '</td>';
            //var servicerData = item.ServicerTCNum && item.ServicerName ? item.ServicerName + '（' + item.ServicerTCNum + '）' : '--';
            if ($('.trusteeship').length > 0 && item.ServicerTCNum != $('#jobNum').val()) {
                var servicerData = item.ServicerTCNum && item.ServicerName ? '<span style="color:#ff6600">'+item.ServicerName + '（' + item.ServicerTCNum + '）</span>' : '--';
            } else {
                var servicerData = item.ServicerTCNum && item.ServicerName ? item.ServicerName + '（' + item.ServicerTCNum + '）' : '--';
            }
            listHtml += '<td>' + servicerData + '</td>';
            var LastFollowHtml = '';
            if(!item.LastFollowTime || item.LastFollowTime == "1900-01-01 00:00" || item.LastFollowTime == "1970-01-01 00:00"){
                LastFollowHtml = "<div>暂未跟进</div>";
            }else{
                LastFollowHtml = '<div title="'+ item.LastFollowTime +'">最近跟进: '+ item.LastFollowTime +'</div><div class="lastFollowRemark" title=""></div>';
                var $followWp = $('<div></div>');
                $followWp.append(LastFollowHtml);
                $followWp.find('.lastFollowRemark').attr('title', item.LastFollowRemark);
                $followWp.find('.lastFollowRemark').text('备注：' + item.LastFollowRemark);
                LastFollowHtml = $followWp.html();
            }
            listHtml += '<td class="lastFollow">' + LastFollowHtml + '</td>';
            listHtml += '<td>';
            if (item.OrderId != 0) {
                if (item.MemberServiceType == 8) {
                    listHtml += '<button type="button" class="eui-btn eui-btn-edit confirmExitYaokeGroupBtn" data-spmcontrolid="spm_confirmExitYaokeGroupBtn" data-spmvalue="7" data-orderid="' + item.OrderId + '" data-servicetype="' + item.MemberServiceType + '">退会确认</button>';
                } else {
                    listHtml += '<button type="button" class="eui-btn eui-btn-edit confirmExitGroupBtn" data-spmcontrolid="spm_confirmExitGroupBtn" data-spmvalue="6" data-orderid="' + item.OrderId + '" data-servicetype="' + item.MemberServiceType + '">退群确认</button>';
                }
            }
            listHtml += '<button type="button" class="eui-btn eui-btn-edit detailBtn" data-spmcontrolid="spm_detailBtn" data-spmvalue="1">详情</button>';
            listHtml += '</td></tr>';

        })
        $("#serviceMemberList tbody").append(listHtml);
        spm.init();
    },

    //获取客服会员所有订单号
    getServicerMemberOrderList: function(elem){
        var orderListData = elem.data("orderList");
        if(!orderListData){
           $.ajax({
               url: '/Sell/CustomerService/WeChatServiceMemberList/GetServicerMemberOrderList',
               dataType: 'json',
               data: {
                   CurrentPage: 1,
                   PageSize: 2,
                   MemberServiceType: elem.attr("data-value") == '0' ? "" : elem.attr("data-value"),
                   MemberId: parseInt(elem.parents("tr").attr("data-memberid"))
               },
               success: function (data) {
                   if(data.Success && data.Data != null){
                       elem.data("orderList", data.Data);
                       serviceMemberList.handles.setServicerMemberOrderList(elem, data.Data);
                   }else{
                       elem.find(".orderList").html("暂无订单号");
                   }
               },
               error: function (error) {
                   console.log(error)
               }
           })
        }else{
          serviceMemberList.handles.setServicerMemberOrderList(elem, orderListData);
        }
    },

    //设置客服会员所有订单号
    setServicerMemberOrderList: function(elem, orderListData){
        var orderTitle = (elem.attr("data-value") == '0') ? "已支付订单" : "对应权益订单";
        elem.find(".orderList").empty().append("<h3>"+ orderTitle +"</h3><ul></ul>")
        orderListData.forEach(function (item, index){
            var orderTip = (elem.attr("data-value") == '0') ? "订单"+ (index + 1) + "：" : "订单号：";
            elem.find(".orderList ul").append('<li>' + orderTip + '<a href="http://tcservice.17usoft.com/travel/vipclub/blh_orderinfo/details?orderid='+ item.OrderId +'" target="_blank">'+ item.OrderId +'</a></li>');
        })
    },

    //获取链接参数
    getQueryStringArgs: function(){
        var qs = (location.search.length > 0 ? location.search.substring(1) : '');
        var args = {};
        var items = qs.length ? qs.split('&') : [];
        var item = null;
        var name = null;
        var value = null;
        var i = 0;
        var len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split('=');
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    },
    //打开跟进页面
    alertEditDialog:function(memberId, FollowType ,isActivityAppoint){
        try {
            var topWindow_body = window.top.document.body;
            var dialogHtml = '<div id="editDialog-' + memberId + '" style="position: fixed; width: 100%; height: 100%;' +
                    ' left: 0; top: 0; z-index: 999;">' +
                    '<iframe style="width: 100%; height: 100%; border-width: 0;"' +
                    ' src="/Sell/CustomerService/WeChatGroupFollow/Index?memberid=' + memberId + '&followAim=' + FollowType + '&isActivityAppoint='+ isActivityAppoint+'"></iframe></div>';
            if ($(topWindow_body).find('#editDialog-' + memberId).length > 0) {
                $(topWindow_body).find('#editDialog-' + memberId).replaceWith(dialogHtml);
            }
            else {
                $(topWindow_body).append(dialogHtml);
            }
        }
        catch(err) {
            var iframeUrl = location.origin + '/Sell/CustomerService/WeChatGroupFollow/Index?memberid=' + memberId + '&followAim=' + FollowType + '&isActivityAppoint='+ isActivityAppoint;
            var message = {
                key: 'openIframe',
                params: { 'memberId': memberId, 'iframeUrl': iframeUrl, 'dialogId': 'editDialog-' + memberId }
            };
            window.parent.postMessage(message, '*');
        }
    },

    //获取本地缓存
    getSessionStorage: function(){
        if (sessionStorage.serviceMemberListNeedSort) {
            var needSortStorage = JSON.parse(sessionStorage.serviceMemberListNeedSort);
            $("#serviceMemberList").find("button[data-value=" + needSortStorage.dataValue + "]").addClass('eui-btn-sort-active eui-btn-sort-' + needSortStorage.dataState);
        }
        if (sessionStorage.serviceMemberListQuickQuery) {
            var quickQueryStorage = JSON.parse(sessionStorage.serviceMemberListQuickQuery);
            $("#selectedItem").removeClass('none');
            $(".filterResult").find(".quickQuery").remove();
            $(".filterResult").append('<li class="quickQuery" data-type="'+ quickQueryStorage.selectValue +'"><span data-value="'+ quickQueryStorage.dataValue +'">'+ quickQueryStorage.dataText +'</span><i></i></li>');
        }
        if(sessionStorage.serviceMemberListServicerInfo){
			var servicerInfoStorage = JSON.parse(sessionStorage.serviceMemberListServicerInfo);
			$("#selectedItem").removeClass('none');
            $(".filterResult").find(".departmentSearch, .servicerSearch").remove();
			servicerInfoStorage.forEach(function(item, index){
				$(".filterResult").append('<li class="'+ item.type +'" data-id="'+ item.id +'"><span>'+ item.text +'</span><i></i></li>');
			})
        }
        if (sessionStorage.serviceMemberListHighFilterResult) {
            serviceMemberList.config.highFilterResult = JSON.parse(sessionStorage.serviceMemberListHighFilterResult);
        }
        if (sessionStorage.serviceMemberListQuickFilterResult) {
            serviceMemberList.config.quickFilterResult = JSON.parse(sessionStorage.serviceMemberListQuickFilterResult);
        }
        serviceMemberList.handles.sessionStorageFilterDialog();
        serviceMemberList.handles.setSelectedLabel();
        SessionStorageCount++;
    },

    //历史记录弹窗显示
    sessionStorageFilterDialog: function(){
        serviceMemberList.handles.highFilterLinkage();
        if(serviceMemberList.config.highFilterResult){
            serviceMemberList.config.highFilterResult.map(function(item, index){
                if(item.value){
                    switch (item.type) {
                    case 'select':
                    {
                        $("#" + item.id).val(item.value);
                        break;
                    }
                    case 'birth':
                    {
                        $("#" + item.id).val(item.value);
                        var selectVal = $("#" + item.id).find("option:selected").text();
                        $(".memberBirthVal").text(selectVal);
                        if (item.value == 3) {
                            $("#" + item.id).val("birth").trigger("click");
                            var birthArray = item.text.split(",");
                            $("#memberBirthBeginTime").val(birthArray[0]);
                            $("#memberBirthEndTime").val(birthArray[1]);
                            $(".memberBirthVal").text(item.text);
                        }
                        break;
                    }
                    case 'area':
                    {
                        if (serviceMemberList.config.addressAjaxData) {
                            var areaArray = item.value.split("-");
                            $("#usualAddress")
                                .selectAddress({
                                    data: serviceMemberList.config.addressAjaxData,
                                    grade: 3,
                                    IsNeedSaveButton: 1,
                                    proviceID: parseInt(areaArray[0]), //默认省份
                                    cityID: parseInt(areaArray[1]), //默认城市
                                    countryID: parseInt(areaArray[2]), //默认区县
                                });
                        }
                        break;
                    }
                    case 'age':
                    case 'dateRange':
                    {
                        var dateArray = item.value.split(",");
                        $("#" + item.id).find("input").eq(0).val(dateArray[0]);
                        $("#" + item.id).find("input").eq(1).val(dateArray[1]);
                        break;
                    }
                    case 'quanyiLevel':
                        $("#quanyiLevelSelect").val(item.value);
                        break;
                    case 'MYDLevel':
                        $("#MYDLevelSelect").val(item.value);
                        break;
                    case 'check_tj':
                        $("#check_tj").prop("checked", true);
                        $("#check_tj").next().next().val(item.value);
                        break;
                    case 'check_gny':
                        $("#check_gny").prop("checked", true);
                        $("#check_gny").next().next().val(item.value);
                        break;
                    case 'check_zbgt':
                        $("#check_zbgt").prop("checked", true);
                        $("#check_zbgt").next().next().val(item.value);
                        break;
                    case 'check_yl':
                        $("#check_yl").prop("checked", true);
                        $("#check_yl").next().next().val(item.value);
                        break;
                    }
                }
            });
        }
    },

	//获取部门和客服工号
    getDeptartAndJobNum: function () {
		var currTree = {
            data: '/Sell/CustomerService/Home/GetChargeDepartInfoList',
            showCheckbox: 1,
            checkedType: 2,
            valueType: 1,
            hidIds: 'id',
            hidNames: 'name',
            treeId: 'treeview-ddlDeptart'
        };
		function createTerr(currTree) {
		    var oldAsync = $.ajaxSettings.async;
		    $.ajaxSettings.async = false;
            $.getJSON(currTree.data)
                .done(function (data) {
                    JsonStr = data;
                    if ($("#hidDepartId").val() > 0) {
                        $.each(JsonStr, function (i, n) {
                            if (n.id == $("#hidDepartId").val()) {
                                $("#hidDepartId option").val(n.id);
                                $("#hidDepartId option").text(n.name);
                                return false;
                            }
                        });
                    }
                    var dtpIds = serviceMemberList.handles.getDepartmentPidIsEmpty(data);
                    if (dtpIds != "") {
                        $("#treeviewdep").find("option").eq(0).val(dtpIds);
                    }
                    initTreeData(data, currTree, 1);
                });
            $.ajaxSettings.async = oldAsync;
        }
        document.getElementById('treeview-ddlDeptart') && createTerr(currTree);

        $("#servicerSearch").eSearch({
        	'placeholder': '请输入客服姓名或工号',
            'onlySearch':false,//是否仅支持搜索
            'isAjaxSearch':true,//是否为发送异步的搜索框
            'searchData':[],//isAjaxSearch为false时(非异步)的搜索数据
            'searchAjaxURL':'/Sell/CustomerService/Home/GetChargeSeatInfo',//isAjaxSearch为true时(异步)的数据地址
            'searchKey':'JobNum',//搜索关键参数
            'ajaxSearchData': {DepartId:$("#treeviewdep").val()},
            'searchItem':{ //返回数据的字段格式，id代表唯一识别字段，text代表实际显示字段，other代表其他字段
                id:'UIJobNum',
                text:'UIText',
                other:''
            },
            onBeforeSend: function(ajaxPara) {
            	ajaxPara.DepartId = $("#treeviewdep").val();
            	return ajaxPara;
            },
            onGetData: function(data) {
            	var isSameValue = data.length == 1 && data[0].UIText == $("#servicerSearch").find(".eui-input").val();
            	if(!isSameValue){
            		$("#servicerSearch").find(".eui-input").attr("data-id", "")
            	}
            	return data;
            },
            'onSearch':null,//仅支持搜索功能时的回调函数  具有一个参数——为匹配到的返回数据
            'onSelected':null//点击选中搜索列表时的回调函数 默认为null
        });
    },
    /**
         * 页面初始化加载被托管人
         */
    getTrusteeship: function() {
        $.ajax({
            url:'/Sell/CustomerService/UserConfiguration/GetTrusteeshipMeList',
            dataType: 'json',
            async: false,
            success: function(data){ 
                $('#serviceMemberFilter .trusteeship').remove();
                if(data.IsSuccess && data.Data != null && data.Data.length > 0){
                    var trusteeshipPerson = '';
                    var person = '';
                    for(var i = 0;i<data.Data.length;i++){
                        person += `<input type="checkbox" id="checkbox-${i+1}" name="checkbox" class="eui-checkbox" checked>
                        <label for="checkbox-${i+1}"><span class="trusteeshipName">${data.Data[i].WTClientName}<span>(<span class="trusteeshipNum">${data.Data[i].WTClientTCNum}</span>)</label>`;
                }  
                trusteeshipPerson = `<div class="trusteeship">
                                           <div class="eui-form-item">
                                               <div class="eui-form-item-caption"><label style="width:70px">被托管人：</label></div>
                                                               <div class="eui-form-item-control">
                                                                    ${person}
                                                               </div>
                                            </div>
                                      </div>`;
                $(trusteeshipPerson).insertAfter($('.rightWarnItem'));
            } 
        }
        }) 
},
    //根据权限初始化部门和客服工号控件
    initDepartServicer: function () {
        var params = {};
        params.uHccType = 6;//微信可查看部门
        $.ajax({
            url: '/Sell/CustomerService/Home/HasOperatePermission',
            dataType: 'json',
            data: params,
            success: function (data) {
                if (data) {
                    serviceMemberList.config.hasOperatePermission = true;
                    $("#departmentSearch").css("display", "block");
                    $("#servicerSearch").css("display", "block");
                } else {
                    serviceMemberList.config.hasOperatePermission = false;
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    },
    getDepartmentPidIsEmpty: function (data) {
        var dptIds = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].pId === 0) {
                    dptIds += data[i].id+",";
                }
            }
        }
        if (dptIds != "") {
            dptIds = dptIds.substring(0, dptIds.length - 1);
        }
        return dptIds;
    },

    //获取常用筛选和权益预警的会员数目
    GetHealthLevelPercentStatic: function () {
        var params = {};
        serviceMemberList.config.quickFilterResult.map(function (item, index) {
            if (item.type === 'IsBeneficiary' || item.type === 'IsRemoveQuitMember') {
                params[item.type] = item.value == '' ? 0 : item.value;
            }
        });

        //被托管人
        var trusteeshipArray = [];
        var trusteeshipString = '';
        for (var i = 0; i < $('.trusteeship .eui-checkbox').length; i++) {
            var _thisEle = $($('.trusteeship .eui-checkbox')[i]);
            if (_thisEle.prop('checked')) {
                trusteeshipArray.push(_thisEle.next('label').find('.trusteeshipNum').text());
            }
        }
        trusteeshipString = trusteeshipArray.join(',');
        params.ClientTCNums = trusteeshipString;

        var departmentSearchTag = $(".filterResult").find('li.departmentSearch');
        var servicerSearchTag = $(".filterResult").find('li.servicerSearch');
        var tempDepartIds = departmentSearchTag.length == 0 ? "" : departmentSearchTag.attr("data-id");
        if (tempDepartIds == "" && $("#treeviewdep").val() != "0" && $("#treeviewdep").val()) {
            tempDepartIds = $("#treeviewdep").val();
        }
        params.ChargeDepartId = tempDepartIds;
        params.ChargeJobNum = servicerSearchTag.length == 0 ? "" : servicerSearchTag.attr("data-id");
        $.ajax({
            url: '/Sell/CustomerService/WeChatServiceMemberList/GetHealthLevelPercentStatic',
            data: params,
            dataType: 'json',
            success: function (data) {
                if (data.ResCode == 1000) {
                    var data = data.Data;
                    $("#healthLevel").find("label i").each(function (index, item) {
                        $(item).removeClass("none");
                        var dataKey = $(item).attr("data-key");
                        $(item).text(data[dataKey]);
                        if (data[dataKey] == "0%" || data[dataKey] == "") {
                            $(item).addClass("none");
                        }
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    //会员退群操作
    memberExitGroup: function (orderid,memberid,servicetype) {
        eLoading.show();
        $.ajax({
            url: '/Sell/CustomerService/WeChatServiceMemberList/MemberExitGroup',
            dataType: 'json',
            data: {
                OrderId: orderid,
                MemberId: memberid,
                MemberServiceType: servicetype,
            },
            success: function (data) {
                if (data && data.ResCode==1000) {
                    eMsg({
                        text: '会员退会成功'
                    });
                    $("#queryBtn").click();
                    $("#exitGroup").eDialog('hide');
                } else {
                    eMsg({
                        text: '会员退会失败'
                    });
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                eLoading.hide();
            }
        })
    },

    //展示待退会的群列表
    getExitGroupList: function (elem) {
        eLoading.show();
        var memberName = elem.parents("tr").find(".memberInfo").attr("data-membername");
        var serviceType = elem.attr("data-servicetype");
        $.ajax({
            url: '/Sell/CustomerService/WeChatServiceMemberList/GetCustomerWeChatGroup',
            dataType: 'json',
            data: {
                MemberId: elem.parents("tr").attr("data-memberid"),
            },
            success: function (data) {
                var html = "";
                html += '<div class="confirmSteps"><span class="step">第一步</span><span class="stepDetail">先在<b>微信</b>中将客户移除对应的微信群</span></div><br />';
                if (data && data.WechatGroupList && data.WechatGroupList.length>0) {
                    html += '<div class="confirmSteps"><span style="width: 58px;padding-left: 5px;"></span><span class="stepDetail"><b>客户</b></span><span class="stepDetail" style="color:#4eb900">"'+memberName+'"</span><span class="stepDetail">所在的大群</span></div><br />';
                    html +='<div class="confirmSteps"><span style="width: 58px;padding-left: 5px;"></span><ul>';
                    $(data.WechatGroupList).each(function(){
                        html += '<li><span class="stepDetail" style="color:#4eb900">' + this.WechatGroupName + '</span><span class="stepDetail">(昵称:</span><span class="stepDetail" style="color:#4eb900">' + this.WechatNickName + '</span><span class="stepDetail">)</span></li>';
                    });
                    html+='</ul></div><br />';
                } else {
                    html += '<div class="confirmSteps"><span style="width: 58px;padding-left: 5px;"></span><span class="stepDetail"><b>系统未找到会员</b></span><span class="stepDetail" style="color:#4eb900">"' + memberName + '"</span><span class="stepDetail">所在的大群</span></div><br />';
                    html += '<div class="confirmSteps"><span style="width: 58px;padding-left: 5px;"></span><span class="stepDetail"><b>请使用</b></span><span class="stepDetail" style="color:#4eb900">手机微信</span><span class="stepDetail">进行查询</span>';
                    html += '<div class="filter-tip"><i class="filter-icon icon-info-sign"></i><div class="filter-tip-cont "><p>微信操作说明：</p>1、在手机微信点击上方搜索框；</p><p>2、在搜索框输入客户姓名/手机号；</p><p>3、搜索结果"群聊"部分会显示客户所在群聊及其昵称。</p></div></div></div><br />';
                }
                html += '<div class="confirmSteps"><span style="width: 58px;padding-left: 5px;"></span><span class="stepDetail">退款订单套餐类型</span><span class="stepDetail" style="color:#4eb900">' + serviceMemberList.handles.getMemberServiceName(serviceType) + '</span></div><br />';
                html += '<div class="confirmSteps"><span class="step">第二步</span><span class="stepDetail">点击<b>"确认"</b>按钮</span></div>';
                $("#exitGroup").find(".eui-dialog-bd").html(html);
                $("#exitGroup").find(".eui-btn-secondary").attr("data-orderid", elem.attr("data-orderid"));
                $("#exitGroup").find(".eui-btn-secondary").attr("data-memberid", elem.parents("tr").attr("data-memberid"));
                $("#exitGroup").find(".eui-btn-secondary").attr("data-servicetype", elem.attr("data-servicetype"));
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                eLoading.hide();
            }
        });
    },

    //根据套餐类型id获取套餐名称
    getMemberServiceName: function (serviceType) {
        var servicename = "";
        switch (serviceType) {
            case "1":
                servicename = "黄金关爱版";
                break;
            case "2":
                servicename = "白金浪漫版";
                break;
            case "4":
                servicename = "铂金浪漫版";
                break;
            case "8":
                servicename = "要客版";
                break;
            case "16":
                servicename = "企业版";
                break;
        }
        return servicename;
    }
};

/**
 * 初始化
 */
    serviceMemberList.pubsub.on('root.init', 'page', function () {
    serviceMemberList.handles.getTrusteeship();
    //初始化部门和客服工号控件
    serviceMemberList.handles.initDepartServicer();
    serviceMemberList.handles.getDeptartAndJobNum();
    //监听跨域操作
    window.addEventListener('message', function (e) {
        var msgData = e.data;
        switch (msgData.key) {
            case 'getServicerMemberList': {
                serviceMemberList.handles.getServiceMemberConditionStaticNum();
                serviceMemberList.handles.GetHealthLevelPercentStatic();
                serviceMemberList.handles.getServicerMemberList(1);
                break;
            }
        }
    }, false);

    //初始化quickFilterResult
    var quickFilter = ["CommonQuery", "RightsWarning", "IsBeneficiary","IsRemoveQuitMember","HealthLevel"];
    quickFilter.forEach(function (item, index){
        var quickFilterObj = {
            type: item,
            text: "",
            value: ""
        }
        if(item==='IsRemoveQuitMember'){
            quickFilterObj={
                type:item,
                text:'排除退会会员',
                value:'1'
            }
        }
        serviceMemberList.config.quickFilterResult.push(quickFilterObj);
    });

    //初始化分页插件
    serviceMemberList.handles.initPagerView();

    //初始化排序
    $(".eui-btn-sort").eSort();

    //判断登录人是否需要清空历史缓存
    var jobNum = $('#jobNum').val();
    if (sessionStorage.serviceMemberListJobNum) {
        var jobNumStorage = sessionStorage.serviceMemberListJobNum;
        if (jobNum != jobNumStorage) {
            sessionStorage.removeItem("serviceMemberListNeedSort");
            sessionStorage.removeItem("serviceMemberListQuickQuery");
            sessionStorage.removeItem("serviceMemberListHighFilterResult");
            sessionStorage.removeItem("serviceMemberListQuickFilterResult");
            sessionStorage.removeItem("serviceMemberListServicerInfo");
        }
    }
    sessionStorage.serviceMemberListJobNum = jobNum;

    //如果IsSkip=1清空sessionStorage
    if (serviceMemberList.handles.getQueryStringArgs()['IsSkip'] == 1) {
        sessionStorage.removeItem("serviceMemberListNeedSort");
        sessionStorage.removeItem("serviceMemberListQuickQuery");
        sessionStorage.removeItem("serviceMemberListHighFilterResult");
        sessionStorage.removeItem("serviceMemberListQuickFilterResult");
        sessionStorage.removeItem("serviceMemberListServicerInfo");
    };

    // //获取历史记录并显示之前筛选的条件
    serviceMemberList.handles.getSessionStorage();

    //url参数获取默认选中按钮
    var args = serviceMemberList.handles.getQueryStringArgs();
    var commonFilterType = typeof args.commonFilterType == 'undefined' ? 0 : args.commonFilterType;
    var equityWarningType = typeof args.equityWarningType == 'undefined' ? 0 : args.equityWarningType;
    $("#commonFilter").find('label[data-value="' + commonFilterType + '"]').trigger('click');
    $("#equityWarning").find('label[data-value="' + equityWarningType + '"]').trigger('click');
    serviceMemberList.handles.getUsualAddress();
    serviceMemberList.handles.getServiceMemberConditionStaticNum();
    serviceMemberList.handles.GetHealthLevelPercentStatic();
    //serviceMemberList.handles.getServicerMemberList(1);
});