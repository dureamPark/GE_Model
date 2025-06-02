require('dotenv').config(); // .env 파일 읽기
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: question }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    console.error('Gemini API 호출 오류:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API 요청 실패' });
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
