// http://benfrain.com/breaking-up-with-sass-postcss/
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var simplevars = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');//归类media
var csswring = require('csswring');//压缩css
var oldie = require('oldie');
var cssnext = require('cssnext');
var nestedcss = require('postcss-nested');
var mixins = require('postcss-mixins');
var fs = require('fs');
var corepostcss = require('postcss');
var categories = require('./data/cat-colors.json');
var dataloop = function(css) {
    for (var category in categories.colorList) {
        var colorSet = categories.colorList[category];
        var borderTop = colorSet[0];
        var borderBottom = colorSet[1];
        var rule = corepostcss.rule({
            selector: '.cat-' + category
        });
        rule.append({
            prop: 'border-top',
            value: '1px solid ' + borderTop
        });
        rule.append({
            prop: 'border-bottom',
            value: '1px solid ' + borderBottom + ";"
        });
        css.append(rule);
    }
};

function css() {
    var processors = [
        autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }),
        mixins,//Note, that you must set this plugin before postcss-simple-vars and postcss-nested.
        nestedcss,
        simplevars

        // dataloop,
        // oldie

    ];
    return gulp.src('./preCss/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'));
}
gulp.task(css);

// Static server
function browsersync() {
    gulp.watch("preCss/*.css", gulp.series(
        css, browserSync.reload
        ));
    gulp.watch('*.html', browserSync.reload);
    browserSync({
        server: {
            baseDir: "./"
        }
    });

}


gulp.task('default', gulp.series(
	css,
	browsersync
));
