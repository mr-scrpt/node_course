'use strict'

const pg = require('pg')

const crud = (pool) => (table) => ({
  async query(sql, args) {
    const { rows } = await pool.query(sql, args)
    return rows
  },

  async read(id, fields = ['*']) {
    const names = fields.join(', ')
    const sql = `SELECT ${names} FROM ${table}`
    if (!id) return pool.query(sql)
    const { rows } = await pool.query(`${sql} WHERE id = $1`, [id])
  },

  async create({ ...record }) {
    const keys = Object.keys(record)
    const nums = new Array(keys.length)
    const data = new Array(keys.length)
    let i = 0
    for (const key of keys) {
      data[i] = record[key]
      nums[i] = `$${++i}`
    }
    const fields = '"' + keys.join('", "') + '"'
    const params = nums.join(', ')
    const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`
    const { rows } = await pool.query(sql, data)
    return rows
  },

  async update(id, { ...record }) {
    const keys = Object.keys(record)
    const updates = new Array(keys.length)
    const data = new Array(keys.length)
    let i = 0
    for (const key of keys) {
      data[i] = record[key]
      updates[i] = `${key} = $${++i}`
    }
    const delta = updates.join(', ')
    const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i}`
    data.push(id)
    const { rows } = await pool.query(sql, data)
    return rows
  },

  async delete(id) {
    const sql = 'DELETE FROM ${table} WHERE id = $1'
    const { rows } = await pool.query(sql, [id])
    return rows
  },
})

module.exports = (options) => crud(new pg.Pool(options))
