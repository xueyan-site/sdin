import { resolve } from 'path'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpTs from 'gulp-typescript'
import gulpUglify from 'gulp-uglify'
import gulpFilter from 'gulp-filter'
import { pipeline } from '../utils/stream'
import { getBabelOptions } from './babel'
import type { FileFunction as FilterFunc } from 'gulp-filter'
import type { PackageProjectConfig } from './project'

/**
 * 编译项目（CLI运行的总实现）
 * @returns 耗时（ms）
 */
export async function compilePackage(
  root: string,
  cfg: PackageProjectConfig,
  filter?: FilterFunc
): Promise<number> {
  const startTime = Date.now()
  if (cfg.buildTypes) {
    await handleDefine(root, filter)
  }
  await Promise.all<void>([
    handleAssets(root, cfg, filter),
    cfg.buildTypes ? handleTypes(root) : undefined,
  ])
  await Promise.all<void>([
    cfg.buildWeb ? handleScript(root, cfg, 'web', filter) : undefined,
    cfg.buildNode ? handleScript(root, cfg, 'node', filter) : undefined
  ])
  return Date.now() - startTime
}

/**
 * 处理定义文件
 */
function handleDefine(
  root: string,
  filter?: FilterFunc
) {
  return pipeline(
    gulp.src(['**/*.d.ts', '**/*.d.tsx'], { cwd: resolve(root, 'src') }),
    filter && gulpFilter(filter),
    gulp.dest(resolve(root, 'dist/def'))
  )
}

/**
 * 处理素材文件（非脚本文件）
 */
function handleAssets(
  root: string,
  cfg: PackageProjectConfig,
  filter?: FilterFunc
) {
  const SCRIPT_EXP = /\.[tj]sx?$/
  return pipeline(
    gulp.src('**/*', { cwd: resolve(root, 'src') }),
    gulpFilter(file => {
      if (filter && !filter(file)) {
        return false
      }
      return !SCRIPT_EXP.test(file.path)
    }),
    cfg.buildWeb && gulp.dest(resolve(root, 'dist/web')),
    cfg.buildNode && gulp.dest(resolve(root, 'dist/node'))
  )
}

/**
 * 构建类型文件
 */
function handleTypes(root: string) {
  const tsProject = gulpTs.createProject(resolve(root, 'tsconfig.json'), {
    declaration: true,
    removeComments: false
  })
  const tsstream: NodeJS.ReadWriteStream = tsProject({
    error: (err) => {
      tsstream.emit('error', err.stack || err.message)
    }
  })
  return pipeline(
    tsProject.src(),
    tsstream,
    (ts: any) => ts.dts,
    gulp.dest(resolve(root, 'dist/def'))
  )
}

/**
 * 构建脚本文件
 */
function handleScript(
  root: string,
  cfg: PackageProjectConfig,
  target: 'web' | 'node',
  filter?: FilterFunc
) {
  const SCRIPT_EXP = /\.[tj]sx?$/
  const DEFINE_EXP = /\.d\.tsx?$/
  const TEST_EXP = /\.test\./
  return pipeline(
    gulp.src('**/*', { cwd: resolve(root, 'src') }),
    gulpFilter(file => {
      if (filter && !filter(file)) {
        return false
      }
      return SCRIPT_EXP.test(file.path) 
        && !DEFINE_EXP.test(file.path)
        && !TEST_EXP.test(file.path)
    }),
    gulpBabel(getBabelOptions(root, cfg, target)),
    cfg.useUglify && gulpUglify({
      mangle: {
        toplevel: true
      }
    }),
    gulp.dest(resolve(root, target === 'web' ? 'dist/web' : 'dist/node'))
  )
}
