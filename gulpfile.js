// http://benfrain.com/breaking-up-with-sass-postcss/
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
    reload      = browserSync.reload;
 
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var simplevars = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var nestedcss = require('postcss-nested');
var corepostcss = require('postcss');