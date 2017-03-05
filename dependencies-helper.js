(function($) {
DependenciesHelper = {};
  DependenciesHelper.addDependency = function(path,type,opt_id){
    switch (type) {
      case 'html':
        $('body').append('<link rel="import" href="'+ path + '" id="'+opt_id.replace('#','')+'">');
        return;
        case 'javascript':
          $('body').append('<script src="'+ path + '"></script>');
          return;
      default:
      return;
    }
  }
}(jQuery));
