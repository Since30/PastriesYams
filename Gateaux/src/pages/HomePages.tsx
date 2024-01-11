import React from 'react';
import { Link } from 'react-router-dom';
import { useGetPastriesQuery } from '../slices/gameApiSlice';
import '../assets/CSS/HomePage.css';


const HomePage: React.FC = () => {

  interface Pastery {
    id: string;
    name: string;
    image: string;
    quantity: number;
    quantityWon: number;
    choice: boolean;
  }
  
  
  const { data: pastries, error, isLoading } = useGetPastriesQuery(name);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

 

 
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Tentez de remporter une ou plusieurs pâtisseries avec notre jeu de yam's</h1>
        <Link to="/yams-game" className="play-button">Jouer</Link>
        <span className="remaining-lots">Lots restants:</span>
      </header>
      <div className="items-container">
      {pastries?.map((pastery: Pastery) => (
  <div className={`item ${pastery.quantity === 0 ? 'rupture' : ''}`} key={pastery.id}>
    <img src={`/pictures/${pastery.image}`} alt={pastery.name} />
    <p>{pastery.name} : {pastery.quantity}</p>
  </div>
))}
      </div>
    </div>
        
  );
};

export default HomePage;
