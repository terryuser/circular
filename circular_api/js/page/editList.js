var api_version = 1;
var memberID = $.cookie('memberID');
console.log(memberID);

var memberInfo;
var requestLevel;

var page = getUrlParameter("page");
console.log("page: " + page);

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

$(document).ready(function() {
    showList();
});

function showList() {
    
    //Get circular which can edit
    var findData = {authorityLevel: memberInfo.authorityLevel , schoolID: memberInfo.schoolID};
    var editList;
    $.ajax({
        type: 'POST',
        url: '/api_v' + api_version + '/editList' + "/" + page,
        dataType: "json",
        data: findData,
        async: false,
        success: function(respon) {
            editList = respon;
        }
    });
    console.log(editList);

    //Display circular
    var title;
    var date;
    var reply;
    var link;
    var day;
    var status;
    var time;

    editList.result.forEach(function(item) {
        title = "<td class='title'>" + item.title + "</td>";

        console.log(item.createDate);
        day = item.createDate.substring(0, 10);
        time = item.createDate.substring(11, 16);
        date = "<td class='date'>" + day + "  " + time + "</td>";

        var replyMethod = item.replyMethod;
        switch (replyMethod) {
            default :
                replyMethod = "Only Signature";
            break;
            
            case "signature" :
                replyMethod = "Only Signature";
            break;

            case "singleChoice" :
                replyMethod = "Single Choice";
            break;

            case "multipleChoice" :
                replyMethod = "Multiple Choice";
            break;
        }

        reply = "<td class='replyMethod'>" + replyMethod + "</td>";

        if (item.releaseDate == null) {
            status = "<td class='status draft'>draft</td>";
        } else {
            status = "<td class='status published'>published</td>";
        }
        link = "<td class='action'><a href='/edit/?id=" + item._id + "' target='_blank'><div class='btn btn-info edit'>Edit</div></a></td>";

        $("#edit_list").append("<tr class='list-item'>"+ title + date + reply + status + link + "</tr>");
    });
}

