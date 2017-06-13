if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
;(function($, w) {
	function Util() {};
	Util.prototype = {

	};


	//w.eui.util = new Util();
})(jQuery, window);
;(function($, w) {

w.eAlert = function(options) {
    var opts = $.extend(true, {}, defaults, options);
    ea.init(opts);
};
w.eAlert.close = function($eAlert) {
    $eAlert.find('.eui-alert-close').trigger('click');
};

var defaults = {
    title: '',
    text: '',
    type: 'warning',
    alertHook: {
        type: '',
        value: ''
    },
    icon: {
        show: true
    },
    cancelButton: {
        show: true,
        text: '取消',
        hook: {
            type: '',
            value: ''
        }
    },
    confirmButton: {
        show: true,
        text: '确定',
        hook: {
            type: '',
            value: ''
        }
    },
    onClose: null,
    onCancel: null,
    onConfirm: null,
    buttons: []
};

var ea = {};
ea.render = function(opts) {
    var titleMap = {
        info: '提示',
        warning: '警告',
        error: '错误',
        success: '成功'
    };
    var title = opts.title == '' ? titleMap[opts.type] : opts.title;
    var text = opts.text;
    var alertIdAttr = opts.alertHook.type === 'id' ? opts.alertHook.value : '';
    var alertClassAttr = opts.alertHook.type === 'class' ? opts.alertHook.value : '';
    alertClassAttr += ' eui-alert-' + opts.type;


    var iconHtml = opts.icon.show ? '<div class="eui-alert-cont-icon"></div>' : '';


    var buttonsHtml = '';
    if (opts.buttons.length > 0) {
        opts.buttons.forEach(function(button, index) {
            var classAttr = button.hook.type === 'class' ? button.hook.value : '';
            var idAttr = button.hook.type === 'id' ? button.hook.value : '';
            buttonsHtml += '' +
                    '<button type="button" class="eui-btn eui-btn-secondary ' + classAttr + '" id="' + idAttr + '">' +
                        button.text +
                    '</button>';
        });
    }
    else {
        var cancelButtonClassAttr = opts.cancelButton.hook.type === 'class' ? opts.cancelButton.hook.value : '';
        var cancelButtonIdAttr = opts.cancelButton.hook.type === 'id' ? opts.cancelButton.hook.value : '';
        var cancelButtonHtml = opts.cancelButton.show ?
                '<button type="button" class="eui-btn eui-btn-cancel eui-alert-cancelBtn ' + cancelButtonClassAttr + '" id="' + cancelButtonIdAttr + '">' + opts.cancelButton.text + '</button>' : '';

        var confirmButtonClassAttr = opts.confirmButton.hook.type === 'class' ? opts.confirmButton.hook.value : '';
        var confirmButtonIdAttr = opts.confirmButton.hook.type === 'id' ? opts.confirmButton.hook.value : '';
        var confirmButtonHtml = opts.confirmButton.show ?
                '<button type="button" class="eui-btn eui-btn-secondary eui-alert-confirmBtn ' + confirmButtonClassAttr + '" id="' + confirmButtonIdAttr + '">' + opts.confirmButton.text + '</button>' : '';

        buttonsHtml = cancelButtonHtml + confirmButtonHtml;
    }


    var alertHtml = '' +
            '<div class="eui-alert ' + alertClassAttr + '" id="' + alertIdAttr + '">' +
                '<div class="eui-alert-mask"></div>' +
                '<div class="eui-alert-cont">' +
                    '<div class="eui-alert-cont-hd">' +
                        '<h3 class="eui-alert-title">' + title + '</h3>' +
                        '<button type="button" class="eui-alert-close"></button>' +
                    '</div>' +
                    '<div class="eui-alert-cont-bd">' +
                        iconHtml +
                        '<div class="eui-alert-cont-text">' + text + '</div>' +
                    '</div>' +
                    '<div class="eui-alert-cont-ft">' + buttonsHtml + '</div>' +
                '</div>' +
            '</div>';

    $('body').append(alertHtml);
    var $eAlert = $('body').find(' > .eui-alert:last-child');
    return $eAlert;
};
ea.bindEvent = function(opts, $eAlert) {
    $eAlert.delegate('.eui-alert-close', 'click', function(event) {
        $eAlert.addClass('eui-alert-removing');
        setTimeout(function() {
            $eAlert.remove();
        }, 300);
        var cbThis = { $eAlert: $eAlert, event: event };
        if ($.isFunction(opts.onClose)) { opts.onClose.call(cbThis); }
    });

    if (opts.buttons.length === 0) {
        $eAlert.delegate('.eui-alert-cancelBtn', 'click', function(event) {
            var $button = $(event.currentTarget);
            var cbThis = { $eAlert: $eAlert, $button: $button, event: event };
            if ($.isFunction(opts.onCancel)) {
                opts.onCancel.call(cbThis);
            }
            else {
                $eAlert.find('.eui-alert-close').trigger('click');
            }
        });

        $eAlert.delegate('.eui-alert-confirmBtn', 'click', function(event) {
            var $button = $(event.currentTarget);
            var cbThis = { $eAlert: $eAlert, $button: $button, event: event };
            if ($.isFunction(opts.onConfirm)) {
                opts.onConfirm.call(cbThis);
            }
            else {
                $eAlert.find('.eui-alert-close').trigger('click');
            }
        });
    }
    else {
        $eAlert.delegate('.eui-alert-cont-ft > button', 'click', function(event) {
            var $button = $(event.currentTarget);
            var index = $eAlert.find('.eui-alert-cont-ft > button').index($button);
            var cbThis = { $eAlert: $eAlert, $button: $button, event: event };
            if ($.isFunction(opts.buttons[index].cb)) {
                opts.buttons[index].cb.call(cbThis);
            }
        });
    }
};
ea.init = function(opts) {
    var $eAlert = ea.render(opts);
    ea.bindEvent(opts, $eAlert);
};

})(jQuery, window);
;(function($, w) {
w.eMsg = function(options) {
    var opts = $.extend(true, {}, defaults, options);
    em.init(opts);
};

var defaults = {
    text: '',
    delay: 0,
    timer: 3000
};

var em = {};
em.render = function(opts) {
    var msgHtml = '' +
            '<div class="eui-msg">' +
                '<div class="eui-msg-mask"></div>' +
                '<div class="eui-msg-cont">' +
                    opts.text +
                '</div>' +
            '</div>';

    setTimeout(function() {
        $('body').append(msgHtml);
        var $eMsg = $('body').find(' > .eui-msg:last-child');
        
        setTimeout(function() {
            $eMsg.addClass('eui-msg-removing');
            
            setTimeout(function() {
                $eMsg.remove();
            }, 300);

        }, opts.timer);

    }, opts.delay);
};
em.init = function(opts) {
    em.render(opts);
};

})(jQuery, window);
/**
	* @弹框插件
	* @author hzh23613
*/
;(function($,window,document){
	var eDialogId;
	var EDialog = function(ele){
		this.element = $(ele);
		this.state = '';
	};

	EDialog.prototype = {
		init:function(){
			this.destroy();
			this.setDialogId();
			this.bindEvent();
		},
		setDialogId:function(){
			eDialogId = 'eui-dialog-';
            eDialogId = this.element.attr('id') != null && (this.element.attr('id')).trim() !== '' ? this.element.attr('id') : eDialogId + EDialog.index;
            this.element.attr('id', eDialogId);
		},
		getDialogId:function(){
			//console.log(eDialogId);
			return eDialogId ;
		},	
		//删除已经初始化的实例
		destroy:function(){
			var hasExist = window.eDialogInstances[this.element.attr('id')] != null;
            if (hasExist) {
                this.element.undelegate('.eui-dialog-btn-close', 'click');
                delete window.eDialogInstances[this.element.attr('id')];
            }
		},
		show:function(){
			if(!this.element.hasClass('show')){
				this.element.addClass('show');
				if($('body').find('.eui-dialog-mask.show').length === 0){
					this.element.find('.eui-dialog-mask').addClass('show');
				}
				this.state = 'show';
				this.element.trigger('change',this.state);
			}
		},
		hide:function(){
			if(this.element.hasClass('show')){
				this.element.removeClass('show');
				if($('body').find('.eui-dialog.show').length === 0){
					this.element.find('.eui-dialog-mask').removeClass('show');
				}	        
				this.state = 'hide';
				this.element.trigger('change',this.state);
            }
		},
		bindEvent:function(){
			var that = this;
			var element = that.element; 
			element.delegate('.eui-dialog-btn-close','click', function(e){
				that.hide();
			});
		}
	};

	EDialog.index = 0;

    /**
     * 如果需要实例化的元素是单个，返回单个对象
     * 如果需要实例化的元素是多个，返回多个对象组成的数组
     */
	$.fn.eDialog = function(state){
		var eDialog,id;
		if(this.length === 1){
			++EDialog.index;
			eDialog = new EDialog(this);
			eDialog.init();
			if (state === 'show') {
				eDialog.show();
			}
			else if (state === 'hide') {
				eDialog.hide();
			}

			id = eDialog.getDialogId();
			window.eDialogInstances[id] = eDialog;

		}else if(this.length >1){
			this.each(function(index,item){
				++EDialog.index;
				eDialog = new EDialog(item);
				eDialog.init();
				if (state === 'show') {
					eDialog.show();
				}
				else if (state === 'hide') {
					eDialog.hide();
				}

				id = eDialog.getDialogId();
				window.eDialogInstances[id] = eDialog;
			});
		}
		//console.log(window.eDialogInstances);
	};



	//全局存放的实例对象，方便快速获取所有的实例
	window.eDialogInstances = {};
})(jQuery,window,document);
/**
 * 搜索  走不走异步
 * icon 用other属性
 * 如果有原select有id的话，就生成一个id
 * 返回一个实例对象，以便扩展
 * 监听select变化 select的value 子节点 option的属性
 * jq动态修改val，节点，自定义属性
 * 暴露出一个update方法
 * trigger change
 * val prop 方法要手动触发一下change事件
 */


;(function($, w) {
    var EDropDown = function(options, element) {
        var defaults = {
            search: false,
            isAjaxSearch:true,//是否为发送异步的搜索框
            searchData:[],//isAjaxSearch为false时(非异步)的搜索数据
            searchAjaxURL:'data.json',//isAjaxSearch为true时(异步)的数据地址
            searchKey:'id',//搜索关键参数
            searchItem:{ //返回数据的字段格式，id代表唯一识别字段，text代表实际显示字段，other代表其他字段             
                id:'id',
                text:'name',
                other:''
            },          
        };

        var $element = $(element);
        var $eDropDown;
        var eDropDownId = 'eui-dropdown-';
        var observer;
        var searchData = [];

        var opts = $.extend({}, defaults, options);

        function init() {
            $eDropDown = $element.next('.eui-dropdown');
            //判断$elemt是不是select，否的话报错
            destory();

            renderHtml();

            bindEvent();
        }

        /**
         * 销毁已存在的实例
         * 由于Jq中remove时便可以解绑元素上的事件
         * 所以不再手动解绑事件，直接remove
         * 或者说不销毁还是用现有的实例
         */
        function destory() {
            var hasEDropDown = $eDropDown.length > 0;
            if (hasEDropDown) {
                //解绑dom监听
                window.eDropDownInst[$eDropDown.attr('id')].observer.disconnect();
                delete window.eDropDownInst[$eDropDown.attr('id')];
                $eDropDown.remove();
                $element.off('change', handleChangeEvent);
            }
        }

        function renderHtml() {
            eDropDownId = ($element.attr('id') || '').trim() !== '' ? 
                    (eDropDownId + $element.attr('id')) : (eDropDownId + EDropDown.index);
            var selectId = ($element.attr('id') || '').trim() !== '' ? 
                    ($element.attr('id')) : ('eui-select-' + EDropDown.index);
            var eDropdownHtml = '' +
                    '<div class="eui-dropdown" id="' + eDropDownId + '">' +
                        '<button type="button" class="eui-dropdown-btn"></button>' +
                        '<div class="eui-dropdown-panel">' +
                            '<div class="eui-dropdown-searchBox"></div>' +
                            '<div class="eui-dropdown-list">' +
                                '<ul class="eui-dropdown-list-initial"></ul>' +
                                '<ul class="eui-dropdown-list-search"></ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

            $element.after(eDropdownHtml);
            $eDropDown = $element.next('.eui-dropdown');
            $element.addClass('eui-select-hide').attr('id', selectId);
            updateEDropDownList();
            //getSearchData();
            //console.log(searchData)
            /*$eDropDown.find('.eui-dropdown-searchBox').eSearch({
                'onlySearch': true,//是否仅支持搜索
                'isAjaxSearch': false,//是否为发送异步的搜索框
                'searchData': searchData,//isAjaxSearch为false时(非异步)的搜索数据
                'searchAjaxURL': 'data.json',//isAjaxSearch为true时(异步)的数据地址
                'searchKey': 'id',//搜索关键参数
                'searchItem':{ //返回数据的字段格式，id代表唯一识别字段，text代表实际显示字段，other代表其他字段             
                    id:'id',
                    text:'name',
                    other:''
                },
                onlySearchCallBack: function(data) {
                    console.log(data);
                }            
            });*/
        }

        function bindEvent() {

            $eDropDown.delegate('.eui-dropdown-list li', 'click', function() {
                var value = $(this).attr('data-value');
                setValue(value);
                updateOptionList($(this));

                $eDropDown.find('.eui-dropdown-btn').trigger('click');              
            });

            $eDropDown.delegate('.eui-dropdown-btn', 'click', function() {
                $('.eui-dropdown').not($eDropDown[0]).find('.eui-dropdown-btn').removeClass('eui-dropdown-btn-active');
                $(this).toggleClass('eui-dropdown-btn-active');
            });

            //监听select元素的子节点的变化, 来动态更新dropdown的内容
            //todo:对select的监听要手动进行解绑
            observer= new MutationObserver(function(mutations) {
                //console.log(mutations);
                updateEDropDownList();
            });
            observer.observe($element[0], {
                childList: true,
                attributes: true,
                subtree: true
            });

            //jq的val方法并不会触发上面的监听，所以单独绑定change事件来触发
            $element.on('change', handleChangeEvent);
        }
        
        function handleChangeEvent() {
            //console.log('change');
            setValue($element.val());            
        }

        function updateEDropDownList() {
            var dropdownInitialListHtml = '';
            $element.find('> option').each(function(index, item) {
                var otherDataAttrList = Object.keys(item.dataset).map(function(key) {
                    return 'data-' + key + '=' + '"' + item.dataset[key] + '"';
                });

                dropdownInitialListHtml += '' +
                        '<li data-value="' + $(item).val() + '" ' + otherDataAttrList.join(' ') + '>' +
                            $(item).text() +
                        '</li>';

            });
            $eDropDown.find('.eui-dropdown-list-initial').html(dropdownInitialListHtml);
            setValue($element.val());           
        }

        function setEDropDownSearchList(data) {
            var dropDownSearchListHtml = '';           
        }

        function getSearchData() {
            searchData = $.makeArray($eDropDown.find('.eui-dropdown-list-initial > li')).map(function(item, index) {
                var dataItem = {};
                dataItem.id = $(item).attr('data-value');
                dataItem.name = $(item).text();
                return dataItem;
            });
        }

        function updateOptionList($listItem) {
            var value = $listItem.attr('data-value');
            if ($element.find('option[value="' + value + '"]').length > 0) {
                $element.val(value);
            }
            else {
                var otherDataAttrList = Object.keys($listItem[0].dataset).map(function(key) {
                    return 'data-' + key + '=' + '"' + $listItem[0].dataset[key] + '"';
                });
                var optionHtml = '' +
                        '<option value="' + value + '" ' + otherDataAttrList.join(' ') + '>' +
                            $listItem.text() +
                        '</option>';
                $element.append(optionHtml);
                $element.val(value);
            }
            $element.trigger('change');
        }

        function setValue(value) {
            var optionEle = $element.find('option[value="' + value + '"]');
            $eDropDown.find('.eui-dropdown-btn').text(optionEle.text()).attr('data-value', value);
            $eDropDown.find('.eui-dropdown-list-item-active').removeClass('eui-dropdown-list-item-active');
            $eDropDown.find('.eui-dropdown-list li[data-value="' + value + '"]').addClass('eui-dropdown-list-item-active');
        }


        init();


        //对外的属性和方法
        return {
            id: eDropDownId,
            observer: observer
        };

    };

    //index用于唯一标志每个EDropDown实例
    EDropDown.index = 0;

    /**
     * 构造函数
     * 如果需要实例化的元素是单个，返回单个对象
     * 如果需要实例化的元素是多个，返回多个对象组成的数组
     */
    $.fn.eDropDown = function(options) {
        var result;
        if (this.length === 1) {
            ++EDropDown.index;
            result = new EDropDown(options, this);
            window.eDropDownInst[result.id] = result;
        }
        else if (this.length > 1) {
            result = [];
            this.each(function() {
                var item = this;
                ++EDropDown.index;
                var edropDownInstance = new EDropDown(options, item);
                result.push(edropDownInstance);
                window.eDropDownInst[edropDownInstance.id] = edropDownInstance;
            });
        }

        return result;
    };
    
    //全局存放的实例对象，方便快速获取所有的实例
    window.eDropDownInst = {};

    $(function() {
        $('body').on('click', function(event) {
            var clickEle = $(event.target);
            var canRemoveClass = clickEle.parents('.eui-dropdown').length === 0;
            if (canRemoveClass) {
                $('.eui-dropdown-btn').removeClass('eui-dropdown-btn-active');
            }       
        });
    });

})(jQuery, window);
;(function($, w) {

var defaults = {
    type: 'checkbox',
    placeholder: '请选择',
    showButton: true,
    allCheckbox: { //checkbox type时有用  当返回的数据里面包含全部时，可以把这个设置为false，但是value要设置
        show: true,
        value: -1,
        text: '全部'
    },
    source: '', //string or array
    sourceRequestType: 'GET',
    defaults: '', // string or array
    disables: '', // string or array
    resultItem: {
        value: '',
        text: '',
        other: ''
    },
    showSearch: false,
    searchPlaceholder: '输入搜索',
    onSearch: null,
    onCheck: null, //每次勾选一个checkbox时的回调
    onConfirm: null, //选中的到了input上面时的回调
    onCancel: null,
    onClear: null,
    onRender: null,
    onBeforeSend: null,
    onGetData: null
};

//eMultiSelect type checkbox
var emc = {};
emc.destroy = function($element) {
    var $eMultiSelect = $element.find('.eui-multiSelect');
    var id = $eMultiSelect.attr('id');
    $element.find('.eui-multiSelect').remove();
    delete w.eMultiSelectInst[id];
};

emc.render = function(opts, $element) {
    var eMultiSelectHtml = `
        <div class="eui-multiSelect" data-type="${opts.type}" data-index=${EMultiSelect.index} 
                id="eui-multiSelect-${$element.attr('id') || EMultiSelect.index}">
            <div class="eui-multiSelect-hd">
                <div class="eui-multiSelect-result eui-input eui-multiSelect-result-empty" placeholder="${opts.placeholder}">
                    ${opts.type === 'button' ? '<ul></ul>' : ''}
                </div>
                <button type="button" class="eui-btn"></button>
            </div>
            <div class="eui-multiSelect-bd">
                <div class="eui-multiSelect-search" style="${opts.showSearch ? '' : 'display: none;'}">
                    <input type="text" class="eui-input" placeholder=${opts.searchPlaceholder}>
                </div>
                <div class="eui-multiSelect-panel">
                    <ul></ul>
                </div>
                <div class="eui-multiSelect-handle" style="${opts.showButton ? '' : 'display: none;'}">
                    <button type="button" class="eui-btn eui-btn-secondary eui-multiSelect-confirm">确定</button>
                    <button type="button" class="eui-btn eui-btn-cancel eui-multiSelect-cancel">取消</button>
                    <button type="button" class="eui-btn eui-btn-cancel eui-multiSelect-clear">清空</button>
                </div>
            </div>
        </div>`;

    $element.html(eMultiSelectHtml);
    var $eMultiSelect = $element.find(' > .eui-multiSelect');

    if ($.isArray(opts.source)) {
        emc.renderList(opts, $eMultiSelect, opts.source);
    }
    else {
        emc.getList(opts, $eMultiSelect);
    }

    return $eMultiSelect;
};

emc.getList = function(opts, $eMultiSelect) {
    var ajaxSendData = {};
    //发送异步前的回调，必须要return ajaxSendData
    if ($.isFunction(opts.onBeforeSend)) {
        var cbThis = { $eMultiSelect: $eMultiSelect };
        ajaxSendData = opts.onBeforeSend.call(cbThis, ajaxSendData);
    }

    var xhr = $.ajax({
        url: opts.source,
        type: opts.sourceRequestType,
        data: ajaxSendData,
        dataType: 'json',
        timeout: 20000,
        beforeSend: function() {
        },
        success: function(data) {
            data = data || [];

            //获取数据后的回调，方便对数据进行格式处理
            //该回调必须显示return 一个数组类型的值
            if ($.isFunction(opts.onGetData)) {
                var cbThis = { $eMultiSelect: $eMultiSelect, xhr: xhr };
                data = opts.onGetData.call(cbThis, data);
            }

            //渲染列表
            emc.renderList(opts, $eMultiSelect, data);
        },
        error: function(a) {
        }
    });
};

emc.handleData = function(opts, $eMultiSelect, data) {
    var allIndex = data.findIndex(function(item) {
        return ('' + item[opts.resultItem.value]) === ('' + opts.allCheckbox.value);
    });
    var hasAll = allIndex > -1;

    if (opts.allCheckbox.show) {
        if (hasAll) {
            data[allIndex][opts.resultItem.value] = opts.allCheckbox.value;
            data[allIndex][opts.resultItem.text] = opts.allCheckbox.text;
        }
        else {
            var allItem = {};
            allItem[opts.resultItem.value] = opts.allCheckbox.value;
            allItem[opts.resultItem.text] = opts.allCheckbox.text;
            data.unshift(allItem);
        }
    }
    else {
        if (hasAll) {
            data.splice(allIndex, 1);
        }
    }

    return data || [];
};

emc.renderList = function(opts, $eMultiSelect, data) {
    var listHtml = ``;
    var eMultiSelectIndex = $eMultiSelect.attr('data-index');
    var allCheckboxId = `#eui-multiSelect-${eMultiSelectIndex}-checkbox-${opts.allCheckbox.value}`;
    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    var otherAttrList = (opts.resultItem.other || '').split(',').filter(function(attr) {
        return (attr || '').trim() !== '';
    });
    var defaultList = $.isArray(opts.defaults) ?
        opts.defaults :
        (opts.defaults || '').split(',').map(function(defaultValue) {
            var defaultItem = {};
            defaultItem[opts.resultItem.value] = defaultValue;
            return defaultItem;
        });
    var disableList = $.isArray(opts.disables) ?
        opts.disables :
        (opts.disables || '').split(',').map(function(disableValue) {
            var disableItem = {};
            disableItem[opts.resultItem.value] = disableValue;
            return disableItem;
        });
    var defaultValue = [];
    var defaultText = [];

    emc.handleData(opts, $eMultiSelect, data).forEach(function(item) {
        var otherAttr = otherAttrList.map(function(attr) {
            return `data-${attr}=${item[attr]}`;
        }).join(' ');

        var checked = defaultList.find(function(defaultItem) {
            return ('' + defaultItem[opts.resultItem.value]) ===  ('' + item[opts.resultItem.value]);
        }) != null;

        var disabled = disableList.find(function(disableItem) {
            return ('' + disableItem[opts.resultItem.value]) ===  ('' + item[opts.resultItem.value]);
        }) != null;

        if (checked) {
            defaultValue.push(item[opts.resultItem.value]);
            defaultText.push(item[opts.resultItem.text]);
        }

        listHtml += `
            <li>
                <input type="checkbox" name="eui-multiSelect-${eMultiSelectIndex}-checkbox" 
                    class="${opts.type === 'checkbox' ? 'eui-checkbox' : 'eui-checkbox-variant'}"
                    id="eui-multiSelect-${eMultiSelectIndex}-checkbox-${item[opts.resultItem.value]}" 
                    value="${item[opts.resultItem.value]}" title="${item[opts.resultItem.text]}"
                    ${otherAttr} ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                <label for="eui-multiSelect-${eMultiSelectIndex}-checkbox-${item[opts.resultItem.value]}" 
                    title=${item[opts.resultItem.text]}>${item[opts.resultItem.text]}</label>
            </li>
        `;
    });

    defaultValue = defaultValue.join().trim();
    defaultText = defaultText.join().trim();

    $list.html(listHtml);

    //判断是否要选中全部
    if (('' + defaultValue) === ('' + opts.allCheckbox.value)) {
        $eMultiSelect.find('.eui-multiSelect-panel input[type="checkbox"]:not(:disabled)').prop('checked', true);
    }
    else {
        var checkedLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId}):checked`).length;
        var checkboxLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId})`).length;
        if (checkboxLength === checkedLength) {
            $eMultiSelect.find('.eui-multiSelect-panel input[type="checkbox"]:not(:disabled)').prop('checked', true);
        }
    }

    //设置选择内容
    var $checkedbox = emc.getCheckedbox(opts, $eMultiSelect);
    emc.setCheckedValue(opts, $eMultiSelect, $checkedbox, true);

    //渲染完成的回调
    if ($.isFunction(opts.onRender)) {
        var cbThis = { $eMultiSelect: $eMultiSelect };
        opts.onRender.call(cbThis);
    }
};

emc.changeCheckboxState = function(opts, $eMultiSelect, $checkbox, checked, forbidCb) {
    $checkbox.prop('checked', checked);

    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    var eMultiSelectIndex = $eMultiSelect.attr('data-index');
    var allCheckboxId = `#eui-multiSelect-${eMultiSelectIndex}-checkbox-${opts.allCheckbox.value}`;
    var $allCheckbox = $list.find(allCheckboxId);
    var exsistAllCheckbox = $allCheckbox.length > 0;
    var checkboxIsAllCheckbox = `#${$checkbox.attr('id')}` === allCheckboxId;
    if (exsistAllCheckbox) {
        if (checkboxIsAllCheckbox) {
            $list.find('input[type="checkbox"]:not(:disabled)').prop('checked', checked);
        }
        else {
            var checkedLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId}):checked`).length;
            var checkboxLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId})`).length;
            if (checkedLength === checkboxLength) {
                $allCheckbox.prop('checked', true);
            }
            else {
                $allCheckbox.prop('checked', false);
            }
        }
    }

    var cbThis = { $eMultiSelect: $eMultiSelect, $checkbox: $checkbox };
    var canCallCb = $.isFunction(opts.onCheck) && (typeof forbidCb === 'undefined' || forbidCb === false);
    if (canCallCb) { opts.onCheck.call(cbThis); }
};

emc.getCheckedbox = function(opts, $eMultiSelect) {
    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    var eMultiSelectIndex = $eMultiSelect.attr('data-index');
    var allCheckboxId = `#eui-multiSelect-${eMultiSelectIndex}-checkbox-${opts.allCheckbox.value}`;
    var $allCheckbox = $list.find(allCheckboxId);
    var exsistAllCheckbox = $allCheckbox.length > 0;
    var $checkedbox = $list.find(`input[type="checkbox"]:not(${allCheckboxId}):checked`);

    if (exsistAllCheckbox) {
        var checkedLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId}):checked`).length;
        var checkboxLength = $list.find(`input[type="checkbox"]:not(${allCheckboxId})`).length;
        if (checkedLength === checkboxLength) {
            $checkedbox = $allCheckbox;
        }
    }

    return $checkedbox;
};

emc.setCheckedValue = function(opts, $eMultiSelect, $checkedbox, forbidCb) {
    var $result = $eMultiSelect.find('.eui-multiSelect-result');
    var checkedboxList = $.makeArray($checkedbox);
    var value = checkedboxList.map(function(checkbox) {
        return $(checkbox).val();
    }).join();
    var text = checkedboxList.map(function(checkbox) {
        var checkboxId = $(checkbox).attr('id');
        return $(checkbox).siblings(`label[for=${checkboxId}]`).text();
    }).join();

    //显隐placeholder
    if (value === '') {
        $result.addClass('eui-multiSelect-result-empty');
    }
    else {
        $result.removeClass('eui-multiSelect-result-empty');
    }

    //分不同的类别给result添加展示的数据
    if (opts.type === 'checkbox') {
        $result.text(text).attr('title', text);        
    }
    else if(opts.type === 'button') {
        var resultListHtml = ``;
        (value || '').split(',').filter(function(valueItem) {
            return ('' + valueItem).trim() !== '';
        }).forEach(function(valueItem, valueIndex) {
            resultListHtml += `<li value="${valueItem}">${(text || '').split(',')[valueIndex]}</li>`;
        });
        $result.find('ul').html(resultListHtml);        
    }

    $result.attr('value', value).attr('text', text);
   

    var cbThis = { $eMultiSelect: $eMultiSelect, $checkedbox: $checkedbox, value: value, text: text };
    var canCallCb = $.isFunction(opts.onConfirm) && (typeof forbidCb === 'undefined' || forbidCb === false);
    if (canCallCb) { opts.onConfirm.call(cbThis); }
};

emc.cancelCheckedbox = function(opts, $eMultiSelect) {
    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    var $selectResult = $eMultiSelect.find('.eui-multiSelect-result');
    var value = ($selectResult.attr('value') || '').trim();

    $list.find('input[type="checkbox"]').prop('checked', false);

    if (('' + value) === ('' + opts.allCheckbox.value)) {
        $list.find('input[type="checkbox"]').prop('checked', true);
    }
    else if (value !== '') {
        value.split(',').forEach(function(valueItem) {
            $list.find(`input[type="checkbox"][value=${valueItem}]`).prop('checked', true);
        });
    }

    var cbThis = { $eMultiSelect: $eMultiSelect };
    if ($.isFunction(opts.onCancel)) { opts.onCancel.call(cbThis); }

    $eMultiSelect.trigger('close');
};

emc.clearCheckedbox = function(opts, $eMultiSelect) {
    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    $list.find('input[type="checkbox"]:not(:disabled)').prop('checked', false);    

    var $checkedbox = emc.getCheckedbox(opts, $eMultiSelect);
    emc.setCheckedValue(opts, $eMultiSelect, $checkedbox, true);

    var cbThis = { 
        $eMultiSelect: $eMultiSelect,
        $checkedbox: emc.getCheckedbox(opts, $eMultiSelect),
        value: $eMultiSelect.find('.eui-multiSelect-result').attr('value'),
        text: $eMultiSelect.find('.eui-multiSelect-result').attr('text')
    };
    if ($.isFunction(opts.onClear)) { opts.onClear.call(cbThis); }

    $eMultiSelect.trigger('close');
};

emc.search = function(opts, $eMultiSelect, inputVal) {
    var $list = $eMultiSelect.find('.eui-multiSelect-panel > ul');
    var $searchedCheckbox = null;
    if (inputVal === '') {
        $list.find('> li').removeClass('eui-multiSelect-item-hidden');
    }
    else {
        $searchedCheckbox = $list.find(`input[type="checkbox"][title*=${inputVal}]`);
        if ($searchedCheckbox.length > 0) {
            $searchedCheckbox.parent().removeClass('eui-multiSelect-item-hidden').siblings('li').addClass('eui-multiSelect-item-hidden');
        }
        else {
            $list.find('> li').addClass('eui-multiSelect-item-hidden');
        }
    }

    var cbThis = { $eMultiSelect: $eMultiSelect, $searchedCheckbox: $searchedCheckbox };
    if ($.isFunction(opts.onSearch)) { opts.onSearch.call(cbThis); }
};

emc.bindEvent = function(opts, $eMultiSelect) {
    $eMultiSelect.delegate('.eui-multiSelect-panel input[type="checkbox"]', 'change', function(event) {
        var $checkbox = $(event.currentTarget);
        var checked = $checkbox.prop('checked');

        emc.changeCheckboxState(opts, $eMultiSelect, $checkbox, checked);

        //当没有“确认”按钮时，每次checkbox状态改变后，都会设置value值
        if (!opts.showButton) {
            var $checkedbox = emc.getCheckedbox(opts, $eMultiSelect);
            emc.setCheckedValue(opts, $eMultiSelect, $checkedbox);
        }
    });

    $eMultiSelect.delegate('.eui-multiSelect-search .eui-input', 'input', function(event) {
        var $input = $(event.currentTarget);
        var inputVal = $input.val().trim();

        setTimeout(function() {
            var inputValAfter500s = $input.val().trim();

            //此时认为用户没有在输入
            if (inputValAfter500s === inputVal) {

                emc.search(opts, $eMultiSelect, inputVal);
            }
        }, 500);
    });

    $eMultiSelect.delegate('.eui-multiSelect-handle .eui-multiSelect-confirm', 'click', function(event) {
        $eMultiSelect.trigger('confirm');
    });

    $eMultiSelect.delegate('.eui-multiSelect-handle .eui-multiSelect-cancel', 'click', function(event) {
        $eMultiSelect.trigger('cancel');      
    });

    $eMultiSelect.delegate('.eui-multiSelect-handle .eui-multiSelect-clear', 'click', function(event) {
        $eMultiSelect.trigger('clear');
    });

    $eMultiSelect.delegate('.eui-multiSelect-result', 'click', function(event) {
        var $clickEle = $(event.currentTarget);

        //eMultiSelect type button 删除已选项
        if ($clickEle.parent().is('li')) {
            return false;
        }
        else {
            $eMultiSelect.toggleClass('eui-multiSelect-open');
        }
    });

    $eMultiSelect.delegate('.eui-multiSelect-result li', 'click', function(event) {
        var $clickEle = $(event.currentTarget);
        var value = $(this).attr('value');
        var $panel = $eMultiSelect.find('.eui-multiSelect-panel');
        var $checkbox = $panel.find(`input[type="checkbox"][value=${value}]`);
        
        $checkbox.prop('checked', false);

        $clickEle.remove();
        emc.changeCheckboxState(opts, $eMultiSelect, $checkbox, false, true);

        var $checkedbox = emc.getCheckedbox(opts, $eMultiSelect);
        emc.setCheckedValue(opts, $eMultiSelect, $checkedbox);  
    });

    $eMultiSelect.delegate('.eui-multiSelect-hd > .eui-btn', 'click', function(event) {
        $eMultiSelect.toggleClass('eui-multiSelect-open');
    });

    $eMultiSelect.on('confirm', function(event) {
        var $checkedbox = emc.getCheckedbox(opts, $eMultiSelect);
        emc.setCheckedValue(opts, $eMultiSelect, $checkedbox);

        $eMultiSelect.trigger('close');
    });

    $eMultiSelect.on('cancel', function(event) {
        emc.cancelCheckedbox(opts, $eMultiSelect);
    });

    $eMultiSelect.on('clear', function(event) {
        emc.clearCheckedbox(opts, $eMultiSelect);
    });

    $eMultiSelect.on('open', function(event) {
        $eMultiSelect.addClass('eui-multiSelect-open');
    });

    $eMultiSelect.on('close', function(event) {
        $eMultiSelect.removeClass('eui-multiSelect-open');
    });
};

emc.init = function(opts, $element) {
    var exsist = $element.find('.eui-multiSelect').length > 0;
    if (exsist) {
        emc.destroy($element);
    }

    var $eMultiSelect = emc.render(opts, $element);
    emc.bindEvent(opts, $eMultiSelect);
};


var EMultiSelect = function(options, $element) {
    ++EMultiSelect.index;
    var opts = $.extend(true, {}, defaults, options);

    if (opts.type === 'checkbox' || opts.type === 'button') {
        emc.init(opts, $element);
    }
    else {
        throw new Error('eMultiSelect type is not right');
    }

    return {
        id: `eui-multiSelect-${$element.attr('id') || EMultiSelect.index}`,
        selector: $element.selector,
        opts: opts,
        render: emc.renderList
    };
};

EMultiSelect.index = 0;

w.eMultiSelectInst = {};

/**
 * 构造函数
 * 如果需要实例化的元素是单个，返回单个对象
 * 如果需要实例化的元素是多个，返回多个对象组成的数组
 */
$.fn.eMultiSelect = function(options) {
    var result;
    if (this.length === 1) {
        result = new EMultiSelect(options, this);
        w.eMultiSelectInst[result.id] = result;
    }
    else if (this.length > 1) {
        result = [];
        this.each(function() {
            var item = this;
            var eMultiSelectInstance = new EMultiSelect(options, item);
            w.eMultiSelectInst[eMultiSelectInstance.id] = eMultiSelectInstance;
            result.push(eMultiSelectInstance);
        });
    }

    return result;
};

$.fn.eMultiSelect.getValue = function(selector) {
    var valueList = [];
    var eMultiSelectList = $.makeArray($(selector).find('.eui-multiSelect'));
    eMultiSelectList.forEach(function(eMultiSelect) {
        valueList.push({
            value: $(eMultiSelect).find('.eui-multiSelect-result').attr('value'),
            id: $(eMultiSelect).attr('id')
        });
    });

    if (valueList.length === 0) {
        throw new Error('not find eMultiSelectInstance');
    }
    else if (valueList.length === 1) {
        return valueList[0].value;
    }
    return valueList;
};

$.fn.eMultiSelect.getText = function(selector) {
    var textList = [];
    var eMultiSelectList = $.makeArray($(selector).find('.eui-multiSelect'));
    eMultiSelectList.forEach(function(eMultiSelect) {
        textList.push({
            text: $(eMultiSelect).find('.eui-multiSelect-result').attr('text'),
            id: $(eMultiSelect).attr('id')
        });
    });

    if (textList.length === 0) {
        throw new Error('not find eMultiSelectInstance');
    }
    else if (textList.length === 1) {
        return textList[0].text;
    }
    return textList;
};

$.fn.eMultiSelect.render = function(selector, data, defaults) {
    var instList = w.eMultiSelectInst;
    var instListFromSelector = [];
    for(var key in instList) {
        if (instList.hasOwnProperty(key) && instList[key].selector === selector) {
            instListFromSelector.push(instList[key]);
        }
    }

    instListFromSelector.forEach(function(inst) {
        inst.opts.defaults = typeof defaults === 'undefined' ? inst.opts.defaults : defaults; 
        inst.render(inst.opts, $(`#${inst.id}`), data || []);
    });
};


$(function() {
    $('body').on('click', function(event) {
        var $clickEle = $(event.target);
        var isClickEleInEMultiSelect = $clickEle.hasClass('eui-multiSelect') || $clickEle.parents('.eui-multiSelect').length > 0;
        if (!isClickEleInEMultiSelect) {
            $('.eui-multiSelect').trigger('close');
        }
    });
});

})(jQuery, window);
/**
 * @模糊搜索插件
 * 目前包括：仅显示搜索框的和支持搜索及搜索条件的两种
 * @author hzh23613
 */

;(function($,window,docment){
    var eSearchListClass = '.eSearchList';
    var ESearch = function(ele,opt){
        this.element = $(ele);
        var defaults = {
            'placeholder':'请输入搜索关键词',//搜索框placeholder
            'onlySearch':false,//是否仅支持搜索
            'isAjaxSearch':false,//是否是异步搜索框
            'searchData':[],//固定的搜索数据
            'searchAjaxURL':'',//异步查找数据地址
            'searchKey':'',//搜索的参数  包括非异步与异步两种
            'ajaxType':'GET',//异步发送的方式 GET or POST,默认POST
            'ajaxSearchData':{},//其余的异步数据 不包括searchKey 会在异步发送时自动拼接到data中
            'searchItem':{              
                id:'id',
                text:'text',
                other:''
            },//返回数据的字段格式  other代表其他字段
            'onBeforeSend': null, //暴露异步发送前的时机，方便一些对传参的处理
            'onSearch':null,//仅支持搜索功能时的回调函数  唯一参数为匹配返回数据
            'onSelected':null,//点击列表的回调
            'onGetData': null//异步获取数据后的回调，方便处理不同格式的返回数据
        };
        this.options = $.extend({},defaults,opt);//将一个空对象做为第一个参数
    };

    ESearch.prototype={
        init:function(){
            var options = this.options;
            this.destroyDOM();
            this.renderDOM();
            this.bindEvent();
        },
        destroyDOM:function() {
            var $eSearchList = this.element.find(eSearchListClass);
            if($eSearchList.length > 0){
                $eSearchList.remove();
            }
        },
        renderDOM:function(){
            var placeholder = this.options.placeholder;
            var ulHtml = '';
            if(!this.options.onlySearch){
                ulHtml = '<ul class="eSearchList"></ul>';
            }
            var mainHTML = ''+
                '<div class="eSearchWrapper">'+
                    '<div class="eui-form-item">'+
                        '<div class="eui-form-item-control">'+
                            '<input type="text" class="eui-input" placeholder="'+ placeholder+'">'+
                            '<i class="input-icon search-icon"></i>'+
                        '</div>'+
                    '</div>'+
                    ulHtml
                +'</div>';
            this.element.html(mainHTML);
        },
        bindEvent:function(){
            var that = this;
            var options = that.options;
            var $inputObj = that.element.find('.eui-input');

            $inputObj.on('focus', { 'options': options }, focusSearchInput);
            $inputObj.on('keyup',{'options':options}, keyupSearchInput);
            $inputObj.on('input', { 'options': options }, inputSearchInput);

            if(!options.onlySearch){
                that.element.on('click','.eSearchList>li',{ 'options': options },function(event){
                    clickSearchLi(event);
                });
            }

            $(document).click(function (e) {
                var obj = $(e.target);
                if (obj.parents('.eSearchWrapper').length == 0) {
                    var eSearchList = that.element.find('ul');
                    if(eSearchList&& eSearchList.is(':visible')){
                        eSearchList.slideUp(500);
                    }
                }
            });

            $('.eSearchWrapper').on('click','.input-icon',function(e){
                var $target = $(e.target);
                $('.eSearchWrapper').find('input').val('');
                if($target.hasClass('remove-icon')){
                    $target.removeClass('remove-icon').addClass('search-icon');
                }
            });
        }
    };

    //数据匹配
    function getSearchResult($obj,options){
        var key = options.searchKey;
        var inputVal = $obj.val().trim();
        var result = [];
        if(!options.isAjaxSearch){//存在默认数据  无需发送异步
            var data = options.searchData;
            var len = data.length;
            if($.isArray(data) && len !== 0){//固定的数据是非空数组类型
                for(var i = 0; i < len; i++){
                    if(data[i][key].indexOf(inputVal) > -1){
                        result.push(data[i]);
                    }
                }
            }
            handleSearchResult($obj,options,result);
        }else{
            var dataStr = '';
            var obj = options.ajaxSearchData;
            if(!options.ajaxSearchData){//不存在ajax数据
                dataStr = options.searchKey + '=' + encodeURIComponent(inputVal);
            }else{
                obj[options.searchKey] = encodeURIComponent(inputVal);
                dataStr = $.param(obj);
            }

            //暴露出接口，方便在发送异步前对发送的数据做处理
            if (options.onBeforeSend != null) {
                obj = options.onBeforeSend(obj);
                dataStr = $.param(obj);
            }            

            $.ajax({
                url: options.searchAjaxURL,
                type:options.ajaxType,
                data: dataStr,
                success: function (data) {
                    result = data;
                    if (typeof data != '$object') {
                        result = eval(data);
                        if (options.onGetData != null) {
                            result = options.onGetData(result);
                        }
                    }
                    handleSearchResult($obj,options,result);
                },
                error: function (err) {
                }
            })
        }
    }

    //处理数据
    function handleSearchResult(obj,options,result){
        if(options.onlySearch){//仅支持搜索功能
            options.onSearch && options.onSearch(result);
        }else{
            initQueryList(obj, result, options);
        }
    }

    //拼接搜索结果列表
    function initQueryList(queryObj, dataList, options) {
        var nameKey = options.searchItem.text;
        var idKey = options.searchItem.id;
        var listWrapper = $(eSearchListClass).empty();
        if (!dataList) {
            listWrapper.append('<li>搜索不到该数据……</li>');
            listWrapper.find('li:last').addClass('disable');
        } else {
            var listLength = dataList.length;

            if (listLength > 0) {
                for (var index = 0; index < listLength; index++) {
                    var otherDataAttr = '';

                    if($.isArray(options.searchItem.other)){
                        otherDataAttr = options.searchItem.other.split(',').map(function(otherKey_item) {
                            return 'data-' + otherKey_item + '="' + dataList[index][otherKey_item] + '"'; 
                        }).join(' ');
                    }

                    listWrapper.append('<li ' + otherDataAttr+' data-id='+ dataList[index][idKey] +'>' + dataList[index][nameKey] + '</li>');
                }
            } else {
                listWrapper.append('<li>搜索不到该数据……</li>');
                listWrapper.find('li:last').addClass('disable');
            }

        }
        if (listWrapper.is(':hidden')) {
            listWrapper.slideDown('500').scrollTop(0);
        }
    }

    function inputSearchInput(event){
        var options = event.data.options;
        var $target = $(event.target);
        var inputVal = $target.val();
        setTimeout(function() {
            var inputValNow = $target.val().trim();
            if (inputVal !== inputValNow) {
                return;
            }
            if($.trim($target.val()) !== '') {
                getSearchResult($target,options);
            }else{
                if(options.onlySearch){
                    options.onSearch && options.onSearch([]);
                }else{
                    if($target.siblings('ul').is(':visible')){
                        $target.siblings('ul').slideUp(500);
                    }
                }
            }
        },500);
    }

    function focusSearchInput(event){
        var options = event.data.options;
        var $target = $(event.target);
        var inputVal = $target.val();
        if($.trim($target.val()) !== '') {
            getSearchResult($target,options);
        }else{
            if(options.onlySearch){
                options.onSearch && options.onSearch([]);
            }else{
                if($target.siblings('ul').is(':visible')){
                    $target.siblings('ul').slideUp(500);
                }
            }
        }
    }
    function keyupSearchInput(event){
        var $target = $(event.target);
        var inputVal = $target.val();
        if($.trim($target.val()) !== ''){
            $target.siblings('.input-icon').removeClass('search-icon').addClass('remove-icon');
        }else{
            $target.siblings('.input-icon').removeClass('remove-icon').addClass('search-icon');
        }
    }

    function clickedSearchLi() {
        $('.eSearchWrapper .input-icon').removeClass('search-icon').addClass('remove-icon');
    }   


    //点击搜索列表方法
    function clickSearchLi(event){
        if(event.target.tagName.toLowerCase() == 'li' || $(event.target).parents('li').length == 1){
            var obj = $(event.target);
            var $eSearchList = obj.parent();
            var options = event.data.options;
            if(!obj.hasClass('disable')){
                var text = obj.text();
                var dataId = obj.attr('data-id');
                var inputObj = $('.eSearchWrapper input[type="text"]');
                inputObj.val(text);
                inputObj.attr('data-id',dataId).blur();
                clickedSearchLi();

                $eSearchList.slideUp('500', function () {
                    $eSearchList.empty();
                });

                if (event.data.options.onSelected) {
                    event.data.options.onSelected.call(obj);
                }
            }
        } 
    }

    //在插件中使用eSearch对象
    $.fn.eSearch = function(options) {    
        var eSearch = new ESearch(this,options);
        eSearch.init();
        return eSearch;
    };
})( jQuery ,window,document ); 

;(function($, w) {

var defaults = {
    placeholder: '',
    searchSource: '',//支持字符串和数组类型
    searchKey: '',
    searchType: 'GET',
    resultItem: {
        value: '',
        text: '',
        other: ''
    },
    multiple: false,
    showClear: false,
    showResult: true,
    onGetResult: null,
    onFocus: null,
    onBlur: null,
    onBeforeSend: null,
    onGetData: null,
    onRender: null,
    onSelected: null,
    onDelete: null,
    onClear: null
};

var es = {};
es.destroy = function($element) {
    var $eSearch2 = $element.find('.eui-search2');
    var id = $eSearch2.attr('id');
    $element.find('.eui-search2').remove();
    delete w.eSearch[id];  
};
es.render = function(opts, $element) {
    var eSearch2Html = `
        <div class="eui-search2" id="eui-search2-${$element.attr('id') || ESearch2.index}">
            <div class="eui-search2-hd">
                <div class="eui-search2-input">
                    <input type="text" class="eui-input" placeholder="${opts.placeholder}">
                    ${opts.showClear ? '<button type="button" class="eui-btn" style="display: none;"></button>' : ''}
                </div>
            </div>
            <div class="eui-search2-bd">
                <div class="eui-search2-list">
                    <ul></ul>
                </div>
            </div>
        </div>`;

    $element.html(eSearch2Html);
    var $eSearch2 = $element.find(' > .eui-search2');
    return $eSearch2;
};
es.renderSearchList = function(opts, $eSearch2, data) {
    var searchListHtml = '';
    var otherAttrList = (opts.resultItem.other || '').split(',').filter(function(attr) {
        return (attr || '').trim() !== '';
    });

    (data || []).forEach(function(item) {
        var otherAttr = otherAttrList.map(function(attr) {
            return `data-${attr}=${item[attr]}`;
        }).join(' ');
        searchListHtml += `
            <li ${otherAttr} data-id="${item[opts.resultItem.value]}">${item[opts.resultItem.text]}</li>
        `;
    });
    $eSearch2.find('.eui-search2-list > ul').html(searchListHtml);

    if ($.isFunction(opts.onRender)) { 
        var cbThis = { $eSearch2: $eSearch2 };
        opts.onRender.call(cbThis); 
    }    
};
es.showMsgInList = function(msg, $eSearch2) {
    var msgHtml = `<li class="eui-search2-list-msg">${msg}</li>`;
    $eSearch2.find('.eui-search2-list > ul').html(msgHtml);    
};
es.handleUserInputEvent = function(opts, $eSearch2, $input) {
    var inputVal = $input.val().trim();

    //用户输入的时候，要把value值清空掉
    $input.attr('data-value', '').attr('title', '');

    if (inputVal === '') {
        $input.siblings('.eui-btn').hide();
    }
    else {
        $input.siblings('.eui-btn').show();
    }

    setTimeout(function() {
        var inputValAfter500s = $input.val().trim();

        //此时认为用户没有在输入
        if (inputValAfter500s === inputVal) {
            es.search(opts, $eSearch2);
        }
    }, 500);     
};
es.search = function(opts, $eSearch2) {
    //展开搜索列表
    $eSearch2.trigger('open');

    if ($.isArray(opts.searchSource)) {
        es.searchFromData(opts, $eSearch2);                    
    }
    else {
        es.searchFromAjax(opts, $eSearch2);
    }  
};
es.searchFromAjax = function(opts, $eSearch2) {
    var eSearch2InstId = $eSearch2.attr('id');

    if (es.searchFromAjax[eSearch2InstId] == null) {
        es.searchFromAjax[eSearch2InstId] = {};
    }

    var xhr = es.searchFromAjax[eSearch2InstId].xhr;
    if (xhr != null && xhr.readyState !== 4) {
        xhr.abort();
    }

    var ajaxSendData = {};
    var inputVal = $eSearch2.find('.eui-search2-input .eui-input').val().trim();
    ajaxSendData[opts.searchKey] = encodeURIComponent(inputVal);

    //发送异步前的回调，必须要return ajaxSendData
    if ($.isFunction(opts.onBeforeSend)) { 
        var cbThis = { $eSearch2: $eSearch2 };
        ajaxSendData = opts.onBeforeSend.call(cbThis, ajaxSendData); 
    }   

    xhr = $.ajax({
        url: opts.searchSource,
        type: opts.searchType,
        data: ajaxSendData,
        dataType: 'json',
        timeout: 20000,
        beforeSend: function () {
            if (opts.showResult) {
                es.showMsgInList('努力搜索中...', $eSearch2);
            }
        },
        success: function (data) {
            var cbThis = { $eSearch2: $eSearch2, xhr: xhr };
            //获取数据后的回调，方便对数据进行格式处理
            //该回调必须显示return 一个数组类型的值
            if ($.isFunction(opts.onGetData)) { 
                
                data = opts.onGetData.call(cbThis, data); 
            }

            if (!opts.showResult) {
                if ($.isFunction(opts.onGetResult)) { 
                    opts.onGetResult.call(cbThis, data); 
                }
                return;
            }

            if (data == null || data.length === 0) {
                es.showMsgInList('没有搜到任何数据', $eSearch2);
            }
            else {
                es.renderSearchList(opts, $eSearch2, data);
            }

        },
        error: function () {
            if (opts.showResult) {
                es.showMsgInList('搜索出错了', $eSearch2);
            }
            else {
                if ($.isFunction(opts.onGetResult)) { 
                    var cbThis = { $eSearch2: $eSearch2, xhr: xhr };
                    opts.onGetResult.call(cbThis, null); 
                }
            }
        }
    });
};
es.searchFromData = function(opts, $eSearch2) {
    var inputVal = $eSearch2.find('.eui-search2-input .eui-input').val().trim();
    var searchedData = (opts.searchSource || []).filter(function(item) {
        return (item[opts.searchKey] || '').indexOf(inputVal) > -1;
    });

    if (!opts.showResult) {
        if ($.isFunction(opts.onGetResult)) { 
            var cbThis = { $eSearch2: $eSearch2 };
            opts.onGetResult.call(cbThis, searchedData); 
        }
        return;
    }

    if (searchedData.length === 0) {
        es.showMsgInList('没有搜到任何数据', $eSearch2);
    }
    else {
        es.renderSearchList(opts, $eSearch2, searchedData);        
    }
};
es.setSelectedValue = function(opts, $eSearch2, $selectedItem) {
    var selectedItemValue = $selectedItem.attr(`data-id`);
    var selectedItemText = $selectedItem.text();
    var exsistSelectedItem = $eSearch2.find(`.eui-search2-multiSelectedItem[data-value=${selectedItemValue}]`).length > 0;
    //将选中的添加到搜索框
    //
    if (opts.multiple && !exsistSelectedItem) {
        var selectedListItemHtml = `<div class="eui-search2-multiSelectedItem" data-value="${selectedItemValue}">${selectedItemText}</div>`;
        $eSearch2.find('.eui-search2-input').before(selectedListItemHtml);       
    }
    else {
        var $input = $eSearch2.find('.eui-search2-input > .eui-input');
        $input.val(selectedItemText).attr('data-value', selectedItemValue).attr('title', selectedItemText);
        $input.siblings('.eui-btn').show(); 
    }

    //
    $eSearch2.trigger('close');

    if ($.isFunction(opts.onSelected)) { 
        var cbThis = { 
            $eSearch2: $eSearch2, 
            $selectedItem: $selectedItem, 
            value: es.getValue(opts, $eSearch2), 
            text: es.getText(opts, $eSearch2)
        };
        opts.onSelected.call(cbThis); 
    }
};
es.getValue = function(opts, $eSearch2) {
    var value;
    if (opts.multiple) {
        value = $.makeArray($eSearch2.find('.eui-search2-multiSelectedItem')).map(function(li) {
            return $(li).attr('data-value');
        }).join();
    }
    else {
        value = $eSearch2.find('.eui-search2-input > .eui-input').attr('data-value');
    }

    return value == null ? '' : value;
};
es.getText = function(opts, $eSearch2) {
    var text;
    if (opts.multiple) {
        text = $.makeArray($eSearch2.find('.eui-search2-multiSelectedItem')).map(function(li) {
            return $(li).text();
        }).join();
    }
    else {
        text = $eSearch2.find('.eui-search2-input > .eui-input').val();
    }

    return text;
};
es.deleteMultiSelectedItem = function(opts, $eSearch2, $deletedItem) {
    $deletedItem.remove();

    if ($.isFunction(opts.onDelete)) { 
        var cbThis = { 
            $eSearch2: $eSearch2, 
            $deletedItem: $deletedItem, 
            value: es.getValue(opts, $eSearch2), 
            text: es.getText(opts, $eSearch2)
        };
        opts.onDelete.call(cbThis); 
    }    
};
es.clearInput = function(opts, $eSearch2, forbidCb) {
    var $input = $eSearch2.find('.eui-search2-input > .eui-input');

    $input.val('').attr('data-value', '').attr('title', '');
    $input.siblings('.eui-btn').hide();

    var canCallCb = $.isFunction(opts.onClear) && (typeof forbidCb === 'undefined' || forbidCb === false);
    if (canCallCb) { 
        var cbThis = { $eSearch2: $eSearch2 };
        opts.onClear.call(cbThis); 
    }    
};
es.bindEvent = function(opts, $eSearch2) {
    $eSearch2.delegate('.eui-search2-input > .eui-input', 'focus', function(event) {
        var cbThis = { $eSearch2: $eSearch2, event: event };
        if ($.isFunction(opts.onFocus)) { opts.onFocus.call(cbThis); }
    });

    $eSearch2.delegate('.eui-search2-input > .eui-input', 'blur', function(event) {
        var cbThis = { $eSearch2: $eSearch2, event: event };
        if ($.isFunction(opts.onBlur)) { opts.onBlur.call(cbThis); }
    });

    $eSearch2.delegate('.eui-search2-input > .eui-input', 'input', function(event) {
        var $input = $(event.currentTarget);
        es.handleUserInputEvent(opts, $eSearch2, $input);
    });

    $eSearch2.delegate('.eui-search2-list > ul > li:not(.eui-search2-list-msg)', 'click', function(event) {
        var $selectedItem = $(event.currentTarget);
        es.setSelectedValue(opts, $eSearch2, $selectedItem);
    });

    $eSearch2.delegate('.eui-search2-multiSelectedItem', 'click', function(event) {
        var $deletedItem = $(event.currentTarget);
        es.deleteMultiSelectedItem(opts, $eSearch2, $deletedItem);
    });

    $eSearch2.delegate('.eui-search2-input > .eui-btn', 'click', function(event) {
        $eSearch2.trigger('clear');
    });

    $eSearch2.on('search', function(event) {
        es.search(opts, $eSearch2);
    });

    $eSearch2.on('clear', function(event) {
        es.clearInput(opts, $eSearch2);
    });

    $eSearch2.on('open', function(event) {
        $eSearch2.addClass('eui-search2-open');
    });

    $eSearch2.on('close', function(event) {
        $eSearch2.removeClass('eui-search2-open');

        if (opts.multiple) {
            es.clearInput(opts, $eSearch2, true);
        }
    });
};
es.init = function(opts, $element) {
    var exsist = $element.find('.eui-search2').length > 0;
    if (exsist) {
        es.destroy($element);
    }

    var $eSearch2 = es.render(opts, $element);
    es.bindEvent(opts, $eSearch2);
};


var ESearch2 = function(options, $element) {
    ++ESearch2.index;
    var opts = $.extend(true, {}, defaults, options);
    es.init(opts, $element);

    return {
        id: `eui-search2-${$element.attr('id') || ESearch2.index}`,
        selector: $element.selector,
        opts: opts,
    };
};

ESearch2.index = 0;

w.eSearch2Inst = {};

/**
 * 构造函数
 * 如果需要实例化的元素是单个，返回单个对象
 * 如果需要实例化的元素是多个，返回多个对象组成的数组
 */
$.fn.eSearch2 = function(options) {
    var result;
    if (this.length === 1) {
        result = new ESearch2(options, this);
        w.eSearch2Inst[result.id] = result;
    }
    else if (this.length > 1) {
        result = [];
        this.each(function() {
            var item = this;
            var eSearch2Instance = new ESearch2(options, item);
            w.eSearch2Inst[eSearch2Instance.id] = eSearch2Instance;
            result.push(eSearch2Instance);
        });
    }

    return result;
};

$.fn.eSearch2.getValue = function(selector) {
    var instList = w.eSearch2Inst;
    var instListFromSelector = [];
    for(var key in instList) {
        if (instList.hasOwnProperty(key) && instList[key].selector === selector) {
            instListFromSelector.push(instList[key]);
        }
    }

    var valueList = [];
    instListFromSelector.forEach(function(inst) {
        valueList.push({
            value: es.getValue(inst.opts, $(`#${inst.id}`)),
            id: inst.id
        });
    });

    if (valueList.length === 0) {
        throw new Error('not find eMultiSelectInstance');
    }
    else if (valueList.length === 1) {
        return valueList[0].value;
    }
    return valueList;
};

$.fn.eSearch2.getText = function(selector) {
    var instList = w.eSearch2Inst;
    var instListFromSelector = [];
    for(var key in instList) {
        if (instList.hasOwnProperty(key) && instList[key].selector === selector) {
            instListFromSelector.push(instList[key]);
        }
    }

    var textList = [];
    instListFromSelector.forEach(function(inst) {
        textList.push({
            text: es.getText(inst.opts, $(`#${inst.id}`)),
            id: inst.id
        });
    });

    if (textList.length === 0) {
        throw new Error('not find eMultiSelectInstance');
    }
    else if (textList.length === 1) {
        return textList[0].text;
    }
    return textList;
};


$(function() {
    $('body').on('click', function(event) {
        var $clickEle = $(event.target);
        var isClickEleInEsearch2 = $clickEle.hasClass('eui-search2') || $clickEle.parents('.eui-search2').length > 0;
        if (!isClickEleInEsearch2) {
            $('.eui-search2').trigger('close');
        }
    });
});

})(jQuery, window);
/**
 * @pc端查看图片
 * @author gp10856
 *
 * #使用方法：
 * #1)引入eShow.js和eShow.css
 * #2)调用eShow(srcArray)方法，srcArray是由所要查看图片的链接构成的数组参数
 */
;(function(w, $) {
    //保存着当前查看的图片的url
    var _imgSrc = '';
    var _imgSrcs = [];
    var _deg = 0;
    //用来区分是否是由拖拽而触发的click事件
    var _isDrag = false;
    var _transformStyle = {
        rotate: 'rotateZ(0deg)',
        scale: 'scale(1)',
        translate3d: 'translate3d(0,0,0)'
    };

    function eShow(imgSrcs) {
        _imgSrcs = imgSrcs || [];
        _imgSrc = _imgSrcs[0];
        
        $('body').css('overflow-y', 'hidden');

        render();
        bindEvent();
    }

    /**
     * 渲染html结构
     */
    function render() {
        var pageBtnHtml = '';
        if (_imgSrcs.length > 1) {
            pageBtnHtml = '' + 
                    '<button type="button" id="dialog-showImgPc-prev" style="display: none;"></button>' +
                    '<button type="button" id="dialog-showImgPc-next"></button>';
        }

        var dialogHtml = '' +
                '<div id="dialog-showImgPc">' +
                    '<div id="dialog-showImgPc-imgBox"  data-scale="1" style="left: 50%; top: 50%;">' + 
                        '<img src="' + _imgSrcs[0] + '" alt="" style="transform: rotate(0deg);">' +
                    '</div>' +
                    '<div id="dialog-showImgPc-scaleBox">' +
                        
                        //'<span id="showImgPc-scaleBox-scaleNum">100%</span>' +
                        '<button type="button" id="showImgPc-scaleBox-zoomOut"></button>' +
                        '<button type="button" id="showImgPc-scaleBox-zoomIn"></button>' +  

                        '<button type="button" id="showImgPc-scaleBox-rotateRight"></button>' +
                        '<button type="button" id="showImgPc-scaleBox-rotateLeft"></button>' + 
                        
                    '</div>' +
                    pageBtnHtml +
                    '<button type="button" id="dialog-showImgPc-close"></button>' +
                '</div>';

        $('body').append(dialogHtml);
        //var imgBox = $('#dialog-showImgPc-imgBox');
        //var imgBoxWidth = imgBox.width() + 'px';
        //imgBox.find('>img').css('width', imgBoxWidth);
    }

    /**
     * 绑定所有的dom事件
     */
    function bindEvent() {
        $('#dialog-showImgPc').on('click', function(e) {
            if (_isDrag) {
                _isDrag = false;
                return;
            }
            destroy();
        });

        var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1; 
        if (isFirefox) {
            $('#dialog-showImgPc-imgBox').on('DOMMouseScroll', function (e) {
                wheelZoom(e, this, true);
            });
        } else {
            $('#dialog-showImgPc-imgBox').on('mousewheel', function (e) {
                wheelZoom(e, this);
            });
        }

        moveImg();
            

        $('#dialog-showImgPc-prev').on('click', showPrevImg);

        $('#dialog-showImgPc-next').on('click', showNextImg);

        $('#showImgPc-scaleBox-rotateLeft').on('click', rotateImgLeft);

        $('#showImgPc-scaleBox-rotateRight').on('click', rotateImgRight);

        $('#showImgPc-scaleBox-zoomIn').on('click', function() {
            event.stopPropagation();
            zoomPic(-1, $('#dialog-showImgPc-imgBox'));
        });

        $('#showImgPc-scaleBox-zoomOut').on('click', function() {
            event.stopPropagation();
            zoomPic(1, $('#dialog-showImgPc-imgBox'));
        });

        $('#dialog-showImgPc-close').on('click', function () {
            destroy();
        });
    }

    /**
     * 关闭弹框时的销毁事件，主要是移除弹框dom元素，解绑dom事件，重置默认值
     * @return {[type]} [description]
     */
    function destroy() {
        _deg = 0;
        _imgSrcs = [];
        
        unBindEvent();
        closeDialog();
    }

    /**
     * 解绑dom事件
     * @return {[type]} [description]
     */
    function unBindEvent() {}

    /**
     * 移除弹框的dom元素
     */
    function closeDialog() {
        $('#dialog-showImgPc').remove();
        $('body').css('overflow-y', 'auto');
    }

    /**
     * 旋转图片
     * @param  {object} event 事件对象
     */
    function rotateImgLeft(event) {
        event.stopPropagation();

        _deg = _deg + 90;
        if (_deg == 360) {
            _deg = 0;
        }
        _transformStyle.rotate = 'rotateZ(' + _deg + 'deg)';

        $('#dialog-showImgPc-imgBox > img').css(
            {
                '-webkit-transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d,
                '-moz-transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d,
                'transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d
            }
        );
    }

    function rotateImgRight(event) {
        event.stopPropagation();

        _deg = _deg - 90;
        if (_deg == -360) {
            _deg = 0;
        }
        _transformStyle.rotate = 'rotateZ(' + _deg + 'deg)';

        $('#dialog-showImgPc-imgBox > img').css(
            {
                '-webkit-transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d,
                '-moz-transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d,
                'transform': _transformStyle.rotate + ' ' + _transformStyle.scale + ' ' + _transformStyle.translate3d
            }
        );
    }

    /**
     * 显示前一张图片
     * @param  {object} event 事件对象
     */
    function showPrevImg(event) {
        event.stopPropagation();
        var index;
        for (var i = 0; i < _imgSrcs.length; i++) {
            if (_imgSrcs[i] == _imgSrc) {
                index = i;
            }
        }
        if (index != 0) {            
            $('#dialog-showImgPc-imgBox > img').attr('src', _imgSrcs[--index]);
            _imgSrc = $('#dialog-showImgPc-imgBox > img').attr('src');

            if (index <= 0) {
                $('#dialog-showImgPc-prev').hide();
            }
            else {
                $('#dialog-showImgPc-prev').show();
            }
            $('#dialog-showImgPc-next').show();
        }
    }

    /**
     * 显示后一张图片
     * @param  {object} event 事件对象
     */
    function showNextImg(event) {
        event.stopPropagation();
        var index;
        for (var i = 0; i < _imgSrcs.length; i++) {
            if (_imgSrcs[i] == _imgSrc) {
                index = i;
            }
        }
        if (index != _imgSrcs.length) {
            $('#dialog-showImgPc-imgBox > img').attr('src', _imgSrcs[++index]);
            _imgSrc = $('#dialog-showImgPc-imgBox > img').attr('src');

            if (index >= _imgSrcs.length - 1) {
                $('#dialog-showImgPc-next').hide();
            }
            else {
                $('#dialog-showImgPc-next').show();
            }
            $('#dialog-showImgPc-prev').show();
        }
    }

    /**
     * 拖拽图片
     */
    function moveImg() {
        var imgBox = $('#dialog-showImgPc-imgBox')[0];
        var target = null;
        var isMove = false;
        imgBox.onmousedown = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var nowLeft = imgBox.style.left;
            var nowTop = imgBox.style.top;
            if (imgBox.style.left == '50%') {
                nowLeft = $(window).width() / 2;
                nowTop = $(window).height() / 2;
            }
            var downX = e.screenX;
            var downY = e.screenY;
            target = e.target;
            if (target == imgBox.childNodes[0]) {
                document.onmousemove = function (e) {
                    var delX = e.screenX - downX;
                    var delY = e.screenY - downY;
                    imgBox.style.left = (parseFloat(nowLeft) + delX) + 'px';
                    imgBox.style.top = (parseFloat(nowTop) + delY) + 'px';
                    isMove = true;
                    _isDrag = true;
                };
                document.onmouseup = function (e) {
                    e.stopPropagation();
                    document.onmousemove = null;
                    document.onmouseup = null;
                    isMove = false;
                    target = null;
                };
            }
        };
    }

    function wheelZoom(e, obj, isFirefox) {
        obj.style.maxWidth = 'none';
        obj.style.maxHeight = 'none';
        var zoomDetail = e.originalEvent.wheelDelta;
        if (isFirefox) {
            zoomDetail = -e.originalEvent.detail;
        }
        zoomPic(zoomDetail, $(obj));
    }

    var zoomTimer = 0;
    function zoomPic(zoomDetail, obj) {
        var scale = Number($(obj).attr('data-scale'));
        if (zoomDetail > 0) {
            scale = scale + 0.05;
        } else {
            scale = scale - 0.05;
        }
        if (scale > 2) {
            scale = 2;
        } else if (scale < 0.1) {
            scale = 0.1;
        }
        obj.attr('data-scale', scale);
        $('#showImgPc-scaleBox-scaleNum').html((scale * 100).toFixed(0) + '%');
        var newTransform = 'translate(-50%,-50%) scale(' + scale + ')';
        obj.css({ '-webkit-transform': newTransform, '-moz-transform': newTransform, 'transform': newTransform });
    }

    w.eShow = eShow;
})(window, jQuery);
/**
	*@排序
	通过手动触发change事件传递按钮当前的排序状态
	*@author hzh23613
 */
;(function($, window, docment){
    var ESort = function(ele){
        this.element = $(ele);
        this.state = '';//排序状态  默认为无排序
    };

    var eSortId;
	ESort.prototype = {
		init:function(){
			this.destroy();
			this.setId();
			this.bindEvent();
		},
		setId:function(){
			eSortId = 'eui-sort-';
			eSortId = this.element.attr('id') != null && (this.element.attr('id')).trim() !== '' ? this.element.attr('id'): eSortId + ESort.index;
            this.element.attr('id',eSortId);
		},
		getId:function(){
            return this.element.attr('id');
		},
        destroy:function(){
			var that = this;
			var handleSortBtnClick = that.handleSortBtnClick;
            var hasExist = window.eSortIns[this.element.attr('id')] != null;
            if (hasExist) {
                this.element.off('click',handleSortBtnClick);
                delete window.eSortIns[this.element.attr('id')];
            }
        },
		bindEvent:function(){
			var that = this;
			var handleSortBtnClick = that.handleSortBtnClick;
			that.element.on('click',that,handleSortBtnClick);
		},
		handleSortBtnClick:function(e){
			var obj = e.data;
			var element = obj.element;
			if(!element.hasClass('eui-btn-sort-active')){
                element.addClass('eui-btn-sort-active').addClass('eui-btn-sort-asce');
                obj.state = 'asce';
            }
            else {
                if(element.hasClass('eui-btn-sort-asce')){
                    element.removeClass('eui-btn-sort-asce').addClass('eui-btn-sort-desc');
                    obj.state = 'desc';
                }else{
                    element.removeClass('eui-btn-sort-desc').addClass('eui-btn-sort-asce');
                    obj.state = 'asce';
                }
            }

            element.trigger('change', obj.state);
		}
	};

	ESort.index = 0;

	$.fn.eSort = function(){
		var eSort,id;
		if(this.length === 1){
			++ESort.index;
			eSort = new ESort(this);
            eSort.init();
			window.eSortIns[eSort.id] = eSort;
		}
		else if(this.length > 0 ){
			this.each(function(){
				var item = this;
				++ESort.index;
				eSort = new ESort(item);
				eSort.init();
				id = eSort.getId();
				window.eSortIns[id] = eSort;
			})
		}
	};

	window.eSortIns = {};
})(jQuery, window, document);

/**
 */


;(function($, w) {
    var ETab = function(options, element) {
        var defaults = {
            tabDirection: 'horizontal',
            tabStyle: 1,
            tabType: 1,
            animationType: 1,
            activeIndex: 1
        };

        var $eTab = $(element);
        var eTabId = 'eui-tab-';
        var eTabClassName = '';

        var opts = $.extend({}, defaults, options);

        function init() {
            destory();

            renderHtml();

            bindEvent();

            $eTab.find('> .eui-tab-btn-list > li:nth-child(' + opts.activeIndex + ')').trigger('click');
        }

        /**
         * 销毁已存在的实例
         * 由于Jq中remove时便可以解绑元素上的事件
         * 所以不再手动解绑事件，直接remove
         * 或者说不销毁还是用现有的实例
         */
        function destory() {
            var hasExist = w.eTabInst[$eTab.attr('id')] != null;
            if (hasExist) {
                $eTab.undelegate('> .eui-tab-btn-list > li', 'click');
                $eTab.removeClass(w.eTabInst[$eTab.attr('id')].className);
                delete w.eTabInst[$eTab.attr('id')];
            }
        }

        function renderHtml() {
            eTabClassName = 'eui-tab-type-' + opts.tabType + 
                    ' eui-tab-animationType-' + opts.animationType +
                    ' eui-tab-style-' + opts.tabStyle +
                    ' eui-tab-' + opts.tabDirection;
            eTabId = $eTab.attr('id') != null && ($eTab.attr('id')).trim() !== '' ? $eTab.attr('id') : eTabId + ETab.index;
            $eTab.addClass(eTabClassName).attr('id', eTabId);
        }

        function bindEvent() {
            $eTab.delegate('> .eui-tab-btn-list > li', 'click', handleTabBtnClick);
        }

        function handleTabBtnClick() {
            $(this).siblings('li.eui-tab-btn-active').removeClass('eui-tab-btn-active');
            $(this).addClass('eui-tab-btn-active');
            $eTab.trigger('change', $(this));

            var contList = $(this).parent().parent().find(' > .eui-tab-cont-list');
            var tab_btn = $(this);
            var tab_btn_index = $(this).parent().find('> li').index(tab_btn);

            switch('' + opts.tabType) {
                case '1': {
                    if ('' + opts.animationType === '1') {
                        var offset = tab_btn_index * (-100) + '%';
                        var position = opts.tabDirection === 'horizontal' ? 'left' : 'top';
                        contList.find('> ul').css(position, offset);
                    }
                    contList.find('> ul > .eui-tab-cont-active').removeClass('eui-tab-cont-active');
                    contList.find('> ul > li:nth-child(' + (tab_btn_index + 1) + ')').addClass('eui-tab-cont-active');
                    break;
                }
                case '2': {
                    break;
                }
            }          
        }


        init();


        //对外的属性和方法
        return {
            id: eTabId,
            className: eTabClassName
        };

    };

    //index用于唯一标志每个EDropDown实例
    ETab.index = 0;

    /**
     * 构造函数
     * 如果需要实例化的元素是单个，返回单个对象
     * 如果需要实例化的元素是多个，返回多个对象组成的数组
     */
    $.fn.eTab = function(options) {
        var result;
        if (this.length === 1) {
            ++ETab.index;
            result = new ETab(options, this);
            w.eTabInst[result.id] = result;
        }
        else if (this.length > 1) {
            result = [];
            this.each(function() {
                var item = this;
                ++ETab.index;
                result = new ETab(options, item);
                result.push(result);
                w.eTabInst[result.id] = result;
            });
        }

        return result;
    };
    
    //全局存放的实例对象，方便快速获取所有的实例
    w.eTabInst = {};

})(jQuery, window);
/**
 * 考虑最后不是立即上传的效果
 */


;(function($, w) {
    var EUpload = function(options, element) {
        var defaults = {
            type: 'img',
            accept: '*',
            multiple: false,
            maxSize: 0,
            maxLength: 100,
            uploadUrl: '',
            uploadKey: '',
            uploadNow: true,
            uploadTip: '',
            onSelected: null,
            onBeforeSend: null,
            onProgress: null,
            onSuccess: null,
            onFail: null,
            onDelete: null
        };

        var $element = $(element);
        var $eUpload = null;

        var opts = $.extend({}, defaults, options);

        function init() {
            //禁止重复初始化
            var hasExist = $element.find('.eui-upload-img').length > 0;
            if (hasExist) {
                return;
            }

            renderHtml();

            bindEvent();
        }

        function renderHtml() {
            var imgHtml = '' +
                    '<div class="eui-upload-img">' +
                        '<ul class="eui-upload-img-list"></ul>' +
                        '<div class="eui-upload-img-btn">' +
                            '<input type="file" accept="' + opts.accept + '">' +
                        '</div>' +
                        '<p class="eui-upload-img-tip">' + opts.uploadTip + '</p>' +
                    '</div>';

            $element.html(imgHtml);
            $eUpload = $element.find(' > .eui-upload-img');
        }

        function bindEvent() {
            $eUpload.delegate('input[type="file"]', 'change', function() {

                var inputFileEle = $eUpload.find('input[type="file"]');
                var file = this.files[0];

                if (!file) { return; }

                if (opts.maxSize > 0 && file.size > opts.maxSize) {
                    eMsg({
                        text: '选择的文件大小已超过了最大限制'
                    });
                    inputFileEle.replaceWith(inputFileEle.clone(true));
                    return;
                }

                var that = { file: file };
                var canUpload = true;

                if (opts.onSelected != null) { 
                    canUpload = opts.onSelected.call(that);
                }

                if (canUpload === false) {
                    inputFileEle.replaceWith(inputFileEle.clone(true));
                    return;
                }

                //当选择了最大个数的图片后隐藏上传按钮
                var canHideImgBtn = $eUpload.find(' > .eui-upload-img-list > li').length === opts.maxLength - 1;
                if (canHideImgBtn) {
                    $eUpload.find('.eui-upload-img-btn').hide();
                }

                //创建li,构造进度
                var liHtml = '' +
                        '<li class="eui-upload-uploading">' +
                            '<span class="eui-upload-progress">上传中</span>' +
                            '<button type="button" class="eui-upload-deleteBtn" title="删除"></button>' +
                        '</li>';
                var newLi = $eUpload.find('.eui-upload-img-list').append(liHtml).find('li:last-child');
                readImgDataUrl(file, function() {
                    var imgUrl = this.target.result;
                    newLi.css('background-image', 'url(' + imgUrl + ')');
                });
                startUpload(file, newLi);
            });

            $eUpload.delegate('.eui-upload-deleteBtn', 'click', function(e) {
                e.stopPropagation();
                var deleteBtn = e.target;
                var inputFileEle = $eUpload.find('input[type="file"]');

                $(deleteBtn).parent().remove();
                $eUpload.find('.eui-upload-img-btn').show();
                inputFileEle.replaceWith(inputFileEle.clone(true));
            });
        }

        function startUpload(file, element) {
            var uploadUrl = opts.uploadUrl;
            var fd = new FormData();
            var xhr = new XMLHttpRequest();
            fd.append(opts.uploadKey, file);

            xhr.onload = function(event) {
                var that = $.extend({ xhr: xhr }, { event: event }, {file: file}, {element: element});
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    //上传成功,进行成功的操作
                    if (opts.onSuccess != null) { opts.onSuccess.call(that); }
                }
                else {
                    //失败，进行失败的操作
                    if (opts.onFail != null) { opts.onFail.call(that); }
                }
            };

            xhr.upload.onprogress = function(event) {
                var progress = (event.loaded / event.total);
                var that = $.extend(
                    { xhr: xhr }, 
                    { event: event }, 
                    { file: file }, 
                    { element: element }, 
                    { progress: progress }
                );

                if (opts.onProgress != null) { opts.onProgress.call(that); }
            };
            xhr.open('post', uploadUrl, true);
            xhr.send(fd);
        }

        function readImgDataUrl(file, cb) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var _this = event;
                if (cb) { cb.call(_this); }
            };
            reader.readAsDataURL(file);
        }


        init();

    };

    /**
     * 构造函数
     * 如果需要实例化的元素是单个，返回单个对象
     * 如果需要实例化的元素是多个，返回多个对象组成的数组
     */
    $.fn.eUpload = function(options) {
        var result;
        if (this.length === 1) {
            result = new EUpload(options, this);
        }
        else if (this.length > 1) {
            result = [];
            this.each(function() {
                var item = this;
                var eUploadInstance = new EUpload(options, item);
                result.push(eUploadInstance);
            });
        }

        return result;
    };

})(jQuery, window);

;(function($, w) {

w.eLoading = {
    show: function($wrapper) {
        el.render($wrapper);
    },
    hide: function($wrapper) {
        el.remove($wrapper);
    }
};

var el = {};
el.render = function($wrapper) {
    //todo: 要加上对$wrapper是否是jq对象的验证
    $wrapper = $wrapper || $('body');

    var loadingHtml = '' +
            '<div class="eui-loading">' +
                '<div class="eui-loading-mask"></div>' +
                '<div class="eui-loading-cont">' +
                    '<div class="eui-loading-cont-rect1"></div>' +
                    '<div class="eui-loading-cont-rect2"></div>' +
                    '<div class="eui-loading-cont-rect3"></div>' +
                    '<div class="eui-loading-cont-rect4"></div>' +
                    '<div class="eui-loading-cont-rect5"></div>' +
                '</div>' +
            '</div>';
    if ($wrapper.find('.eui-loading').length === 0) {
        $wrapper.append(loadingHtml);
    }
};
el.remove = function($wrapper) {
    //todo: 要加上对$wrapper是否是jq对象的验证
    $wrapper = $wrapper || $('body');
    var $loadings = $wrapper.find('.eui-loading');
    $loadings.addClass('eui-loading-removing');
    setTimeout(function() {
        $loadings.remove(); 
    }, 500);
};

})(jQuery, window);
/**
 * @version 1.1
 * @author xuejun
 * @class
 * 分页控件, 使用原生的JavaScript代码编写. 重写onclick方法, 获取翻页事件,
 * 可用来向服务器端发起AJAX请求.
 *
 * @param {String} id: HTML节点的id属性值, 控件将显示在该节点中.
 * @returns {PagerView}: 返回分页控件实例.
 *
 * @example
 * ### HTML:
 * &lt;div id="pager"&gt;&lt;/div&gt;
 *
 * ### JavaScript:
 * var pager = new PagerView('pager');
 * pager.index = 3; // 当前是第3页
 * pager.size = 16; // 每页显示16条记录
 * pager.itemCount = 100; // 一共有100条记录
 *
 * pager.onclick = function(index){
 *  alert('click on page: ' + index);
 *  // display data...
 * };
 *
 * pager.render();
 * 
 */
;(function(window) {
window.PagerView = function(id) {
    var self = this;
    this.id = id;

    this._pageCount = 0; // 总页数
    this._start = 1; // 起始页码
    this._end = 1; // 结束页码

    /**
     * 当前控件所处的HTML节点引用.
     * @type DOMElement
     */
    this.container = null;
    /**
     * 当前页码, 从1开始
     * @type int
     */
    this.index = 1;
    /**
     * 每页显示记录数
     * @type int
     */
    this.size = 10;
    /**
     * 显示的分页按钮数量
     * @type int
     */
    this.maxButtons = 5;
    /**
     * 记录总数
     * @type int
     */
    this.itemCount = 0;

    /**
     *是否显示详细分页信息
     *@type bool
     */
    this.showDetails = true;

    /**
     *是否显示首页、末页
     *@type bool
     */
    this.showFirstLast = true;

    /**
     *需执行方法名
     * @type int
     */
    this.methodName = 'GetStrFormat';

    this.firstButtonText = '首页';
    this.lastButtonText = '末页';
    this.previousButtonText = '上一页';
    this.nextButtonText = '下一页';

    /**
     * 控件使用者重写本方法, 获取翻页事件, 可用来向服务器端发起AJAX请求.
     * 如果要取消本次翻页事件, 重写回调函数返回 false.
     * @param {int} index: 被点击的页码.
     * @returns {Boolean} 返回false表示取消本次翻页事件.
     * @event
     */
    this.onclick = function(index) {
        // modified by fj10854 
        // 使参数能够使用"xxx.yyy.someMethod"这样传递方法名
        var methodName = this.methodName,
            nameSpaces = methodName.split('.'),
            parentMethodName = nameSpaces.shift(),
            parentMethod = window[parentMethodName];

        var temp = '';

        while (temp = nameSpaces.shift()) {
            parentMethod = parentMethod[temp] || (parentMethod[temp] = {});
        }

        if (typeof parentMethod === 'function') {
            parentMethod.call(null, index);
            return true;
        } else {
            return false;
        }
    };

    /**
     * 内部方法.
     */
    this._onclick = function(index) {
        var old = self.index;

        self.index = index;
        if (self.onclick(index) !== false) {
            self.render();
        } else {
            self.index = old;
        }
    };

    /**
     * 在显示之前计算各种页码变量的值.
     */
    this._calculate = function() {
        self._pageCount = parseInt(Math.ceil(self.itemCount / self.size));
        self.index = parseInt(self.index);
        if (self.index > self._pageCount) {
            self.index = self._pageCount;
        }
        if (self.index < 1) {
            self.index = 1;
        }

        self._start = Math.max(1, self.index - parseInt(self.maxButtons / 2));
        self._end = Math.min(self._pageCount, self._start + self.maxButtons - 1);
        self._start = Math.max(1, self._end - self.maxButtons + 1);
    };

    /**
     * 获取作为参数的数组落在相应页的数据片段.
     * @param {Array[Object]} rows
     * @returns {Array[Object]}
     */
    this.page = function(rows) {
        self._calculate();

        var s_num = (self.index - 1) * self.size;
        var e_num = self.index * self.size;

        return rows.slice(s_num, e_num);
    };

    /**
     * 渲染控件.
     */
    this.render = function() {
        var div = document.getElementById(self.id);
        div.view = self;
        self.container = div;

        self._calculate();

        var str = '';
        str += '<div class="PagerView">\n';
        if (self._pageCount > 1) {
            if (self.index != 1) {
                if (this.showFirstLast) {
                    str += '<a href="javascript://1"><span>' + this.firstButtonText + '</span></a>';
                }
                str += '<a href="javascript://' + (self.index - 1) + '"><span>' + this.previousButtonText + '</span></a>';
            } else {
                if (this.showFirstLast) {
                    str += '<span>' + this.firstButtonText + '</span>';
                }
                str += '<span>' + this.previousButtonText + '</span>';
            }
        }
        for (var i = self._start; i <= self._end; i++) {
            if (i == this.index) {
                str += '<span class="on">' + i + '</span>';
            } else {
                str += '<a href="javascript://' + i + '"><span>' + i + '</span></a>';
            }
        }
        if (self._pageCount > 1) {
            if (self.index != self._pageCount) {
                str += '<a href="javascript://' + (self.index + 1) + '"><span>' + this.nextButtonText + '</span></a>';
                if (this.showFirstLast) {
                    str += '<a href="javascript://' + self._pageCount + '"><span>' + this.lastButtonText + '</span></a>';
                }
            } else {
                str += '<span>' + this.nextButtonText + '</span>';
                if (this.showFirstLast) {
                    str += '<span>' + this.lastButtonText + '</span>';
                }
            }
        }
        if (this.showDetails && self.itemCount > 0) {
            str += ' 共' + self._pageCount + '页, ' + self.itemCount + '条记录 ';
        }
        str += '</div><!-- /.pagerView -->\n';

        self.container.innerHTML = str;

        var a_list = self.container.getElementsByTagName('a');
        for (var i = 0; i < a_list.length; i++) {
            a_list[i].onclick = function() {
                var index = this.getAttribute('href');
                if (index != undefined && index != '') {
                    index = parseInt(index.replace('javascript://', ''));
                    self._onclick(index);
                }
                return false;
            };
        }
    };
};
})(window);