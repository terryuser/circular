var version = 1;
var days = 5;

$(document).ready(function() {
    login();
});

function login() {
    var login_status = $.cookie('loginTocken');

    if (login_status == "member") {
        window.location.replace("/circular");
    }
    
    $("#login_submit").click(function(){
        var loginName = $("#login_Name").val();
        var loginPW = $("#login_PW").val();
        var loginData = {"loginName": loginName, "loginPW": loginPW};
        console.log(loginData);

        $.ajax({
            type: 'POST',
            url: '/api_v' + version + '/login',
            dataType: "json",
            data: loginData,
            async: false,
            success: function(respon) {
                console.log(respon);
                if (respon.message=="LoginSuccess") {
                    $.cookie('memberID', respon.ID, { expires: days, path: '/' });
                    $.cookie('loginTocken', "member", { expires: days, path: '/' });
                    window.location.replace("/");
                } else {
                    $("#alert_message").html(respon.message);
                }
            }
        });
    })
}