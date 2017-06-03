'use strict';

window.onload = function () {
    ReactDOM.render(React.createElement(BaseForm, { month: globalData.month, year: globalData.year, userId: globalData.userId, userData: globalData.userData, userList: globalData.userList }), document.getElementById('react-root'));
};