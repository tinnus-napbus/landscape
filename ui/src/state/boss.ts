import useReactQueryScry from '@/logic/useReactQueryScry';
import api from '@/api';


 export interface ourInfo {
    our: string,
    sponsor: string,
    chain: string[],
    life: number,
    rift: number,
    rank: string,
    point: undefined | Point
};

 interface Point {
    dominion: string,
    own: {
        ownder: AddrProxy
        'spawn-proxy': AddrProxy,
        'management-proxy': AddrProxy,
        'voting-proxy': AddrProxy,
        'transfer-proxy':AddrProxy,
    },
    net: {
        rift: number,
        keys: Keys
        sponsor: Sponsor,
        escape: undefined | string,
    }
 };

 interface AddrProxy{
    address: string,
    nonce: number
 }

 interface Keys{
    life: number,
    suite: number,
    auth: string,
    crypt: string
 }

 interface Sponsor{
    has: boolean,
    who: string
 }

export function useBossOurInfo() {
  const { data, ...rest } = useReactQueryScry<ourInfo>({
    queryKey: ['our-info'],
    app: 'boss',
    path: `/0/our-info`,
    options: {
        refetchOnMount: true,
        retry: 1,
    },
  });

  if (rest.isLoading || rest.isError) {
    return {data: {} as ourInfo}
  }

  return {data: data as ourInfo};
}

export function useBossBlocks(){
    const { data, ...rest } = useReactQueryScry<number>({
        queryKey: ['blocks'],
        app: 'boss',
        path: `/0/blocks`,
        options: {
            refetchOnMount: true,
            retry: 1,
        },
      });
    
      if (rest.isLoading || rest.isError) {
        return {data: 0 as number}
      }
    
      return {data: data as number};
}

function pokeBoss(mark: string, data: string | null): Promise<string> {
    return new Promise((resolve, reject) => {
      api.poke({
        app: 'boss',
        mark: mark,
        json: data,
      })
      .then(response => {
        console.log('success')
        resolve('Successfully performed' + mark);
      })
      .catch(error => {
        reject(error);
      });
    });
  }

export async function bossMeld() {
    try {
        await pokeBoss('boss-meld', null)
      } catch (error) {
        console.error(error);
      }
  }

export async function bossPack() {
    try {
        await pokeBoss('boss-pack', null);
      } catch (error) {
        console.error(error);
      }
}

export async function bossExit() {
    await pokeBoss('boss-exit', null)
  }

export async function bossSnub(formData: string, shipsData: string[]) {
    const data = {
        form: formData,
        ships: shipsData
    }
    pokeBoss('boss-snub', JSON.stringify(data))
  }

export async function bossSnob(formData: string, shipsData: string[]) {
    const data = {
        form: formData,
        ships: shipsData
    }

    pokeBoss('boss-snob', JSON.stringify(data))
  }

export async function bossMoon(moon: string) {
    pokeBoss('boss-moon', JSON.stringify(moon))
  }

export async function bossMoonRekey(moon: string) {
    pokeBoss('boss-moon-rekey', moon)
  }

export async function bossMoonBreach(moon: string) {
    pokeBoss('boss-moon-breach', moon)
  }