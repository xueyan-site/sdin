import { resolve } from 'path'
import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpUglify from 'gulp-uglify'
import gulpCleanCss from 'gulp-clean-css'
import { pipeline } from '../utils/stream'

/**
 * 处理素材文件
 */
export function handleAssets(root: string) {
  const scrFilter = gulpFilter('**/*.js', { restore: true })
  const styFilter = gulpFilter('**/*.css', { restore: true })
  return pipeline(
    gulp.src('**/*', { cwd: resolve(root, 'pub/ast') }),
    scrFilter,
    gulpUglify(),
    scrFilter.restore,
    styFilter,
    gulpCleanCss(),
    styFilter.restore,
    gulp.dest(resolve(root, 'dist/ast'))
  )
}
