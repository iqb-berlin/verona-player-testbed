import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestControllerService } from './test-controller.service';
import { UploadFileType } from './test-controller.interfaces';

describe('TestControllerService', () => {
  let service: TestControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [TestControllerService]
    });
    service = TestBed.inject(TestControllerService);
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
  });

  it('should update responses status', () => {
    expect(service.status.responses.color).toBe('Teal');
    service.setResponsesStatus('no');
    expect(service.status.responses.color).toBe('Red');
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
});
