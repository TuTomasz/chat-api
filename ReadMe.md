## Chat Service

by Tomasz Turek

Time spent: 6 hours, roughly 2 hours on the core functionality, and the rest of the time was spent making this setup functional with type safety in mind, along with a few bonus features.

## Instructions

To run the service, you need to have pnpm and Docker installed on your system. PNPM can be installed with the command below or using brew.

```
npm install -g pnpm
```

In root directory, run.

```
pnpm start:dev
```

It will download all the necessary dependencies, Docker images, run the migrations, and start the service locally. This can take about 20 seconds the first time around.

## Notes

- I included a .env file in the repo to make setup easier. It's bad practice but done for the simplicity of the demo.

- Used Docker Compose to automate building the service locally.

- I added migration functionality for easy database schema evolution. You can also view tables in services/chat-service/migrations folder.

- The exported folder contains all the types used by the application for easy sharing with the frontend.

- Core functionality of the chat application is under services/chat-service/src.

- I also hashed passwords for the user creation portion of the application for extra security.

- I included a SQL dump file in database folder

## Recomendations

- It would be better to use UUIDs for various IDs in the schema instead of numbers and add some sort of UserContacts table to store references to users contacted or allowed to be contacted. Additionally, this would prevent users randomly messaging other users by guessing their ID.

- Also, in a real application, login would return an authorization token that other chat endpoints would require in headers to communicate with other users. This way You can only send messages on your own behalf since this would identify your user_id. Right now
  this chat app is a bit of wild west.

- I would also add INDEX (sender_id) and (receiver_id) to speed up lookup queries since we would do plenty of message lookups.

- I would probobly also make view_messages a POST request to not openly display ID of user conversations you are fetching. Again authority header would be needed to allow you to fetch only your conversations with a particular user.
