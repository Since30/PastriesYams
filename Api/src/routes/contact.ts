import express, { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Message } from "../contact";
import { Status } from "../contact";
import { v4 as uuidv4 } from "uuid";

const router: Router = express.Router();

// Chemin du fichier JSON des messages de contact
const contactFilePath = path.join(__dirname, '../Data/contact.json');

// Middleware pour lire le fichier JSON des messages de contact
function readContactData(): any[] {
  try {
    const data = fs.readFileSync(contactFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture des messages de contact :", error);
    return [];
  }
}

// Middleware pour écrire les données dans le fichier JSON
function writeContactData(data: any[]): void {
  fs.writeFileSync(contactFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// Route GET pour obtenir tous les messages de contact
router.get("/contact", (req: Request, res: Response) => {
  try {
    const contacts = readContactData();
    res.json(contacts);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages de contact :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des messages de contact." });
  }
});
// Route PATCH pour marquer un message comme lu
router.patch("/contact/:id/read", (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const messages = readContactData();

    // Recherchez le message par son ID
    const messageToUpdate = messages.find((message: Message) => message.id === messageId);

    if (!messageToUpdate) {
      return res.status(404).json({ error: "Message introuvable." });
    }

    // Mettez à jour le statut du message
    messageToUpdate.status = Status.read;

    // Enregistrez les messages mis à jour dans le fichier JSON
    writeContactData(messages);

    res.status(200).json({ message: "Message marqué comme lu avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du message :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du statut du message." });
  }
});
// Route POST pour ajouter un message de contact
router.post("/contact", (req: Request, res: Response) => {
    try {
      const { name, message } = req.body;
  
      // Valider les données (assurez-vous que "name" et "message" sont présents)
      if (!name || !message) {
        return res.status(400).json({ error: "Le nom et le message sont obligatoires." });
      }
  
      // Charger les messages de contact existants depuis le fichier JSON
      const messages = readContactData();
  
      // Générer un ID unique pour le nouveau message
      const messageId = uuidv4();
  
      // Ajouter le nouveau message à la liste avec l'ID généré
      const newMessage: Message = { id: messageId, name, message, status:Status.unread};
      messages.push(newMessage);
  
      // Enregistrer les messages mis à jour dans le fichier JSON
      writeContactData(messages);
  
      // Répondre avec un succès
      res.status(201).json({ message: "Message de contact ajouté avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'ajout du message de contact :", error);
      res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du message de contact." });
    }
  });
  

// Route DELETE pour supprimer un message de contact par son ID
router.delete("/contact/:id", (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;
    const contacts = readContactData();

    // Filtrer les messages pour exclure celui avec l'ID donné
    const updatedContacts = contacts.filter((contact: any) => contact.id !== contactId);

    // Vérifier s'il y a eu une suppression
    if (updatedContacts.length < contacts.length) {
      writeContactData(updatedContacts);
      res.status(200).json({ message: "Message de contact supprimé avec succès." });
    } else {
      res.status(404).json({ error: "Message de contact introuvable." });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du message de contact :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du message de contact." });
  }
});

export default router;
