import { createElement, Component } from 'preact';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
var STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';
/** Virtual list, renders only visible items.
 *	@param {Array<*>} data         List of data items
 *	@param {Function} renderRow    Renders a single row
 *	@param {Number} rowHeight      Static height of a row
 *	@param {Number} overscanCount  Amount of rows to render above and below visible area of the list
 *	@param {Boolean} [sync=false]  true forces synchronous rendering
 *	@example
 *		<VirtualList
 *			data={['a', 'b', 'c']}
 *			renderRow={ row => <div>{row}</div> }
 *			rowHeight={22}
 *			sync
 *		/>
 */

var VirtualList = /*#__PURE__*/function (_Component) {
  _inherits(VirtualList, _Component);

  function VirtualList() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, VirtualList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VirtualList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "focus", function (index) {
      var _this$visibleRowRange = _this.visibleRowRange,
          start = _this$visibleRowRange.start,
          end = _this$visibleRowRange.end;
      var rowHeight = _this.props.rowHeight;

      if (index < start || end < index) {
        // Scroll to index * rowHeight.  This will trigger `handleScroll` which consumes `refocusIndex`.
        _this.scrollTop = index * rowHeight;
        _this.refocusIndex = index;
      } else {
        var virtualIndex = _this.indexToVindex(index);

        var refocus = Array.from(_this.base.firstChild.firstChild.childNodes)[virtualIndex];

        if (refocus) {
          refocus.focus();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "indexToVindex", function (index) {
      var start = _this.visibleRowRange.start;
      return index - start;
    });

    _defineProperty(_assertThisInitialized(_this), "resize", function () {
      if (_this.state.height !== _this.base.offsetHeight) {
        _this.setState({
          height: _this.base.offsetHeight
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleScroll", function (e) {
      var prevStart = _this.visibleRowRange.start;
      var focusedIndex = Array.from(_this.base.firstChild.firstChild.childNodes).indexOf(document.activeElement);

      _this.setState({
        offset: _this.scrollTop
      }, function () {
        var nextStart = _this.visibleRowRange.start;

        if (prevStart !== nextStart) {
          var refocusIndex = typeof _this.refocusIndex !== 'undefined' ? _this.indexToVindex(_this.refocusIndex) : prevStart < nextStart ? focusedIndex - (nextStart - prevStart) : focusedIndex + (prevStart - nextStart);
          _this.refocusIndex = undefined;
          var refocus = Array.from(_this.base.firstChild.firstChild.childNodes)[refocusIndex];

          if (refocus) {
            refocus.focus();
          }
        }
      });

      if (_this.props.sync) _this.forceUpdate();

      if (_this.props.onScroll) {
        _this.props.onScroll(e);
      }
    });

    return _this;
  }

  _createClass(VirtualList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.resize();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.resize();
      addEventListener('resize', this.resize);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      removeEventListener('resize', this.resize);
    }
  }, {
    key: "render",
    value: function render(_ref, _ref2) {
      var _ref2$offset = _ref2.offset,
          _ref2$height = _ref2.height;

      var data = _ref.data,
          rowHeight = _ref.rowHeight,
          renderRow = _ref.renderRow,
          _ref$overscanCount = _ref.overscanCount,
          sync = _ref.sync,
          props = _objectWithoutProperties(_ref, ["data", "rowHeight", "renderRow", "overscanCount", "sync"]);

      var _this$visibleRowRange2 = this.visibleRowRange,
          start = _this$visibleRowRange2.start,
          end = _this$visibleRowRange2.end; // data slice currently in viewport plus overscan items

      var selection = data.slice(start, end);
      return createElement("div", _extends({}, props, {
        onScroll: this.handleScroll
      }), createElement("div", {
        style: "".concat(STYLE_INNER, " height:").concat(data.length * rowHeight, "px;")
      }, createElement("div", {
        style: "".concat(STYLE_CONTENT, " top:").concat(start * rowHeight, "px;")
      }, selection.map(function (row, index) {
        return renderRow(row, start + index, data);
      }))));
    }
  }, {
    key: "scrollTop",
    get: function get() {
      return this.base && this.base.scrollTop;
    },
    set: function set(scrollTop) {
      if (this.base) {
        this.base.scrollTop = scrollTop;
      }
    }
  }, {
    key: "visibleRowRange",
    get: function get() {
      var _this$props = this.props,
          _this$props$overscanC = _this$props.overscanCount,
          overscanCount = _this$props$overscanC === void 0 ? 10 : _this$props$overscanC,
          rowHeight = _this$props.rowHeight;
      var _this$state = this.state,
          _this$state$offset = _this$state.offset,
          offset = _this$state$offset === void 0 ? 0 : _this$state$offset,
          _this$state$height = _this$state.height,
          height = _this$state$height === void 0 ? 0 : _this$state$height; // first visible row index

      var start = offset / rowHeight | 0; // actual number of visible rows (without overscan)

      var visibleRowCount = height / rowHeight | 0; // Overscan: render blocks of rows modulo an overscan row count
      // This dramatically reduces DOM writes during scrolling

      if (overscanCount) {
        start = Math.max(0, start - start % overscanCount);
        visibleRowCount += overscanCount;
      } // last visible + overscan row index


      var end = start + 1 + visibleRowCount;
      return {
        start: start,
        end: end,
        visibleRowCount: visibleRowCount
      };
    }
  }]);

  return VirtualList;
}(Component);

export default VirtualList;
