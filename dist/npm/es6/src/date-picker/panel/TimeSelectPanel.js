import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

import { PropTypes, Component } from '../../../libs';
import { PopperReactMixin } from '../../../libs/utils';
import { scrollIntoView } from '../../../libs/utils/dom';

import { Scrollbar } from '../../scrollbar';

var TimeSelectPanel = function (_Component) {
  _inherits(TimeSelectPanel, _Component);

  function TimeSelectPanel(props) {
    _classCallCheck(this, TimeSelectPanel);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    PopperReactMixin.call(_this, function () {
      return _this.refs.root;
    }, _this.props.getPopperRefElement, Object.assign({
      boundariesPadding: 0,
      gpuAcceleration: false
    }, props.popperMixinOption));
    return _this;
  }

  TimeSelectPanel.prototype.handleClick = function handleClick(item) {
    var _props = this.props,
        onPicked = _props.onPicked,
        dateParser = _props.dateParser;

    if (!item.disabled) {
      onPicked(dateParser(item.value));
    }
  };

  TimeSelectPanel.prototype.items = function items() {
    return TimeSelectPanel.items(this.props);
  };

  TimeSelectPanel.prototype.scrollToOption = function scrollToOption() {
    var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'selected';

    var menu = this.refs.root.querySelector('.el-picker-panel__content');
    scrollIntoView(menu, menu.getElementsByClassName(className)[0]);
  };

  TimeSelectPanel.prototype.componentDidMount = function componentDidMount() {
    this.scrollToOption();
  };

  TimeSelectPanel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    clearTimeout(this._timer);
    if (nextProps.value !== this.props.value) {
      this._timer = setTimeout(function () {
        return _this2.scrollToOption();
      }, 0);
    }
  };

  TimeSelectPanel.prototype.render = function render() {
    var _this3 = this;

    var value = this.props.value;


    return React.createElement(
      'div',
      {
        ref: 'root',
        className: 'el-picker-panel time-select' },
      React.createElement(
        Scrollbar,
        { wrapClass: 'el-picker-panel__content', noresize: true },
        this.items().map(function (item, idx) {
          return React.createElement(
            'div',
            { key: idx,
              className: _this3.classNames('time-select-item', { selected: value === item.value, disabled: item.disabled }),
              disabled: item.disabled,
              onClick: function onClick() {
                return _this3.handleClick(item);
              } },
            item.value
          );
        })
      )
    );
  };

  return TimeSelectPanel;
}(Component);

export default TimeSelectPanel;


TimeSelectPanel.isValid = function (value, _ref) {
  var start = _ref.start,
      end = _ref.end,
      step = _ref.step,
      minTime = _ref.minTime,
      maxTime = _ref.maxTime;

  var items = TimeSelectPanel.items({ start: start, end: end, step: step, minTime: minTime, maxTime: maxTime });
  return !!items.filter(function (e) {
    return !e.disabled;
  }).find(function (e) {
    return e.value === value;
  });
};

TimeSelectPanel.items = function (_ref2) {
  var start = _ref2.start,
      end = _ref2.end,
      step = _ref2.step,
      minTime = _ref2.minTime,
      maxTime = _ref2.maxTime;

  var result = [];

  if (start && end && step) {
    var current = start;
    while (compareTime(current, end) <= 0) {
      result.push({
        value: current,
        disabled: compareTime(current, minTime || '-1:-1') <= 0 || compareTime(current, maxTime || '100:100') >= 0
      });
      current = nextTime(current, step);
    }
  }
  return result;
};

TimeSelectPanel.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  step: PropTypes.string,
  minTime: PropTypes.string,
  maxTime: PropTypes.string,
  value: PropTypes.string,
  onPicked: PropTypes.func,
  //(string)=>date
  dateParser: PropTypes.func.isRequired,
  //()=>HtmlElement
  getPopperRefElement: PropTypes.func,
  popperMixinOption: PropTypes.object
};

TimeSelectPanel.defaultProps = {
  start: '09:00',
  end: '18:00',
  step: '00:30',
  minTime: '',
  onPicked: function onPicked() {},

  popperMixinOption: {}
};

var parseTime = function parseTime(time) {
  var values = (time || '').split(':');
  if (values.length >= 2) {
    var hours = parseInt(values[0], 10);
    var minutes = parseInt(values[1], 10);

    return {
      hours: hours,
      minutes: minutes
    };
  }
  /* istanbul ignore next */
  return null;
};

var compareTime = function compareTime(time1, time2) {
  var value1 = parseTime(time1);
  var value2 = parseTime(time2);

  var minutes1 = value1.minutes + value1.hours * 60;
  var minutes2 = value2.minutes + value2.hours * 60;

  if (minutes1 === minutes2) {
    return 0;
  }

  return minutes1 > minutes2 ? 1 : -1;
};

var formatTime = function formatTime(time) {
  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
};

var nextTime = function nextTime(time, step) {
  var timeValue = parseTime(time);
  var stepValue = parseTime(step);

  var next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes
  };

  next.minutes += stepValue.minutes;
  next.hours += stepValue.hours;

  next.hours += Math.floor(next.minutes / 60);
  next.minutes = next.minutes % 60;

  return formatTime(next);
};