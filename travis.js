'use strict'

var Travis = require('travis-ci')
var Request = require('request')
var _ = require('lodash')
var tr = new Travis({
  version: '2.0.0'
})
var url
var opts = {
  registry: 'http://registry.npmjs.org/'
}

module.exports = function travis () {
  var seneca = this
  
  opts = seneca.util.deepextend(opts)
  
  seneca.add('role:travis,cmd:extract', cmd_extract)
  seneca.add('role:travis,cmd:get', cmd_get)
  seneca.add('role:travis,cmd:parse', cmd_parse)
  seneca.add('role:travis,cmd:query', cmd_query)
  
  return {
    name: 'nodezoo-travis'
  }
}

  function cmd_get (args, done) {
      var seneca = this
      
    var travis_name = args.name
    var travis_ent = seneca.make$('travis')
    
    var url = opts.registry + travis_name
    // check if in the cache
    travis_ent.load$(travis_name, function(err,travis){
      if(err) {
        return done(err);
      }
      if(travis && !args.update) {
        return done(null,travis)
      }
      else {
        // get url from npm
        Request.get(url, function (err, res, body) {
          if (err) {
            return done(err)
          }
          else if (_.isEmpty(JSON.parse(body))) {
            return done(err)
          }
          var data = JSON.parse(body)
          // take giturl from npm data
          seneca.act('role:travis,cmd:extract', {data: data}, function (err, data) {
            if (err) {
              return done(err)
            }
            // parse username and repo from giturl
            var gitData = cmd_parse(data)
            
            if (gitData){
              var user = gitData[1]
              var gitRepo = gitData[2]
            }
            if (!user) {
              return done(err)
            }
            else {
              // get Travis data using github username and repo name
              seneca.act('role:travis,cmd:query', {name: travis_name, user: user, repo: gitRepo}, done)
            }
          })
        })
      }
    })
  }
  
  function cmd_query(args, done){
    var seneca = this
    var travis_ent = seneca.make$('travis')
    
    var travis_name = args.name
    var user = args.user
    var repo = args.repo
    var repoData
    var buildData
    url = "https://travis-ci.org/" + user + "/" + repo
    var dat = {
      "name":travis_name,
      "url":url
    }
    
    tr.repos(user, repo).get(function (err, res) {
      if (err) {
        return done(err)
      }
      repoData = res
      
    })
    tr.repos(user, repo).builds.get(function (err, res) {
      if (err) {
        return done(err)
      }
      buildData = res
      
      if (repoData && buildData.builds[0]){
        var data = Object.assign(dat,repoData.repo, buildData.builds[0].config)
      }
      else if(repoData){
        data = Object.assign(dat,repoData.repo)
      }
      else {
        data = null
      }
      
      if(data !== null){
        // update the data if module exists in cache, if not create it
        travis_ent.load$(travis_name, function(err,travis){
          if(err) {
            return done(err);
          }
          if(travis) {
            return travis.data$(data).save$(done);
          }
          else {
            data.id$ = travis_name
            travis_ent.make$(data).save$(done)
          } 
        })
      }
      else return done()
    })
  }
  
  function cmd_extract (args, done) {
    var seneca = this
      
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
