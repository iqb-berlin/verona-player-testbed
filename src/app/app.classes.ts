import { DictionaryStringString } from './test-controller.interfaces';

export interface ResponseData {
  id: string;
  value: string;
  status: string;
  subform?: string;
}

export interface ChunkData {
  id: string;
  raw: string;
  variables: ResponseData[];
}

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

  getResponsesTransformed(): ChunkData[] {
    return Object.keys(this.responses).map(k => {
      return {
        id: k,
        raw: this.responses[k],
        variables: UnitData.transformResponseData(this.responses[k])
      }
    });
  }

  private static transformResponseData(raw: string): ResponseData[] {
    let data: ResponseData[];
    try {
      data = JSON.parse(raw);
      data = data.sort((v1, v2) => {
        return v1.id.localeCompare(v2.id);
      })
    } catch (e) {
      data = []
    }
    return data;
  }
}
