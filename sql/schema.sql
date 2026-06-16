-- ============================================================
-- SISTEMA DE VENDAS - LOJA DE VAREJO
-- Schema do Banco de Dados MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS orto_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE orto_app;

-- ------------------------------------------------------------
-- Tabela: clientes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: produtos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(150)   NOT NULL,
    preco      DECIMAL(10, 2) NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: vendas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendas (
    id_venda   INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT  NOT NULL,
    data       DATE NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: itens_venda
-- Regra: devolucoes >= 2 → taxa_devolucao = R$ 20,00
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS itens_venda (
    id_item         INT AUTO_INCREMENT PRIMARY KEY,
    id_venda        INT            NOT NULL,
    id_produto      INT            NOT NULL,
    quantidade      INT            NOT NULL,
    valor_total     DECIMAL(10, 2) NOT NULL,
    devolucoes      INT            DEFAULT 0,
    taxa_devolucao  DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (id_venda)   REFERENCES vendas(id_venda)     ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Dados de exemplo (opcional — remova se preferir começar vazio)
-- ------------------------------------------------------------
INSERT INTO clientes (nome) VALUES
  ('Ana Paula Souza'),
  ('Bruno Ferreira'),
  ('Carla Mendes'),
  ('Diego Oliveira');

INSERT INTO produtos (nome, preco) VALUES
  ('Camiseta Básica',     49.90),
  ('Calça Jeans',        129.90),
  ('Tênis Esportivo',    219.90),
  ('Mochila Executiva',   89.90),
  ('Relógio Digital',    159.90),
  ('Óculos de Sol',       79.90);
