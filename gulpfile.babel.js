import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import watch from 'gulp-watch'
import sourcemaps from 'gulp-sourcemaps'
import tildeImporter from 'node-sass-tilde-importer'
import data from 'gulp-data'
import fs from 'fs'

const server = browserSync.create();

const dir = {
	src   : 'src',
	dist  : 'public',
	nm    : 'node_modules',
};

const postcssPlugins = [
	cssnano({
		core: true,
		zindex: false,
		autoprefixer: {
			add: true,
			browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
		}
	})
];


gulp.task('styles-dev', () => {
	gulp.src('./src/scss/styles.scss')
		.pipe(sourcemaps.init({ loadMaps : true}))
		.pipe(plumber())
		.pipe(sass({
			importer: tildeImporter,
			outputStyle: 'expanded',
			includePaths: ['./node_modules']
		}))
		.pipe(postcss(postcssPlugins))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./src/pug/utilis/'))
		.pipe(server.stream({match: '**/*.css'}))
});

gulp.task('pug-dev', () =>
	gulp.src('./src/pug/index.pug')
		.pipe(plumber())
		.pipe(data(function(file) {
			return 	JSON.parse(fs.readFileSync(`${dir.src}/data/example.json`))
		}))
		.pipe(pug({
			pretty: true,
			basedir: './src/pug'
		}))
		.pipe(gulp.dest('./public'))
);

gulp.task('images-dev', () => {
	gulp.src('./src/img/**/**')
		.pipe(gulp.dest('./public/images/'))
});

gulp.task('dev', [
	'styles-dev', 
	'pug-dev', 
	'images-dev',
], () => {
	server.init({
		server: {
			baseDir: './public'
		}
	});
	watch('./src/scss/**/**', 		() => gulp.start('styles-dev'));
	watch('./src/pug/**/**', 		() => gulp.start('pug-dev', server.reload));
	watch('./src/img/**/**', 		() => gulp.start('images-dev'))
});

