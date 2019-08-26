var api_version = 1;
var userID = $.cookie('memberID');
console.log("user: " + userID);

var GroupInfo;

//Get school group
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/findGrouplist/' + userID,
    dataType: "json",
    async: false,
    success: function(respon) {
        GroupInfo = respon.result;
        requestLevel = respon.authority;
    }
});
console.log(GroupInfo);


$(document).ready(function() {
    input();
    checkOption();
});

function input() {
    var openHTML = "<div class='selection'><select class='custom-select group-list' id='group_list" + "'><option value='newGroup' selected>New Group...</option>"
    $("#group_selection").append(openHTML);

    GroupInfo.forEach(function(option) {
        $("#group_list").append("<option value='" + option._id + "'>" + option.name + "</option>");
    });
    
    var closeHTML = "</select></div>";
    $("#group_selection").append(closeHTML);
}

function checkOption() {
    $("#group_list").on('change', function() {
        var selectGroup = $(this).val();
        if (selectGroup == "newGroup") {
            $(".input-block").show();
        } else {
            $(".input-block").hide();
        }
    });
}

function createMember() {
    
}