#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2), {
  unknown(arg) {
    if (arg == '-n') return true
    if (!arg.startsWith('-')) return true
    const version = require('./package').version
    console.log(`duffy v${version}`)
    if (arg == '--version') process.exit()
    console.log('https://npm.im/duffy')
    console.log('Rapidly find the largest files in a given directory.')
    console.log('Usage: duffy <directory> [-n <limit>]')
    if (arg == '--help' || arg == '-h') process.exit()
    process.exit(1)
  },
})

const bytes = require('bytes')
const { spawn } = require('child_process')
const diffy = require('diffy')()
const level = require('level-mem')
const pad = require('pad')
const split = require('split')
const uint64be = require('uint64be')

let drawn = 0
let wanted = 0
let ended = false
let view = ''

diffy.render(() => view)

function update(data, wanted) {
  view =
    data
      // Tabs mess up diffy, so we just use spaces instead
      .map(([size, path]) => pad(bytes.format(size * 1024), 10) + path)
      // Wrapping also messes up diffy (even though it shouldn't) so we truncate
      .map(line => line.slice(0, diffy.width - 1))
      .join('\n') + '\n'
  diffy.render()
  drawn = wanted
}

const db = level('', {
  keyEncoding: {
    encode([size, path]) {
      const sizeBuf = uint64be.encode(size)
      const pathBuf = Buffer.from(path, 'utf8')
      return Buffer.concat([sizeBuf, pathBuf])
    },
    decode(buf) {
      const size = uint64be.decode(buf, 0)
      const path = buf.toString('utf8', uint64be.decode.bytes)
      return [size, path]
    },
  },
})

spawn('du', ['-ak', ...argv._])
  .stdout.pipe(split('\n'))
  .on('data', line => {
    const entry = line.split('\t')
    if (entry.length != 2) return
    const [size, path] = entry
    db.put([+size, path], null, err => {
      if (err) throw err
      wanted++
    })
  })
  .on('end', () => {
    wanted++
    ended = true
  })

setInterval(() => {
  if (wanted == drawn) {
    if (ended) process.exit()
    return
  }
  let tick = wanted
  collect(
    db.createKeyStream({
      limit: Number(argv.n) || diffy.height - 2,
      reverse: true,
    }),
    data => update(data, tick)
  )
}, 1000 / 60)

function collect(stream, cb) {
  const array = []
  stream
    .on('data', data => {
      array.push(data)
    })
    .on('end', () => {
      cb(array)
    })
}
