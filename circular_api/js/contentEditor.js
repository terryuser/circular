var editor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'editorjs',
  
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

  $("#save").click(function() {
    
    var target = new Array;
    $(".target").each(function(){
      target.push($(this).val());
    })

    var title = $("#title").val();

    editor.save().then((data) => {

      output = {
        "target" : target,
        "title" : title,
        "content" : data
      }
      console.log(output);
      
    }).catch((error) => {
      console.log('Saving failed: ', error)
    });
    

    // var content = editor.save().then((contentData) => {
    //   return contentData;
    // }).catch((error) => {
    //   console.log('Saving failed: ', error)
    // });
    

    // output = {
    //   "target" : target,
    //   "title" : title,
    //   "content" : contentData
    // }
    // console.log(output);
  });
