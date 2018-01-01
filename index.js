// tooling
import processNode from './lib/process-node';
import postcss from 'postcss';

// plugin
export default postcss.plugin('postcss-advanced-variables', opts => (root, result) => {
	processNode(root, result, opts);
});
