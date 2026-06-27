import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../App'
import { sendChat } from '../api/services'

const QUICK = ['점심 추천해줘', '매운 거 먹고 싶어', '가볍게 먹고 싶어', '혼밥 메뉴 추천']

export default function ChatBot() {
  const { user } = useAuth()
  const [open,     setOpen]    = useState(false)
  const [messages, setMessages]= useState([])
  const [input,    setInput]   = useState('')
  const [loading,  setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!user) return null   // 비회원 숨김

  const addMsg = (role, content) =>
    setMessages(prev => [...prev, { role, content }])

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    addMsg('user', msg)
    setInput('')
    setLoading(true)
    try {
      const data = await sendChat(msg, messages)
      addMsg('assistant', data.reply)
    } catch (e) {
      addMsg('assistant', e.response?.data?.error ?? '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gray-900 text-white text-2xl shadow-lg hover:scale-105 transition-transform z-50 flex items-center justify-center"
        aria-label="AI 챗봇"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* 챗봇 창 */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[460px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-50">
          {/* 헤더 */}
          <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">🤖 AI 메뉴 추천</p>
              <p className="text-xs opacity-60">GPT · {user.nickname}님 맞춤</p>
            </div>
            <button
              onClick={() => { setMessages([]); setInput('') }}
              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
            >
              초기화
            </button>
          </div>

          {/* 대화 영역 */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                안녕하세요 {user.nickname}님! 🍽️<br />
                오늘 뭐 드시고 싶으세요?
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK.map(q => (
                    <button key={q} onClick={() => send(q)}
                      className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full hover:bg-blue-100">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap leading-relaxed
                  ${m.role === 'user'
                    ? 'self-end bg-gray-900 text-white rounded-br-sm'
                    : 'self-start bg-gray-100 text-gray-800 rounded-bl-sm'}`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-gray-100 text-gray-400 px-3 py-2 rounded-xl text-sm">
                생각 중... 🤔
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* 입력 */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="메시지 입력..."
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-gray-400"
            />
            <button onClick={() => send()} disabled={loading}
              className="btn-dark rounded-full px-4 text-sm">
              전송
            </button>
          </div>
        </div>
      )}
    </>
  )
}
