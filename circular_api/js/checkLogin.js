var login_status = $.cookie('loginTocken');

if (login_status != "member") {
    window.location.replace("/warning");
}