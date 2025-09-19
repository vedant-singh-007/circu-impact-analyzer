import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Leaf, Settings, Zap } from 'lucide-react';

export interface LCAFormData {
  // Primary material source selection
  materialSource: 'virgin' | 'scrap';
  previousUse?: string; // Only for scrap materials
  
  // Material specifications
  material: string;
  weight: number;
  
  // Transportation and logistics
  transport: number;
  transportMode: string;
  
  // Recycled content (for comparison)
  recycledPercent: number;
  
  // Energy and processing
  energySource: string;
  endOfLife: string;
  temperature: number;
  efficiency: number;
  
  // Metallurgical parameters
  alloySeparation: boolean;
  contaminantLevel: number;
  refiningSteps: number;
  
  // Environmental factors
  waterUsage: number;
  wastePercent: number;
  airPollution: number;
  landUse: number;
}

interface LCAFormProps {
  onSubmit: (data: LCAFormData) => void;
  loading: boolean;
}

export const LCAForm = ({ onSubmit, loading }: LCAFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<LCAFormData>({
    materialSource: 'virgin',
    previousUse: undefined,
    material: 'aluminum',
    weight: 1000,
    transport: 500,
    transportMode: 'truck',
    recycledPercent: 50,
    energySource: 'grid',
    endOfLife: 'recycle',
    temperature: 800,
    efficiency: 85,
    alloySeparation: false,
    contaminantLevel: 2,
    refiningSteps: 3,
    waterUsage: 15,
    wastePercent: 5,
    airPollution: 3,
    landUse: 0.5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof LCAFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="professional-card shadow-lg">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-foreground">
          Metallurgical LCA Assessment
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Professional Life Cycle Assessment for metal processing and recovery
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Primary Source Selection */}
          <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground">Material Source</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Primary Material Source</Label>
                <Select value={formData.materialSource} onValueChange={(value: 'virgin' | 'scrap') => updateField('materialSource' as keyof LCAFormData, value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virgin">Virgin Ore/Primary Production</SelectItem>
                    <SelectItem value="scrap">Scrap/Secondary Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.materialSource === 'scrap' && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Previous Use Application</Label>
                  <Select value={formData.previousUse || ''} onValueChange={(value) => updateField('previousUse' as keyof LCAFormData, value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automotive">Automotive Components</SelectItem>
                      <SelectItem value="construction">Construction/Infrastructure</SelectItem>
                      <SelectItem value="electronics">Electronics/Electrical</SelectItem>
                      <SelectItem value="packaging">Packaging Materials</SelectItem>
                      <SelectItem value="aerospace">Aerospace Applications</SelectItem>
                      <SelectItem value="industrial">Industrial Equipment</SelectItem>
                      <SelectItem value="consumer">Consumer Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Basic Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">Metal Type</Label>
              <Select value={formData.material} onValueChange={(value) => updateField('material', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluminum">Aluminum (Al)</SelectItem>
                  <SelectItem value="copper">Copper (Cu)</SelectItem>
                  <SelectItem value="steel">Steel (Fe/C alloys)</SelectItem>
                  <SelectItem value="stainless_steel">Stainless Steel</SelectItem>
                  <SelectItem value="titanium">Titanium (Ti)</SelectItem>
                  <SelectItem value="nickel">Nickel (Ni)</SelectItem>
                  <SelectItem value="zinc">Zinc (Zn)</SelectItem>
                  <SelectItem value="lead">Lead (Pb)</SelectItem>
                  <SelectItem value="lithium">Lithium (Li)</SelectItem>
                  <SelectItem value="rare_earth">Rare Earth Elements</SelectItem>
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
                className="h-12 focus-ring"
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
                className="h-12 focus-ring"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transportMode" className="text-sm font-semibold">Transport Mode</Label>
              <Select value={formData.transportMode} onValueChange={(value) => updateField('transportMode', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Road Transport (Truck)</SelectItem>
                  <SelectItem value="rail">Rail Transport</SelectItem>
                  <SelectItem value="ship">Sea Transport (Ship)</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Recycled Content for Comparison (%)</Label>
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
                  <SelectItem value="nuclear">Nuclear</SelectItem>
                  <SelectItem value="hydroelectric">Hydroelectric</SelectItem>
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
              Metallurgical Parameters
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="space-y-6 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground">Advanced Metallurgical Factors</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-semibold">Processing Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => updateField('temperature', parseInt(e.target.value))}
                    min="0"
                    max="2000"
                    className="h-12 focus-ring"
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
                    className="h-12 focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refiningSteps" className="text-sm font-semibold">Refining Steps Required</Label>
                  <Input
                    id="refiningSteps"
                    type="number"
                    value={formData.refiningSteps}
                    onChange={(e) => updateField('refiningSteps', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="h-12 focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contaminantLevel" className="text-sm font-semibold">Contaminant Level (%)</Label>
                  <Input
                    id="contaminantLevel"
                    type="number"
                    value={formData.contaminantLevel}
                    onChange={(e) => updateField('contaminantLevel', parseFloat(e.target.value))}
                    min="0"
                    max="20"
                    step="0.1"
                    className="h-12 focus-ring"
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
                    className="h-12 focus-ring"
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
                    className="h-12 focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="airPollution" className="text-sm font-semibold">Air Emissions Factor</Label>
                  <Input
                    id="airPollution"
                    type="number"
                    value={formData.airPollution}
                    onChange={(e) => updateField('airPollution', parseFloat(e.target.value))}
                    min="0"
                    max="10"
                    step="0.1"
                    className="h-12 focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landUse" className="text-sm font-semibold">Land Use (m²/kg)</Label>
                  <Input
                    id="landUse"
                    type="number"
                    value={formData.landUse}
                    onChange={(e) => updateField('landUse', parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                    className="h-12 focus-ring"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Alloy Separation Required</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alloySeparation"
                      checked={formData.alloySeparation}
                      onChange={(e) => updateField('alloySeparation', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <Label htmlFor="alloySeparation" className="text-sm">Complex alloy separation process</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endOfLife" className="text-sm font-semibold">End-of-Life Scenario</Label>
                <Select value={formData.endOfLife} onValueChange={(value) => updateField('endOfLife', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recycle">Recycling/Recovery</SelectItem>
                    <SelectItem value="landfill">Landfill Disposal</SelectItem>
                    <SelectItem value="incineration">Incineration with Energy Recovery</SelectItem>
                    <SelectItem value="reuse">Direct Reuse</SelectItem>
                    <SelectItem value="hazardous">Hazardous Waste Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="text-center pt-6">
            <Button 
              type="submit" 
              className="gradient-bg hover:opacity-90 text-white min-w-[280px] h-14 text-lg font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Processing Analysis...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Run Metallurgical LCA Assessment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};