// src/components/Navbar.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const Navbar = ({ConnectWallet, account}) => {
    console.log("account", account);
    
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 p-4 z-10 backdrop-blur-md bg-black/40">
      <nav className="flex justify-between max-w-6xl mx-auto items-center">
        <Link to="/" className="text-2xl font-light tracking-wide">
          <span className="text-[#E13300]">chain</span>box.com
        </Link>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {
                    account ? <span className="px-3 py-2 text-sm bg-[#E13300] text-white rounded-lg hover:bg-orange-600 transition-colors">{account?.substring(0,6)}</span>
                    : <span onClick={() => ConnectWallet(new ethers.providers.Web3Provider(window.ethereum))} className="px-3 py-2 text-sm bg-[#E13300] text-white rounded-lg hover:bg-orange-600 transition-colors">Connect Wallet</span>
                }
            </div>
        </div>
      </nav>
      
      {/* Overlay to handle closing dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        />
      )}
    </header>
  );
};

export default Navbar;