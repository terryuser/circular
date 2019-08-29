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

    var method = circularData.replyMethod;
    var replyHTML;
    
    switch (method) {
        default :
            replyHTML = "<button id='confirm' class='btn btn-info'>Confirm</button>";
            $("#circular_reply").append(replyHTML);
        break;

        case "signature":
            replyHTML = "<button id='confirm' class='btn btn-info'>Confirm</button>";
            $("#circular_reply").append(replyHTML);
        break;

        case "singleChoice":
            //do something
        break;

        case "multipleChoice":
            //do something
        break;
    }

    $("#circular_reply").append();
}

function option_Input() {
    var optionCount = circularData.replyOption.length;
    var inputCount = circularData.replyInput.length;
}