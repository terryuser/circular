var version = 1;

$(document).ready(function() {
    getLoginName();
});

function getLoginName() {
    var Name = localStorage.getItem("loginID");
    $("#getLoginName").html(Name);
}