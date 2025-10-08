interface MultiLanguageString {
  value: string;
  lang: string; // Language as ISO 639-1 Alpha-2
}

export class VeronaMetadata {
  fileName: string;
  version = '?';
  metadataVersion = '?';
  id = '?';
  specVersion = '?';
  name = '?';
  notSupportedFeatures: string[] = [];

  get moduleOk(): boolean {
    return this.metadataVersion !== '?';
  }

  constructor(fileName: string, fileContent: string) {
    this.fileName = fileName;
    const moduleDom = VeronaMetadata.moduleDom(fileContent);
    const metaScript: HTMLElement | null = moduleDom.querySelector('script[type="application/ld+json"]');
    if (!metaScript) return;
    let data;
    try {
      data = JSON.parse(metaScript.innerText);
    } catch (e) {
      return;
    }
    if (data && (data['@type'] === 'player' || data.type === 'player')) {
      this.version = data.version;
      this.metadataVersion = data.metadataVersion;
      this.notSupportedFeatures = data.notSupportedFeatures || [];
      this.id = data.id || data['@id'];
      this.specVersion = data.apiVersion || data.specVersion;
      if (this.metadataVersion) {
        const nameList: string[] = (data.name as MultiLanguageString[])
          .filter(n => n.lang === 'de')
          .map(n => n.value);
        this.name = nameList.length > 0 ? nameList[0] : (data.name as MultiLanguageString[])
          .filter(n => n.lang === 'en')
          .map(n => n.value)[0];
      } else {
        this.metadataVersion = '< 2.0';
        const nameList: { [key: string]: string } = data.name;
        this.name = nameList['de'] || nameList['en'];
      }
    }
  }

  private static moduleDom(playerCode: string): Document {
    const playerDom = document.implementation.createHTMLDocument('player');
    playerDom.open();
    playerDom.write(playerCode);
    playerDom.close();
    return playerDom;
  }
}
