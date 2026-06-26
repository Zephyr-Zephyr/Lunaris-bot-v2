# 🌙 Lunaris Ticket Bot

Ein moderner Discord Bot mit Ticket-, Welcome- und Giveaway-System, gebaut mit discord.js

## ✨ Features

- 🎫 **Ticket System** - Benutzer können Support-Tickets erstellen
- 👋 **Welcome System** - Automatische Willkommensnachrichten für neue Mitglieder
- 🎉 **Giveaway System** - Einfaches Giveaway-Management
- 🚀 **Railway Ready** - Optimiert für Deployment auf Railway
- 📦 **GitHub Integration** - Automatisches Deployment via GitHub Actions
- 💾 **Datenbank Support** - MongoDB Integration optional verfügbar

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+
- Discord Bot Token
- GitHub Account (für CI/CD)
- Railway Account (für Hosting)

### Installation

1. **Repository klonen/einrichten:**
```bash
cd "d:\New Brave\Lunaris Ticket Bot\New Bot"
npm install
```

2. **.env Datei erstellen:**
```bash
cp .env.example .env
```

Dann die Werte eintragen:
```env
DISCORD_TOKEN=dein_token_hier
CLIENT_ID=deine_client_id
GUILD_ID=deine_guild_id (optional)
```

3. **Lokal testen:**
```bash
npm run dev
```

## 📖 Befehle

### Ticket Commands
```
/ticket setup <channel> - Richte das Ticket-System ein
/ticket close - Schließe das aktuelle Ticket
```

### Welcome Commands
```
/welcome set <channel> <message> - Stelle die Welcome-Nachricht ein
/welcome test - Teste die Welcome-Nachricht
```

### Giveaway Commands
```
/giveaway start <prize> <duration> <winners> - Starte ein Giveaway
```

### Sonstige Commands
```
/ping - Zeige Bot-Latenz
```

## 🚀 Deployment auf Railway

### Schritt 1: Railway Account erstellen
1. Gehe zu https://railway.app
2. Melde dich mit GitHub an
3. Erstelle ein neues Projekt

### Schritt 2: GitHub Secret hinzufügen
1. Gehe zu deinem GitHub Repository
2. Settings → Secrets and variables → Actions
3. Neues Secret: `RAILWAY_TOKEN`
   - Token von Railway Dashboard kopieren

### Schritt 3: Umgebungsvariablen auf Railway
1. Im Railway Dashboard: Variables
2. Alle `.env` Variablen eintragen:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - etc.

### Schritt 4: Deployen
```bash
git push main
```
GitHub Actions wird automatisch den Bot deployen!

## 🔗 GitHub Integration

### Automatisches Deployment
Das Repository ist mit GitHub Actions konfiguriert:

- ✅ **Automatisches Deployment** bei Push zu `main` Branch
- ✅ **Code Quality Checks** vor dem Deployment
- ✅ **Security Audits** für Dependencies

### Workflows anzeigen
Gehe zu: Actions → Workflow Runs

## 📦 Erweiterung

### Neuen Command hinzufügen

Erstelle eine neue Datei in `src/commands/`:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meinbefehl')
    .setDescription('Beschreibung'),

  async execute(interaction) {
    await interaction.reply('Antwort');
  },
};
```

### Neuen Event hinzufügen

Erstelle eine neue Datei in `src/events/`:

```javascript
module.exports = {
  name: 'eventName',
  once: false, // true wenn Event nur einmal aufgerufen wird
  execute(event, client) {
    console.log('Event getriggert!');
  },
};
```

## 📝 Projektstruktur

```
├── index.js                 # Hauptdatei
├── package.json             # Dependencies
├── .env.example             # Umgebungsvariablen Vorlage
├── Dockerfile              # Docker-Konfiguration
├── Procfile                # Railway/Heroku Konfiguration
├── railway.json            # Railway-Spezifikationen
├── README.md               # Diese Datei
├── .github/
│   └── workflows/          # GitHub Actions
│       ├── deploy.yml      # Auto-Deployment
│       └── lint.yml        # Code Quality
└── src/
    ├── commands/           # Slash Commands
    │   ├── ping.js
    │   ├── ticket.js
    │   ├── giveaway.js
    │   └── welcome.js
    ├── events/             # Event Handler
    │   ├── ready.js
    │   ├── interactionCreate.js
    │   └── guildMemberAdd.js
    ├── models/             # Datenbank Modelle (optional)
    └── utils/              # Utility Funktionen
```

## 🐛 Troubleshooting

### Bot erscheint nicht online
- ✅ DISCORD_TOKEN in .env überprüfen
- ✅ Bot Permissions prüfen
- ✅ Intents aktivieren

### Commands werden nicht angezeigt
- ✅ Bot neu starten
- ✅ Cache löschen: `npm run dev`
- ✅ Guild ID überprüfen

### Deployment fehlgeschlagen
- ✅ RAILWAY_TOKEN Secret überprüfen
- ✅ GitHub Actions Logs anschauen
- ✅ Railway Logs prüfen

## 📚 Weitere Ressourcen

- [discord.js Docs](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers)
- [Railway Docs](https://docs.railway.app)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 📄 Lizenz

MIT License - siehe LICENSE Datei

## 👥 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- Discord Support Server

---

**Gemacht mit ❤️ für Discord Communities**
