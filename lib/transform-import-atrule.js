// tooling
import postcss, { list } from 'postcss';
import getReplacedString from './get-replaced-string';
import path from 'path';
import transformNode from './transform-node';
import manageUnresolved from './manage-unresolved';

// transform @import at-rules
export default function transformImportAtrule(rule, opts) {
	// if @import is supported
	if (opts.transform.includes('@import')) {
		// @import options
		const { id, media, cwf, cwd } = getImportOpts(rule, opts);

		if (
			(opts.importFilter instanceof Function && opts.importFilter(id, media)) ||
			(opts.importFilter instanceof RegExp && opts.importFilter.test(id))
		) {
			const cwds = [cwd].concat(opts.importPaths);

			// promise the resolved file and its contents using the file resolver
			const importPromise = cwds.reduce(
				(promise, thiscwd) => promise.catch(
					() => opts.importResolve(id, thiscwd, opts)
				),
				Promise.reject()
			);

			return importPromise.then(
				// promise the processed file
				({ file, contents }) => processor.process(contents, { from: file }).then(
						({ root }) => {
							// push a dependency message
							opts.result.messages.push({ type: 'dependency', file: file, parent: cwf });

							// imported nodes
							const nodes = root.nodes.slice(0);

							// if media params were detected
							if (media) {
								// create a new media rule
								const mediaRule = postcss.atRule({
									name: 'media',
									params: media,
									source: rule.source
								});

								// append with the imported nodes
								mediaRule.append(nodes);

								// replace the @import at-rule with the @media at-rule
								rule.replaceWith(mediaRule);
							} else {
								// replace the @import at-rule with the imported nodes
								rule.replaceWith(nodes);
							}

							// transform all nodes from the import
							return transformNode({ nodes }, opts);
						}
					),
				() => {
					// otherwise, if the @import could not be found
					manageUnresolved(rule, opts, '@import', `Could not resolve the @import for "${id}"`);
				}
			)
		}
	}
}

const processor = postcss();

// return the @import statement options (@import ID, @import ID MEDIA)
const getImportOpts = (node, opts) => {
	const [ rawid, ...medias ] = list.space(node.params);
	const id = getReplacedString(trimWrappingURL(rawid), node, opts);
	const media = medias.join(' ');

	// current working file and directory
	const cwf = node.source && node.source.input && node.source.input.file || opts.result.from;
	const cwd = cwf ? path.dirname(cwf) : opts.importRoot;

	return { id, media, cwf, cwd };
};

// return a string with the wrapping url() and quotes trimmed
const trimWrappingURL = string => trimWrappingQuotes(string.replace(/^url\(([\W\w]*)\)$/, '$1'));

// return a string with the wrapping quotes trimmed
const trimWrappingQuotes = string => string.replace(/^("|')([\W\w]*)\1$/, '$2');
