// Zoom Levels Storage
const zoomLevels = {
    frontPreview: 1,
    backPreview: 1
};

// Adjust Crop / Zoom Function
function adjustZoom(containerId, change) {
    const container = document.getElementById(containerId);
    const element = container.querySelector('img') || container.querySelector('canvas');
    if (!element) return;

    zoomLevels[containerId] = Math.max(0.5, Math.min(2.5, zoomLevels[containerId] + change));
    element.style.transform = `scale(${zoomLevels[containerId]})`;
}

// Reset Crop / Zoom Function
function resetZoom(containerId) {
    const container = document.getElementById(containerId);
    const element = container.querySelector('img') || container.querySelector('canvas');
    if (!element) return;

    zoomLevels[containerId] = 1;
    element.style.transform = `scale(1)`;
}

document.addEventListener('DOMContentLoaded', () => {
    const frontFileInput = document.getElementById('frontFileInput');
    const backFileInput = document.getElementById('backFileInput');
    const frontPreview = document.getElementById('frontPreview');
    const backPreview = document.getElementById('backPreview');
    const directPrintBtn = document.getElementById('downloadPdfBtn') || document.getElementById('directPrintBtn');

    if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    }

    async function processFile(file, targetContainer) {
        if (!file) return;

        targetContainer.innerHTML = `<span>⏳ Processing...</span>`;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                targetContainer.innerHTML = `<img src="${event.target.result}" alt="Card Image">`;
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
                alert("PDF लोड करने में समस्या आई!");
                targetContainer.innerHTML = `<span>Error Loading</span>`;
            }
        }
    }

    if (frontFileInput) {
        frontFileInput.addEventListener('change', (e) => {
            zoomLevels.frontPreview = 1;
            processFile(e.target.files[0], frontPreview);
        });
    }

    if (backFileInput) {
        backFileInput.addEventListener('change', (e) => {
            zoomLevels.backPreview = 1;
            processFile(e.target.files[0], backPreview);
        });
    }

    // Direct Print Command
    if (directPrintBtn) {
        directPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
