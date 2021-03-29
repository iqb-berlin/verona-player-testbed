import {
  browser, by, element, ElementFinder
} from 'protractor';

export class AppPage {
  static switchToUnitFrame() {
    const unitHostFrame = element(by.css('.unitHost')).getWebElement();
    browser.switchTo().frame(unitHostFrame);
    browser.ignoreSynchronization = true;
  }

  static switchToMainFrame() {
    browser.switchTo().defaultContent();
    browser.ignoreSynchronization = false;
  }

  static navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  static getTitleText(): Promise<string> {
    return element(by.css('.title')).getText() as Promise<string>;
  }

  static getUnitPanelText(): Promise<string> {
    return element(by.css('.my-units')).getText() as Promise<string>;
  }

  static getPlayerPanelText(): Promise<string> {
    return element(by.css('.myPlayers')).getText() as Promise<string>;
  }

  static getSettingsPanelText(): Promise<string> {
    return element(by.css('.mySettings')).getText() as Promise<string>;
  }

  static getNextUnitButton(): ElementFinder {
    return element(by.css('button.mat-fab:nth-child(2)'));
  }

  static getHiddenUnitUploadInput(): ElementFinder {
    return element(by.css('.my-units > div:nth-child(1) > input:nth-child(1)'));
  }

  static getHiddenPlayerUploadButton(): ElementFinder {
    return element(by.css('.myPlayers > div:nth-child(1) > input:nth-child(1)'));
  }

  static getPlayerName(): Promise<string> {
    return element(by.css('.myPlayers > strong:nth-child(3) > u:nth-child(1)')).getText() as Promise<string>;
  }

  static getUploadedUnitButton(): ElementFinder {
    return element(by.css('button.ng-star-inserted'));
  }

  static getLogoLink(): ElementFinder {
    return element(by.css('.logo > a:nth-child(1)'));
  }

  static getAppSettingsComponent(): ElementFinder {
    return element(by.css('app-settings'));
  }

  static getFocusIndicatorText(): Promise<string> {
    return element(by.css('div.mat-tooltip-trigger:nth-child(1)')).getAttribute('ng-reflect-message') as Promise<string>;
  }

  static getPresentationIndicatorText(): Promise<string> {
    return element(by.css('div.mat-tooltip-trigger:nth-child(2)')).getAttribute('ng-reflect-message') as Promise<string>;
  }

  static getAnswerIndicatorText(): Promise<string> {
    return element(by.css('div.mat-tooltip-trigger:nth-child(3)')).getAttribute('ng-reflect-message') as Promise<string>;
  }

  static getIFramePageContainerElement(): ElementFinder {
    AppPage.switchToUnitFrame();
    const returnValue = element(by.css('#pageContainer'));
    AppPage.switchToMainFrame();
    return returnValue;
  }
}
