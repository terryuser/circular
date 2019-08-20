var version = 1;

$(document).ready(function() {
    register();
});

function register() {
    $("#register_submit").click(function(){
        var schoolName = $("#school_name").val();
        var loginID = $("#school_loginID").val();
        
        var data = {"schoolName": schoolName,"loginID": loginID};
        console.log(data);

        $.ajax({
            type: 'POST',
            url: '/api_v' + version + '/create/school',
            dataType: "json",
            data: data,
            async: false,
            success: function(respon) {
                console.log(respon);
            }
        });
    })
}