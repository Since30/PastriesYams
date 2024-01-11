export enum Status {
    read= "read",
    unread = "unread",
    }


export interface Message {
    id: string;
    name: string;
    message: string;
    status: Status; // Champ pour le statut "lu" ou "non lu"
  }