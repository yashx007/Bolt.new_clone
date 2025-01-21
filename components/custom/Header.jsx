import React, { useContext } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Colors from '@/data/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Upload, Download } from 'lucide-react';
import { ActionContext } from '@/context/ActionContext';

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);

  const onActionBtn = (actionType) => {
    setAction({
      actionType: actionType,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="p-4 flex justify-between items-center">
      {/* Logo Section */}
      <Image src={'/image.png'} alt="logo" width={60} height={60} className="rounded-xl" />

      {/* Auth Section */}
      {!userDetail ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          {/* Export Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onActionBtn('export')}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          {/* Deploy Button */}
          <Button
            variant="primary"
            className="flex items-center gap-2 text-white"
            onClick={() => onActionBtn('deploy')}
            style={{
              backgroundColor: Colors.GREEN || '#28a745', // Fallback color
            }}
          >
            <Upload className="w-4 h-4" />
            Deploy
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
