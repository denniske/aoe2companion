// DEV ONLY: serves locally generated aoe4world/data outputs, one folder per variant, to the explorer.
// Pick the variant with the switcher at the top of the explore page (dev builds only).
//
//   node scripts/serve-aoe4-explorer-variants.mjs [variants dir]   (default: ../aoe4world/variants)
//
// Each variant is an AOE4_DATA_OUT folder of the parser: <variant>/<type>/all-optimized.json.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', '..', 'aoe4world', 'variants'));
const port = 8787;

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') {
        const variants = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'units', 'all-optimized.json')));
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(variants));
    }
    // <variant>/civilizations.json: the civ pages' text, combined the way watch-data publishes it
    // (poc_collector buildCivOverview).
    const civs = url.pathname.match(/^\/([^/]+)\/civilizations\.json$/);
    if (civs && fs.existsSync(path.join(root, civs[1], 'civilizations', 'civs-index.json'))) {
        const dir = path.join(root, civs[1], 'civilizations');
        const index = JSON.parse(fs.readFileSync(path.join(dir, 'civs-index.json'), 'utf8'));
        const out = Object.fromEntries(
            Object.values(index).map((civ) => {
                const { description, classes, era, overview } = JSON.parse(fs.readFileSync(path.join(dir, `${civ.slug}.json`), 'utf8'));
                return [civ.id, { summary: description, classes, era, overview }];
            })
        );
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(out));
    }
    const file = path.join(root, path.normalize(decodeURIComponent(url.pathname)));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.statusCode = 404;
        return res.end('not found');
    }
    res.setHeader('Content-Type', 'application/json');
    fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}/ (variants: ${fs.readdirSync(root).join(', ')})`));
