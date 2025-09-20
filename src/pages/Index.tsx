import { useState } from 'react';
import { Header } from '@/components/Header';
import { LCAForm, LCAFormData } from '@/components/LCAForm';
import { LCAResults } from '@/components/LCAResults';
import { calculateLCAResults } from '@/utils/lcaCalculations';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { toast } from '@/components/ui/use-toast';
import type { LCAResults as LCAResultsType } from '@/components/LCAResults';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LCAResultsType | null>(null);

  const handleFormSubmit = async (formData: LCAFormData) => {
    setLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const calculatedResults = calculateLCAResults(formData);
        setResults(calculatedResults);
        toast({
          title: "Analysis Complete",
          description: "Environmental impact assessment has been successfully calculated.",
        });
      } catch (error) {
        console.error('Calculation error:', error);
        toast({
          title: "Calculation Error",
          description: "There was an error processing your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 2500); // 2.5 second delay for processing simulation
  };

  const handleReset = () => {
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: "Reset Complete",
      description: "Ready for new environmental impact analysis.",
    });
  };

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Generating PDF Report",
        description: "Your environmental impact report is being prepared...",
      });
      
      await generatePDFReport();
      
      toast({
        title: "PDF Downloaded",
        description: "Your environmental impact report has been successfully downloaded.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Error",
        description: "There was an error generating the PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 via-gray-100 to-stone-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!results ? (
          <div className="max-w-4xl mx-auto">
            <LCAForm onSubmit={handleFormSubmit} loading={loading} />
            
            {loading && (
              <div className="mt-8 text-center">
                <div className="glass-effect p-8 rounded-xl border-0 shadow-xl">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Processing Environmental Analysis</h3>
                      <p className="text-muted-foreground mt-2">
                        Calculating lifecycle impacts and circular economy benefits...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <LCAResults 
              results={results} 
              onReset={handleReset}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>
        )}
      </main>
      
      <footer className="bg-secondary/10 border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Code Alchemists - Smart India Hackathon | Professional LCA & Circularity Engine
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
