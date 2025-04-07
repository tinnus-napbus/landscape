import React, { useState, ChangeEvent } from 'react';
import { useBossMoonKey, bossMoon, MoonKey, bossMoonRekey, bossMoonBreach } from '../../state/boss';
import { useCopy } from '@/logic/utils';

interface MoonProps{
  moon: string,
  life: number,
  rift: number,
  forbidden: string[]
}

export const Moon = ({ moon, life, rift, forbidden}: MoonProps) => {
    const [code, setCode] = useState('')
    const [breach, setBreach] = useState(false);
    const [messageBreach, setMessageBreach] = useState<string | null>(null)
    const [keyReset, setKeyReset] = useState(false);
    const [messageKeyReset, setMessageKeyReset] = useState<string | null>(null)
    const { didCopy, doCopy } = useCopy(code);

    function isAllowed(poke:string){
        return !forbidden?.includes(poke)
    }

    async function showKey(moon:string){
        try{
          if(moon !== ''){
            //TODO:: change result.data to data
            //const {data: result} = await useBossMoonKey(moon) ?? { data: null };
            const result = {data: {moon: moon, key: moon}}
            if(result && result.data && Object.keys(result).length !== 0){
              setCode(result.data.key)
            }
          }
        }catch{
          console.error(`failed to fetch key for ${moon}`)
        }
      }

    async function breachMoon(moonId: string){
      try {
          setBreach(true);
          setMessageKeyReset(null);
          setMessageBreach(null);
          const result = await bossMoonRekey(moonId);
          setMessageBreach(result.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessageBreach(error.message);
            } else {
                setMessageBreach('An unknown error occurred');
            }
        } finally {
          setBreach(false);
        }
    }

    async function reKeyMoon(moonId: string){
        try {
            setKeyReset(true);
            setCode('')
            setMessageKeyReset(null);
            setMessageBreach(null);
            const result = await bossMoonBreach(moonId);
            setMessageKeyReset(result.message);
        }catch (error: unknown) {
            if (error instanceof Error) {
            setMessageKeyReset(error.message);
            } else {
                setMessageKeyReset('An unknown error occurred');
            }
        } finally {
            setKeyReset(false);
        }
      }



    return(
        <div className="space-y-3" key={moon}>
            <h3 className="text-md font-bold whitespace-nowrap">{moon}</h3>
            <div className='flex items-center space-x-4'>
              <h3 className='text-md font-bold whitespace-nowrap'>Life:</h3>
              <p className="leading-5">{life}</p>
            </div>
            <div className='flex items-center space-x-4'>
              <h3 className='text-md font-bold whitespace-nowrap'>Rift:</h3>
              <p className="leading-5">{rift}</p>
            </div>
            {code ? (
              <div>
                <div className="flex items-center justify-between rounded bg-gray-100 p-3">
                  <pre>{code}</pre>
                  <button
                    className="small-button"
                    onClick={() => {doCopy();}}
                  >
                    {didCopy ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              )
              :
              <button className="button" onClick={()=> showKey(moon)}>Show Access Key</button>
            }
            <div className="flex space-x-3">
              {isAllowed('boss-moon-rekey')  &&
                <button 
                className="button"
                onClick={()=>{reKeyMoon(moon)}}>
                    {!keyReset ? 'Change Key' : 'Changing key...'}
                </button>
              }
              {isAllowed('boss-moon-breach')  &&
                <button 
                className="button"
                onClick={()=>{breachMoon(moon)}}>
                    {!breach ? 'Factory reset' : 'Resetting...'}
                </button>
              }
            </div>
            {messageBreach ? <p>{messageBreach}</p> : <></>}
            {messageKeyReset ? <p>{messageKeyReset}</p> : <></>}
        </div>
    )
}