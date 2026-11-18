"use client";

import { useState } from "react";

// Les 3 questions du scénario de la passation (cadrage/7-prd.md). Les réponses
// arrivent à l'itération 2 : ce composant se contente d'ouvrir la fenêtre et de
// les afficher.
const questionsFrequentes = [
  "Est-ce que je pourrai avoir un enfant ?",
  "Comment gérer la douleur au quotidien ?",
  "Vers quel professionnel aller ?",
];

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);

  if (!ouvert) {
    return (
      <button
        type="button"
        data-testid="bulle-chatbot"
        aria-label="Ouvrir le chatbot Andréa"
        onClick={() => setOuvert(true)}
        style={styles.bulle}
      >
        💬
      </button>
    );
  }

  return (
    <div data-testid="fenetre-chatbot" style={styles.fenetre}>
      <div style={styles.entete}>
        <strong>De quoi avez-vous besoin ?</strong>
        <button
          type="button"
          aria-label="Fermer le chatbot"
          onClick={() => setOuvert(false)}
          style={styles.fermer}
        >
          ×
        </button>
      </div>
      <ul style={styles.listeQuestions}>
        {questionsFrequentes.map((question) => (
          <li key={question}>
            <button type="button" data-testid="question-frequente" style={styles.question}>
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bulle: {
    position: "fixed",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "none",
    background: "#6b2d8f",
    color: "white",
    fontSize: 24,
    cursor: "pointer",
  },
  fenetre: {
    position: "fixed",
    right: 24,
    bottom: 24,
    width: 320,
    maxWidth: "90vw",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  entete: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#6b2d8f",
    color: "white",
  },
  fermer: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: 20,
    cursor: "pointer",
  },
  listeQuestions: {
    listStyle: "none",
    margin: 0,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  question: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#faf7fc",
    cursor: "pointer",
  },
};
