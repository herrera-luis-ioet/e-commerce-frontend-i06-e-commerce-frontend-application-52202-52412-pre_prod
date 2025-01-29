describe('Visual Component Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render ProductList component correctly', () => {
    cy.get('[data-testid="product-list"]').should('be.visible')
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1)
  })

  it('should render ProductFilters component correctly', () => {
    cy.get('[data-testid="product-filters"]').should('be.visible')
    cy.get('[data-testid="filter-category"]').should('be.visible')
    cy.get('[data-testid="filter-price"]').should('be.visible')
  })

  it('should render ProductSort component correctly', () => {
    cy.get('[data-testid="product-sort"]').should('be.visible')
    cy.get('[data-testid="sort-select"]').should('be.visible')
  })

  it('should render ProductDetail component when clicking a product', () => {
    cy.get('[data-testid="product-card"]').first().click()
    cy.get('[data-testid="product-detail"]').should('be.visible')
    cy.get('[data-testid="product-title"]').should('be.visible')
    cy.get('[data-testid="product-description"]').should('be.visible')
    cy.get('[data-testid="product-price"]').should('be.visible')
  })

  it('should maintain visual consistency with Material-UI components', () => {
    // Test MUI components styling
    cy.get('.MuiCard-root').should('have.css', 'box-shadow') // Verify card elevation
    cy.get('.MuiButton-root').should('have.css', 'text-transform', 'none') // Verify button styling
    cy.get('.MuiTypography-root').should('exist') // Verify typography elements
  })
})