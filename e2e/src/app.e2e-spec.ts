/* eslint @typescript-eslint/no-shadow: ["error", { "allow": ["sessionID"] }] */
import { browser, logging } from 'protractor';
import { resolve } from 'path';
import { MessageRecorder } from 'iqb-dev-components';
import { AppPage } from './app.po';

describe('verona player testbed App', () => {
  let sessionID = null;

  AppPage.navigateTo();

  it('should display title text', () => {
    expect(AppPage.getTitleText()).toEqual('IQB Verona Player Testbed');
  });

  it('should show unit panel', () => {
    expect(AppPage.getUnitPanelText()).toContain('Units');
    expect(AppPage.getUnitPanelText()).not.toContain('Player');
  });

  it('should show player panel', () => {
    expect(AppPage.getPlayerPanelText()).toContain('Player');
  });

  it('should show settings panel', () => {
    expect(AppPage.getSettingsPanelText()).toContain('Settings');
  });

  it('should enable unit navigation button after upload of unit and player', () => {
    const nextButton = AppPage.getNextUnitButton();
    expect(nextButton.getAttribute('disabled')).toBe('true');

    const hiddenUnitUploadInput = AppPage.getHiddenUnitUploadInput();
    hiddenUnitUploadInput.sendKeys(resolve(__dirname, '../../example_units/G231mm.voud'));

    const hiddenPlayerUploadButton = AppPage.getHiddenPlayerUploadButton();
    hiddenPlayerUploadButton.sendKeys(resolve(__dirname, '../../player/IQBVisualUnitPlayerV2.99.2.html'));

    expect(nextButton.getAttribute('disabled')).toBe(null);
  });

  it('should show empty unit', () => {
    const unitButton = AppPage.getUploadedUnitButton();
    unitButton.click();
    const unitBodyContainer = AppPage.getIFramePageContainerElement();
    expect(unitBodyContainer.isPresent()).toBeFalsy();
  });

  it('should navigate back to settings page via logo button', () => {
    const link = AppPage.getLogoLink();
    expect((AppPage.getAppSettingsComponent()).isPresent()).toBeFalsy();
    link.click();
    expect((AppPage.getAppSettingsComponent()).isPresent()).toBeTruthy();
  });

  it('should upload player', () => {
    const absolutePath = resolve(__dirname, '../../player/IQBVisualUnitPlayerV2.99.2.html');
    const hiddenPlayerUploadButton = AppPage.getHiddenPlayerUploadButton();
    hiddenPlayerUploadButton.sendKeys(absolutePath);
    expect(AppPage.getPlayerName()).toContain('IQBVisualUnitPlayerV2');
  });

  it('should show unit and correct initial button states', () => {
    const unitButton = AppPage.getUploadedUnitButton();
    unitButton.click();

    const returnValue = AppPage.getIFramePageContainerElement();
    expect(returnValue).toBeTruthy();
  });

  it('should receive session ID after receiving start event', async () => {
    MessageRecorder.recordMessages(browser);

    browser.executeScript(() => {
      window.postMessage({
        type: 'vopReadyNotification',
        apiVersion: '2'
      }, '*');
    });

    const lastMessage = await MessageRecorder.getLastMessage(browser);
    expect(lastMessage.sessionId).toMatch(/[0-9]{8}/);
    sessionID = lastMessage.sessionId;
  });

  it('should have correct status icon colors and text', () => {
    expect(AppPage.getFocusIndicatorText()).toEqual('Fokus unbekannt'); // TODO sollte eigentlich auf dem Host liegen
    expect(AppPage.getPresentationIndicatorText()).toEqual('Präsentation unvollständig');
    expect(AppPage.getAnswerIndicatorText()).toEqual('bisher keine Beantwortung');
  });

  it('should update presentation icon tooltip text', () => {
    browser.executeScript(sessionID => {
      window.postMessage({
        type: 'vopStateChangedNotification',
        sessionId: sessionID,
        timestamp: new Date(),
        unitState: {
          presentationProgress: 'complete'
        }
      }, '*');
    }, sessionID);
    expect(AppPage.getPresentationIndicatorText()).toEqual('Präsentation vollständig');
  });

  it('should update answer icon tooltip text', () => {
    browser.executeScript(sessionID => {
      window.postMessage({
        type: 'vopStateChangedNotification',
        sessionId: sessionID,
        timestamp: new Date(),
        unitState: {
          responseProgress: 'complete'
        }
      }, '*');
    }, sessionID);
    expect(AppPage.getAnswerIndicatorText()).toEqual('Beantwortung vollständig');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE
    } as logging.Entry));
  });
});
