## Redux guide 

Redux at it's core is a very simple concept, but generally not explained too well. Here's a really quick guide on how it works, and why we should use it for storing 99% of the data in the app.

# What it is in one sentence

Redux allows any component in your app to store data in a "local database", and retrieve data from there in any other component in your app. We refer to this "local database" as the Redux store. Benefits:

* Load data from an API only once - not in every single component that displays that data
* No need to juggle data around your app via props

It's that simple.

# Concepts

Redux comes with a few different concepts that might take a while to grasp. Don't worry if you don't fully understand them just yet, but they are:

* **Actions** - events which send data to your reducers
* **Reducers** - functions which listen to these events, and edit the Redux store based on thetype of  event
* **Selectors** - functions which you can use to get some data from the Redux store into your components

# Example 

Imagine a component that:

* A) Fetches a list of articles from an API
* B) Displays the articles in a list

# Implementation without Redux

If we implement this without Redux, we might do something like this:

```
import API from './myApiService'

class ArticleList extends Component {

	constructor(props) {
		super(props)

		this.state = {
			articles: [],
			loading: false,
			error: false,
		}
	}

	componentDidMount() {
		this.setState({
			loading: true,
		})

		API.getArticles().then(articles => {
			this.setState({ articles, loading: false })
		}).catch(e => {
			this.setState({
				loading: false,
				error: true,
			})
		})
	}

	render() {

		if (this.state.loading) {
			return <h1>Loading...</h1>
		}

		if (this.state.error) {
			return <h1>Error!</h1>
		}

		return this.state.articles.map(article => ...)
	}
}

export default ArticleList
```

Seems pretty simple, and it is, but also comes with a few drawbacks:

* The data is fetched again **every time** the component mounts, which is probably way too often
* If we want to display the same data in another component, we have to rewrite the entire API logic, plus any possible filtering or sorting logic that we might use elsewhere
* In larger projects, you start to have lots of extra or duplicate logic in components that should only be used for displaying data - we don't want that

# Implementation with Redux

Let's implement the same component with Redux. It requires a bit more code upfront, but once you have it set up displaying your articles anywhere in your app is dead simple. Bare with it, it'll be worth it in the end, I promise.

# Setting up redux files 

Within the `redux/` directory, let's create a new directory called `articles/`. Within that, we'll add the following files:

**actionTypes.js**

This file describes which types of "events" related to articles we can send, or in Redux terminology: "dispatch". In it, let's write the following:

```
export const SET_ARTICLES = 'articles/SET_ARTICLES'
export const ARTICLES_LOADING = 'articles/ARTICLES_LOADING'
export const ARTICLES_ERROR = 'articles/ARTICLES_ERROR'
```

The values for these constants can be anything, but must be unique within your app. Best practice would be to name them according to the directory you are in, e.g. {directory_name}/{action_name} (like above)

**actions.js**

This file contains any functions that we use to send updates to the article-related data in Redux. In this case, it'll just contain a function that we can call to fetch new articles and send them to the Redux store. It can contain as many functions as you want, but usually less is more. Let's write the following:

```
import API from '../myApiService'
import * as ActionTypes from './actionTypes'

export const fetchArticles = () => dispatch => {

	dispatch({type: ActionTypes.ARTICLES_LOADING})

	return API.getArticles().then(articles => {
		dispatch({
			type: ActionTypes.SET_ARTICLES,
			payload: articles
		})
	}).catch(e => {
		console.log('Error getting articles', e)
		dispatch({type: ActionTypes.ARTICLES_ERROR})
	})
}
```

This function does three things: 

* When called, sends an event that says "articles are now loading"
* If the api call is successsful, sends an event that says "articles loaded", and attaches the articles as a payload to that event
* If the api call fails, sends an event that says "loading articles failed"

Next up, the reducer, which will listen for those events and decide what to do with them.

**reducer.js**

This file describes how to store our articles and related data, and what to do when certain types of actions are received. It'll contain an `initialState` - a default value for the Redux store before any actions are dispatched - think of it like setting a component's initial state in the `constructor` function.

For our articles, let's set the following initial state:

```
const initialState = {
	data: [],
	loading: false,
	error: false,
}
```

Next, we'll need to define a `reducer` - a function that listens for incoming events. When a certain type of event is dispatched, the reducer will catch that event and decide what to do with it. Let's write the entire code for reducer.js and then explain what it does:

```
import ActionTypes from './actionTypes.js'

const initialState = {
	data: [],
	loading: false,
	error: false,
}

export default function reducer(state = initialState, action) {
	switch(action.type) {

		case ActionTypes.SET_ARTICLES: {
			return {
				...state,
				data: action.payload,
				loading: false,
			}
		}

		case ActionTypes.ARTICLES_LOADING: {
			return {
				...state,
				loading: true,
				error: false,
			}
		}

		case ActionTypes.ARTICLES_ERROR: {
			return {
				...state,
				loading: false,
				error: true,
			}
		}

		default: {
			return state
		}
	}
}
```
A reducer always returns a **new value** for the redux state, and never mutates it! Take a look at the following convention:

```
	return {
		...state,
		loading: true,
		error: false
	}
```
It essentially returns whatever is in the state currently (...state), but changes it so that loading is `true` and error is `false`. If we were to just write:

```
	return {
		loading: true,
		error: false
	}
```

it would overwrite the entire state, and delete the `articles` key from it, as well as any other keys that we might add at a later time - not good. The reducer should always return `...state` followed by the specific changes you want to make.

So, let's break it down:

 * When an action of type SET_ARTICLES is received, set `articles` in the state to whatever data was sent as a payload for that action (have a look at actions.js)
 * When an action of type ARTICLES_LOADING is received, set `loading: true` and `error: false` in the state, and keep `articles` as it was.
 * When an action of type ARTICLES_ERROR is received, set `loading: false` and `error: true` in the state, and keep `articles` as it was.
 * When any other type of action is received, ignore it and keep the entire state as it was.
 

**selectors.js**

Now, for the final piece of the puzzle, the selectors. Selectors are essentialy pre-built queries for accessing certain data in your state, in a certain format. You can access your Redux state without selectors as well, but I think it's a good convention. 

For example, we could use selectors to:

* get all articles from the state
* get the 5 most popular articles from the state
* get all articles from the state, sorted by release data
* ...etc

We'll use a handy library called `reselect` for creating our selectors.

Let's write a few selectors in `selectors.js`:

```
import {createSelector} from 'reselect'

export const allArticles = state => state.articles.data
export const articlesError = state => state.articles.error
export const articlesLoading = state => state.articles.loading

export const articlesByReleaseDate = createSelector(
	allArticles,
	(data) => {
		return _.sortBy(data, 'release_date')
	}
)

export const articlesByPopularity = createSelector(
	allArticles,
	(data) => {
		return _.sortBy(data, 'views').slice(0, 5)
	}
)
```

# Getting the data in your component 

Finally we're ready to use our fancy Redux functions in our components, this is where the fun begins.

Let's refactor our `ArticleList` component. At the top we'll add a few imports:

```
import * as ArticleActions from '../../redux/articles/actions'
import * as ArticleSelectors from '../../redux/articles/selectors'
import {connect} from 'react-redux'
```

Next, we'll need to "connect" our component to Redux. Essentially, this tells Redux that our `ArticleList` component is
interested in dispatching actions to and getting data from the Redux store.

At the bottom of the component, instead of `export default ArticleList`, we'll write:

```
const mapStateToProps = (state) => ({
	articles: ArticleSelectors.allArticles,
	loading: ArticleSelectors.articlesLoading,
	error: ArticleSelectors.articlesError,
})

const mapDispatchToProps = (dispatch) => ({
	getArticles: dispatch(ArticleActions.fetchArticles())
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList)
```

What this essentially does, is tells Redux to give our component a few new props:

* articles - the array of articles in the Redux store
* loading & error - are the articles loading or was there an error
* getArticles - a function which we can call to get new articles

And now, we can refactor the component itself to:

```
class ArticleList extends Component {

	componentDidMount() {
		this.props.getArticles()
	}

	render() {
		const {articles, loading, error} = this.props

		if (loading) {
			return <h1>Loading...</h1>
		}

		if (error) {
			return <h1>Error!</h1>
		}

		return articles.map(article => ...)
	}
}
```

Beatiful! But you might ask: wasn't this an awful amount of work just to shave a few lines of code from our component? Well, yes - but consider if you wanted to now write a new component to display only the most popular articles somewhere else in your app. It would literally be this simple:

```
import * as ArticleSelectors from '../../redux/articles/selectors'
import {connect} from 'react-redux'

class PopularArticles extends Component {

	render() {
		return this.props.articles(article => ...)
	}
}

const mapStateToProps = (state) => ({
	articles: ArticleSelectors.articlesByPopularity(state),
})

export default connect(mapStateToProps)(PopularArticles)
```

You could of course also update the articles here on `componentDidMount` like we did in `ArticleList`, but we'll leave that out for now.

# Further optimisations

Say we are displaying our articles in 5 different components, which are spread all around our app. We'd want the articles to be up-to-date in all of them, but also avoid
constantly fetching them from the api when the components are mounted. We could do the following: 

Firstly, let's add a lastUpdate field to our article reducer: 

```
/* /redux/articles/reducer.js */

const initialState = {
	data: [],
	loading: false,
	error: false,
	lastUpdate: 0
}
```

Let's also update that to the current date any time we set new articles:

```
/* /redux/articles/reducer.js */

export default function reducer(state = initialState, action) {
	switch(action.type) {
		...

		case ActionTypes.SET_ARTICLES: {
			return {
				...state,
				data: action.payload,
				lastUpdate: Date.now(),
			}
		}

		...
	}
}
```

Ok, maybe we want to only update the articles if it's been over 5 minutes from the last update. Let's create a selector to
check whether that's the case:

```
/* /redux/articles/selectors.js */

import {createSelector} from 'reselect'

export const allArticles = state => state.articles.data
export const articlesError = state => state.articles.error
export const articlesLoading = state => state.articles.loading

// Let's add this

const UPDATE_AFTER_MINS = 5
export const articlesUpdated = state => state.articles.lastUpdate

export const shouldUpdate = createSelector(
	articlesUpdated,
	(updated) => {
		return Date.now() - updated > UPDATE_AFTER_MINS * 1000 * 60
	}
)

// ..and no other changes 

export const articlesByReleaseDate = createSelector(
	allArticles,
	(data) => {
		return _.sortBy(data, 'release_date')
	}
)

export const articlesByPopularity = createSelector(
	allArticles,
	(data) => {
		return _.sortBy(data, 'views').slice(0, 5)
	}
)
```

Now, we can edit any of our components to only dispatch the `fetchArticles` action if the articles actually need to be updated: 

```
/* PopularArticles.js */

import * as ArticleSelectors from '../../redux/articles/selectors'
import {connect} from 'react-redux'

class PopularArticles extends Component {

	componentDidMount() {
		if (this.props.shouldUpdate) {
			this.props.getArticles()
		}
	}

	render() {
		return this.props.articles(article => ...)
	}
}

const mapStateToProps = (state) => ({
	articles: ArticleSelectors.articlesByPopularity(state),
	articlesShouldUpdate: ArticleSelectors.shouldUpdate(state),
})

const mapDispatchToProps = (dispatch) => ({
	getArticles: dispatch(ArticleActions.fetchArticles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PopularArticles)
```

# Final notes
What we've now achieved is:

* We have access to our articles from anywhere in our app
* If we need to update the articles, they are automatically updated for all components - so they are always up-to-date
* We need to write any filtering or sorting logic **exactly once**, and we can then use it anywhere in our app
* Our components are super simple (and stateless) - we mostly need nothing more than `componentDidMount` and `render`

These are already quite massive benefits to a) the performance of our app and b) the readability and ease of debugging if something isn't working.
But with Redux you can do many many other things, like persisting the state of your app across sessions with `redux-persist`. But maybe this is enough for now :)











