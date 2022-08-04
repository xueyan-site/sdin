import { copyProject } from '../project/create'
import { downloadModules } from '../utils/package'
import { createGitRepository } from '../utils/git'

export interface CreateReactCSRProps {
  source: string
  target: string
  name: string
  version: string
  author: string
  authorName: string
  authorEmail: string
}

export async function createReactCSR({
  source,
  target,
  ...scope
}: CreateReactCSRProps) {
  await copyProject(source, target, scope)
  downloadModules(target)
  createGitRepository(target)
}
