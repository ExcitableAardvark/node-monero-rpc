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
  wallet.getAddress((err, address) => {
    if (err) done(err)
    expect(address).toHaveLength(95)
    done()
  })
})

test('getBalance returns total and spendable balance', done => {
  wallet.getBalance((err, balance) => {
    if (err) done(err)
    expect(balance.total).toBeDefined()
    expect(balance.spendable).toBeDefined()
    done()
  })
})

test('transfer rejects bad destinations', done => {
  wallet.transfer({ destinations: '42EuBWbYfYVcs3Hjdp4mMN6PXLUjZouNRDP6ASs52N18NcLa7aiogYE8qpyBYyuUBGGP6dWoJwwk4gQhG76UPPwfAXdcZ5K' }, (err, result) => {
    expect(err).toMatch(/destinations/)
    done()
  })
})

test('transfer rejects bad destinations', done => {
  wallet.transfer({ destinations: [] }, (err, result) => {
    expect(err).toMatch(/destinations/)
    done()
  })
})

test('getRandomPaymentId generates new style ids', done => {
  wallet.getRandomPaymentId(true, (err, id) => {
    if (err) return done(err)
    expect(id).toHaveLength(16)
    done()
  })
})

test('getRandomPaymentId generates old style ids', done => {
  wallet.getRandomPaymentId(false, (err, id) => {
    if (err) return done(err)
    expect(id).toHaveLength(64)
    done()
  })
})

test('getRandomIntegratedAddress', done => {
  wallet.getRandomIntegratedAddress((err, result) => {
    if (err) return done(err)
    expect(result.paymentId).toBeDefined()
    expect(result.address).toHaveLength(106)
    done()
  })
})

test('getBulkPayments returns an array', done => {
  wallet.getBulkPayments('4279257e0a20608e25dba8744949c9e1caff4fcdafc7d5362ecf14225f3d9030', 990000, (err, payments) => {
    if (err) return done(err)
    expect(payments).toBeInstanceOf(Array)
    done()
  })
})
