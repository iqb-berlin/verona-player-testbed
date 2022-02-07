import { Verona4ModuleMetadata, Verona4NotSupportedFeatures, VeronaModuleMetadata } from './verona.interfaces';

export class VeronaMetadataReaderUtil {
  static read(fileName: string, moduleCode: string): VeronaModuleMetadata {
    return this.readVerona4Metadata(moduleCode) ||
      this.readVerona3Metadata(moduleCode) ||
      this.guessMetadataByFileName(fileName);
  }

  private static readVerona3Metadata(moduleCode: string): VeronaModuleMetadata | null {
    const moduleDom = this.moduleDom(moduleCode);
    const metaElem: HTMLElement = moduleDom.querySelector('meta[data-version]');
    if (!metaElem || !metaElem.dataset) {
      return null;
    }
    return <VeronaModuleMetadata>{
      data: {
        $schema: 'https://raw.githubusercontent.com/verona-interfaces/metadata/master/verona-module-metadata.json',
        code: {
          repositoryUrl: metaElem.dataset.repositoryUrl
        },
        name: [
          {
            value: metaElem.getAttribute('content'),
            lang: '--'
          }
        ],
        notSupportedFeatures:
          metaElem.dataset.notSupportedApiFeatures
            .split(' ')
            .filter(s => Verona4NotSupportedFeatures.includes(s)),
        specVersion: metaElem.dataset.apiVersion,
        type: 'player',
        version: metaElem.dataset.version
      },
      metadataVersion: 'verona3'
    };
  }

  private static readVerona4Metadata(moduleCode: string): VeronaModuleMetadata | null {
    const moduleDom = this.moduleDom(moduleCode);
    const metaScript: HTMLElement = moduleDom.querySelector('script[type="application/ld+json"]');
    if (!metaScript) {
      return null;
    }
    let data;
    try {
      data = <Verona4ModuleMetadata>JSON.parse(metaScript.innerText);
    } catch (e) {
      return null;
    }
    if (!data?.$schema) {
      return null;
    }
    return { data, metadataVersion: 'verona4' };
  }

  private static guessMetadataByFileName(fileName: string): VeronaModuleMetadata | null {
    const regex = /(\D+?)[V-]?((\d+)(\.\d+)?(\.\d+)?(-\w+)?).[hH][tT][mM][lL]/g;
    const match = regex.exec(fileName);
    if (!match) {
      return <VeronaModuleMetadata>{
        data: <Verona4ModuleMetadata>{
          name: [{ value: fileName, lang: 'xx' }]
        },
        metadataVersion: 'filename'
      };
    }
    const isPlayer = fileName.match(/player/gmi);
    const isEditor = fileName.match(/editor/gmi);
    return <VeronaModuleMetadata>{
      data: {
        version: match[2],
        // eslint-disable-next-line no-nested-ternary
        type: isPlayer ? 'player' : isEditor ? 'editor' : 'unknown',
        name: [
          {
            value: match[1],
            lang: 'xx'
          }
        ]
      },
      metadataVersion: 'filename'
    };
  }

  private static moduleDom(playerCode): Document {
    const playerDom = document.implementation.createHTMLDocument('player');
    playerDom.open();
    playerDom.write(playerCode);
    playerDom.close();
    return playerDom;
  }
}
