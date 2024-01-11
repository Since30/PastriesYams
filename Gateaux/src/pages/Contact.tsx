import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../assets/CSS/Contact.css';

const ContactForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Créez un objet contenant les données du formulaire
      const formData = {
        name: username,
        message: message,
      };

      // Effectuez la requête POST vers votre API en utilisant fetch
      const response = await fetch('http://localhost:3001/contact/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Vérifiez la réponse de l'API
      if (response.status === 201) {
        console.log('Message envoyé avec succès !');
        // Réinitialisez les champs du formulaire après la soumission réussie
        setUsername('');
        setMessage('');
        setIsModalOpen(true);
      } else {
        const responseData = await response.json();
        console.error('Erreur lors de l\'envoi du message :', responseData.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false); // Fermez la modal lorsque l'utilisateur clique sur le bouton "Fermer"
    navigate('/');
  };
  return (
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <button type="submit">Submit</button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen} // Utilisez la variable d'état isModalOpen pour contrôler l'ouverture de la modal
        onRequestClose={closeModal} // Utilisez la fonction closeModal pour fermer la modal
        className="custom-modal" // Ajoutez la classe CSS personnalisée à la modal
        overlayClassName="custom-modal-overlay" // Ajoutez une classe CSS pour l'arrière-plan de la modal
      >
        <button className="close-button" onClick={closeModal}>X</button>
        <h2>Message Envoyé</h2>
        <p>Votre message a été envoyé avec succès !</p>
      </Modal>
    </div>
  );
};

export default ContactForm;
