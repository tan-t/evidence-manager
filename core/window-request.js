WindowRequest = {};

const remote = require('electron').remote;
const BrowserWindow = remote.require('electron').BrowserWindow;
const path = remote.require('path')
const url = remote.require('url')

WindowRequest.hideCurrentWindow = function(){
  var defer = $.Deferred();
  remote.getCurrentWindow().hide();
  remote.getCurrentWindow().on('hide',function(){
      defer.resolve();
  });
  return defer.promise();
}

WindowRequest.showCurrentWindow = function(){
  var defer = $.Deferred();
  remote.getCurrentWindow().show();
  remote.getCurrentWindow().on('show',function(){
      defer.resolve();
  });
  return defer.promise();
}

WindowRequest.createWindow = function(option,loadUrl){
  let newWindow = new BrowserWindow(option);

  newWindow.loadURL(url.format({
    pathname: path.join(__dirname,'../' + loadUrl),
    protocol: 'file:',
    slashes: true
  }))

  // newWindow.show();

  // newWindow.webContents.openDevTools()

  // const windows = remote.global('windows');
  // windows.push(newWindow);
  return newWindow;
}

WindowRequest.resizeWindow = function(option,opt_id){
  var target = remote.getCurrentWindow();
  if(opt_id){
    const windows = remote.global('windows');
    target = windows.find((window)=>{
      return window.id == id;
    });
  }
  var prom = new Promise(function(resolve, reject) {
    target.on('resize',function(){
      resolve()
    })
  });
  target.setBounds(option);
  return prom;
}

WindowRequest.destroyWindow = function(opt_id){
  if(opt_id){
    let windows = remote.global('windows');
    windows.find((window)=>{
      return window.id == id;
    }).close();
  } else {
    remote.getCurrentWindow().close();
  }
}
