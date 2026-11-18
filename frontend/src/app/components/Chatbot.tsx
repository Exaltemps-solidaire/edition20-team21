"use client";

import { useState } from "react";
import { questionsFrequentes, trouverReponse } from "@/lib/questionsFrequentes";

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);
  const [questionChoisie, setQuestionChoisie] = useState<string | null>(null);
  const reponse = questionChoisie ? trouverReponse(questionChoisie) : undefined;

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
          onClick={() => {
            setOuvert(false);
            setQuestionChoisie(null);
          }}
          style={styles.fermer}
        >
          ×
        </button>
      </div>
      {reponse ? (
        <div style={styles.reponse} data-testid="reponse-chatbot">
          <p style={{ margin: 0 }}>{reponse.reponse}</p>
          <a href={reponse.ressource.href} target="_blank" rel="noreferrer" style={styles.lienRessource}>
            {reponse.ressource.label}
          </a>
          <button type="button" style={styles.retour} onClick={() => setQuestionChoisie(null)}>
            ← Revenir aux questions
          </button>
        </div>
      ) : (
        <ul style={styles.listeQuestions}>
          {questionsFrequentes.map(({ question }) => (
            <li key={question}>
              <button
                type="button"
                data-testid="question-frequente"
                style={styles.question}
                onClick={() => setQuestionChoisie(question)}
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      )}
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
    background: "var(--brand)",
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
    background: "var(--brand)",
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
    border: "1px solid var(--brand)",
    background: "#f2eee2",
    cursor: "pointer",
  },
  reponse: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  lienRessource: {
    color: "var(--brand)",
    fontWeight: 600,
    textDecoration: "underline",
  },
  retour: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    color: "var(--brand-muted)",
    cursor: "pointer",
    padding: 0,
  },
};
