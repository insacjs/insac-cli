const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (modelName, options) {
  logger.appTitle('Adicionando modelo')
  options.modelName = modelName
  await parseArgs(options)

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const MODEL_PATH     = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/models/${options.modelName}.model.js`)
  const DAO_PATH       = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/dao/${options.modelName}.dao.js`)
  const FIELDS         = options.fields ? options.fields.split(',') : []

  if (options.force) {
    if (util.isFile(MODEL_PATH)) { cli.removeFile(MODEL_PATH) }
    if (util.isFile(DAO_PATH))   { cli.removeFile(DAO_PATH) }
  }
  if (util.isFile(MODEL_PATH)) {
    throw new Error(`Ya existe el modelo '${options.modelName}'.`)
  }
  if (util.isFile(DAO_PATH)) {
    throw new Error(`Ya existe el dao '${options.modelName}'.`)
  }

  const data = { moduleName: MODULE_NAME, modelName: options.modelName, fields: FIELDS, example: options.example }
  let modelContent = require(path.resolve(__dirname, '../templates/example.model.js'))(data)
  let daoContent   = require(path.resolve(__dirname, '../templates/example.dao.js'))(data)

  cli.writeFile(MODEL_PATH, modelContent)
  if (!util.isFile(DAO_PATH)) { cli.writeFile(DAO_PATH, daoContent) }

  logger.appSuccess()
  logger.appSuccess(`Modelo`, options.modelName, 'adicionado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  options.force     = options.force   === true
  options.example   = options.example === true
  options.modelName = options.modelName.toLowerCase()
  if (!options.module) {
    if (config.modules.length !== 1) {
      throw new Error(`Se requiere el nombre del módulo.`)
    }
    options.module = config.modules[0].fileName
  } else {
    if (!util.toArray(config.modules, 'fileName').includes(options.module)) {
      throw new Error(`No existe el módulo '${options.module}'`)
    }
  }
}
