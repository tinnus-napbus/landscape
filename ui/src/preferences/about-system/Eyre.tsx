import React, { useState } from 'react';
import { useBossHttpPorts, useBossDomains, bossMoonConfigDNS } from '../../state/boss';

export const Eyre = ({forbidden} : { forbidden:string[] }) => {
    const {data: httpPorts} = useBossHttpPorts()
    const {data: domains} = useBossDomains()
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null)

    async function configureDNS(){
      try {
        setLoading(true);
        setMessage(null);
        const result = await bossMoonConfigDNS();
        
        setMessage(result.message);
        }catch (error: unknown) {
          if (error instanceof Error) {
              setMessage(error.message);
          } else {
              setMessage('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
    }

    return(
    (domains.length > 1) || (httpPorts && Object.keys(httpPorts).length > 0) ? (
      <div className="inner-section space-y-8 relative mb-4">
        <h2 className="h3">Eyre</h2>
            {domains.length > 1 && 
            <div className='flex items-center space-x-4'>
              <h3 className='text-md font-bold whitespace-nowrap'>DNS:</h3>
              {domains.map((domain, index) => (
                <p className="leading-5" key={index}>{domain}</p>
              ))}
              </div>
            }
        {httpPorts && Object.keys(httpPorts).length > 0 &&
        <div className='flex items-center space-x-4'>
            <h3 className='text-md font-bold whitespace-nowrap'>HTTP Port:</h3>
            <p className="leading-5">{httpPorts.http}</p>
        </div>
        }
        {httpPorts && Object.keys(httpPorts).length > 0 && httpPorts?.https !== null && httpPorts?.https !== undefined &&
        <div className='flex items-center space-x-4'>
            <h3 className='text-md font-bold whitespace-nowrap'>HTTPS Port:</h3>
            <p className="leading-5">{httpPorts?.https}</p>
        </div>
        }
        {httpPorts && Object.keys(httpPorts).length > 0 && httpPorts.http === 80 && !forbidden?.includes('boss-dns-config') &&
          <div>
          <p>Port 80 & 443 must be accessible from the public internet (port forward as necessary).</p>
          <button className="button mt-4" onClick={()=>{configureDNS()}}>
            {!loading ? 'Configure DNS' : 'Processing...'}
          </button>
          {message ? <p>{message}</p> : <></>}
          </div>
        }
      </div> )
      : <></>
    )
}