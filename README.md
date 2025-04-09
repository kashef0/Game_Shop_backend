# Speluthyrning & Försäljning API

Det här är ett RESTful API för ett system där användare kan köpa och hyra spel. Administratörer kan hantera spel, beställningar och användare medan vanliga användare kan skapa beställningar och hantera sina konton.

## Funktioner

- **Användarhantering**
  - Registrera, logga in och autentisera med JWT.
  - Uppdatera användarprofiler.
  - Ta bort användarkonton (endast användaren själv eller administratör).
  
- **Spelhantering (Admin)**
  - Lägg till, uppdatera och ta bort spel.
  - Växla status på spel (aktiv/inaktiv).
  
- **Beställningar**
  - Skapa och hantera beställningar för köp och uthyrning av spel.
  - Admin kan hämta alla beställningar och markera dem som levererade.
  - Admin kan ta bort beställningar.


## API Endpoints

### Användarrelaterade rutter

- **POST** `/api/users/register`: Registrera en ny användare.
- **POST** `/api/users/login`: Logga in och få en JWT-token.
- **GET** `/api/users/profile`: Hämta användarens profil (skyddad route).
- **PUT** `/api/users/profile/:id`: Uppdatera användarens profil.
- **DELETE** `/api/users/profile/:id`: Ta bort användarens konto (endast admin eller användaren själv).

### Spelrelaterade rutter

- **GET** `/api/games`: Hämta alla aktiva spel.
- **GET** `/api/games/:id`: Hämta ett spel baserat på ID.
- **POST** `/api/games`: Lägg till eller uppdatera ett spel (endast admin).
- **PUT** `/api/games/:id/status`: Växla spelets status (endast admin).

### Beställningsrelaterade rutter

- **POST** `/api/orders`: Skapa en ny beställning.
- **GET** `/api/orders/myorders`: Hämta alla beställningar för den inloggade användaren.
- **GET** `/api/orders/:id`: Hämta en specifik beställning.
- **GET** `/api/orders`: Hämta alla beställningar (endast admin).
- **PUT** `/api/orders/:id/deliver`: Uppdatera en beställning till levererad (endast admin).
- **DELETE** `/api/orders/:id`: Ta bort en beställning (endast admin).

## Middleware

Projektet använder följande middleware för att skydda vissa rutter:

- **protect**: Skyddar rutter som kräver att användaren är inloggad.
- **admin**: Skyddar rutter som kräver administratörsbehörighet.

## Teknologier

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (JSON Web Token) för autentisering
- Multer för filuppladdning (profilbilder)


