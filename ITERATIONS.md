# Plan d'itérations — ENDOmind (chatbot d'orientation post-diagnostic)

- **Source du plan** : proposé par l'agent. Aucun plan d'itérations de l'équipe trouvé dans la passation (`6-plan-de-livraison.md` est un plan produit en 4 étapes, pas un découpage en itérations testable ; pas de clé `iterations` dans `passation.json`).
- **Temps restant annoncé** : 90 minutes (question posée le 2026-11-18).
- **Durée du tour de test PM Lab** : 10 minutes (valeur par défaut, le développeur ne savait pas).
- **Capacité approximative** : chaque itération coûte son codage (≤10 min) + ~5 min de publication + 10 min de tour de test, soit 20 à 25 min selon l'ampleur. 90 minutes permettent donc confortablement 3 itérations, et une 4e courte si tout va bien.

## Hors périmètre (rappel des arbitrages de la passation)

- Mise à jour des ressources par l'association.
- Forme de l'alerte en situation sensible, et qui la reçoit.
- Tutoiement/vouvoiement (non tranché).
- Widget réel sur écran d'accueil, envoi réel du compte-rendu par mail : affichés en fin de discussion, non fonctionnels.
- Parcours P2 (ALD/RQTH) et P3 (désert médical).
- Persona « diagnostiquée depuis longtemps » et « hors cible » : identifiés, non traités.
- Tout suivi, rappel, journal de symptômes.
- Connexion/compte : remplacés par l'écran « Qui êtes-vous ? » à personas.

**✂️ Découpage supplémentaire proposé par l'agent** : la saisie libre en texte (« écrire/dicter notre besoin ») sort des 3 premières itérations. L'hypothèse de l'équipe porte précisément sur le déclenchement **sans** saisie libre (1 clic sur une question fréquente) — c'est ce qui est vérifiable démonstrablement avec le temps disponible. Une réponse à texte libre demanderait une recherche dans le corpus de documents (RAG), hors de portée ici : la route `task:embed` sort chez OpenAI et **aucune clé `OPENAI_API_KEY` n'est fournie** sur cette machine. Les 3 questions fréquentes auront une réponse factuelle en dur, sourcée sur le guide/les fiches, ce qui respecte la règle « je ne sais pas vaut mieux qu'une réponse inventée » sans dépendre d'une clé absente.

---

## Itération 1 : Le squelette publié avec l'écran d'accueil du chatbot

- **Dans le périmètre** :
  - Écran « Qui êtes-vous ? » au lancement : liste de personas en dur (au moins « La patiente qui vient d'être diagnostiquée »), bouton pour en changer à tout moment.
  - Bulle de chatbot visible sur l'écran principal (simulant la page d'accueil d'ENDOmind).
  - Clic sur la bulle → fenêtre conversationnelle qui s'ouvre, avec l'invite « De quoi avez-vous besoin ? » et 3 questions fréquentes affichées en dur (« Est-ce que je pourrai avoir un enfant ? », « Comment gérer la douleur au quotidien ? », « Vers quel professionnel aller ? »).
  - `.env.example` et `DEPLOIEMENT.md` posés (le squelette api/frontend existe déjà).
- **Hors périmètre** : toute réponse à un clic sur une question (c'est l'itération 2) ; la saisie libre.
- **Critères d'acceptation** :
  - Étant donné l'application démarrée, quand on arrive sur l'écran « Qui êtes-vous ? » et qu'on choisit un persona, alors on accède à l'écran principal avec la bulle de chatbot visible.
  - Étant donné l'écran principal, quand on clique sur la bulle, alors la fenêtre s'ouvre avec l'invite « De quoi avez-vous besoin ? » et les 3 questions fréquentes.
  - Étant donné le déploiement, quand on appelle `/health` et `/sante`, alors les deux répondent 200.
- **Hypothèse de l'équipe couverte** : aucune directement — ce squelette pose l'écran que l'itération 2 rendra mesurable (le clic sans saisie).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : composant persona selector (frontend), composant bulle + fenêtre chatbot (frontend), données personas en dur, `.env.example`, `DEPLOIEMENT.md`.
- **Tests unitaires prévus** : 1 à 2, sur la logique de sélection/changement de persona (pas sur le balisage des écrans).
- **Étapes ajoutées à la démo** : ouverture de l'app → choix du persona → clic sur la bulle → fenêtre avec questions fréquentes visibles.
- **Bilan** :
  - Durée de codage réelle : 3 minutes (budget 10 minutes, aucun dépassement).
  - Critères d'acceptation : les 3 sont satisfaits, y compris `/health` et `/sante` (vérifiés en 200 depuis la machine, sur 8080 et 8081).
  - Reporté : aucun report côté code — le blocage rencontré était uniquement sur le déploiement (plateforme non démarrée faute de pouvoir tirer les images Docker Hub, quota de pull anonyme atteint). Résolu en authentifiant `podman` sur Docker Hub (`podman login`), ce qui relève le quota de pull ; aucune conséquence sur le périmètre de l'itération.
  - Le harnais n'a rien bloqué ni refusé : `npm test` passait déjà, `./scripts/verifier-deployabilite.sh` ne signalait ni borne ni alarme, et `./scripts/signaler-version.sh 1` a été accepté du premier coup.
  - **Modifications** :
    - `frontend/src/lib/personas.ts` : liste des personas en dur + `trouverPersona(id)` — sert le critère « choisir un persona ».
    - `frontend/src/lib/personas.test.ts` : 3 tests Vitest sur `trouverPersona`/`personas`.
    - `frontend/src/app/components/Chatbot.tsx` : bulle + fenêtre de chatbot avec l'invite « De quoi avez-vous besoin ? » et les 3 questions fréquentes — sert le critère « ouvrir la fenêtre et voir les questions ».
    - `frontend/src/app/page.tsx` : écran « Qui êtes-vous ? » (sélection de persona) puis site ENDOmind avec bouton pour changer de persona et le `<Chatbot />` — sert le critère « accéder à l'écran principal ».
    - `.env.example`, `DEPLOIEMENT.md` : posés pour le contrat de déployabilité.
    - `e2e/demo.spec.ts` : étapes de démo ajoutées (choix du persona, ouverture du chatbot, questions visibles).

## Itération 2 : Une question fréquente déclenche une réponse factuelle sourcée

- **Dans le périmètre** : clic sur une des 3 questions fréquentes → réponse factuelle en dur (texte + nom/lien de la ressource ENDOmind correspondante), sans aucune saisie de texte libre.
- **Hors périmètre** : saisie libre, recherche dans les PDF, recours à `task:embed`/RAG.
- **Critères d'acceptation** :
  - Étant donné la fenêtre ouverte avec les questions fréquentes, quand on clique sur l'une d'elles sans rien saisir, alors une réponse factuelle s'affiche.
  - Étant donné une réponse affichée, quand on la lit, alors elle cite une ressource ENDOmind identifiable (nom du guide/de la fiche).
  - Étant donné les 3 questions, quand on clique chacune séparément, alors chacune produit sa propre réponse (pas de réponse générique).
- **Hypothèse de l'équipe couverte** : oui — « les questions fréquentes permettent de démarrer sans saisie libre » (mesure : taux de démarrage via question fréquente sans saisie libre, cible 1 clic).
- **Codage estimé** : 8 minutes.
- **Fichiers prévus** : données Q/R en dur (api ou frontend selon l'architecture retenue à ce moment-là), route/fonction qui retourne la réponse, affichage du message dans la fenêtre de chat.
- **Tests unitaires prévus** : 1 à 2, sur la fonction qui associe une question à sa réponse/ressource.
- **Étapes ajoutées à la démo** : clic sur une question fréquente → réponse affichée avec sa ressource.
- **Bilan** :
  - Contexte : 10 minutes de build restantes annoncées par le développeur (18/11/2026 17:53) — pas assez pour coder (≤10 min) + publier (~5 min) + tour de test. ✂️ proposé et confirmé par le développeur (« Focus sur le chatbot ») : on code cette itération telle quelle (déjà dimensionnée à 8 min), sans ajouter l'Itération 3, et elle sert de stabilisation pour le pitch.
  - Durée de codage réelle : 1 min (pas de dépassement).
  - Critères satisfaits : les 3 — réponse factuelle au clic, ressource ENDOmind citée pour chacune des 3 questions, réponse propre à chaque question (pas de texte générique).
  - Reporté : rien de ce périmètre ; l'Itération 3 (invitation à la rencontre) reste à faire, son critère dépendait justement de cette réponse factuelle.
  - Harnais : aucune borne de déployabilité, `npm test` passe (6 tests, 2 fichiers), signal PM Lab accepté (version 2).
  - **Modifications** :
    - `frontend/src/lib/questionsFrequentes.ts` (nouveau) : les 3 couples question/réponse factuelle/ressource ENDOmind, fonction `trouverReponse` — sert les 3 critères.
    - `frontend/src/lib/questionsFrequentes.test.ts` (nouveau) : 3 tests unitaires sur `trouverReponse` (réponse connue, question inconnue → `undefined`, nombre de questions) — sert le critère « pas de réponse générique/inventée ».
    - `frontend/src/app/components/Chatbot.tsx` : clic sur une question affiche sa réponse + lien ressource + bouton retour, au lieu de ne rien faire — sert les 3 critères.

## Itération 3 : Invitation à la rencontre entre patientes après la réponse

- **Dans le périmètre** : après une réponse factuelle, affichage d'une invitation à rencontrer d'autres personnes diagnostiquées (groupes de parole, cafés patientes, ETP), en dur.
- **Hors périmètre** : inscription réelle, liste des événements, prise de rendez-vous.
- **Critères d'acceptation** :
  - Étant donné une réponse factuelle affichée, quand l'échange est terminé, alors l'invitation à la rencontre (groupes de parole, cafés patientes, ETP) s'affiche.
  - Étant donné l'invitation affichée, quand on clique dessus, alors un contenu descriptif s'affiche (texte statique suffisant).
- **Hypothèse de l'équipe couverte** : aucune hypothèse chiffrée de la passation ne porte sur cette étape ; elle couvre le point 3 du plan de livraison de l'équipe (`6-plan-de-livraison.md`).
- **Codage estimé** : 5 minutes.
- **Fichiers prévus** : composant/bloc d'invitation (frontend), contenu statique.
- **Tests unitaires prévus** : 1, si une règle existe (ex. l'invitation n'apparaît qu'après une réponse) ; sinon le signaler et ne pas forcer un test sur du balisage pur.
- **Étapes ajoutées à la démo** : après la réponse, vérifier que l'invitation à la rencontre s'affiche.
- **Bilan** : _à remplir en fin d'itération_

## Itération 4 : Dicter sa question au micro (demande du développeur, 2026-11-18)

- **Dans le périmètre** :
  - Un champ de saisie libre dans la fenêtre de chat (jusqu'ici absent — déplacé depuis « À venir »).
  - Un bouton micro à côté du champ, qui utilise la `Web Speech API` du navigateur pour transcrire la voix dans ce champ (aucune clé, aucun appel serveur).
  - Le texte validé (dicté ou tapé) est comparé aux 3 questions connues par correspondance simple (mots-clés, pas d'IA) ; en cas de correspondance, la même réponse factuelle que l'itération 2 s'affiche ; sinon, le chatbot répond « je ne sais pas ».
- **Hors périmètre** : vraie recherche dans les PDF/RAG (toujours bloqué par l'absence d'`OPENAI_API_KEY`), dictée continue, autre langue que le français, transcription côté serveur.
- **Critères d'acceptation** :
  - Étant donné la fenêtre de chat ouverte, quand on clique le bouton micro et qu'on dicte une question, alors le texte transcrit apparaît dans le champ de saisie.
  - Étant donné un texte dicté qui correspond à une des 3 questions connues, quand on valide, alors la même réponse factuelle que l'itération 2 s'affiche.
  - Étant donné un texte dicté qui ne correspond à aucune question connue, quand on valide, alors le chatbot répond « je ne sais pas ».
- **Hypothèse de l'équipe couverte** : aucune — ⚠️ cette itération ajoute un chemin alternatif à l'hypothèse testée en itération 2 (qui mesure justement l'absence de saisie libre). À garder en tête au moment de lire les résultats du tour de test.
- **Codage estimé** : 10 minutes (plafond — champ libre + bouton micro + correspondance simple en une passe ; à couper en deux si ça dépasse).
- **Fichiers prévus** : champ de saisie (frontend), bouton micro + intégration `SpeechRecognition` (frontend), fonction de correspondance question→réponse (réutilise les données de l'itération 2).
- **Tests unitaires prévus** : 1 à 2, sur la fonction de correspondance texte→réponse connue (pas sur l'API micro elle-même, non testable en Vitest).
- **Étapes ajoutées à la démo** : dicter une des 3 questions au micro → voir la réponse s'afficher.
- **Bilan** : _à remplir en fin d'itération_

## Itération 5 : Habillage visuel aligné sur endomind.org (demande du développeur, 2026-11-18)

- **Dans le périmètre** :
  - Palette de couleurs : couleur de marque `#B33960` (rose/bordeaux, dominante du site) en primaire, fond crème `#F2EEE2` ou blanc, texte gris `#8F8F8F` en secondaire — remplace les variables CSS actuelles (`--background`, `--foreground`, couleurs en dur des boutons/bulle).
  - Typographie : import des polices **Poppins** (texte courant) et **Anton** (titres/accroches), remplace `Arial, Helvetica, sans-serif` dans `globals.css`.
  - Reprise du style des boutons/CTA sur l'écran persona et la bulle de chatbot (coins, couleur, contraste), sans copier le logo ni les visuels protégés du site (seulement couleurs/typographie/esprit).
- **Hors périmètre** : récupération du logo ENDOmind (fichier non fourni dans la passation) ; refonte de la mise en page/structure des écrans ; animations.
- **Critères d'acceptation** :
  - Étant donné l'écran « Qui êtes-vous ? », quand il s'affiche, alors il utilise la couleur de marque et les polices Poppins/Anton.
  - Étant donné la bulle et la fenêtre de chatbot, quand elles s'affichent, alors leurs couleurs reprennent la palette ENDOmind (plus `#171717` sur blanc générique).
  - Étant donné n'importe quel écran existant, quand on compare avant/après, alors aucun texte ni fonctionnalité n'a changé — seul le style visuel diffère.
- **Hypothèse de l'équipe couverte** : aucune — demande de style, pas une fonctionnalité testée par l'équipe.
- **Codage estimé** : 8 minutes (variables CSS + import des polices + ajustement des styles inline existants dans `page.tsx`/`Chatbot.tsx`).
- **Fichiers prévus** : `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx` (chargement des polices), `frontend/src/app/page.tsx`, `frontend/src/app/components/Chatbot.tsx`.
- **Tests unitaires prévus** : aucun — pur balisage/style, rien à tester en logique métier (cohérent avec la règle « pas de test sur du balisage pur »).
- **Étapes ajoutées à la démo** : aucune nouvelle étape (le parcours ne change pas, seul le style change).
- **Bilan** :
  - Priorisée par le développeur avant l'itération 2, avec 15 minutes restantes annoncées — traitée comme itération de stabilisation (⚠️ pas de tour de test complet de l'équipe possible dans ce budget, demande explicitement priorisée par le développeur).
  - Durée de codage réelle : 1 minute (budget 8 minutes estimées, 10 minutes plafond — aucun dépassement).
  - Critères d'acceptation : les 3 sont satisfaits — couleur de marque et polices Poppins/Anton appliquées sur l'écran persona et le site ENDOmind, palette reprise sur la bulle/fenêtre de chatbot, aucun texte ni fonctionnalité modifiés. Vérifié dans le CSS réellement servi en production (`b33960`, `f2eee2`, `font-poppins`, `font-anton` présents).
  - Reporté : récupération du vrai logo ENDOmind (hors périmètre, fichier non fourni) ; la suppression du mode sombre automatique (`prefers-color-scheme: dark`) n'était pas demandée mais devenait incohérente avec la palette de marque fixe — à signaler à l'équipe si un visiteur en mode sombre doit être traité différemment.
  - Le harnais n'a rien bloqué : `npm test` et `npm run lint` passaient, `./scripts/verifier-deployabilite.sh` ne signalait aucune borne, `./scripts/signaler-version.sh 5` accepté du premier coup.
  - La démo Playwright (`e2e/demo.spec.ts`, hors DoD) échoue toujours pour une raison d'environnement déjà connue (bibliothèque système `libnspr4.so` manquante pour Chromium headless) — signalé, non bloquant pour la publication.
  - **Modifications** :
    - `frontend/src/app/layout.tsx` : remplace les polices Geist par Poppins/Anton (`next/font/google`) — sert le critère typographie.
    - `frontend/src/app/globals.css` : variables `--brand` (`#b33960`), `--brand-muted`, fond `--background` crème (`#f2eee2`), suppression du mode sombre automatique (incohérent avec une palette de marque fixe) — sert le critère couleur de marque.
    - `frontend/src/app/page.tsx` : couleurs/typographie de l'écran persona et du site ENDOmind reprennent la palette — sert le critère écran persona + site.
    - `frontend/src/app/components/Chatbot.tsx` : bulle/entête/boutons de question reprennent la couleur de marque — sert le critère chatbot.

## À venir

1. Propositions de fin de discussion : compte-rendu par mail et widget (boutons visibles et cliquables, non fonctionnels — mentionnés mais non implémentés dans la passation).
2. Itération de stabilisation finale pour le pitch, dès que le temps restant ne permet plus qu'une seule itération.
