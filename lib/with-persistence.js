export default (reducer) => (...args) => {
	let state = reducer.apply(null, args);

	// Need to skip @@INIT, since that would obviously overwrite whatever state there
	// might be in local storage before we can even use it for rehydration.
	if (args[1].type !== '@@INIT')
		localStorage.setItem('state', JSON.stringify(state));

	return state;
};
