/*
 * Copyright 2018 Excitable Aardvark <excitableaardvark@tutanota.de>
 *
 * Licensed under the 3-Clause BSD license. See LICENSE in the project root for
 * more information.
 */

/* eslint-env jest */

const Daemon = require('./daemon')

const daemon = new Daemon('http://node.monero.hashvault.pro:18081')

test('getLastBlockHeight returns a number', () => {
  return expect(daemon.getLastBlockHeight()).resolves.toBeGreaterThan(0)
})

test('getLastBlockHeader returns something', () => {
  return expect(daemon.getLastBlockHeader()).resolves.toBeDefined()
})

test('getBlockHeader returns something when passed a height', () => {
  return expect(daemon.getBlockHeader(1491204)).resolves.toBeDefined()
})

test('getBlockHeader returns something when passed a hash', () => {
  return expect(daemon.getBlockHeader('01928cbece02865ec587a7bce8401bd63bb79c8696b012580928282bd91f8b1b')).resolves.toBeDefined()
})

test('getBlockHeader throws an exception when an invalid parameter is passed', () => {
  return expect(daemon.getBlockHeader({ wow: 5 })).rejects.toBeInstanceOf(Error)
})

test('getBlock returns something when passed a valid height', () => {
  return expect(daemon.getBlock(1491204)).resolves.toBeDefined()
})

test('getBlock fails when passed an invalid height (too big)', () => {
  return expect(daemon.getBlock(91491204)).rejects.toBeInstanceOf(Error)
})

test('getBlock fails when passed an invalid height (too small)', () => {
  return expect(daemon.getBlock(-1)).rejects.toBeInstanceOf(Error)
})

test('getBlock returns something when passed a valid hash', () => {
  return expect(daemon.getBlock('01928cbece02865ec587a7bce8401bd63bb79c8696b012580928282bd91f8b1b')).resolves.toBeDefined()
})

test('getBlock throws an exception when an invalid parameter is passed', () => {
  return expect(daemon.getBlock({ wow: 5 })).rejects.toBeInstanceOf(Error)
})

test('getKeyImagesSpent returns an array of one', done => {
  daemon.getKeyImagesSpent(['923ff0ae2b7a3407a1acc1fb67790fd9276e4e7b7ee968c8d56d14e1abee7c47'])
    .then(result => {
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(1)
      done()
    })
    .catch(err => done(err))
})

test('getKeyImagesSpent returns an array of many', done => {
  daemon.getKeyImagesSpent(['923ff0ae2b7a3407a1acc1fb67790fd9276e4e7b7ee968c8d56d14e1abee7c47',
    'e941fe8fadc934035b9ebc49d242c55488b17f0aa0ea67f68ba0e14f60c05320',
    '3a29a2c6c67aeecf8f74a2928f1a3ba6c97c94267dd7d6d1ce753143c42be43b'])
    .then(result => {
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(3)
      done()
    })
    .catch(err => done(err))
})

test('getInfo returns something', () => {
  return expect(daemon.getInfo()).resolves.toBeDefined()
})

test('isTestnet returns a boolean', () => {
  return expect(daemon.isTestnet()).resolves.toBeDefined()
})
