import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000/',
		env: {
			AZURE_CLIENT_ID: '',
			AZURE_TENANT_ID: '',
			AZURE_CLIENT_SECRET: '',
			USERNAME: 'username',
			PASSWORD: 'password1234',
		},
	},
});
