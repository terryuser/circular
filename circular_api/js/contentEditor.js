var editor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'editorjs',
  
    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
        header: {
          class: Header,
          inlineToolbar : true
        },
        // ...
    },
  
    /**
     * Previously saved data that should be rendered
     */
    data: {}
  });