// Sass configuration
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var path = require('path');
var rename = require('gulp-rename');


var modules = {
    less: {
        use: false,
        instances: [

        ],
    },
    sass: {
        use: true,
        instances: [
            {
                name: 'Game',
                watch: './src/scss/**/*.scss',
                src: './src/scss/index.scss',
                dest: './build/'
            },
        ],
    },
    typescript: {
        use: true,
        instances: [
            {
                name: 'Game',
                config: './src/game/tsconfig.json',
                watch: ['./src/game/**/*.ts'],
                src: './src/game/**/*.ts',
                dest: './bin/game/'
            },
        ],
    },
    browserify: {
        use: true,
        instances: [
            {
                name: 'Game',
                watch: './bin/game/**/*.ts',
                src: './bin/game/index.js',
                dest: './build/game.js'
            },
        ],
    },
    uglify: {
        use: true,
        instances: [
            {
                name: 'Game',
                watch: './build/Game.js',
                src: './build/Game.js',
                dest: './build'
            },
        ]
    }
}

let watching = false;



/**
 * Sass Parts:
 *      Enables compilation of sas files!
 */
var sass = require('gulp-sass');
gulp.task('sass', function(done) {
    
    function performSass(instance){
        return gulp.src(instance.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(instance.dest))
    }


    let streams = [];
    for(let instance of modules.sass.instances){
        streams.push(performSass(instance));
    }

    if(watching){
        for(let instance of modules.sass.instances){
            gulp.task(`sass ${instance.name}`, function() {
                return merge(performSass(instance));
            });
            gulp.watch(instance.watch, gulp.series([`sass ${instance.name}`]));
        }
    }

    return merge([].concat(...streams));
});



/**
 * Sass Parts:
 *      Enables compilation of sass files!
 */
var less = require('gulp-less');
gulp.task('less', function(done) {
    
    function performLess(instance){
        return gulp.src(instance.src)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(instance.dest))
    }

    let streams = [];
    for(let instance of modules.less.instances){
        streams.push(performLess(instance));
    }

    if(watching){
        for(let instance of modules.less.instances){
            gulp.task(`less ${instance.name}`, function() {
                return merge(performLess(instance));
            });
            gulp.watch(instance.watch, gulp.series([`less ${instance.name}`]));
        }
    }

    return merge([].concat(...streams));
});



/**
 * Typescript Parts:
 *      Enables compilation of ts files!
 */
var ts = require('gulp-typescript');
let projects = new Map();
gulp.task('typescript', function(done) {
    for(let instance of modules.typescript.instances){
        let options = require(instance.config);
        let tsProject = ts.createProject(Object.assign(options.compilerOptions, {
            declaration: true,
            rootDir: path.dirname(instance.config)
        }), ts.reporter.nullReporter(true));
        projects.set(instance, tsProject);
    }

    function performProject(instance){
        let project = projects.get(instance);
        
        let tsResult = gulp.src(instance.src)
            .pipe(sourcemaps.init({}))
            .pipe(projects.get(instance)())
            .on('error', (e) => {
                if(!watching) throw e;
            });
        
        return [
            tsResult.dts
                //.pipe(sourcemaps.write('./')) // prevent source maps for defs
                .pipe(gulp.dest(path.join(instance.dest))),
            tsResult.js
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(instance.dest))
        ];
    }


    let streams = [];
    for(let instance of modules.typescript.instances){
        streams.push(performProject(instance));
    }

    if(watching){
        for(let instance of modules.typescript.instances){
            gulp.task(`typescript ${instance.name}`, function() {
                return merge(performProject(instance));
            });
            gulp.watch(instance.watch, gulp.series([`typescript ${instance.name}`]));
        }
    }

    return merge([].concat(...streams));
});


/**
 * Browserify Parts:
 *      Enables compilation of sass files!
 */
var bro = require('gulp-bro');
gulp.task('browserify', function(done) {
    
    function performBrowserify(instance){
        return gulp.src(instance.src)
            .pipe(sourcemaps.init())
            .pipe(bro())
            .pipe(rename(path.basename(instance.dest)))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(path.dirname(instance.dest)));
    }

    let streams = [];
    for(let instance of modules.browserify.instances){
        streams.push(performBrowserify(instance));
    }

    if(watching){
        for(let instance of modules.browserify.instances){
            gulp.task(`browserify ${instance.name}`, function() {
                return merge(performBrowserify(instance));
            });
            gulp.watch(instance.watch, gulp.series([`browserify ${instance.name}`]));
        }
    }

    return merge([].concat(...streams));
});


/**
 * Uglify Parts:
 */
var uglify = require('gulp-uglify');
var path = require('path');
gulp.task('uglify', function(done) {
    
    function performUglify(instance){
        return gulp.src(instance.src)
            .pipe(uglify())
            .pipe(rename(path.basename(instance.src, '.js') + '.min.js'))
            .pipe(gulp.dest(instance.dest));
    }

    let streams = [];
    for(let instance of modules.uglify.instances){
        streams.push(performUglify(instance));
    }

    if(watching){
        for(let instance of modules.uglify.instances){
            gulp.task(`uglify ${instance.name}`, function() {
                return merge(performUglify(instance));
            });
            gulp.watch(instance.watch, gulp.series([`uglify ${instance.name}`]));
        }
    }

    return merge([].concat(...streams));
});





/**
 * Gulp logic
 */
let tasks = Object.keys(modules); // ['sass', 'less', 'typescript', 'browserify', uglify];

gulp.task('default', 
    function(done) {
        let tasksToRun = tasks.filter(e => { if(modules[e] === undefined) return true; return modules[e].use; });
        
        gulp.series(tasksToRun)(done)
    }
)
gulp.task(
    'watch',
    function() {
        watching = true;
        gulp.series('default')();
    }
)