import React, { useState, ChangeEvent } from 'react';
import { bossMoon, useBossMoons } from '../../state/boss';
import { Moon } from './Moon'
import { Button } from '../../components/Button';

export const Moons = ({forbidden} : { forbidden:string[] }) => {
    const { data: moons, refetch } = useBossMoons();
    // const moons = [{moon:'~doznec-salfun-naptul-habrys', life: 1, rift: 1}]
    const [loadingSpawn, setLoadingSpawn] = useState(false);
    const [message, setMessage] = useState<string | null>(null)
    const [newMoon, setNewMoon] = useState('');

    async function spawnMoon(){
      try {
        setLoadingSpawn(true);
        setMessage(null);
        const result = await bossMoon(newMoon);
        
        if (!result.success) {
          setMessage(result.message);
        } else {
          refetch();
        }
        }catch (error: unknown) {
          if (error instanceof Error) {
              setMessage(error.message);
          } else {
              setMessage('An unknown error occurred');
          }
        } finally {
          setLoadingSpawn(false);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();

      setNewMoon(value);
    };
    

    return(
      <div className="inner-section space-y-8 mb-4">
        <h2 className="h3">Moons</h2>
        {Array.isArray(moons) && moons.length > 0 ?
          <div className="space-y-8">
            {moons.map(moon =>
              <Moon 
              moon={moon.moon}
              life={moon.life}
              rift={moon.rift}
              forbidden={forbidden}
              />
            )}
          </div> : null
        }
        {!forbidden?.includes('boss-moon')  &&
        <>
          <h2 className="h4">Spawn a moon</h2>
          <p>Moons may be utilized for many purposes: vanity identities, backup identities, identities for children, testing software and bots.
          </p>
          <p>To generate a random moon from your planet click spawn button.</p>
          <div className="relative flex space-x-2">
            <input
            id="new-moon"
            type="text"
            value={newMoon}
            onChange={handleChange}
            placeholder="~doznec-salfun-naptul-habrys"
            className="input default-ring bg-gray-50"
            />
            <Button className="absolute top-1 right-1 py-1 px-3 text-sm" onClick={()=>{spawnMoon()}}>{!loadingSpawn ? 'Spawn' : '...'}</Button>
          </div>
        </>
        }
        {message ? <p>{message}</p> : null}
      </div>
    )
}