
import React from 'react';
import { Globe} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 bg-white/90 backdrop-blur-md border-t border-gray-200 mt-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Globe className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">GlobeTrotter Quiz</span>
        </div>
        
        <div className="text-sm text-gray-500 flex items-center">
          Ishita Khichar
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-xs text-gray-500 hover:text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs text-gray-500 hover:text-primary transition-colors">
            Terms
          </a>
          <a href="#" className="text-xs text-gray-500 hover:text-primary transition-colors">
            About
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
