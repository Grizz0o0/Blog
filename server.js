const app = require('./src/v1/app');

const PORT = process.env.DEV_APP_PORT;

const server = app.listen(PORT, () => {
    console.log(`Blog start with ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
});
