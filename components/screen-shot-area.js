(function($) {
  const path = require('path');

  // constructor
  ScreenShotArea = function(){
    this.$element_;
    this.count_ = 0;
    this.twitterLike_ = {};
  }

  ScreenShotArea.prototype.render = function($parentDOM) {
    var defer = $.Deferred();
    ComponentRenderer.render(this).then(function(content){
      $parentDOM.append(content);
      defer.resolve();
    }.bind(this));
    return defer.promise();
  }

  ScreenShotArea.prototype.enterDocument = function(){
    this.$element_ = $(ScreenShotArea.SELECTOR);
    this.bindEvents_();
  }

  ScreenShotArea.prototype.bindEvents_ = function(){
    this.$element_.on('click',ScreenShotArea.ButtonGroup.FULL_SCREEN_DELAY,this.onClickFullScreenDelay_.bind(this));
    this.$element_.on('click',ScreenShotArea.ButtonGroup.CROP,this.onClickCropBtn_.bind(this));
  }

  ScreenShotArea.prototype.initialize = function(){
    this.twitterLike_ = new TwitterLike();
    this.twitterLike_.render(this.$element_.find(ScreenShotArea.Inputs.TWITTER_LIKE)).then(function(){
      this.twitterLike_.enterDocument();
    }.bind(this));
    this.$element_.find(ScreenShotArea.Inputs.DELAY).val(User.preference.delaySec);
  }

  ScreenShotArea.prototype.onClickCropBtn_ = function(){
    WindowRequest.createWindow({transparent: true, frame: false,fullscreen:true},'transparent.html');
  }


  ScreenShotArea.prototype.onClickFullScreenDelay_ = function(){
    let option = {};
    option.size = ScreenShot.Constant.FULL_SCREEN;
    var delay = parseInt(this.$element_.find(ScreenShotArea.Inputs.DELAY).val());
    this.count_++;
    const screenshotPath = path.join(Dependencies.FOLDER_TO_SAVE, 'screenshot' + String(this.count_) + '.png');
    option.path = screenshotPath;
    WindowRequest.hideCurrentWindow();
    setTimeout(function(){
      console.log('now!!!');
      ScreenShot.takeScreenShot(option);
      WindowRequest.showCurrentWindow().then(this.onWriteFile_.bind(this,option));
    }.bind(this),100*delay);
  };

  ScreenShotArea.prototype.onWriteFile_ = function (option) {
        let info = {};
        info.count = this.count_;
        info.path = option.path;
        info.comment = this.twitterLike_.getValue();
        DBClient.insert(Dependencies.USER,info);
  };

  ScreenShotArea.ButtonGroup = {
    FULL_SCREEN:'.full-screen',
    FULL_SCREEN_DELAY:'.full-screen-delay',
    CROP:'.crop'
  }

  ScreenShotArea.Inputs = {
    DELAY:'#delay',
    TWITTER_LIKE:'.twitter-like-area'
  }

  ScreenShotArea.SELECTOR = '.screen-shot-area-root';
  ScreenShotArea.ID = '#screen-shot-area-template';
  ScreenShotArea.TEMPLATE = Dependencies.SCREEN_SHOT + 'screen-shot-area.html';

  ScreenShotArea.prototype.getId = function(){
    return ScreenShotArea.ID;
  }

  ScreenShotArea.prototype.getTemplate = function(){
    return ScreenShotArea.TEMPLATE;
  }

}(jQuery));
