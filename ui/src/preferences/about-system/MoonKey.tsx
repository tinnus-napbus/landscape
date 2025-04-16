import React, {useState} from 'react';
import { useBossMoonKey } from '../../state/boss';
import { Button } from '../../components/Button';

interface MoonKeyButtonProps {
  moon: string;
}

function MoonKeyButton({ moon }: MoonKeyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportKey = async () => {
    if (!moon) {
      console.error('No moon specified');
      return;
    }

    try {
      setIsLoading(true);

      const {data: result} = await useBossMoonKey(moon) ?? { data: null };
      
      if (result && result.key) {

        const blob = new Blob([result.key], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${moon}.key`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
      } else {
        console.error(`No key available for ${moon}`);
      }
    } catch (error) {
      console.error(`Failed to fetch key for ${moon}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="alt-primary"
      onClick={handleExportKey}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Export Key'}
    </Button>
  );
}

export default MoonKeyButton;