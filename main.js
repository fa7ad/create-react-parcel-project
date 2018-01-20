#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const yargs = require('yargs')
const online = require('is-online')
const { promise: ora } = require('ora')
const kebab = require('lodash.kebabcase')
const isYarn = require('@danielbayerlein/caniuse-yarn')()
const { argv: { name } } = yargs
  .command(
    ['create <name>', '$0 <name>'],
    'Create a new React + Parcel project',
    y => y.positional('name', { describe: 'project name', type: 'string' })
  )
  .help()

const getStarted = yarn =>
  `To start:
  cd ${name}
  ${yarn ? 'yarn' : 'npm'} start
`

const projDir = path.resolve(name)
const tempDir = path.resolve('react-parcel-project-master')

const downloadAndExtract = online => {
  if (online) {
    const dl = require('download')
    return dl('https://git.io/vNgqK', '.', { extract: true })
  }
  const dc = require('decompress')
  return dc(path.resolve(__dirname, 'assets/master.tar.gz'), '.')
}
const renameFolder = (from, to) => fs.move(from, to, { overwrite: true })
const renameProj = dir => {
  const file = path.join(dir, 'package.json')
  const pkg = Object.assign({}, require(file), {
    name: kebab(name),
    author: '',
    repository: ''
  })
  return fs.writeJSON(file, pkg, { spaces: 4 })
}

async function run (dir, temp, yarn = false) {
  const text = 'Getting boilerplate'
  const spin = ora(
    downloadAndExtract(await online())
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
        console.log(box(getStarted(yarn), { padding: 5 }))
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
