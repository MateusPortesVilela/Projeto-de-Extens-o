const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

function phpWorks(bin) {
  try {
    execSync(`"${bin}" -v`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function findPhp() {
  if (process.env.PHP_BIN && phpWorks(process.env.PHP_BIN)) {
    return process.env.PHP_BIN;
  }

  const candidates = process.platform === 'win32'
    ? ['C:\\xampp\\php\\php.exe', 'D:\\xampp\\php\\php.exe', 'php']
    : ['php', '/usr/bin/php', '/usr/local/bin/php'];

  for (const bin of candidates) {
    if (bin !== 'php' && !fs.existsSync(bin)) continue;
    if (phpWorks(bin)) return bin;
  }

  return null;
}

function startPhpServer(phpBin) {
  const url = `http://${HOST}:${PORT}`;

  console.log('');
  console.log('  Orto App — desenvolvimento');
  console.log(`  ${url}`);
  console.log(`  PHP: ${phpBin}`);
  console.log('');
  console.log('  Ctrl+C para encerrar.');
  console.log('');

  const child = spawn(phpBin, ['-S', `${HOST}:${PORT}`, '-t', ROOT], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  child.on('error', () => {
    console.error('');
    console.error('  PHP não encontrado. Instale o XAMPP ou defina:');
    console.error('  $env:PHP_BIN = "C:\\xampp\\php\\php.exe"');
    console.error('');
    process.exit(1);
  });

  child.on('exit', (code) => process.exit(code ?? 0));
  process.on('SIGINT', () => child.kill('SIGINT'));
}

function startStaticServer() {
  const express = require('express');
  const url = `http://${HOST}:${PORT}`;

  express()
    .use(express.static(ROOT))
    .get('/', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')))
    .listen(PORT, HOST, () => {
      console.log('');
      console.log('  Orto App — desenvolvimento (somente arquivos estáticos)');
      console.log(`  ${url}`);
      console.log('');
      console.log('  PHP não encontrado — API php/ indisponível neste modo.');
      console.log('  Ctrl+C para encerrar.');
      console.log('');
    });
}

const phpBin = findPhp();
if (phpBin) {
  startPhpServer(phpBin);
} else {
  startStaticServer();
}
