import React, { useState } from 'react';
import { bossMoonRekey, bossMoonBreach } from '../../state/boss';
import MoonKeyButton from './MoonKey';

interface MoonProps{
  moon: string,
  life: number,
  rift: number,
  forbidden: string[]
}

export const Moon = ({ moon, life, rift, forbidden}: MoonProps) => {
    const [breach, setBreach] = useState(false);
    const [messageBreach, setMessageBreach] = useState<string | null>(null)
    const [keyReset, setKeyReset] = useState(false);
    const [messageKeyReset, setMessageKeyReset] = useState<string | null>(null)


    function isAllowed(poke:string){
        return !forbidden?.includes(poke)
    }

    async function breachMoon(moonId: string){
      try {
          setBreach(true);
          setMessageKeyReset(null);
          setMessageBreach(null);
          const result = await bossMoonBreach(moonId);
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
            setMessageKeyReset(null);
            setMessageBreach(null);
            const result = await bossMoonRekey(moonId);
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
            <div className="flex space-x-3">
            <MoonKeyButton 
            moon={moon}
            />
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