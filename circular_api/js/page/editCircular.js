var api_version = 1;
var memberID = $.cookie('memberID');
console.log("user: " + memberID);

var GroupInfo;

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

var circularID = getUrlParameter("id");
console.log("circular ID: " + circularID);

//Default value
var limit = GroupInfo.length;
var targetCount = 1;
var optionCount = 1;
var inputCount = 0;
var option_block_show = false;
var input_block_show = false;

var checkValue = new Array;

//Get circular data
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/edit/' + circularID,
    dataType: "json",
    async: false,
    success: function(respon) {
    circularData = respon.data;
    console.log(circularData);
    }
});

//Assign into new value
targetCount = circularData.target_GruopID.length;
var method = circularData.replyMethod;
if (method != "signature") {
    option_block_show = true;
    optionCount = circularData.replyOption.length;
    var optionData = circularData.replyOption;
}

if (circularData.replyInput != null && circularData.replyInput[0] != "") {
    input_block_show = true;
    inputCount = circularData.replyInput.length;
    var inputData = circularData.replyInput;
}

//Assign target
function assignTarget() {
    if(circularData.target_GruopID[0] == "all") {
        var openHTML = "<select class='custom-select target-selector' id='target-group-" + targetCount + "'>"
        $("#selection_group").append(openHTML);
        $("#target-group-1").append("<option value='all'>All</option>");
        GroupInfo.forEach(function(option) {
            $("#target-group-1").append("<option value='" + option._id + "'>" + option.name + "</option>");
        });
        $("#target-group-1").val("all");
        $("#addTarget").hide();
        $("#minusTarget").hide();
        console.log("first is all");
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

        console.log(circularData.target_GruopID);

        for (i = 1; i <= targetCount; i++) {
            var disabled = i - 1;
            var openHTML = "<select class='custom-select target-selector' id='target-group-" + i + "'>";
            $("#selection_group").append(openHTML);

            GroupInfo.forEach(function(option) {
                if (!checkValue.includes(option._id)) {
                    $("#target-group-" + i).append("<option value='" + option._id + "'>" + option.name + "</option>");
                }
            });

            $("#target-group-" + i).val(circularData.target_GruopID[i-1]);
            checkValue.push(circularData.target_GruopID[i-1]);

            $("#selection_group").append("</select>");
            $("#target-group-" + disabled).prop('disabled', 'disabled');
        }
    }
}

//Assign title
function assignTitle() {
    $("#title").val(circularData.title);
}

//Assign reply method
function assignReplyMethod() {
    $("#replyType").val(circularData.replyMethod);

    switch (method) {
        default :
            option_block_show = false;
            $(".checkbox-block").hide();
            $(".reply-block").hide();
        break;
        
        case "signature" :
            option_block_show = false;
            $(".checkbox-block").hide();
            $(".reply-block").hide();
        break;

        case "singleChoice" :
            option_block_show = true;
            $(".checkbox-block").show();
            $(".reply-block").show();
        break;

        case "multipleChoice" :
            option_block_show = true;
            $(".checkbox-block").show();
            $(".reply-block").show();
        break;
    }
}


//Assign option value
function assignOption() {
    if (option_block_show == true && method != "signature") {
        optionData.forEach(function(option, counter){
            var number = counter + 1;
            var optionHTML = "<div class='input-group' id='option-group-" + number + "'><div class='input-subtitle'>Option " + number + "</div><input class='form-control reply-option' id='option-input-" + number + "'></div>";
            $("#reply_option").append(optionHTML);
            $("#option-input-" + number).val(option);
        })
    }
}



//Check input block exist
function checkInputExist() {
    if (circularData.replyInput != null && circularData.replyInput != null && circularData.replyInput[0] != "" && method != "signature") {
        input_block_show = true;
        $("#reply_input_checkbox").prop('checked', true);

        inputData.forEach(function(input, counter){
            var number = counter + 1;
            var inputHTML = "<div class='input-group' id='input-group-" + number + "'><div class='input-subtitle'>Field " + number + "</div><input class='form-control reply-input' id='field-input-" + number + "'></div>";
            $("#reply_Input").append(inputHTML);
            $("#field-input-" + number).val(input);
        })
    } else {
        input_block_show = false;
        $("#Input_block").hide();
    }
}


function assignData() {
    assignTarget();
    assignTitle();
    assignReplyMethod();
    checkInputExist();
    assignOption();
}



//Content field reaction
function targetControl() {
    $("#addTarget").click(function(){
        console.log("Current array: " + checkValue.toString());

        $("#target-group-" + targetCount).prop('disabled', 'disabled');
        targetCount++;

        if (targetCount > 1) {
            $("#addTarget").show();
            
            if(targetCount < limit) {
                $("#minusTarget").show();
            } else if (targetCount = limit) {
                $("#minusTarget").show();
                $("#addTarget").hide();
            } else {
                $("#minusTarget").show();
                $("#addTarget").hide();
            }
    
            console.log("count: " + targetCount);

            if (targetCount > 2) {
                var lastValue = targetCount -1;
                checkValue.push($("#target-group-" + lastValue).val());
            }
    
            var disabled = targetCount - 1;
            var openHTML = "<select class='custom-select target-selector' id='target-group-" + targetCount + "'>";
            $("#selection_group").append(openHTML);
    
            var remainOption;
            GroupInfo.forEach(function(option) {
                if (!checkValue.includes(option._id)) {
                    $("#target-group-" + targetCount).append("<option value='" + option._id + "'>" + option.name + "</option>");
                    remainOption = option._id;
                }
            });
    
            $("#target-group-" + targetCount).val(remainOption);
            
            $("#selection_group").append("</select>");
            $("#target-group-" + disabled).prop('disabled', 'disabled');

            console.log(checkValue);
        }
    });

    $("#minusTarget").click(function(){
        console.log("Current array: " + checkValue.toString());
        var targetID = targetCount;
        targetCount--;
        console.log("targetId: " + targetID);
        console.log("targetCount: " + targetCount);

        var removeValue = $("#target-group-" + targetID).val();
        console.log("remove value: " + removeValue);
        checkValue = remove(checkValue, removeValue);

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
        console.log(checkValue);
    });
}



function checkFirstTarget() {
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
        method = $(this).val();
        switch (method) {
            default :
                option_block_show = false;
                $(".checkbox-block").hide();
                $(".reply-block").hide();
            break;
            
            case "signature" :
                option_block_show = false;
                $(".checkbox-block").hide();
                $(".reply-block").hide();
            break;
    
            case "singleChoice" :
                option_block_show = true;
                $(".checkbox-block").show();
                $(".reply-block").show();
            break;
    
            case "multipleChoice" :
                option_block_show = true;
                $(".checkbox-block").show();
                $(".reply-block").show();
            break;
        }
    });

    $('#reply_input_checkbox').change(function() {
        if ($(this).is(":checked")) {
            if (inputCount == 0) {
                inputCount = 1;
                var inputHTML = "<div class='input-group' id='input-group-" + inputCount + "'><div class='input-subtitle'>Field " + inputCount + "</div><input class='form-control reply-input' id='field-input-" + inputCount + "'></div>";
                $("#reply_Input").append(inputHTML);
                $("#minusInput").hide();
            }
            input_block_show = false;
            $("#Input_block").show();
        } else {
            input_block_show = true;
            $("#Input_block").hide();
        }
    });
}

function optionControl() {
    $("#addOption").click(function(){
        optionCount++;
        var optionHTML = "<div class='input-group' id='option-group-" + optionCount + "'><div class='input-subtitle'>Option " + optionCount + "</div><input class='form-control reply-option' id='option-input-" + optionCount + "'></div>";
        $("#reply_option").append(optionHTML);
        $("#minusOption").show();
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

function inputControl() {
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


$(document).ready(function() {
    localStorage.setItem("location", "Edit");
    assignData();
    checkFirstTarget()
    targetControl();
    checkReply();
    optionControl();
    inputControl();
});