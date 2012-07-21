$(function() {
	$.deck('.slide');
  $('select.format').html("<option selected>expanded</option><option>compact</option><option>compressed</option><option>nested</option>");
  $('.live-code section :first-child').before("<button class='resizer'>⇿</button>");
  $('.live-code').each(function(i, el) {
    var button = $(el).find('button.compile').first();
    var sassEl = $(el).find('.sass .source').first();
    var cssEl = $(el).find('.css .output').first();
    $(el).find('.resizer').click(function(e) {
      $(e.target).parent("section").toggleClass("fullsize");
    });

    var htmlEl = $(el).find('.html .source').first();
    var displayEl = $(el).find('.result .output').first();
    displayEl.html("<style>"+cssEl.text()+"</style>"+htmlEl.text());
    htmlEl.keyup(function(e) {
      displayEl.html("<style>"+cssEl.text()+"</style>"+$(e.target).val());
    });
    var updater = function() {
      var source = sassEl.val();
      var request = $.ajax({
        url: "/compile",
        type: "POST",
        data: {sass: source, style: $("select.format").val()},
        dataType: "text"
      });
      request.done(function(result) {
        cssEl.text(result);
        displayEl.html("<style>"+result+"</style>"+$(htmlEl).val());
      });
      request.fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
        cssEl.html('<div class="error">'+jqXHR.responseText+'</div>');
      });
    };
    button.click(updater);
    $("select.format").change(updater);
    updater();
  });
});

