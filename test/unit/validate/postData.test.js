import test from 'ava'
import isolate from 'helper/isolate'
import { assay as makeAssay } from 'make'
const [postData, { params }] = isolate(test, 'validate/postData', {
  params: 'validate/params',
})

test.serial('empty', (t) => {
  t.notThrows(() => {
    postData({}, 0, makeAssay())
  })
})

test.serial('missing type', (t) => {
  t.throws(
    () => {
      postData({ text: 'Message in text' }, 0, makeAssay())
    },
    { name: 'MissingPostDataType' }
  )
})

test.serial('invalid type', (t) => {
  t.throws(
    () => {
      postData({ mimeType: 5 }, 0, makeAssay())
    },
    { name: 'InvalidPostDataType' }
  )
})

test.serial('invalid params', (t) => {
  t.throws(
    () => {
      postData({ mimeType: 'text/plain', params: 5 }, 0, makeAssay())
    },
    { name: 'InvalidPostDataParams' }
  )
})

test.serial('invalid text', (t) => {
  t.throws(
    () => {
      postData({ mimeType: 'text/plain', text: 5 }, 0, makeAssay())
    },
    { name: 'InvalidPostDataText' }
  )
})

test.serial('invalid comment', (t) => {
  t.throws(
    () => {
      postData({ mimeType: 'text/plain', comment: 5 }, 0, makeAssay())
    },
    { name: 'InvalidPostDataComment' }
  )
})

test.serial('invalid structured type', (t) => {
  t.throws(
    () => {
      postData(
        {
          mimeType: 'text/plain',
          params: [{}],
        },
        0,
        makeAssay()
      )
    },
    { name: 'InvalidPostDataType' }
  )
})

test.serial('valid postData combination', (t) => {
  postData({
    mimeType: 'application/x-www-form-urlencoded',
    params: [
      { name: 'foo', value: 1 },
      { name: 'bar', value: 2 },
      { name: 'baz', value: 'шеллы' },
    ],
    text: 'foo=1&bar=2&baz=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
  })
  t.true(params.calledOnce)
})

test.serial('valid minimal', (t) => {
  postData({ mimeType: 'text/plain' })
  t.true(params.notCalled)
})

test.serial('valid full params form-urlencoded', (t) => {
  postData(
    {
      mimeType: 'application/x-www-form-urlencoded',
      params: [{}],
      comment: 'Send URL encoded parameters',
    },
    0,
    makeAssay()
  )
  t.true(params.calledOnce)
})

test.serial('valid full params form-data', (t) => {
  postData(
    {
      mimeType: 'multipart/form-data',
      params: [{}],
      comment: 'Send multipart encoded parameters',
    },
    0,
    makeAssay()
  )
  t.true(params.calledOnce)
})

test.serial('valid full text', (t) => {
  postData(
    {
      mimeType: 'text/plain',
      text: 'Message in text',
      comment: 'Send a text body',
    },
    0,
    makeAssay()
  )
  t.true(params.notCalled)
})
