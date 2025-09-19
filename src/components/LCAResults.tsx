import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  Recycle, 
  TrendingDown, 
  Download,
  RefreshCw,
  Award,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface LCAResults {
  material: string;
  weight: number;
  recycledPercent: number;
  linear: {
    co2e: number;
    energy: number;
    water: number;
    depletion: number;
    waste: number;
  };
  circular: {
    co2e: number;
    energy: number;
    water: number;
    depletion: number;
    waste: number;
  };
  reductions: {
    co2: number;
    energy: number;
    water: number;
  };
  circularityScore: number;
}

interface LCAResultsProps {
  results: LCAResults;
  onReset: () => void;
  onDownloadPDF: () => void;
}

export const LCAResults = ({ results, onReset, onDownloadPDF }: LCAResultsProps) => {
  const impactData = [
    {
      category: 'CO₂ Emissions',
      Linear: results.linear.co2e,
      Circular: results.circular.co2e,
    },
    {
      category: 'Energy Use',
      Linear: results.linear.energy,
      Circular: results.circular.energy,
    },
    {
      category: 'Water Use',
      Linear: results.linear.water,
      Circular: results.circular.water,
    },
  ];

  const savingsData = [
    { name: 'CO₂ Reduction', value: results.reductions.co2, fill: '#10b981' },
    { name: 'Energy Savings', value: results.reductions.energy, fill: '#3b82f6' },
    { name: 'Water Savings', value: results.reductions.water, fill: '#06b6d4' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { text: 'Good', variant: 'secondary' as const };
    return { text: 'Moderate', variant: 'outline' as const };
  };

  const generateRecommendations = () => {
    const recs = [];
    
    if (results.recycledPercent < 50) {
      recs.push({
        icon: <Recycle className="w-5 h-5" />,
        title: 'Boost Recycled Content',
        description: 'Increasing recycled content above 50% can dramatically reduce virgin material extraction impacts.'
      });
    }
    
    if (results.reductions.co2 < 30) {
      recs.push({
        icon: <Leaf className="w-5 h-5" />,
        title: 'Optimize Carbon Footprint',
        description: 'Consider renewable energy sources and improved process efficiency to enhance CO₂ reductions.'
      });
    }
    
    if (results.circularityScore >= 80) {
      recs.push({
        icon: <Award className="w-5 h-5" />,
        title: 'Outstanding Performance',
        description: 'Your process demonstrates excellent circular economy principles. Consider sharing best practices.'
      });
    }

    return recs.length > 0 ? recs : [{
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'Well Optimized Process',
      description: 'Your current configuration shows good environmental performance across key metrics.'
    }];
  };

  return (
    <div className="space-y-8 fade-in" style={{ animation: 'fadeIn 0.8s ease-in-out' }}>
      {/* Key Metrics */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Environmental Impact Results</CardTitle>
          <CardDescription className="text-lg">
            Analysis for {results.weight.toLocaleString()} kg of {results.material}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl card-hover metric-glow bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <Leaf className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide">CO₂ Reduction</p>
              <p className="text-4xl font-bold text-green-600">{results.reductions.co2}%</p>
            </div>
            
            <div className="text-center p-6 rounded-xl card-hover metric-glow bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200">
              <Zap className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Energy Savings</p>
              <p className="text-4xl font-bold text-blue-600">{results.reductions.energy}%</p>
            </div>
            
            <div className="text-center p-6 rounded-xl card-hover metric-glow bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200">
              <Droplets className="w-12 h-12 mx-auto mb-3 text-cyan-600" />
              <p className="text-sm font-medium text-cyan-700 uppercase tracking-wide">Water Savings</p>
              <p className="text-4xl font-bold text-cyan-600">{results.reductions.water}%</p>
            </div>
            
            <div className="text-center p-6 rounded-xl card-hover metric-glow bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
              <Recycle className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Circularity Score</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-4xl font-bold text-purple-600">{results.circularityScore}</p>
                <Badge variant={getScoreBadge(results.circularityScore).variant} className="ml-2">
                  {getScoreBadge(results.circularityScore).text}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linear vs Circular Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-red-700">Linear Route</CardTitle>
                <CardDescription>Traditional virgin material processing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-700 font-medium">CO₂ Emissions</span>
                <span className="font-bold text-red-600">{results.linear.co2e.toLocaleString()} kg CO₂e</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-700 font-medium">Energy Consumption</span>
                <span className="font-bold text-red-600">{results.linear.energy.toLocaleString()} MJ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-700 font-medium">Water Usage</span>
                <span className="font-bold text-red-600">{results.linear.water.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-700 font-medium">Waste Generated</span>
                <span className="font-bold text-red-600">{results.linear.waste.toLocaleString()} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-700">Circular Route</CardTitle>
                <CardDescription>{results.recycledPercent}% recycled content integration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-700 font-medium">CO₂ Emissions</span>
                <span className="font-bold text-green-600">{results.circular.co2e.toLocaleString()} kg CO₂e</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-700 font-medium">Energy Consumption</span>
                <span className="font-bold text-green-600">{results.circular.energy.toLocaleString()} MJ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-700 font-medium">Water Usage</span>
                <span className="font-bold text-green-600">{results.circular.water.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-700 font-medium">Waste Generated</span>
                <span className="font-bold text-green-600">{results.circular.waste.toLocaleString()} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Visual Impact Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4 text-center">Linear vs Circular Impact</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Linear" fill="#ef4444" />
                  <Bar dataKey="Circular" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4 text-center">Environmental Savings</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={savingsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Professional Recommendations</CardTitle>
          <CardDescription>Expert insights for optimizing your environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg card-hover bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="text-blue-600">{rec.icon}</div>
                <div>
                  <h4 className="font-semibold text-blue-900">{rec.title}</h4>
                  <p className="text-blue-700 text-sm mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card className="glass-effect border-0 shadow-xl" id="report-section">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Environmental Impact Report</CardTitle>
          <CardDescription className="text-lg">
            Professional LCA & Circularity Assessment Report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 mb-8">
            <p className="text-foreground text-lg leading-relaxed">
              This Life Cycle Assessment (LCA) for processing <strong>{results.weight.toLocaleString()} kg</strong> of <strong>{results.material}</strong> demonstrates the significant benefits of circular economy principles. By integrating <strong>{results.recycledPercent}% recycled content</strong>, the proposed circular route achieves a <strong>{results.reductions.co2}% reduction in CO₂ emissions</strong>, a <strong>{results.reductions.energy}% decrease in energy consumption</strong>, and a <strong>{results.reductions.water}% saving in water usage</strong> compared to a traditional linear model. The resulting Circularity Score of <strong>{results.circularityScore}/100</strong> highlights this process as a more sustainable alternative with measurable environmental benefits.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="success" 
              size="lg" 
              onClick={onDownloadPDF}
              className="min-w-[200px]"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onReset}
              className="min-w-[200px]"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};