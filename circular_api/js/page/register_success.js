var version = 1;

$(document).ready(function() {
    getLoginName();
});

function getLoginName() {
    var userID = $.cookie('memberID');
    $("#getLoginName").html(userID);
}