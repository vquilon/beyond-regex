
(function() {
  window.jasmine = jasmineRequire.core(jasmineRequire);
  jasmineRequire.html(jasmine);
  var env = jasmine.getEnv();
  var jasmineInterface = jasmineRequire.interface(jasmine, env);
  extend(window, jasmineInterface);

  var queryString = new jasmine.QueryString({
    getWindowLocation: function() { return window.location; }
  });

  var filterSpecs = !!queryString.getParam("spec");

  var config = {
    failFast: queryString.getParam("failFast"),
    oneFailurePerSpec: queryString.getParam("oneFailurePerSpec"),
    hideDisabled: queryString.getParam("hideDisabled")
  };

  var random = queryString.getParam("random");

  if (random !== undefined && random !== "") {
    config.random = random;
  }

  var seed = queryString.getParam("seed");
  if (seed) {
    config.seed = seed;
  }
  var htmlReporter = new jasmine.HtmlReporter({
    env: env,
    navigateWithNewParam: function(key, value) { return queryString.navigateWithNewParam(key, value); },
    addToExistingQueryString: function(key, value) { return queryString.fullStringWithNewParam(key, value); },
    getContainer: function() { return document.body; },
    createElement: function() { return document.createElement.apply(document, arguments); },
    createTextNode: function() { return document.createTextNode.apply(document, arguments); },
    timer: new jasmine.Timer(),
    filterSpecs: filterSpecs
  });
  env.addReporter(jasmineInterface.jsApiReporter);
  env.addReporter(htmlReporter);
  var specFilter = new jasmine.HtmlSpecFilter({
    filterString: function() { return queryString.getParam("spec"); }
  });

  config.specFilter = function(spec) {
    return specFilter.matches(spec.getFullName());
  };

  env.configure(config);
  window.setTimeout = window.setTimeout;
  window.setInterval = window.setInterval;
  window.clearTimeout = window.clearTimeout;
  window.clearInterval = window.clearInterval;
  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    htmlReporter.initialize();
    env.execute();
  };
  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

}());
