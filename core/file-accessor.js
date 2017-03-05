const fs = require('fs');
// const lwip = require('lwip');

FileAccessor = {};

// fs wrapper
FileAccessor.writeFile = function(path,file){
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, file, function (error) {
      if (error) {reject(error);}
      else {
        console.log('the file has been successfully saved!');
        resolve();
      }
    });
  });
}

// FileAccessor.readImageObj  = function(path){
//   return new Promise(function(resolve, reject) {
//       lwip.open(path, function(err, image){
//         if(err) reject(err)
//         else {
//           resolve(image);
//         }
//       });
//   });
// }
