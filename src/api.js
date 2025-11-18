// OpenAI GPT API 래퍼
// .env 또는 Netlify 환경 변수에 `VITE_OPENAI_API_KEY`가 설정되어 있어야 합니다.
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.warn(
    '[api.js] VITE_OPENAI_API_KEY가 설정되어 있지 않습니다. .env 또는 Netlify 환경 변수를 확인하세요.'
  )
}

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o-mini'

/**
 * 수학 용어 정의와 간단한 사용 예시를 반환하는 함수
 * @param {string} term - 검색할 수학 용어
 * @returns {Promise<string>} - GPT의 응답 텍스트
 */
export async function fetchMathTermExplanation(term) {
  if (!term || !term.trim()) {
    return '검색어를 입력해주세요.'
  }

  if (!OPENAI_API_KEY) {
    return 'API Key가 설정되어 있지 않아 요청을 보낼 수 없습니다. 관리자에게 문의하세요.'
  }

  const prompt = `당신은 수학 교사입니다.
사용자가 수학 용어를 입력하면 다음 형식으로 한국어로만 답변하세요.

1) 정의: 한두 문장으로 직관적으로 설명
2) 간단한 사용 예시: 쉬운 예시 1개 (필요하다면 수식 포함)
3) 추가 팁: 고등학생도 이해할 수 있는 짧은 설명

수학 용어: "${term}"`

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              '당신은 한국어로 대답하는 친절한 수학 선생님입니다. 설명은 가능한 한 간단하고 직관적으로 해주세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      return 'GPT API 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content?.trim()

    return (
      answer ||
      '응답을 이해하지 못했습니다. 다른 용어로 다시 시도해 주세요.'
    )
  } catch (error) {
    console.error('OpenAI 요청 실패:', error)
    return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요.'
  }
}


