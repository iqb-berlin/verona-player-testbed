// eslint-disable-next-line max-classes-per-file
import { Response } from '@iqbspecs/response/response.interface';

import { VeronaMetadata } from './verona-metadata.class';

export interface ChunkData {
  id: string;
  raw: string;
  variables: Response[];
}

export interface WidgetResponseData {
  id: string;
  type: string;
  raw: string;
  state: string;
  parameters: Record<string, string>;
}

export class WidgetData {
  readonly widgetId: string;
  readonly widgetType: string;
  readonly sourceCode: string;
  readonly metaData: VeronaMetadata | undefined;
  state: string;

  constructor(widgetId: string, values: {
    widgetType?: string;
    sourceCode?: string;
    metaData?: VeronaMetadata;
    state?: string;
  }) {
    this.widgetId = widgetId;
    this.widgetType = values.widgetType || '';
    this.sourceCode = values.sourceCode || '';
    this.metaData = values.metaData || undefined;
    this.state = values.state || '';
  }

  clearState() {
    this.state = '';
  }
}

export class UnitData {
  readonly sequenceId: number;
  readonly unitId: string;
  isCurrent: boolean;
  definition: string;
  dataparts: Record<string, string>;
  timeStampsResponses: { [K: string]: number } = {};
  presentationState = '';
  responsesState = '';

  get restorePoint(): Record<string, string> {
    return this.dataparts;
  }

  constructor(unitId: string, seqId: number) {
    this.unitId = unitId;
    this.sequenceId = seqId;
    this.isCurrent = false;
    this.definition = '';
    this.dataparts = {};
  }

  loadDefinition(file: File): void {
    const myReader = new FileReader();
    myReader.onload = e => {
      this.definition = e.target?.result as string;
    };
    myReader.readAsText(file);
  }

  setResponses(responseChunks: Record<string, string>, timeStamp: number) {
    if (responseChunks) {
      Object.keys(responseChunks).forEach(chunkId => {
        if (!this.timeStampsResponses[chunkId] || this.timeStampsResponses[chunkId] < timeStamp) {
          this.timeStampsResponses[chunkId] = timeStamp;
          this.dataparts[chunkId] = responseChunks[chunkId];
        }
      });
    }
  }

  clearResponses() {
    this.dataparts = {};
  }

  getResponsesTransformed(): ChunkData[] {
    return Object.keys(this.dataparts).map(k => ({
      id: k,
      raw: this.dataparts[k],
      variables: UnitData.transformResponseData(this.dataparts[k])
    }));
  }

  private static transformResponseData(raw: string): Response[] {
    let data: Response[];
    try {
      data = JSON.parse(raw);
      data = data.sort((v1, v2) => v1.id.localeCompare(v2.id));
    } catch (e) {
      data = [];
    }
    return data;
  }
}
