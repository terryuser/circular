var version = 1;
var School_loginID = "demo";

var SchoolID;
var GroupInfo;

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
    
});

function input() {
    GroupInfo.forEach(function(option) {
        console.log(element);
      });
    $("#group_selection").append();
}