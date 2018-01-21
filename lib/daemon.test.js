/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

/* eslint-env jest */

const Daemon = require('./daemon')

const daemon = new Daemon('http://node.monero.hashvault.pro:18081')

test('getLastBlockHeight returns a number', done => {
  daemon.getLastBlockHeight((err, height) => {
    if (err) done(err)
    expect(height).toBeGreaterThan(0)
    done()
  })
})

test('getLastBlockHeader returns something', done => {
  daemon.getLastBlockHeader((err, header) => {
    if (err) done(err)
    expect(header).toBeDefined()
    done()
  })
})

test('getBlockHeader returns something when passed a height', done => {
  daemon.getBlockHeader(1491204, (err, header) => {
    if (err) done(err)
    expect(header).toBeDefined()
    done()
  })
})

test('getBlockHeader returns something when passed a hash', done => {
  daemon.getBlockHeader('01928cbece02865ec587a7bce8401bd63bb79c8696b012580928282bd91f8b1b', (err, header) => {
    if (err) done(err)
    expect(header).toBeDefined()
    done()
  })
})

test('getBlockHeader throws an exception when an invalid parameter is passed', done => {
  daemon.getBlock({ wow: 5 }, (err, block) => {
    expect(err).toContain('number or string')
    done()
  })
})

test('getBlock returns something when passed a valid height', done => {
  daemon.getBlock(1491204, (err, header) => {
    if (err) done(err)
    expect(header).toBeDefined()
    done()
  })
})

test('getBlock fails when passed an invalid height (too big)', done => {
  daemon.getBlock(91491204, (err, block) => {
    expect(err).toContain('height')
    done()
  })
})

test('getBlock fails when passed an invalid height (too small)', done => {
  daemon.getBlock(-1, (err, block) => {
    expect(err).toContain('Invalid params')
    done()
  })
})

test('getBlock returns something when passed a valid hash', done => {
  daemon.getBlock('01928cbece02865ec587a7bce8401bd63bb79c8696b012580928282bd91f8b1b', (err, block) => {
    if (err) done(err)
    expect(block).toBeDefined()
    done()
  })
})

test('getBlock throws an exception when an invalid parameter is passed', done => {
  daemon.getBlock({ wow: 5 }, (err, block) => {
    expect(err).toContain('number or string')
    done()
  })
})

test('getKeyImagesSpent returns an array of one', done => {
  daemon.getKeyImagesSpent(['923ff0ae2b7a3407a1acc1fb67790fd9276e4e7b7ee968c8d56d14e1abee7c47'], (err, result) => {
    if (err) return done(err)
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(1)
    done()
  })
})

test('getKeyImagesSpent returns an array of many', done => {
  daemon.getKeyImagesSpent(['923ff0ae2b7a3407a1acc1fb67790fd9276e4e7b7ee968c8d56d14e1abee7c47',
    'e941fe8fadc934035b9ebc49d242c55488b17f0aa0ea67f68ba0e14f60c05320',
    '3a29a2c6c67aeecf8f74a2928f1a3ba6c97c94267dd7d6d1ce753143c42be43b'], (err, result) => {
    if (err) return done(err)
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(3)
    done()
  })
})
