var version = 1;

$(document).ready(function() {
    getLoginName();
});

function getLoginName() {
    var memberID = $.cookie('memberID');
    $("#getLoginName").html(memberID);
}