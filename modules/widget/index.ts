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

    public reloadAll(): void {
        return WidgetModule.reloadAll();
    }
}

export class LiveActivity<T> {
    public start(data: T): string {
        return LiveActivityModule.start(JSON.stringify(data));
    }

    public list(): Array<{ id: string; data: T }> {
        const activities = LiveActivityModule.list();
        return activities.map((activity) => ({
            id: activity.id,
            data: JSON.parse(activity.data) as T,
        }));
    }

    public end(id: string): string {
        return LiveActivityModule.end(id);
    }

    public update(id: string, data: T): string {
        return LiveActivityModule.update(id, JSON.stringify(data));
    }
}
