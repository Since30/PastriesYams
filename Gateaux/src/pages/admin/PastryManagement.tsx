import React, { useState } from 'react';
import { useGetPastriesQuery, useUpdatePastriesMutation, useDeletePastriesMutation, useAddPastriesMutation } from '../../slices/gameApiSlice';
import '../../assets/CSS/PastryManagement.css';

interface Pastry {
  id: string;
  name: string;
  image: string;
  quantity: number;
  quantityWon: number;
  choice: boolean;
}

const PastryManagement: React.FC = () => {
  const { data: pastries, error, isLoading } = useGetPastriesQuery({});
  const [updatePastries] = useUpdatePastriesMutation();
  const [deletePastries] = useDeletePastriesMutation();
  const [addPastries] = useAddPastriesMutation();

  const [newPastry, setNewPastry] = useState<Pastry>({
    id: '',
    name: '',
    image: '',
    quantity: 0,
    quantityWon: 0,
    choice: false,
  });
  const [editPastry, setEditPastry] = useState<Pastry | null>(null);

  const handleAddOrEditPastry = async () => {
    if (editPastry) {
      await updatePastries(editPastry);
      setEditPastry(null);
    } else {
      await addPastries(newPastry);
    }
    setNewPastry({ id: '', name: '', image: '', quantity: 0, quantityWon: 0, choice: false });
  };

  const handleDeletePastry = async (id: string) => {
    await deletePastries(id);
  };

  if (isLoading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="error">Une erreur s'est produite : {error.toString()}</div>;
  }

  return (
    <div className="pastry-management">
      <h2>Gestion des Pâtisseries</h2>
      <div className="pastry-form">
        <h3>{editPastry ? 'Modifier' : 'Ajouter'} une Pâtisserie</h3>
        <input
          type="text"
          placeholder="Nom de la pâtisserie"
          value={editPastry ? editPastry.name : newPastry.name}
          onChange={(e) => setNewPastry({ ...newPastry, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image"
          value={editPastry ? editPastry.image : newPastry.image}
          onChange={(e) => setNewPastry({ ...newPastry, image: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantité"
          value={editPastry ? editPastry.quantity : newPastry.quantity}
          onChange={(e) => setNewPastry({ ...newPastry, quantity: parseInt(e.target.value, 10) })}
        />
        <input
          type="number"
          placeholder="Quantité Gagnée"
          value={editPastry ? editPastry.quantityWon : newPastry.quantityWon}
          onChange={(e) => setNewPastry({ ...newPastry, quantityWon: parseInt(e.target.value, 10) })}
        />
        <label>
          Choix :
          <input
            type="checkbox"
            checked={editPastry ? editPastry.choice : newPastry.choice}
            onChange={(e) => setNewPastry({ ...newPastry, choice: e.target.checked })}
          />
        </label>
        <button onClick={handleAddOrEditPastry}>
          {editPastry ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
      <div className="pastry-list">
        <h3>Liste des Pâtisseries</h3>
        <ul>
          {pastries?.map((pastry: Pastry) => (
            <li key={pastry.id}>
              <p><strong>Nom :</strong> {pastry.name}</p>
              <p><strong>Image :</strong> {pastry.image}</p>
              <p><strong>Quantité :</strong> {pastry.quantity}</p>
              <p><strong>Quantité Gagnée :</strong> {pastry.quantityWon}</p>
              <p><strong>Choix :</strong> {pastry.choice ? 'Oui' : 'Non'}</p>
              <button onClick={() => setEditPastry(pastry)}>Modifier</button>
              <button onClick={() => handleDeletePastry(pastry.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PastryManagement;
