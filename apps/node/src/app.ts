import express, { Request, Response, response } from 'express';
import cors from 'cors';
import { ApiRouteGetExtensions } from './routes/api/get-extensions';
import { ApiRouteGetModels } from './routes/api/get-models';
import { setupComfyUIProxy } from './routes/api/comfy-proxy';
import { setupWebsocketHandler } from './routes/api/websocket-handler';
import { ApiRouteAddTask } from './routes/api/add-task';
import { ApiRouteInstallExtension } from './routes/api/install-extension';
import { ApiRouteInstallModel } from './routes/api/install-model';
export async function startAppServer() {
  const app = express();
  const port = 3333;

  app.use(express.json());

  app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

  setupComfyUIProxy(app);
  
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express + TypeScript! asdf');
  });

  app.post('/api/add_task', ApiRouteAddTask);
  app.post('/api/data', (req: Request, res: Response) => {
    const { data } = req.body;
    res.json({ message: `Received data: ${data}` });
  });
  app.post('/api/install_extension', ApiRouteInstallExtension)
  app.post('/api/install_model', ApiRouteInstallModel)
  app.get('/api/extension_infos', ApiRouteGetExtensions)
  app.get('/api/model_infos', ApiRouteGetModels);

  const server = setupWebsocketHandler(app);
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}