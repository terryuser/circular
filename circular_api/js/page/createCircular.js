var version = 1;
var userID = $.cookie('memberID');
console.log(userID);

var GroupInfo;
var requestLevel;

var targetCount = 1;
var optionCount = 1;

var reply_block_show = false;

//Get school group
$.ajax({
    type: 'POST',
    url: '/api_v' + version + '/findGrouplist/' + userID,
    dataType: "json",
    async: false,
    success: function(respon) {
        GroupInfo = respon.result;
        requestLevel = respon.authority;
        localStorage.setItem("request", requestLevel);
    }
});
console.log(GroupInfo);
var limit = GroupInfo.length;

$(document).ready(function() {
    targetField();
    $("#addTarget").hide();
    $("#minusTarget").hide();
    selectionAction();
    $("#reply_block").hide();
    checkReply();
    $("#minusOption").hide();
    addOption();
});

function selectionAction() {

    $("#addTarget").click(function(){
        $("#target-group-" + targetCount).prop('disabled', 'disabled');
        targetCount++;
        if(targetCount < limit) {
            targetField();
            $("#minusTarget").show();
        } else if (targetCount = limit) {
            targetField();
            $("#minusTarget").show();
            $("#addTarget").hide();
        } else {
            $("#minusTarget").show();
            $("#addTarget").hide();
        }
    });

    $("#minusTarget").click(function(){
        var targetID = targetCount;
        targetCount--;
        if (targetCount == 1) {
            $("#target-group-" + targetCount).removeAttr('disabled');
            $("#target-group-" + targetID).remove();
            $("#addTarget").show();
            $("#minusTarget").hide();
        } else {
            $("#target-group-" + targetCount).removeAttr('disabled');
            $("#target-group-" + targetID).remove();
            $("#addTarget").show();
        }
    });
}

function targetField() {
    var openHTML = "<select class='custom-select target-selector' id='target-group-" + targetCount + "'>"
    $("#selection_group").append(openHTML);

    if (targetCount == 1) {
        $("#target-group-1").append("<option value='all' selected>All</option>");
    }
    console.log("targerField targetCount: " + targetCount);
    if (targetCount > 1) {
        console.log("targetCount more than 1");
        var checkValue = new Array;
        for (i = 1; i < targetCount; i++ ) {
            var checkCount = targetCount - i;
            checkValue.push($("#target-group-" + checkCount).val());
            console.log(checkValue);
        }
        GroupInfo.forEach(function(option) {
            if (checkValue.includes(option._id)) {
                console.log("selected");
            } else {
                $("#target-group-" + targetCount).append("<option value='" + option._id + "'>" + option.name + "</option>");
            }
        });
    } else {
        console.log("targetCount equal 1");
        GroupInfo.forEach(function(option) {
            $("#target-group-" + targetCount).append("<option value='" + option._id + "'>" + option.name + "</option>");
        }); 
    }
     

    var closeHTML = "</select>";
    $("#selection_group").append(closeHTML);

    $("#target-group-1").on('change', function() {
        if ($(this).val() != "all") {
            $("#addTarget").show();
        } else {
            $("#addTarget").hide();
        }
    });
}

function checkReply() {
    $("#replyType").on('change', function() {
        var replyMethod = $(this).val();
        switch (replyMethod) {
            default :
                $("#reply_block").hide();
            break;
            
            case "signature" :
                reply_block_show = false;
                $("#reply_block").hide();
            break;

            case "singleChoice" :
                optionBlock()
                $("#reply_block").show();
            break;

            case "multipleChoice" :
                optionBlock()
                $("#reply_block").show();
            break;
        }
    });
}

function optionBlock() {
    if (optionCount == 1 && reply_block_show == false) {
        var optionHTML = "<div class='input-group' id='option-group-" + optionCount + "'><div class='input-subtitle'>Option" + optionCount + "</div><input class='form-control reply-option' id='option-input-" + optionCount + "'></div>";
        $("#reply_option").append(optionHTML);
    }
    if (reply_block_show == false) {  
        reply_block_show = true;
    }
}

function addOption() {
    $("#addOption").click(function(){
        optionCount++;
        if (optionCount > 1) {
            var optionHTML = "<div class='input-group' id='option-group-" + optionCount + "'><div class='input-subtitle'>Option" + optionCount + "</div><input class='form-control reply-option' id='option-input-" + optionCount + "'></div>";
            $("#reply_option").append(optionHTML);
            $("#minusOption").show();
        }
        console.log(optionCount);
    });
    $("#minusOption").click(function(){
        $("#option-group-" + optionCount).remove();
        optionCount--;
        if (optionCount == 1) {
            $(this).hide();
        } else {
            $(this).show();
        }
        console.log(optionCount);
    });
}