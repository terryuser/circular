var api_version = 1;
var memberID = $.cookie('memberID');
console.log("user: " + memberID);

var GroupInfo;

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
var content = circularData.content.blocks;
var method = circularData.replyMethod;
var replyHTML;

$(document).ready(function() {
    assginDetail();
});

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
                tableHTML = "<tr>";

                block.data.content.forEach(function (row) {
                    tableHTML = tableHTML + "<tr>";
                    row.forEach(function (column) {
                        tableHTML = tableHTML + "<td>" + column + "</td>";
                    })
                    tableHTML = tableHTML + "</tr>";
                })

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

    $("#circular_reply").append();
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
            inputHTML = "<input type='checkbox' id='option_" + i + "'><span class='checkmark'></span>";
            $("#option_wrapper").append("<label class='checkbox-block'>" + option + inputHTML + "</label>");
        });
    }

    if (inputField.length > 0) {
        inputField.forEach(function(input, i){
            console.log(input,i);
            labelHTML = "<div class='input-group-prepend'>" + input + "</div>";
            inputHTML = "<input type='text' class='form-control'>";
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
            scrollTop: $(".reply-container").offset().center
        }, 2400);
    });
}

function submitAction() {
    $("#submit").click(function(){
        if (method == "singleChoice") {

        }
    });
}