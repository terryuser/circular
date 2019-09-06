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
    }
});
console.log(GroupInfo);
var limit = GroupInfo.length;

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
    localStorage.setItem("location", "Member");
    listGroupMember();
});

function listGroupMember() {
    GroupInfo.forEach(function(group){
        if(group.authorityLevel > memberInfo.authorityLevel) {

            //Get member from group
            $.ajax({
                type: 'POST',
                url: '/api_v' + api_version + '/member/list/' + group._id,
                dataType: "json",
                async: false,
                success: function(respon) {
                    
                    console.log(respon);
                    $("#member_list").append("<div class='member-block'><div class='group-title'>" + group.name + "</div>");
                    
                    if(respon.memberList.length != 0) {
                        $("#member_list").append("<div style='overflow-x:auto;'><table id='" + group._id + "'><thead><tr><th>User Name</th><th>Login Name</th><th>Login Password</th><th>E-mail</th><th>Last online</th>");
                    
                        respon.memberList.forEach(function(memberData){
                            $("#" + group._id).append("<tr>");
                            $("#" + group._id).append("<td>" + memberData.userID + "</td>");
                            $("#" + group._id).append("<td>" + memberData.loginName + "</td>");
                            $("#" + group._id).append("<td>" + memberData.loginPW + "</td>");

                            if (memberData.email != "") {
                                $("#" + group._id).append("<td>" + memberData.email + "</td>");
                            } else {
                                $("#" + group._id).append("<td>N/A</td>");
                            }
                            if (memberData.lastOnline != null) {
                                $("#" + group._id).append("<td>" + memberData.lastOnline + "</td>");
                            } else {
                                $("#" + group._id).append("<td>No record</td>");
                            }
            
                            $("#" + group._id).append("</tr>");
                        });
                        
                        $("#member_list").append("</table></div>");
                    } else {
                        $("#member_list").append("<div class='no-member'>No member</div>");
                    }
                }
            });
        }
    });
}

