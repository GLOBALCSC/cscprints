// CSC Print Portal - ID Card Auto Crop & Print Logic

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const frontPreview = document.getElementById('frontPreview');
    const backPreview = document.getElementById('backPreview');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    // Configure PDF.js worker
    if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            frontPreview.innerHTML = `<span>⏳ Processing File...</span>`;
            backPreview.innerHTML = `<span>⏳ Processing File...</span>`;

            // If file is Image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    frontPreview.innerHTML = `<img src="${event.target.result}" alt="Front Side">`;
                    backPreview.innerHTML = `<p style="padding:10px; color:#6c757d;">(Optional) दूसरी फ़ाइल अपलोड करें या Crop एडजस्ट करें</p>`;
                };
                reader.readAsDataURL(file);
            } 
            // If file is PDF (Aadhaar, PAN, Voter, DL)
            else if (file.type === 'application/pdf') {
                try {
                    const fileArrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
                    
                    // Render First Page of PDF
                    const page = await pdf.getPage(1);
                    const scale = 2; // High Resolution
                    const viewport = page.getViewport({ scale });

                    // Canvas 1 (Front Side)
                    const canvasFront = document.createElement('canvas');
                    const contextFront = canvasFront.getContext('2d');
                    canvasFront.height = viewport.height;
                    canvasFront.width = viewport.width;

                    await page.render({ canvasContext: contextFront, viewport: viewport }).promise;

                    // Display Front & Back Preview
                    frontPreview.innerHTML = '';
                    frontPreview.appendChild(canvasFront);

                    backPreview.innerHTML = `<p style="padding:15px; color:#198754; font-weight:bold;">✅ PDF Rendered Successfully!<br><small>Ready for PVC Printable Layout</small></p>`;

                } catch (error) {
                    console.error(error);
                    alert("PDF पढ़ने में समस्या आई! अगर PDF पासवर्ड प्रोटेक्टेड है, तो कृपया सही फ़ाइल चुनें।");
                    frontPreview.innerHTML = `<span>Front Preview</span>`;
                    backPreview.innerHTML = `<span>Back Preview</span>`;
                }
            } else {
                alert('कृपया केवल PDF या Image फ़ाइल ही चुनें!');
            }
        });
    }

    // Generate Printable PDF Action
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            alert('🎉 A4 / 4x6 HD Printable Sheet जल्द ही डाउनलोड होगी! लेआउट ऑटो-सेट हो गया है।');
        });
    }
});
