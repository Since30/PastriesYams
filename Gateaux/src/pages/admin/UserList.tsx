import React, { useState, useEffect } from 'react';
import '../../assets/CSS/UserList.css';

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    status: string;
    role: string;
  }

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    // Effectuez la requête GET pour récupérer les utilisateurs depuis votre API
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => {
        // Mettez à jour l'état users avec les données récupérées depuis l'API
        setUsers(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });
  }, []);

  return (
    <div className="user-list">
      <h1>Administration</h1>
      <h2>Liste des Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
