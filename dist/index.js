/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 909:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Node.js core
const os = __nccwpck_require__(87);
const path = __nccwpck_require__(622);
const { execSync } = __nccwpck_require__(129)

// External
const core = __nccwpck_require__(291);
const tc = __nccwpck_require__(128);
const io = __nccwpck_require__(526);


// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch) {
    const mappings = {
        x32: '386',
        x64: 'amd64'
    };
    return mappings[arch] || arch;
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(os) {
    const mappings = {
        win32: 'windows'
    };
    return mappings[os] || os;
}

async function downloadCLI(url) {
    core.debug(`Downloading Terragrunt CLI from ${url}`);
    const fileName = path.basename(url);
    const exeSuffix = fileName.endsWith(".exe") ? '.exe' : '';
    const pathToCLI = await tc.downloadTool(url);
    if (!pathToCLI) {
        throw new Error(`Unable to download Terragrunt from ${url}`);
    }
    try {
        source = [pathToCLI, fileName].join(path.sep);
        target = [pathToCLI, `terragrunt${exeSuffix}`].join(path.sep);
        core.debug(`Moving ${source} to ${target}.`);
        await io.mv(source, target);
    } catch (e) {
        core.error(`Unable to move ${source} to ${target}.`);
        throw e;
    }
    return pathToCLI;
}

async function getTerragruntUrl(version, platform, arch) {
    let tg_version = version;
    if (tg_version == 'latest') {
        core.debug("Checking the latest version of Terragrunt");
        let latest_url = execSync("curl -Ls -o /dev/null -w %{url_effective} https://github.com/gruntwork-io/terragrunt/releases/latest");
        tg_version = path.basename(latest_url);
        core.debug(`using ${tg_version}`);
    }
    const exeSuffix = platform.startsWith('win') ? '.exe' : '';

    const url = `https://github.com/gruntwork-io/terragrunt/releases/download/${tg_version}/terragrunt_${platform}_${arch}${exeSuffix}`;
    return url;
}

async function run() {
    try {
        // Gather GitHub Actions inputs
        const version = core.getInput('terragrunt_version');

        // Gather OS details
        const osPlatform = os.platform();
        const osArch = os.arch();
        const platform = mapOS(osPlatform);
        const arch = mapArch(osArch);

        // create download url
        core.debug(`Getting url for Terragrunt version ${version}: ${platform} ${arch}`);
        const url = await getTerragruntUrl(version, platform, arch);

        // Download requested version
        const pathToCLI = await downloadCLI(url);

        // Add to path
        core.addPath(pathToCLI);

        return release;
    } catch (error) {
        core.error(error);
        throw error;
    }
}

module.exports = run;

/***/ }),

/***/ 291:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 526:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


/***/ }),

/***/ 128:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

const core = __nccwpck_require__(291);
const setup = __nccwpck_require__(909);

(async () => {
    try {
        await setup();
    } catch (error) {
        core.setFailed(error.message);
    }
})();
})();

module.exports = __webpack_exports__;
/******/ })()
;