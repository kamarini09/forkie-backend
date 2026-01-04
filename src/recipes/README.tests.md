# RecipesService Unit Tests

## Overview

Streamlined unit tests for the RecipesService using Jest and the AAA (Arrange-Act-Assert) pattern, focusing on the most critical functionality.

## Test Coverage

- **Statement Coverage**: 85.13%
- **Branch Coverage**: 57.14%
- **Function Coverage**: 100%
- **Total Tests**: 10 essential tests

## Running Tests

### Run all recipe tests

```bash
# In Docker
docker compose exec api npm test -- recipes.service.spec

# Locally (if not using Docker)
npm test -- recipes.service.spec
```

### Run with coverage

```bash
docker compose exec api npm run test:cov -- recipes.service
```

### Run in watch mode (for development)

```bash
docker compose exec api npm run test:watch -- recipes.service
```

## Test Structure (AAA Pattern)

All tests follow the **Arrange-Act-Assert** pattern:

```typescript
it('should do something', async () => {
  // Arrange - Set up test data and mocks
  const mockData = { ... };
  mockService.method.mockResolvedValue(mockData);

  // Act - Execute the code under test
  const result = await service.methodUnderTest(params);

  // Assert - Verify the results
  expect(result).toEqual(expectedValue);
});
```

## Essential Tests (10 total)

### 1. Create Recipe Tests (2 tests)

- ✓ Create successfully
- ✓ Error: Parent recipe doesn't exist

### 2. Update Recipe Tests (2 tests)

- ✓ Update when user is owner
- ✓ Error: User not the owner

### 3. Fork Recipe Tests (2 tests)

- ✓ Fork public recipe successfully
- ✓ Error: Cannot fork private recipe

### 4. Get Recipe for View Tests (2 tests)

- ✓ Return public recipe
- ✓ Error: Cannot view private recipe

### 5. List Public Recipes Test (1 test)

- ✓ Return all public recipes

### 6. Get User Recipes Test (1 test)

- ✓ Return all user recipes

## Mocking Strategy

### Dependencies Mocked

1. **TypeORM Repository** - All database operations
2. **UsersService** - User lookup and creation
3. **FavoritesService** - Favorite status checks

### Mock Setup

```typescript
mockRecipesRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  exist: jest.fn(),
};

mockUsersService = {
  findOrCreateByClerkId: jest.fn(),
};

mockFavoritesService = {
  isFavorited: jest.fn(),
};
```

## Key Testing Principles

1. **Focus**: Test only the most critical paths and security checks
2. **Isolation**: Each test is independent with mocked dependencies
3. **Speed**: Fast execution (~3-4s for all tests)
4. **Clarity**: Descriptive test names explain the scenario
5. **AAA Pattern**: Consistent structure for readability
