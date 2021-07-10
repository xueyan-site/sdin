import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpCleanCss from 'gulp-clean-css'
import gulpUglify from 'gulp-uglify'
import gulpFilter from 'gulp-filter'
import ReactCSR from 'pro/react-csr'
import { pipeline } from 'utl/exec'
import { cmdNmPath } from 'utl/path'

/**
 * 处理素材文件
 */
export async function handleAssets(project: ReactCSR) {
  const scrFilter = gulpFilter('**/*.js', { restore: true })
  const styFilter = gulpFilter('**/*.css', { restore: true })
  return pipeline(
    gulp.src('**/*', { cwd: project.withPub('ast') }),
    scrFilter,
    gulpBabel({
      presets: [cmdNmPath('@babel/preset-env')],
      plugins: [
        cmdNmPath('@babel/plugin-transform-runtime'),
        cmdNmPath('@babel/plugin-proposal-class-properties')
      ]
    }),
    gulpUglify(),
    scrFilter.restore,
    styFilter,
    gulpCleanCss(),
    styFilter.restore,
    gulp.dest(project.astDist)
  )
}