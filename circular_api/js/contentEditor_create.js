var api_version = 1;

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
        quote: {
          class: Quote,
          inlineToolbar : true
        },
        list: {
          class: List,
          inlineToolbar : true
        },
        delimiter: {
          class: Delimiter,
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
    })

    var requestLevel = localStorage.getItem("request");

    //Collect all input
    output = {
      "title" : title,
      "target_GruopID" : target,
      "content" : contentData,
      "replyMethod" : method,
      "replyOption" : optionArray,
      "authorityRequest" : requestLevel
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
    console.log("error to save");
  }
});