// frontend/src/services/chatService.js
import api from "./api";
import * as openpgp from "openpgp";

export async function getPublicKey(userId) {
  const res = await api.get(`/users/${userId}`);
  return res.data.user.publicKey;
}

export async function getChat(projectId) {
  const res = await api.get(`/chats/${projectId}`);
  return res.data.messages; // encrypted array
}

export async function sendMessage(projectId, { recipientId, content }) {
  // 1) fetch recipient’s public key
  const theirArmored = await getPublicKey(recipientId);
  const theirKey = await openpgp.readKey({ armoredKey: theirArmored });

  // 2) fetch your own public key from localStorage
  const myArmored = localStorage.getItem("publicKey");
  let encryptionKeys = [theirKey];

  if (myArmored) {
    const myKey = await openpgp.readKey({ armoredKey: myArmored });
    encryptionKeys.push(myKey);
  }

  // 3) encrypt for both keys
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: content }),
    encryptionKeys
  });

  // 4) post it
  const res = await api.post(`/chats/${projectId}`, {
    recipientId,
    content: encrypted
  });

  return res.data.message;
}

export async function getConversations() {
  const res = await api.get("/chats");
  return res.data.conversations;
}
