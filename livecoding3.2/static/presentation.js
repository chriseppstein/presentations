$(function() {
	$.deck('.slide');
  $('textarea.source,textarea.alternate-source').each(function(i,textarea) {
    $(textarea).attr("id","source-"+i);
  });
  $('select.format').html("<option selected>expanded</option><option>compact</option><option>compressed</option><option>nested</option>");
  $('.live-code section :first-child').before("<button class='resizer'>⇿</button>");
  $('.live-code').each(function(i, el) {
    var button = $(el).find('button.compile').first();
    var cssEl = $(el).find('.css .output').first();

    // Create the full-size togglers
    $(el).find('.resizer').click(function(e) {
      $(e.target).parent("section").toggleClass("fullsize");
    });

    // Create the source changers
    $(el).find(".source").parent("section").each(function(i,section) {
      var textareas = $(section).find("textarea");
      if (textareas.size() > 1) {
        var options = textareas.map(function(i, ta) {
          ta = $(ta);
          return "<option value='"+ta.attr("id")+"'>"+ta.attr("title")+"</option>";
        }).toArray().join();
        $(section).find("textarea").last().after("<select class='source-changer'>"+options+"</select>");
      }
    });
    $(".source-changer").change(function(e) {
      $(e.target).parent("section").find("textarea").removeClass("source").addClass("alternate-source");
      $("#"+$(e.target).val()).addClass("source");
      updater();
    });

    // convenience method for finding the html source
    var htmlEl = function() {
      return $(el).find('.html .source').first();
    }
    var displayEl = $(el).find('.result .output').first();
    // Set up the initial html result
    displayEl.html("<style>"+cssEl.text()+"</style>"+htmlEl().text());
    // Monitor the the html for changes and update the results
    htmlEl().keyup(function(e) {
      displayEl.html("<style>"+cssEl.text()+"</style>"+$(e.target).val());
    });
    // The updater compiles sass and inserts the resulting css into the page.
    var updater = function() {
      var source = $(el).find('.sass .source').first().val();
      var request = $.ajax({
        url: "/compile",
        type: "POST",
        data: {sass: source, style: $("select.format").val()},
        dataType: "text"
      });
      request.done(function(result) {
        cssEl.text(result);
        displayEl.html("<style>"+result+"</style>"+$(htmlEl()).val());
      });
      // It happens, ok?
      request.fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
        cssEl.html('<div class="error">'+jqXHR.responseText+'</div>');
      });
    };
    // Update sass when the button is clicked, when the format changes, and at the start.
    button.click(updater);
    $("select.format").change(updater);
    updater();
  });
});

