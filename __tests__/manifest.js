import { inspectManifest } from '@enginite/standard';
import test from 'ava';

test('Manifest must include mandatory keys', t => {
  inspectManifest();
  t.pass();
});