window.onload = function() {
    ReactDOM.render(
        <BaseForm month={globalData.month} year={globalData.year} userId={globalData.userId} userData={globalData.userData} userList={globalData.userList}/>,
        document.getElementById('react-root')
    );
}