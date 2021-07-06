// Node.js core
const os = require('os');
const path = require('path');
const { execSync } = require('child_process')
const { chmodSync } = require('fs');


// External
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');


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

async function downloadCLI(version, platform, arch) {
    let tg_version = version;
    if (tg_version == 'latest') {
        core.debug("Checking the latest version of Terragrunt");
        let latest_url = execSync("curl -Ls -o /dev/null -w %{url_effective} https://github.com/gruntwork-io/terragrunt/releases/latest");
        tg_version = path.basename(latest_url.toString());
        core.debug(`using ${tg_version}`);
    }
    const exeSuffix = platform.startsWith('win') ? '.exe' : '';
    const url = `https://github.com/gruntwork-io/terragrunt/releases/download/${tg_version}/terragrunt_${platform}_${arch}${exeSuffix}`;

    core.debug(`Downloading Terragrunt CLI from ${url}`);
    const pathToCLI = await tc.downloadTool(url);
    if (!pathToCLI) {
        throw new Error(`Unable to download Terragrunt from ${url}`);
    }
    chmodSync(pathToCLI, 0o755);
    const cachedPath = await tc.cacheFile(pathToCLI, `terragrunt${exeSuffix}`, 'terragrunt', tg_version);
    return cachedPath;
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

        // Download requested version
        core.debug(`Getting url for Terragrunt version ${version}: ${platform} ${arch}`);
        const pathToCLI = await downloadCLI(version, platform, arch);

        // Add to path
        core.addPath(pathToCLI);

        return pathToCLI;
    } catch (error) {
        core.error(error);
        throw error;
    }
}

module.exports = run;