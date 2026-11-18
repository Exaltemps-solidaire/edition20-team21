export type QuestionFrequente = {
  question: string;
  reponse: string;
  ressource: { label: string; href: string };
  motsClefs: string[];
};

// Réponses factuelles tirées des ressources ENDOmind (passation/cadrage/7-prd.md) :
// pas d'avis médical, uniquement de l'orientation vers le guide et les fiches existantes.
export const questionsFrequentes: QuestionFrequente[] = [
  {
    question: "Est-ce que je pourrai avoir un enfant ?",
    reponse:
      "L'endométriose peut avoir un impact sur la fertilité, mais ce n'est pas systématique et des solutions existent. Seul un professionnel de santé peut évaluer votre situation.",
    ressource: { label: "Le guide « Le diagnostic, et maintenant ? »", href: "https://www.endomind.org/" },
    motsClefs: ["enfant", "fertilite", "grossesse", "bebe", "bébé"],
  },
  {
    question: "Comment gérer la douleur au quotidien ?",
    reponse:
      "ENDOmind propose des fiches réflexes pour mieux vivre avec la douleur au quotidien, en complément du suivi médical.",
    ressource: { label: "Les fiches réflexes ENDOmind", href: "https://www.endomind.org/" },
    motsClefs: ["douleur", "mal", "souffrance", "quotidien"],
  },
  {
    question: "Vers quel professionnel aller ?",
    reponse:
      "Une carte des filières de soins régionales recense les professionnels formés à l'endométriose près de chez vous.",
    ressource: { label: "La carte des filières de soins", href: "https://www.endomind.org/" },
    motsClefs: ["professionnel", "medecin", "specialiste", "gynecologue", "consulter"],
  },
];

export function trouverReponse(question: string): QuestionFrequente | undefined {
  return questionsFrequentes.find((q) => q.question === question);
}

function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Saisie libre sans génération : on ne fait correspondre qu'aux réponses déjà
// écrites, jamais une réponse inventée (règle de la passation).
export function trouverParTexte(saisie: string): QuestionFrequente | undefined {
  const texte = normaliser(saisie);
  return questionsFrequentes.find((q) => q.motsClefs.some((mot) => texte.includes(normaliser(mot))));
}

// Permet d'enchaîner plusieurs questions dans la même conversation : une fois
// posée, une question ne se repropose pas (toujours par clic, jamais de saisie libre).
export function questionsRestantes(deja_posees: string[]): QuestionFrequente[] {
  return questionsFrequentes.filter((q) => !deja_posees.includes(q.question));
}
