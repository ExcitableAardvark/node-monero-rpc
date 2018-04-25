/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

const crypto = require('crypto')
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
   * @return {Promise.<string>} address
   */
  getAddress () {
    return new Promise((resolve, reject) => {
      this.client.request('getaddress', [], (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result.address)
      })
    })
  }

  /**
   * Get the wallet's balance.
   *
   * @return {Promise.<Object>} balance
   */
  getBalance () {
    return new Promise((resolve, reject) => {
      this.client.request('getbalance', [], (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        const result = response.result

        return resolve({
          total: result.balance,
          spendable: result.unlocked_balance
        })
      })
    })
  }

  /**
   * Send monero.
   *
   * @param {Object} options Options
   * @return {Promise.<string>} result of operation
   */
  transfer (options) {
    // TODO(aardvark): https://github.com/monero-project/monero/blob/5f09d6c8333b0b0d07252dc157b9e794f6278662/src/wallet/wallet2.cpp#L4959
    return new Promise((resolve, reject) => {
      if (!Array.isArray(options.destinations) || options.destinations.length === 0) {
        return reject(new Error('destinations are required'))
      }

      const defaults = {
        mixin: 7,
        priority: 0
      }

      this.client.request('transfer', { ...defaults, ...options }, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result)
      })
    })
  }

  /**
   * Send monero, and split into multiple transactions if required.
   *
   * @param {Object} options Options
   * @return {Promise} result
   */
  splitTransfer (options) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(options.destinations) || options.destinations.length === 0) {
        return reject(new Error('destinations are required'))
      }

      const defaults = {
        mixin: 7,
        priority: 0
      }

      this.client.request('transfer_split', { ...defaults, ...options }, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result)
      })
    })
  }

  /**
   * Get a list of incoming payments using a given payment id.
   *
   * @param {string} paymentId The Payment ID
   * @return {Promise} incoming payments
   */
  getPayments (paymentId) {
    return new Promise((resolve, reject) => {
      this.client.request('get_payments', { payment_id: paymentId }, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result.payments)
      })
    })
  }

  /**
   * Generate a random payment id.
   *
   * @param {Boolean} integrated If the payment id is for an integrated address
   * @return {Promise.string} payment id
   */
  getRandomPaymentId (integrated) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(integrated ? 32 : 8, (err, buf) => {
        if (err) return reject(err)
        return resolve(buf.toString('hex'))
      })
    })
  }

  /**
   * Generate a random integrated address.
   *
   * @return {Promise.<Object>} integrated address
   */
  getRandomIntegratedAddress () {
    return new Promise((resolve, reject) => {
      this.getRandomPaymentId(true)
        .then(paymentId => {
          this.client.request('make_integrated_address', { payment_id: paymentId }, (err, response) => {
            if (err) return reject(err)
            if (response.error) return reject(new Error(response.error.message))

            return resolve({ paymentId, address: response.result.integrated_address })
          })
        })
        .catch(err => reject(err))
    })
  }

  /**
   * Get a list of payments using a list of payment ids from a given height.
   *
   * @param {Array.string} paymentIds A list of payment ids to check
   * @param {Number} blockHeight The block height to look from
   * @return {Promise} list of payments
   */
  getBulkPayments (paymentIds, blockHeight) {
    return new Promise((resolve, reject) => {
      this.client.request('get_bulk_payments', { payment_ids: paymentIds, min_block_height: blockHeight }, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        resolve(response.result.payments)
      })
    })
  }
}

module.exports = Wallet
