const { env } = process;

module.exports = () => ({
  settings: {
    cors: {
      enabled: true,
      credentials: true,
      origin: `${env.ADMIN_HOST},${env.CLIENT_HOST}`,
    },
  },
});
