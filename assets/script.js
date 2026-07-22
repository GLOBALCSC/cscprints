document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const frontPreview = document.getElementById('frontPreview');
    const backPreview = document.getElementById('backPreview');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    frontPreview.innerHTML = `<img src="${event.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`;
                    backPreview.innerHTML = `<p style="padding:10px; text-align:center;">Back side picture upload karein ya Crop Adjust karein</p>`;
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                frontPreview.innerHTML = `<b>PDF Uploaded:</b><br>${file.name}`;
                backPreview.innerHTML = `<b>Auto-Cropping Front & Back Side...</b>`;
            } else {
                alert('Kripya PDF ya Image file hi chunen!');
            }
        });
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            alert('A4 / 4x6 Printable Sheet PDF generation jald hi chalu hoga!');
        });
    }
});
