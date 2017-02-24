//Gulp core files
var gulp = require('gulp'),
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
var paths = {
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
var express = require('express'),
    lr = require('tiny-lr'),
    morgan = require('morgan'),
    lrserver = lr(),
    mongoose = require('mongoose'),
    csvConverter = require('csvtojson'),
    bodyParser = require('body-parser'),
    csvService = require('./csv-service/service')


//Instantiating express server
var server = express()
server.set('port', (process.env.PORT || 3000))
server.use(express.static('./build'))
server.use(bodyParser.urlencoded({
    extended: false
}))

//morgan
morgan('tiny')

//Serving express server
gulp.task('serve', ['build', 'watch', 'env-production'], function () {
    server.listen(server.get('port'), function () {
        console.log('App running on port', server.get('port'))
    })
    // mongoose.connect('mongodb://lv-user:testing@ds143737.mlab.com:43737/heroku_9fvbqpbv', function (err) {
    //     if (err) console.log(err)
    //     else console.log('Successfully conected to DB')
    // })
})


/**
 * ROUTES
 * 
 */

server.use('/csv', csvService)


gulp.task("heroku:production", ['env-production', 'serve'], function () {
    console.log('Compiling app') // the task does not need to do anything.
})

gulp.task('default', ['sass', 'js'])

//Sass compiler
gulp.task('sass', function (done) {
    gulp.src('./app/app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./build/css/'))
        .pipe(nano())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.build + '/css/'))
        .on('end', done)
})

//Index injector of dependency files
gulp.task('index', function () {
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
})

function createCopyTasks(taskName, source, dest, customTaskCallback) {
    function baseCopyTask(extendBaseTaskCallback) {
        var myFilter = filter(function (file) {
            return file.event === 'unlink'
        })

        var baseTask = gulp.src(source)

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

    gulp.task(taskName, function () {
        baseCopyTask()
    })

    gulp.task(taskName + "-watch", function () {
        baseCopyTask(function (task) {
            return task.pipe(watch(source))
        })
    })
}

createCopyTasks('js', paths.js, paths.build, function (task) {
    return task
        .pipe(plumber())
        .pipe(ngAnnotate())
})

//Compiling assets

createCopyTasks('assets', paths.assets, paths.build + "/assets")
createCopyTasks('favicon', 'app/*.png', paths.build)

//Templates

createCopyTasks('templates', paths.templates, paths.build)

//Build task

gulp.task('build', ['sass', 'js', 'assets', 'favicon', 'templates', 'index'])

//Watch for changes in scripts, sass files and templates

gulp.task('watch', ['js-watch', 'assets-watch', 'templates-watch'], function () {
    gulp.watch(paths.sass, ['sass'])
    gulp.watch(paths.js.concat(['./app/index.html']), ['index'])
})

//Dependency installer

gulp.task('install', shell.task(['bower install']))

//Clean build directory

gulp.task('clean', function () {
    del.sync([paths.build + '/**', '!' + paths.build, '!' + paths.build + '/lib/**'])
})

//Setting environment to development

gulp.task('env-dev', function () {
    gulp.src(paths.settings + '/settings.dev.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
})

//Setting environment to staging
gulp.task('env-staging', function () {
    gulp.src(paths.settings + '/settings.staging.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
})

//Setting environment to production

gulp.task('env-production', function () {
    gulp.src(paths.settings + '/settings.production.js')
        .pipe(rename('settings.js'))
        .pipe(gulp.dest(paths.build))
    console.log('launching in production mode')
})