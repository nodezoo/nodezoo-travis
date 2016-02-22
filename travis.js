/* Copyright (c) 2015-2016 Matthew O'Connor, MIT License */
/* jshint node:true, asi:true, eqnull:true */
"use strict";


var Travis = require('travis-ci');
var tr = new Travis({
    version: '2.0.0'
});
 
 
  var t = function travis(){
  var seneca = this

  //seneca.add('role:travis,cmd:get', cmd_get);
  //seneca.add('role:travis,cmd:parse', cmd_parse);
  cmd_get({input:'https://travis-ci.org/pwmckenna/node-travis-ci/builds/10380000'})

  function cmd_get(args, done) {
    var query = args.input

if(query == undefined){
  console.log("no data");
   return done();
 }
 else if (typeof(query) === 'number'){
    tr.builds(query).get(function (err, res) {
      if (err){
        return err;
      }
      console.log(res.build)
    });
  }
    else {
       var parse = cmd_parse({input:query});
       tr.builds(parse[4]).get(function (err, res) {
         if (err){
           return err;
         }
         console.log(res.build)
       });
    }
    
  }

  function cmd_parse(args) {
    var seneca  = this

    var m = /[\/:]([^\/:]+?)[\/:]([^\/:]+?)[\/:]([^\/:]+?)[\/:]([0-9]+)*$/.exec(args.input)
    if(m) {
      console.log("User: " + m[1] + ", Repo: " + m[2] + ", Build: " + m[4] );
      return m;
    }
    else return null;
  }

}
t();