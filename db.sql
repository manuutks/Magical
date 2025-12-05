-- 1) Criar o banco de dados
CREATE DATABASE IF NOT EXISTS tarot_site;
USE tarot_site;

-- 2) Criar a tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) Inserir um usuário EXEMPLO (senha deve ser criptografada pelo backend)
INSERT INTO usuarios (email, senha)
VALUES ('usuario@exemplo.com', '$2a$10$senha_criptografada_aqui');

-- 4) Ver todos os usuários
SELECT * FROM usuarios;

-- 5) Procurar um usuário por email (para login)
SELECT * FROM usuarios WHERE email = 'usuario@exemplo.com';
