describe('Timer Buttons', () => {
  it('visit site', () => {
    cy.visit('./index.html')
    cy.wait(3000)
    cy.get('[id = "start"]').click();

  })

})