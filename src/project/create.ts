import { existsSync } from 'fs-extra'
import { printExit, printTask } from '../utils/console'
import { deepCopy, getReplaceHandler } from '../utils/write'

export function copyProject(
  source: string,
  target: string,
  scope: Record<string, any>
): Promise<void> {
  if (existsSync(target)) {
    return printExit('project already exists in ' + target)
  }
  return printTask({
    color: true,
    info: `copy project to ${target}`,
    failed: `project cope to ${target} failed`,
    success: `project copied to ${target} successfully`,
    task: () => {
      return deepCopy(
        source,
        target,
        getReplaceHandler(scope),
        undefined,

      )
    }
  })
}
