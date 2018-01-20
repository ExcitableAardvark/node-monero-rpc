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
