// declare constants
const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const fs = require('fs');
const os = require('os');
const path = require('path');
const lwip = require('lwip');


ScreenShot = {};

ScreenShot.takeScreenShot = function(option){
  console.log('begin to take screenshot...');
  console.log('given option is below:');
  console.log(option);
  let options = { types: ['screen','window'], thumbnailSize: ScreenShot.determineScreenShotSize(option) }

  return new Promise(function(resolve, reject) {
    desktopCapturer.getSources(options, function (error, sources) {
      if (error) reject(error)
      console.log(sources);

      var test = (source)=>{
        return source.name === 'Entire screen' || source.name === 'Screen 1';
      };

      if(option.crop){
        test = (source)=>{
          return source.name === option.crop;
        }
      }

      var screenSource =  sources.find(test);
      if(!screenSource){
        reject('not found a screenSource');
      }
      ScreenShot.writeFile_(option,screenSource).then(function(){
        resolve();
      });
    });
  });
}

ScreenShot.writeFile_ = function (option,source) {
    console.log('begin to save screenshot...');
    const screenshotPath = option.path;
    return FileAccessor.writeFile(screenshotPath, source.thumbnail.toPng());
};

ScreenShot.determineScreenShotSize =function(option){
  if(option.thumbSize){
    return option.thumbSize;
  }
  if(option.size){
    switch (option.size) {
      case ScreenShot.Constant.FULL_SCREEN:
        return ScreenShot.getFullScreen();
      case ScreenShot.Constant.CROP_SIZE:
        return option;
      default:
      return ScreenShot.getFullScreen();
    }
  }
  return ScreenShot.getFullScreen();
};

ScreenShot.getFullScreen = function(){
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  };

ScreenShot.Constant = {
  FULL_SCREEN:'full-screen',
  CROP_SIZE:'window-size'
}
