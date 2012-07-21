$(function() {
	$.deck('.slide');
  $('.live-code').each(function(i, el) {
    var button = $(el).find('button.compile').first();
    var sassEl = $(el).find('.sass .source').first();
    var cssEl = $(el).find('.css').first();

    var htmlEl = $(el).find('.html .source').first();
    var displayEl = $(el).find('.display').first();
    displayEl.html("<style>"+cssEl.text()+"</style>"+htmlEl.text());
    htmlEl.keyup(function(e) {
      displayEl.html("<style>"+cssEl.text()+"</style>"+$(e.target).val());
    });
    var updater = function() {
      var source = sassEl.val();
      var request = $.ajax({
        url: "/compile",
        type: "POST",
        data: {sass: source},
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
    updater();
  });
});

