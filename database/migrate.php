<?php

declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_PORT = 3307;
const DB_NAME = 'autokamba';
const DB_USER = 'autokamba';
const DB_PASS = 'autokamba_dev_2026';

const MIGRATIONS_DIR = __DIR__ . DIRECTORY_SEPARATOR . 'migrations';
const SEEDS_DIR = __DIR__ . DIRECTORY_SEPARATOR . 'seeds';

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME),
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    return $pdo;
}

function run(string $file): void
{
    $pdo = db();
    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException("Não foi possível ler o ficheiro: $file");
    }
    $pdo->exec($sql);
    printf("  aplicado: %s\n", basename($file));
}

$cmd = $argv[1] ?? 'migrate';

echo "AutoKamba — migrações\n";

switch ($cmd) {
    case 'migrate':
        db()->exec(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(120) NOT NULL UNIQUE,
                executado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        );
        $aplicados = db()->query("SELECT nome FROM schema_migrations")->fetchAll(PDO::FETCH_COLUMN);
        $files = glob(MIGRATIONS_DIR . '/*.sql');
        sort($files);
        $count = 0;
        foreach ($files as $file) {
            $name = basename($file);
            if (in_array($name, $aplicados, true)) {
                continue;
            }
            run($file);
            db()->prepare("INSERT INTO schema_migrations (nome) VALUES (?)")->execute([$name]);
            $count++;
        }
        printf("%d ficheiro(s) aplicado(s).\n", $count);
        break;

    case 'rollback':
        $files = glob(MIGRATIONS_DIR . '/*.sql');
        rsort($files);
        $count = 0;
        foreach ($files as $file) {
            $name = basename($file);
            $dup = db()->prepare("SELECT COUNT(*) FROM schema_migrations WHERE nome = ?");
            $dup->execute([$name]);
            if ((int) $dup->fetchColumn() === 0) {
                continue;
            }
            $stmts = array_slice(explode(';', file_get_contents($file)), 0, -1);
            $tables = [];
            foreach ($stmts as $stmt) {
                if (preg_match('/CREATE TABLE IF NOT EXISTS\s+`?(\w+)`?/i', $stmt, $m)) {
                    $tables[] = $m[1];
                }
            }
            foreach ($tables as $table) {
                db()->exec("DROP TABLE IF EXISTS `$table`");
            }
            db()->prepare("DELETE FROM schema_migrations WHERE nome = ?")->execute([$name]);
            printf("  revertido: %s\n", $name);
            $count++;
        }
        printf("%d ficheiro(s) revertido(s).\n", $count);
        break;

    case 'seed':
        $files = glob(SEEDS_DIR . '/*.sql');
        sort($files);
        foreach ($files as $file) {
            run($file);
        }
        break;

    case 'fresh':
        $pdo = db();
        $rows = $pdo->query(
            "SELECT TABLE_NAME FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = " . $pdo->quote(DB_NAME)
        )->fetchAll(PDO::FETCH_COLUMN);
        foreach ($rows as $table) {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0; DROP TABLE IF EXISTS `$table`; SET FOREIGN_KEY_CHECKS = 1;");
            printf("  removido: %s\n", $table);
        }
        break;

    default:
        echo "Uso: php migrate.php [migrate|rollback|seed|fresh]\n";
        exit(1);
}