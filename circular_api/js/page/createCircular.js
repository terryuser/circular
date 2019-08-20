var version = 1;


$(document).ready(function() {
    targetField();
});

function getData() {
    $.ajax({
        type: 'POST',
        url: '/api_v' + version + '/circular',
        dataType: "json",
        data: sendData,
        async: false,
        success: function(respon) {
            
        }
    });
}

function targetField() {
    var count = 1;
    var selectionOpen = "<div class='selection'><select class='custom-select target' id='target-group-" + count + "'><option selected>Choose...</option>"
    var option = "<option value='1'>One</option>";
    var optionHTML = selectionOpen + "<option value='2'>Two</option><option value='3'>Three</option></select></div>"

    $("#selection_group").append(optionHTML);
}

