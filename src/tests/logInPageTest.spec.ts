import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Tests', () => {
  test('Should login successfully with valid credentials', async ({ page }) => {
    // Initialize the LoginPage
    const loginPage = new LoginPage(page);
    
    // Perform login using valid credentials
    const appLauncherDisplayed =await loginPage.doLogin('sailesh123kumar@gmail.com', 'Summer@2025');
    console.log(appLauncherDisplayed)
    
  });
})