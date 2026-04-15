import Tesseract from "tesseract.js";

export async function extractTextFromImage(base64Data) {
    try {
        const base64 = base64Data.split(",")[1] || base64Data;

        const buffer = Buffer.from(base64, "base64");

        const { data } = await Tesseract.recognize(buffer, "eng", {
            logger: (m) => {
                if (m.status === "recognizing text") {
                    console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                }
            },
        });

        return data.text;
    } catch (err) {
        console.error("OCR Error:", err);
        throw new Error("Failed to extract text from image");
    }
}