"use client";

import { useState } from "react";
import { questionsRestantes, trouverParTexte, trouverReponse } from "@/lib/questionsFrequentes";

type Echange = {
  texteAffiche: string;
  reponse: string;
  ressource?: { label: string; href: string };
};

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);
  const [historique, setHistorique] = useState<Echange[]>([]);
  const [canoniquesPosees, setCanoniquesPosees] = useState<string[]>([]);
  const [saisie, setSaisie] = useState("");
  const restantes = questionsRestantes(canoniquesPosees);

  function poserQuestion(question: string) {
    const trouve = trouverReponse(question);
    if (!trouve) return;
    setHistorique((h) => [...h, { texteAffiche: trouve.question, reponse: trouve.reponse, ressource: trouve.ressource }]);
    setCanoniquesPosees((c) => [...c, trouve.question]);
  }

  function soumettreSaisie(e: React.FormEvent) {
    e.preventDefault();
    const texte = saisie.trim();
    if (!texte) return;
    const trouve = trouverParTexte(texte);
    if (trouve) {
      setHistorique((h) => [...h, { texteAffiche: texte, reponse: trouve.reponse, ressource: trouve.ressource }]);
      setCanoniquesPosees((c) => (c.includes(trouve.question) ? c : [...c, trouve.question]));
    } else {
      setHistorique((h) => [
        ...h,
        { texteAffiche: texte, reponse: "Je ne sais pas répondre à ça pour l'instant. Reformulez ou choisissez une question ci-dessous." },
      ]);
    }
    setSaisie("");
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
            setCanoniquesPosees([]);
            setSaisie("");
          }}
          style={styles.fermer}
        >
          ×
        </button>
      </div>
      <div style={styles.conversation} data-testid="conversation">
        {historique.map((echange, index) => (
          <div key={index} style={styles.tour}>
            <div style={styles.bulleUtilisateur}>{echange.texteAffiche}</div>
            <div style={styles.bulleBot} data-testid="reponse-chatbot">
              <p style={{ margin: 0 }}>{echange.reponse}</p>
              {echange.ressource ? (
                <a href={echange.ressource.href} target="_blank" rel="noreferrer" style={styles.lienRessource}>
                  {echange.ressource.label}
                </a>
              ) : null}
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
      <form onSubmit={soumettreSaisie} style={styles.formSaisie}>
        <input
          type="text"
          data-testid="saisie-chatbot"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Écrivez votre question…"
          aria-label="Votre question"
          style={styles.champSaisie}
        />
        <button type="submit" style={styles.envoyer} aria-label="Envoyer">
          ➤
        </button>
      </form>
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
  formSaisie: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #e5e0d6",
  },
  champSaisie: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--brand-muted)",
  },
  envoyer: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    background: "var(--brand)",
    color: "white",
    cursor: "pointer",
  },
};
