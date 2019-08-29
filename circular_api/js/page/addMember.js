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


$(document).ready(function() {
    $(".result-section").hide();
    input();
    checkOption();
    createMember();
});

function input() {
    //Group selector
    var openHTML = "<div class='selection'><select class='custom-select group-list' id='group_list" + "'><option value='newGroup' selected>New Group...</option>";
    $("#group_selection").append(openHTML);

    GroupInfo.forEach(function(option) {
        $("#group_list").append("<option value='" + option._id + "'>" + option.name + "</option>");
    });
    
    var closeHTML = "</select></div>";
    $("#group_selection").append(closeHTML);


    //Authority selector
    var openHTML = "<div class='selection'><select class='custom-select group-list' id='authoity_list" + "'>";
    $("#authority_selection").append(openHTML);

    GroupInfo.forEach(function(option) {
        $("#authoity_list").append("<option value='" + option.authorityLevel + "'>" + option.name + "</option>");
    });
    
    var closeHTML = "</select></div>";
    $("#authority_selection").append(closeHTML);
}

function checkOption() {
    $("#group_list").on('change', function() {
        var selectGroup = $(this).val();
        if (selectGroup == "newGroup") {
            $(".input-block").show();
        } else {
            $(".input-block").hide();
        }
    });
}

function createMember() {
    $("#create_member").click(function(){
        $(this).hide(200);
        var group;
        var counter;

        if ($("#group_list").val() == "newGroup") {
            var groupName = $("#newName").val();
            var groupAthority = +$("#authoity_list").val() + 1;
            var school = GroupInfo[1].schoolID;

            var groupData = {"name": groupName, "schoolID": school, "authorityLevel": groupAthority};
            console.log(groupData);

            //Create school group
            $.ajax({
                type: 'POST',
                url: '/api_v' + api_version + '/create/group',
                dataType: "json",
                data: groupData,
                async: true,
                success: function(respon) {
                    if(respon.message == "Group create success") {
                        console.log(respon);
                        group = respon.result;
                        counter = $("#memberCounter").val();

                        for (i = 1; i <= counter; i++) {
                            var userID = respon.result.name + "_" + i;
                            var memberData = {"userID": userID, "groupID": group._id, "loginName": userID, "loginPW": "0000", "email": "", "lastOnline": ""};
                            console.log(memberData);

                            $.ajax({
                                type: 'POST',
                                url: '/api_v' + api_version + '/create/member',
                                dataType: "json",
                                data: memberData,
                                async: true,
                                success: function(respon) {
                                    console.log(respon);
                                }
                            });
                        }
                        
                    } else {
                        $("#newName").append("<div class='alert'>" + respon.message + "</div>");
                    }
                }
            });
        } else {
            var selectGroup = $("#group_list").val();
            console.log("Finding group: " + selectGroup);

            $.ajax({
                type: 'POST',
                url: '/api_v' + api_version + '/group/info/' + selectGroup,
                dataType: "json",
                async: false,
                success: function(respon) {
                    group = respon.result;
                    console.log(group);
                }
            });

            var memberExist;
            //Get member count
            $.ajax({
                type: 'POST',
                url: '/api_v' + api_version + '/member/count/' + selectGroup,
                dataType: "json",
                async: true,
                success: function(respon) {
                    memberExist = respon;
                    console.log(memberExist);

                    counter = $("#memberCounter").val();

                        for (i = 1; i <= counter; i++) {
                            var countID = memberExist.count + i;
                            var userID =  group.name + "_" + countID;
                            var memberData = {"userID": userID, "groupID": group._id, "loginName": userID, "loginPW": "0000", "email": "", "lastOnline": ""};
                            console.log("Creating: ");
                            console.log(memberData);

                            $.ajax({
                                type: 'POST',
                                url: '/api_v' + api_version + '/create/member',
                                dataType: "json",
                                data: memberData,
                                async: false,
                                success: function(respon) {
                                    console.log(respon);
                                    
                                    $("#resultBody").append("<tr>");

                                    $("#resultBody").append("<td>" + memberData.userID + "</td>");
                                    $("#resultBody").append("<td>" + group.name + "</td>");
                                    $("#resultBody").append("<td>" + memberData.loginName + "</td>");
                                    $("#resultBody").append("<td>" + memberData.loginPW + "</td>");

                                    if (memberData.email == "") {
                                        $("#resultBody").append("<td>" + "N/A" + "</td>");
                                    } else {
                                        $("#resultBody").append("<td>" + memberData.email + "</td>");
                                    }
                                    
                                    $("#resultBody").append("</tr>");

                                    if (i == counter) {
                                        console.log("Creation done");
                                        $(".result-section").show(350);
                                    }
                                }
                            });
                        }
                }
            });
            
        }
    });
}