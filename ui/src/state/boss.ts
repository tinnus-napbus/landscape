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

 interface Moon{
    moon: string,
    life: number,
    rift: number
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

export function useBossMoons(){
    const { data, ...rest } = useReactQueryScry<Moon[]>({
        queryKey: ['blocks'],
        app: 'boss',
        path: `/0/moons`,
        options: {
            refetchOnMount: true,
            retry: 1,
        },
      });
    
      if (rest.isLoading || rest.isError) {
        return {data: [] as Moon[]}
      }
    
      return {data: data as Moon[]}
}

function pokeBoss(mark: string, data: string | null): Promise<string> {
    if(data === ''){
        data = null
    }
    console.log('sending json: ', data)
    return new Promise((resolve, reject) => {
      api.poke({
        app: 'boss',
        mark: mark,
        json: null,
      })
      .then(response => {
        resolve('Successfully performed' + mark);
      })
      .catch(error => {
        reject(error);
      });
    });
  }

export async function bossMeld() : Promise<{ success: boolean; message: string }> {
    try {
        const result = await await pokeBoss('boss-meld', null)
        return { success: true, message: "Successfully performed meld!" };
      } catch (error) {
        return { success: false, message: "Error occurred during meld." };
      }
    }

export async function bossPack() : Promise<{ success: boolean; message: string }>{
    try {
        const result = await pokeBoss('boss-pack', null);
        return { success: true, message: "Successfully performed pack!" };
      } catch (error) {
        return { success: false, message: "Error occurred during pack." };
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

  export async function bossMoon(moon: string): Promise<{ success: boolean; message: string }> {
    try {
        console.log('creating moon:', moon)
        const result = await pokeBoss('boss-moon', JSON.stringify(moon));
        return { success: true, message: result };
      } catch (error) {
        console.error(error);
        return { success: false, message: 'Unexpected error: on creating moon' };
      }
  }

export async function bossMoonRekey(moon: string) {
    pokeBoss('boss-moon-rekey', moon)
  }

export async function bossMoonBreach(moon: string) {
    pokeBoss('boss-moon-breach', moon)
  }