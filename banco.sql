USE danidani_nuvem;

CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    localizacao VARCHAR(100)
);

CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    data_contratacao DATE NOT NULL,
    departamento_id INT,
    CONSTRAINT fk_departamento FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

INSERT INTO departamentos (nome, localizacao) VALUES
    ('Tecnologia', 'São Paulo - SP'),
    ('Recursos Humanos', 'Rio de Janeiro - RJ'),
    ('Financeiro', 'Belo Horizonte - MG');

INSERT INTO funcionarios (nome, cargo, salario, data_contratacao, departamento_id) VALUES
    ('Daniel Dias', 'Desenvolvedor', 7000.00, '2024-01-10', 1),
    ('Nicollas Trindade', 'Analista de RH', 5500.00, '2024-02-15', 2);

SELECT 
    f.id, 
    f.nome AS nome_funcionario, 
    f.cargo, 
    f.salario, 
    f.data_contratacao, 
    d.nome AS departamento, 
    d.localizacao 
FROM funcionarios f 
INNER JOIN departamentos d ON f.departamento_id = d.id 
ORDER BY f.salario DESC;
