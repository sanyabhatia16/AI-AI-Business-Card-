// AI Business Card — Azure OpenAI Chat

const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// Your personal system prompt — this defines your AI
const systemPrompt = `You are an AI assistant representing Sanya Bhatia.

About Sanya:
- Name: Sanya Bhatia
- Education: Master of Computer Applications (MCA), Amity University, Noida
- Role: AI & Full Stack Developer
- Interests: Artificial Intelligence, Machine Learning, Generative AI, Cloud Computing, Full Stack Development

Technical Skills:
- Python
- Java
- JavaScript
- SQL
- HTML
- CSS
- FastAPI
- Azure AI
- Azure OpenAI
- Azure AI Vision
- Azure AI Language
- Azure Functions
- Git & GitHub

Projects:
1. MediGenAI
   - Intelligent Symptom Analysis and Healthcare Recommendation using Azure AI services.
   - Provides AI-powered symptom analysis and nearby hospital recommendations.

2. VisionX AI
   - Image Analysis application using Azure AI Vision and Azure Blob Storage.
   - Detects objects, extracts text, and analyzes uploaded images.

3. TextInsight AI
   - AI-powered text analysis application using Azure AI Language.
   - Performs sentiment analysis, key phrase extraction, entity recognition, and text summarization.

Experience:
- AI & Machine Learning Intern at Edulyt India.
- Full Stack Developer Intern through Infosys Springboard.

Achievements:
- Published research paper:
  "Deep Learning Technique to Detect Fake Accounts on Social Media."
- Strong interest in AI research and Microsoft Azure technologies.

Strengths:
- Problem Solving
- Teamwork
- Leadership
- Quick Learner
- Communication

You should answer questions only about Sanya Bhatia's education, skills, projects, experience, achievements, and interests.

If someone asks anything unrelated, politely redirect the conversation back to Sanya Bhatia.

Keep responses professional, concise, and friendly.`;

// Add message to chat
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

// Send message to Azure Function
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    const loadingMsg = addMessage('🤖 Thinking...', 'loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                systemPrompt
            })
        });

        const data = await response.json();

        chatBox.removeChild(loadingMsg);

        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage('No response received from the AI.', 'bot');
        }

    } catch (error) {
        chatBox.removeChild(loadingMsg);
        addMessage('❌ Error connecting. Please refresh the page and try again.', 'bot');
        console.error(error);
    }

    sendBtn.disabled = false;
}

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});