import html2pdf from 'html2pdf.js';

export const generatePDFReport = () => {
  const element = document.getElementById('report-section');
  if (!element) {
    console.error('Report section not found');
    return;
  }

  const options = {
    margin: 0.5,
    filename: 'LCA_Circularity_Environmental_Report.pdf',
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true 
    },
    jsPDF: { 
      unit: 'in' as const, 
      format: 'letter' as const, 
      orientation: 'portrait' as const
    }
  };

  // Create a clone of the element to modify for PDF
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Create a temporary container with white background for PDF
  const tempContainer = document.createElement('div');
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.padding = '20px';
  tempContainer.style.color = '#000000';
  tempContainer.appendChild(clonedElement);
  
  // Temporarily add to DOM
  document.body.appendChild(tempContainer);
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';

  return html2pdf()
    .from(tempContainer)
    .set(options)
    .save()
    .then(() => {
      // Clean up
      document.body.removeChild(tempContainer);
    })
    .catch((error) => {
      console.error('PDF generation error:', error);
      document.body.removeChild(tempContainer);
    });
};