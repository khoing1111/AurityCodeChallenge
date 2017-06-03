'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseForm = function (_React$Component) {
    _inherits(BaseForm, _React$Component);

    function BaseForm(props) {
        _classCallCheck(this, BaseForm);

        var _this = _possibleConstructorReturn(this, (BaseForm.__proto__ || Object.getPrototypeOf(BaseForm)).call(this, props));

        _this.state = {
            month: props.month,
            year: props.year,
            userId: props.userId,
            userList: props.userList,
            weekData: props.userData.data.weeks,

            notificationMessage: '',
            notificationDisplay: 'hidden'
        };

        // Bind event
        _this.notify = _this.notify.bind(_this);
        _this.closeNotification = _this.closeNotification.bind(_this);
        return _this;
    }

    _createClass(BaseForm, [{
        key: 'notify',
        value: function notify(message) {
            this.setState({
                notificationMessage: message,
                notificationDisplay: 'block'
            });
        }
    }, {
        key: 'closeNotification',
        value: function closeNotification() {
            this.setState({
                notificationDisplay: 'hidden'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'base-form-wrapper', className: 'center' },
                React.createElement(
                    'div',
                    { id: 'user-interface' },
                    React.createElement(AppTitle, { title: 'TIME APPROVING APP' }),
                    React.createElement(UserSelector, { userList: this.state.userList, currentUserId: this.state.userId, month: this.state.month, year: this.state.year, notify: this.notify }),
                    React.createElement(Calendar, { month: this.state.month, year: this.state.year, userId: this.state.userId, weekData: this.state.weekData, notify: this.notify }),
                    React.createElement(Helper, null),
                    React.createElement(Controller, { month: this.state.month, year: this.state.year, userId: this.state.userId, notify: this.notify, closeNotification: this.closeNotification })
                ),
                React.createElement(
                    'div',
                    { id: 'notification-popup-wrapper' },
                    React.createElement(NotificationPopup, { message: this.state.notificationMessage, display: this.state.notificationDisplay })
                )
            );
        }
    }]);

    return BaseForm;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// APP TITLE


var AppTitle = function (_React$Component2) {
    _inherits(AppTitle, _React$Component2);

    function AppTitle() {
        _classCallCheck(this, AppTitle);

        return _possibleConstructorReturn(this, (AppTitle.__proto__ || Object.getPrototypeOf(AppTitle)).apply(this, arguments));
    }

    _createClass(AppTitle, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'app-title-wrapper' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    this.props.title
                )
            );
        }
    }]);

    return AppTitle;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// USER SELECTOR


var UserSelector = function (_React$Component3) {
    _inherits(UserSelector, _React$Component3);

    function UserSelector(props) {
        _classCallCheck(this, UserSelector);

        var _this3 = _possibleConstructorReturn(this, (UserSelector.__proto__ || Object.getPrototypeOf(UserSelector)).call(this, props));

        _this3.state = {
            optionList: [],
            year: props.year,
            month: props.month,
            userId: props.currentUserId
        };

        for (var userIndex in props.userList) {
            var user = props.userList[userIndex];
            var text = user.username + ' (' + user.email + ')';
            _this3.state.optionList.push(React.createElement(
                'option',
                { value: user.id },
                text
            ));
        }

        // Bind event
        _this3.changeUser = _this3.changeUser.bind(_this3);
        return _this3;
    }

    _createClass(UserSelector, [{
        key: 'changeUser',
        value: function changeUser(event) {
            this.props.notify("Loading, please wait");
            window.location.href = '/view/' + event.target.value + '/' + (this.state.month + 1) + '/' + this.state.year;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'user-input-wrapper' },
                React.createElement(
                    'select',
                    { onChange: this.changeUser, required: 'required', value: this.state.userId },
                    this.state.optionList
                )
            );
        }
    }]);

    return UserSelector;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// CALENDAR


var Calendar = function (_React$Component4) {
    _inherits(Calendar, _React$Component4);

    function Calendar(props) {
        _classCallCheck(this, Calendar);

        // Setup state
        var _this4 = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

        var current = new Date(props.year, props.month);
        var monthTitle = ["JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][current.getMonth()] + " (" + current.getFullYear() + ")";

        // Get week data
        var weekDataList = {};
        for (var index in props.weekData) {
            var week = props.weekData[index];
            weekDataList[week.week_number] = week;
        }

        _this4.state = {
            userId: props.userId,
            year: props.year,
            month: current.getMonth(),
            monthTitle: monthTitle,
            week1: { date: new Date(current.getFullYear(), current.getMonth(), 1), weekData: null },
            week2: { date: new Date(current.getFullYear(), current.getMonth(), 8), weekData: null },
            week3: { date: new Date(current.getFullYear(), current.getMonth(), 15), weekData: null },
            week4: { date: new Date(current.getFullYear(), current.getMonth(), 22), weekData: null },
            week5: { date: new Date(current.getFullYear(), current.getMonth(), 29), weekData: null },
            week6: { date: new Date(current.getFullYear(), current.getMonth(), 36), weekData: null }
        };

        // Update week data
        _this4.state.week1.weekData = weekDataList[_this4.state.week1.date.getWeekNumber()];
        _this4.state.week2.weekData = weekDataList[_this4.state.week2.date.getWeekNumber()];
        _this4.state.week3.weekData = weekDataList[_this4.state.week3.date.getWeekNumber()];
        _this4.state.week4.weekData = weekDataList[_this4.state.week4.date.getWeekNumber()];
        _this4.state.week5.weekData = weekDataList[_this4.state.week5.date.getWeekNumber()];
        _this4.state.week6.weekData = weekDataList[_this4.state.week6.date.getWeekNumber()];

        // Bind event
        _this4.goNextMonth = _this4.goNextMonth.bind(_this4);
        _this4.goPrevMonth = _this4.goPrevMonth.bind(_this4);
        return _this4;
    }

    _createClass(Calendar, [{
        key: 'goNextMonth',
        value: function goNextMonth() {
            this.props.notify("Loading, please wait");
            window.location.href = '/view/' + this.state.userId + '/' + (this.state.month + 2) + '/' + this.state.year;
        }
    }, {
        key: 'goPrevMonth',
        value: function goPrevMonth() {
            this.props.notify("Loading, please wait");
            window.location.href = '/view/' + this.state.userId + '/' + this.state.month + '/' + this.state.year;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'calendar-wrapper' },
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            { className: 'controll', onClick: this.goPrevMonth },
                            React.createElement('i', { className: 'fa fa-angle-left' })
                        ),
                        React.createElement(
                            'th',
                            { className: 'month-name-title', colSpan: '5' },
                            this.state.monthTitle
                        ),
                        React.createElement(
                            'th',
                            { className: 'controll', onClick: this.goNextMonth },
                            React.createElement('i', { className: 'fa fa-angle-right' })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'MON'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'TUE'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'WED'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'THU'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'FRI'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'SAT'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'SUN'
                        )
                    ),
                    React.createElement(Week, { date: this.state.week1.date, weekData: this.state.week1.weekData, month: this.state.month }),
                    React.createElement(Week, { date: this.state.week2.date, weekData: this.state.week2.weekData, month: this.state.month }),
                    React.createElement(Week, { date: this.state.week3.date, weekData: this.state.week3.weekData, month: this.state.month }),
                    React.createElement(Week, { date: this.state.week4.date, weekData: this.state.week4.weekData, month: this.state.month }),
                    React.createElement(Week, { date: this.state.week5.date, weekData: this.state.week5.weekData, month: this.state.month }),
                    React.createElement(Week, { date: this.state.week6.date, weekData: this.state.week6.weekData, month: this.state.month })
                )
            );
        }
    }]);

    return Calendar;
}(React.Component);

var Week = function (_React$Component5) {
    _inherits(Week, _React$Component5);

    function Week(props) {
        _classCallCheck(this, Week);

        var _this5 = _possibleConstructorReturn(this, (Week.__proto__ || Object.getPrototypeOf(Week)).call(this, props));

        var date = props.date;

        // Revert to monday
        var toMondayOffset = date.getDay();
        if (toMondayOffset == 1) {
            toMondayOffset = 0;
        } else if (toMondayOffset == 0) {
            toMondayOffset = -6;
        } else {
            toMondayOffset = -toMondayOffset;
        }

        // Calculate each date in week
        var monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + toMondayOffset);
        var tuesday = new Date(monday.getTime() + 86400000);
        var wednesday = new Date(tuesday.getTime() + 86400000);
        var thursday = new Date(wednesday.getTime() + 86400000);
        var friday = new Date(thursday.getTime() + 86400000);
        var saturday = new Date(friday.getTime() + 86400000);
        var sunday = new Date(saturday.getTime() + 86400000);
        var dateDataList = {};
        if (props.weekData) {
            for (var dateDataIndex in props.weekData.days_in_week) {
                var dateData = props.weekData.days_in_week[dateDataIndex];
                dateDataList[dateData.day_number] = dateData;
            }
        }

        // Update state
        _this5.state = {
            weekId: props.weekData ? props.weekData.week_id : 0,
            status: props.weekData && props.weekData.status ? props.weekData.status : 'undefined',
            month: props.month,
            monDay: { date: monday, dateData: dateDataList[monday.getDate().toString()] },
            tueDay: { date: tuesday, dateData: dateDataList[tuesday.getDate().toString()] },
            wedDay: { date: wednesday, dateData: dateDataList[wednesday.getDate().toString()] },
            thuDay: { date: thursday, dateData: dateDataList[thursday.getDate().toString()] },
            friDay: { date: friday, dateData: dateDataList[friday.getDate().toString()] },
            satDay: { date: saturday, dateData: dateDataList[saturday.getDate().toString()] },
            sunDay: { date: sunday, dateData: dateDataList[sunday.getDate().toString()] }

            // Bind event
        };_this5.toggleWeek = _this5.toggleWeek.bind(_this5);
        _this5.updateRowStyle = _this5.updateRowStyle.bind(_this5);
        return _this5;
    }

    _createClass(Week, [{
        key: 'toggleWeek',
        value: function toggleWeek(event) {
            this.inputElement.click();
        }
    }, {
        key: 'updateRowStyle',
        value: function updateRowStyle(event) {
            var lastSelected = document.getElementsByClassName('week-row-selected')[0];
            if (lastSelected) {
                lastSelected.className = 'week-row-normal';
            }

            this.rowElement.className = 'week-row-selected';
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            return React.createElement(
                'tr',
                { ref: function ref(row) {
                        return _this6.rowElement = row;
                    }, onClick: this.toggleWeek, className: 'week-row-normal' },
                React.createElement('input', { ref: function ref(input) {
                        return _this6.inputElement = input;
                    }, onChange: this.updateRowStyle, className: 'hidden', type: 'radio', name: 'week_id', value: this.state.weekId }),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.monDay.date, dateData: this.state.monDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.tueDay.date, dateData: this.state.tueDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.wedDay.date, dateData: this.state.wedDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.thuDay.date, dateData: this.state.thuDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.friDay.date, dateData: this.state.friDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.satDay.date, dateData: this.state.satDay.dateData, month: this.state.month, dateStatus: this.state.status })
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(Day, { date: this.state.sunDay.date, dateData: this.state.sunDay.dateData, month: this.state.month, dateStatus: this.state.status })
                )
            );
        }
    }]);

    return Week;
}(React.Component);

var Day = function (_React$Component6) {
    _inherits(Day, _React$Component6);

    function Day(props) {
        _classCallCheck(this, Day);

        var _this7 = _possibleConstructorReturn(this, (Day.__proto__ || Object.getPrototypeOf(Day)).call(this, props));

        var isActive = 'active';
        if (props.month != props.date.getMonth()) {
            isActive = 'not-active';
        }

        _this7.state = {
            className: 'calendar-day-wrapper ' + isActive,
            workHours: props.dateData && props.dateData.hours != 0 && props.dateStatus != undefined ? props.dateData.hours + 'h' : '0h',
            date: props.date.getDate(),

            workHoursHelperClass: 'work-hours ' + props.dateStatus
        };
        return _this7;
    }

    _createClass(Day, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: this.state.className },
                React.createElement(
                    'span',
                    { className: 'date' },
                    this.state.date
                ),
                React.createElement(
                    'span',
                    { className: this.state.workHoursHelperClass },
                    this.state.workHours
                )
            );
        }
    }]);

    return Day;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// HELPER


var Helper = function (_React$Component7) {
    _inherits(Helper, _React$Component7);

    function Helper() {
        _classCallCheck(this, Helper);

        return _possibleConstructorReturn(this, (Helper.__proto__ || Object.getPrototypeOf(Helper)).apply(this, arguments));
    }

    _createClass(Helper, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'helper-wrapper' },
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'div',
                                { className: 'helper', id: 'helper-approved' },
                                React.createElement('div', { className: 'marker marker-approved' }),
                                'Approved'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'div',
                                { className: 'helper', id: 'helper-rejected' },
                                React.createElement('div', { className: 'marker marker-rejected' }),
                                'Rejected'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'div',
                                { className: 'helper', id: 'helper-waiting' },
                                React.createElement('div', { className: 'marker marker-waiting' }),
                                'Waiting'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Helper;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// CONTROLLER


var Controller = function (_React$Component8) {
    _inherits(Controller, _React$Component8);

    function Controller(props) {
        _classCallCheck(this, Controller);

        var _this9 = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, props));

        _this9.state = {
            userId: props.userId,
            year: props.year,
            month: props.month
        };

        // Bind event
        _this9.approveWeek = _this9.approveWeek.bind(_this9);
        _this9.rejectWeek = _this9.rejectWeek.bind(_this9);
        return _this9;
    }

    _createClass(Controller, [{
        key: 'approveWeek',
        value: function approveWeek() {
            this.props.notify("Approving");
            var weekId = $('input[name="week_id"]:checked').val();
            var that = this;
            if (weekId) {
                $.ajax({
                    url: '/approve/' + this.state.userId + '/' + weekId,
                    method: 'PUT',
                    error: function error(jqXHR, status, _error) {
                        that.props.notify("System error. Please try again!");
                        setTimeout(function () {
                            that.props.closeNotification();
                        }, 3000);
                    },

                    success: function success(data, status, jqXHR) {
                        console.log(data);
                        that.props.notify("Success. Reloading!");
                        window.location.reload(true);
                    }
                });
            }
        }
    }, {
        key: 'rejectWeek',
        value: function rejectWeek() {
            this.props.notify("Rejecting");
            var weekId = $('input[name="week_id"]:checked').val();
            var that = this;
            if (weekId) {
                $.ajax({
                    url: '/reject/' + this.state.userId + '/' + weekId,
                    method: 'PUT',
                    error: function error(jqXHR, status, _error2) {
                        that.props.notify("System error. Please try again!");
                        setTimeout(function () {
                            that.props.closeNotification();
                        }, 3000);
                    },

                    success: function success(data, status, jqXHR) {
                        console.log(data);
                        that.props.notify("Success. Reloading!");
                        window.location.reload(true);
                    }
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'controll-wrapper' },
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { onClick: this.approveWeek },
                            React.createElement(
                                'div',
                                { className: 'button', id: 'approve-button' },
                                'APPROVE'
                            )
                        ),
                        React.createElement(
                            'td',
                            { onClick: this.rejectWeek },
                            React.createElement(
                                'div',
                                { className: 'button', id: 'reject-button' },
                                'REJECT'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Controller;
}(React.Component);

//----------------------------------------------------------------------------------------------------------------------------------------------------
// NOTIFICATION POPUP


var NotificationPopup = function (_React$Component9) {
    _inherits(NotificationPopup, _React$Component9);

    function NotificationPopup(props) {
        _classCallCheck(this, NotificationPopup);

        var _this10 = _possibleConstructorReturn(this, (NotificationPopup.__proto__ || Object.getPrototypeOf(NotificationPopup)).call(this, props));

        _this10.state = {
            message: props.message,
            dot: "...",
            display: props.display
        };
        return _this10;
    }

    _createClass(NotificationPopup, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate(props, state) {
            if (props.message != this.state.message || props.display != this.state.display) {
                this.setState({
                    message: props.message,
                    display: props.display
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this11 = this;

            this.timer = setInterval(function () {
                return _this11.tick();
            }, 500);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.timer);
        }
    }, {
        key: 'tick',
        value: function tick() {
            var dot = this.state.dot.length + 1;
            if (dot > 3) {
                dot = 1;
            }

            this.setState({
                dot: ".".repeat(dot)
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'notification-popup', className: this.state.display },
                React.createElement('div', { id: 'notification-curtain' }),
                React.createElement(
                    'div',
                    { id: 'notification-body' },
                    React.createElement(
                        'div',
                        { id: 'notification-message' },
                        React.createElement(
                            'span',
                            null,
                            this.state.message
                        ),
                        React.createElement('br', null),
                        React.createElement(
                            'span',
                            { 'class': 'dot' },
                            this.state.dot
                        )
                    )
                )
            );
        }
    }]);

    return NotificationPopup;
}(React.Component);