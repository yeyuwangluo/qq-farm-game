/**
 * 服务器启动入口
 */
import app from './app.js';
import { config } from './config/database.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
});
