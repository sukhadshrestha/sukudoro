describe('Add task', () => {
    it('add task', () => {
      cy.visit('/')
      cy.wait(3000)
      cy.getCyAttr('add-task-name').type('Random Task')
      cy.getCyAttr('add-no-of-period').type('2')
      cy.getCyAttr('add-task-submit').click()
      cy.getCyAttr('task-table').should('contain', 'Random Task')
    })
  })