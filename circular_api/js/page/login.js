$(document).ready(function() {
    login();
});

function login() {
    $("#login_submit").click(function(){
        var loginName = $("#login_Name").val();
        var loginPW = $("#login_PW").val();
        var loginData = {"loginName": loginName, "loginPW": loginPW};
    })
}