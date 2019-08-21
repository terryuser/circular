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
var limit = GroupInfo.length;

$(document).ready(function() {
    targetField();
    $("#minusOption").hide();
    selectionAction();

});

function selectionAction() {

    $("#addOption").click(function(){
        $("#target-group-" + count).prop('disabled', 'disabled');
        count++;
        if(count < limit) {
            targetField();
            $("#minusOption").show();
        } else if (count = limit) {
            targetField();
            $("#minusOption").show();
            $("#addOption").hide();
        } else {
            $("#minusOption").show();
            $("#addOption").hide();
        }
    });

    $("#minusOption").click(function(){
        var targetID = count;
        count--;
        if (count == 1) {
            $("#target-group-" + count).removeAttr('disabled');
            $("#target-group-" + targetID).remove();
            $("#addOption").show();
            $("#minusOption").hide();
        } else {
            $("#target-group-" + count).removeAttr('disabled');
            $("#target-group-" + targetID).remove();
            $("#addOption").show();
        }
    });
}

function targetField() {
    var openHTML = "<select class='custom-select target-selector' id='target-group-" + count + "'>"
    $("#selection_group").append(openHTML);

    if (count == 1) {
        $("#target-group-1").append("<option value='all' selected>All</option>");
    }
    console.log("targerField count: " + count);
    if (count > 1) {
        console.log("count more than 1");
        var checkValue = new Array;
        for (i = 1; i < count; i++ ) {
            var checkCount = count - i;
            checkValue.push($("#target-group-" + checkCount).val());
            console.log(checkValue);
        }
        GroupInfo.forEach(function(option) {
            if (checkValue.includes(option._id)) {
                console.log("selected");
            } else {
                $("#target-group-" + count).append("<option value='" + option._id + "'>" + option.name + "</option>");
            }
        });
    } else {
        console.log("count equal 1");
        GroupInfo.forEach(function(option) {
            $("#target-group-" + count).append("<option value='" + option._id + "'>" + option.name + "</option>");
        }); 
    }
     

    var closeHTML = "</select>";
    $("#selection_group").append(closeHTML);
}