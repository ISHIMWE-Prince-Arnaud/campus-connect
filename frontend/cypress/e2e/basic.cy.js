describe('Campus Connect E2E', () => {
  it('loads login page', () => {
    cy.visit('http://localhost:5173/login');
    cy.contains('Login');
  });
});


