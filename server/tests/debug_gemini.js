const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

async function testConnection() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Test both 2.0-flash and 1.5-flash
    const modelsToTest = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            console.log(`[SUCCESS] ${modelName} responded:`, result.response.text());
            // If success, we found a winner.
        } catch (error) {
            console.error(`[FAILED] ${modelName}:`, error.message);
        }
    }
}

testConnection();
