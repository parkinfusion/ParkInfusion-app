# ParkInfusion

Un'applicazione web per la gestione della terapia Duodopa sottocutanea per pazienti con Parkinson.

## Caratteristiche

- **Gestione Terapia Giornaliera**: Registrazione delle terapie Duodopa e Duodopa + Canula
- **Calendario Terapie**: Visualizzazione calendario mensile con indicatori delle terapie completate
- **Gestione Magazzino**: Monitoraggio scorte di canule, siringhe e adattatori
- **Report Mensili**: Statistiche di utilizzo dispositivi e calendario terapie
- **Promemoria**: Sistema di notifiche personalizzabili per ricordare la terapia
- **Account Utente**: Gestione profilo e impostazioni personali

## Tecnologie Utilizzate

- **React 18** con TypeScript
- **Vite** per il build e sviluppo
- **Tailwind CSS** per lo styling
- **Shadcn/ui** per i componenti UI
- **Lucide React** per le icone
- **LocalStorage** per la persistenza dati

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/your-username/parkinfusion.git
cd parkinfusion
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri il browser su `http://localhost:5173`

## Build per Produzione

```bash
npm run build
```

I file di produzione saranno generati nella cartella `dist/`.

## Struttura del Progetto

```
src/
├── components/          # Componenti riutilizzabili
│   ├── ui/             # Componenti UI base (Shadcn)
│   ├── Calendar.tsx    # Componente calendario
│   ├── Navigation.tsx  # Navigazione bottom
│   └── ...
├── pages/              # Pagine dell'applicazione
│   ├── Index.tsx       # Home page
│   ├── Inventory.tsx   # Gestione magazzino
│   ├── Reports.tsx     # Report e calendario
│   ├── Notifications.tsx # Promemoria
│   └── ...
├── lib/                # Utilità e configurazioni
│   ├── storage.ts      # Gestione localStorage
│   ├── types.ts        # Definizioni TypeScript
│   └── utils.ts        # Funzioni utility
└── App.tsx             # Componente principale
```

## Funzionalità Principali

### Gestione Terapia
- Registrazione terapie giornaliere (Duodopa o Duodopa + Canula)
- Prevenzione doppia registrazione nella stessa giornata
- Calcolo automatico consumo dispositivi

### Calendario Terapie
- Vista calendario mensile classica
- Indicatori colorati per tipo terapia
- Navigazione tra mesi
- Lista terapie recenti

### Gestione Magazzino
- Monitoraggio scorte in tempo reale
- Aggiornamento automatico dopo ogni terapia
- Alert per scorte in esaurimento
- Gestione manuale delle quantità

### Sistema Promemoria
- Notifiche personalizzabili
- Testo promemoria modificabile
- Funzione snooze
- Integrazione notifiche browser

## Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## Supporto

Per supporto o domande, apri un issue su GitHub.