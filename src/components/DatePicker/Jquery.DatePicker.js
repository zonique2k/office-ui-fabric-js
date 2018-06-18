var DatePicker = (function () {
    function DatePicker(container, options) {
        var _this = this;
        var $datePicker = $(container);
        var $dateField = $datePicker.find(".ms-TextField-field").pickadate($.extend({
            weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],
            clear: "",
            close: "",
            today: "",
            onStart: function () {
                _this.initCustomView($datePicker);
            },
            klass: {
                input: "ms-DatePicker-input",
                active: "ms-DatePicker-input--active",
                picker: "ms-DatePicker-picker",
                opened: "ms-DatePicker-picker--opened",
                focused: "ms-DatePicker-picker--focused",
                holder: "ms-DatePicker-holder",
                frame: "ms-DatePicker-frame",
                wrap: "ms-DatePicker-wrap",
                box: "ms-DatePicker-dayPicker",
                header: "ms-DatePicker-header",
                month: "ms-DatePicker-month",
                year: "ms-DatePicker-year",
                table: "ms-DatePicker-table",
                weekdays: "ms-DatePicker-weekday",
                day: "ms-DatePicker-day",
                disabled: "ms-DatePicker-day--disabled",
                selected: "ms-DatePicker-day--selected",
                highlighted: "ms-DatePicker-day--highlighted",
                now: "ms-DatePicker-day--today",
                infocus: "ms-DatePicker-day--infocus",
                outfocus: "ms-DatePicker-day--outfocus"
            }
        }, options || {}));
        var $picker = $dateField.pickadate("picker");
        this.picker = $picker;
        $picker.on({
            render: function () {
                _this.updateCustomView($datePicker);
            }
        });
    }
    DatePicker.prototype.initCustomView = function ($datePicker) {
        var _this = this;
        var $monthControls = $datePicker.find(".ms-DatePicker-monthComponents");
        var $goToday = $datePicker.find(".ms-DatePicker-goToday");
        var $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
        var $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
        var $pickerWrapper = $datePicker.find(".ms-DatePicker-wrap");
        var $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");
        $monthControls.appendTo($pickerWrapper);
        $goToday.appendTo($pickerWrapper);
        $monthPicker.appendTo($pickerWrapper);
        $yearPicker.appendTo($pickerWrapper);
        this.updateCustomView($datePicker);
        $picker.on("open", function (e) {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            document.dispatchEvent(evt);
        });
        $monthControls.on("click", ".js-prevMonth", function (event) {
            event.preventDefault();
            var newMonth = $picker.get("highlight").month - 1;
            _this.changeHighlightedDate([null, newMonth, null]);
        });
        $monthControls.on("click", ".js-nextMonth", function (event) {
            event.preventDefault();
            var newMonth = $picker.get("highlight").month + 1;
            _this.changeHighlightedDate([null, newMonth, null]);
        });
        $monthPicker.on("click", ".js-prevYear", function (event) {
            event.preventDefault();
            var newYear = $picker.get("highlight").year - 1;
            _this.changeHighlightedDate([newYear, null, null]);
        });
        $monthPicker.on("click", ".js-nextYear", function (event) {
            event.preventDefault();
            var newYear = $picker.get("highlight").year + 1;
            _this.changeHighlightedDate([newYear, null, null]);
        });
        $yearPicker.on("click", ".js-prevDecade", function (event) {
            event.preventDefault();
            var newYear = $picker.get("highlight").year - 10;
            _this.changeHighlightedDate([newYear, null, null]);
        });
        $yearPicker.on("click", ".js-nextDecade", function (event) {
            event.preventDefault();
            var newYear = $picker.get("highlight").year + 10;
            _this.changeHighlightedDate([newYear, null, null]);
        });
        $goToday.click(function (event) {
            event.preventDefault();
            var now = new Date();
            $picker.set("select", [now.getFullYear(), now.getMonth(), now.getDate()]);
            $datePicker.removeClass("is-pickingMonths").removeClass("is-pickingYears");
        });
        $monthPicker.on("click", ".js-changeDate", function (event) {
            event.preventDefault();
            var $changeDate = $(event.target);
            var newYear = $changeDate.attr("data-year");
            var newMonth = $changeDate.attr("data-month");
            var newDay = $changeDate.attr("data-day");
            _this.changeHighlightedDate([newYear, newMonth, newDay]);
            if ($datePicker.hasClass("is-pickingMonths")) {
                $datePicker.removeClass("is-pickingMonths");
            }
        });
        $yearPicker.on("click", ".js-changeDate", function (event) {
            event.preventDefault();
            var $changeDate = $(event.target);
            var newYear = $changeDate.attr("data-year");
            var newMonth = $changeDate.attr("data-month");
            var newDay = $changeDate.attr("data-day");
            _this.changeHighlightedDate([newYear, newMonth, newDay]);
            if ($datePicker.hasClass("is-pickingYears")) {
                $datePicker.removeClass("is-pickingYears");
            }
        });
        $monthPicker.on("click", ".js-showDayPicker", function () {
            $datePicker.removeClass("is-pickingMonths");
            $datePicker.removeClass("is-pickingYears");
        });
        $monthControls.on("click", ".js-showMonthPicker", function () {
            $datePicker.toggleClass("is-pickingMonths");
        });
        $monthPicker.on("click", ".js-showYearPicker", function () {
            $datePicker.toggleClass("is-pickingYears");
        });
    };
    DatePicker.prototype.changeHighlightedDate = function (dateArr) {
        var newDateArr = this.setDateAttributes(dateArr);
        this.picker.set("highlight", newDateArr);
    };
    DatePicker.prototype.updateCustomView = function ($datePicker) {
        var $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
        var $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
        var $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");
        $monthPicker.find(".ms-DatePicker-currentYear").text($picker.get("view").year);
        $monthPicker.find(".ms-DatePicker-monthOption").removeClass("is-highlighted");
        $monthPicker.find(".ms-DatePicker-monthOption[data-month='" + $picker.get("highlight").month + "']").addClass("is-highlighted");
        $yearPicker.find(".ms-DatePicker-currentDecade").remove();
        $yearPicker.find(".ms-DatePicker-optionGrid").remove();
        var startingYear = $picker.get("highlight").year - 11;
        var decadeText = startingYear + " - " + (startingYear + 11);
        var output = "<div class='ms-DatePicker-currentDecade'>" + decadeText + "</div>";
        output += "<div class='ms-DatePicker-optionGrid'>";
        for (var year = startingYear; year < (startingYear + 12); year++) {
            output += "<span class='ms-DatePicker-yearOption js-changeDate' data-year='" + year + "'>" + year + "</span>";
        }
        output += "</div>";
        $yearPicker.append(output);
        $yearPicker.find(".ms-DatePicker-yearOption").removeClass("is-highlighted");
        $yearPicker.find(".ms-DatePicker-yearOption[data-year='" + $picker.get("highlight").year + "']").addClass("is-highlighted");
    };
    DatePicker.prototype.setDateAttributes = function (dateArr) {
        var newYear = dateArr[0], newMonth = dateArr[1], newDay = dateArr[2];
        if (typeof newYear === "undefined" || newYear === null) {
            newYear = this.picker.get("highlight").year;
        }
        if (typeof newMonth === "undefined" || newMonth === null) {
            newMonth = this.picker.get("highlight").month;
        }
        if (typeof newDay === "undefined" || newDay === null) {
            newDay = this.picker.get("highlight").date;
        }
        return [newYear, newMonth, newDay];
    };
    return DatePicker;
}());
export { DatePicker };
