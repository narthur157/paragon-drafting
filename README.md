ParaDrafter -- A drafting tool for Paragon

Backend - Node/Express server using a Redux'ish state mechanism that does not aim for immutability. 
defaults.js - Stores objects, singletons, and factories
app.js - Main file for running Express
draftSession.js - manages all the business logic of the actual drafting process
drafting.js - Sets up the drafting session and binds the socket events to handlers in draftSession

Frontend - First page is just JQuery because it is extremely simple. Drafting sessions use Ractive for updating the view