var url = location.href;
var args = (url.split(/#/)[1] || '').split(/\&/);
var params = {}
for(var idx in args) {
  var arg = args[idx].split(/\=/);
  var key = arg[0];
  var value = arg[1];
  if(key && value) {
    params[key] = decodeURIComponent(value);
  }
}
var height = $(window).height();
var widgetArgs = {
  version: 2,
  type: 'profile',
  rpp: 30,
  interval: 30000,
  width: 'auto',
  height: height - 110,
  theme: {
    shell: {
      background: '#8ec1da',
      color: '#ffffff'
    },
    tweets: {
      background: '#ffffff',
      color: '#444444',
      links: '#1985b5'
    }
  },
  features: {
    scrollbar: true,
    loop: true,
    live: true,
    behavior: 'all'
  }
}
var skipValidation = false;
if(params.type) {
  skipValidation = true;
  if(params.type == 'single') {
    $.getJSON("/tweet_embed?id=" + params.query, function(data) {
      $("#header").after(data.html);
    });
  } else {
    widgetArgs.type = params.type;
    widgetArgs.search = params.query;
    widgetArgs.title = (params.type == 'search') ? 'search results' : null;
    widgetArgs.subject = params.query;
    
    var widget = new TWTR.Widget(widgetArgs).render();
    if(params.type == 'profile') {
      widget = widget.setUser(params.query);
    }
    widget.start();
  }
} else {
  $("#header").show();
}
function iframeUrl() {
  var type = $("#type").val();
  var query = $("#query").val();
  return location.protocol + "//" + location.host + "/tools/twitter/index.html#type=" + encodeURIComponent(type) + "&query=" + encodeURIComponent(query);
}
$("#add").click(function(event) {
  event.preventDefault();
  event.stopPropagation();
  lti.resourceSelected({
    embed_type: 'iframe',
    url: iframeUrl(),
    width: 500,
    height: 300,
    title: "Twitter list"
  });
});
$("#search").submit(function(event) {
  event.preventDefault();
  $("iframe").remove();
  if($("#type").val() == "single") {
    var $iframe = $("<iframe/>", {
      src: iframeUrl(),
      style: "width: 500px; height: 300px; border: 0; overflow: auto;",
      frameborder: 0
    });
  } else {
    var $iframe = $("<iframe/>", {
      src: iframeUrl(),
      style: "width: 500px; height: 300px; border: 0; overflow: auto;",
      frameborder: 0
    });
  }
  $("#header").after($iframe);
});