"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from "firebase/firestore";
import Image from "next/image";
import styles from "./enquiries.module.css";
import parentStyles from "../admin.module.css";

interface ChatSession {
  id: string; // The user's UID
  userId: string;
  userName: string;
  userEmail?: string;
  lastMessage: string;
  lastMessageAt: any;
  unreadCountAdmin?: number;
}

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: any;
  productContext?: {
    id: string;
    name: string;
    image: string;
  };
}

export default function EnquiriesPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch all chat sessions for the sidebar
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    // Sort by lastMessageAt descending if possible, but for simplicity we'll just subscribe and sort client-side
    // as indexing might be required for complex server-side ordering.
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const fetchedChats: ChatSession[] = [];
      snapshot.forEach(doc => {
        fetchedChats.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      // Sort newest first
      fetchedChats.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch active chat messages
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, `chats/${activeChatId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      scrollToBottom();
    });

    // Mark as read when opening
    const chatDocRef = doc(db, "chats", activeChatId);
    updateDoc(chatDocRef, { unreadCountAdmin: 0 }).catch(console.error);

    return () => unsubscribe();
  }, [activeChatId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChatId) return;

    const text = replyText.trim();
    setReplyText("");

    try {
      const messageRef = doc(collection(db, `chats/${activeChatId}/messages`));
      await setDoc(messageRef, {
        sender: "admin",
        text: text,
        createdAt: serverTimestamp()
      });

      // Update the main session document
      const chatDocRef = doc(db, "chats", activeChatId);
      await updateDoc(chatDocRef, {
        lastMessage: `You: ${text}`,
        lastMessageAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to send admin reply", err);
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className={styles.container}>
      <div className={parentStyles.headerActions}>
        <h1 className={parentStyles.pageTitle} style={{marginBottom: 0}}>Customer Enquiries</h1>
        <p className={styles.subtitle}>Manage real-time conversations and product questions.</p>
      </div>

      <div className={styles.chatDashboard}>
        {/* Sidebar: Chat List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Active Conversations</h3>
          </div>
          <div className={styles.chatList}>
            {chats.length === 0 ? (
              <p className={styles.noChatsMsg}>No enquiries yet.</p>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`${styles.chatListItem} ${activeChatId === chat.id ? styles.activeItem : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className={styles.avatar}>
                    {chat.userName?.substring(0, 2).toUpperCase() || 'CU'}
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4>{chat.userName || 'Customer'}</h4>
                      {chat.unreadCountAdmin && chat.unreadCountAdmin > 0 ? (
                        <span className={styles.unreadBadge}>New</span>
                      ) : null}
                    </div>
                    <p className={styles.lastMessage}>{chat.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Panel: Conversation Thread */}
        <div className={styles.mainPanel}>
          {activeChatId && activeChat ? (
            <>
              <div className={styles.panelHeader}>
                <div className={styles.panelAvatar}>
                  {activeChat.userName?.substring(0, 2).toUpperCase() || 'CU'}
                </div>
                <div>
                  <h3>{activeChat.userName || 'Customer'}</h3>
                  <p>{activeChat.userEmail || 'No email provided'}</p>
                </div>
              </div>

              <div className={styles.messagesArea}>
                {messages.length === 0 ? (
                  <div className={styles.emptyMessages}>No messages in this conversation.</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'admin' ? styles.wrapperAdmin : styles.wrapperUser}`}>
                      <div className={`${styles.messageBubble} ${msg.sender === 'admin' ? styles.bubbleAdmin : styles.bubbleUser}`}>
                        {msg.productContext && (
                          <div className={styles.productCardContext}>
                            <Image 
                              src={msg.productContext.image} 
                              alt={msg.productContext.name} 
                              width={80} 
                              height={80} 
                              className={styles.productCardImage} 
                            />
                            <div className={styles.productCardDetails}>
                              <span className={styles.productCardLabel}>Enquiring about:</span>
                              <strong className={styles.productCardName}>{msg.productContext.name}</strong>
                            </div>
                          </div>
                        )}
                        {msg.text}
                        <span className={styles.messageTime}>
                          {msg.createdAt ? new Date(msg.createdAt.toMillis()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.replyArea} onSubmit={handleSendReply}>
                <input 
                  type="text" 
                  placeholder="Type your reply to the customer..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="submit" disabled={!replyText.trim()}>Send Reply</button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>Select a conversation</h3>
              <p>Click on a customer from the left sidebar to view their enquiry and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
