'use strict'

var Travis = require('travis-ci')
var Request = require('request')
var _ = require('lodash')
var tr = new Travis({
  version: '2.0.0'
})

module.exports = function travis () {
  var seneca = this
  
  var options = seneca.util.deepextend({
    registry: 'http://registry.npmjs.org/'
  })
  
  seneca.add('role:travis,cmd:extract', cmd_extract)
  seneca.add('role:travis,cmd:get', cmd_get)
  seneca.add('role:travis,cmd:parse', cmd_parse)
  
  function cmd_get (args, done) {
    var travis_name = args.name
    var travis_ent = seneca.make$('travis')
    
    var url = options.registry + travis_name
    
    travis_ent.load$(travis_name, function(err,travis){
      if(err) return done(err);
      
      if(travis && !args.update) {
        return done(null,travis);
      }
      else {
        Request.get(url, function (err, res, body) {
          if (err) {
            return done(err)
          }
          else if (_.isEmpty(JSON.parse(body))) {
            return done(err)
          }
          var data = JSON.parse(body)
          seneca.act('role:travis,cmd:extract', {data: data}, function (err, data) {
            if (err) {
              return done(err)
            }
            var gitData = cmd_parse(data)
            
            if (gitData){
              var user = gitData[1]
              var git_name = gitData[2]
            }
            if (!user) {
              return done(err)
            }
            else {
              getRepo(user,git_name, function(build){
                data.id$ = travis_name
                travis_ent.make$(build).save$(done);
              })
            }
          })
        })
      }
    })
  }
  
  // function to extract Travis data and return object
  function getRepo(user, git_name, cb){
    var repo
    var builds 
    
    tr.repos(user, git_name).get(function (err, res) {
      if (err) {
        cb(err)
      }
      repo = res
      
    })
    tr.repos(user, git_name).builds.get(function (err, res) {
      if (err) {
        cb(err);
      }
      builds = res
      
      if (repo && builds.builds[0]){
        var build = Object.assign(repo.repo, builds.builds[0].config)
      }
      else if(repo){
        build = Object.assign(repo.repo)
      }
      else {
        build = null;
      }
      cb(build);
    })
  }
  
  function cmd_extract (args, done) {
    var data = args.data
    var dist_tags = data['dist-tags'] || {}
    var latest = ((data.versions || {})[dist_tags.latest]) || {}
    var repository = latest.repository || {}
    
    var out = {
      giturl: repository.url
    }
    
    done(null, out)
  }
  
  function cmd_parse (args) {
    var m = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(args.giturl)
    if (m) {
      return (m)
    }
    else {
      return null
    }
  }
}
