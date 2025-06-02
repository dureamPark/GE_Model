require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;

  // ✅ 미리 정의된 컨텍스트 프롬프트
  const systemPrompt = "너의 이름은 gemini야. 누군가 너에게 이름을 묻는다면 gemini라고 답변을 해줘.";

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: systemPrompt }, // ✅ 미리 정의된 설명
              { text: prompt }        // ✅ 사용자 입력
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

app.listen(3000, () => {
  console.log('Gemini 서버 실행 중: http://localhost:3000');
});
