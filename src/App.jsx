import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB95_dUbRZjEyqjKFo6mgWR6qQBLGnJ6yI",
  authDomain: "financial-panorama.firebaseapp.com",
  projectId: "financial-panorama",
  storageBucket: "financial-panorama.firebasestorage.app",
  messagingSenderId: "800114536289",
  appId: "1:800114536289:web:910dd6b0b9b9ba2acedf20",
  measurementId: "G-W1V12G7BPH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, 'messages');

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || nickname.trim() === '') return;
    await addDoc(messagesRef, {
      text: newMessage,
      nickname,
      timestamp: new Date()
    });
    setNewMessage('');
  };

  return (
    <div style={{
      maxWidth: "100%",
      margin: '100% auto',
      padding: 24,
      borderRadius: 24,
      background: '#ffffff',
      boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
      fontFamily: 'inherit'
    }}>
      <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 24 }}>💬 Chat Community</h2>

      <div style={{
        maxHeight: 300,
        overflowY: 'auto',
        padding: 16,
        background: '#f2f2f7',
        borderRadius: 16,
        marginBottom: 24
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            padding: '10px 14px',
            marginBottom: 12,
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <strong style={{ color: '#007aff' }}>{msg.nickname}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        placeholder="Il tuo nome o nickname"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        style={{
          padding: 12,
          width: '100%',
          marginBottom: 12,
          borderRadius: 12,
          border: '1px solid #ccc',
          outline: 'none'
        }}
      />

      <div style={{ display: 'flex', gap: 12 }}>
        <input
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
        <button onClick={sendMessage} style={{
          padding: '12px 20px',
          background: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'background 0.2s ease-in-out'
        }}
          onMouseOver={(e) => e.target.style.background = '#005ecb'}
          onMouseOut={(e) => e.target.style.background = '#007aff'}
        >
          Invia
        </button>
      </div>
    </div>
  );
}