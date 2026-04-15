export function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const base64 = reader.result.split(",")[1]; // remove prefix
            resolve(base64);
        };

        reader.onerror = reject;
    });
}