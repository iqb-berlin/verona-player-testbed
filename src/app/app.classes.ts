import { DictionaryStringString } from './test-controller.interfaces';

export class UnitData {
  readonly sequenceId: number;
  readonly unitId: string;
  isCurrent: boolean;
  definition: string;
  private responses: DictionaryStringString = {};
  private timeStampsResponses: { [K: string]: number } = {};
  presentationCompleteState = '';
  responsesCompleteState = '';

  get restorePoint(): DictionaryStringString {
    return this.responses
  }

  constructor(unitId: string, sequId: number) {
    this.unitId = unitId;
    this.sequenceId = sequId;
    this.isCurrent = false;
    this.definition = '';
  }

  loadDefinition(file: File): void {
    const myReader = new FileReader();
    myReader.onload = e => {
      this.definition = e.target ? e.target.result as string : '';
    };
    myReader.readAsText(file);
  }

  setResponses(responseChunks: DictionaryStringString, timeStamp: number) {
    if (responseChunks) {
      Object.keys(responseChunks).forEach(chunkId => {
        if (!this.timeStampsResponses[chunkId] || this.timeStampsResponses[chunkId] < timeStamp) {
          this.timeStampsResponses[chunkId] = timeStamp;
          this.responses[chunkId] = responseChunks[chunkId];
        }
      })
    }
  }

  clearResponses() {
    this.responses = {};
  }
}
