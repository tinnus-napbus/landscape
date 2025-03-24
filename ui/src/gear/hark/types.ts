export type Flag = string; // ~{ship}/{name}
export type Id = string; // @uvH

export type Thread = Id[];

export interface Threads {
  [time: string]: Thread; // time is @da
}

export interface Yarn {
  id: Id;
  rope: Rope;
  time: number;
  con: YarnContent[];
  wer: string;
  but: YarnButton | null;
}

export interface YarnButton {
  title: string;
  handler: string;
}

interface YarnContentShip {
  ship: string;
}

interface YarnContentEmphasis {
  emph: string;
}

export type YarnContent = string | YarnContentShip | YarnContentEmphasis;

export function isContentShip(obj: YarnContent): obj is YarnContentShip {
  return !!obj && typeof obj !== 'string' && 'ship' in obj;
}

export function isContentEmph(obj: YarnContent): obj is YarnContentEmphasis {
  return !!obj && typeof obj !== 'string' && 'emph' in obj;
}

export interface Rope {
  group: Flag | null;
  channel: Flag | null;
  desk: string;
  thread: string;
}

export interface Origin {
    desk: string;
    path: string;
    group: Flag | null;
    channel: Flag | null;
}

export type Seam = { group: Flag } | { desk: string } | { all: null };

export interface Yarns {
  [id: Id]: Yarn;
}

export interface Cable {
  rope: Rope;
  thread: Thread;
}

export interface Carpet {
  seam: Seam;
  yarns: Yarns;
  cable: Cable[];
  stitch: number;
}

export interface Blanket {
  seam: Seam;
  yarns: Yarns;
  quilt: {
    [key: number]: Thread;
  };
}

export interface Skein {
  time: number;
  count: number;
  shipCount: number;
  top: Yarn;
  unread: boolean;
}

export type Destination = {ext: string} | {int: string};

export interface Notification {
    time: string;
    id: Id;
    origin: Origin;
    contents: YarnContent[];
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

export interface HarkAddYarn {
  'add-yarn': {
    all: boolean;
    desk: boolean;
    yarn: Yarn;
  };
}

export interface HarkSawSeam {
  'saw-seam': Seam;
}

export interface HarkSawRope {
  'saw-rope': Rope;
}

export type HarkAction = HarkAddYarn | HarkSawSeam | HarkSawRope;
export type HarkAction1 = HarkAddNewYarn | HarkAction;
export type HarkAction2 = HarkCreate | HarkRead | HarkReadOrigin | HarkReadAll

export interface HarkUpdateNew {
    'new': Notification;
}

export interface HarkUpdateRead {
    'read': Id;
}

export type HarkUpdate = HarkUpdateNew | HarkUpdateRead

export interface NewYarn extends Omit<Yarn, 'id' | 'time'> {
  all: boolean;
  desk: boolean;
}

export interface HarkAddNewYarn {
  'new-yarn': NewYarn;
}

export interface HarkCreate {
  'create': {
      id: Id;
      origin: Origin;
      contents: YarnContent[];
      destination: Destination;
  }
}

export interface HarkRead {
  'read': {'id': Id};
}

export interface HarkReadOrigin {
  'read-origin': Origin;
}

export interface HarkReadAll {
  'read-all': null;
}