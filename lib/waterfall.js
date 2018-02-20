export default (items, asyncFunction) => items.reduce(
	(lastPromise, item) => lastPromise.then(() => Promise.resolve().then(() => asyncFunction(item))),
	Promise.resolve()
)
