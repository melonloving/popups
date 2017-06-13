(function ($) {
    $(function () {
        $(document).on('click', function (e) {
            if ($(e.target).hasClass('select-container') || $(e.target).parents(".address-content").length !== 0) {
                return;
            }
            $(".address-content").slideUp();
            $(".address-content").removeClass("show");

        });
    });

    $.fn.selectAddress = function (options) {
        var defaults = {
            data: [],//异步数据
            grade: null,//城市选择等级，1只可以选省份，2可选省份和城市，3都可选
            IsNeedSaveButton: null,//是否需要保存按钮
            placeholder: "",//默认显示（类似input）
            proviceID: null,//默认省份
            cityID: null,//默认城市
            countryID: null,//默认区县
            callbackFn: null//回调函数
        };        

        var that = this;
        //判断是否已存在selectAddress
        //已存在时便销毁存在的，然后生成新的
        function destory() {
            //remove方法会自动移除绑定的事件
            //所以不需要手动再移除事件
            $(that).find('.address-content, .select-container').remove();
            $(that).off('click');
        }

        var existselAddress = $(that).find('.address-content').length > 0;
        if (existselAddress) {
            destory();
        }

        var bindEvent = function (elem, options) {
            //点击tab
            $(elem).on("click", '.tab li', function () {
                $(this).addClass("current").siblings().removeClass("current");
                var index = $(this).index();
                $(elem).find('.tab-con').addClass("none");
                $(elem).find('.tab-con').eq(index).removeClass('none');
            });

            //点击省份
            $(elem).on("click", '.tab-provice li', function () {
                $(this).addClass('on').siblings().removeClass('on');
                var proviceId = $(this).attr("data-value");
                var proviceName = $(this).attr("data-name");
                var proviceTab = $(this).parents(".address-content").find(".tab li").eq(0);
                proviceTab.text(proviceName);
                proviceTab.attr('data-id', proviceId);
                $(elem).find('.address-content .tab-city').remove();
                $(elem).find('.address-content .tab-country').remove();
                $(this).parents(".address-content").find(".tab li").eq(2).addClass('none').text("请选择").attr('data-id', '').attr('title', '');

                if (options.grade == 1) {
                    assignmentValue(elem, options);
                    return;
                }
                var optionsData = typeof options.data == 'object' ? options.data : JSON.parse(options.data);
                var data = optionsData || [];
                var cityData = data.AllCityInfo;
                setCityInfo(elem, cityData, proviceId, options);
            });

            //点击城市
            $(elem).on("click", '.tab-city li', function () {
                $(this).addClass('on').siblings().removeClass('on');
                var cityId = $(this).attr("data-value");
                var cityName = $(this).attr("data-name");
                var cityTab = $(this).parents(".address-content").find(".tab li").eq(1);
                if (cityName.length > 5) {
                    cityTab.attr('title', cityName);
                    cityName = cityName.substr(0, 5);
                } else {
                    cityTab.attr('title', '');
                }
                cityTab.text(cityName);
                cityTab.attr('data-id', cityId);

                if (options.grade == 2) {
                    assignmentValue(elem, options);
                    return;
                }

                var optionsData = typeof options.data == 'object' ? options.data : JSON.parse(options.data);
                var data = optionsData || [];
                var countryData = data.AllCountryInfo;
                setCountryInfo(elem, countryData, cityId);
            });

            //点击区县
            $(elem).on("click", '.tab-country li', function () {
                $(this).addClass('on').siblings().removeClass('on');
                var countryId = $(this).attr("data-value");
                var countryName = $(this).attr("data-name");
                var countryTab = $(this).parents(".address-content").find(".tab li").eq(2);
                if (countryName.length > 5) {
                    countryTab.attr('title', countryName);
                    countryName = countryName.substr(0, 5);
                } else {
                    countryTab.attr('title', '');
                }
                countryTab.text(countryName);
                countryTab.attr('data-id', countryId);

                if (options.grade == 3) {
                    assignmentValue(elem, options);
                    return;
                }
            });

            //保存按钮
            $(elem).on('click', ".address-saveBtn", function () {
                assignmentValue(elem, options);
            });

            //清空按钮
            $(elem).on('click', ".address-emptyBtn", function () {
                var $content = $(this).parents(".address-content")
                $content.find(".tab li").each(function (index, item) {
                    $(item).text("请选择").attr('data-id', '').attr('title', '');
                    if (index >= 1) {
                        $(item).addClass("none");
                    } else {
                        $(item).addClass("current").siblings().removeClass("current");
                    }
                });
                $content.find(".tab-con ul li").removeClass("on");
                $content.find(".tab-con").addClass("none");
                $content.find(".tab-provice").removeClass("none");
                $content.prev(".select-container").text(" ").attr('data-value', '').attr('title', '');
                if (!options.placeholder) {
                    options.placeholder = "请选择城市";
                }
                $(elem).find(".select-container").append('<span class="select-placeholder">' + options.placeholder + '</span>');
            });

            //点击显示
            $(elem).on('click', '.select-container', function (e) {
                e.stopPropagation();
                var $content = $(this).next(".address-content");
                if ($content.hasClass('show')) {
                    $content.stop(true, true).slideUp();
                    $content.removeClass('show');
                } else {
                    $(".address-content").stop(true, true).slideUp();
                    $(".address-content").removeClass("show");
                    $(this).next(".address-content").stop(true, true).slideDown();
                    $content.addClass('show');
                }
            });
        };
        //定位问题
        var addressLocation = function (elem) {
            var content = $(elem).find(".address-content");
            var left = $(elem).offset().left;
            var top = $(elem).offset().top;
            var bodyWidth = document.body.clientWidth;
            var bodyHeight = document.body.scrollHeight;
            var elemWidth = $(elem).innerWidth();
            var elemHeight = $(elem).innerHeight();
            var contentWidth = content.outerWidth();
            var contentHeight = content.outerHeight();
            if (left + contentWidth > bodyWidth) {
                content.css('right', '0px');
            }
            if (top + contentHeight > bodyHeight) {
                content.css('width', '445px');
                var contentChangeHeight = content.outerHeight();
                if (top + contentChangeHeight > bodyHeight) {
                    content.css('bottom', '100%');
                }
            }
        };
        var getSearchAddressData = function (elem, options) {
            $(elem).append('<div class="select-container"></div>');
            if (!options.placeholder) {
                options.placeholder = "请选择城市";
            }
            $(elem).find(".select-container").append('<span class="select-placeholder">' + options.placeholder + '</span>');
            var addressHtml = '<div class="address-content">\
                                    <ul class="tab">\
                                        <li class="current">请选择</li>\
                                        <li class="none">请选择</li>\
                                        <li class="none">请选择</li>\
                                    </ul>\
                                    <div class="address-btns">\
                                        <button type="button" class="address-saveBtn none">确认</button>\
                                        <button type="button" class="address-emptyBtn">清空</button>\
                                    </div>\
                                </div>';
            $(elem).append(addressHtml);
            var optionsData = typeof options.data == 'object' ? options.data : JSON.parse(options.data);
            var data = optionsData || [];
            var proviceData = data.AllProviceInfo;
            setProviceInfo(elem, proviceData);
            addressLocation(elem);
        };
        //省份
        var setProviceInfo = function (elem, data, id) {
            var proviceHtml = '<div class="tab-con tab-provice"><ul>'
            for (var i = 0; i < data.length; i++) {
                proviceHtml += '<li data-value="' + data[i].ProvinceId + '" data-name="' + data[i].ProvinceName + '"><a href="javascript:void(0);">' + data[i].ProvinceName + '</li>';
            }
            proviceHtml += '</ul></div>';
            $(elem).find('.address-content .address-btns').before(proviceHtml);
        };
        //城市
        var setCityInfo = function (elem, data, id, options) {
            $(elem).find('.tab li').eq(1).removeClass('none').text("请选择").attr('data-id', '').attr('title', '');
            $(elem).find('.tab li').eq(1).click();
            $(elem).find('.tab-provice').addClass("none");
            if (options.IsNeedSaveButton == 1) {
                $(elem).find('.address-saveBtn').removeClass('none');
            }
            var cityArr = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].ParentId == id) {
                    cityArr.push(data[i]);
                }
            }
            var cityHTml = '<div class="tab-con tab-city"><ul>'
            cityArr.forEach(function (value, index) {
                if (value.CityName.length > 6) {
                    cityHTml += '<li data-value="' + value.CityId + '" data-name="' + value.CityName + '" title="' + value.CityName + '"><a href="javascrip:void(0);">' + value.CityName + '</li>';
                } else {
                    cityHTml += '<li data-value="' + value.CityId + '" data-name="' + value.CityName + '"><a href="javascrip:void(0);">' + value.CityName + '</li>';
                }
            });
            cityHTml += '</ul></div>';
            $(elem).find('.address-content .tab-city').remove();
            $(elem).find('.address-content .address-btns').before(cityHTml);
        };
        //区县
        var setCountryInfo = function (elem, data, id) {
            $(elem).find('.tab li').eq(2).removeClass('none').text("请选择").attr('data-id', '').attr('title', '');
            $(elem).find('.tab li').eq(2).click();
            $(elem).find('.tab-city').addClass("none");
            var countryArr = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].ParentId == id) {
                    countryArr.push(data[i]);
                }
            }
            var countryHTml = '<div class="tab-con tab-country"><ul>'
            countryArr.forEach(function (value, index) {
                if (value.CountryName.length > 6) {
                    countryHTml += '<li data-value="' + value.CountryId + '" data-name="' + value.CountryName + '" title="' + value.CountryName + '"><a href="javascrip:void(0);">' + value.CountryName + '</li>';
                } else {
                    countryHTml += '<li data-value="' + value.CountryId + '" data-name="' + value.CountryName + '"><a href="javascrip:void(0);">' + value.CountryName + '</li>';
                }
            });
            countryHTml += '</ul></div>';
            $(elem).find('.address-content .tab-country').remove();
            $(elem).find('.address-content .address-btns').before(countryHTml);
        };
        //赋值
        var assignmentValue = function (elem, options) {
            var setText = [];
            var setId = [];
            $(elem).find('.address-content .tab li').each(function (i, item) {
                if ($(item).attr('title')) {
                    var text = $(item).attr('title');
                } else {
                    var text = $(item).text();
                }
                var id = $(item).attr('data-id');
                if (text !== "请选择") {
                    setText.push(text);
                }
                if (id) {
                    setId.push(id);
                }
            });
            $(elem).find('.select-container').text(setText.join('-'));
            $(elem).find('.select-container').attr('title', setText.join('-'));
            $(elem).find('.select-container').attr('data-value', setId.join('-'));
            $(elem).find(".address-content").slideUp();
            $(elem).find(".address-content").removeClass("show");
            if (options.callbackFn) {
                options.callbackFn(setText.join('-'), setId.join('-'));
            }
            if (!setId.join('-')) {
                if (!options.placeholder) {
                    options.placeholder = "请选择城市";
                }
                $(elem).find(".select-container").append('<span class="select-placeholder">' + options.placeholder + '</span>');
            }
        };
        //默认地区
        var setDefaultAddress = function (elem, options) {
            var isDefault = false;
            if (options.proviceID && options.proviceID != 0) {
                $(elem).find(".tab-provice li").each(function () {
                    if ($(this).attr("data-value") == options.proviceID) {
                        $(this).addClass('on').siblings().removeClass('on');
                        var proviceId = $(this).attr("data-value");
                        var proviceName = $(this).attr("data-name");
                        var proviceTab = $(this).parents(".address-content").find(".tab li").eq(0);
                        proviceTab.text(proviceName);
                        proviceTab.attr('data-id', proviceId);
                    }
                });
                isDefault = true;
            }

            if (options.cityID && options.cityID != 0) {
                var optionsData = typeof options.data == 'object' ? options.data : JSON.parse(options.data);
                var data = optionsData || [];
                var cityData = data.AllCityInfo;
                setCityInfo(elem, cityData, options.proviceID, options);

                $(elem).find(".tab-city li").each(function () {
                    if ($(this).attr("data-value") == options.cityID) {
                        $(this).addClass('on').siblings().removeClass('on');
                        var cityId = $(this).attr("data-value");
                        var cityName = $(this).attr("data-name");
                        var cityTab = $(this).parents(".address-content").find(".tab li").eq(1);
                        if (cityName.length > 5) {
                            cityTab.attr('title', cityName);
                            cityName = cityName.substr(0, 5);
                        }
                        cityTab.text(cityName);
                        cityTab.attr('data-id', cityId);
                    }
                });
                isDefault = true;
            }

            if (options.countryID && options.countryID != 0) {
                var optionsData = typeof options.data == 'object' ? options.data : JSON.parse(options.data);
                var data = optionsData || [];
                var countryData = data.AllCountryInfo;
                setCountryInfo(elem, countryData, options.cityID);

                $(elem).find(".tab-country li").each(function () {
                    if ($(this).attr("data-value") == options.countryID) {
                        $(this).addClass('on').siblings().removeClass('on');
                        var countryId = $(this).attr("data-value");
                        var countryName = $(this).attr("data-name");
                        var countryTab = $(this).parents(".address-content").find(".tab li").eq(2);
                        if (countryName.length > 5) {
                            countryTab.attr('title', countryName);
                            countryName = countryName.substr(0, 5);
                        }
                        countryTab.text(countryName);
                        countryTab.attr('data-id', countryId);
                    }
                });
                isDefault = true;
            }
            if (isDefault) {
                assignmentValue(elem, options);
            }
        };

        var options = $.extend(defaults, options);
        this.each(function () {
            bindEvent(this, options)
            getSearchAddressData(this, options);
            setDefaultAddress(this, options);
        });
    };

})(jQuery);