import { describe, expect, it } from "vitest";
import { personas, trouverPersona } from "./personas";

describe("trouverPersona", () => {
  it("retrouve une persona existante par son id", () => {
    expect(trouverPersona("patiente-nouvelle")?.nom).toBe("Camille");
  });

  it("retourne undefined pour un id inconnu", () => {
    expect(trouverPersona("inexistant")).toBeUndefined();
  });
});

describe("personas", () => {
  it("propose une persona par acteur du scénario", () => {
    expect(personas).toHaveLength(3);
  });
});
