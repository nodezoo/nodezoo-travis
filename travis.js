/* Copyright (c) 2015-2016 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
"use strict";


var Travis = require('travis-ci');
var travis = new Travis({
    version: '2.0.0'
});

travis.builds(10380000).get(function (err, res) {
  if (err){
    return err;
  }
  //console.log(res.jobs)
});

cmd_parse({name:'test',travisurl:'https://travis-ci.org/pwmckenna/node-travis-ci/builds/10380000'});

function cmd_parse( args ) {
  var seneca  = this

  var m = /[\/:]([^\/:]+?)[\/:]([^\/:]+?)[\/:]([^\/:]+?)[\/:]([0-9]+)*$/.exec(args.travisurl)
  if( m ) {
    console.log("User: " + m[1] + ", Repo: " + m[2] + ", Build: " + m[4] );
  //  return done( null, { user:m[1], repo:m[2] })
  }
  else console.log("no data");
}

module.exports = function travis( options ){
  var seneca = this

  options = seneca.util.deepextend({
    token: '08a32510e52154b411a0d157b044e9972b4e8da6'
  },options)

  

  seneca.add( 'role:travis,cmd:get', cmd_get )
  seneca.add( 'role:travis,cmd:query', cmd_query )
  seneca.add( 'role:travis,cmd:parse', cmd_parse )



  function cmd_get( args, done ) {
    var seneca      = this
    var github_ent  = seneca.make$('github')

    var github_name = args.name

    github_ent.load$( github_name, function(err,github_mod){
      if( err ) return done(err);

      if( github_mod ) {
        return done(null,github_mod);
      }
      else if( args.giturl ) {
        seneca.act(
          'role:github,cmd:parse',
          {name:github_name,giturl:args.giturl},

          function(err,out){
            if( err ) return done(err);

            seneca.act(
              'role:github,cmd:query',
              {name:github_name,user:out.user,repo:out.repo},
              done)
          })
      }
      else return done();
    })
  }


  function cmd_query( args, done ) {
    var seneca      = this
    var github_ent  = seneca.make$('github')

    var github_name = args.name
    var user        = args.user
    var repo        = args.repo

    gitapi.authenticate({
      type:     "basic",
      username: options.token,
      password: 'x-oauth-basic'
    })

    gitapi.repos.get(
      {
        user: user,
        repo: repo
      },
      function(err,repo){
        if( err ) return done(err);

        var data
        if( repo ) {
          data = {
            user:    args.user,
            repo:    args.repo,
            stars:   repo.stargazers_count,
            watches: repo.subscribers_count,
            forks:   repo.forks_count,
            last:    repo.pushed_at
          }

          github_ent.load$(github_name, function(err,github_mod){
            if( err ) return done(err);

            if( github_mod ) {
              return github_mod.data$(data).save$(done);
            }
            else {
              data.id$ = github_name
              github_ent.make$(data).save$(done);
            }
          })
        }
        else return done()

      }
    )
  }


  


}