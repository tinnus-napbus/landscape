import React, { useState, ChangeEvent } from 'react';
import { useBossMoons, bossMoon } from '../../state/boss';

export const Moons = () => {
    const { data: moons } = useBossMoons();
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
              // TODO: trigger to refetch moons
            }
          } catch (error) {
            setMessage(error);
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
        <h2 className="h4">Moons</h2>
        {Array.isArray(moons) && moons.length > 0 ?
          <div>
            {moons.map(moon =>
            <div>
            <h3 className="text-md font-bold whitespace-nowrap">{moon.moon}</h3>
            <p className="leading-5">{moon.life}</p>
            <p className="leading-5">{moon.rift}</p>
            </div>
            )}
          </div> : null
        }
        <input
        id="new-moon"
        type="text"
        value={newMoon}
        onChange={handleChange}
        className="input default-ring bg-gray-50"
        />
        <button className="button" onClick={()=>{spawnMoon()}}>{!loadingSpawn ? 'Create a moon' : 'Creating a moon....'}</button>
        {message ? <p>{message}</p> : null}
      </div>
    )
}