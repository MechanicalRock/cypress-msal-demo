/// <reference types="cypress" />
import { ExternalTokenResponse } from '@azure/msal-browser';
import { decode, JwtPayload } from 'jsonwebtoken';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

const injectTokens = (tokenResponse: ExternalTokenResponse) => {
	const environment = 'login.windows.net';
	const idTokenClaims: JwtPayload = decode(tokenResponse.id_token);
	const localAccountId = idTokenClaims.oid || idTokenClaims.sid;
	const clientId = Cypress.env('AZURE_CLIENT_ID');
	const realm = Cypress.env('tenantid');
	const homeAccountId = `${localAccountId}.${realm}`;

	setSessionToken({
		homeAccountId,
		environment,
		realm,
		idTokenClaims,
		localAccountId,
	});

	setSessionAccessToken({
		homeAccountId,
		environment,
		tokenResponse,
		realm,
		clientId,
	});
};

const setSessionToken = ({
	homeAccountId,
	environment,
	realm,
	idTokenClaims,
	localAccountId,
}: {
	homeAccountId: string;
	environment: string;
	realm: string;
	localAccountId: string;
	idTokenClaims: any;
}) => {
	const tokenId = `${homeAccountId}-${environment}-${realm}`;
	const token = {
		authorityType: 'MSSTS',
		homeAccountId,
		environment,
		realm,
		idTokenClaims,
		localAccountId,
		username: idTokenClaims.preferred_username,
		name: idTokenClaims.name,
	};

	sessionStorage.setItem(tokenId, JSON.stringify(token));
};

const setSessionAccessToken = ({
	homeAccountId,
	environment,
	tokenResponse,
	realm,
	clientId,
}: {
	homeAccountId: string;
	environment: string;
	tokenResponse: any;
	realm: string;
	clientId: string;
}) => {
	const now = Math.floor(Date.now() / 1000);
	const accessTokenId = `${homeAccountId}-${environment}-accesstoken-${Cypress.env(
		'AZURE_CLIENT_ID'
	)}-${Cypress.env('tenantid')}-${tokenResponse.scope}--`;
	const accessToken = {
		credentialType: 'AccessToken',
		tokenType: 'Bearer',
		homeAccountId,
		secret: tokenResponse.access_token,
		cachedAt: now.toString(),
		expiresOn: (now + tokenResponse.expires_in).toString(),
		extendedExpiresOn: (now + tokenResponse.ext_expires_in).toString(),
		environment,
		target: tokenResponse.scope,
		realm,
		clientId,
	};
	sessionStorage.setItem(accessTokenId, JSON.stringify(accessToken));
};

Cypress.Commands.add('login', () => {
	cy.request({
		method: 'POST',
		url: `https://login.microsoftonline.com/${Cypress.env(
			'tenantid'
		)}/oauth2/v2.0/token`,
		form: true,
		body: {
			grant_type: 'password',
			client_id: Cypress.env('AZURE_CLIENT_ID'),
			client_secret: Cypress.env('AZURE_CLIENT_SECRET'),
			scope: 'openid profile email',
			username: Cypress.env('USERNAME'),
			password: Cypress.env('PASSWORD'),
		},
	}).then((response) => {
		injectTokens(response.body);
	});
});

declare global {
	namespace Cypress {
		interface Chainable {
			login(): Chainable;
		}
	}
}
