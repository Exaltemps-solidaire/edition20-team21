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
    <main style={{ padding: 32, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ color: "var(--brand)", fontSize: 28 }}>Qui êtes-vous ?</h1>
      <p style={{ color: "var(--brand-muted)" }}>Choisissez la personne que vous incarnez pour cette démonstration.</p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
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
                borderRadius: 999,
                border: "2px solid var(--brand)",
                background: "white",
                cursor: "pointer",
              }}
            >
              <strong style={{ color: "var(--brand)" }}>{p.nom}</strong>
              <div style={{ color: "var(--brand-muted)", fontSize: 14 }}>{p.role}</div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function SiteEndomind({ persona, onChangerPersona }: { persona: Persona; onChangerPersona: () => void }) {
  return (
    <main>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderBottom: "2px solid var(--brand)",
          background: "white",
        }}
      >
        <span style={{ color: "var(--brand-muted)" }}>
          Vous incarnez : <strong style={{ color: "var(--foreground)" }}>{persona.nom}</strong> · {persona.role}
        </span>
        <button
          type="button"
          data-testid="changer-persona"
          onClick={onChangerPersona}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background: "var(--brand)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Changer
        </button>
      </header>
      <section style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ color: "var(--brand)", fontSize: 36 }}>ENDOmind</h1>
        <p style={{ color: "var(--foreground)" }}>
          Connaissance, reconnaissance et prise en charge de l&apos;endométriose. Retrouvez nos
          guides, nos fiches et les groupes de parole près de chez vous.
        </p>
      </section>
      <Chatbot />
    </main>
  );
}
