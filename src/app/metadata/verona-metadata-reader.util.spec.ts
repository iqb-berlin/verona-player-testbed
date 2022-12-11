import { VeronaMetadataReaderUtil } from './verona-metadata-reader.util';
import { Verona4ModuleMetadata, VeronaModuleMetadata } from './verona.interfaces';

const playerCode = (insertIntoHeader: string): string => (
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>t</title>
    ${insertIntoHeader}
  </head>
  <body></body>
</html>`);

const testDataJSONSchema: Verona4ModuleMetadata = {
  $schema: 'https://raw.githubusercontent.com/verona-interfaces/metadata/master/verona-module-metadata.json',
  type: 'player',
  id: 'hello',
  name: [
    {
      value: 'Hallo',
      lang: 'de'
    },
    {
      value: 'Hello',
      lang: 'en'
    }
  ],
  version: '1.1.1',
  specVersion: '1.2',
  description: [
    {
      value: 'Say Hello',
      lang: 'en'
    },
    {
      value: 'Sage Guten Tag',
      lang: 'de'
    }
  ],
  notSupportedFeatures: [
    'stop-continue',
    'focus-notify',
    'report-on-demand',
    'log-policy'
  ],
  maintainer: {
    name: [
      {
        value: 'Ich',
        lang: 'de'
      },
      {
        value: 'Me, Myself & I',
        lang: 'en'
      }
    ],
    url: 'http://www.someurl.de',
    email: 'foo@bar.baz'
  },
  code: {
    repositoryType: 'git',
    repositoryUrl: 'https://github.com/verona-interfaces/metadata',
    licenseType: 'MIT',
    licenseUrl: 'https://github.com/verona-interfaces/metadata'
  }
};

describe('VeronaMetadataReaderUtil', () => {
  const vmrUtil = VeronaMetadataReaderUtil;

  it('should read metadata from the json+ld-script-tag', () => {
    const playerCodeWithJSONLDTag =
      playerCode(`<script type="application/ld+json">${JSON.stringify(testDataJSONSchema)}</script>`);
    const actual = vmrUtil.read('fileNamesShouldNotMatter', playerCodeWithJSONLDTag);
    const expected: VeronaModuleMetadata = {
      data: testDataJSONSchema,
      metadataVersion: 'verona4'
    };
    expect(expected).toEqual(actual);
  });

  it('should guess player\'s name and version from file name if no meta-data is given', () => {
    expect(vmrUtil.read('uninformativeFileName.html', playerCode('')).metadataVersion)
      .toEqual('filename');
    expect(vmrUtil.read('uninformativeFileName.html', playerCode('')).data.version)
      .toBeUndefined();
    expect(vmrUtil.read('uninformativeFileName.html', playerCode('')).data.name)
      .toEqual([{ value: 'uninformativeFileName.html', lang: 'xx' }]);

    expect(vmrUtil.read('verona-simple-player-2.html', playerCode('')).data.version)
      .toEqual('2');
    expect(vmrUtil.read('verona-simple-player-2.html', playerCode('')).data.type)
      .toEqual('player');
    expect(vmrUtil.read('verona-simple-player-2.html', playerCode('')).data.name)
      .toEqual([{ value: 'verona-simple-player', lang: 'xx' }]);

    expect(vmrUtil.read('IQBVisualUnitPlayerV2.99.2.html', playerCode('')).data.version)
      .toEqual('2.99.2');
    expect(vmrUtil.read('IQBVisualUnitPlayerV2.99.2.html', playerCode('')).data.type)
      .toEqual('player');
    expect(vmrUtil.read('IQBVisualUnitPlayerV2.99.2.html', playerCode('')).data.name)
      .toEqual([{ value: 'IQBVisualUnitPlayer', lang: 'xx' }]);

    expect(vmrUtil.read('XXPLAYER1.HTML', playerCode('')).data.version)
      .toEqual('1');
    expect(vmrUtil.read('XXPLAYER1.HTML', playerCode('')).data.type)
      .toEqual('player');
    expect(vmrUtil.read('XXPLAYER1.HTML', playerCode('')).data.name)
      .toEqual([{ value: 'XXPLAYER', lang: 'xx' }]);

    expect(vmrUtil.read('minus-player-1.2.html', playerCode('')).data.version)
      .toEqual('1.2');
    expect(vmrUtil.read('minus-player-1.2.html', playerCode('')).data.type)
      .toEqual('player');
    expect(vmrUtil.read('minus-player-1.2.html', playerCode('')).data.name)
      .toEqual([{ value: 'minus-player', lang: 'xx' }]);

    expect(vmrUtil.read('verona-simple-player-4-beta.html', playerCode('')).data.version)
      .toEqual('4-beta');
  });
});
