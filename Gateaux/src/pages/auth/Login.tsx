import React, { useState } from 'react';
import '../../assets/CSS/AuthForm.css';
import { useAuth } from '../auth/AuthUtils';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Utilisez "email" au lieu de "username" ici
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    if (shouldRedirect) {
      navigate('/');
    }
  };
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la connexion.');
      }
  
      const token = data.token; // Assurez-vous que la propriété du token dans votre réponse est correcte
      auth.login(data.name);
      localStorage.setItem('name', data.name);
  
      // Stockez le token dans le stockage local
      localStorage.setItem('token', token);
  
      setModalMessage('Connexion réussie ! Vous allez être redirigé vers la page d\'accueil.');
      setIsModalOpen(true);
      setShouldRedirect(true);
    } catch (error) {
      let message = 'Une erreur est survenue lors de la connexion';
      if (error instanceof Error) {
        message = error.message;
      }
      setModalMessage(message);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-container ">
        <div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <p>{modalMessage}</p>
              </div>
            </div>
          )}
        </div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <button type="submit">Connexion</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
