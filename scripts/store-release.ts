/**
 * Publish an already uploaded build to the stores.
 *
 *   GAME=aoe2 yarn store:ios 216
 *   GAME=aoe2 yarn store:android 216
 *   GAME=aoe2 yarn store:all 216
 *
 * iOS: creates/updates the App Store version, sets release notes, attaches the
 * processed TestFlight build and submits it for review.
 * Android: finds the draft release on the production track that contains the
 * matching version code (uploaded by `yarn publish:android`), sets release
 * notes and rolls it out.
 *
 * Secrets come from doppler (aoecompanion / dev_<GAME>). No deps, run with bun.
 */
import { createPrivateKey, createSign } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const [platformArg, versionArg] = process.argv.slice(2);
const GAME = process.env.GAME;
if (!['ios', 'android', 'all'].includes(platformArg) || !versionArg) {
    throw new Error('Usage: GAME=aoe2 bun scripts/store-release.ts <ios|android|all> <version, e.g. 216>');
}
if (GAME !== 'aoe2' && GAME !== 'aoe4') throw new Error('GAME must be aoe2 or aoe4');

// "216" -> "216.0.0", matching app.config.ts (runtimeVersion / buildNumber).
const parts = versionArg.split('.');
const versionString = [parts[0], parts[1] ?? '0', parts[2] ?? '0'].join('.');
// Same formula as runtimeVersionCode in app.config.ts: 216.0.0 -> 2160000.
const versionCode = Number(parts[0] + (parts[1] ?? '0').padStart(2, '0') + (parts[2] ?? '0').padStart(2, '0'));

const RELEASE_NOTES: Record<string, string> = {
    'en-US': 'Bugfixes & Improvements',
    'de-DE': 'Fehlerbehebungen & Verbesserungen',
};
const DEFAULT_NOTES = 'Bugfixes & Improvements';

const DOPPLER_PROJECT = process.env.DOPPLER_PROJECT ?? 'aoecompanion';
const DOPPLER_CONFIG = process.env.DOPPLER_CONFIG ?? `dev_${GAME}`;
const secrets: Record<string, string> = JSON.parse(
    execFileSync('doppler', ['secrets', 'download', '--no-file', '--format', 'json', '-p', DOPPLER_PROJECT, '-c', DOPPLER_CONFIG], {
        encoding: 'utf8',
    })
);
function secret(name: string): string {
    const value = secrets[name];
    if (!value) throw new Error(`${name} missing in doppler ${DOPPLER_PROJECT}/${DOPPLER_CONFIG}`);
    return value;
}

function sign(alg: 'ES256' | 'RS256', header: object, payload: object, pem: string): string {
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const input = `${b64({ ...header, alg, typ: 'JWT' })}.${b64(payload)}`;
    const sig = createSign('SHA256')
        .update(input)
        .sign({ key: createPrivateKey(pem), dsaEncoding: alg === 'ES256' ? 'ieee-p1363' : undefined });
    return `${input}.${sig.toString('base64url')}`;
}

async function request<T = any>(base: string, token: string, method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${base}${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}\n${await res.text()}`);
    return res.status === 204 ? (undefined as T) : res.json();
}

// ---------------------------------------------------------------- iOS

async function releaseIos() {
    const bundleId = secret('PLAY_STORE_PACKAGE_NAME'); // same id on both platforms
    const now = Math.floor(Date.now() / 1000);
    const jwt = sign(
        'ES256',
        { kid: secret('ASC_KEY_ID') },
        { iss: secret('ASC_ISSUER_ID'), iat: now, exp: now + 15 * 60, aud: 'appstoreconnect-v1' },
        Buffer.from(secret('ASC_KEY'), 'base64').toString('utf8')
    );
    const asc = <T = any>(method: string, path: string, body?: unknown) =>
        request<T>('https://api.appstoreconnect.apple.com/v1', jwt, method, path, body);

    const {
        data: [app],
    } = await asc('GET', `/apps?filter[bundleId]=${bundleId}`);
    if (!app) throw new Error(`App ${bundleId} not found`);
    console.log(`[ios] App: ${app.attributes.name} (${app.id})`);

    // Check the build first so nothing is created when it is not there yet.
    const {
        data: [build],
    } = await asc(
        'GET',
        `/builds?filter[app]=${app.id}&filter[preReleaseVersion.version]=${versionString}` +
            `&filter[processingState]=VALID&filter[expired]=false&sort=-uploadedDate&limit=1`
    );
    if (!build) throw new Error(`[ios] No processed TestFlight build for ${versionString} yet`);
    console.log(`[ios] Build: ${build.attributes.version} (${build.id})`);

    const editable = await asc(
        'GET',
        `/apps/${app.id}/appStoreVersions?filter[platform]=IOS` +
            `&filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED`
    );
    let version = editable.data[0];
    if (version) {
        if (version.attributes.versionString !== versionString) {
            version = (
                await asc('PATCH', `/appStoreVersions/${version.id}`, {
                    data: { type: 'appStoreVersions', id: version.id, attributes: { versionString } },
                })
            ).data;
        }
    } else {
        version = (
            await asc('POST', '/appStoreVersions', {
                data: {
                    type: 'appStoreVersions',
                    attributes: { platform: 'IOS', versionString, releaseType: 'AFTER_APPROVAL' },
                    relationships: { app: { data: { type: 'apps', id: app.id } } },
                },
            })
        ).data;
    }
    console.log(`[ios] Version: ${versionString} (${version.id})`);

    await asc('PATCH', `/appStoreVersions/${version.id}/relationships/build`, {
        data: { type: 'builds', id: build.id },
    });

    const locs = await asc('GET', `/appStoreVersions/${version.id}/appStoreVersionLocalizations`);
    for (const loc of locs.data) {
        const whatsNew = RELEASE_NOTES[loc.attributes.locale] ?? DEFAULT_NOTES;
        await asc('PATCH', `/appStoreVersionLocalizations/${loc.id}`, {
            data: { type: 'appStoreVersionLocalizations', id: loc.id, attributes: { whatsNew } },
        });
        console.log(`[ios] Notes [${loc.attributes.locale}]: ${whatsNew}`);
    }

    const drafts = await asc(
        'GET',
        `/reviewSubmissions?filter[app]=${app.id}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW`
    );
    const submission =
        drafts.data[0] ??
        (
            await asc('POST', '/reviewSubmissions', {
                data: {
                    type: 'reviewSubmissions',
                    attributes: { platform: 'IOS' },
                    relationships: { app: { data: { type: 'apps', id: app.id } } },
                },
            })
        ).data;

    await asc('POST', '/reviewSubmissionItems', {
        data: {
            type: 'reviewSubmissionItems',
            relationships: {
                reviewSubmission: { data: { type: 'reviewSubmissions', id: submission.id } },
                appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } },
            },
        },
    }).catch((e) => {
        if (!String(e).includes('409')) throw e; // already in this submission
    });

    await asc('PATCH', `/reviewSubmissions/${submission.id}`, {
        data: { type: 'reviewSubmissions', id: submission.id, attributes: { submitted: true } },
    });
    console.log(`[ios] ✅ Submitted for review (${submission.id})`);
}

// ---------------------------------------------------------------- Android

async function releaseAndroid() {
    const packageName = secret('PLAY_STORE_PACKAGE_NAME');
    const account = JSON.parse(Buffer.from(secret('FASTLANE_SERVICE_ACCOUNT_BASE64'), 'base64').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    const assertion = sign(
        'RS256',
        {},
        {
            iss: account.client_email,
            scope: 'https://www.googleapis.com/auth/androidpublisher',
            aud: account.token_uri ?? 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600,
        },
        account.private_key
    );
    const tokenRes = await fetch(account.token_uri ?? 'https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    });
    if (!tokenRes.ok) throw new Error(`[android] Google token -> ${tokenRes.status}\n${await tokenRes.text()}`);
    const { access_token } = await tokenRes.json();
    const play = <T = any>(method: string, path: string, body?: unknown) =>
        request<T>(
            `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}`,
            access_token,
            method,
            path,
            body
        );

    const edit = await play('POST', '/edits', {});
    const track = await play('GET', `/edits/${edit.id}/tracks/production`);
    const releases: any[] = track.releases ?? [];
    const release = releases.find((r) => (r.versionCodes ?? []).map(Number).includes(versionCode));
    if (!release) {
        await play('DELETE', `/edits/${edit.id}`);
        throw new Error(
            `[android] No production release with versionCode ${versionCode}. ` +
                `Found: ${releases.map((r) => `${r.name} [${r.versionCodes}] ${r.status}`).join(', ') || 'none'}`
        );
    }
    console.log(`[android] Release: ${release.name} [${release.versionCodes}] ${release.status}`);

    release.status = 'completed';
    delete release.userFraction;
    release.releaseNotes = Object.entries(RELEASE_NOTES).map(([language, text]) => ({ language, text }));

    // Only the release being published stays; other drafts on the track would
    // otherwise be committed alongside it.
    await play('PUT', `/edits/${edit.id}/tracks/production`, { track: 'production', releases: [release] });
    await play('POST', `/edits/${edit.id}:commit`);
    console.log(`[android] ✅ Rolled out ${versionCode} to production`);
}

async function main() {
    console.log(`Game: ${GAME}, version: ${versionString} (android ${versionCode})`);
    if (platformArg === 'ios' || platformArg === 'all') await releaseIos();
    if (platformArg === 'android' || platformArg === 'all') await releaseAndroid();
}

main().catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
});
