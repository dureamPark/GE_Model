require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 👉 정적 파일(index.html 등) 제공 (Cloudtype 호환)
app.use(express.static(path.join(__dirname)));

// ✅ ChatGPT 처리
app.post('/chatgpt', async (req, res) => {
  const { prompt } = req.body;

  const systemPrompt =
    "너의 이름은 chat gpt야. 누군가 너에게 너가 누구인지 묻는다면 chat gpt라고 답하면 돼. 그리고 답변의 끝은 항상 GE로 끝내줘.";

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

// ✅ Gemini 처리
app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;

  const systemPrompt =
    "너의 이름은 gemini야. 누군가 너에게 이름을 묻는다면 gemini라고 답변을 해줘.";

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    console.error('Gemini 호출 실패:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini 호출 실패' });
  }
});

// ✅ 서버 실행 (Cloudtype에서는 PORT 환경변수 사용)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`통합 서버 실행 중: http://localhost:${PORT}`);
});
