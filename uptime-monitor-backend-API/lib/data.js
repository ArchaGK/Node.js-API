var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');


var lib = {};

//base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');

//writing data to file

lib.create = function(dir,file,data,callback){
  //open file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescription){
     if(!err && fileDescription){
       //convert data to string
       var stringData = JSON.stringify(data);

       //write data to file & close
       fs.writeFile(fileDescription,stringData,function(err){
         if(!err){
           fs.close(fileDescription,function(err){
             if(!err){
               callback(false);
             } else {
               callback("error closing new file");
             }
           })
         }
         else {
           callback("Error writing to new file");
         }
       })

     } else {
       callback("could not create the file");
     }

  });

};

// Read data from a file
lib.read = function(dir,file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
    if(!err && data){
      var parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData);
    } else{
      callback(err,data);
    }

  });
};

// Update data in a file
lib.update = function(dir,file,data,callback){

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet');
    }
  });

};

// Delete a file
lib.delete = function(dir,file,callback){

  // unnlink the file from file system
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
     if(!err){

       callback(false);
     } else{

       callback("error deleting file");

     }


  });


};

// Export the module
module.exports = lib;
