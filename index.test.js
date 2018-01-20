/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

/* eslint-env jest */

const monero = require('./')

test('daemon rpc is exported', () => {
  expect(monero.Daemon).toBeDefined()
})

test('wallet rpc is exported', () => {
  expect(monero.Wallet).toBeDefined()
})
