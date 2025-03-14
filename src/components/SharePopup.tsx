
import React, { useRef, useState } from 'react';
import { MessageSquare, XCircle, Copy, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  // Try to use the game context, but don't throw an error if it's not available
  const gameContext = (() => {
    try {
      return useGame();
    } catch (e) {
      return { score: user?.gameStats?.score || 0 };
    }
  })();
  
  const { score } = gameContext;

  // Generate a random challenge ID for the invite
  const challengeId = React.useMemo(() => Math.random().toString(36).substring(2, 10), []);
  
  // Generate the invite link with the user's information
  const inviteLink = `${window.location.origin}/game?challenge=${challengeId}&username=${encodeURIComponent(user?.username || 'Explorer')}&score=${score}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleWhatsAppShare = () => {
    const text = `Can you beat my score of ${score} points in GeoGuess? Play now: ${inviteLink}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Challenge a Friend
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Share Card Preview */}
          <div 
            ref={shareCardRef}
            className="bg-gradient-to-br from-primary to-indigo-600 text-white rounded-lg p-6 shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">GeoGuess Challenge</h3>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  From: {user?.username || 'Explorer'}
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-lg opacity-90">Can you beat my score?</p>
                <div className="text-4xl font-bold my-2">{score} points</div>
              </div>
              
              <Button variant="secondary" className="w-full" disabled>
                Play Now
              </Button>
            </div>
          </div>
          
          {/* Share Link */}
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={inviteLink} 
              readOnly 
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          {/* Share Options */}
          <div className="flex justify-center space-x-3">
            <Button onClick={handleWhatsAppShare} className="bg-green-500 hover:bg-green-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            
            <Button onClick={handleCopyLink} variant="outline">
              {copied ? 'Copied!' : 'Copy Invite Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;
