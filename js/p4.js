$(function() {
    
  // SETUP
    loadLocalStorage();
    $('#itemDescription').focus(); // Focus on input box
    updateCount();

  // ITEM COUNTER
  function updateCount() {                       
    var allItems = $('li').length;                      // Number of items in list
    $('#allCounter').text(allItems);                   // Added into "all" counter 
      
    var toDoItems = $('li').children('.fa-circle').length; // Number of unchecked items in list
    $('#toDoCounter').text(toDoItems);                     // Added into "to do" counter   
    
    var completeItems = $('li').children('.fa-check-circle').length; // Number of checked items in list
    $('#completeCounter').text(completeItems);                      // Added into "completed" counter   
  }
                             
  // ADDING A NEW LIST ITEM
    
  function addItem() {
    
    var newItem = $('#itemDescription').val();           // Get value of text input
    $('ul').append('<li class="list-group-item list-group-item-danger">' + '<i id=\'check\' class="far fa-circle"></i> ' + '<span class="itemText">' + newItem +'</span>' + ' </li>');      // Add item to end of the unordered list with blank circle on the left side 
    $('#itemDescription').val('');                    // Empty the text input
    updateCount();                              // Update the count
  }
    
  $('#add').on('click', function() {       // When the add button is clicked
    addItem();
    updateLocalStorage();
  });

  $('#itemDescription').keypress(function(e) { // When the Enter key is pressed
    var key = e.which;
    if(key == 13) {
        addItem();
        updateLocalStorage();
    }
  });

  // DELETING A LIST ITEM    
    $('ul').on('click', '.trashcan', function(e) {
        $(e.target).parent().remove();
        updateCount();
        updateLocalStorage();
    });
    
    
  // MOUSE ENTER FOR TRASH CAN
    $('ul').on('mouseenter', 'li',function() {
        if (!$(this).children().hasClass("trashcan")) {
            $(this).append('<i class="far fa-trash-alt trashcan"></i>'); // Append trash can icon
        }
    });
    
    // MOUSE LEAVE FOR TRASH CAN
    $('ul').on('mouseleave', 'li',function() {
        $(this).children('.trashcan').remove(); // Remove trash can icon
    });

  // MARKING AND UMNARKING AS COMPLETE
    $('ul').on('click', '#check', function(e) {
        $(e.target).toggleClass('fa-check-circle fa-circle');
        $(e.target).siblings('.itemText').toggleClass("text-muted");
        $(e.target).parent('li').toggleClass('list-group-item-danger list-group-item-success');
        updateCount();
        updateLocalStorage();
    });
    
    
   // EDITING A LIST ITEM
    $('ul').on('dblclick', 'li', function () { // Editable when double-clicked
        $(this).find('.itemText').prop("contenteditable", true).focus(); // Make content editable
        updateLocalStorage();
    });
    
    $('ul').on('keydown','.itemText',function(e) { // When the Enter key is pressed
        var key = e.which;
        if(key == 13) {
            e.preventDefault(); // Prevent Enter key from causing a jump to next line
            $('#itemDescription').focus(); // Focus on input box 
            updateLocalStorage();
        }
    });
    
    // DELETE ALL ITEMS
    $('.deleteAllItems').on('click', function () { 
        $('li').remove();
        updateCount();
        updateLocalStorage();
    });
    
    // DELETE COMPLETED ITEMS
    $('.deleteCompleted').on('click', function () { 
        $('li').each(function() {
            if ($(this).hasClass("list-group-item-success")){ // Remove if completed
                $(this).remove();
                updateCount();
                updateLocalStorage();
            }
         });
    });
    
    // DELETE TO DO ITEMS
    $('.deleteToDo').on('click', function () { 
        $('li').each(function() {
            if ($(this).hasClass("list-group-item-danger")){ // Remove if to do 
                $(this).remove();
                updateCount();
                updateLocalStorage();
            }
         });
    });
    
    
    // MARK ALL AS COMPLETED
    $('.markAllCompleted').on('click', function () { 
        $('li').each(function(){
            if ($(this).hasClass("list-group-item-danger")){
                $(this).children('i').toggleClass('fa-check-circle fa-circle');
                $(this).children('.itemText').toggleClass("text-muted");
                $(this).toggleClass('list-group-item-danger list-group-item-success');
                updateCount();
                updateLocalStorage();
            }
        });
    });
    
    // MARK ALL AS TO DO
    $('.markAllToDo').on('click', function () { 
        $('li').each(function(){
            if ($(this).hasClass("list-group-item-success")){
                $(this).children('i').toggleClass('fa-check-circle fa-circle');
                $(this).children('.itemText').toggleClass("text-muted");
                $(this).toggleClass('list-group-item-danger list-group-item-success');
                updateCount();
                updateLocalStorage();
            }
        });
    });
    
    // SORT FUNCTION
    function sortList(list){        // Sort alphabetically
        list.sort(function(a, b){
           a = $(a).children('.itemText').text();
           b = $(b).children('.itemText').text();
            if (a > b)
                return 1;
            else if (a < b)
                return -1;
            else
                return 0;
        });
    }
    
    // SORT A-Z
    $('.sort').on('click', function () { 
        let completed = $('.list-group-item-success');
        let toDo = $('.list-group-item-danger');
        sortList(completed);    // Sort completed items separately
        sortList(toDo);         // Sort to do items separately
        $('ul').append(toDo);   
        $('ul').append(completed);
        updateLocalStorage();
    });
    
    // UPDATE LOCAL STORAGE
    function updateLocalStorage () {
        let listItems = [];             // Array of objects
        
        $('li').each(function(){ 
            
            let eachListItem = {        // Object containing the dynamic aspects of each list item 
                description: $(this).children('.itemText').text(),
                greenOrRed: $(this).attr('class'),
                circleOrCheck: $(this).children('#check').attr('class'),
                textMuted: $(this).children('.itemText').attr('class')
            };

            listItems.push(eachListItem);   // Pushing object into array
        });
        
        let listString = JSON.stringify(listItems);     // Converting array into string
            localStorage.setItem("List", listString);
    }
    
    // LOAD LOCAL STORAGE
    function loadLocalStorage () {
        let listString = localStorage.getItem("List");
        if (listString) {
            let listContents = JSON.parse(listString);  // Converting the string back into an array
            for (let item of listContents) {
                $('ul').append('<li class="' + item.greenOrRed + '">' + '<i id=\'check\' class="' + item.circleOrCheck + '"></i> ' + '<span class="' + item.textMuted + '">' + item.description +'</span>' + ' </li>');
            }
        }
    }
});