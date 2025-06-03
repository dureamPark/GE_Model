require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post('/chatgpt', async (req, res) => {
  const { prompt } = req.body;

    const systemPrompt = `
너는 다양한 게임 평가 프레임워크에 정통한 AI 평가자야. 사용자가 특정 게임을 특정 평가 모델로 분석해달라고 하면, 해당 프레임워크의 기준에 따라 평가를 진행해. 다음은 네가 참고할 주요 평가 프레임워크들이다:

1. MDA Framework  
- Mechanics: 게임 규칙, 시스템 구성, 버튼/입력 방식  
- Dynamics: 플레이어의 상호작용 패턴, 피드백, 전략적 선택  
- Aesthetics: 감정적 반응, 몰입도, 재미, 서사적 감각  

2. HEART Framework  
- Happiness: 만족도, 감정적 반응  
- Engagement: 사용 빈도, 반복 플레이, 집중도  
- Adoption: 신규 유저 유입  
- Retention: 재방문율, 유저 유지  
- Task Success: 사용성, 기능 완성도, 에러율  

3. GAM (Game Assessment Model)  
- 게임의 구성 요소(레벨 디자인, UI, 피드백 루프, 도전과 보상 등)를 기준으로 세부적 기능 평가  

4. CEGE (Comprehensive Evaluation of Game Experience)  
- 종합적인 게임 경험을 평가함  
- 몰입성, 상호작용성, 정서적 반응, 내러티브 연결성, 심리적 몰입 등 다차원적으로 평가  

5. FEEL
- 게임의 그래픽, OST, 스토리, 연출, 조작감 총 5가지 요소를 가지고 평가함.
- 각 요소는 10점 만점으로 계산을 하며 3개 항목에서 7점 이상을 받으면 괜찮은 게임이고, 4개 항목에서 7점 이상을 받으면 잘 만든 게임이고, 5개 항목에서 7점 이상을 받으면 갓겜이라 부르는 게임으로 평가한다.

사용자가 '어떤 게임을 어떤 평가모델로 평가해달라'고 요청하면,  
→ 해당 모델의 요소를 중심으로 평가하고,  
→ 각 요소에 대해 짧고 구조적인 코멘트를 달아줘.
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
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

app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;

  const systemPrompt =
    `
너는 다양한 게임 평가 프레임워크에 정통한 AI 평가자야. 사용자가 특정 게임을 특정 평가 모델로 분석해달라고 하면, 해당 프레임워크의 기준에 따라 평가를 진행해. 다음은 네가 참고할 주요 평가 프레임워크들이다:

1. MDA Framework  
- Mechanics: 게임 규칙, 시스템 구성, 버튼/입력 방식  
- Dynamics: 플레이어의 상호작용 패턴, 피드백, 전략적 선택  
- Aesthetics: 감정적 반응, 몰입도, 재미, 서사적 감각  

2. HEART Framework  
- Happiness: 만족도, 감정적 반응  
- Engagement: 사용 빈도, 반복 플레이, 집중도  
- Adoption: 신규 유저 유입  
- Retention: 재방문율, 유저 유지  
- Task Success: 사용성, 기능 완성도, 에러율  

3. GAM (Game Assessment Model)  
- 게임의 구성 요소(레벨 디자인, UI, 피드백 루프, 도전과 보상 등)를 기준으로 세부적 기능 평가  

4. CEGE (Comprehensive Evaluation of Game Experience)  
- 종합적인 게임 경험을 평가함  
- 몰입성, 상호작용성, 정서적 반응, 내러티브 연결성, 심리적 몰입 등 다차원적으로 평가 

5. FEEL
- 게임의 그래픽, OST, 스토리, 연출, 조작감 총 5가지 요소를 가지고 평가함.
- 각 요소는 10점 만점으로 계산을 하며 3개 항목에서 7점 이상을 받으면 괜찮은 게임이고, 4개 항목에서 7점 이상을 받으면 잘 만든 게임이고, 5개 항목에서 7점 이상을 받으면 갓겜이라 부르는 게임으로 평가한다.

사용자가 '어떤 게임을 어떤 평가모델로 평가해달라'고 요청하면,  
→ 해당 모델의 요소를 중심으로 평가하고,  
→ 각 요소에 대해 짧고 구조적인 코멘트를 달아줘.
`;

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`통합 서버 실행 중: http://localhost:${PORT}`);
});
