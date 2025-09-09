//frontend/src/contexts/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { AuthContext } from "./authContextObj";
import * as openpgp from "openpgp";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  const generateKeys = async (email) => {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: "ecc",
      curve: "curve25519",
      userIDs: [{ name: "AgriMarket User", email }],
      format: "armored",
    });
    return { privateKey, publicKey };
  };

  
  const saveKeys = async (privateKey, publicKey) => {
    localStorage.setItem("privateKey", privateKey);
    localStorage.setItem("publicKey", publicKey);          
    try {
      await api.put("/users/me/publicKey", { publicKey },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to save public key:", err);
    }
  };

  
  const login = async ({email, password}) => {
    const resp = await api.post("/auth/login", { email, password });
    const { user: u, token } = resp.data.data;

    localStorage.setItem("token", token);

    if (!localStorage.getItem("privateKey")) {
      const { privateKey, publicKey } = await generateKeys(u.email);
      await saveKeys(privateKey, publicKey);
    }

    
    setUser(
      {
        id: u.id,
        email: u.email,
        role: u.user_type,
        firstName: u.first_name,
        lastName: u.last_name,
      }
    );
    return u;
  };

 
  const register = async (userData) => {
    const resp = await api.post("/auth/register", userData);
    const { user: u, token } = resp.data.data;

    localStorage.setItem("token", token);

    const { privateKey, publicKey } = await generateKeys(u.email);
    await saveKeys(privateKey, publicKey);

    
    setUser(
      {
        id: u.id,
        email: u.email,
        role: u.user_type,
        firstName: u.first_name,
        lastName: u.last_name,
      }
    );
    return u;
  };

 
  const ensureEncryptionKeys = useCallback(
    async (currentUser) => {
      if (!localStorage.getItem("privateKey")) {
        const { privateKey, publicKey } = await openpgp.generateKey({
          type: "ecc",
          curve: "curve25519",
          userIDs: [
            {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email,
            },
          ],
          format: "armored",
        });
        await saveKeys(privateKey, publicKey);
      }
    },
    []
  );

  
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const u = data.data.user;
          setUser({
            id: u.id,
            email: u.email,
            role: u.user_type,
            firstName: u.first_name,
            lastName: u.last_name,
          });
          await ensureEncryptionKeys({
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
          });
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [ensureEncryptionKeys]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("publicKey");                   
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
