import ReactDOM from 'react-dom/client';

// third party
import { 
	BrowserRouter,
	// HashRouter
} from "react-router-dom";
import { Provider } from "react-redux";

// project imports
import * as serviceWorker from "serviceWorker";
import App from "App";
import { store } from "store";

// style + assets
import "assets/scss/style.scss";
import { Auth0ProviderWithNavigate } from "auth0-provider-with-navigate";
import { AuthProvider } from "context/AuthContext";
import { WSProvider } from 'context/socket/wsContext';


// ==============================|| REACT DOM RENDER  ||============================== //
const root = ReactDOM.createRoot(document.getElementById('root'));
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<Auth0ProviderWithNavigate>
				<AuthProvider>
					<WSProvider>
						<App />
					</WSProvider>
				</AuthProvider>
			</Auth0ProviderWithNavigate>
		</BrowserRouter>
	</Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
