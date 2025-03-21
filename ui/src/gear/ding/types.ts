type Flag = string; // ~{ship}/{name}
type Id = string; // @uvH

export interface Origin {
    desk: string;
    path: string;
    group: Flag | null;
    channel: Flag | null;
}

export type Content = string | {ship: string} | {emph: string} 

export function isNoteShip(obj: Content): obj is {ship: string} {
    return !!obj && typeof obj !== 'string' && 'ship' in obj;
}

export function isNoteEmph(obj: Content): obj is {emph: string} {
    return !!obj && typeof obj !== 'string' && 'emph' in obj;
}

export type Destination = {ext: string} | {int: string};

export interface Notification {
    time: string;
    id: Id;
    origin: Origin;
    contents: Content[];
    destination: Destination;
}

export interface Bundle {
    time: string;
    notification: Notification;
}

export type BundleArray = Bundle[];

export interface BundleWithOrigin {
    origin: Origin;
    bundle: BundleArray;
}

export type Bundles = BundleWithOrigin[]

export interface DingCreate {
    'create': {
        id: Id;
        origin: Origin;
        contents: Content[];
        destination: Destination;
    }
}

export interface DingRead {
    'read': {'id': Id};
}

export interface DingReadOrigin {
    'read-origin': Origin;
}

export interface DingReadAll {
    'read-all': null;
}

export type DingAction = DingCreate | DingRead | DingReadOrigin | DingReadAll

export interface DingUpdateNew {
    'new': Notification;
}

export interface DingUpdateRead {
    'read': Id;
}

export type DingUpdate = DingUpdateNew | DingUpdateRead