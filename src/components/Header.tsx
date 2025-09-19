import { Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  return (
    <header className="gradient-bg text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide">LCA & Circularity Engine</h1>
              <p className="text-white/90 text-sm">Professional Environmental Impact Assessment</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Smart India Hackathon 2025
            </Badge>
            <div className="text-right">
              <div className="text-sm text-white/80 font-medium">Team</div>
              <div className="font-bold text-lg">Code Alchemists</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};