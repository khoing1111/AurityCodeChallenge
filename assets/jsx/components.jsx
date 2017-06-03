class BaseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            month:      props.month,
            year:       props.year,
            userId:     props.userId,
            userList:   props.userList,
            weekData:   props.userData.data.weeks,

            notificationMessage:    '',
            notificationDisplay:    'hidden'
        };

        // Bind event
        this.notify = this.notify.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
    }

    notify(message) {
        this.setState({
            notificationMessage:    message,
            notificationDisplay:    'block'
        });
    }

    closeNotification() {
        this.setState({
            notificationDisplay:    'hidden'
        });
    }

    render() {
        return (
            <div id='base-form-wrapper' className='center'>
                <div id='user-interface'>
                    <AppTitle title='TIME APPROVING APP' />
                    <UserSelector userList={this.state.userList} currentUserId={this.state.userId} month={this.state.month} year={this.state.year} notify={this.notify} />
                    <Calendar month={this.state.month} year={this.state.year} userId={this.state.userId} weekData={this.state.weekData} notify={this.notify} />
                    <Helper />
                    <Controller month={this.state.month} year={this.state.year} userId={this.state.userId} notify={this.notify} closeNotification={this.closeNotification} />
                </div>
                <div id='notification-popup-wrapper'>
                    <NotificationPopup message={this.state.notificationMessage} display={this.state.notificationDisplay} />
                </div>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// APP TITLE
class AppTitle extends React.Component {
    render() {
        return (
            <div id='app-title-wrapper'>
                <div className='title'>{this.props.title}</div>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// USER SELECTOR
class UserSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionList: [],
            year:       props.year,
            month:      props.month,
            userId:     props.currentUserId
        };

        for (var userIndex in props.userList) {
            var user = props.userList[userIndex];
            var text = user.username + ' (' + user.email + ')';
            this.state.optionList.push(
                <option value={user.id}>{text}</option>
            )
        }

        // Bind event
        this.changeUser = this.changeUser.bind(this);
    }

    changeUser(event) {
        this.props.notify("Loading, please wait");
        window.location.href = '/view/' + event.target.value + '/' + (this.state.month + 1) + '/' + this.state.year;
    }

    render() {
        return (
            <div id='user-input-wrapper'>
                <select onChange={this.changeUser} required="required" value={this.state.userId}>
                    {this.state.optionList}
                </select>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// CALENDAR
class Calendar extends React.Component {
    constructor(props) {
        super(props);

        // Setup state
        var current = new Date(props.year, props.month);
        var monthTitle = ([
            "JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ])[current.getMonth()] + " (" + current.getFullYear() + ")";

        // Get week data
        var weekDataList = {};
        for (var index in props.weekData) {
            var week = props.weekData[index];
            weekDataList[week.week_number] = week;
        }

        this.state = {
            userId:         props.userId,
            year:           props.year,
            month:          current.getMonth(),
            monthTitle:     monthTitle,
            week1:          {date: new Date(current.getFullYear(), current.getMonth(), 1),  weekData: null},
            week2:          {date: new Date(current.getFullYear(), current.getMonth(), 8),  weekData: null},
            week3:          {date: new Date(current.getFullYear(), current.getMonth(), 15), weekData: null},
            week4:          {date: new Date(current.getFullYear(), current.getMonth(), 22), weekData: null},
            week5:          {date: new Date(current.getFullYear(), current.getMonth(), 29), weekData: null},
            week6:          {date: new Date(current.getFullYear(), current.getMonth(), 36), weekData: null},
        };

        // Update week data
        this.state.week1.weekData = weekDataList[this.state.week1.date.getWeekNumber()];
        this.state.week2.weekData = weekDataList[this.state.week2.date.getWeekNumber()];
        this.state.week3.weekData = weekDataList[this.state.week3.date.getWeekNumber()];
        this.state.week4.weekData = weekDataList[this.state.week4.date.getWeekNumber()];
        this.state.week5.weekData = weekDataList[this.state.week5.date.getWeekNumber()];
        this.state.week6.weekData = weekDataList[this.state.week6.date.getWeekNumber()];

        // Bind event
        this.goNextMonth = this.goNextMonth.bind(this);
        this.goPrevMonth = this.goPrevMonth.bind(this);
    }

    goNextMonth() {
        this.props.notify("Loading, please wait");
        window.location.href = '/view/' + this.state.userId + '/' + (this.state.month + 2) + '/' + this.state.year;
    }

    goPrevMonth() {
        this.props.notify("Loading, please wait");
        window.location.href = '/view/' + this.state.userId + '/' + this.state.month + '/' + this.state.year;
    }

    render() {
        return (
            <div id='calendar-wrapper'>
                <table>
                    <tr>
                        <th className='controll' onClick={this.goPrevMonth}><i className="fa fa-angle-left"></i></th>
                        <th className='month-name-title' colSpan='5'>{this.state.monthTitle}</th>
                        <th className='controll' onClick={this.goNextMonth}><i className="fa fa-angle-right"></i></th>
                    </tr>
                    <tr>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th>SAT</th>
                        <th>SUN</th>
                    </tr>
                    <Week date={this.state.week1.date} weekData={this.state.week1.weekData} month={this.state.month} />
                    <Week date={this.state.week2.date} weekData={this.state.week2.weekData} month={this.state.month} />
                    <Week date={this.state.week3.date} weekData={this.state.week3.weekData} month={this.state.month} />
                    <Week date={this.state.week4.date} weekData={this.state.week4.weekData} month={this.state.month} />
                    <Week date={this.state.week5.date} weekData={this.state.week5.weekData} month={this.state.month} />
                    <Week date={this.state.week6.date} weekData={this.state.week6.weekData} month={this.state.month} />
                </table>
            </div>
        );
    }
}

class Week extends React.Component {
    constructor(props) {
        super(props);
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
        this.state = {
            weekId: props.weekData ? props.weekData.week_id : 0,
            status: (props.weekData && props.weekData.status) ? props.weekData.status : 'undefined',
            month:  props.month,
            monDay: {date: monday,      dateData: dateDataList[monday.getDate().toString()]},
            tueDay: {date: tuesday,     dateData: dateDataList[tuesday.getDate().toString()]},
            wedDay: {date: wednesday,   dateData: dateDataList[wednesday.getDate().toString()]},
            thuDay: {date: thursday,    dateData: dateDataList[thursday.getDate().toString()]},
            friDay: {date: friday,      dateData: dateDataList[friday.getDate().toString()]},
            satDay: {date: saturday,    dateData: dateDataList[saturday.getDate().toString()]},
            sunDay: {date: sunday,      dateData: dateDataList[sunday.getDate().toString()]},
        }

        // Bind event
        this.toggleWeek = this.toggleWeek.bind(this);
        this.updateRowStyle = this.updateRowStyle.bind(this);
    }

    toggleWeek(event) {
        this.inputElement.click();
    }

    updateRowStyle(event) {
        var lastSelected = document.getElementsByClassName('week-row-selected')[0];
        if (lastSelected) {
            lastSelected.className = 'week-row-normal';
        }

        this.rowElement.className = 'week-row-selected';
    }

    render() {
        return (
            <tr ref={row => this.rowElement = row} onClick={this.toggleWeek} className='week-row-normal'>
                <input ref={input => this.inputElement = input} onChange={this.updateRowStyle} className='hidden' type="radio" name="week_id" value={this.state.weekId} />
                <td><Day date={this.state.monDay.date} dateData={this.state.monDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.tueDay.date} dateData={this.state.tueDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.wedDay.date} dateData={this.state.wedDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.thuDay.date} dateData={this.state.thuDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.friDay.date} dateData={this.state.friDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.satDay.date} dateData={this.state.satDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
                <td><Day date={this.state.sunDay.date} dateData={this.state.sunDay.dateData} month={this.state.month} dateStatus={this.state.status} /></td>
            </tr>
        );
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
        var isActive = 'active';
        if (props.month != props.date.getMonth()) {
            isActive = 'not-active';
        }

        this.state = {
            className:  'calendar-day-wrapper ' + isActive,
            workHours:  (props.dateData && props.dateData.hours != 0 && props.dateStatus != undefined) ? (props.dateData.hours + 'h') : '0h',
            date:       props.date.getDate(),

            workHoursHelperClass: 'work-hours ' + props.dateStatus
        }
    }

    render() {
        return (
            <div className={this.state.className}>
                <span className='date'>{this.state.date}</span><span className={this.state.workHoursHelperClass}>{this.state.workHours}</span>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// HELPER
class Helper extends React.Component {
    render() {
        return (
            <div id='helper-wrapper'>
                <table>
                    <tr>
                        <td><div className='helper' id='helper-approved'><div className='marker marker-approved'></div>Approved</div></td>
                        <td><div className='helper' id='helper-rejected'><div className='marker marker-rejected'></div>Rejected</div></td>
                        <td><div className='helper' id='helper-waiting'><div className='marker marker-waiting'></div>Waiting</div></td>
                    </tr>
                </table>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// CONTROLLER
class Controller extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:         props.userId,
            year:           props.year,
            month:          props.month,
        };

        // Bind event
        this.approveWeek = this.approveWeek.bind(this);
        this.rejectWeek = this.rejectWeek.bind(this);
    }

    approveWeek() {
        this.props.notify("Approving");
        var weekId = $('input[name="week_id"]:checked').val();
        var that = this;
        if (weekId) {
            $.ajax({
                url: '/approve/' + this.state.userId + '/' + weekId,
                method: 'PUT',
                error: function(jqXHR, status, error) {
                    that.props.notify("System error. Please try again!");
                    setTimeout(function() {
                        that.props.closeNotification();
                    }, 3000);
                },

                success: function(data, status, jqXHR) {
                    console.log(data);
                    that.props.notify("Success. Reloading!");
                    window.location.reload(true);
                }
            });
        }
    }

    rejectWeek() {
        this.props.notify("Rejecting");
        var weekId = $('input[name="week_id"]:checked').val();
        var that = this;
        if (weekId) {
            $.ajax({
                url: '/reject/' + this.state.userId + '/' + weekId,
                method: 'PUT',
                error: function(jqXHR, status, error) {
                    that.props.notify("System error. Please try again!");
                    setTimeout(function() {
                        that.props.closeNotification();
                    }, 3000);
                },

                success: function(data, status, jqXHR) {
                    console.log(data);
                    that.props.notify("Success. Reloading!");
                    window.location.reload(true);
                }
            });
        }
    }

    render() {
        return (
            <div id='controll-wrapper'>
                <table>
                    <tr>
                        <td onClick={this.approveWeek}><div className='button' id='approve-button'>APPROVE</div></td>
                        <td onClick={this.rejectWeek}><div className='button' id='reject-button'>REJECT</div></td>
                    </tr>
                </table>
            </div>
        );
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
// NOTIFICATION POPUP
class NotificationPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message:    props.message,
            dot:        "...",
            display:    props.display
        }
    }

    componentWillUpdate(props, state) {
        if (props.message != this.state.message || props.display != this.state.display) {
            this.setState({
                message: props.message,
                display: props.display
            });
        }
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.tick(),
            500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        var dot = this.state.dot.length + 1;
        if (dot > 3) {
            dot = 1;
        }

        this.setState({
            dot: ".".repeat(dot)
        });
    }

    render() {
        return (
            <div id='notification-popup' className={this.state.display}>
                <div id='notification-curtain'></div>
                <div id='notification-body'>
                    <div id='notification-message'>
                        <span>{this.state.message}</span><br /><span class='dot'>{this.state.dot}</span>
                    </div>
                </div>
            </div>
        );
    }
}