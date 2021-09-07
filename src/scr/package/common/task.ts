import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpTs, { reporter } from 'gulp-typescript'
import gulpUglify from 'gulp-uglify'
import gulpFilter from 'gulp-filter'
import { pipeline } from 'utl/exec'
import { withCache } from 'utl/read'
import { getBabelOptions } from './babel'
import type Package from 'pro/package'
import type { Project as TSProject } from 'gulp-typescript'
import type { FileFunction as FilterFunc } from 'gulp-filter'

/**
 * 编译项目（CLI运行的总实现）
 * @returns 耗时（ms）
 */
export async function compile(project: Package, filter?: FilterFunc): Promise<number> {
  const startTime = Date.now()
  await handleDefine(project, filter)
  await Promise.all<void>([
    handleAssets(project,filter),
    handleTypes(project)
  ])
  await Promise.all<void>([
    handleScript(project, 'web', filter),
    handleScript(project, 'node', filter)
  ])
  return Date.now() - startTime
}

/**
 * 处理素材文件（非脚本文件）
 */
export function handleAssets(project: Package, filter?: FilterFunc) {
  if (!project.buildWeb && !project.buildNode) {
    return
  }
  const SCRIPT_EXP = /\.[tj]sx?$/
  return pipeline(
    gulp.src('**/*', { cwd: project.src }),
    gulpFilter(file => {
      if (filter && !filter(file)) {
        return false
      }
      return !SCRIPT_EXP.test(file.path)
    }),
    project.buildWeb && gulp.dest(project.webDist),
    project.buildNode && gulp.dest(project.nodeDist)
  )
}

/**
 * 处理定义文件
 */
export function handleDefine(project: Package, filter?: FilterFunc) {
  if (!project.buildTypes) {
    return
  }
  return pipeline(
    gulp.src(['**/*.d.ts', '**/*.d.tsx'], { cwd: project.src }),
    filter && gulpFilter(filter),
    gulp.dest(project.defDist)
  )
}

/**
 * 获取TSProject实例
 */
const getTsProject = withCache<Package, TSProject>(project => {
  return gulpTs.createProject(project.tsc, {
    declaration: true,
    removeComments: false
  })
})

/**
 * 构建类型文件
 */
export function handleTypes(project: Package) {
  if (!project.buildTypes) {
    return
  }
  const tsProject = getTsProject(project)
  return pipeline(
    tsProject.src(),
    tsProject(reporter.fullReporter()),
    ts => ts.dts,
    gulp.dest(project.defDist)
  )
}

/**
 * 处理脚本文件
 * @param target 构建的目标类型
 */
export function handleScript(
  project: Package,
  target: 'web' | 'node',
  filter?: FilterFunc
) {
  if ((!project.buildWeb && target === 'web') || (!project.buildNode && target === 'node')) {
    return
  }
  const SCRIPT_EXP = /\.[tj]sx?$/
  const DEFINE_EXP = /\.d\.tsx?$/
  const TEST_EXP = /\.test\./
  return pipeline(
    gulp.src('**/*', { cwd: project.src }),
    gulpFilter(file => {
      if (filter && !filter(file)) {
        return false
      }
      return SCRIPT_EXP.test(file.path) 
        && !DEFINE_EXP.test(file.path)
        && !TEST_EXP.test(file.path)
    }),
    gulpBabel(getBabelOptions(project, target)),
    project.useUglify && gulpUglify({
      mangle: {
        toplevel: true
      }
    }),
    gulp.dest(
      target === 'web'
        ? project.webDist
        : project.nodeDist
    )
  )
}