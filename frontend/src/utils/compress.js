export async function compressImage(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            // Skip compression for PDFs
            return resolve(file);
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        reader.onerror = reject;

        img.onload = () => {
            const canvas = document.createElement("canvas");

            const MAX_WIDTH = 800;
            const scale = Math.min(1, MAX_WIDTH / img.width);

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => resolve(blob),
                "image/jpeg",
                0.6
            );
        };

        reader.readAsDataURL(file);
    });
}