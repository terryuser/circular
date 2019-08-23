var version = 1;

$(document).ready(function() {
    register();
});

function register() {
    $("#register_submit").click(function(){
        var schoolName = $("#school_name").val();
        var schoolEmail = $("#school_email").val();
        
        var data = {"schoolName": schoolName, "email": schoolEmail};
        console.log(data);

        $.ajax({
            type: 'POST',
            url: '/api_v' + version + '/create/school',
            dataType: "json",
            data: data,
            async: false,
            success: function(respon) {
                console.log(respon);
                if (respon.message=="success") {
                    localStorage.setItem("loginID", respon.loginID);
                    window.location.replace("/register/success");
                }
            }
        });
    })
}