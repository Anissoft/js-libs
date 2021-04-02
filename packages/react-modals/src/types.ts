export type toggleView = (modalName: string, opened: boolean, props?: Record<string, any>) => void;

export type openedModalsState = Record<string, Record<string, any>>