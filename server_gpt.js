require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chatgpt', async (req, res) => {
  const { prompt } = req.body;

  // ✅ 시스템 프롬프트 (GPT에게 역할 지시)
  const systemPrompt = "너의 이름은 chat gpt야. 누군가 너에게 너가 누구인지 묻는다면 chat gpt라고 답하면 돼. 그리고 답변의 끝은 항상 GE로 끝내줘.";

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt }, // 🧠 전제 조건
          { role: 'user', content: prompt }          // 👤 사용자 질문
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('ChatGPT 호출 실패:', error.response?.data || error.message);
    res.status(500).json({ error: 'ChatGPT 호출 실패' });
  }
});

app.listen(3001, () => {
  console.log('ChatGPT 서버 실행 중: http://localhost:3001');
});
