import './style.css'
import {
  fetchMathTermExplanation,
  DEFAULT_PROMPT_TEMPLATE,
} from './api.js'

function createChatMessageElement({ sender, text }) {
  const messageEl = document.createElement('div')
  messageEl.className = `chat-message chat-message--${sender}`

  const bubbleEl = document.createElement('div')
  bubbleEl.className = 'chat-bubble'
  bubbleEl.textContent = text

  messageEl.appendChild(bubbleEl)
  return messageEl
}

export function setupChatbot(rootElement) {
  if (!rootElement) return

  rootElement.innerHTML = ''

  // 개발자용 프롬프트 상태
  let currentPromptTemplate = ''

  const container = document.createElement('div')
  container.className = 'chatbot-container'

  // === 개발자용 프롬프트 설정 영역 ===
  const promptPanel = document.createElement('section')
  promptPanel.className = 'prompt-panel'

  const promptHeader = document.createElement('div')
  promptHeader.className = 'prompt-panel-header'
  promptHeader.innerHTML = `
    <h2 class="prompt-title">개발자용 프롬프트 설정</h2>
    <p class="prompt-subtitle">
      현재 기본 프롬프트는 placeholder로 표시됩니다. 여기서 장문의 텍스트를 입력해 프롬프트를 실험해 보세요.
    </p>
  `

  const promptTextarea = document.createElement('textarea')
  promptTextarea.className = 'prompt-textarea'
  promptTextarea.rows = 5
  promptTextarea.placeholder = DEFAULT_PROMPT_TEMPLATE

  const promptControls = document.createElement('div')
  promptControls.className = 'prompt-controls'

  const promptStatus = document.createElement('span')
  promptStatus.className = 'prompt-status'
  promptStatus.textContent = '기본 프롬프트 사용 중'

  const promptApplyButton = document.createElement('button')
  promptApplyButton.type = 'button'
  promptApplyButton.className = 'prompt-apply-btn'
  promptApplyButton.textContent = '프롬프트 적용'

  promptApplyButton.addEventListener('click', () => {
    currentPromptTemplate = promptTextarea.value.trim()
    promptStatus.textContent = currentPromptTemplate
      ? '사용자 프롬프트가 적용되었습니다.'
      : '기본 프롬프트 사용 중'
    promptStatus.classList.add('prompt-status--active')
    setTimeout(() => {
      promptStatus.classList.remove('prompt-status--active')
    }, 1200)
  })

  promptControls.appendChild(promptStatus)
  promptControls.appendChild(promptApplyButton)

  promptPanel.appendChild(promptHeader)
  promptPanel.appendChild(promptTextarea)
  promptPanel.appendChild(promptControls)

  const header = document.createElement('div')
  header.className = 'chatbot-header'
  header.innerHTML = `
    <h1 class="chatbot-title">수학 용어 챗봇</h1>
    <p class="chatbot-subtitle">수학 용어를 입력하면 정의와 간단한 예시를 알려드려요.</p>
  `

  const chatWindow = document.createElement('div')
  chatWindow.className = 'chat-window'

  const form = document.createElement('form')
  form.className = 'chat-form'

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = '예: 미분, 적분, 로그, 벡터 ...'
  input.className = 'chat-input'
  input.autocomplete = 'off'

  const button = document.createElement('button')
  button.type = 'submit'
  button.textContent = '검색'
  button.className = 'chat-submit'

  const helper = document.createElement('p')
  helper.className = 'chat-helper'
  helper.textContent = '수학 용어 한 가지를 간단히 적어 주세요.'

  // 컨테이너에 순서대로 배치: 프롬프트 설정 → 헤더 → 챗윈도우 → 입력폼
  container.appendChild(promptPanel)
  form.appendChild(input)
  form.appendChild(button)

  container.appendChild(header)
  container.appendChild(chatWindow)
  container.appendChild(form)
  container.appendChild(helper)

  rootElement.appendChild(container)

  // 초기 안내 메시지
  chatWindow.appendChild(
    createChatMessageElement({
      sender: 'bot',
      text: '안녕하세요! 알고 싶은 수학 용어를 입력하면 정의와 간단한 예시를 알려드릴게요 🙂',
    })
  )

  async function handleSubmit(event) {
    event.preventDefault()
    const term = input.value.trim()
    if (!term) return

    // 사용자 메시지 추가
    chatWindow.appendChild(
      createChatMessageElement({ sender: 'user', text: term })
    )
    input.value = ''

    // 로딩 메시지
    const loadingMessage = createChatMessageElement({
      sender: 'bot',
      text: '생각 중이에요...',
    })
    chatWindow.appendChild(loadingMessage)
    chatWindow.scrollTop = chatWindow.scrollHeight

    const answer = await fetchMathTermExplanation(term, currentPromptTemplate)

    // 로딩 메시지 제거 후 실제 답변 추가
    chatWindow.removeChild(loadingMessage)
    chatWindow.appendChild(
      createChatMessageElement({ sender: 'bot', text: answer })
    )
    chatWindow.scrollTop = chatWindow.scrollHeight
  }

  form.addEventListener('submit', handleSubmit)
}


