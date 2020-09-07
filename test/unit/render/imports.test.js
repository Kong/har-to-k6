import test from 'ava'
import imports from 'render/imports'
import { imports as makeImports } from 'make'

test('none', (t) => {
  const result = imports(makeImports())
  t.is(result, null)
})

test('k6', (t) => {
  const spec = makeImports()
  spec.group = true
  spec.check = true
  const result = imports(spec)
  t.is(result, `import { check, group } from "k6";`)
})

test('http', (t) => {
  const spec = makeImports()
  spec.http = true
  const result = imports(spec)
  t.is(result, `import http from "k6/http";`)
})

test('sleep', (t) => {
  const spec = makeImports()
  spec.sleep = true
  const result = imports(spec)
  t.is(result, `import { sleep } from "k6";`)
})

test('compat', (t) => {
  const spec = makeImports()
  spec.jsonpath = true
  spec.formUrlEncode = true
  spec.MimeBuilder = true
  const result = imports(spec)
  t.is(
    result,
    `import formurlencoded from "https://jslib.k6.io/form-urlencoded/3.0.0/index.js"
import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js"`
  )
})

// TODO: update when K6 remote js lib is up.
test('combined', (t) => {
  const spec = makeImports()
  spec.group = true
  spec.check = true
  spec.sleep = true
  spec.http = true
  spec.jsonpath = true
  spec.formUrlEncode = true
  spec.MimeBuilder = true
  const result = imports(spec)
  t.is(
    result,
    '' +
      `import { sleep, check, group } from "k6";
import http from "k6/http";


import formurlencoded from "https://jslib.k6.io/form-urlencoded/3.0.0/index.js"
import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js"`
  )
})
