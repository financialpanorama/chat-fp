import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyB95_dUbRZjEyqjKFo6mgWR6qQBLGnJ6yI",
  authDomain: "financial-panorama.firebaseapp.com",
  projectId: "financial-panorama",
  storageBucket: "financial-panorama.firebasestorage.app",
  messagingSenderId: "800114536289",
  appId: "1:800114536289:web:910dd6b0b9b9ba2acedf20",
  measurementId: "G-W1V12G7BPH"
};

initializeApp(firebaseConfig);
const db = getFirestore();

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;
    await addDoc(collection(db, 'messages'), {
      nickname: nickname.trim(),
      message: message.trim(),
      createdAt: serverTimestamp(),
    });
    setMessage('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Forum Financial Panorama</h2>

      <div style={styles.inputBox}>
        <input
          placeholder="Il tuo nome o nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.messagesBox}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.card}>
            <div style={styles.avatar}>
              {msg.nickname?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={styles.content}>
              <strong>{msg.nickname}</strong>
              <p style={styles.text}>{msg.message}</p>
              <span style={styles.timestamp}>
                {msg.createdAt?.toDate?.().toLocaleString() || '...'}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSend} style={styles.form}>
        <input
          placeholder="Scrivi un messaggio"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Invia
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 600,
    margin: '40px auto',
    padding: 16,
    background: '#f9f9f9',
    borderRadius: 16,
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#111',
  },
  inputBox: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  messagesBox: {
    maxHeight: 400,
    overflowY: 'auto',
    marginBottom: 16,
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    background: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 12,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  text: {
    margin: '4px 0',
    lineHeight: 1.4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  form: {
    display: 'flex',
    gap: 8,
  },
  button: {
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0 16px',
    fontSize: 16,
    cursor: 'pointer',
  },
};

export default App;