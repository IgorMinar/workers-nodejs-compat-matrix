import shell from 'shelljs';

shell.set('-e');

const volta=  '/Users/iminar/.volta/bin/volta';

shell.echo('Generate node v18 apis...');
shell.exec(volta + ' run --node 18 node node/dump.mjs');
shell.echo('=== Done ====================================\n\n');

shell.echo('Generate node v20 apis...');
shell.exec(volta + ' run --node 20 node node/dump.mjs');
shell.echo('=== Done ====================================\n\n');

shell.echo('Generate node v22 apis...');
shell.exec(volta + ' run --node 22 node node/dump.mjs');
shell.echo('=== Done ====================================\n\n');

shell.echo('Make node v22 apis the baseline...');
shell.cp('node/apis-22.json', 'node/apis.json');
shell.echo('=== Done ====================================\n\n');

shell.echo('Generate workerd + --node_compat apis...');
shell.exec('node workerd/dump.mjs');
shell.echo('=== Done ====================================\n\n');

// TODO: add all three wrangler versions
// TODO: invoke script to generate the report
