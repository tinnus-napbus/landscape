export const storageVersion = parseInt(
  import.meta.env.VITE_STORAGE_VERSION,
  10
);

export const SECTIONS = {
  ESSENTIALS: 'Essentials',
  SOCIAL: 'Social',
  UTILITIES: 'Utilities',
};

export const APPS = [
  // ESSENTIALS
  {
    title: 'Tlon',
    description: 'Start, host, and cultivate communities.',
    color: '#EFF0F4',
    link: '/apps/groups',
    source: '~sogryp-dister-dozzod-dozzod',
    section: SECTIONS.ESSENTIALS,
    desk: 'groups',
    image: 'https://bootstrap.urbit.org/tlon.svg?v=1'
  },
  {
    title: 'Pals',
    description: 'Friendlist for peer discovery.',
    color: '#99D3BD',
    link: '/pals',
    source: '~paldev',
    section: SECTIONS.ESSENTIALS,
    desk: 'pals'
  },
  {
    title: 'Terminal',
    description: 'A web interface to your Urbit\'s command line.',
    color: '#2E4347',
    link: '/apps/webterm',
    source: '~mister-dister-dozzod-dozzod',
    section: SECTIONS.ESSENTIALS,
    desk: 'webterm'
  },
  {
    title: 'Hits',
    description: 'A leaderboard for app installs.',
    color: '#1E1414',
    link: '/apps/hits',
    source: '~bitdeg',
    section: SECTIONS.ESSENTIALS,
    desk: 'hits',
    image: 'https://storage.googleapis.com/media.urbit.org/apps/%25hits-logo.png',
  },
  // SOCIAL
  {
    title: 'Rumors',
    description: 'Anonymous gossip from friends of friends.',
    color: '#BB77DD',
    link: '/rumors',
    source: '~paldev',
    section: SECTIONS.SOCIAL,
    desk: 'rumors'
  },
  {
    title: 'Radio',
    description: 'An app for urbit disc jockeys.',
    color: '#FFFFFF',
    link: '/apps/radio',
    section: SECTIONS.SOCIAL,
    desk: 'radio',
    source: '~nodmyn-dosrux',
    image: 'https://bwyl.nyc3.digitaloceanspaces.com/radio/radio.png'
  },
  {
    title: 'Turf',
    description: 'Build a world with your friends, explore, and hang out.',
    color: '#1F843C',
    link:'/apps/turf',
    source: '~pandux',
    section: SECTIONS.SOCIAL,
    desk: 'turf',
    image: 'https://raw.githubusercontent.com/johnhyde/turf/main/public/logo-big.png'
  },
  // UTILITIES
  {
    title: 'Scratch',
    description: 'For writing and sharing bits of text.',
    color: '#50AAEC',
    link: '/scratch',
    source: '~dister-nocsyx-lassul',
    section: SECTIONS.UTILITIES,
    desk: 'scratch',
    image: 'https://nyc3.digitaloceanspaces.com/hmillerdev/nocsyx-lassul/2023.6.11..05.43.03-scratch.svg'
  },
  {
    title: 'Hawk',
    description: 'A tree-shaped programming environment.',
    color: '#4E70A1',
    link: '/apps/hawk',
    source: '~dister-migrev-dolseg',
    section: SECTIONS.UTILITIES,
    desk: 'hawk',
    image: 'https://nyc3.digitaloceanspaces.com/drain/hawk-assets/2024.2.09..14.26.28-hawk.png'
  },
];
