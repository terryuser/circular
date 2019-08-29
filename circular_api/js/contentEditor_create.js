var api_version = 1;
var memberID = $.cookie('memberID');
console.log(memberID);

var memberInfo;
var requestLevel;

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
    data: {}
});


//Collect circular data and send to API
var output = {};

$( "#save" ).click(async() => {
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
    });

    if ($('#reply_input_checkbox').prop('checked')) {
      var InputArray = new Array;
      $(".reply-input").each(function(){
        InputArray.push($(this).val());
      });
    }

    var today = new Date();

    //Collect all input
    output = {
      "schoolID" : memberInfo.schoolID,
      "target_GruopID" : target,
      "title" : title,
      "content" : contentData,
      "replyMethod" : method,
      "replyOption" : optionArray,
      "replyInput" : InputArray,
      "authorityRequest" : memberInfo.authorityLevel,
      "createDate" : today,
      "releaseDate" : null,
      "signedMember" : null,
    }
    console.log(output);

    $.ajax({
      type: 'POST',
      url: '/api_v' + api_version + '/create/circular',
      dataType: "JSON",
      data: output,
      success: function(data) {
        console.log(data.message);
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

    if ($('#reply_input_checkbox').prop('checked')) {
      var InputArray = new Array;
      $(".reply-input").each(function(){
        InputArray.push($(this).val());
      });
    }

    var today = new Date();

    //Collect all input
    output = {
      "schoolID" : memberInfo.schoolID,
      "target_GruopID" : target,
      "title" : title,
      "content" : contentData,
      "replyMethod" : method,
      "replyOption" : optionArray,
      "replyInput" : InputArray,
      "authorityRequest" : memberInfo.requestLevel,
      "createDate" : today,
      "releaseDate" : today,
      "signedMember" : null,
    }
    console.log(output);

    $.ajax({
      type: 'POST',
      url: '/api_v' + api_version + '/create/circular',
      dataType: "JSON",
      data: output,
      success: function(data) {
        console.log(data.message);
      },
      error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });
  } catch(err) {
    console.log("error to save, message: " + err);
  }
});