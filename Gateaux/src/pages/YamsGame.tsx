import React, { useState, useEffect,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetPastriesQuery, useUpdatePastriesMutation } from '../slices/gameApiSlice';
import { AuthContext } from './auth/AuthContext';
import '../assets/CSS/YamsGame.css';
import { getDiceImage, checkResult } from '../utils/game/gameUtils';
import { Pastry } from '../utils/game/InterfacePastry';


const YamsGame: React.FC = () => {
  const [diceValues, setDiceValues] = useState<number[]>(Array(5).fill(1));
  const [rollsLeft, setRollsLeft] = useState<number>(() => {
    // Récupérer la valeur depuis localStorage
    const savedRollsLeft = localStorage.getItem('rollsLeft');
    return savedRollsLeft ? parseInt(savedRollsLeft) : 3; // 3 par défaut
  });
  const [lastRollTime, setLastRollTime] = useState<number | null>(
    localStorage.getItem('lastRollTime') ? parseInt(localStorage.getItem('lastRollTime') || '0') : null
  );
  const [hasRecentlyWon, setHasRecentlyWon] = useState<boolean>(
    localStorage.getItem('lastWinTime') ? true : false
  );
  const [updatePastries] = useUpdatePastriesMutation();
  const { data: pastries } = useGetPastriesQuery('pastries');
  const [selectedPastryId, setSelectedPastryId] = useState<string | null>(null);
  const [selectedPastries, setSelectedPastries] = useState<string[]>([]);
  const [, setSelectedPastryIds] = useState<string[]>([]);
  const [showWaitMessage, setShowWaitMessage] = useState<boolean>(false);
  const [lockedDice, setLockedDice] = useState<number[]>(() => {
    // Récupération de l'état des dés verrouillés depuis localStorage
    const savedLockedDice = localStorage.getItem('lockedDice');
    return savedLockedDice ? JSON.parse(savedLockedDice) : [];
  });
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [result, setResult] = useState<string>('24H entre chaque lancé gagnant');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);
  const [pastryRewardCount, setPastryRewardCount] = useState<number>(0);
  const [timeToReload, setTimeToReload] = useState<number | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const getARandomPastryId = (pastries: Pastry[]): string | null => {
    if (pastries.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pastries.length);
    return pastries[randomIndex].id;
  };

   //===================reset timer a supprimé aprés test!!! ==================//
   const resetTimer = () => {
    setLockedDice([]); // Réinitialiser les dés verrouillés
    localStorage.removeItem('lockedDice'); // Supprimer de localStorage
    setRollsLeft(3); // Réinitialiser les essais restants
    localStorage.removeItem('rollsLeft'); // Supprimer de localStorage
    // Vous devrez peut-être également mettre à jour l'état du composant ici
    setShowEndGameModal(false);
    setSelectedPastries([]);
setPastryRewardCount(0);
  };
  //==========================================================================//

  
  const updateLockedDice = (newResult: string, newDiceValues: number[]) => {
    // Compter le nombre d'occurrences de chaque valeur de dé
    const counts: { [key: number]: number } = {};
    newDiceValues.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
  
    if (newResult === 'carre') {
      // Pour un carré, verrouiller tous les dés de la même valeur
      const valueToLock = Object.keys(counts).find(key => counts[parseInt(key)] === 4);
      if (valueToLock) {
        setLockedDice(newDiceValues
          .map((value, index) => value === parseInt(valueToLock) ? index : -1)
          .filter(index => index !== -1));
      }
    } else if (newResult === 'brelan') {
      // Pour un brelan, verrouiller les trois dés de la même valeur
      const valueToLock = Object.keys(counts).find(key => counts[parseInt(key)] === 3);
      if (valueToLock) {
        setLockedDice(newDiceValues
          .map((value, index) => value === parseInt(valueToLock) ? index : -1)
          .filter(index => index !== -1));
      }
    } else if (newResult === 'paire') {
      // Pour une paire, verrouiller les deux dés de la même valeur
      const valueToLock = Object.keys(counts).find(key => counts[parseInt(key)] === 2);
      if (valueToLock) {
        setLockedDice(newDiceValues
          .map((value, index) => value === parseInt(valueToLock) ? index : -1)
          .filter(index => index !== -1));
      }
    }
    
  };


  const rollDice = () => {
    if (!auth?.user) {
      // Si l'utilisateur n'est pas connecté, afficher un message ou rediriger
      alert("Vous devez être connecté pour jouer.");
      return;
    }
    
    if (rollsLeft > 0 && !hasWon && !hasRecentlyWon && lockedDice.length < 5) {
    
      const newDiceValues = [...diceValues];
      for (let i = 0; i < newDiceValues.length; i++) {
        if (!lockedDice.includes(i)) {
          newDiceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
      }
      setDiceValues(newDiceValues);
      setRollsLeft(rollsLeft - 1);

      const currentTime = Date.now();
      localStorage.setItem('lastRollTime', currentTime.toString());
      setLastRollTime(currentTime);

      const newResult = checkResult(newDiceValues);
    setResult(newResult);
    updateLockedDice(newResult, newDiceValues);

      const pastryId = selectedPastryId || getARandomPastryId(pastries || []);
      setSelectedPastryId(pastryId);

      if (pastryId !== null) {
        setSelectedPastryId(pastryId);

        const selectedPastry = pastries?.find((p: Pastry) => p.id === pastryId);
        const quantity = selectedPastry ? selectedPastry.quantity : 0;
        if (newResult === 'carre' && lockedDice.length <= 1 && quantity >= 3) {
          const newQuantity = quantity - 3;
          setHasWon(true);
          setPastryRewardCount(3);
          updatePastries({ id: pastryId, quantity: newQuantity });
          setModalContent('Félicitation! Vous avez gagné 3 pâtisseries !');

          localStorage.setItem('lastWinTime', currentTime.toString());
          setSelectedPastryIds([pastryId]);
          setShowWaitMessage(true);
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
        } else if (newResult === 'brelan' && lockedDice.length <= 2 && quantity >= 2) {
          const newQuantity = quantity - 2;
          setHasWon(true);
          setPastryRewardCount(2);
          updatePastries({ id: pastryId, quantity: newQuantity });
          setModalContent('Vous avez gagné 2 pâtisseries !');

          localStorage.setItem('lastWinTime', currentTime.toString());
          setSelectedPastryIds([pastryId]);
          setShowWaitMessage(true);
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
        } else if (newResult === 'paire' && lockedDice.length <= 3 && quantity >= 1) {
          const newQuantity = quantity - 1;
          setHasWon(true);
          setPastryRewardCount(1);
          updatePastries({ id: pastryId, quantity: newQuantity });
          setModalContent('Vous avez gagné 1 pâtisserie !');

          localStorage.setItem('lastWinTime', currentTime.toString());
          setSelectedPastryIds([pastryId]);
          setShowWaitMessage(true);
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
          setTimeToReload(null); // Réinitialise le temps d'attente
        } else {
          setModalContent('Vous avez perdu !');

          setSelectedPastryIds([]);
          setTimeout(() => {
            navigate('/');
            setShowModal(true);
            
          }, 2000);
        }
      }
    
    }
  };

  const handlePastrySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setSelectedPastries(selectedOptions);
  };

  const confirmSelection = () => {
    if (selectedPastries.length > 0) {
      selectedPastries.forEach((pastryId, index) => {
        if (index < pastryRewardCount) {
          // Mettre à jour seulement le nombre de pâtisseries correspondant à la récompense
          updatePastries({ id: pastryId, quantity: 1 }); // Assumons une quantité de 1 par pâtisserie gagnée
        }
      });
  
      setShowModal(false);
      const currentTime = Date.now();
      localStorage.setItem('lastWinTime', currentTime.toString());
      setHasRecentlyWon(true);
      navigate('/');
    } else {
      setModalContent('Vous devez sélectionner au moins une pâtisserie');
    }
  };

  useEffect(() => {
    if (timeToReload !== null) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - lastRollTime!) / (1000 * 60 * 60); // Heures passées depuis le dernier lancer
        const remainingTime = Math.max(0, 24 - timeElapsed); // Temps restant en heures
        setTimeToReload(remainingTime);
      }, 1000); // Mettre à jour toutes les secondes
  
      return () => clearInterval(intervalId); // Nettoyer l'intervalle lorsque le composant est démonté
    }
    // if (lastRollTime) {
    //   const currentTime = Date.now();
    //   const hoursPassed = (currentTime - lastRollTime) / (1000 * 60 * 60);
    //   if (hoursPassed >= 24) {
    //     // setRollsLeft(3);
    //     localStorage.removeItem('lastRollTime');
    //     setLastRollTime(null);
    //     setTimeToReload(null);
    //   }
    // }

    if (lastRollTime) {
      const currentTime = Date.now();
      const hoursPassed = (currentTime - lastRollTime) / (1000 * 60 * 60);

      if (hoursPassed >= 24) {
        // Si 24 heures se sont écoulées, réinitialisez les données du joueur pour permettre une nouvelle partie
        setRollsLeft(3);
        localStorage.removeItem('lastRollTime');
        setLastRollTime(null);
        setTimeToReload(null);
      } else {
        // Sinon, calculez le temps restant avant de pouvoir rejouer
        const remainingTime = 24 - hoursPassed;
        setTimeToReload(remainingTime);
      }
    }
    if (hasRecentlyWon) {
      const lastWinTime = parseInt(localStorage.getItem('lastWinTime') || '0');
      const currentTime = Date.now();
      const secondsPassed = (currentTime - lastWinTime) / 1000; // 10 secondes pour le test
  
      if (secondsPassed < 10) { // Ou 24 * 60 * 60 pour 24 heures
        setShowWaitMessage(true);
        setTimeout(() => {
          setShowWaitMessage(false);
          setTimeToReload(24);
        }, 3000);
      } else {
        setHasRecentlyWon(false);
        localStorage.removeItem('lastWinTime');
        setShowWaitMessage(false);
        // setRollsLeft(3);
      }
    }
  }, [hasRecentlyWon, navigate, lastRollTime, timeToReload]);

 
  useEffect(() => {
    if (rollsLeft === 0) {
      setShowEndGameModal(true);
    }
    localStorage.setItem('rollsLeft', rollsLeft.toString());
    localStorage.setItem('lockedDice', JSON.stringify(lockedDice));
  }, [lockedDice,rollsLeft]); // Sauvegarder l'état des dés verrouillés dans localStorage

 
  
  

  return (
    <div className="yams-game-container">

      {/* ============a supprimé aprés test=============  */}
      <button onClick={resetTimer}>Reset store dice"</button>
      {/* =============================================  */}
      <Link to="/">Retour à la page d'accueil</Link>
      <h1>Jeu du yams</h1>
      
{showEndGameModal && (
      <div className="modal">
        <div className="modal-content">
          <p>Vous ne pouvez plus jouer. Merci d'avoir participé !</p>
          <button onClick={() => setShowEndGameModal(false)}>Fermer</button>
        </div>
      </div>
    )}

      <p>Vous avez 3 lancés.</p>
      <p>Si vous obtenez une paire (2 dés identiques), vous gagnez une pâtisserie.</p>
      <p>Si vous obtenez un brelan (3 dés identiques), vous gagnez 2 pâtisseries.</p>
      <p>Si vous obtenez un carré (4 dés identiques), vous gagnez 3 pâtisseries.</p>
      <p>Bonne chance !!</p>
      <div className="dice-container">
      {diceValues.map((value, index) => {
    if (!lockedDice.includes(index)) {
      return <img key={index} src={getDiceImage(value)} alt={`Dé ${value}`} className="die" />;
    }
    return null; // Ne pas afficher les dés verrouillés
  })}
      </div>
      <button
        onClick={rollDice}
        disabled={rollsLeft === 0 || showWaitMessage || timeToReload !== null}
        className="roll-button"
      >
        {timeToReload !== null ? `Attendez ${Math.floor(timeToReload)} heures` : `Lancer les dés (${rollsLeft} essais restants)`}
      </button>
      

      <div className="result-container">
        <p>Résultat : {result}</p>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalContent}</p>
            {hasWon && (
              <div className="select-pastry">
                <label>Sélectionnez vos pâtisseries :</label>
                <select multiple value={selectedPastries} onChange={handlePastrySelection}>
  {pastries?.filter((p: Pastry) => p.quantity > 0).map((p: Pastry) => (
    <option key={p.id} value={p.id}>{p.name}</option>
  ))}
</select>

              </div>
            )}
            <button onClick={confirmSelection} disabled={selectedPastries.length === 0} className="confirm-button">
              Confirmer la sélection ({selectedPastries.length} pâtisserie(s) sélectionnée(s))
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YamsGame;