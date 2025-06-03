import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Shield, 
  DownloadCloud, 
  HelpCircle, 
  Youtube
} from 'lucide-react';

const Footer = () => {
  // State to track which mobile accordion sections are open
  const [openSections, setOpenSections] = useState({
    products: false,
    about: false,
    resources: false,
    connect: false
  });

  // Toggle section open/closed state for mobile view
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to render accordion section for mobile view
  const renderMobileAccordion = (section, title, content) => {
    return (
      <div className="border-b border-white/10 md:border-0">
        <button
          onClick={() => toggleSection(section)}
          className="flex w-full items-center justify-between py-4 text-left md:hidden"
        >
          <span className="text-white text-sm font-medium">{title}</span>
          {openSections[section] ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>

        <div className={` md:pb-0 overflow-hidden transition-all duration-300 md:h-auto ${openSections[section] ? 'max-h-96' : 'max-h-0 md:max-h-none'}`}>
          {content}
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-black border-t border-white/10 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Company Logo and Description - Always Visible */}
          <div className="md:col-span-1">
            <div className="text-2xl font-light mb-4">
              <span className="text-[#E13300]">chain</span>box.com
            </div>
            <p className="text-white/60 text-sm mb-6">
              Secure and decentralized file transfer made with blockchain system. Share files with confidence. Storing data in <b>IPFS</b>
            </p>
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-1">
            {renderMobileAccordion('products', 'Product / Features', (
              <div className="space-y-3">
                <div>
                  <Link to="/products/overview" className="text-white/60 hover:text-white text-sm transition-colors">
                    Overview
                  </Link>
                </div>
                <div>
                  <Link to="/products/fast-sharing" className="text-white/60 hover:text-white text-sm transition-colors">
                    Fast File Sharing
                  </Link>
                </div>
                <div>
                  <Link to="/products/secure-transfers" className="text-white/60 hover:text-white text-sm transition-colors">
                    Secure Transfers
                  </Link>
                </div>
                <div>
                  <Link to="/products/cross-platform" className="text-white/60 hover:text-white text-sm transition-colors">
                    Cross-Platform Support
                  </Link>
                </div>
                <div>
                  <Link to="/no-signup" className="text-white/60 hover:text-white text-sm transition-colors">
                    No Sign-up Required
                  </Link>
                </div>
                <div>
                  <Link to="/features" className="text-white/60 hover:text-white text-sm transition-colors">
                    Feature
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* About Us Links */}
          <div className="md:col-span-1">
            {renderMobileAccordion('about', 'About Us', (
              <div className="space-y-3">
                <div>
                  <Link to="/about/story" className="text-white/60 hover:text-white text-sm transition-colors">
                    Our Story
                  </Link>
                </div>
                <div>
                  <Link to="/use-case" className="text-white/60 hover:text-white text-sm transition-colors">
                    Use Case
                  </Link>
                </div>
                <div>
                  <Link to="/about/mission" className="text-white/60 hover:text-white text-sm transition-colors">
                    Mission & Vision
                  </Link>
                </div>
                <div>
                  <Link to="/about/team" className="text-white/60 hover:text-white text-sm transition-colors">
                    Team
                  </Link>
                </div>
                <div>
                  <Link to="/about/careers" className="text-white/60 hover:text-white text-sm transition-colors">
                    Careers
                  </Link>
                </div>
                <div>
                  <Link to="/about/press" className="text-white/60 hover:text-white text-sm transition-colors">
                    Press
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Resources Links */}
          <div className="md:col-span-1">
            {renderMobileAccordion('resources', 'Resources', (
              <div className="space-y-3">
                <div>
                  <Link to="/help-center" className="text-white/60 hover:text-white text-sm transition-colors">
                    Help Center
                  </Link>
                </div>
                {/* <div>
                  <Link to="/faq" className="text-white/60 hover:text-white text-sm transition-colors">
                    FAQs
                  </Link>
                </div> */}
                <div>
                  <Link to="/how-it-works" className="text-white/60 hover:text-white text-sm transition-colors">
                    How It Works
                  </Link>
                </div>
                <div>
                  <Link to="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1">
                    Privacy Policy
                    <DownloadCloud className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </Link>
                </div>
                <div>
                  <Link to="/system-status" className="text-white/60 hover:text-white text-sm transition-colors">
                    System Status
                  </Link>
                </div>
                <div>
                  <Link to="/accessibility" className="text-white/60 hover:text-white text-sm transition-colors">
                    Accessibility
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Connect With Us Links */}
          <div className="md:col-span-1">
            {renderMobileAccordion('connect', 'Connect With Us', (
              <div className="space-y-3">
                <div>
                  <Link to="/contact" className="text-white/60 hover:text-white text-sm transition-colors">
                    Contact Us
                  </Link>
                </div>
                <div>
                  <Link to="/feedback" className="text-white/60 hover:text-white text-sm transition-colors">
                    Feedback
                  </Link>
                </div>
                <div>
                  <Link to="/official-blog" className="text-white/60 hover:text-white text-sm transition-colors">
                    Official Blog
                  </Link>
                </div>
                <div>
                  <Link to="/testimonials" className="text-white/60 hover:text-white text-sm transition-colors">
                    Testimonials
                  </Link>
                </div>
                <div>
                  <Link to="/advertising" className="text-white/60 hover:text-white text-sm transition-colors">
                    Advertise With Us
                  </Link>
                </div>
                <div>
                  <Link to="/advertising-policies" className="text-white/60 hover:text-white text-sm transition-colors">
                    Advertising Policies
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Column Headers - Hidden on Mobile */}
      {/* <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-5 gap-8 mb-6">
          <div className="md:col-span-1"></div>
          <div className="md:col-span-1">
            <h3 className="text-white text-sm font-medium">Product / Features</h3>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-white text-sm font-medium">About Us</h3>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-white text-sm font-medium">Resources</h3>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-white text-sm font-medium">Connect With Us</h3>
          </div>
        </div>
      </div> */}

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="w-4 h-4 text-[#E13300] mr-2" />
            <span className="text-white/60 text-xs">
              Secure data by IPFS • 100% Confidential
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center justify-center md:justify-start space-x-6">
              <a 
                href="mailto:support@tryswiftx.com" 
                className="text-white/60 hover:text-white text-xs transition-colors flex items-center"
              >
                <Mail className="w-3 h-3 mr-1" />
                yashdanej2004@gmail.com
              </a>
              <span className="text-white/50 text-xs italic">
                <b>Disclaimer: </b>All footer links on this page are for demonstration purposes only and do not lead to real destinations.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;