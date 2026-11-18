"use client";

import { useState } from "react";
import { questionsRestantes, trouverReponse, type QuestionFrequente } from "@/lib/questionsFrequentes";

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);
  const [historique, setHistorique] = useState<QuestionFrequente[]>([]);
  const restantes = questionsRestantes(historique.map((h) => h.question));

  function poserQuestion(question: string) {
    const reponse = trouverReponse(question);
    if (reponse) setHistorique((h) => [...h, reponse]);
  }

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
            setHistorique([]);
          }}
          style={styles.fermer}
        >
          ×
        </button>
      </div>
      <div style={styles.conversation} data-testid="conversation">
        {historique.map((echange) => (
          <div key={echange.question} style={styles.tour}>
            <div style={styles.bulleUtilisateur}>{echange.question}</div>
            <div style={styles.bulleBot} data-testid="reponse-chatbot">
              <p style={{ margin: 0 }}>{echange.reponse}</p>
              <a href={echange.ressource.href} target="_blank" rel="noreferrer" style={styles.lienRessource}>
                {echange.ressource.label}
              </a>
            </div>
          </div>
        ))}
      </div>
      {restantes.length > 0 ? (
        <ul style={styles.listeQuestions}>
          {restantes.map(({ question }) => (
            <li key={question}>
              <button
                type="button"
                data-testid="question-frequente"
                style={styles.question}
                onClick={() => poserQuestion(question)}
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.fin}>Merci d&apos;avoir échangé avec Andréa. 💜</p>
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
  conversation: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: "12px 12px 0",
    maxHeight: 280,
    overflowY: "auto",
  },
  tour: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  bulleUtilisateur: {
    alignSelf: "flex-end",
    background: "var(--brand)",
    color: "white",
    borderRadius: "12px 12px 2px 12px",
    padding: "8px 12px",
    maxWidth: "85%",
  },
  bulleBot: {
    alignSelf: "flex-start",
    background: "#f2eee2",
    borderRadius: "12px 12px 12px 2px",
    padding: "10px 12px",
    maxWidth: "90%",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  lienRessource: {
    color: "var(--brand)",
    fontWeight: 600,
    textDecoration: "underline",
  },
  fin: {
    padding: 16,
    textAlign: "center",
    color: "var(--brand-muted)",
  },
};
