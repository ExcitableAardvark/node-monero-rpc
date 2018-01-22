/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

const jayson = require('jayson')
const request = require('request')

/**
 * A default daemon host, if one is not provided.
 *
 * @type {String}
 * @const
 */
const DEFAULT_HOST = 'http://localhost:18081'

class Daemon {
  /**
   * @param {string} host The daemon host
   * @constructor
   */
  constructor (host = DEFAULT_HOST) {
    this.host = host
    this.client = jayson.client.http(host + '/json_rpc')
  }

  /**
   * Look up how many blocks are in the longest chain known to the node.
   *
   * @param {Function} cb A callback to recieve the result
   * @returns {void}
   */
  getLastBlockHeight (cb) {
    this.client.request('getblockcount', [], (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null, response.result.count)
    })
  }

  /**
   * Block header information for the most recent block is easily retrieved with
   * this method.
   *
   * @param {Function} cb A callback to recieve the result
   * @returns {void}
   */
  getLastBlockHeader (cb) {
    this.client.request('getlastblockheader', [], (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null, response.result.block_header)
    })
  }

  /**
   * Block header information can be retrieved using either a block's hash or
   * height.
   *
   * @param {number|string} id A block height or block hash
   * @param {Function} cb A callback to recieve the result
   * @returns {void}
   */
  getBlockHeader (id, cb) {
    if (typeof id === 'number') {
      this.client.request('getblockheaderbyheight', { height: id }, (err, response) => {
        if (err) return cb(err)
        if (response.error) return cb(response.error.message)

        return cb(null, response.result.block_header)
      })
    } else if (typeof id === 'string') {
      this.client.request('getblockheaderbyhash', { hash: id }, (err, response) => {
        if (err) return cb(err)
        if (response.error) return cb(response.error.message)

        return cb(null, response.result.block_header)
      })
    } else {
      return cb('id must be of type number or string')
    }
  }

  /**
   * Full block information can be retrieved by either block height or hash,
   * like with the block header calls.
   *
   * @param  {number|string} id A block height or block hash
   * @param  {Function} cb A callback to recieve the result
   * @return {void}
   */
  getBlock (id, cb) {
    if (typeof id !== 'number' && typeof id !== 'string') {
      return cb('id must be of type number or string')
    }

    const params = typeof id === 'number' ? { height: id } : { hash: id }

    this.client.request('getblock', params, (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      const result = response.result
      return cb(null, {
        blob: result.blob,
        body: result.json,
        header: result.block_header
      })
    })
  }

  /**
   * Get a new block template for mining.
   *
   * @param {string} address Address of wallet to receive coinbase transaction
   * @param {number} reserved Reserve size
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  getBlockTemplate (address, reserved, cb) {
    const params = {
      wallet_address: address,
      reserve_size: reserved
    }

    this.client.request('getblocktemplate', params, (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      const result = response.result
      return cb(null, {
        blob: result.blocktemplate_blob,
        difficulty: result.difficulty,
        height: result.height,
        previous: result.prev_hash,
        offset: result.reserved_offset
      })
    })
  }

  /**
   * Submit a block to the network.
   *
   * @param {string} blob Block blob data
   * @param {Function} cb A callback after the block has been submitted
   * @return {void}
   */
  submitBlock (blob, cb) {
    this.client.request('submitblock', { blob }, (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null)
    })
  }

  /**
   * Check if outputs have been spent using the key image associated with the
   * output.
   *
   * @param {Array.string} keys An array of key images to check
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  getKeyImagesSpent (keys, cb) {
    request({
      url: `${this.host}/is_key_image_spent`,
      method: 'POST',
      json: { key_images: keys }
    }, (err, response, body) => {
      if (err) return cb(err)
      cb(null, body.spent_status)
    })
  }

  /**
   * Safely stop the daemon.
   *
   * @param {Function} cb A callback after the shutdown command has been sent
   * @return {void}
   */
  stop (cb) {
    request.post(`${this.host}/stop`, (err, response, body) => {
      if (err) return cb(err)
      cb(null)
    })
  }

  /**
   * Get miscellaneous information about the state of this daemon and the
   * network.
   *
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  getInfo (cb) {
    this.client.request('get_info', [], (err, response) => {
      if (err) return cb(err)
      if (response.error) return cb(response.error.message)

      return cb(null, response.result)
    })
  }

  /**
   * Checks if this daemon is running on the testnet, or the mainnet.
   *
   * @param {Function} cb A callback to recieve the result
   * @return {void}
   */
  isTestnet (cb) {
    this.getInfo((err, result) => {
      if (err) return cb(err)
      return cb(null, result.testnet)
    })
  }
}

module.exports = Daemon
