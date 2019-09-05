var api_version = 1;
var memberID = $.cookie('memberID');
var webLocation = localStorage.getItem("location");

//Get member info
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/member/' + memberID,
    dataType: "json",
    async: false,
    success: function(respon) {
        memberInfo = respon;
    }
});
console.log(memberInfo);

$(document).ready(function() {
    checkAuthority();
    checkLocation();
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

function checkAuthority() {
    if (memberInfo.authorityLevel > 2) {
        $(".add").remove();
        $(".Edit").remove();
        $(".member").remove();
    }
}

function checkLocation() {
    $("." + webLocation).addClass("current");
}