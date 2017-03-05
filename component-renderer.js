(function($) {

  ComponentRenderer = {};

  ComponentRenderer.render = function(component){
    var defer = $.Deferred();
    var $imp = $('link[rel="import"]' + component.getId());
    if($imp.length==0){
      DependenciesHelper.addDependency(component.getTemplate(),'html',component.getId());
      $imp = $('link[rel="import"]' + component.getId());
    }
    $imp.on('load',function(){
      defer.resolve($($(this)[0].import).find('body').children());
    });
    return defer.promise();
  }

}(jQuery));
