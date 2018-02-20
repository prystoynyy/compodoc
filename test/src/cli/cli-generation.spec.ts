import * as chai from 'chai';
import {temporaryDir, shell, pkg, exists, exec, read, shellAsync} from '../helpers';
const expect = chai.expect,
      tmp = temporaryDir();

describe('CLI simple generation', () => {

    const distFolder = tmp.name + '-simple-generation';

    describe('when generation with d flag - relative folder', () => {

        let stdoutString = undefined,
            fooComponentFile,
            fooServiceFile,
            componentFile,
            moduleFile,
            emptyModuleFile,
            emptyModuleRawFile;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            fooComponentFile = read(`${distFolder}/components/FooComponent.html`);
            fooServiceFile = read(`${distFolder}/injectables/FooService.html`);
            moduleFile  = read(`${distFolder}/modules/AppModule.html`);
            componentFile = read(`${distFolder}/components/BarComponent.html`);
            emptyModuleFile = read(`${distFolder}/modules/EmptyModule.html`);
            emptyModuleRawFile = read(`${distFolder}/modules/EmptyRawModule.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should display generated message', () => {
            expect(stdoutString).to.contain('Documentation generated');
        });

        it('should have generated main folder', () => {
            const isFolderExists = exists(`${distFolder}`);
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists(`${distFolder}/index.html`);
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists(`${distFolder}/modules.html`);
            expect(isModulesExists).to.be.true;
        });

        it('should have generated resources folder', () => {
            const isImagesExists = exists(`${distFolder}/images`);
            expect(isImagesExists).to.be.true;
            const isJSExists = exists(`${distFolder}/js`);
            expect(isJSExists).to.be.true;
            const isStylesExists = exists(`${distFolder}/styles`);
            expect(isStylesExists).to.be.true;
            const isFontsExists = exists(`${distFolder}/fonts`);
            expect(isFontsExists).to.be.true;
        });

        it('should have generated search index json', () => {
            const isIndexExists = exists(`${distFolder}/js/search/search_index.js`);
            expect(isIndexExists).to.be.true;
        });

        it('should have generated sourceCode for files', () => {
            expect(moduleFile).to.contain('import { FooDirective } from');
            expect(fooComponentFile).to.contain('export class FooComponent');
            expect(fooServiceFile).to.contain('export class FooService');
        });

        /**
         *   JSDOC
         */

        it('it should have a link with this syntax {@link BarComponent}', () => {
            expect(moduleFile).to.contain('See <a href="../components/BarComponent.html">BarComponent');
        });

        it('it should have a link with this syntax [The BarComponent]{@link BarComponent}', () => {
            const barModuleFile  = read(`${distFolder}/modules/BarModule.html`);
            expect(barModuleFile).to.contain('Watch <a href="../components/BarComponent.html">The BarComponent');
        });

        it('it should have a link with this syntax {@link BarComponent|BarComponent3}', () => {
            expect(fooComponentFile).to.contain('See <a href="../modules/AppModule.html">APP');
        });

        it('it should have infos about FooService open function param', () => {
            expect(fooServiceFile).to.contain('<p>The entry value');
        });

        it('it should have infos about FooService open function returns', () => {
            expect(fooServiceFile).to.contain('<p>The string</p>');
        });

        it('it should have infos about FooService open function example', () => {
            expect(fooServiceFile).to.contain('<b>Example :</b>');
            expect(fooServiceFile).to.contain('FooService.open(');
        });

        it('it should have link to TypeScript doc', () => {
            expect(fooServiceFile).to.contain('typescriptlang.org');
        });

        /**
         * internal/private methods
         */
         it('should include by default methods marked as internal', () => {
             expect(componentFile).to.contain('<code>internalMethod');
         });

         it('should exclude methods marked as hidden', () => {
             expect(componentFile).not.to.contain('<code>hiddenMethod');
         });

         it('should include by default methods marked as private', () => {
             expect(componentFile).to.contain('<code>privateMethod');
         });

        /**
         * No graph for empty module
         */

         it('it should not generate graph for empty metadatas module', () => {
             expect(emptyModuleFile).not.to.contain('module-graph-svg');
         });

         it('it should not break for empty raw metadatas module', () => {
             expect(emptyModuleRawFile).not.to.contain('module-graph-svg');
         });

        /**
         * Support of function type parameters
         */

         it('it should display function type parameters', () => {
             expect(fooServiceFile).to.contain('<code>close(work: (toto: ');
         });

         it('it should display c-style typed arrays', () => {
             expect(fooServiceFile).to.contain('<code>string');
         });

    });

    describe('when generation with d flag without / at the end - relative folder', () => {
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should have generated main folder', () => {
            const isFolderExists = exists(`${distFolder}`);
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists(`${distFolder}/index.html`);
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists(`${distFolder}/modules.html`);
            expect(isModulesExists).to.be.true;
        });
    });

    describe('when generation with d flag - absolute folder', () => {

        let stdoutString = undefined,
            fooComponentFile,
            fooServiceFile,
            componentFile,
            moduleFile;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                '../bin/index-cli.js',
                '-p', '../test/src/sample-files/tsconfig.simple.json',
                '-d', '/tmp/' + distFolder + '/'], { cwd: distFolder});

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            fooComponentFile = read(`/tmp/${distFolder}/components/FooComponent.html`);
            fooServiceFile = read(`/tmp/${distFolder}/injectables/FooService.html`);
            moduleFile  = read(`/tmp/${distFolder}/modules/AppModule.html`);
            componentFile = read(`/tmp/${distFolder}/components/BarComponent.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should display generated message', () => {
            expect(stdoutString).to.contain('Documentation generated');
        });

        it('should have generated main folder', () => {
            const isFolderExists = exists(`/tmp/${distFolder}`);
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists(`/tmp/${distFolder}/index.html`);
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists(`/tmp/${distFolder}/modules.html`);
            expect(isModulesExists).to.be.true;
        });

        it('should have generated resources folder', () => {
            const isImagesExists = exists(`/tmp/${distFolder}/images`);
            expect(isImagesExists).to.be.true;
            const isJSExists = exists(`/tmp/${distFolder}/js`);
            expect(isJSExists).to.be.true;
            const isStylesExists = exists(`/tmp/${distFolder}/styles`);
            expect(isStylesExists).to.be.true;
            const isFontsExists = exists(`/tmp/${distFolder}/fonts`);
            expect(isFontsExists).to.be.true;
        });

        it('should have generated search index json', () => {
            const isIndexExists = exists(`/tmp/${distFolder}/js/search/search_index.js`);
            expect(isIndexExists).to.be.true;
        });
    });

    /*describe('when generation with d flag - absolute folder inside cwd', () => {

        let stdoutString = undefined,
            actualDir,
            fooComponentFile,
            fooServiceFile,
            componentFile,
            moduleFile;
        before((done) => {
            tmp.create(distFolder);

            actualDir = process.cwd();

            actualDir = actualDir.replace(' ', '');
            actualDir = actualDir.replace('\n', '');
            actualDir = actualDir.replace('\r\n', '');

            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', actualDir + '/' + distFolder], { cwd: distFolder});

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            fooComponentFile = read(`/tmp/${distFolder}/components/FooComponent.html`);
            fooServiceFile = read(`/tmp/${distFolder}/injectables/FooService.html`);
            moduleFile  = read(`/tmp/${distFolder}/modules/AppModule.html`);
            componentFile = read(`/tmp/${distFolder}/components/BarComponent.html`);
            done();
        });
        after(() => tmp.clean(actualDir + '/' + distFolder));

        it('should display generated message', () => {
            expect(stdoutString).to.contain('Documentation generated');
        });

        it('should have generated main folder', () => {
            const isFolderExists = exists(`${actualDir}/${distFolder}`);
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists(`${actualDir}/${distFolder}/index.html`);
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists(`${actualDir}/${distFolder}/modules.html`);
            expect(isModulesExists).to.be.true;
        });

        it('should have generated resources folder', () => {
            const isImagesExists = exists(`${actualDir}/${distFolder}/images`);
            expect(isImagesExists).to.be.true;
            const isJSExists = exists(`${actualDir}/${distFolder}/js`);
            expect(isJSExists).to.be.true;
            const isStylesExists = exists(`${actualDir}/${distFolder}/styles`);
            expect(isStylesExists).to.be.true;
            const isFontsExists = exists(`${actualDir}/${distFolder}/fonts`);
            expect(isFontsExists).to.be.true;
        });

        it('should have generated search index json', () => {
            const isIndexExists = exists(`${actualDir}/${distFolder}/js/search/search_index.js`);
            expect(isIndexExists).to.be.true;
        });
    });*/

    describe('when generation with d and a flags', () => {

        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', distFolder,
                '-a', './screenshots/']);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should have copying assets folder', () => {
            const isFolderExists = exists(`${distFolder}/screenshots`);
            expect(isFolderExists).to.be.true;
        });
    });

    describe('when passing a deep path on a flag', () => {

        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', distFolder,
                '-a', './test/src/todomvc-ng2/screenshots/actions']);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should flatten the path to the deeper dirname', () => {
            const isFolderExists = exists(`${distFolder}/actions`);
            expect(isFolderExists).to.be.true;
        });
    });

    describe('when generation with d flag and src arg', () => {

        let stdoutString = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                './test/src/sample-files/',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should display generated message', () => {
            expect(stdoutString).to.contain('Documentation generated');
        });

        it('should have generated main folder', () => {
            const isFolderExists = exists(`${distFolder}`);
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists(`${distFolder}/index.html`);
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists(`${distFolder}/modules.html`);
            expect(isModulesExists).to.be.true;
        });
    });

    /*describe('when generation without d flag', () => {

        let stdoutString = undefined;
        before(function (done) {
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json'], { env});

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean('documentation'));

        it('should display generated message', () => {
            expect(stdoutString).to.contain('Documentation generated');
        });

        it('should have generated main folder', () => {
            const isFolderExists = exists('documentation');
            expect(isFolderExists).to.be.true;
        });

        it('should have generated main pages', () => {
            const isIndexExists = exists('documentation/index.html');
            expect(isIndexExists).to.be.true;
            const isModulesExists = exists('documentation/modules.html');
            expect(isModulesExists).to.be.true;
            const isOverviewExists = exists('documentation/overview.html');
            expect(isOverviewExists).to.be.true;
        });

        it('should have generated resources folder', () => {
            const isImagesExists = exists('documentation/images');
            expect(isImagesExists).to.be.true;
            const isJSExists = exists('documentation/js');
            expect(isJSExists).to.be.true;
            const isStylesExists = exists('documentation/styles');
            expect(isStylesExists).to.be.true;
            const isFontsExists = exists('documentation/fonts');
            expect(isFontsExists).to.be.true;
        });
    });*/

    describe('when generation with -t flag', () => {

        let stdoutString = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-t',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should not display anything', () => {
            expect(stdoutString).to.contain('Node.js');
            expect(stdoutString).to.not.contain('parsing');
        });
    });

    describe('when generation with --theme flag', () => {

        let stdoutString = undefined,
            baseTheme = 'laravel',
            index = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '--theme', baseTheme,
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should add theme css', () => {
            index = read(`${distFolder}/index.html`);
            expect(index).to.contain('href="./styles/' + baseTheme + '.css"');
        });
    });

    describe('when generation with -n flag', () => {

        let stdoutString = undefined,
            name = 'TodoMVC-angular2-application',
            index = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '-n', name,
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should edit name', () => {
            index = read(`${distFolder}/index.html`);
            expect(index).to.contain(name);
        });
    });

    describe('when generation with --hideGenerator flag', () => {

        let stdoutString = undefined,
            index = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '--hideGenerator',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should not contain compodoc logo', () => {
            index = read(`${distFolder}/index.html`);
            expect(index).to.not.contain('src="./images/compodoc-vectorise.svg"');
        });
    });

    describe('when generation with --disableSourceCode flag', () => {

        let stdoutString = undefined,
            index = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '--disableSourceCode',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should not contain sourceCode tab', () => {
            index = read(`${distFolder}/modules/AppModule.html`);
            expect(index).to.not.contain('id="source-tab"');
        });
    });

    describe('when generation with --disableGraph flag', () => {

        let stdoutString = undefined,
          fileContents = undefined;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-p', './test/src/sample-files/tsconfig.simple.json',
                '--disableGraph',
                '-d', distFolder]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should not generate any graph data', () => {
            expect(stdoutString).to.contain('Graph generation disabled');
            expect(stdoutString).not.to.contain('Process main graph');
        });

        it('should not include the graph on the modules page', () => {
            fileContents = read(`${distFolder}/modules.html`);
            expect(fileContents).to.not.contain('dependencies.svg');
            expect(fileContents).to.not.contain('svg-pan-zoom');
        });

        it('should not include the graph on the overview page', () => {
            fileContents = read(`${distFolder}/overview.html`);
            expect(fileContents).to.not.contain('graph/dependencies.svg');
            expect(fileContents).to.not.contain('svg-pan-zoom');
        });

        it('should not include the graph on the individual modules pages', () => {
            fileContents = read(`${distFolder}/modules/AppModule.html`);
            expect(fileContents).to.not.contain('modules/AppModule/dependencies.svg');
            expect(fileContents).to.not.contain('svg-pan-zoom');
        });
    });

    describe('when generation with -r flag', () => {

        let stdoutString = '',
            port = 6666,
            child;
        before(function (done) {
            tmp.create(distFolder);
            let ls = shell('node', [
                './bin/index-cli.js',
                '-s',
                '-r',
                '-r', port,
                '-d', distFolder], { timeout: 10000});

            if (ls.stderr.toString() !== '') {
                done(new Error(`shell error: ${ls.stderr.toString()}`));
                return;
            }

            stdoutString = ls.stdout.toString();
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should contain port ' + port, () => {
            expect(stdoutString).to.contain('Serving documentation');
            expect(stdoutString).to.contain(port);
        });
    });

});
