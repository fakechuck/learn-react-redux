import logo from './logo.svg';
import './App.css';
import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { combineReducers, createStore } from 'redux';
import PropTypes from 'prop-types';

/**
 *	The purpose of this project is to become more familiar with react-redux by building an application and increasing the complexity as I go.
 *	Let's break down the elements that make a react-redux application work
 *	- store
 *	- dispatch
 *	- reducers
 *	- presentation components
 *	- container components
 *	- API
 *	- combine reducers
 *	- context Provider
 *	...
 *	...
 *	...
 */



/**
 *	We initialize state here just to make things easier
 *	if we want to manipulate the initial state
 */
const initialState = {
	renderCount: 0,
	success: false,
}

/** 
 *	When we have multiple reducers this will serve as the combinator 
 *	the will turn all lesser reducers into one master reducer.
 *	Redux only functions with a snigle reducer function and a single state object.
 */
 // the dataReducer function *only* handles the updating of the 'data' key in the store
const dataReducer = (state = '', action) => {
  switch (action.type) {
  	case 'CHANGE_DATA':
  	  return action.data;
  	default:
  		return state;
  }
}
// the successReducer function *only* handles updating the 'success' key in the store
const successReducer = (state = false, action) => {
	switch (action.type) {
		case 'CHANGE_DATA':
			return true;
		default:
			// do not rturn an explicit value here, always use the initial state. otherwise, Redux initializers may destroy your initial state (e.g. return false => always false on init)
			return state;
	}
}
// the countReducer function *only* handles the 'renderCount' key in the store. this is to inspect how state is updated and when from an initial state
const countReducer = (state = 0, action) => {
	// even though we supply an initialState, Redux tests the dispatch functions with special actions that may return undefined if it is not supplied
	switch (action.type) {
		case 'CHANGE_DATA':
			// Here we test if initialState is really used
			// if the return value here is `state++` then state will never increment, because of the pure function principles
			return ++state;
		default:
			return state;
	}
}
// these reducers are combined to give a representation of the higher-level state and each function only handles a subset of the data
// Note, in this case, both functions operate using the same action and thus both reducers will be used for a dispatch of 'CHANGE_DATA'
const reduxApp = combineReducers({
  data: dataReducer,
  success: successReducer,
  renderCount: countReducer
});

/**
 *	Here we separate the creation of the store object
 *	from the rest of the application. This is to allow
 *	greater control if other actions are needed, such
 *	as loading data from localStorage.
 *
 *	Also in this block, we initialize the store by calling our function;
 */
const configureStore = () =>
	createStore(
		reduxApp,
		initialState
	);
const appStore = configureStore();

/**
 *	Next, we create a presentational component that will rely on some state.
 *	The state it receives will come in explicitly from its props, and then
 *	we will connect it to react-redux to get state flowing from the redux store.
 */
const Presenter = ({ success, data, count, callbackFunc }) => {
	console.log('when I rendered state was: ', { data, success, count });
 	const message = success ? data : "We don't have data to show.";
 	return (
 		<div className="presentational">
 		 	<a href="#" onClick={ () => callbackFunc() }>{'clickable text'}</a>
 			<hr/>
 			<span>{ message }</span>
 			<hr/>
 			<span>{ count }</span>
 		</div>
 	)
}

/**
 *	Now, we use react-redux's connect feature to generate a container component
 *	for our Presenter component. This will all us to get updates from the store.
 */
// First, define the functions to get and set the data:

// mapStateToProps defines how the component receives data from the store and passes it to props
// Note how the keys here correspond to the keys in Presenter's props
const mapStateToProps = (state) => ({
	data: state.data,
	success: state.success,
	count: state.renderCount
 })
/**
 *	mapDispatchToProps defines how the component pushes data to the store if necessary.
 *	this function accepts a dispatch function and describes how it will be used by the component
 */
const mapDispatchToProps = (dispatch) => ({
	callbackFunc() {
		dispatch({
			type: 'CHANGE_DATA',
			data: 'the Presenter changed me'
		})
	}
})
/**
 *	Finally we combine these with react-redux's connect function to generate a container component for Presenter
 *	Note that the arguments to connect() are as follows:
 *	mapStateToProps : <function>
 *		@returns the props relevant to this component that come from the store
 *	mapDispatchToProps : <function>
 *		@returns the callback props this component will use to manipulate the store
 *	mergeProps(stateProps, dispatchProps, ownProps) : <function>
 *		@returns a props object resulting from the combining of props objects given in the arguments
 *	options : <object>
 *		(see react-redux documentation for details)
 */
const Container = connect(
	mapStateToProps,
	mapDispatchToProps
)(Presenter);

/**
 *	Top Level Containers:
 *	This is where the Provider comes in. We will pass the store down through its props
 *	and defined the context types, so child components can access the store via the context
*/
const App = () =>
	<div className="App">
	  <div className="App-header">
	    <img src={logo} className="App-logo" alt="logo" />
	    <h2>Welcome to React</h2>
	  </div>
	  <Container className="ActualContainer" />
	</div>
// Set Provider contextTypes
Provider.propTypes = {
	store: PropTypes.object
}
const Root = ({ store }) =>
	<Provider store={ store } >
		<App />
	</Provider>

/**
 *	Render the DOM
 */
render(
	<Root store={ appStore } />,
	document.getElementById('root')
);

//
registerServiceWorker();	// TODO: find out what this is
