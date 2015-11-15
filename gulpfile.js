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
            value: '1px solid ' + borderBottom + ';'
        });
        css.append(rule);
    }
};
var rainy = function(addRainyStyle){
    var arr = ['0%', '25%', '26%', '50%', '51%', '75%', '76%', '100%'];
    var rule = corepostcss.rule({
        selector: '@keyframes rainy_rain'
    });
    var xArr = ['.7em', '1.4em', '2.4em', '2.65em', '3em', '4.4em', '5.3em', '6em'];
    var yArr = [.3, .4, .75, .5, .1, .95, .45, .35];
    var yArrTem = [.3, .4, .75, .5, .1, .95, .45, .35];
    for(var i=0, len=arr.length; i<len; i++){
        var rule2 = corepostcss.rule({
            selector: arr[i]
        });
        var val = '';

        for(var j=0, len=xArr.length; j<len; j++){
            if(i === 2  || i===6){
                yArrTem[j] < 10 ? yArrTem[j] = yArrTem[j] : yArrTem[j] = yArr[j];
            }else{
                yArrTem[j] < 10 ? yArrTem[j] += Math.ceil(Math.random()*2)+1.5 :yArrTem[j] = yArr[j];
            }
            val += '#000 '+xArr[j]+' '+yArrTem[j]+'em';
            j < len-1 ? val+= ',': val+= ';'; 
        }
        rule2.append({
            prop: 'box-shadow',
            value:  val
        });
        rule.append(rule2);

    }
    addRainyStyle.append(rule);
}

function addRainyStyle(){
    var processors = [
        rainy
    ];
    return gulp.src('./preCss/output.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'));
}
gulp.task(addRainyStyle);
function css() {
    var processors = [
        autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }),
        mixins,//Note, that you must set this plugin before postcss-simple-vars and postcss-nested.
        nestedcss,
        // dataloop,
        // oldie,
        simplevars
    ];
    return gulp.src('./preCss/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'));
}
gulp.task(css);

// Static server
function browsersync() {
    gulp.watch('preCss/*.css', gulp.series(
        css, browserSync.reload
        ));
    gulp.watch('*.html', browserSync.reload);
    browserSync({
        server: {
            baseDir: './'
        }
    });

}


gulp.task('default', gulp.series(
	css,
	browsersync
));
