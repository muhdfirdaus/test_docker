const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const configPath = path.join(__dirname, 'config.json');

async function readConfig() {
    try {
        const data = await readFileAsync(configPath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config file:', error);
        process.exit(1);
    }
}

async function writeConfig(config) {
    try {
        await writeFileAsync(configPath, JSON.stringify(config, null, 4));
    } catch (error) {
        console.error('Error writing config file:', error);
        process.exit(1);
    }
}

async function getVersion() {
    const config = await readConfig();
    console.log('Current version:', config.buildnumber);
}

async function bumpVersion() {
    const config = await readConfig();
    const parts = config.buildnumber.split('.');
    parts[1] = parseInt(parts[1]) + 1;
    config.buildnumber = parts.join('.');
    await writeConfig(config);
    console.log('Version bumped to:', config.buildnumber);
}

async function outputVersion(filename) {
    const config = await readConfig();
    try {
        await writeFileAsync(filename, config.buildnumber);
        console.log('Version written to', filename);
    } catch (error) {
        console.error('Error writing version to file:', error);
        process.exit(1);
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--version') || args.includes('-v')) {
        await getVersion();
    } else if (args.includes('--bump') || args.includes('-b')) {
        await bumpVersion();
    } else if (args.includes('--output') || args.includes('-o')) {
        const index = Math.max(args.indexOf('--output'), args.indexOf('-o'));
        const filename = args[index + 1];
        if (!filename) {
            console.error('Error: No filename specified for --output option');
            process.exit(1);
        }
        await outputVersion(filename);
    } else {
        console.error('Invalid command-line arguments');
        process.exit(1);
    }
}

main();
