import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

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

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !nickname.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      nickname,
      timestamp: new Date(),
    });
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard}>
            <div style={styles.avatar}>{msg.nickname[0].toUpperCase()}</div>
            <div>
              <div style={styles.nickname}>{msg.nickname}</div>
              <div style={styles.text}>{msg.text}</div>
              <div style={styles.time}>
                {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputBox}>
        <input
          placeholder="Nickname"
          style={styles.input}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          placeholder="Scrivi un messaggio..."
          style={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={styles.button}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "-apple-system, Inter, sans-serif",
  backgroundColor: "#fff",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 16,
  paddingBottom: 100, // sufficiente spazio per input
},
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
},
  messageCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#ffffffff",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#6B00FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    flexShrink: 0,
    alignSelf: "flex-start",
},
  nickname: {
    fontWeight: 600,
    marginBottom: 4,
    fontSize: 14,
  },
  text: {
    fontSize: 15,
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  inputBox: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderTop: "1px solid #eee",
  },
  input: {
    flex: 1,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    padding: "0 16px",
    fontSize: 18,
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default App;