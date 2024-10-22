import { Routes } from './routes.js';
import { Home } from '../pages/home/home.js'
import { NotFound } from '../pages/not-found/not-found.js'
import { CatFact } from '../pages/cat-fact/cat-fact.js';

const routes = new Routes([
    new Home(),
    new CatFact(),
    new NotFound()
]);

export const globalScope = {
    count: -1,
    routes: routes
};