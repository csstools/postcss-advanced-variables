export default (items, asyncFunction) => items.reduce(
	(lastPromise, item) => lastPromise.then(
		() => asyncFunction(item)
	),
	Promise.resolve()
)
