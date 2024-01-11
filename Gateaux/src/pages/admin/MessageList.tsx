import React, { useState, useEffect } from 'react';
import '../../assets/CSS/MessageList.css';

interface Message {
    id: number;
    name: string;
    message: string;
    status: string;
  }

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); 
  const [, setUnreadCount] = useState<number>(0);

  const unreadCount = messages.filter((message) => message.status === 'unread').length;


  useEffect(() => {
    // Logique pour récupérer la liste des messages depuis l'API
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3001/contact/contact');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Erreur lors de la récupération des messages.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchMessages();
  }, []);
  
  const markMessageAsRead = async (messageId: number) => {
    try {
        const response = await fetch(`http://localhost:3001/contact/contact/${messageId}/read`, {
            method: 'PATCH',
        });
        if (response.ok) {
            // Mettre à jour l'état local pour refléter le changement
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.id === messageId ? { ...message, status: 'read' } : message
                )
            );
            setUnreadCount((prevCount) => prevCount - 1);
        } else {
            console.error('Erreur lors de la mise à jour du statut du message.');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut du message :', error);
    }
};

useEffect(() => {
  const unreadMessages = messages.filter((message) => message.status === 'unread');
  setUnreadCount(unreadMessages.length);
}, [messages]);
  return (
    <div className="message-list">
      <h2>Liste des Messages</h2>
      <p>Nombre de nouveaux messages non lus : {unreadCount}</p>
      <ul>
      {messages.map((message) => (
                    <li key={message.id}>
                        <p><strong>Nom :</strong> {message.name}</p>
                        <p><strong>Message :</strong> {message.message}</p>
                        {message.status === 'unread' && (
                            <button onClick={() => markMessageAsRead(message.id)}>Marquer comme lu</button>
                        )}
                    </li>
                ))}
      </ul>
    </div>
  );
};

export default MessageList;
