# Closed Tasks

- [X] Create lobby ui - works
- [x] Create Lobby Login - did parts i send a user and get a lobby token back
- [x] Create Passwort/Token Local Storage - more or less, user for the current session is stored.
- [x] Create JSON File Loader - more or less, static typescript object questions
- [x] Create api call that is called in a loop - works
- [x] Display Questions
- [x] Send answer to backend - send answer is selected - update gamestate to actually which answer is selected - done
- [x] make either timer or admin view to end round and show next question. - currently timer based
- [x] Style Components - could be better perhaps try new neubrutalism
- [x] Create victory animation - could be better is a progressbar now
- [x] RoundTime Vote - lobby is created with certain setup
- [x] Questions from chat gpt. - currently done manually
- [x] performance improvements - gameState nur entsprechend des gameStatus rausgeben. - muss nicht unbedingt
- [x] Alle Subscribes checken das die aufgelöst werden. - could be still an issue
- [x] User Lobby Spezfisch ein und ausloggen - yes
- [x] PlayerSelector - yes
- [x] HeartBeat für den User, entfernen wenn heartbeat x sekunden weg war in pregame lobby. -
- [x] In endgame Lobby display answers by all users. And perhaps add auto scroll. - works but really simple
- [x] Finally add a celebration animation - progressbar
- [x] fix answer not correctly mapped on endgame lobby
- [x] make beatiful - debatable
- [x] add sound - sound service addest
- [x] Make answer selection actually satisfiying - somewhat, could be a bouncy transform
- [x] Add more different sounds - can be more
- [x] Add music and toggleable music
- [x] Make adjustable sounds
- [x] Add a websocket connection.
- [x] Add three js bouncy face icons - matter
- [x] display answeredInSeconds into the endscreen.t

# Open Tasks

- [ ] Add websockets security
- [ ] Add database and postgres + some kind of liquibase to instantly persists the question
- [ ] Add XSS and input validation for all forms.
- [ ] add firebase connection for serving questions
- [ ] add player vote to the frontend.
- [ ] display player state who answered.
- [ ] select color -> according to that get the icon/avatar
- [ ] Fix Round Votestart that every user can vote properly.
- [ ] Show answer state has answered or not on websocket screen
- [ ] serve player avatars from the backend

## DB

- [ ] Add import and export for questions
- [ ] Add mongo db connection and support to store and read the questions from there. - docker-compose

# bugs

- [ ] Cleanup websocket connection events, there is a bug when a player is already logged in

# Stretch Ideas
