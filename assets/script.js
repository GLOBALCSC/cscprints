document.addEventListener('DOMContentLoaded', () => {
    const frontFileInput = document.getElementById('frontFileInput');
    const backFileInput = document.getElementById('backFileInput');
    const frontPreview = document.getElementById('frontPreview');
    const backPreview = document.getElementById('backPreview');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    // Helper function to process uploaded file (Image or PDF)
    async function processFile(file, targetContainer) {
        if (!file) return;

        targetContainer.innerHTML = `<span>⏳ Loading...</span>`;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                targetContainer.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            try {
                const fileArrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
                const page = await pdf.getPage(1);
                const scale = 2;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                targetContainer.innerHTML = '';
                targetContainer.appendChild(canvas);
            } catch (error) {
                console.error(error);
                alert("PDF लोड करने में दिक्कत हुई!");
                targetContainer.innerHTML = `<span>Error</span>`;
            }
        } else {
            alert('कृपया इमेज या PDF फाइल ही चुनें!');
        }
    }

    // Front File Selection
    if (frontFileInput) {
        frontFileInput.addEventListener('change', (e) => {
            processFile(e.target.files[0], frontPreview);
        });
    }

    // Back File Selection
    if (backFileInput) {
        backFileInput.addEventListener('change', (e) => {
            processFile(e.target.files[0], backPreview);
        });
    }

    // Action Button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            alert('A4 / 4x6 HD Print Sheet तैयार है!');
        });
    }
});
