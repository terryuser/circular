var api_version = 1;
var userID = $.cookie('memberID');
console.log("user: " + userID);

var GroupInfo;

//Get school group
$.ajax({
    type: 'POST',
    url: '/api_v' + api_version + '/findGrouplist/' + userID,
    dataType: "json",
    async: false,
    success: function(respon) {
        GroupInfo = respon.result;
    }
});
console.log(GroupInfo);


$(document).ready(function() {
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
        if ($("#group_list").val() == "newGroup") {
            var groupName = $("#newName").val();
            var groupAthority = +$("#authoity_list").val() + 1;
            var school = GroupInfo[1].schoolID;

            var groupData = {"name": groupName, "schoolID": school, "authorityLevel": groupAthority};
            console.log(groupData);

            var groupID;
            var counter;
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
                        groupID = respon.result._id;
                        counter = $("#memberCounter").val();

                        for (i = 1; i <= counter; i++) {
                            var userID = respon.result.name + "_" + i;
                            var memberData = {"userID": userID, "groupID": groupID, "loginName": userID, "loginPW": "0000", "email": "", "lastOnline": ""};
                            console.log(memberData);

                            $.ajax({
                                type: 'POST',
                                url: '/api_v' + api_version + '/create/member',
                                dataType: "json",
                                data: memberData,
                                async: true,
                                success: function(respon) {
                                    GroupInfo = respon.result;
                                }
                            });
                        }
                        
                    } else {
                        $("#newName").append("<div class='alert'>" + respon.message + "</div>");
                    }
                }
            });
        }
    });
}