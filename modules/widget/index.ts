import { EventEmitter } from 'expo-modules-core';

import { WidgetModule, LiveActivityModule } from './src/WidgetModule';

export class Widget {
    appGroup: string;
    constructor(appGroup: string) {
        this.appGroup = appGroup;
    }

    public getItem(key: string): string {
        return WidgetModule.getItem(key, this.appGroup);
    }

    public setItem(key: string, value: string): void {
        return WidgetModule.setItem(value, key, this.appGroup);
    }

    public setImage(path: string, filename: string): string {
        return WidgetModule.setImage(path, filename, this.appGroup);
    }

    public reloadAll(): void {
        return WidgetModule.reloadAll();
    }
}

export class LiveActivity<T> {
    public emitter: EventEmitter;
    constructor() {
        this.emitter = new EventEmitter(LiveActivityModule as any);
    }

    public enable(): string {
        return LiveActivityModule.enable();
    }
}
