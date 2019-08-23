$(document).ready(function() {
    logout();
});

function logout() {
    $("#logout_btn").click(function(){
        console.log(logout);
        $.cookie('memberName', null);
        $.cookie('loginTocken', null);
        window.location.replace("/");
    });
}