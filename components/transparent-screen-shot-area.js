(function($) {
  const path = require('path');

  // constructor
  TransparentScreenShotArea = function(){
    this.$element_;
    this.$rect_;
    this.count_ = 99;
    this.rect_ = {};
    this.rectMode_ = false;
  }

  TransparentScreenShotArea.prototype.enterDocument = function(){
    this.$element_ = $(TransparentScreenShotArea.SELECTOR);
    this.initialize();
    this.bindEvents_();
  }

  TransparentScreenShotArea.prototype.bindEvents_ = function(){
    this.$element_.on('mousedown',this.onMouseDown_.bind(this));
    this.$element_.on('mousemove',this.onMouseMove_.bind(this));
    this.$element_.on('mouseup',this.onMouseUp_.bind(this));
    this.$rect_.on('mouseup',this.onMouseUp_.bind(this));
  }

  TransparentScreenShotArea.prototype.initialize = function(){
    var fullScreen = ScreenShot.getFullScreen();
    this.$element_.css('width',fullScreen.width).css('height',fullScreen.height);
    this.$element_.append('<div class="rect hidden"></div>');
    this.$rect_ = this.$element_.find(TransparentScreenShotArea.RECT);
  }

  TransparentScreenShotArea.prototype.onMouseDown_ = function(e){
    this.rectMode_ = true;
    this.rect_ = {};
    this.rect_.startX = e.clientX;
    this.rect_.startY = e.clientY;
    this.rect_.endX = e.clientX;
    this.rect_.endY = e.clientY;
    this.drawRect_();
  }

  TransparentScreenShotArea.prototype.drawRect_ = function(){
    var sizes = this.getSizes_();
    this.$rect_.css('left',String(sizes.minLeft)+'px').css('top',String(sizes.minTop) + 'px').css('width',String(sizes.maxLeft-sizes.minLeft) + 'px').css('height',String(sizes.maxTop-sizes.minTop) + 'px');
    this.$rect_.removeClass('hidden');
  }

  TransparentScreenShotArea.prototype.getSizes_ = function(){
    var minLeft = Math.min(this.rect_.startX,this.rect_.endX);
    var minTop = Math.min(this.rect_.startY,this.rect_.endY);

    var maxLeft = Math.max(this.rect_.startX,this.rect_.endX);
    var maxTop = Math.max(this.rect_.startY,this.rect_.endY);

    return {
      maxLeft:maxLeft,
      minLeft:minLeft,
      maxTop:maxTop,
      minTop:minTop
    };
  }

  TransparentScreenShotArea.prototype.onMouseMove_ = function(e){
    if(!this.rectMode_){
      return;
    }
    this.rect_.endX = e.clientX;
    this.rect_.endY = e.clientY;
    this.drawRect_();
  }

  TransparentScreenShotArea.prototype.onMouseUp_ = function(){
    if(!this.rectMode_){
      return;
    }
    this.$rect_.addClass('hidden');
    this.rectMode_ = false;
    let option = {};
    option.size = ScreenShot.Constant.CROP_SIZE;
    this.count_++;
    const screenshotPath = path.join(Dependencies.FOLDER_TO_SAVE, 'screenshot' + String(this.count_) + '.png');
    option.path = screenshotPath;
    option.crop = $('title').html();
    var sizes = this.getSizes_();
    var cropOption = {
      x:sizes.minTop,
      y:sizes.minLeft,
      height:sizes.maxTop - sizes.minTop,
      width:sizes.maxLeft - sizes.minLeft
    };
    option.height = cropOption.height;
    option.width = cropOption.width;
    WindowRequest.resizeWindow(cropOption).then(ScreenShot.takeScreenShot(option)).then(this.onWriteFile_.bind(this,option)).then(function(){
      WindowRequest.destroyWindow();
    }.bind(this));
  };

  TransparentScreenShotArea.prototype.onWriteFile_ = function (option) {
        let info = {};
        info.count = this.count_;
        info.path = option.path;
        // info.comment = this.twitterLike_.getValue();
        return new Promise(function(resolve, reject) {
          DBClient.insert(Dependencies.USER,info,function(){
            resolve();
          });
        });
  };

  TransparentScreenShotArea.SELECTOR = '.main-content';
  TransparentScreenShotArea.RECT = '.rect';

}(jQuery));
