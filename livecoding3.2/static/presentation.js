$(function() {
	// Deck initialization
	$.deck('.slide');
  $('.live-code').each(function(i, el) {
    var sassEl = $(el).find('.sass .source').first();
    var cssEl = $(el).find('.css').first();
    cssEl.text(sassEl.html());

    var htmlEl = $(el).find('.html .source').first();
    var displayEl = $(el).find('.display').first();
    displayEl.html("<style>"+cssEl.text()+"</style>"+htmlEl.text());
    htmlEl.keyup(function(e) {
      displayEl.html("<style>"+cssEl.text()+"</style>"+$(e.target).val());
    });
  });
});

