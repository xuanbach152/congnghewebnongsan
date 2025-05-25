import { useEffect, useRef, useState } from 'react'
import './chatBox.scss'
import io from 'socket.io-client'
import axiosInstance from 'utils/api'
import { FaComments } from 'react-icons/fa'
import { useTokenVerification } from 'utils/tokenVerification'

const socket = io('https://congnghewebnongsan.onrender.com')

export function ChatBox({ isChatOpen, setIsChatOpen, shopChat, customerId }) {
  const userId = localStorage.getItem('userId')
  const partnerId = customerId || shopChat?.userId

  const [selectedChat, setSelectedChat] = useState(null)
  const [chatBoxes, setChatBoxes] = useState([])
  const [content, setContent] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const lastMessageRef = useRef(null)

  const isVerified = useTokenVerification()

  useEffect(() => {
    if (!isVerified) return
    if (userId && partnerId) {
      handleChat(partnerId)
    }
  }, [userId, partnerId, isVerified])

  useEffect(() => {
    if (!isVerified) return
    const fetchChatBoxes = async () => {
      const response = await axiosInstance.get('/chatBox/user')
      const chatBoxesData = response.data.data.map((item) => {
        const partner = item.users.find((user) => user._id !== userId)
        return {
          id: item._id,
          partner: { id: partner._id, name: partner.userName, imgUrl: partner.imgUrl },
          messages: item.messages,
        }
      })
      setChatBoxes(chatBoxesData)
    }
    fetchChatBoxes()
  }, [isVerified, userId])

  useEffect(() => {
    if (!isVerified) return
    if (!selectedChat) return

    socket.emit('join', { chatBoxId: selectedChat.id })

    const handleMessage = ({ chatBoxId, content, senderId }) => {
      if (chatBoxId === selectedChat.id) {
        setChatBoxes((prevChatBoxes) => {
          return prevChatBoxes.map((chatBox) => {
            if (chatBox.id === chatBoxId) {
              const newMessage = { senderId, content }
              const updatedMessages = [...chatBox.messages, newMessage]
              return { ...chatBox, messages: updatedMessages }
            }
            return chatBox
          })
        })
      }
    }

    socket.on('message', handleMessage)
    return () => socket.off('message', handleMessage)
  }, [isVerified, selectedChat, userId])

  useEffect(() => {
    if (!isVerified) return
    if (!selectedChat) return
    const updated = chatBoxes.find((chatBox) => chatBox.id === selectedChat.id)
    if (updated) {
      setSelectedChat(updated)
    }
  }, [chatBoxes, isVerified, selectedChat])

  useEffect(() => {
    if (!isVerified) return
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isVerified, selectedChat])

  const handleSendMessage = () => {
    if (!content.trim() || !selectedChat) return
    socket.emit('message', {
      chatBoxId: selectedChat.id,
      userId,
      content,
    })
    setContent('')
  }

  console.log(selectedChat);

  const handleChat = async (partnerId) => {
    const response = await axiosInstance.post('/chatBox/create', { partnerId })
    const newChatBox = response.data.data
    const partner = newChatBox.users.find((user) => user._id !== userId)
    const formattedChatBox = {
      id: newChatBox._id,
      partner: { id: partner._id, name: partner.userName },
      messages: newChatBox.messages || [],
    }
    const existing = chatBoxes.find(
      (chatBox) => chatBox.id === formattedChatBox.id
    )
    if (!existing) {
      setChatBoxes([formattedChatBox, ...chatBoxes])
    }
    setSelectedChat(formattedChatBox)
    socket.emit('join', { chatBoxId: formattedChatBox.id })
  }

  if (!isOpen && !isChatOpen) {
    return (
      <div className="chat-icon" onClick={() => setIsOpen(true)}>
        <FaComments />
      </div>
    )
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-sidebar">
        <div className="sidebar-header">Tin nhắn</div>
        {chatBoxes.map((chatBox, index) => (
          <div
            key={index}
            className={`sidebar-item ${selectedChat?.id === chatBox.id ? 'active' : ''}`}
            onClick={() => setSelectedChat(chatBox)}
          > 
            <div className='partner-info'> 
              <div className="partner-avatar">
              <img src={chatBox.partner?.imgUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Avatar" />
            </div>
            <div className="partner-name">
              {chatBox.partner?.name || 'Người dùng'}
            </div>
            </div>
            <div className="last-message">
              {chatBox.messages[chatBox.messages.length - 1]?.content ||
                'Chưa có tin nhắn'}
            </div>
          </div>
        ))}
      </div>

      <div className="chatbox">
        <div className="chatbox-header">
          <div className="chatbox-title">
            <img src={selectedChat?.partner?.imgUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Avatar" />
            {selectedChat?.partner?.name || 'Chọn một đoạn chat'}
          </div>
          <button
            className="close-btn"
            onClick={() => {
              setIsOpen(false)
              setIsChatOpen(false)
            }}
          >
            ×
          </button>
        </div>

        <div className="chatbox-messages">
          {selectedChat?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
              ref={
                idx === selectedChat.messages.length - 1 ? lastMessageRef : null
              }
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chatbox-input">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Gửi</button>
        </div>
      </div>
    </div>
  )
}
