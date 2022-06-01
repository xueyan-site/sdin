import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpUglify from 'gulp-uglify'
import gulpCleanCss from 'gulp-clean-css'
import { pipeline } from 'utl/exec'
import type { ReactCSR } from 'pro/react-csr'

/**
 * 处理素材文件
 */
export async function handleAssets(project: ReactCSR) {
  const scrFilter = gulpFilter('**/*.js', { restore: true })
  const styFilter = gulpFilter('**/*.css', { restore: true })
  return pipeline(
    gulp.src('**/*', { cwd: project.astPub }),
    scrFilter,
    gulpUglify(),
    scrFilter.restore,
    styFilter,
    gulpCleanCss(),
    styFilter.restore,
    gulp.dest(project.astDist)
  )
}