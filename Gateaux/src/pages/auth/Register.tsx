import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

import '../../assets/CSS/AuthForm.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

const navigate = useNavigate();

const closeModal = () => {
  setIsModalOpen(false);
  if (shouldRedirect) {
    navigate('/');
  }
};
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const user = {
      email,
      name,
      password,
     
    };

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'inscription.');
      }

      setModalMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setIsModalOpen(true);
    setShouldRedirect(true);
    }  catch (error: unknown) {
      let message = "Une erreur est survenue lors de l'inscription";
      if (error instanceof Error) {
        message = error.message;
      }
      setModalMessage(message);
      setIsModalOpen(true);
     
    }
  };


  return (
    <div className="form-page-container">
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
    <div className="form-container">
  <h1>Register</h1>
  <form  onSubmit={handleSubmit}>
    <div className="form-field">
      <label htmlFor="name">Username</label>
      <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)} 
  placeholder="Nom d'utilisateur"
  required
/>
    </div>
    <div className="form-field">
      <label htmlFor="email">Email</label>
      <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)} 
  placeholder="Email"
  required
/>
    </div>
    <div className="form-field">
      <label htmlFor="password">Password</label>
      <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)} 
  placeholder="Mot de passe"
  required
/>
    </div>
    <div className="form-field">
      <button type="submit">Submit</button>
    </div>
  </form>
</div>
</div>
  );
};

export default Register;
