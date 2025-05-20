describe('Timer Buttons', () => {
  it('visit site', () => {
    cy.visit('/')
    cy.wait(3000)
    cy.get('[id = "start"]').click();

  })

})