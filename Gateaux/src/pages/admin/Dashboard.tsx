import React, { useEffect, useContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from './Sidebar';
import '../../assets/CSS/Dashboard.css';

interface DashboardProps {
  children: ReactNode;
}

interface Message {
  id: number;
  name: string;
  message: string;
  status: string;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.user != null;
  const [unreadCount, setUnreadCount] = useState<number>(0); 



 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);


  const fetchUnreadCount = async () => {
    try {
      
      const response = await fetch('http://localhost:3001/contact/contact');
      if (response.ok) {
        const data = await response.json();
        const newUnreadCount = data.filter((message:Message) => message.status === 'unread').length;
        setUnreadCount(newUnreadCount);
      } else {
        console.error('Erreur lors de la récupération du nombre de messages non lus.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de messages non lus :', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount(); 
    console.log('fetchUnreadCount');
  }, []);

  return (
    <div className="dashboard">
     
      <Sidebar unreadCount={unreadCount} />
      <div className="titles">
          <h1>Administration</h1>
          <h2>Tableau de bord</h2>
        </div>
        <div className="text">
          <p>Bienvenue sur votre tableau de bord. Vous pouvez gérer les pâtisseries, les utilisateurs et les messages.</p>
        </div>
        
      <div className="content">{children}</div>
    </div>
  );
};

export default Dashboard;
