describe('login spec', () => {
	it('should log in as a user', () => {
		cy.login();
		cy.visit('/');
		cy.contains('Welcome');
		cy.contains('Authenticated');
		cy.contains('Token: ');
	});
});
