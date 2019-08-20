var version = 1;
var School_loginID = "demo";

var SchoolID;
var GroupInfo;

//Get school
$.ajax({
    type: 'POST',
    url: '/api_v' + version + '/school/' + School_loginID,
    dataType: "json",
    async: false,
    success: function(respon) {
        SchoolID = respon._id;
    }
});
console.log(SchoolID);

//Get school group
$.ajax({
    type: 'POST',
    url: '/api_v' + version + '/group/' + SchoolID,
    dataType: "json",
    async: false,
    success: function(respon) {
        GroupInfo = respon.result;
    }
});
console.log(GroupInfo);


$(document).ready(function() {
    input();
});

function input() {
    var count = 1;

    var openHTML = "<div class='selection'><select class='custom-select target' id='target-group-" + count + "'><option selected>All</option>"
    $("#group_selection").append(openHTML);

    GroupInfo.forEach(function(option) {
        $("#target-group-" + count).append("<option value='" + option._id + "'>" + option.name + "</option>");
    });
    
    var closeHTML = "</select></div>";
    $("#group_selection").append(closeHTML);
}