import * as fs from "fs";

const [bin, folder, command, subset] = process.argv;

// console.log(process.argv);

function applySubset() {
    if (fs.existsSync('package.json.backup')) {
        throw new Error('Backup already exists. Restore package.json before applying new subset.');
    }

    fs.copyFileSync('package.json', 'package.json.backup');

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const serverList = packageJson.subsets[subset].include;

    packageJson.dependencies =
        Object.fromEntries(
            Object.entries(packageJson.dependencies)
                  .filter(([dep, version]) => serverList.includes(dep))
        );
    packageJson.devDependencies =
        Object.fromEntries(
            Object.entries(packageJson.devDependencies)
                  .filter(([dep, version]) => serverList.includes(dep))
        );

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

function restore() {
    fs.renameSync('package.json.backup', 'package.json');
}

if (command === 'apply') {
    applySubset();
}

if (command === 'restore') {
    restore();
}
