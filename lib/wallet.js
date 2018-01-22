/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

const jayson = require('jayson')

/**
 * A default daemon host, if one is not provided.
 *
 * @type {String}
 * @const
 */
const DEFAULT_HOST = 'http://localhost:18082'

class Wallet {
  /**
   * @param {string} host The wallet host
   * @constructor
   */
  constructor (host = DEFAULT_HOST) {
    this.host = host
    this.client = jayson.client.http(host + '/json_rpc')
  }

  /**
   * Get the wallet's address.
   *
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  getAddress (cb) {
    this.client.request('getaddress', [], (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null, response.result.address)
    })
  }

  /**
   * Get the wallet's balance.
   *
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  getBalance (cb) {
    this.client.request('getbalance', [], (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      const result = response.result

      return cb(null, {
        total: result.balance,
        spendable: result.unlocked_balance
      })
    })
  }

  /**
   * Send monero.
   *
   * @param {Object} options Options
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  transfer (options, cb) {
    // TODO(aardvark): https://github.com/monero-project/monero/blob/5f09d6c8333b0b0d07252dc157b9e794f6278662/src/wallet/wallet2.cpp#L4959

    if (!Array.isArray(options.destinations) || options.destinations.length === 0) {
      return cb('destinations are required')
    }

    const defaults = {
      mixin: 5,
      priority: 0
    }

    this.client.request('transfer', { ...defaults, ...options }, (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null, response.result)
    })
  }
}

module.exports = Wallet
