import { appConfig } from "@nex/dataset";

export const Footer = ({ className }: { className?: string }) => (
    <div className={`select-text ${className}`}>
        <p className="text-center mb-4 italic">For bug reports or suggestions, join the Discord below</p>
        <div className="flex gap-2 justify-center mb-4">
            <a href="https://discord.gg/gCunWKx" target="_blank" rel="noreferrer">
                <img src="https://img.shields.io/discord/727175083977736262.svg?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=2c2f33" />
            </a>
            <div style={{ height: '10px' }} />
            <a href="https://www.buymeacoffee.com/denniskeil" target="_blank" rel="noreferrer">
                <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshields-io-buymeacoffee.vercel.app%2Fapi%3Fusername%3Ddenniskeil" />
            </a>
        </div>
        <p className="text-xs text-center">
            Age of Empires II© Microsoft Corporation. {appConfig.hostAoeCompanion} was created under Microsoft&apos;s &quot;
            <a className="text-gray-500" href="https://www.xbox.com/en-US/developers/rules" rel="noreferrer noopener">
                Game Content Usage Rules
            </a>
            &quot; using assets from{' '}
            <a className="text-gray-500" href={appConfig.ms.url} rel="noreferrer noopener">
                {appConfig.ms.name}
            </a>
            , and it is not endorsed by or affiliated with Microsoft.
        </p>
    </div>
);
