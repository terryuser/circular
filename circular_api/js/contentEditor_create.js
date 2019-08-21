var contentEditor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'contentEditor',
  
    /**
     * Available Tools list.
     */
    tools: {
        header: {
          class: Header,
          inlineToolbar : true
        },
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

var replyEditor = new EditorJS({
  /**
   * Create a holder for the Editor and pass its ID
   */
  holderId : 'replyEditor',

  /**
   * Available Tools list.
   */
  tools: {
      header: {
        class: Header,
        inlineToolbar : true
      },
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


var output = {};

// $("#save").click(function() {
    
//   var target = new Array;
//   $(".target").each(function(){
//     target.push($(this).val());
//   })

//   var title = $("#title").val();

//   editor.save().then((data) => {
//       output = {
//         "target_GroupID" : target,
//         "title" : title,
//         "content" : data
//       }
//       console.log(output);
      
//   }).catch((error) => {
//     console.log('Saving failed: ', error)
//   });
    

//   // var content = editor.save().then((contentData) => {
//   //   return contentData;
//   // }).catch((error) => {
//   //   console.log('Saving failed: ', error)
//   // });
    

//   // output = {
//   //   "target" : target,
//   //   "title" : title,
//   //   "content" : contentData
//   // }
//   // console.log(output);
// });


$( "#save" ).click(async() => {
  try {
    var target = new Array;
    $(".target").each(function(){
      target.push($(this).val());
    })

    var title = $("#title").val();
    
    const contentData = await contentEditor.save();
    const replyData = await replyEditor.save();

    //Collect all input
    output = {
      "target" : target,
      "title" : title,
      "content" : contentData,
      "reply" : replyData
    }
    console.log(output);
  } catch(err) {
    console.log("error to save");
  }
});