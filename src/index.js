import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import '../node_modules/semantic-ui-css/semantic.min.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
