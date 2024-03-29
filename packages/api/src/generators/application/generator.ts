import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit'
import * as path from 'path'
import { ApplicationGeneratorSchema } from './schema'
import { applicationGenerator } from '@nrwl/nest'

interface NormalizedSchema extends ApplicationGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(host: Tree, options: ApplicationGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(host).libsDir}/${projectDirectory}`
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : []

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  }
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  }
  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions)
}

export default async function (host: Tree, options: ApplicationGeneratorSchema) {
  // if (options.type !== ApplicationType.nest) {
  //   throw new Error(`Unknown type ${options.type}`)
  // }
  const normalizedOptions = normalizeOptions(host, options)
  applicationGenerator({
    name: normalizedOptions.projectName,
  })

  addFiles(host, normalizedOptions)
  await formatFiles(host)
}
