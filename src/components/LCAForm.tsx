import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Leaf, Settings, Zap } from 'lucide-react';

export interface LCAFormData {
  material: string;
  weight: number;
  transport: number;
  recycledPercent: number;
  energySource: string;
  endOfLife: string;
  temperature: number;
  waterUsage: number;
  wastePercent: number;
  efficiency: number;
}

interface LCAFormProps {
  onSubmit: (data: LCAFormData) => void;
  loading: boolean;
}

export const LCAForm = ({ onSubmit, loading }: LCAFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<LCAFormData>({
    material: 'aluminum',
    weight: 1000,
    transport: 500,
    recycledPercent: 50,
    energySource: 'grid',
    endOfLife: 'recycle',
    temperature: 800,
    waterUsage: 15,
    wastePercent: 5,
    efficiency: 85,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof LCAFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
          Environmental Impact Assessment
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Professional Life Cycle Assessment for sustainable material processing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">Material Type</Label>
              <Select value={formData.material} onValueChange={(value) => updateField('material', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluminum">Aluminum (Al)</SelectItem>
                  <SelectItem value="copper">Copper (Cu)</SelectItem>
                  <SelectItem value="critical_mineral">Critical Minerals (REE)</SelectItem>
                  <SelectItem value="steel">Steel (Fe)</SelectItem>
                  <SelectItem value="lithium">Lithium (Li)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-semibold">Process Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => updateField('weight', parseInt(e.target.value))}
                min="1"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transport" className="text-sm font-semibold">Transport Distance (km)</Label>
              <Input
                id="transport"
                type="number"
                value={formData.transport}
                onChange={(e) => updateField('transport', parseInt(e.target.value))}
                min="0"
                className="h-12"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Recycled Content (%)</Label>
              <Slider
                value={[formData.recycledPercent]}
                onValueChange={([value]) => updateField('recycledPercent', value)}
                max={100}
                min={0}
                step={1}
                className="py-2"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{formData.recycledPercent}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energySource" className="text-sm font-semibold">Energy Source</Label>
              <Select value={formData.energySource} onValueChange={(value) => updateField('energySource', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select energy source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Mix</SelectItem>
                  <SelectItem value="renewable">100% Renewable</SelectItem>
                  <SelectItem value="coal">Coal Dominant</SelectItem>
                  <SelectItem value="natural_gas">Natural Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endOfLife" className="text-sm font-semibold">End-of-Life Scenario</Label>
              <Select value={formData.endOfLife} onValueChange={(value) => updateField('endOfLife', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recycle">Recycling</SelectItem>
                  <SelectItem value="landfill">Landfill</SelectItem>
                  <SelectItem value="incineration">Incineration</SelectItem>
                  <SelectItem value="reuse">Direct Reuse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Parameters
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="space-y-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-semibold">Processing Temp (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => updateField('temperature', parseInt(e.target.value))}
                    min="0"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterUsage" className="text-sm font-semibold">Water Usage (L/kg)</Label>
                  <Input
                    id="waterUsage"
                    type="number"
                    value={formData.waterUsage}
                    onChange={(e) => updateField('waterUsage', parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wastePercent" className="text-sm font-semibold">Waste Generation (%)</Label>
                  <Input
                    id="wastePercent"
                    type="number"
                    value={formData.wastePercent}
                    onChange={(e) => updateField('wastePercent', parseInt(e.target.value))}
                    min="0"
                    max="50"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="efficiency" className="text-sm font-semibold">Process Efficiency (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    value={formData.efficiency}
                    onChange={(e) => updateField('efficiency', parseInt(e.target.value))}
                    min="50"
                    max="100"
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center pt-6">
            <Button 
              type="submit" 
              variant="sustainable" 
              size="xl" 
              disabled={loading}
              className="min-w-[280px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Processing Analysis...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Run Environmental Assessment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};