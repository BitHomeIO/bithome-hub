import Config from '../../config';
import * as gulp from 'gulp';
import {join} from 'path';
import * as merge from 'merge-stream';

function packageDistProd() {
    let result = gulp.src(
        [
            join(Config.PROD_DEST, '**', '*'),
        ]
    );

    return result.pipe(gulp.dest(join(Config.PACKAGE_DEST, 'dist')));
}

function packageDistMisc() {
    let result = gulp.src(
        [
            'package.json',
            'README.md',
            'robots.txt',
            'app.js',
        ]
    );

    return result.pipe(gulp.dest(Config.PACKAGE_DEST));
}

function packageServerMiddleware() {
    let result = gulp.src(
        [
            'src/server/**/*'
        ]
    );

    return result.pipe(gulp.dest(join(Config.PACKAGE_DEST, 'server')));
}

export = () => merge(packageDistProd(), packageDistMisc(), packageServerMiddleware());
