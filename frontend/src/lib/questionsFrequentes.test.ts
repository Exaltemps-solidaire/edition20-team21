import { describe, expect, it } from "vitest";
import { questionsFrequentes, trouverReponse } from "./questionsFrequentes";

describe("trouverReponse", () => {
  it("renvoie la réponse factuelle et la ressource associées à une question connue", () => {
    const resultat = trouverReponse("Vers quel professionnel aller ?");
    expect(resultat?.reponse).toMatch(/carte des filières de soins/i);
    expect(resultat?.ressource.label).toBeTruthy();
  });

  it("ne renvoie rien pour une question qui n'existe pas (pas de réponse inventée)", () => {
    expect(trouverReponse("Question jamais posée")).toBeUndefined();
  });

  it("couvre exactement les 3 questions du scénario de la passation", () => {
    expect(questionsFrequentes).toHaveLength(3);
  });
});
