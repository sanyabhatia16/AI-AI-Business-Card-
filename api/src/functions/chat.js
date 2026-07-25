const { app } = require("@azure/functions");
const { AzureOpenAI } = require("openai");

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",

  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { message, systemPrompt } = body;

      const client = new AzureOpenAI({
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_KEY,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION,
      });

      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
      });

      return {
        status: 200,
        jsonBody: {
          reply: response.choices[0].message.content,
        },
      };
    } catch (error) {
      console.error("Azure OpenAI Error:", error);

      return {
        status: 500,
        jsonBody: {
          success: false,
          error: error.message,
          details: error.stack,
        },
      };
    }
  },
});