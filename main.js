#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const yargs = require('yargs')
const online = require('is-online')
const { promise: ora } = require('ora')
const kebab = require('lodash.kebabcase')
const isYarn = require('@danielbayerlein/caniuse-yarn')()
const { argv: { name, ts } } = yargs
  .command(
    ['create <name>', '$0 <name>'],
    'Create a new React + Parcel project',
    y => y.positional('name', { describe: 'project name', type: 'string' })
  )
  .options('ts', {
    alias: 'typescript',
    type: 'boolean',
    default: false,
    describe: 'use typescript'
  })
  .help()

const getStarted = yarn =>
  `To start:

cd ${name}
${yarn ? 'yarn' : 'npm'} start
`

const link = ts ? 'https://git.io/vNApC' : 'https://git.io/vNgqK'
const branchName = ts ? 'typescript' : 'master'

const projDir = path.resolve(name)
const tempDir = path.resolve('react-parcel-project-' + branchName)

const downloadAndExtract = (archive, url, online) => {
  if (online) {
    const dl = require('download')
    return dl(url, '.', { extract: true })
  }
  const dc = require('decompress')
  return dc(path.resolve(__dirname, `assets/${archive}.tar.gz`), '.')
}
const renameFolder = (from, to) => fs.move(from, to, { overwrite: true })
const renameProj = dir => {
  const file = path.join(dir, 'package.json')
  const pkg = Object.assign({}, require(file), {
    name: kebab(name)
  })
  return fs.writeJSON(file, pkg, { spaces: 4 })
}

async function run (dir, temp, yarn = false) {
  const text = 'Getting boilerplate'
  const spin = ora(
    downloadAndExtract(branchName, link, await online())
      .then(_ => renameFolder(temp, dir))
      .then(_ => {
        spin.text = 'Renaming boilerplate'
        return renameProj(dir)
      })
      .then(_ => {
        spin.text = 'Entering personal info'
        return execa(yarn ? 'yarn' : 'npm', ['init', '-y'], { cwd: dir })
      })
      .then(_ => {
        spin.text = 'Installing packages'
        return execa(yarn ? 'yarn' : 'npm', ['install'], { cwd: dir })
      })
      .then(_ => {
        const box = require('boxen')
        console.log('\n\n')
        console.log(box(getStarted(yarn), { padding: 2 }))
      })
      .then(_ => {
        spin.text = 'Done!'
      })
      .catch(console.error),
    {
      spinner: 'clock',
      text
    }
  )
}

run(projDir, tempDir, isYarn)
