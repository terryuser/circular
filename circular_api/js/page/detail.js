var api_version = 1;
var memberID = $.cookie('memberID');
console.log("user: " + memberID);

var GroupInfo;
var memberInfo;

var circularID = getUrlParameter("id");
console.log("circular ID: " + circularID);

var circularData;

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
console.log(circularData);

//Get member info
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/member/' + memberID,
    dataType: "json",
    async: false,
    success: function(respon) {
        memberInfo = respon;
    }
});
console.log(memberInfo);

var content = circularData.content.blocks;
var method = circularData.replyMethod;
var replyHTML;


function assginDetail() {
    $("#circular_title").html(circularData.title);

    content.forEach(function(block) {
        console.log(block.type);
        var element = block.type;

        switch (element) {
            default :
                contentBlock = "<p></p>";
                $("#circular_content").append(contentBlock);
            break;
            
            case "paragraph" :
                contentBlock = "<p>" + block.data.text + "</p>";
                $("#circular_content").append(contentBlock);
            break;

            case "table" :

                var tableHTML;
                tableHTML = "<table>";

                block.data.content.forEach(function (row) {
                    tableHTML = tableHTML + "<tr>";
                    row.forEach(function (column) {
                        tableHTML = tableHTML + "<td>" + column + "</td>";
                    })
                    tableHTML = tableHTML + "</tr>";
                })

                tableHTML = tableHTML + "</table>";
                $("#circular_content").append(tableHTML);
            break;

            case "list":
                var tableHTML;
                if (block.data.style == "ordered") {
                    tableHTML = "<ol>";
                    block.data.items.forEach(function (item) {
                        tableHTML = tableHTML + "<li>" + item + "</li>";
                    });
                    tableHTML = tableHTML + "</ol>"
                } else if (block.data.style == "unordered") {
                    tableHTML = "<ul>";
                    block.data.items.forEach(function (item) {
                        tableHTML = tableHTML + "<li>" + item + "</li>";
                    });
                    tableHTML = tableHTML + "</ul>"
                } else {
                    tableHTML = "<ul>";
                    block.data.items.forEach(function (item) {
                        tableHTML = tableHTML + "<li>" + item + "</li>";
                    });
                    tableHTML = tableHTML + "</ul>"
                }
                $("#circular_content").append(tableHTML);
            break;
        }
    });

    if (circularData.target_GruopID.includes(memberInfo.groupID)) {
        console.log("Member are on target");
        switch (method) {
            default :
                $(".reply-container").hide();
                replyHTML = "<button id='confirm' class='btn btn-info'>Confirm</button>";
                $("#content_action").append(replyHTML);
            break;
    
            case "signature":
                $(".reply-container").hide();
                replyHTML = "<button id='confirm' class='btn btn-info'>Confirm</button>";
                $("#content_action").append(replyHTML);
            break;
    
            case "singleChoice":
                option_Input();
            break;
    
            case "multipleChoice":
                option_Input();
            break;
        }
    } else {
        $(".reply-container").remove();
    }

    console.log(memberInfo.authorityLevel);
    console.log(circularData.authorityRequest);

    if (memberInfo.authorityLevel >= circularData.authorityRequest) {
        console.log("Allow watch reply");
        showReply();
    } else {
        console.log("Not allow watch reply");
    }
}
var replyList;

function showReply() {
    //Get member info
    $.ajax({
        type: 'POST',
        url: '/api_v' + api_version + '/replyList/' + circularID,
        dataType: "json",
        async: false,
        success: function(respon) {
            replyList = respon;
        }
    });
    console.log(replyList);

    //First get group list
    circularData.target_GruopID.forEach(function(target){
        
        //Get member info
        $.ajax({
            type: 'POST',
            url: '/api_v' + api_version + '/group/info/' + target,
            dataType: "json",
            async: true,
            success: function(respon) {
                $(".replyList-container").append("<div class='group-title'>" + respon.result.name + "</div>");
                genarateMember(target);
            }
        });
        
    });
}

function genarateMember(groupId) {
    $(".replyList-container").append("<div style='overflow-x:auto;'><table id='table_" + groupId + "'>");

    //Table header
    var tableHead = "<thead><tr id='table_header" +  groupId + "'><th>Name</th><th>Login Name</th><th>Checked</th>";
    $("#table_" + groupId).append(tableHead);

    //Check if any custom field
    if (circularData.replyMethod != "signature") {
        $("#table_header" +  groupId).append("<th>Choice</th>");

        if (circularData.replyInput[0] != "") {
            circularData.replyInput.forEach(function(inputField){
                $("#table_header" +  groupId).append("<th>" + inputField + "</th>");
            });
        }
    }
    $("#table_" + groupId).append("</tr></thead><tbody id='reply_list" + groupId + "'>");

    //Get member from group
    var memberList;
    $.ajax({
        type: 'POST',
        url: '/api_v' + api_version + '/member/list/' + groupId,
        dataType: "json",
        async: false,
        success: function(result) {
            memberList = result.memberList;
            console.log(memberList);

            // Table Body
            if (replyList.length < 0) {
                $("#reply_list" + groupId).append("<tr><td col='" + (replyList.length + 2) + "'>No member reply</td></tr>");
            } else {
                memberList.forEach(function(member){
                    
                    $("#reply_list" + groupId).append("<tr id='" + member._id + "'></tr>");

                    var td_p1 = "<td>" + member.userID + "</td><td>" + member.loginName + "</td>";
                    $("#" + member._id).append(td_p1);
        
                    var td_p2;
                    var td_p3;
                    var replyed = circularData.signedMember.includes(member._id);

                    if (replyed === true) {
                        console.log("Checked");
                        td_p2 = "<td><img src='../img/svg/tick.svg' alt=''></td>";
                        $("#" + member._id).append(td_p2);

                        var replyRecord = getReply(replyList, member._id);
                        console.log(replyRecord);

                        replyRecord.replyInput.forEach(function(input){
                            $("#" + member._id).append("<td>" + input + "</td>");
                        });

                    } else {
                        console.log("Not yet Checked");
                        td_p2 = "<td><img src='../img/svg/cross.svg' alt=''></td>";
                        $("#" + member._id).append(td_p2);
                        
                        if (circularData.replyInput.length != 0) {
                            var col = circularData.replyInput.length + 1;
                            $("#" + member._id).append("<td colspan='" + col + "'></td>");
                        }
                    }
                });
            }
        }
    });

    $(".replyList-container").append("</tbody>");
    $(".replyList-container").append("</table></div>");
}

function getReply(data, findValue) {
    for (var i in data) {
        if (data[i].memberID == findValue) {
            return data[i];
        }
    }
    return "No record";
}


function option_Input() {
    //Insert button in content
    replyHTML = "<button id='reply' class='btn btn-info'>Reply</button>";
    $("#content_action").append(replyHTML);
    scrolltoReply();

    //Insert checkbox and input
    var optionField = circularData.replyOption;
    var inputField = circularData.replyInput;

    var labelHTML;
    var inputHTML;

    if (method == "singleChoice") {
        optionField.forEach(function(option, i){
            console.log(option,i);
            inputHTML = "<input type='radio' id='option_" + i + "' name='radio'><span class='checkmark'></span>";
            $("#option_wrapper").append("<label class='checkbox-block'>" + option + inputHTML + "</label>");
        });
    }

    if (method == "multipleChoice") {
        optionField.forEach(function(option, i){
            console.log(option,i);
            var number = i + 1;
            inputHTML = "<input type='checkbox' id='option_" + i + "' value='" + option + "'><span class='checkmark'></span>";
            $("#option_wrapper").append("<label class='checkbox-block'>" + option + inputHTML + "</label>");
        });
    }

    if (inputField.length > 0 && inputField[0] != "") {
        inputField.forEach(function(input, i){
            console.log(input,i);
            var number = i + 1;
            labelHTML = "<div class='input-group-prepend'>" + input + "</div>";
            inputHTML = "<input type='text' class='form-control reply-input'>";
            $("#input_wrapper").append("<div class='input-block'>" + labelHTML + inputHTML + "</div>");
        });
    }

    var submitHTML = "<button id='submit' class='btn btn-info'>Submit</button>";
    $("#reply_action").append(submitHTML);
}

function scrolltoReply(){
    $("#reply").click(function(){
        console.log("scrolling");
        $('html, body').animate({
            scrollTop: $(".container.reply-container").offset().top
        }, 1400);
    });
}

//Data send to api
var replyData;

function getReplyData() {
    //memberID
    var circular_id = circularData._id;
    var memberOption = new Array;
    var memberInput = new Array;;

    if (method == "signature") {
        replyData = {"memberID": memberID, "circularID": circular_id}
    } else if (method == "singleChoice") {

        $("input:checkbox").each(function(){
            if ($(this).prop("checked")) {
                console.log("store checkbox");
                console.log($(this).val());
                memberOption.push($(this).val());
            }
        });
        console.log(memberOption);
        
    } else if (method == "multipleChoice") {

        $("input:checkbox").each(function(){
            if ($(this).prop("checked")) {
                console.log("store checkbox");
                console.log($(this).val());
                memberOption.push($(this).val());
            }
        });
        console.log(memberOption);

        if (circularData.replyInput.length > 0 && circularData.replyInput[0] != "") {
            $(".reply-input").each(function(){
                console.log($(this).val());
                memberInput.push($(this).val());
            })
        }

        replyData = {"memberID": memberID, "circularID": circular_id, "replyOption": memberOption, "replyInput":memberInput};
    }

    console.log(replyData);
}

function submitAction() {
    $("#confirm").click(function(){
        getReplyData();
        updateCircularDB(replyData);
    });

    $("#submit").click(function(){
        getReplyData();
        updateCircularDB(replyData);
        updateReplyDB(replyData);
    });
}

function updateCircularDB(reply) {
    console.log(reply);
    $.ajax({
        type: 'PUT',
        url: '/api_v' + api_version + '/circular/reply/' + circularID,
        dataType: "json",
        data: reply,
        async: false,
        success: function(respon) {
            console.log(respon);
        }
    });
}

function updateReplyDB(reply) {
    $.ajax({
        type: 'PUT',
        url: '/api_v' + api_version + '/replyDB/update',
        dataType: "json",
        data: reply,
        async: false,
        success: function(respon) {
            console.log(respon);
            $("#circular_reply").hide(150);
        $(".reply-wrapper").append("<div class='animated fadeInUp' style='font-size:16px; color: #31C640; width:100%; text-align:center;'>Submit success</div>");
        }
    });
}

$(document).ready(function() {
    localStorage.setItem("location", "Circular");
    assginDetail();
    submitAction();
});