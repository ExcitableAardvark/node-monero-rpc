# node-monero-rpc
> node wrapper for monero daemon and wallet rpc

### Table of Contents

* [Installation](#installation)
* [Documentation](#documentation)
  * [Daemon API](#daemon-api)
    * [Initialisation](#initialisation)
    * [Methods](#methods)
      * [getLastBlockHeight(callback)](#getlastblockheightcallback)
      * [getLastBlockHeader(callback)](#getlastblockheadercallback)
      * [getBlockHeader(id, callback)](#getblockheaderid-callback)
      * [getBlock(id, callback)](#getblockid-callback)
      * [getBlockTemplate(address, reserved, callback)](#getblocktemplateaddress-reserved-callback)
      * [submitBlock(blob, callback)](#submitblockblob-callback)
      * [getKeyImagesSpent(keyImages, callback)](#getkeyimagesspentkeyimages-callback)
      * [stop(callback)](#stopcallback)
      * [getInfo(callback)](#getinfocallback)
      * [isTestnet(callback)](#istestnetcallback)
  * [Wallet API](#wallet-api)
    * [Warning](#warning)
    * [Initialisation](#initialisation-1)
    * [Methods](#methods-1)
      * [getAddress(callback)](#getaddresscallback)
      * [getBalance(callback)](#getbalancecallback)
      * [transfer(options, callback)](#transferoptions-callback)
      * [getPayments(callback)](#getpaymentspaymentid-callback)
      * [getRandomIntegratedAddress(callback)](#getrandomintegratedaddresscallback)
      * [getBulkPayments(paymentIds, height, callback)](#getbulkpaymentspaymentids-height-callback)
* [Testing](#testing)
* [Warning](#warning-1)
* [Projects using node-monero-rpc](#projects-using-node-monero-rpc)
* [License](#license)

### Installation

    npm install --save monero-rpc

### Documentation

#### Daemon API

##### Initialisation

Instantiate a new Daemon object:

```js
const Daemon = require('monero-rpc').Daemon

const daemon = new Daemon('http://localhost:18081')
const daemon = new Daemon('http://node.monero.hashvault.pro:18081') // or use a remote node
```

##### Methods

###### getLastBlockHeight(callback)

Look up how many blocks are in the longest chain known to the node.

```js
daemon.getLastBlockHeight((err, height) => {
    if (err) return console.log(err)
    console.log(height) // 993163
})
```

###### getLastBlockHeader(callback)

Look up how many blocks are in the longest chain known to the node.

```js
daemon.getLastBlockHeader((err, header) => {
    if (err) return console.log(err)
    console.log(header)
    /*
     * {
     *     "depth": 0,
     *     "difficulty": 746963928,
     *     "hash": "ac0f1e2262...",
     *     "height": 990793,
     *     "major_version": 1,
     *     "minor_version": 1,
     *     "nonce": 1550,
     *     "orphan_status": false,
     *     "prev_hash": "386575e3b0...",
     *     "reward": 6856609225169,
     *     "timestamp": 1457589942
     * }
     */
})
```

###### getBlockHeader(id, callback)

Block header information can be retrieved using either a block's hash or height.

By height:

```js
daemon.getBlockHeader(990793, (err, header) => {
    if (err) return console.log(err)
    console.log(header)
    /*
     * {
     *     "depth": 0,
     *     "difficulty": 746963928,
     *     "hash": "ac0f1e2262...",
     *     "height": 990793,
     *     "major_version": 1,
     *     "minor_version": 1,
     *     "nonce": 1550,
     *     "orphan_status": false,
     *     "prev_hash": "386575e3b0...",
     *     "reward": 6856609225169,
     *     "timestamp": 1457589942
     * }
     */
})
```

By hash:

```js
daemon.getBlockHeader('ac0f1e2262...', (err, header) => {
    if (err) return console.log(err)
    console.log(header)
    /*
     * {
     *     "depth": 0,
     *     "difficulty": 746963928,
     *     "hash": "ac0f1e2262...",
     *     "height": 990793,
     *     "major_version": 1,
     *     "minor_version": 1,
     *     "nonce": 1550,
     *     "orphan_status": false,
     *     "prev_hash": "386575e3b0...",
     *     "reward": 6856609225169,
     *     "timestamp": 1457589942
     * }
     */
})
```

###### getBlock(id, callback)

Full block information can be retrieved by either block height or hash, like with the block header calls.

```js
daemon.getBlock('ac0f1e2262...', (err, block) => {
    if (err) return console.log(err)
    console.log(block) // { ... }
})
```

###### getBlockTemplate(address, reserved, callback)

Get a new block template for mining.

```js
daemon.getBlockTemplate('46tFLJPaNyy...', 17, (err, template) => {
    if (err) return console.log(err)
    console.log(template) // { ... }
})
```

###### submitBlock(blob, callback)

Submit a block to the network.

```js
daemon.submitBlock('...', (err) => {
    if (err) return console.log(err)
    console.log('hurray') // 'hurray'
})
```

###### getKeyImagesSpent(keyImages, callback)

Check if a key image is spent.

```js
daemon.getKeyImagesSpent(['8d1bd818...', '7319134bf...'], (err, status) => {
    if (err) return console.log(err)
    console.log(status) // [1, 1]
})
```

###### stop(callback)

```js
daemon.stop((err) => {
    if (err) return console.log(err)
    console.log(':(') // ':('
})
```

###### getInfo(callback)
Get miscellaneous information about the state of this daemon and the network.

```js
daemon.getInfo((err, info) => {
    if (err) return console.log(err)
    console.log(info)
    /*
     * {
     *     "alt_blocks_count": 5,
     *     "difficulty": 972165250,
     *     "grey_peerlist_size": 2280,
     *     "height": 993145,
     *     "incoming_connections_count": 0,
     *     "outgoing_connections_count": 8,
     *     "status": "OK",
     *     "target": 60,
     *     "target_height": 993137,
     *     "testnet": false,
     *     "top_block_hash": "",
     *     "tx_count": 564287,
     *     "tx_pool_size": 45,
     *     "white_peerlist_size": 529
     * }
     */
})
```

###### isTestnet(callback)
Get miscellaneous information about the state of this daemon and the network.

```js
daemon.isTestnet((err, testnet) => {
    if (err) return console.log(err)
    console.log(testnet) // false
})
```

#### Wallet API

##### Warning

All amounts are in atomic units. **1 Monero is 1e12 atomic units.**

##### Initialisation

Start `monero-wallet-rpc`:

```bash
monero-wallet-rpc --wallet-file mywallet --rpc-bind-port 18082 --disable-rpc-login
```

Instantiate a new Wallet object:

```js
const Wallet = require('monero-rpc').Wallet
const wallet = new Wallet('http://localhost:18082')
```

##### Methods

###### getAddress(callback)

Get the wallet's address.

```js
wallet.getAddress((err, address) => {
    if (err) return console.log(err)
    console.log(address) // '46tFLJPaNyy...'
})
```

###### getBalance(callback)

Get the wallet's balance.

```js
wallet.getBalance((err, balance) => {
    if (err) return console.log(err)
    console.log(balance.total) // 140000000000
    console.log(balance.unlocked) // 50000000000
})
```

###### transfer(options, callback)

Send Monero.

```js
wallet.transfer({
    destinations: [
        { address: '48vegnn...', amount: 10000000 }
    ],
    mixin: 7, // default 7
    priority: 0 // default 0
}, (err, result) => {
    if (err) return console.log(err)
    console.log(result.fee) // 48958481211
    console.log(result.tx_hash) // '985180f46863...'
})
```

###### getPayments(paymentId, callback)

Get a list of incoming payments using a given payment id.

```js
wallet.getPayments('4279257e...', (err, payments) => {
    if (err) return console.log(err)
    console.log(payments)
    /*
     * [
     *     {
     *         "amount": 10350000000000,
     *         "block_height": 994327,
     *         "payment_id": "4279257e0a2...",
     *         "tx_hash": "c391089f5b1b02...",
     *         "unlock_time": 0
     *     }
     * ]
     */
})
```

###### getRandomIntegratedAddress(callback)

Generate a random integrated address.

```js
wallet.getRandomIntegratedAddress((err, result) => {
    if (err) return console.log(err)
    console.log(result.paymentId) // 'f89f4978b6304b7b'
    console.log(result.address) // '46tFLJPaNyy...'
})
```

###### getBulkPayments(paymentIds, height, callback)

Get a list of payments using a list of payment ids from a given height.

```js
wallet.getBulkPayments(['4279257e0a2...'], 990000, (err, result) => {
    if (err) return console.log(err)
    console.log(result)
    /*
     * [
     *     {
     *         "amount": 10350000000000,
     *         "block_height": 994327,
     *         "payment_id": "4279257e0a2...",
     *         "tx_hash": "c391089f5b1...",
     *         "unlock_time": 0
     *     }
     * ]
     */
})
```

### Testing

Code is linted with eslint and tested with Jest. Run `npm test` to lint and run
test suite.

### Warning

This library is not complete. This library probably has bugs. ~~This library
eats babies.~~ Don't use it unless you know what you're getting yourself into.
See the GitHub issues for a list of features which are missing.

### Projects using node-monero-rpc

Feel free to create a pull request to add your own project.

* [monerod_exporter](https://github.com/ExcitableAardvark/monerod_exporter) - Monerod Prometheus exporter

### License

Released under the 3-Clause BSD License. See `LICENSE` for more information.
