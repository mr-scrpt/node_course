'use strict'

const fs = require('node:fs')
const util = require('node:util')
const path = require('node:path')

const DATETIME_LENGTH = 19

class Logger {
  constructor({ pathToLogFolder, colors, util }) {
    this.path = pathToLogFolder
    const date = new Date().toISOString().substring(0, 10)
    const filePath = path.join(pathToLogFolder, `${date}.log`)
    this.stream = fs.createWriteStream(filePath, { flags: 'a' })
    this.regexp = new RegExp(path.dirname(this.path), 'g')
    this.colors = colors
    this.logger = require(`./${util}.js`)
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve))
  }

  write(type = 'info', s) {
    const now = new Date().toISOString()
    const date = now.substring(0, DATETIME_LENGTH)
    const color = this.colors[type]
    const line = date + '\t' + s
    this.logger.log(color + line + '\x1b[0m')
    const out = line.replace(/[\n\r]\s*/g, '; ') + '\n'
    this.logger.log('in write ', out)
    this.stream.write(out)
  }

  log(...args) {
    const msg = util.format(...args)
    this.write('info', msg)
  }

  dir(...args) {
    const msg = util.inspect(...args)
    this.write('info', msg)
  }

  debug(...args) {
    const msg = util.format(...args)
    this.write('debug', msg)
  }

  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n')
    this.write('error', msg.replace(this.regexp, ''))
  }

  system(...args) {
    const msg = util.format(...args)
    this.write('system', msg)
  }

  access(...args) {
    const msg = util.format(...args)
    this.write('access', msg)
  }
}

module.exports = (options) => new Logger(options)
