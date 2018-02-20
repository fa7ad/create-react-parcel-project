#!/usr/bin/env node
const path = require('path')
const sao = require('sao')
const cac = require('cac')
const chalk = require('chalk')
const update = require('update-notifier')

const cli = cac()

cli
  .command('*', 'Create a React app', (args, { ts }) => {
    if (args.length === 0) {
      return cli.showHelp()
    }

    const targetPath = path.resolve(args[0] || '.')
    console.log(`Creating a new React app in ${chalk.green(targetPath)}.`)
    return sao({
      template: `fa7ad/react-parcel-project#${ts ? 'typescript' : 'master'}`,
      targetPath
    })
  })
  .option('ts', {
    desc: 'Use typescript',
    alias: 'typescript',
    type: 'boolean',
    default: false
  })

update({ pkg: cli.pkg }).notify()

cli.parse()
