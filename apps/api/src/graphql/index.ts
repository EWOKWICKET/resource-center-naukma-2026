import { readFileSync } from 'fs';
import { join } from 'path';

export * from './resolvers';

export const schema = readFileSync(join(__dirname, '../../schema.graphql'), 'utf-8');
