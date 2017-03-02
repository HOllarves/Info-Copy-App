//Gulp core files
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    ngAnnotate = require('gulp-ng-annotate'),
    angularFilesort = require('gulp-angular-filesort'),
    inject = require('gulp-inject'),
    watch = require('gulp-watch'),
    filter = require('gulp-filter'),
    through = require('through2'),
    del = require('del'),
    shell = require('gulp-shell'),
    plumber = require('gulp-plumber')

//Application paths
const paths = {
    sass: ['app/**/*.scss'],
    js: ['app/**/*.js'],
    assets: ['app/assets/**/*'],
    templates: ['app/**/*.html', '!./app/index.html'],
    settings: ['settings'],
    build: 'build'
}

/*
 *
 *   EXPRESS
 *
 */

//Express related variables
const express = require('express'),
    lr = require('tiny-lr')(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    csvConverter = require('csvtojson'),
    auth = require('./server/routes/auth.js'),
    bodyParser = require('body-parser'),
    csvService = require('./server/services/csv.service.js'),
    livereload = require('gulp-livereload')


//Instantiating express server
const server = express()
server.set('port', (process.env.PORT || 3000))
server.use(express.static('./build'))
server.use(bodyParser.urlencoded({
    extended: false
}))

//Initializing passport
require('./server/routes/config/passport')(server)
//Initializing auth routes
server.use('/auth', auth)

//morgan
morgan('tiny')

//Serving express server
gulp.task('serve', ['build', 'watch', 'env-dev'], () => {
    server.listen(server.get('port'), () => {
        console.log('App running on port', server.get('port'))
    })
    // Database connection
     mongoose.connect('mongodb://info-admin:W5ssjwLbesAfL9Ku@ds113680.mlab.com:13680/heroku_shx5d6hm', function (err) {
         if (err) console.log(err)
         else console.log('Successfully conected to DB')
    })
})

/**
 * ROUTES
 * 
 */

server.use('/csv', csvService)

gulp.task("heroku:production", ['env-production', 'serve'], () => {
    console.log('Compiling app') // the task does not need to do anything.
})

gulp.task('default', ['sass', 'js'])

//Sass compiler
gulp.task('sass', (done) => {
    gulp.src('./app/app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./build/css/'))
        .pipe(nano())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.build + '/css/'))
        .pipe(livereload())
        .on('end', done)
})

//Index injector of dependency files
gulp.task('index', () => {
    gulp.src('./app/index.html')
        .pipe(
            inject(
                gulp.src(paths.js)
                .pipe(plumber())
                .pipe(angularFilesort()), {
                    relative: true
                }
            )
        )
        .pipe(gulp.dest(paths.build))
        .pipe(livereload())
})

function createCopyTasks(taskName, source, dest, customTaskCallback) {
    function baseCopyTask(extendBaseTaskCallback) {
        let myFilter = filter((file) => {
            return file.event === 'unlink'
        })

        let baseTask = gulp.src(source)

        if (extendBaseTaskCallback) {
            baseTask = extendBaseTaskCallback(baseTask)
        }

        if (customTaskCallback) {
            baseTask = customTaskCallback(baseTask)
        }

        baseTask.pipe(gulp.dest(dest))
            .pipe(myFilter)
            .pipe(through.obj(function (chunk, enc, cb) {
                del(chunk.path)
                cb(null, chunk)
            }))
    }

    gulp.task(taskName, () => {
        baseCopyTask()
    })

    gulp.task(taskName + "-watch", () => {
        baseCopyTask((task) => {
            return task.pipe(watch(source))
        })
    })
}

createCopyTasks('js', paths.js, paths.build, (task) => {
    return task
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(livereload())
})

//Compiling assets
createCopyTasks('assets', paths.assets, paths.build + "/assets")
createCopyTasks('favicon', 'app/*.png', paths.build)

//Templates
createCopyTasks('templates', paths.templates, paths.build)

//Build task
gulp.task('build', ['sass', 'js', 'assets', 'favicon', 'templates', 'index'])

console.log('fuck')

//Watch for changes in scripts, sass files and templates
gulp.task('watch', ['js-watch', 'assets-watch', 'templates-watch'], () => {
    gulp.watch(paths.sass, ['sass'])
    gulp.watch(paths.js.concat(['./app/index.html']), ['index'])
    livereload.listen({
        start: true
    });
})

//Dependency installer
gulp.task('install', shell.task(['bower install']))

//Clean build directory
gulp.task('clean', () => {
    del.sync([paths.build + '/**', '!' + paths.build, '!' + paths.build + '/lib/**'])
})

//Setting environment to development
gulp.task('env-dev', () => {
    gulp.src(paths.settings + '/settings.dev.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
    console.log('launching in development mode')
})

//Setting environment to staging
gulp.task('env-staging', () => {
    gulp.src(paths.settings + '/settings.staging.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
    console.log('launching in staging mode')
})

//Setting environment to production
gulp.task('env-production', () => {
    gulp.src(paths.settings + '/settings.production.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
    console.log('launching in production mode')
})