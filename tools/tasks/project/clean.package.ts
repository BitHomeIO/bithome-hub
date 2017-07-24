import Config from '../../config';
import {clean} from '../../utils';
import {join} from 'path';

/**
 * Executes the build process, cleaning all files within package directory
 */
export = clean(
    [Config.PACKAGE_DEST, join(Config.DIST_DIR, Config.PACKAGE_NAME)]
);
