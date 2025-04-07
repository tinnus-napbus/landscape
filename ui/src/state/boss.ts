import useReactQueryScry from '@/logic/useReactQueryScry';
import api from '@/api';


export interface OurInfo {
    our: string,
    sponsor: string,
    chain: string[],
    life: number,
    rift: number,
    rank: string,
    point: undefined | Point
};

export interface SysInfo {
  pace: string,
  'vere-version': string,
  zuse: number,
  'ota-source': undefined | Dock,
  'base-hash': string,
  'base-time': number,
};

 interface Point {
    dominion: string,
    own: {
        owner: AddrProxy
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

export interface Moon{
    moon: string,
    life: number,
    rift: number
 }

 interface Dock{
  ship: string,
  desk: string
 }

export interface MoonKey{
  moon: string,
  key: string
 }

 interface AgentDesk{ 
  agent:string, 
  desk:string 
}

interface HttpPorts{
  http: number,
  https: undefined | number,
}

interface Allowed{
  all: string[],
  black: string[],
}

export function useBossOurInfo() {
  const { data, ...rest } = useReactQueryScry<OurInfo>({
    queryKey: ['our-info'],
    app: 'boss',
    path: `/0/our-info`,
    options: {
        refetchOnMount: true,
        retry: 1,
    },
  });

  if (rest.isLoading || rest.isError) {
    return { data: {} as OurInfo }
  }

  return { data: data as OurInfo };
}

export function useBossSysInfo() {
  const { data, ...rest } = useReactQueryScry<SysInfo>({
    queryKey: ['sys-info'],
    app: 'boss',
    path: `/0/sys-info`,
    options: {
        refetchOnMount: true,
        retry: 1,
    },
  });

  if (rest.isLoading || rest.isError) {
    return { data: {} as SysInfo }
  }

  return { data: data as SysInfo };
}

export function useBossMoons() {
  const { data, refetch, ...rest } = useReactQueryScry<Moon[]>({
    queryKey: ['moons'],
    app: 'boss',
    path: `/0/moons`,
    options: {
      refetchOnMount: true,
      retry: 1,
    },
  });

  if (rest.isLoading || rest.isError) {
    return { data: [] as Moon[], refetch };
  }

  return { data: data as Moon[], refetch };
}

export function useBossMoonKey(moon:string){
  if(moon !== ''){
    const { data, ...rest } = useReactQueryScry<MoonKey>({
        queryKey: [`moonkey-${moon}`],
        app: 'boss',
        path: `/0/moonkey/${moon}`,
        options: {
            refetchOnMount: true,
            retry: 1,
        },
      });
    
      if (rest.isLoading || rest.isError) {
        return {data: {} as MoonKey}
      }
    
      return {data: data as MoonKey}
  }
}

export function useBossAgentDesk(agent:string){
  if(agent !== ''){
    const { data, ...rest } = useReactQueryScry<AgentDesk>({
        queryKey: [`agent-desk-${agent}`],
        app: 'boss',
        path: `/0/agent-desk/${agent}`,
        options: {
            refetchOnMount: true,
            retry: 1,
        },
      });
    
      if (rest.isLoading || rest.isError) {
        return { data: {} as AgentDesk }
      }
    
      return { data: data as AgentDesk }
  }
}
export function useBossHttpPorts(){
  const { data, ...rest } = useReactQueryScry<HttpPorts>({
      queryKey: [`http-ports`],
      app: 'boss',
      path: `/0/http-ports`,
      options: {
          refetchOnMount: true,
          retry: 1,
      },
    });
  
    if (rest.isLoading || rest.isError) {
      return { data: {} as HttpPorts }
    }
  
    return { data: data as HttpPorts }
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
      return { data: 0 as number }
    }
  
    return { data: data as number };
}

export function useBossDomains() {
  const { data, ...rest } = useReactQueryScry<String[]>({
    queryKey: ['domains'],
    app: 'boss',
    path: `/0/domains`,
    options: {
        refetchOnMount: true,
        retry: 1,
    },
  });

  if (rest.isLoading || rest.isError) {
    return { data: [] as String[] }
  }

  return { data: data as String[] };
}

export function useBossAllowed(){
  const { data, ...rest } = useReactQueryScry<Allowed>({
      queryKey: ['allowed'],
      app: 'boss',
      path: `/0/allowed`,
      options: {
          refetchOnMount: true,
          retry: 1,
      },
    });
  
    if (rest.isLoading || rest.isError) {
      return { data: {} as Allowed }
    }
  
    return { data: data as Allowed };
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

  export async function bossMoonRekey(moon: string): Promise<{ success: boolean; message: string }> {
    try {
        const result = await pokeBoss('boss-moon-rekey', JSON.stringify(moon));
        return { success: true, message: result };
      } catch (error) {
        console.error(error);
        return { success: false, message: `Unexpected error: on changing keys for ${moon}` };
      }
  }

  export async function bossMoonBreach(moon: string): Promise<{ success: boolean; message: string }> {
    try {
        const result = await pokeBoss('boss-moon-breach', JSON.stringify(moon));
        return { success: true, message: result };
      } catch (error) {
        console.error(error);
        return { success: false, message: `Unexpected error: on breaching ${moon}` };
      }
  }

  export async function bossMoonConfigDNS(): Promise<{ success: boolean; message: string }> {
    try {
        const result = await pokeBoss('boss-dns-config', null);
        return { success: true, message: result };
      } catch (error) {
        console.error(error);
        return { success: false, message: `Unexpected error: on DNS` };
      }
  }