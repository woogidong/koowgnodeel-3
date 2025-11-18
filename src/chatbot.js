import './style.css'
import { fetchMathTermExplanation } from './api.js'

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

  const container = document.createElement('div')
  container.className = 'chatbot-container'

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

    const answer = await fetchMathTermExplanation(term)

    // 로딩 메시지 제거 후 실제 답변 추가
    chatWindow.removeChild(loadingMessage)
    chatWindow.appendChild(
      createChatMessageElement({ sender: 'bot', text: answer })
    )
    chatWindow.scrollTop = chatWindow.scrollHeight
  }

  form.addEventListener('submit', handleSubmit)
}


