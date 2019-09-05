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
    localStorage.setItem("location", "Circular");
    showList();
    $(".list-item").click(function() {
        window.document.location = $(this).data("href");
    });
});

function showList() {
    
    //Get circular list
    var findData = {authorityLevel: memberInfo.authorityLevel, schoolID: memberInfo.schoolID, groupID: memberInfo.groupID};
    var list;
    $.ajax({
        type: 'POST',
        url: '/api_v' + api_version + '/circular' + "/" + page,
        dataType: "json",
        data: findData,
        async: false,
        success: function(respon) {
            list = respon;
        }
    });
    console.log(list);

    //Display circular
    var title;
    var date;
    var author;
    var link;
    var day;
    var time;

    list.result.forEach(function(item) {
        title = "<div class='title'>" + item.title + "</div>";
        day = item.createDate.substring(0, 10);
        time = item.createDate.substring(11, 16);
        date = "<span class='date'>" + day + "  " + time + "</span>";

        

        link =  "/detail/?id=" + item._id;

        $("#circular_list").append("<tr class='list-item' data-href='" + link + "'><td>" + title + date + "</td></tr>");
    });
}

