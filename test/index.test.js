'use strict'

var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')
var _ = require('lodash')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var suite = lab.suite
var before = lab.before
var expect = Code.expect

function createInstance () {
  return Seneca({log: 'silent'})
    .use('entity')
    .use('../lib/travis')
}
process.setMaxListeners(11);

describe('nodezoo-travis tests', () => {
  it('test Valid Response', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply).to.not.be.empty()
      done(err)
    })
  })
  it('test Everything', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply).to.not.be.empty()
      done(err)
    })
  })
  it('test No Repo', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': '' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply).to.not.be.empty()
      done(err)
    })
  })
  it('test no User', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': '', 'repo': '' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply).to.not.be.empty()
      done(err)
    })
  })
  it('test Invalid Response', function (done) {
    var si = createInstance()
    var payload = { 'name': 'shoobydoobydoobop' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.exist()
      done()
    })
  })
  it('test ID exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.id).to.be.a.string()
      done(err)
    })
  })
  it('test URL exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.url).to.be.a.string()
      done(err)
    })
  })
  it('test BuildID exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.buildId).to.be.a.number()
      done(err)
    })
  })
  it('test Active exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.active).to.be.a.boolean()
      done(err)
    })
  })
  it('test buildState exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.buildState).to.be.a.string()
      done(err)
    })
  })
  it('test lastBuilt exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()
      expect(reply.lastBuilt).to.be.a.string()
      done(err)
    })
  })
})
