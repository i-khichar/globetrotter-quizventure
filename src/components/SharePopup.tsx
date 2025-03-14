
import React, { useRef, useState } from 'react';
import { MessageSquare, XCircle, Copy, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Card } from './ui/card';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { score } = useGame();
  const [isCopied, setIsCopied] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique challenge ID - in a real app, this would come from the backend
  const challengeId = Math.random().toString(36).substring(2, 10);
  
  // Create a shareable URL with the challenge ID
  const shareUrl = `${window.location.origin}/game?challenge=${challengeId}&username=${user?.username}&score=${score}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleWhatsAppShare = () => {
    const shareText = `I scored ${score} points in Globetrotter Challenge! Think you can beat me? Play here: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge a Friend</DialogTitle>
          <DialogDescription>
            Share this link with friends to challenge them to beat your score!
          </DialogDescription>
        </DialogHeader>
        
        {/* Challenge Card Preview */}
        <div className="p-1 bg-gray-100 rounded-lg">
          <Card ref={shareCardRef} className="p-4 border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col items-center space-y-3 text-center">
              <h3 className="text-lg font-bold text-primary">Globetrotter Challenge</h3>
              <div className="text-3xl font-bold">{score} points</div>
              <div className="text-sm text-gray-500">by {user?.username}</div>
              <p className="text-sm font-medium">Think you can beat my geography score?</p>
              <div className="mt-2 text-xs text-gray-400">Tap the link to play!</div>
            </div>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Share Link */}
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={shareUrl}
              readOnly
            />
            <Button size="sm" onClick={handleCopyLink}>
              {isCopied ? <span>Copied!</span> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Share Options */}
          <div className="flex justify-center space-x-3">
            <Button onClick={handleWhatsAppShare} className="bg-green-500 hover:bg-green-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            
            <Button onClick={handleCopyLink} variant="outline">
              <Share2 className="w-5 h-5 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;
