# tt

A <abbr title="100 lines">very very small</abbr> tap-emitting test
framework.

This is *not* a test runner, but you can use tap as your test runner.
Because tt outputs TAP formatted results, it'll get interpreted
nicely.

## USAGE

Do this in your test script:

```javascript
var test = require('tt')

test('first test', function(t) {
  t.equal(2, 1 + 1, 'math works')
  t.equal(0.3, 0.1 + 0.1 + 0.1, 'except when it doesnt')
  t.test('child test', function(t) {
    t.pass('this will always pass')
    t.fail('this will never pass')
    t.end()
  })
  t.end()
})

test('second test', function(t) {
  t.ok(true, 'etc')
  t.end()
})
```

Run it with `node my-test.js`, or your favorite TAP-aware test runner
thingie.

## API

The function exported by `require('tt')` is the test function.  Give
it a name and a function.  That function will get an argument object
which has some assertion methods.

Every function from `require('assert')` are supported, but they output
TAP data rather than throwing.

Also, you have `t.pass(message)`, `t.fail(message)`,
`t.comment(message)`, and `t.test(name, fn)`.
