import html2pdf from 'html2pdf.js';

export const generatePDFReport = () => {
  const element = document.getElementById('results-container');
  if (!element) {
    console.error('Results section not found');
    return;
  }

  const options = {
    margin: 0.5,
    filename: 'LCA_Metallurgical_Environmental_Report.pdf',
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true
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
  tempContainer.style.fontFamily = 'Arial, sans-serif';
  tempContainer.style.fontSize = '14px';
  tempContainer.style.lineHeight = '1.4';
  
  // Ensure all text is visible and properly styled for PDF
  const allElements = clonedElement.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i] as HTMLElement;
    el.style.color = '#000000';
    el.style.backgroundColor = 'transparent';
    if (el.classList.contains('bg-primary') || el.classList.contains('bg-secondary')) {
      el.style.backgroundColor = '#f5f5f4';
      el.style.border = '1px solid #d6d3d1';
    }
  }
  
  tempContainer.appendChild(clonedElement);
  
  // Temporarily add to DOM (hidden)
  document.body.appendChild(tempContainer);
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '800px';

  return html2pdf()
    .from(tempContainer)
    .set(options)
    .save()
    .then(() => {
      // Clean up
      document.body.removeChild(tempContainer);
      console.log('PDF generated successfully');
    })
    .catch((error) => {
      console.error('PDF generation error:', error);
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    });
};