import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));

const setupSwagger = (app: { use: (arg0: string, arg1: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[], arg2: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) => void; }) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  };
  
  export default setupSwagger;