
export type OnTokenChangePayload = {
    token: string;
};

export type OnActivityStartPayload = {
    type: string;
    token: string;
    data: string;
};

export type LiveActivityModuleEvents = {
    onTokenChanged: (params: OnTokenChangePayload) => void;
    onActivityStarted: (params: OnActivityStartPayload) => void;
};
