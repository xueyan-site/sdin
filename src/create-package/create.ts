import { resolve } from 'path'
import { copyProject } from '../project/create'
import { downloadModules } from '../utils/package'
import { createGitRepository } from '../utils/git'

export interface CreatePackageProps {
  source: string
  target: string
  name: string
  version: string
  author: string
  authorName: string
  authorEmail: string
}

export async function createPackage({
  source,
  target,
  ...scope
}: CreatePackageProps) {
  await copyProject(source, target, scope)
  downloadModules(target)
  downloadModules(resolve(target, 'doc'))
  createGitRepository(target)
}
