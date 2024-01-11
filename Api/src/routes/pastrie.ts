import express, { Router, Request, Response } from "express";

import { CustomRequest } from "../middleware/data";
import { authentified } from "../middleware";
import { trimAll } from "../utils/helpers";
import { Pastrie } from "./../pastrie";

import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from "path";

dotenv.config();

const DATA_PASTRIES = process.env.DATA_PASTRIES || "pastries.json";
const filePath = path.resolve(__dirname, '../Data', DATA_PASTRIES);

const router: Router = express.Router();

// Endpoint pour récupérer toutes les pastries
router.get("/pastries", authentified, async (req: CustomRequest, res: Response) => {
    const pastries: Pastrie[] | undefined = req.locals?.pastries

    return res.status(200).json(pastries);
});

// Endpoint pour récupérer une pastrie par son ID
router.get("/pastrie/:id", authentified, async (req: CustomRequest, res: Response) => {

    const id: string = req.params.id
    const pastries : Pastrie[] | undefined = req.locals?.pastries

    const pastrie: Pastrie | undefined = pastries?.find(p => p.id == id)

    if (pastrie) {

        return res.json(pastrie);
    } else {
        return res.status(404).json({
            message: 'Pâtisserie non trouvée !'
        });
    }
});

// Endpoint pour récupérer une pastrie avec un mot 
router.get("/pastries-search/:word", authentified, async (req: CustomRequest, res: Response) => {
    const word: string = req.params.word;
    const re = new RegExp(word.trim(), 'i');

    const pastries : Pastrie[] | undefined = req.locals?.pastries
    const pastrie: Pastrie | undefined = pastries?.find(p => p.name.match(re))

    if (pastrie) {

        return res.json(pastrie);
    } else {
        return res.status(404).json({
            message: 'Pâtisserie non trouvée !'
        });
    }
});

// Endpoint pour récupérer des pastries avec offset et limit 
router.get("/pastries/:offset?/:limit", async (req: CustomRequest, res: Response) => {
    const offset: number = parseInt(req.params.offset);
    const limit: number = parseInt(req.params.limit);
    const pastries : Pastrie[] | undefined = req.locals?.pastries

    const p: Pastrie[] | undefined = limit ? pastries?.slice(offset).slice(0, limit) : pastries?.slice(offset)

    return res.json(p);
});

// Endpoint pour récupérer des pastries avec offset et limit avec de l'ordre
router.get("/pastries/order-quantity/:offset?/:limit", authentified, async (req: CustomRequest, res: Response) => {
    const offset: number = parseInt(req.params.offset);
    const limit: number = parseInt(req.params.limit);
    const pastries : Pastrie[] | undefined = req.locals?.pastries

    // by quantity order 
    pastries?.sort((a, b) => b.quantity - a.quantity)

    const p: Pastrie[] | undefined = limit ? pastries?.slice(offset).slice(0, limit) : pastries?.slice(offset)
    return res.json(p);
});

// Endpoint pour récupérer le nombre de pastries 
router.get("/pastries-count", authentified, async (req: CustomRequest, res: Response) => {
    const pastries : Pastrie[] | undefined = req.locals?.pastries

    return res.json(pastries?.length || 0);
});

// Endpoint pour ajouter une pastrie
router.post("/pastrie", authentified, async (req: CustomRequest, res: Response) => {
    const { name, quantity, image, choice } = trimAll(req.body) as {
      name: string;
      quantity: number;
      image: string;
      choice: boolean;
    };

    // Validation des champs obligatoires
    if (!name || quantity === undefined || !image || choice === undefined) {
        return res.status(400).json({
            message: 'Données invalides ! Tous les champs sont requis.'
        });
    }

    const pastries: Pastrie[] = req.locals?.pastries || [];

    // Générer un nouvel ID en tant que string
    const lastId = pastries.length > 0 ? Math.max(...pastries.map(p => p.id ? parseInt(p.id) : 0)) : 0;
    const newId = (lastId + 1).toString();


    const newPastrie: Pastrie = { id: newId, name, quantity, image, choice };
    pastries.push(newPastrie);

    try {
        await fs.writeFile(filePath, JSON.stringify(pastries), 'utf-8');
        return res.status(201).json(newPastrie); // Utiliser le code 201 pour une création réussie
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l\'enregistrement de la nouvelle pâtisserie.'
        });
    }
});


// router.post("/pastrie", authentified, async (req: CustomRequest, res: Response) => {
//     const { name, quantity, image, choice } = trimAll(req.body);
//     const p: Pastrie = { name, quantity, image, choice };
//     const pastries : Pastrie[] | undefined = req.locals?.pastries

//     // on vérifie les champs obligatoires
//     if (!p.name || !p.quantity) {
//         return res.status(400).json({
//             message: 'Données invalides !'
//         });
//     }
//     if (pastries) {
//         // on récupère le dernier id et on incrémente
//         const lastId: string = pastries[pastries.length - 1]?.id || "0";
//         p.id = (parseInt(lastId) + 1).toString();

//         pastries.push(p);
//         await fs.writeFile(filePath, JSON.stringify(pastries), 'utf-8');

//         return res.json(p);
//     }

//     return res.status(400).json({
//         message: 'Données invalides !'
//     });
// });

// Endpoint pour modifier une pastrie 
router.put("/pastrie/:id", authentified, async (req: CustomRequest, res: Response) => {
    const id: string = req.params.id;
    const { name, quantity, image, choice } = trimAll(req.body);
    const pastries : Pastrie[] | undefined = req.locals?.pastries

    const p: Pastrie | undefined = pastries?.find(p => p.id == id);

    // on vérifie que la pâtisserie existe
    if (!p) {
        return res.status(404).json({
            message: 'Pâtisserie non trouvée !'
        });
    }

    // on assigne les nouvelles valeurs à la pâtisserie
    p.name = name;
    p.quantity = quantity;
    p.image = image;
    p.choice = choice;
    await fs.writeFile(filePath, JSON.stringify(pastries), 'utf-8');

    return res.json(p);
});

// Endpoint pour supprimer une pastrie avec son id 
router.delete("/pastrie/:id", authentified, async (req: CustomRequest, res: Response) => {
    const id: string = req.params.id;
    const pastries = req.locals?.pastries
    const lenPastries: number = pastries?.length || 0
    const p: Pastrie[] | undefined = pastries?.filter(p => p.id != id);

    // on vérifie que la pâtisserie existe
    if (lenPastries == p?.length) {
        return res.status(404).json({
            message: 'Pâtisserie non trouvée !'
        });
    }
    await fs.writeFile(filePath, JSON.stringify(p), 'utf-8');

    return res.json(p);
})

router.get('*', function (req: Request, res: Response) {
    return res.status(404).json({ error: "Not found" })
});

export default router;