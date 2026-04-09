# Smart Game Modifications

Change menu item add game to create game

## dashboard.html

Add domains card(Showcases statistics of available domains.Example of Domains(Electrical engineering,Computer science))

## users.html

Remove the add users button(Users are automatically added on login)

## add-game.html

Change file name add game to create game
Change the form structure to be as follows:

- Domain(Drop down)
- Subject(Drop down)
- Name of the game
- Html file name
- Description
- Difficulty level->(change to) Cognitive level(Drop down)
- a_discrimination(Data type - decimal)-> Use textfield
- b_difficulty(Data type - decimal)-> Use textfield
- c_guessing(Data type - decimal)-> Use textfield
- model type->2pl,3pl(User can select both or one)-> Use radio button
- max_raw_score(Data type percentage)
- Exposure_count(Data type int)
- Game HTML file

## roles.html

Remove temporary password field(It will be automatically generated)

## login.html

Comment out the select role demo(System will automatically determine the role)
