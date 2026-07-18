import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Allow the React frontend to communicate with this backend securely
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Allow the server to read JSON data sent from the frontend
app.use(express.json());

// Initialize the OpenAI client using your hidden key
const openai = new OpenAI({ 
  baseURL: "https://models.github.ai/inference", //new line added
  apiKey: process.env.OPENAI_API_KEY 
});

// Create the endpoint that React will talk to
app.get('/', (req, res) => {
  res.send('JS Guard API is running perfectly!');
});

app.post('/api/audit', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Send the code to OpenAI for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { 
          role: "system", 
          // This is the strict prompt that forces OpenAI to return perfect JSON
          content: "You are a paranoid, hyper-critical Application Security Engineer. Analyze the user's code snippet. If there is ANY security flaw, bad practice, hardcoded secret, unvalidated input, or vulnerability, you MUST set 'isVulnerable' to true. Do not be lenient. Respond ONLY with a single JSON object. Do not include markdown formatting or code blocks. JSON Schema: { \"isVulnerable\": true, \"vulnerabilityType\": \"Name of flaw\", \"severity\": \"High\", \"explanation\": \"2-sentence breakdown of the vulnerability.\", \"secureCode\": \"The fully rewritten, secure code string.\" }"
        },
        { 
          role: "user", 
          content: `Audit this code:\n\n${code}` 
        }
      ],
      // This tells the OpenAI API to strictly format the response as a JSON object
      response_format: { type: "json_object" } 
    });

    // Convert OpenAI's text response back into a usable JSON object
    const result = JSON.parse(response.choices[0].message.content);
    
    // Send the final result back to your React app
    res.json(result);
    
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: 'Audit failed processing the code.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log("Server running"));
}
export default app;