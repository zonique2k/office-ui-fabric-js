var TextFieldConsts;
(function (TextFieldConsts) {
    var Type;
    (function (Type) {
        Type[Type["Placeholder"] = 0] = "Placeholder";
        Type[Type["Underlined"] = 1] = "Underlined";
    })(Type = TextFieldConsts.Type || (TextFieldConsts.Type = {}));
})(TextFieldConsts || (TextFieldConsts = {}));
var TextField = (function () {
    function TextField(container) {
        this._container = container;
        this._type = [];
        this._textField = this._container.querySelector(".ms-TextField-field");
        this._textFieldLabel = this._container.querySelector(".ms-Label");
        this._setTextFieldType();
        this._addListeners();
    }
    TextField.prototype._setTextFieldType = function () {
        if (this._container.classList.contains("ms-TextField--placeholder")) {
            this._type.push(TextFieldConsts.Type.Placeholder);
        }
        if (this._container.classList.contains("ms-TextField--underlined")) {
            this._type.push(TextFieldConsts.Type.Underlined);
        }
    };
    TextField.prototype._addListeners = function () {
        var _this = this;
        this._textFieldLabel.addEventListener("click", function (event) {
            _this._textField.focus();
        });
        if (this._type.indexOf(TextFieldConsts.Type.Placeholder) >= 0) {
            this._textField.addEventListener("focus", function (event) {
                _this._textFieldLabel.style.display = "none";
            });
            this._textField.addEventListener("blur", function (event) {
                if (_this._textField.value.length === 0) {
                    _this._textFieldLabel.style.display = "block";
                }
            });
        }
        if (this._type.indexOf(TextFieldConsts.Type.Underlined) >= 0) {
            this._textField.addEventListener("focus", function (event) {
                _this._container.classList.add("is-active");
            });
            this._textField.addEventListener("blur", function (event) {
                _this._container.classList.remove("is-active");
            });
        }
    };
    return TextField;
}());
export { TextField };
