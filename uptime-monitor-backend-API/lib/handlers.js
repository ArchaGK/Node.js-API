var _data = require('./data');
var helpers = require('./helpers');


var handlers = {};

// Sample handler
// handlers.sample = function(data,callback){
//     callback(406,{'name':'sample handler'});
// };

handlers.users = function(data,callback){
  console.log("handlers.users called");
  var acceptableMethods = ['post','get','put','delete'];

  if (acceptableMethods.indexOf(data.method)> -1){
      console.log("method requested ->",data.method);

    handlers._users[data.method](data,callback);

  } else {
  callback(405);
  }
};

handlers._users = {};

handlers._users.post = function(data,callback){
  var firstName = typeof(data.payload.firstName)=='string' &&
      data.payload.firstName.trim().length > 0? data.payload.firstName.trim() : false;

  var lastName = typeof(data.payload.lastName)=='string' &&
        data.payload.lastName.trim().length > 0? data.payload.lastName.trim() : false;

  var phone = typeof(data.payload.phone)=='string' &&
        data.payload.phone.trim().length == 10? data.payload.phone.trim() : false;

  var password = typeof(data.payload.password)=='string' &&
      data.payload.password.trim().length > 0? data.payload.password.trim() : false;

  var tosAgreement = typeof(data.payload.tosAgreement)=='boolean' &&
      data.payload.tosAgreement==true > 0? true : false;


 if(firstName && lastName && phone && password && tosAgreement){
  //make sure that user doent already exist
  _data.read('users',phone,function(data,err){
    if(!err){
      var hashedpsw = helpers.hash(password);

      if(hashedpsw){
        var userObject = {
          'firstName' : firstName,
          'lastName': lastName,
          'phone': phone,
          'hashedpsw':hashedpsw,
          'tosAgreement':true

        };

        //store the users
        _data.create('users',phone,userObject,function(err){
          if(!err){
            callback(200);

          }else {
            console.log(err);
            callback(500,{'error':'could not create the new user'});
          }
        });

      } else {
        callback(500,{'error':'could not hash the password'});
      }




    } else {
      callback(400,{'error':'user with this phone number already exists'});
      console.log("satej::",err, data);
    }

  })


 } else {
   callback(400,{'Error': 'missing fields'});
 }


};

handlers._users.get = function(data,callback){
  //check if phone no. is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() :false;
  if(phone){
    //lookup the users
    _data.read('users',phone,function(err,data){
      if(!err && data){
        //remove hased password
        delete data.hashedpsw;
        callback(200,data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'error':'missing required field'});
  }


};

handlers._users.put = function(data,callback){
    //check require fields
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() :false;
    var firstName = typeof(data.payload.firstName)=='string' &&
        data.payload.firstName.trim().length > 0? data.payload.firstName.trim() : false;

    var lastName = typeof(data.payload.lastName)=='string' &&
          data.payload.lastName.trim().length > 0? data.payload.lastName.trim() : false;



    var password = typeof(data.payload.password)=='string' &&
        data.payload.password.trim().length > 0? data.payload.password.trim() : false;

    var tosAgreement = typeof(data.payload.tosAgreement)=='boolean' &&
        data.payload.tosAgreement==true > 0? true : false;

        // error if phone is invalid
        if(phone){
          //error if nothing is there to Update
          if(firstName || lastName || password){
            //llokup the users
            _data.read('users',phone,function(err,userData){
              if(!err && userData){
                if(firstName){
                  userData.firstName = firstName;
                }
                if(lastName){
                  userData.lastName = lastName;
                }
                if(password){
                  userData.hashedpsw = helpers.hash(password);
                }
                //store new updates
                _data.update('users',phone,userData,function(err){
                  if(!err){
                    callback(200);
                  } else {
                    console.log(err);
                    callback(500,{'error':'could not update the user'});
                  }
                })
              }else{
                callback(400,{'error':'user does not exist'});
              }
            });
          }else {
            callback(400,{'error':'Missing required to update'});
          }

        } else {
          callback(400,{'error':'Missing required field'});
        }


};

handlers._users.delete = function(data,callback){
  // Check that phone number is valid
  var phone = typeof(data.queryStringObject.phone) == 'string' &&
  data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    // Lookup the user
    _data.read('users',phone,function(err,data){
      if(!err && data){
        _data.delete('users',phone,function(err){
          if(!err){
            callback(200);
          } else {
            callback(500,{'Error' : 'Could not delete the specified user'});
          }
        });
      } else {
        callback(400,{'Error' : 'Could not find the specified user.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};


handlers.ping = function(data,callback){
  callback(200);
};


// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};



module.exports = handlers;
