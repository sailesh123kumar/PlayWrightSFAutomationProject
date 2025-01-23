import { BasePage } from '../pages/BasePage'

export class LoginPage extends BasePage {

  private usernameField = '#username';
  private passwordField = '#password';
  private loginButton = '#Login';
  private appLauncher = "//button[@title='App Launcher']";

  constructor(page) {
    super(page);
  }



  async navigateToLoginPage(){
    await this.page.goto("/")
  }
  
  async enterUsername(username: string) {
    await this.elementUtil.enterText(this.usernameField, username); // Use ElementUtil method
  }

  async enterPassword(password: string) {
    await this.elementUtil.enterText(this.passwordField, password); // Use ElementUtil method
  }

  async clickLogin() {
    await this.elementUtil.click(this.loginButton); // Use ElementUtil method
  }


  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.elementUtil.isEnabled(this.loginButton); // Use ElementUtil method
  }



  

  async isdisplayed(){
    this.elementUtil.isDisplayed(this.appLauncher);
  }


  /**
   * Perform login by entering username, password, and clicking the login button.
   * @param username - The username to login with.
   * @param password - The password to login with.
   */
  async doLogin(username: string, password: string) {
    console.log('Performing login...');
    await this.navigateToLoginPage();
    await this.enterUsername(username); // Call enterUsername method
    await this.enterPassword(password); // Call enterPassword method
    await this.clickLogin(); // Call clickLogin method
    console.log('Login action completed.');

    return await this.isdisplayed();
   
  }
}



