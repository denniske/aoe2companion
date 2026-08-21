// https://github.com/uni-stack/uniwind/issues/641
// docs.uniwind.dev/faq#why-does-my-app-still-fully-reload-when-i-change-css
// metro cannot fast refresh deep provider trees so we import css here in a simple file
// and move the deep provider tree into another file
import '../../global.css';

export { default } from '../root-layout';
