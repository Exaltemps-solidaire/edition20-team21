"use client";

import { useState } from "react";
import { personas, trouverPersona, type Persona } from "@/lib/personas";
import Chatbot from "./components/Chatbot";

export default function Home() {
  const [personaId, setPersonaId] = useState<string | null>(null);
  const persona = personaId ? trouverPersona(personaId) : undefined;

  if (!persona) {
    return <SelecteurPersona onChoisir={setPersonaId} />;
  }

  return <SiteEndomind persona={persona} onChangerPersona={() => setPersonaId(null)} />;
}

function SelecteurPersona({ onChoisir }: { onChoisir: (id: string) => void }) {
  return (
    <main style={{ padding: 32, fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <h1>Qui êtes-vous ?</h1>
      <p>Choisissez la personne que vous incarnez pour cette démonstration.</p>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {personas.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              data-testid="choix-persona"
              onClick={() => onChoisir(p.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              <strong>{p.nom}</strong>
              <div style={{ color: "#555", fontSize: 14 }}>{p.role}</div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function SiteEndomind({ persona, onChangerPersona }: { persona: Persona; onChangerPersona: () => void }) {
  return (
    <main style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderBottom: "1px solid #eee",
        }}
      >
        <span>
          Vous incarnez : <strong>{persona.nom}</strong> · {persona.role}
        </span>
        <button type="button" data-testid="changer-persona" onClick={onChangerPersona}>
          Changer
        </button>
      </header>
      <section style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
        <h1>ENDOmind</h1>
        <p>
          Connaissance, reconnaissance et prise en charge de l&apos;endométriose. Retrouvez nos
          guides, nos fiches et les groupes de parole près de chez vous.
        </p>
      </section>
      <Chatbot />
    </main>
  );
}
