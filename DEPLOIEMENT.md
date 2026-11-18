# Déploiement

Chatbot d'orientation pour ENDOmind (endométriose) : aide une patiente qui vient
d'être diagnostiquée à retrouver la ressource ENDOmind adaptée à sa situation.

## Services

- `frontend/` : export statique Next.js servi par nginx, exposé publiquement (port 80 du
  conteneur, 8080 sur la VM). Écran « Qui êtes-vous ? » (choix d'un persona) puis le
  site ENDOmind avec la bulle de chatbot.
- `api/` : service Node sans dépendance, port 8081. Pour l'instant : `/health` et
  `/sante` uniquement, aucune route métier (arrive à l'itération 2).

## Services externes

Aucun pour l'instant. Les itérations suivantes ajouteront la passerelle LLM de la
plateforme (`LLM_BASE_URL` / `LLM_API_KEY`) pour les réponses du chatbot.

## Connu comme fragile ou inachevé

- Les questions fréquentes s'affichent mais ne répondent pas encore (itération 2).
- Un seul persona mène à un écran fonctionnel ; les deux autres (acteurs identifiés
  dans la passation) ouvrent le même écran, sans comportement différencié : hors
  périmètre de cette version.

## Contact

- Équipe : Équipe 21 (hackathon eXaltemps Solidaire).
- Association : ENDOmind.
