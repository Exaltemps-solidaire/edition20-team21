export type Persona = { id: string; nom: string; role: string };

// Un persona par acteur du scénario (passation/cadrage/7-prd.md, section "Acteurs").
export const personas: Persona[] = [
  { id: "patiente-nouvelle", nom: "Camille", role: "Patiente qui vient d'être diagnostiquée" },
  { id: "patiente-ancienne", nom: "Sophie", role: "Patiente diagnostiquée depuis longtemps" },
  { id: "hors-cible", nom: "Marc", role: "Personne hors cible du chatbot" },
];

export function trouverPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
