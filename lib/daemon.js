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
   * @returns {Promise.<number>} count
   */
  getLastBlockHeight () {
    return new Promise((resolve, reject) => {
      this.client.request('getblockcount', [], (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result.count)
      })
    })
  }

  /**
   * Block header information for the most recent block is easily retrieved with
   * this method.
   *
   * @returns {Promise.<Object>} block header
   */
  getLastBlockHeader () {
    return new Promise((resolve, reject) => {
      this.client.request('getlastblockheader', [], (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result.block_header)
      })
    })
  }

  /**
   * Block header information can be retrieved using either a block's hash or
   * height.
   *
   * @param {number|string} id A block height or block hash
   * @returns {Promise.<Object>} block header
   */
  getBlockHeader (id) {
    return new Promise((resolve, reject) => {
      if (typeof id === 'number') {
        this.client.request('getblockheaderbyheight', { height: id }, (err, response) => {
          if (err) return reject(err)
          if (response.error) return reject(new Error(response.error.message))

          return resolve(response.result.block_header)
        })
      } else if (typeof id === 'string') {
        this.client.request('getblockheaderbyhash', { hash: id }, (err, response) => {
          if (err) return reject(err)
          if (response.error) return reject(new Error(response.error.message))

          return resolve(response.result.block_header)
        })
      } else {
        return reject(new Error('id must be of type number or string'))
      }
    })
  }

  /**
   * Full block information can be retrieved by either block height or hash,
   * like with the block header calls.
   *
   * @param  {number|string} id A block height or block hash
   * @return {Promise.<Object>} block
   */
  getBlock (id) {
    return new Promise((resolve, reject) => {
      if (typeof id !== 'number' && typeof id !== 'string') {
        return reject(new Error('id must be of type number or string'))
      }

      const params = typeof id === 'number' ? { height: id } : { hash: id }

      this.client.request('getblock', params, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        const result = response.result
        return resolve({
          blob: result.blob,
          body: result.json,
          header: result.block_header
        })
      })
    })
  }

  /**
   * Get a new block template for mining.
   *
   * @param {string} address Address of wallet to receive coinbase transaction
   * @param {number} reserved Reserve size
   * @return {Promise.<Object>} block template
   */
  getBlockTemplate (address, reserved) {
    return new Promise((resolve, reject) => {
      const params = {
        wallet_address: address,
        reserve_size: reserved
      }

      this.client.request('getblocktemplate', params, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        const result = response.result
        return resolve({
          blob: result.blocktemplate_blob,
          difficulty: result.difficulty,
          height: result.height,
          previous: result.prev_hash,
          offset: result.reserved_offset
        })
      })
    })
  }

  /**
   * Submit a block to the network.
   *
   * @param {string} blob Block blob data
   * @return {Promise.<Object>} result
   */
  submitBlock (blob) {
    return new Promise((resolve, reject) => {
      this.client.request('submitblock', { blob }, (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))
        return resolve(response.result)
      })
    })
  }

  /**
   * Check if outputs have been spent using the key image associated with the
   * output.
   *
   * @param {Array.string} keys An array of key images to check
   * @return {Promise} result
   */
  getKeyImagesSpent (keys) {
    return new Promise((resolve, reject) => {
      request({
        url: `${this.host}/is_key_image_spent`,
        method: 'POST',
        json: { key_images: keys }
      }, (err, response, body) => {
        if (err) return reject(err)
        resolve(body.spent_status)
      })
    })
  }

  /**
   * Safely stop the daemon.
   *
   * @return {Promise} null
   */
  stop () {
    return new Promise((resolve, reject) => {
      request.post(`${this.host}/stop`, (err, response, body) => {
        if (err) return reject(err)
        resolve(null)
      })
    })
  }

  /**
   * Get miscellaneous information about the state of this daemon and the
   * network.
   *
   * @return {Promise.<Object>} result
   */
  getInfo () {
    return new Promise((resolve, reject) => {
      this.client.request('get_info', [], (err, response) => {
        if (err) return reject(err)
        if (response.error) return reject(new Error(response.error.message))

        return resolve(response.result)
      })
    })
  }

  /**
   * Checks if this daemon is running on the testnet, or the mainnet.
   *
   * @return {Promise.<Boolean>} result
   */
  isTestnet () {
    return this.getInfo()
      .then(({ testnet }) => testnet)
  }
}

module.exports = Daemon
