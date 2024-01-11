import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/CSS/Sidebar.css';

interface SidebarProps {
  unreadCount: number; // Propriété pour le nombre de messages non lus
}

const Sidebar: React.FC<SidebarProps> = ({ unreadCount }) => {
  const hasUnreadMessages = unreadCount > 0;
  console.log('unreadCount', unreadCount)
  console.log('hasUnreadMessages', hasUnreadMessages);

  return (
    <aside className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard/pastry">Gestion des Pâtisseries</Link>
        </li>
        <li>
          <Link to="/dashboard/users">Utilisateurs Connectés</Link>
        </li>
        <li>
          <Link to="/dashboard/messages">
            Messages
            {hasUnreadMessages && <span className="badge">{" "}{unreadCount}</span>}
          </Link>
        </li>
        <li>
          <Link to="/">Quitter le Dashboard</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;