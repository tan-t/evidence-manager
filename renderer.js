connected = function(){
  screenShotArea = new ScreenShotArea();
  screenShotArea.render($('.screen-shot-area-container')).then(function(){
    screenShotArea.enterDocument();
    screenShotArea.initialize();
  });
}
DBClient.connect(connected);
