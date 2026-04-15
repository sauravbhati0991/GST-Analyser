import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MODELS = [
    "llama-3.3-70b-versatile", // ✅ Very smart, standard for JSON
    "llama-3.1-8b-instant",   // ⚡ fallback
];

// 🧹 Safe JSON extraction
function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI response");
    return JSON.parse(match[0]);
}

export async function analyseWithGroq(text) {
    let lastError = null;

    for (const model of MODELS) {
        try {
            console.log(`⚡ Trying Groq model: ${model}`);

            const prompt = `
Extract GST invoice data into JSON.

Fields:
- invoice: number, date, totalAmount, totalTax
- seller: name, gstin
- buyer: name, gstin
- items: description, quantity, rate, taxableAmount, gstRate, cgst, sgst, igst
- taxSummary: totalTaxableAmount, totalCGST, totalSGST, totalIGST, grandTotal

Text:
${text}

Return ONLY valid JSON.
`;

            const response = await groq.chat.completions.create({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: 1500,
                response_format: { type: "json_object" }
            });

            const content = response.choices[0]?.message?.content;

            return extractJSON(content);

        } catch (err) {
            console.warn(`❌ ${model} failed:`, err.message);
            lastError = err;
            continue;
        }
    }

    throw new Error(lastError?.message || "All Groq models failed");
}