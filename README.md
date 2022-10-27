# MSAL Cypress Demo

This is the demo repo for the blog article on [Azure AD authentication in Cypress tests using MSAL](https://blog.mechanicalrock.io/2022/08/08/azure-ad-authentication-cypress.html).

## Prerequisites

You will need access to an Azure Active Directory instance. From your Azure portal need to get the **Tenant ID**, application **Client ID**, a **Client Secret** and a **test user** account. Add these values to the `cypress.config.ts` file.

## Running the example

1. Install dependencies

```bash
npm install
```

2. Run the web app

```bash
npm start
```

1. Run the Cypress test suite

```bash
npm run cypress:open
```
