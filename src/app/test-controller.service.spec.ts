import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TestControllerService } from './test-controller.service';
import { UnitNavigationTarget, UploadFileType } from './test-controller.interfaces';
import { UnitData } from './app.classes';

describe('TestControllerService', () => {
  let service: TestControllerService;
  const routerSpy = {
    navigateByUrl: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TestControllerService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(TestControllerService);
  });

  it('should update currentUnitSequenceId', () => {
    // TODO isCurrent testen
    expect(service.currentUnitSequenceId).toBe(null);
    service.currentUnitSequenceId = 1;
    expect(service.currentUnitSequenceId).toBe(1);
  });

  it('should init variables empty', () => {
    expect(service.playerName).toBe('');
    expect(service.playerSourceCode).toBe('');
    expect(service.unitList).toEqual([]);
  });

  it('should update presentation status', () => {
    expect(service.status.presentation.color).toBe('Teal');
    service.setPresentationStatus('complete');
    expect(service.status.presentation.color).toBe('LimeGreen');
    service.setPresentationStatus('some');
    expect(service.status.presentation.color).toBe('Yellow');
    service.setPresentationStatus('none');
    expect(service.status.presentation.color).toBe('Red');
    service.setPresentationStatus('unfug');
    expect(service.status.presentation.color).toBe('DarkGray');
    service.setPresentationStatus('yes');
    expect(service.status.presentation.color).toBe('LimeGreen');
  });

  it('should update responses status', () => {
    expect(service.status.responses.color).toBe('Teal');
    service.setResponsesStatus('no');
    expect(service.status.responses.color).toBe('Red');
    service.setResponsesStatus('yes');
    expect(service.status.responses.color).toBe('Yellow');
    service.setResponsesStatus('all');
    expect(service.status.responses.color).toBe('LimeGreen');
    service.setResponsesStatus('complete-and-valid');
    expect(service.status.responses.color).toBe('LawnGreen');
    service.setResponsesStatus('unfug');
    expect(service.status.responses.color).toBe('DarkGray');
  });

  /**
   * Faking input element and corresponding change event.
   * First set the upload file type, then send event.
   */
  it('should upload file', () => {
    const event = {
      target: {
        files: [new File([new Blob()], 'dummy_filename')]
      }
    };
    service.uploadFile(event as unknown as InputEvent, UploadFileType.UNIT);
    expect(service.unitList.length).toBeGreaterThan(0);
    expect(service.unitList[0].filename).toBe('dummy_filename');
  });

  it('should upload player', () => {
    const event = {
      target: {
        files: [new File([new Blob()], 'dummy_playername')]
      }
    };
    service.uploadFile(event as unknown as InputEvent, UploadFileType.PLAYER);
    expect(service.playerName).toBe('dummy_playername');
  });

  it('check supported player features', () => {
    expect(service.playerSupports('test')).toBe(true);
    service.notSupportedApiFeatures.push('test2');
    expect(service.playerSupports('test2')).toBe(false);
  });

  it('handle unit navigation requests', () => {
    // set up dummy units to navigate
    service.unitList = [
      new UnitData('unit1', 0),
      new UnitData('unit2', 1),
      new UnitData('unit3', 2)
    ];
    service.currentUnitSequenceId = 0;

    service.setUnitNavigationRequest(UnitNavigationTarget.MENU);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/r');
    service.setUnitNavigationRequest('#first');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/0');
    service.setUnitNavigationRequest(UnitNavigationTarget.NEXT);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/1');
    service.setUnitNavigationRequest(UnitNavigationTarget.PREVIOUS);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/0');
    service.setUnitNavigationRequest(UnitNavigationTarget.LAST);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/2');
    service.setUnitNavigationRequest('murks');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/murks');
    service.currentUnitSequenceId = 7;
    service.setUnitNavigationRequest(UnitNavigationTarget.PREVIOUS);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/u/6');
  });
});
