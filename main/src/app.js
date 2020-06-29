import router from './router/index.js';
import Route from './router/Route.js';



import homeView from './views/home.js';
import contactView from './views/contact.js';
import aboutView from './views/about.js';
import profileView from './views/profile.js';
import scoresView from './views/scores.js';

const routes = [
    new Route('home', '/', homeView),
    new Route('contact', '/contact', contactView),
    new Route('about', '/about', aboutView),
    new Route('profile', '/profile/:name', profileView),
    new Route('scores', '/scores', scoresView)
];

router(routes);
// amirite();