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
    selectionAction();
    checkReply();
    addOption();
    addInput();
    assignInput();
    addTargetField();
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
        console.log("targetId: " + targetID);
        console.log("targetCount: " + targetCount);
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

function assignInput() {
    
    //Get cicular info
    $.ajax({
        type: 'POST',
        url: '/api_v' + api_version + '/edit/' + circularID,
        dataType: "json",
        async: false,
        success: function(respon) {
        circularData = respon.data;
        }
    });

    //Target field
    targetCount = circularData.target_GruopID.length;
    if(circularData.target_GruopID == "all") {
        var openHTML = "<select class='custom-select target-selector' id='target-group-" + targetCount + "'>"
        $("#selection_group").append(openHTML);
        $("#target-group-1").val("all");
    } else {
        var selectedGroup = circularData.target_GruopID[0];
        console.log("Not target all");
        console.log("Target: " + selectedGroup);
        $("#target-group-1").val(selectedGroup);
    }

    if (targetCount > 1) {
        $("#addTarget").show();
        
        if (targetCount < limit) {
            $("#minusTarget").show();
        }

        console.log("limit: " + limit);
        console.log("count: " + targetCount);

        var checkValue = circularData.target_GruopID;
        console.log(checkValue);
        // selectedValue = ;
        // checkValue.push(selectedValue);

        for (i = 1; i <= targetCount; i++) {
            var disabled = i - 1;
            var openHTML = "<select class='custom-select target-selector' id='target-group-" + i + "'>";
            $("#selection_group").append(openHTML);

            GroupInfo.forEach(function(option) {
                if (option._id != checkValue[i]._id) {
                    $("#target-group-" + i).append("<option value='" + option._id + "'>" + option.name + "</option>");
                }
            });

            $("#selection_group").append("</select>");
            $("#target-group-" + disabled).prop('disabled', 'disabled');
        }
    }


    //Title
    $("#title").val(circularData.title);

    //Reply
    $("#replyType").val(circularData.replyMethod);
    if (circularData.replyMethod != "signature") {
        optionCount = circularData.replyOption.length;
        console.log("Not signature");
        console.log("Default option: " + optionCount);
        $("#reply_block").show();
        $("#addOption").show();
        $("#minusOption").show();
        
        var optionHTML;
        for (i = 1; i <= optionCount; i++) {
            if (i > 1) {
                optionHTML = "<div class='input-group' id='option-group-" + i + "'><div class='input-subtitle'>Option" + i + "</div><input class='form-control reply-option' id='option-input-" + i + "'></div>";
                $("#reply_option").append(optionHTML);
            }
            $("#option-input-" + i).val(circularData.replyOption[i-1]);
        }

        if (circularData.replyInput != null) {
            inputCount = circularData.replyInput.length;
            for (i = 1; i <= inputCount; i++) {
                if (i > 1) {
                    optionHTML = "<div class='input-group' id='input-group-" + inputCount + "'><div class='input-subtitle'>Field " + inputCount + "</div><input class='form-control reply-input' id='field-input-" + inputCount + "'></div>";
                    $("#reply_input").append(optionHTML);
                }
                $("#field-input-" + i).val(circularData.replyInput[i-1]);
            }
        }
    }

}