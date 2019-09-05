var api_version = 1;
var memberID = $.cookie('memberID');
console.log(memberID);

var circularData;
var requestLevel;

var circularID = getUrlParameter("id");
console.log("circular ID: " + circularID);

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


//Apply data into input
var contentEditor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'contentEditor',
  
    /**
     * Available Tools list.
     */
    tools: {
        table: {
          class: Table,
          inlineToolbar : true
        },
        link: {
          inlineToolbar : true
        },
        list: {
          class: List,
          inlineToolbar : true
        }
    },
  
    /**
     * Previously saved data that should be rendered
     */
    data: circularData.content
});


//Collect circular data and send to API
var output = {};

$( "#update_draft" ).click(async() => {
  try {
    var target = new Array;
    $(".target-selector").each(function(){
      target.push($(this).val());
    })

    var title = $("#title").val();
    
    const contentData = await contentEditor.save();

    var method = $("#replyType").val();

    var optionArray = new Array;
    $(".reply-option").each(function(){
      optionArray.push($(this).val());
    })

    var InputArray = new Array;
    if ($('#reply_input_checkbox').is(":checked")) {
      $(".reply-input").each(function(){
        InputArray.push($(this).val());
        console.log("checkbox is selected");
      });
    } else {
      InputArray = null;
    }
    console.log(InputArray);

    var today = new Date();

    //Collect all input
    output = {
      "_id" : circularData._id,
      "target_GruopID" : target,
      "title" : title,
      "content" : contentData,
      "replyMethod" : method,
      "replyOption" : optionArray,
      "replyInput" : InputArray,
      "releaseDate" : null
    }
    console.log(output);

    $.ajax({
      type: 'PUT',
      url: '/api_v' + api_version + '/edit/' + circularID,
      dataType: "JSON",
      data: output,
      success: function(data) {
        console.log(data);
        $('#Modal-draft').trigger('focus');
        window.setTimeout(function() {
          window.location.replace("/editlist");
        }, 1500);
      },
      error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });
  } catch(err) {
    console.log("error to save, message: " + err);
  }
});


$( "#publish" ).click(async() => {
  try {
    var target = new Array;
    $(".target-selector").each(function(){
      target.push($(this).val());
    })

    var title = $("#title").val();
    
    const contentData = await contentEditor.save();

    var method = $("#replyType").val();

    var optionArray = new Array;
    $(".reply-option").each(function(){
      optionArray.push($(this).val());
    })

    var InputArray = new Array;
    if ($('#reply_input_checkbox').is(":checked")) {
      $(".reply-input").each(function(){
        InputArray.push($(this).val());
        console.log("checkbox is selected");
      });
    } else {
      InputArray = null;
    }
    console.log(InputArray);

    var today = new Date();

    //Collect all input
    output = {
      "_id" : circularData._id,
      "target_GruopID" : target,
      "title" : title,
      "content" : contentData,
      "replyMethod" : method,
      "replyOption" : optionArray,
      "replyInput" : InputArray,
      "releaseDate" : today
    }
    console.log(output);

    $.ajax({
      type: 'PUT',
      url: '/api_v' + api_version + '/edit/' + circularID,
      dataType: "JSON",
      data: output,
      success: function(data) {
        console.log(data);
        window.setTimeout(function() {
          window.location.replace("/circular");
        }, 1500);
      },
      error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });
  } catch(err) {
    console.log("error to save, message: " + err);
  }
});