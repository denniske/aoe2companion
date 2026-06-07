import React from 'react';
import { defaultOverlayToolbarProps, useToolbarProps } from '../_providers/overlay-toolbar-context';
import { Icon } from '@app/components/icon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBorderBottom, faBorderCenterH, faBorderCenterV, faBorderLeft, faBorderRight, faBorderTop, faClipboard } from '@fortawesome/sharp-solid-svg-icons';
import cn from 'classnames';
import { Button } from '@app/components/button';

export type OverlayToolbarOptions = Array<'horizontal' | 'vertical' | 'scale' | 'padding' | 'count' | 'speed'>;

export const OverlayToolbar: React.FC<{ options: OverlayToolbarOptions }> = ({ options }) => {
    const { hideToolbar, setProps, ...params } = useToolbarProps();
    const { vertical } = params;

    if (hideToolbar) {
        return null;
    }

    return (
        <div
            className="fixed left-4 right-4 bg-blue-800 py-4 px-6 flex gap-8 items-start rounded text-white"
            style={{ top: vertical === 'bottom' ? 16 : undefined, bottom: vertical !== 'bottom' ? 16 : undefined }}
        >
            {options.includes('horizontal') && (
                <AlignmentSelector
                    value="horizontal"
                    label="Horizontal Align"
                    options={[
                        { icon: faBorderLeft, label: 'Left', value: 'left' },
                        { icon: faBorderCenterV, label: 'Center', value: 'center' },
                        { icon: faBorderRight, label: 'Right', value: 'right' },
                    ]}
                />
            )}

            {options.includes('vertical') && (
                <AlignmentSelector
                    value="vertical"
                    label="Vertical Align"
                    options={[
                        { icon: faBorderTop, label: 'Top', value: 'top' },
                        { icon: faBorderCenterH, label: 'Center', value: 'center' },
                        { icon: faBorderBottom, label: 'Bottom', value: 'bottom' },
                    ]}
                />
            )}

            {options.includes('scale') && <RangeSelector label="Scale" value="scale" min={0.25} max={5} step={0.25} />}
            {options.includes('padding') && <RangeSelector label="Padding" value="padding" min={0} max={100} step={1} />}
            {options.includes('count') && <RangeSelector label="Count" value="count" min={4} max={50} step={1} />}
            {options.includes('speed') && <RangeSelector label="Speed" value="speed" min={0.25} max={4.75} step={0.25} />}

            <div className="flex flex-row items-center justify-end flex-1 gap-8 self-stretch">
                <Button className="bg-transparent! hover:underline" onPress={() => setProps(defaultOverlayToolbarProps)}>
                    Reset
                </Button>
                <Button
                    icon={faClipboard}
                    onPress={() => {
                        const currentUrl = new URL(window.location.href);
                        const searchParams = new URLSearchParams({ ...params, hideToolbar: 'true' });
                        currentUrl.search = searchParams.toString();

                        navigator.clipboard.writeText(currentUrl.toString()).then(
                            function () {
                                console.log('Async: Copying to clipboard was successful!');
                            },
                            function (err) {
                                console.error('Async: Could not copy text: ', err);
                            }
                        );
                    }}
                >
                    Copy Link
                </Button>
            </div>
        </div>
    );
};

const AlignmentSelector: React.FC<{
    options: Array<{ icon: IconDefinition; label: string; value: string }>;
    label: string;
    value: 'horizontal' | 'vertical';
}> = ({ options, label, value }) => {
    const { setProps, ...props } = useToolbarProps();
    const selectedValue = props[value];

    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">{label}</span>
            <div className="flex gap-2">
                {options.map((option) => (
                    <button
                        className={cn('flex flex-col gap-1 items-center p-2 rounded cursor-pointer', selectedValue === option.value && 'bg-blue-950')}
                        key={option.value}
                        onClick={() => setProps({ [value]: option.value })}
                    >
                        <Icon icon={option.icon} size={32} />

                        <span className="text-sm font-medium">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const RangeSelector: React.FC<{
    label: string;
    value: 'scale' | 'padding' | 'count' | 'speed';
    min: number;
    max: number;
    step?: number;
}> = ({ label, value, min, max, step = 1 }) => {
    const { setProps, ...props } = useToolbarProps();
    const selectedValue = Number(props[value]);

    return (
        <div className="flex flex-col gap-4">
            <span className="text-xs font-medium">{label}</span>
            <div className="flex gap-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={selectedValue}
                    onChange={(e) => setProps({ [value]: Number(e.target.value) })}
                />
            </div>
        </div>
    );
};
