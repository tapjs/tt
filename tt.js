// tiny node-tap lookalike.
module.exports = test

var tests = module.exports.tests = [];
var ran = false
var id = 0
var fail = 0
var pass = 0

function test(name, fn) {
  tests.push([name, fn]);
  if (ran) return;
  ran = true
  process.nextTick(run)
}

var assert = require('assert')
var t = Object.keys(assert).map(function (k) {
  if (typeof assert[k] !== 'function') return;
  return [k, function () {
    var s = null
    id++
    try {
      assert[k].apply(assert, arguments)
      pass ++
      console.log('ok %d %s', id, k)
      console.log('')
    } catch (e) {

      fail ++
      // ignore everything up to the run() function
      Error.captureStackTrace(e, t[k])
      s = e.stack
      if (s) {
        s = s.trim().split(/\n/)
        // bottom two frames are nextTick and this file
        s.pop()
        s.pop()
      }

      if (s && !e.message)
        e.message = s[0]

      console.log('not ok %d %s', id, s ? s.shift() : e.message)
      if (s && s.length) {
        s = s.map(function(s) {
          return s.trim() + '\n'
        })
        console.log('# ' + s.join('# '))
      }
      console.log('')
    }
  }]
}).reduce(function (set, kv) {
  set[kv[0]] = kv[1]
  return set
}, {})

t.pass = function (m) {
  t.ok(true, m)
}

t.fail = function (m) {
  t.ok(false, m)
}

t.comment = function (m) {
  console.log('# %s\n', m.replace(/^#\s*/, ''))
}

t.end = run

var children = []
t.test = function(name, fn) {
  children.push([name, fn])
}

function run() {
  if (children.length) {
    tests.unshift.apply(tests, children)
    children.length = 0
  }

  var next = tests.shift();
  if (!next) {
    console.log('0..%d', id)
    console.log('')
    console.log('# pass %d/%d', pass, pass + fail)
    console.log('# fail %d/%d', fail, pass + fail)
    process.exit(fail)
    return
  }

  var name = next[0];
  var fn = next[1];
  console.log('# %s\n', name);
  process.nextTick(function() {
    fn(t);
  })
}
