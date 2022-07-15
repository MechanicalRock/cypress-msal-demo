import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
	MsalAuthenticationTemplate,
	useIsAuthenticated,
	useMsal,
} from '@azure/msal-react';
import { AuthError, InteractionType } from '@azure/msal-browser';

const authRequest = { scopes: ['openid', 'profile'] };

const ErrorComponent = ({ error }: { error: AuthError | null }) => {
	return <p>{error?.message}</p>;
};

const LoadingComponent = () => {
	return <img src={logo} className="App-logo" alt="logo" />;
};

const Username = () => {
	const { accounts } = useMsal();

	if (accounts.length > 0) {
		return <>{accounts[0].username}</>;
	}

	return null;
};

const IsAuthenticated = () => {
	const isAuthenticated = useIsAuthenticated();

	return isAuthenticated ? <p>Authenticated</p> : <p>Not authenticated</p>;
};

const Token = () => {
	const { instance, accounts } = useMsal();
	const [token, setToken] = useState<string | undefined>();

	useEffect(() => {
		const account = accounts.length > 0 && accounts[0];
		if (instance && account) {
			(async () => {
				const result = await instance.acquireTokenSilent({
					...authRequest,
					account,
				});
				setToken(result.accessToken);
			})();
		}
	}, [instance, accounts]);

	return token ? <p className="truncate">Token: {token}</p> : null;
};

function App() {
	return (
		<div className="App">
			<MsalAuthenticationTemplate
				interactionType={InteractionType.Redirect}
				authenticationRequest={authRequest}
				loadingComponent={LoadingComponent}
				errorComponent={ErrorComponent}
			>
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Welcome <Username />
					</p>
					<IsAuthenticated />
					<Token />
				</header>
			</MsalAuthenticationTemplate>
		</div>
	);
}

export default App;
