import AtomicFileOps from 'react-native-atomic-file-ops';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const fileName = 'AtomicFileOpsCavy.test';
const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

export default function (spec) {
  spec.describe('tests react-native-atomic-file-ops', function () {
    spec.beforeEach(async function () {
      try {
        // Make sure Cavy connects to React helper component
        await spec.exists('AtomicFileWriterWrapper');

        // Make sure file does not already exist
        if (await RNFS.exists(filePath)) {
          await RNFS.unlink(filePath);
        }
      } catch (error) {
        throw error;
      }
    });

    spec.it('overwrites JSON', async function () {
      try {
        // Write the file
        await AtomicFileOps.writeFile(
          fileName,
          "[{'Guinea pig': 'Cavia porcellus'}]",
          'utf8',
        );

        // Overwrite the same file with shorter JSON data
        await AtomicFileOps.writeFile(
          fileName,
          "[{'Cat': 'Felis catus'}]",
          'utf8',
        );

        const content = await RNFS.readFile(filePath, 'utf8');

        if (content !== "[{'Cat': 'Felis catus'}]") {
          throw 'Overwrites JSON Error:  Content does not match truncated input.';
        }
      } catch (error) {
        throw error;
      }
    });

    spec.it('handles Base64', async function () {
      try {
        // Write the file
        await AtomicFileOps.writeFile(fileName, 'Guinea pig', 'base64');
        /*
        'Guinea pig' in Base64
        Android:  R3VpbmVhIHBpZw==
        iOS:  UjNWcGJtVmhJSEJwWnc9PQ==
        */

        // Overwrite the same file with shorter data
        await AtomicFileOps.writeFile(fileName, 'Cat', 'base64');
        /*
        'Cat' in Base64
        Android:  Q2F0
        iOS:  UTJGMA==
        */

        const content = await RNFS.readFile(filePath, 'base64');

        if (Platform.OS === 'android') {
          if (content !== 'Q2F0') {
            throw 'Overwrites Base64 error:  Content does not match truncated input.';
          }
        } else {
          if (content !== 'UTJGMA==') {
            throw 'Overwrites Base64 error:  Content does not match truncated input.';
          }
        }
      } catch (error) {
        throw error;
      }
    });
  });
}
