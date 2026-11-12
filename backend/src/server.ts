import app from './app.js';
import { ENV } from './config/env.js';

const HOST = '0.0.0.0';

app.listen(ENV.PORT, HOST, () => {
  console.log(`Server RecyNect berjalan di http://${HOST}:${ENV.PORT}`);
});
