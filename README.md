This is a React boilerplate built on top of [Create React App](https://github.com/facebook/create-react-app).

The aim is to keep it as simple as possible, but include libraries and conventions that we commonly use, and have them properly set up from the get-go!

## Requirements
* `npx`
* `yarn`

## Libaries

* Scss: `node-sass 4.11.0`
* Routing: `react-router 4.3.1, react-router-dom 4.3.1, connected-react-router 6.3.1`
* Redux: `react-redux 6.0.1, redux-persist 5.10.0, reselect 4.0.0`
* Networking: `axios 0.18.0`

## Conventions

* **Styling & CSS classnames** We like to use an adapted version of [BEM](https://medium.freecodecamp.org/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849) for consistent naming of css classes. It makes writing JSX very easy when the correct classname for each component is always evident, and makes writing css a breeze when you can intuitively remember what the classnames you set are. Plus, there's nothing quite like the feeling of seeing your clean and organised code! Please see `STYLING.MD` for details on how to write scss like a boss.

* **Redux for everything** Use Redux actions for mostly everything your components do. Components should only rarely rely on their internal state, and should rather get their data from the Redux store via props and selectors. See REDUX.MD for some quick tips.

* **We use Yarn!** This is enforced with the `use-yarn` package, which prevents running `npm install` within the project. Instead, use `yarn add`,`yarn install` and `yarn start`.

* **No semi-colons!** They're really not needed - once you get used to leaving them out, you'll save yourself a surprising amount of extra keystrokes







