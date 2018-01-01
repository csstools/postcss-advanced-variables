// tooling
import transformNode from './lib/transform-node';
import postcss from 'postcss';

// plugin
export default postcss.plugin('postcss-advanced-variables', opts => (root, result) => {
	transformNode(root, result, opts);
});
