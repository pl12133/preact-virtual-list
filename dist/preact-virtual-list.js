!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory(require("preact")) : "function" == typeof define && define.amd ? define([ "preact" ], factory) : (global = global || self, 
    global.VirtualList = factory(global.preact));
}(this, function(preact) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
        Constructor;
    }
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    function _extends() {
        return _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _extends.apply(this, arguments);
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        })(o);
    }
    function _setPrototypeOf(o, p) {
        return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
            return o.__proto__ = p, o;
        })(o, p);
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (null == source) return {};
        var key, i, target = {}, sourceKeys = Object.keys(source);
        for (i = 0; i < sourceKeys.length; i++) key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
        return target;
    }
    function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }
    function _assertThisInitialized(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        return !call || "object" != typeof call && "function" != typeof call ? _assertThisInitialized(self) : call;
    }
    return function(_Component) {
        function VirtualList() {
            var _getPrototypeOf2, _this;
            _classCallCheck(this, VirtualList);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VirtualList)).call.apply(_getPrototypeOf2, [ this ].concat(args))), 
            _defineProperty(_assertThisInitialized(_this), "focus", function(index) {
                var _this$visibleRowRange = _this.visibleRowRange, start = _this$visibleRowRange.start, end = _this$visibleRowRange.end, rowHeight = _this.props.rowHeight;
                if (index < start || end < index) _this.scrollTop = index * rowHeight, _this.refocusIndex = index; else {
                    var virtualIndex = _this.indexToVindex(index), refocus = Array.from(_this.base.firstChild.firstChild.childNodes)[virtualIndex];
                    refocus && refocus.focus();
                }
            }), _defineProperty(_assertThisInitialized(_this), "indexToVindex", function(index) {
                return index - _this.visibleRowRange.start;
            }), _defineProperty(_assertThisInitialized(_this), "resize", function() {
                _this.state.height !== _this.base.offsetHeight && _this.setState({
                    height: _this.base.offsetHeight
                });
            }), _defineProperty(_assertThisInitialized(_this), "handleScroll", function(e) {
                var prevStart = _this.visibleRowRange.start, focusedIndex = Array.from(_this.base.firstChild.firstChild.childNodes).indexOf(document.activeElement);
                _this.setState({
                    offset: _this.scrollTop
                }, function() {
                    var nextStart = _this.visibleRowRange.start;
                    if (prevStart !== nextStart) {
                        var refocusIndex = void 0 !== _this.refocusIndex ? _this.indexToVindex(_this.refocusIndex) : prevStart < nextStart ? focusedIndex - (nextStart - prevStart) : focusedIndex + (prevStart - nextStart);
                        _this.refocusIndex = void 0;
                        var refocus = Array.from(_this.base.firstChild.firstChild.childNodes)[refocusIndex];
                        refocus && refocus.focus();
                    }
                }), _this.props.sync && _this.forceUpdate(), _this.props.onScroll && _this.props.onScroll(e);
            }), _this;
        }
        return _inherits(VirtualList, _Component), _createClass(VirtualList, [ {
            key: "componentDidUpdate",
            value: function() {
                this.resize();
            }
        }, {
            key: "componentDidMount",
            value: function() {
                this.resize(), addEventListener("resize", this.resize);
            }
        }, {
            key: "componentWillUnmount",
            value: function() {
                removeEventListener("resize", this.resize);
            }
        }, {
            key: "render",
            value: function(_ref, _ref2) {
                var data = (_ref2.offset, _ref2.height, _ref.data), rowHeight = _ref.rowHeight, renderRow = _ref.renderRow, props = (_ref.overscanCount, 
                _ref.sync, _objectWithoutProperties(_ref, [ "data", "rowHeight", "renderRow", "overscanCount", "sync" ])), _this$visibleRowRange2 = this.visibleRowRange, start = _this$visibleRowRange2.start, end = _this$visibleRowRange2.end, selection = data.slice(start, end);
                return preact.createElement("div", _extends({}, props, {
                    onScroll: this.handleScroll
                }), preact.createElement("div", {
                    style: "".concat("position:relative; overflow:hidden; width:100%; min-height:100%;", " height:").concat(data.length * rowHeight, "px;")
                }, preact.createElement("div", {
                    style: "".concat("position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;", " top:").concat(start * rowHeight, "px;")
                }, selection.map(function(row, index) {
                    return renderRow(row, start + index, data);
                }))));
            }
        }, {
            key: "scrollTop",
            get: function() {
                return this.base && this.base.scrollTop;
            },
            set: function(scrollTop) {
                this.base && (this.base.scrollTop = scrollTop);
            }
        }, {
            key: "visibleRowRange",
            get: function() {
                var _this$props = this.props, _this$props$overscanC = _this$props.overscanCount, overscanCount = void 0 === _this$props$overscanC ? 10 : _this$props$overscanC, rowHeight = _this$props.rowHeight, _this$state = this.state, _this$state$offset = _this$state.offset, offset = void 0 === _this$state$offset ? 0 : _this$state$offset, _this$state$height = _this$state.height, height = void 0 === _this$state$height ? 0 : _this$state$height, start = offset / rowHeight | 0, visibleRowCount = height / rowHeight | 0;
                return overscanCount && (start = Math.max(0, start - start % overscanCount), visibleRowCount += overscanCount), 
                {
                    start: start,
                    end: start + 1 + visibleRowCount,
                    visibleRowCount: visibleRowCount
                };
            }
        } ]), VirtualList;
    }(preact.Component);
});
//# sourceMappingURL=preact-virtual-list.js.map