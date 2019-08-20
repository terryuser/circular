var version = 1;
var School_loginID = "demo";

var SchoolID;
var GroupInfo;

var count = 1;

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
var limit = GroupInfo.length();


$(document).ready(function() {
    targetField();

    $("#addOption").click(function(){
        count++;
        console.log(count);

        if(count < limit) {
            targetField();
        } else {
            
        }
    });
});

function getData() {
    $.ajax({
        type: 'POST',
        url: '/api_v' + version + '/circular',
        dataType: "json",
        data: sendData,
        async: false,
        success: function(respon) {
            
        }
    });
}

function targetField() {
    var openHTML = "<div class='selection'><select class='custom-select target' id='target-group-" + count + "'><option selected>All</option>"
    $("#selection_group").append(openHTML);

    GroupInfo.forEach(function(option) {
        $("#target-group-" + count).append("<option value='" + option._id + "'>" + option.name + "</option>");
    });
    
    var closeHTML = "</select></div>";
    $("#selection_group").append(closeHTML);
}
