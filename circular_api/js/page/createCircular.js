var api_version = 1;
var memberID = $.cookie('memberID');
console.log("user: " + memberID);

var GroupInfo;

var targetCount = 1;
var optionCount = 1;
var inputCount = 1;

var reply_block_show = false;
var input_block_show = false;

//Get school group
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/findGrouplist/' + memberID,
    dataType: "json",
    async: false,
    success: function(respon) {
        GroupInfo = respon.result;
        requestLevel = respon.authority;
    }
});
console.log(GroupInfo);
var limit = GroupInfo.length;

$(document).ready(function() {
    addTargetField();
    selectionAction();
    checkReply();
    addOption();
    addInput();
});

function selectionAction() {
    $(".reply-block").hide();
    $("#addTarget").click(function(){
        $("#target-group-" + targetCount).prop('disabled', 'disabled');
        targetCount++;
        if(targetCount < limit) {
            addTargetField();
            $("#minusTarget").show();
        } else if (targetCount = limit) {
            addTargetField();
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

function addTargetField() {
    var openHTML = "<select class='custom-select target-selector' id='target-group-" + targetCount + "'>"
    $("#selection_group").append(openHTML);

    if (targetCount == 1) {
        $("#minusTarget").hide();
        $("#target-group-1").append("<option value='all' selected>All</option>");
    }
    console.log("targerField Count: " + targetCount);
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
    $(".checkbox-block").hide();

    $("#replyType").on('change', function() {
        var replyMethod = $(this).val();
        switch (replyMethod) {
            default :
                reply_block_show = false;
                $(".checkbox-block").hide();
                $(".reply-block").hide();
            break;
            
            case "signature" :
                reply_block_show = false;
                $(".checkbox-block").hide();
                $(".reply-block").hide();
            break;

            case "singleChoice" :
                reply_block_show = true;
                $(".checkbox-block").show();
                $(".reply-block").show();
                checkInput();
            break;

            case "multipleChoice" :
                reply_block_show = true;
                $(".checkbox-block").show();
                $(".reply-block").show();
                checkInput();
            break;
        }
    });
}

function addOption() {
    $("#minusOption").hide();

    //Add 1 input by default
    var optionHTML = "<div class='input-group' id='option-group-" + optionCount + "'><div class='input-subtitle'>Option" + optionCount + "</div><input class='form-control reply-option' id='option-input-" + optionCount + "'></div>";
    $("#reply_option").append(optionHTML);

    $("#addOption").click(function(){
        optionCount++;
        if (optionCount > 1) {
            var optionHTML = "<div class='input-group' id='option-group-" + optionCount + "'><div class='input-subtitle'>Option " + optionCount + "</div><input class='form-control reply-option' id='option-input-" + optionCount + "'></div>";
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

function addInput() {
    $("#minusInput").hide();

    //Add 1 input by default
    var inputHTML = "<div class='input-group' id='input-group-" + inputCount + "'><div class='input-subtitle'>Field " + inputCount + "</div><input class='form-control reply-input' id='field-input-" + inputCount + "'></div>";
    $("#reply_Input").append(inputHTML);

    $("#addInput").click(function(){
        inputCount++;
        if (inputCount > 1) {
            var inputHTML = "<div class='input-group' id='input-group-" + inputCount + "'><div class='input-subtitle'>Field " + inputCount + "</div><input class='form-control reply-input' id='field-input-" + inputCount + "'></div>";
            $("#reply_Input").append(inputHTML);
            $("#minusInput").show();
        }
        console.log(inputCount);
    });
    $("#minusInput").click(function(){
        $("#input-group-" + inputCount).remove();
        inputCount--;
        if (inputCount == 1) {
            $(this).hide();
        } else {
            $(this).show();
        }
        console.log(inputCount);
    });
}

function checkInput() {
    if (input_block_show == false) {
        $("#Input_block").hide();
        console.log("unchecked");
    } else {
        $("#Input_block").show();
        console.log("checked");
    }

    $('#reply_input_checkbox').change(function() {
        if ($(this).prop('checked')) {
            console.log("checked");
            $("#Input_block").show();
            input_block_show = true;
        } else {
            $("#Input_block").hide();
            console.log("unchecked");
            input_block_show = false;
        }
    });
}