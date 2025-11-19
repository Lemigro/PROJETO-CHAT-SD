const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log("❌ GEMINI_API_KEY não encontrada no arquivo .env");
      console.log("   Configure a chave em: api-server/.env");
      return;
    }

    console.log("🔑 Chave de API encontrada!");
    console.log("🤖 Testando conexão com Gemini...\n");

    const ai = new GoogleGenAI({});
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Responda em português: O que é JavaScript? (resposta curta)",
    });

    console.log("✅ Gemini respondeu com sucesso!\n");
    console.log("📝 Resposta:");
    console.log("─".repeat(50));
    console.log(response.text);
    console.log("─".repeat(50));
    
  } catch (error) {
    console.error("❌ Erro ao testar Gemini:", error.message);
    if (error.message.includes("API_KEY")) {
      console.log("\n💡 Verifique se a chave de API está correta no arquivo api-server/.env");
    }
  }
}

testGemini();

