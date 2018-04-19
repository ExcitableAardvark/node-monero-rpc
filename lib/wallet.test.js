/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

/* eslint-env jest */

const Wallet = require('./wallet')

const wallet = new Wallet('http://localhost:18082')

test('getAddress returns an address', done => {
  expect(wallet.getAddress()).resolves.toHaveLength(95)
})

test('getBalance returns total and spendable balance', done => {
  wallet.getBalance()
    .then(balance => {
      expect(balance.total).toBeDefined()
      expect(balance.spendable).toBeDefined()
      done()
    })
    .catch(err => done(err))
})

test('transfer rejects bad destinations', done => {
  expect(wallet.transfer({ destinations: '42EuBWbYfYVcs3Hjdp4mMN6PXLUjZouNRDP6ASs52N18NcLa7aiogYE8qpyBYyuUBGGP6dWoJwwk4gQhG76UPPwfAXdcZ5K' }))
    .rejects
    .toBeInstanceOf(Error)
})

test('transfer rejects bad destinations', done => {
  expect(wallet.transfer({ destinations: [] }))
    .rejects
    .toBeInstanceOf(Error)
})

test('getRandomPaymentId generates new style ids', done => {
  expect(wallet.getRandomPaymentId(false)).resolves.toHaveLength(16)
})

test('getRandomPaymentId generates old style ids', done => {
  expect(wallet.getRandomPaymentId(true)).resolves.toHaveLength(64)
})

test('getRandomIntegratedAddress', done => {
  wallet.getRandomIntegratedAddress()
    .then(result => {
      expect(result.paymentId).toBeDefined()
      expect(result.address).toHaveLength(106)
      done()
    })
    .catch(err => done(err))
})

test('getBulkPayments returns an array', done => {
  expect(wallet.getBulkPayments('4279257e0a20608e25dba8744949c9e1caff4fcdafc7d5362ecf14225f3d9030', 990000)).resolves
    .toBeInstanceOf(Array)
})
