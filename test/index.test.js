'use strict'

var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')
var _ = require('lodash')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var suite = lab.suite
var before = lab.before
var it = lab.it
var expect = Code.expect

function createInstance () {
  return Seneca({log: 'silent'})
    .use('entity')
    .use('../lib/travis')
}
process.setMaxListeners(12)

var si = createInstance()

suite('nodezoo-travis suite tests ', function () {
  before({}, function (done) {
    si.ready(function (err) {
      if (err) {
        return process.exit(!console.error(err))
      }
      done()
    })
  })
})

describe('nodezoo-travis tests', () => {
  it('test Valid Response', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca' }
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
      expect(err).to.not.exist()
      expect(reply).to.exist()
      expect(reply.err).to.exist()
      expect(reply.ok).to.be.false()
      done()
    })
  })

  it('test ID exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.id).to.be.a.string()
      done(err)
    })
  })

  it('test URL exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.url).to.be.a.string()
      done(err)
    })
  })

  it('test BuildID exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.buildId).to.be.a.number()
      done(err)
    })
  })

  it('test Active exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.active).to.be.a.boolean()
      done(err)
    })
  })

  it('test buildState exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.buildState).to.be.a.string()
      done(err)
    })
  })

  it('test lastBuilt exists', function (done) {
    var si = createInstance()
    var payload = { 'name': 'seneca', 'user': 'powerbrian', 'repo': 'https://github.com/senecajs/seneca' }
    si.act(_.extend({ role: 'travis', cmd: 'get' }, payload), function (err, reply) {
      expect(err).to.not.exist()

      expect(reply).to.exist()
      expect(reply.data).to.exist()
      expect(reply.err).to.not.exist()
      expect(reply.ok).to.be.true()

      expect(reply.data.lastBuilt).to.be.a.string()
      done(err)
    })
  })
})
