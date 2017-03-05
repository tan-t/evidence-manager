(function($) {

  // constructor
  TwitterLike = function(){
    this.$element_;
  }

  TwitterLike.prototype.render = function($parentDOM) {
    var defer = $.Deferred();
    ComponentRenderer.render(this).then(function(content){
      $parentDOM.append(content);
      defer.resolve();
    }.bind(this));
    return defer.promise();
  }

  TwitterLike.prototype.enterDocument = function(){
    this.$element_ = $(TwitterLike.SELECTOR);
    this.bindEvents_();
  }

  TwitterLike.prototype.bindEvents_ = function(){

  }

  TwitterLike.prototype.getValue = function(){
    return this.$element_.find(TwitterLike.INPUT).val();
  }

  TwitterLike.INPUT = '#input-data';
  TwitterLike.SELECTOR = '.twitter-like-root';
  TwitterLike.ID = '#twitter-lke-template';
  TwitterLike.TEMPLATE = Dependencies.COMPONENTS + 'twitter-like.html';

  TwitterLike.prototype.getId = function(){
    return TwitterLike.ID;
  }

  TwitterLike.prototype.getTemplate = function(){
    return TwitterLike.TEMPLATE;
  }

}(jQuery));
