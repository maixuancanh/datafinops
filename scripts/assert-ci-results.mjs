import { assertSuccessfulNeeds } from './check-ci-gates.mjs';

const serializedNeeds = process.argv[2];
if (!serializedNeeds) throw new Error('Serialized GitHub Actions needs context is required');
assertSuccessfulNeeds(JSON.parse(serializedNeeds));
console.log('All required CI jobs succeeded.');
