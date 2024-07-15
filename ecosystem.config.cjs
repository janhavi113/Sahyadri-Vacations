module.exports = {
  apps: [
    {
      name: 'sahyadri-vacations',
      script: '/root/Sahyadri-Vacations/backend/server.js',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};

