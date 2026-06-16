const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const required = ['index.html', 'style/style.css', 'php'];

const missing = required.filter((item) => !fs.existsSync(path.join(ROOT, item)));

if (missing.length) {
  console.error('Build falhou. Arquivos ausentes:', missing.join(', '));
  process.exit(1);
}

console.log('Build concluído. Projeto pronto para deploy.');
