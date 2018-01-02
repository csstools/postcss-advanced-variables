export default function manageUnresolved(node, opts, word, message) {
	if ('warn' === opts.unresolved) {
		node.warn(opts.result, message, { word });
	} else if ('ignore' !== opts.unresolved) {
		throw node.error(message, { word });
	}
}
