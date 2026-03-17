export type Locale = 'en' | 'de' | 'fr' | 'it';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch (CH)',
  fr: 'Français (CH)',
  it: 'Italiano (CH)',
};

const translations = {
  // ── Welcome / Home ──
  welcome_subtitle: {
    en: 'Describe what you need — Pit will help',
    de: 'Beschreibe, was du suchst — Pit hilft dir',
    fr: 'Décris ce que tu cherches — Pit t\'aide',
    it: 'Descrivi cosa cerchi — Pit ti aiuta',
  },
  scroll_to_explore: {
    en: '← scroll to explore →',
    de: '← scrollen zum Entdecken →',
    fr: '← défiler pour explorer →',
    it: '← scorri per esplorare →',
  },

  // ── Chat ──
  chat_header: {
    en: 'Pit · AI Lighting Advisor',
    de: 'Pit · KI-Lichtberater',
    fr: 'Pit · Conseiller luminaire IA',
    it: 'Pit · Consulente illuminazione IA',
  },
  chat_placeholder: {
    en: 'e.g. "I\'m looking for something for my office"',
    de: 'z.B. «Ich suche etwas für mein Büro»',
    fr: 'p.ex. «Je cherche quelque chose pour mon bureau»',
    it: 'es. «Cerco qualcosa per il mio ufficio»',
  },
  chat_initial: {
    en: 'Hello! I\'m **Pit**. Describe what you\'re looking for — for which room, what mood, what purpose?',
    de: 'Hallo! Ich bin **Pit**. Beschreibe mir, was du suchst — für welchen Raum, welche Stimmung, welchen Zweck?',
    fr: 'Bonjour ! Je suis **Pit**. Décris-moi ce que tu cherches — pour quelle pièce, quelle ambiance, quel usage ?',
    it: 'Ciao! Sono **Pit**. Descrivimi cosa cerchi — per quale stanza, che atmosfera, quale scopo?',
  },
  chat_error: {
    en: 'Sorry, there was a problem. Please try again.',
    de: 'Entschuldigung, es gab ein Problem. Bitte versuche es erneut.',
    fr: 'Désolé, un problème est survenu. Veuillez réessayer.',
    it: 'Scusa, si è verificato un problema. Riprova.',
  },
  yes: { en: 'Yes', de: 'Ja', fr: 'Oui', it: 'Sì' },
  skip: { en: 'Skip', de: 'Skip', fr: 'Passer', it: 'Salta' },

  // ── Header ──
  new_wishlist: {
    en: 'New wishlist',
    de: 'Neue Merkliste',
    fr: 'Nouvelle liste de souhaits',
    it: 'Nuova lista dei desideri',
  },
  new_order_list: {
    en: 'New order list',
    de: 'Neue Bestellliste',
    fr: 'Nouvelle liste de commande',
    it: 'Nuova lista ordini',
  },
  my_account: {
    en: 'My account',
    de: 'Mein Konto',
    fr: 'Mon compte',
    it: 'Il mio conto',
  },

  // ── Product Detail ──
  power: { en: 'Power', de: 'Leistung', fr: 'Puissance', it: 'Potenza' },
  efficiency: { en: 'Efficiency', de: 'Effizienz', fr: 'Efficacité', it: 'Efficienza' },
  luminous_flux: { en: 'Luminous flux', de: 'Lichtstrom', fr: 'Flux lumineux', it: 'Flusso luminoso' },
  dimensions: { en: 'Dimensions', de: 'Maße', fr: 'Dimensions', it: 'Dimensioni' },
  weight: { en: 'Weight', de: 'Gewicht', fr: 'Poids', it: 'Peso' },
  protection_class: { en: 'Protection class', de: 'Schutzklasse', fr: 'Classe de protection', it: 'Classe di protezione' },
  lifespan: { en: 'Lifespan', de: 'Lebensdauer', fr: 'Durée de vie', it: 'Durata' },
  beam_angle: { en: 'Beam angle', de: 'Abstrahlwinkel', fr: 'Angle de diffusion', it: 'Angolo di emissione' },
  technical_data: { en: 'Technical data', de: 'Technische Daten', fr: 'Données techniques', it: 'Dati tecnici' },
  controls: { en: 'Controls', de: 'Steuerung', fr: 'Commande', it: 'Controllo' },
  documents: { en: 'Documents', de: 'Dokumente', fr: 'Documents', it: 'Documenti' },
  datasheet: { en: 'Datasheet', de: 'Datenblatt', fr: 'Fiche technique', it: 'Scheda tecnica' },
  light_diagram: { en: 'Light diagram', de: 'Lichtdiagramm', fr: 'Diagramme lumineux', it: 'Diagramma luce' },
  mounting_instructions: { en: 'Mounting instructions', de: 'Montageanleitung', fr: 'Instructions de montage', it: 'Istruzioni di montaggio' },
  drawing: { en: 'Drawing', de: 'Zeichnung', fr: 'Dessin', it: 'Disegno' },
  add_to_project: { en: 'Add to project', de: 'Zur Projektliste', fr: 'Ajouter au projet', it: 'Aggiungi al progetto' },
  saved: { en: 'Saved ✓', de: 'Gemerkt ✓', fr: 'Enregistré ✓', it: 'Salvato ✓' },
  save: { en: 'Save', de: 'Merken', fr: 'Enregistrer', it: 'Salva' },
  list_price: { en: 'List price', de: 'Listenpreis', fr: 'Prix catalogue', it: 'Prezzo di listino' },
  indoor: { en: 'Indoor', de: 'Innen', fr: 'Intérieur', it: 'Interno' },
  outdoor: { en: 'Outdoor', de: 'Aussen', fr: 'Extérieur', it: 'Esterno' },
  phase_cut: { en: 'Phase cut', de: 'Phasenanschnitt', fr: 'Gradation de phase', it: 'Taglio di fase' },
  not_matching: { en: 'Not matching', de: 'Nicht passend', fr: 'Non correspondant', it: 'Non corrispondente' },

  // ── Wishlist Overlay ──
  wishlist: { en: 'Wishlist', de: 'Merkliste', fr: 'Liste de souhaits', it: 'Lista dei desideri' },
  no_products_in_list: {
    en: 'No products in this list yet',
    de: 'Noch keine Produkte in dieser Liste',
    fr: 'Pas encore de produits dans cette liste',
    it: 'Ancora nessun prodotto in questa lista',
  },
  request_delivery_dates: {
    en: 'Request delivery dates',
    de: 'Liefertermine anfragen',
    fr: 'Demander les délais de livraison',
    it: 'Richiedere date di consegna',
  },
  request_delivery_date: {
    en: 'Request delivery date',
    de: 'Liefertermin anfragen',
    fr: 'Demander le délai de livraison',
    it: 'Richiedere data di consegna',
  },
  move_to: { en: 'Move to:', de: 'Verschieben:', fr: 'Déplacer vers :', it: 'Sposta a:' },
  remove: { en: 'Remove', de: 'Entfernen', fr: 'Supprimer', it: 'Rimuovi' },
  delete_list: { en: 'Delete list', de: 'Liste löschen', fr: 'Supprimer la liste', it: 'Elimina lista' },

  // ── Project Overlay ──
  order_list: { en: 'Order list', de: 'Bestellliste', fr: 'Liste de commande', it: 'Lista ordini' },
  no_products_in_order_list: {
    en: 'No products in this order list yet',
    de: 'Noch keine Produkte in dieser Bestellliste',
    fr: 'Pas encore de produits dans cette liste de commande',
    it: 'Ancora nessun prodotto in questa lista ordini',
  },
  order: { en: 'Order', de: 'Bestellen', fr: 'Commander', it: 'Ordinare' },
  delete_order_list: { en: 'Delete order list', de: 'Bestellliste löschen', fr: 'Supprimer la liste de commande', it: 'Elimina lista ordini' },

  // ── Cart Overlay ──
  project_list: { en: 'Project list', de: 'Projektliste', fr: 'Liste de projet', it: 'Lista progetto' },
  no_products_added: {
    en: 'No products added yet.',
    de: 'Noch keine Produkte hinzugefügt.',
    fr: 'Aucun produit ajouté.',
    it: 'Nessun prodotto aggiunto.',
  },
  request_delivery_times: {
    en: 'Request delivery times',
    de: 'Lieferfristen anfragen',
    fr: 'Demander les délais de livraison',
    it: 'Richiedere tempi di consegna',
  },

  // ── Add to Project Popover ──
  add_to_project_title: {
    en: 'Add to project',
    de: 'Zu Projekt hinzufügen',
    fr: 'Ajouter au projet',
    it: 'Aggiungi al progetto',
  },

  // ── Auth Splash ──
  login: { en: 'Login', de: 'Anmelden', fr: 'Se connecter', it: 'Accedi' },
  create_account: { en: 'Create account', de: 'Konto erstellen', fr: 'Créer un compte', it: 'Crea account' },
  verify_email: { en: 'Verify email', de: 'E-Mail verifizieren', fr: 'Vérifier l\'e-mail', it: 'Verifica e-mail' },
  your_details: { en: 'Your details', de: 'Deine Angaben', fr: 'Tes informations', it: 'I tuoi dati' },
  login_subtitle: {
    en: 'Sign in to see your results.',
    de: 'Melde dich an, um deine Ergebnisse zu sehen.',
    fr: 'Connecte-toi pour voir tes résultats.',
    it: 'Accedi per vedere i tuoi risultati.',
  },
  register_step1_subtitle: {
    en: 'Enter your email address to get started.',
    de: 'Gib deine E-Mail-Adresse ein, um zu starten.',
    fr: 'Entre ton adresse e-mail pour commencer.',
    it: 'Inserisci il tuo indirizzo e-mail per iniziare.',
  },
  register_step2_subtitle: {
    en: 'We sent a code to {email}.',
    de: 'Wir haben einen Code an {email} gesendet.',
    fr: 'Nous avons envoyé un code à {email}.',
    it: 'Abbiamo inviato un codice a {email}.',
  },
  register_step3_subtitle: {
    en: 'A few more details about you and your company.',
    de: 'Noch ein paar Angaben zu dir und deiner Firma.',
    fr: 'Encore quelques détails sur toi et ton entreprise.',
    it: 'Ancora qualche dato su di te e la tua azienda.',
  },
  email: { en: 'Email', de: 'E-Mail', fr: 'E-mail', it: 'E-mail' },
  password: { en: 'Password', de: 'Passwort', fr: 'Mot de passe', it: 'Password' },
  sign_in: { en: 'Sign in', de: 'Anmelden', fr: 'Se connecter', it: 'Accedi' },
  next: { en: 'Next', de: 'Weiter', fr: 'Suivant', it: 'Avanti' },
  confirm: { en: 'Confirm', de: 'Bestätigen', fr: 'Confirmer', it: 'Conferma' },
  change_email: { en: 'Change email', de: 'E-Mail ändern', fr: 'Changer l\'e-mail', it: 'Cambia e-mail' },
  resend_code: { en: 'Resend code', de: 'Code erneut senden', fr: 'Renvoyer le code', it: 'Invia di nuovo il codice' },
  sending: { en: 'Sending…', de: 'Sende…', fr: 'Envoi…', it: 'Invio…' },
  first_last_name: { en: 'First and last name', de: 'Vor- und Nachname', fr: 'Prénom et nom', it: 'Nome e cognome' },
  company_name: { en: 'Company name', de: 'Firmenname', fr: 'Nom de l\'entreprise', it: 'Nome azienda' },
  occupation: { en: 'Occupation', de: 'Tätigkeit', fr: 'Activité', it: 'Attività' },
  password_min6: { en: 'Password (min. 6 characters)', de: 'Passwort (mind. 6 Zeichen)', fr: 'Mot de passe (min. 6 caractères)', it: 'Password (min. 6 caratteri)' },
  back: { en: 'Back', de: 'Zurück', fr: 'Retour', it: 'Indietro' },
  register: { en: 'Register', de: 'Registrieren', fr: 'S\'inscrire', it: 'Registrati' },
  no_account: {
    en: 'No account yet? Register',
    de: 'Noch kein Konto? Registrieren',
    fr: 'Pas encore de compte ? S\'inscrire',
    it: 'Non hai un account? Registrati',
  },
  already_registered: {
    en: 'Already registered? Sign in',
    de: 'Bereits registriert? Anmelden',
    fr: 'Déjà inscrit ? Se connecter',
    it: 'Già registrato? Accedi',
  },
  welcome: { en: 'Welcome!', de: 'Willkommen!', fr: 'Bienvenue !', it: 'Benvenuto!' },
  account_created: {
    en: 'Your account has been created successfully. You are now logged in.',
    de: 'Dein Konto wurde erfolgreich erstellt. Du bist jetzt eingeloggt.',
    fr: 'Ton compte a été créé avec succès. Tu es maintenant connecté.',
    it: 'Il tuo account è stato creato con successo. Ora sei connesso.',
  },
  role_architect: { en: 'Architect', de: 'Architekt', fr: 'Architecte', it: 'Architetto' },
  role_light_planner: { en: 'Light planner', de: 'Lichtplaner', fr: 'Planificateur lumière', it: 'Progettista luce' },
  role_electrician: { en: 'Electrician', de: 'Elektriker', fr: 'Électricien', it: 'Elettricista' },
  role_dealer: { en: 'Dealer', de: 'Händler', fr: 'Revendeur', it: 'Rivenditore' },
  role_other: { en: 'Other', de: 'Sonstiges', fr: 'Autre', it: 'Altro' },

  // ── Validation errors ──
  err_valid_email: {
    en: 'Please enter a valid email',
    de: 'Bitte gültige E-Mail eingeben',
    fr: 'Veuillez entrer un e-mail valide',
    it: 'Inserisci un\'e-mail valida',
  },
  err_email_send: {
    en: 'Could not send email',
    de: 'E-Mail konnte nicht gesendet werden',
    fr: 'Impossible d\'envoyer l\'e-mail',
    it: 'Impossibile inviare l\'e-mail',
  },
  err_otp_6digits: {
    en: 'Please enter the 6-digit code',
    de: 'Bitte 6-stelligen Code eingeben',
    fr: 'Veuillez entrer le code à 6 chiffres',
    it: 'Inserisci il codice a 6 cifre',
  },
  err_otp_invalid: {
    en: 'Code invalid or expired',
    de: 'Code ungültig oder abgelaufen',
    fr: 'Code invalide ou expiré',
    it: 'Codice non valido o scaduto',
  },
  err_enter_name: {
    en: 'Please enter your name',
    de: 'Bitte Namen eingeben',
    fr: 'Veuillez entrer votre nom',
    it: 'Inserisci il tuo nome',
  },
  err_enter_company: {
    en: 'Please enter your company name',
    de: 'Bitte Firmennamen eingeben',
    fr: 'Veuillez entrer le nom de l\'entreprise',
    it: 'Inserisci il nome dell\'azienda',
  },
  err_password_min6: {
    en: 'Password must be at least 6 characters',
    de: 'Passwort mind. 6 Zeichen',
    fr: 'Le mot de passe doit contenir au moins 6 caractères',
    it: 'La password deve avere almeno 6 caratteri',
  },
  err_registration_failed: {
    en: 'Registration failed',
    de: 'Registrierung fehlgeschlagen',
    fr: 'Inscription échouée',
    it: 'Registrazione fallita',
  },

  // ── Profile Page ──
  sign_out: { en: 'Sign out', de: 'Abmelden', fr: 'Se déconnecter', it: 'Esci' },
  company: { en: 'Company', de: 'Firma', fr: 'Entreprise', it: 'Azienda' },
  phone: { en: 'Phone', de: 'Telefon', fr: 'Téléphone', it: 'Telefono' },
  change_password: { en: 'Change password', de: 'Passwort ändern', fr: 'Changer le mot de passe', it: 'Cambia password' },
  new_password: { en: 'New password', de: 'Neues Passwort', fr: 'Nouveau mot de passe', it: 'Nuova password' },
  change: { en: 'Change', de: 'Ändern', fr: 'Modifier', it: 'Modifica' },
  min_6_chars: { en: 'Min. 6 characters', de: 'Mind. 6 Zeichen', fr: 'Min. 6 caractères', it: 'Min. 6 caratteri' },
  password_updated: { en: 'Password updated ✓', de: 'Passwort aktualisiert ✓', fr: 'Mot de passe mis à jour ✓', it: 'Password aggiornata ✓' },
  ordered_articles: { en: 'Ordered articles', de: 'Bestellte Artikel', fr: 'Articles commandés', it: 'Articoli ordinati' },
  no_open_orders: { en: 'No open orders.', de: 'Keine offenen Bestellungen.', fr: 'Aucune commande en cours.', it: 'Nessun ordine aperto.' },
  delivered_articles: { en: 'Delivered articles', de: 'Gelieferte Artikel', fr: 'Articles livrés', it: 'Articoli consegnati' },
  no_deliveries: { en: 'No deliveries yet.', de: 'Noch keine Lieferungen.', fr: 'Pas encore de livraisons.', it: 'Ancora nessuna consegna.' },
  cancelled_orders: { en: 'Cancelled orders', de: 'Stornierte Bestellungen', fr: 'Commandes annulées', it: 'Ordini annullati' },
  simulate_delivery: { en: 'Simulate delivery', de: 'Lieferung simulieren', fr: 'Simuler la livraison', it: 'Simula consegna' },
  cancel: { en: 'Cancel', de: 'Stornieren', fr: 'Annuler', it: 'Annullare' },
  report_defect: { en: 'Report defect', de: 'Defekt melden', fr: 'Signaler un défaut', it: 'Segnala difetto' },
  describe_defect: { en: 'Describe the defect:', de: 'Beschreiben Sie den Defekt:', fr: 'Décrivez le défaut :', it: 'Descrivi il difetto:' },
  what_is_defective: { en: 'What is defective?', de: 'Was ist defekt?', fr: 'Qu\'est-ce qui est défectueux ?', it: 'Cosa è difettoso?' },
  err_enter_description: { en: 'Please enter a description', de: 'Bitte Beschreibung eingeben', fr: 'Veuillez entrer une description', it: 'Inserisci una descrizione' },
  defect_reported: { en: 'Defect reported ✓', de: 'Defekt gemeldet ✓', fr: 'Défaut signalé ✓', it: 'Difetto segnalato ✓' },
  submit: { en: 'Submit', de: 'Senden', fr: 'Envoyer', it: 'Invia' },
  articles: { en: 'articles', de: 'Artikel', fr: 'articles', it: 'articoli' },
  language: { en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua' },

  // ── Status labels ──
  status_draft: { en: 'Draft', de: 'Entwurf', fr: 'Brouillon', it: 'Bozza' },
  status_submitted: { en: 'Submitted', de: 'Eingereicht', fr: 'Soumis', it: 'Inviato' },
  status_checking: { en: 'Checking delivery', de: 'Lieferfristen prüfen', fr: 'Vérification livraison', it: 'Verifica consegna' },
  status_confirmed: { en: 'Confirmed', de: 'Bestätigt', fr: 'Confirmé', it: 'Confermato' },
  status_shipped: { en: 'Shipped', de: 'Versendet', fr: 'Expédié', it: 'Spedito' },
  status_delivered: { en: 'Delivered', de: 'Geliefert', fr: 'Livré', it: 'Consegnato' },
  status_cancelled: { en: 'Cancelled', de: 'Storniert', fr: 'Annulé', it: 'Annullato' },

  // ── 404 ──
  page_not_found: { en: 'Oops! Page not found', de: 'Seite nicht gefunden', fr: 'Page introuvable', it: 'Pagina non trovata' },
  return_home: { en: 'Return to Home', de: 'Zur Startseite', fr: 'Retour à l\'accueil', it: 'Torna alla home' },

  // ── Chat assistant messages (Index) ──
  constraint_set: {
    en: '✓ **{label}** has been set as a filter.',
    de: '✓ **{label}** wurde als Filter gesetzt.',
    fr: '✓ **{label}** a été défini comme filtre.',
    it: '✓ **{label}** è stato impostato come filtro.',
  },
  inquiry_created: {
    en: 'Your inquiry **#{id}** has been created! We will check delivery times and get back to you.',
    de: 'Deine Anfrage **#{id}** wurde erstellt! Wir prüfen die Lieferfristen und melden uns bei dir.',
    fr: 'Ta demande **#{id}** a été créée ! Nous vérifierons les délais de livraison et reviendrons vers toi.',
    it: 'La tua richiesta **#{id}** è stata creata! Verificheremo i tempi di consegna e ti contatteremo.',
  },
  inquiry_submitted: {
    en: 'Your inquiry has been submitted! We will check delivery times and get back to you.',
    de: 'Deine Anfrage wurde eingereicht! Wir prüfen die Lieferfristen und melden uns bei dir.',
    fr: 'Ta demande a été soumise ! Nous vérifierons les délais et reviendrons vers toi.',
    it: 'La tua richiesta è stata inviata! Verificheremo i tempi e ti contatteremo.',
  },
  inquiry_date: {
    en: 'Inquiry {date}',
    de: 'Anfrage {date}',
    fr: 'Demande {date}',
    it: 'Richiesta {date}',
  },
} as const;

export type TranslationKey = keyof typeof translations;
export default translations;
