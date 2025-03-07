CREATE TABLE IF NOT EXISTS "user"
(
    id VARCHAR(6) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    picture VARCHAR(2000) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "workspace"
(
    id VARCHAR(6) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(6) REFERENCES "user"(id),
    users VARCHAR(6)[] DEFAULT '{}'::VARCHAR(6)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "board"
(
    id VARCHAR(6) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    visibility VARCHAR(10) NOT NULL,
    workspace_id VARCHAR(6) REFERENCES "workspace"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "list"
(
    id VARCHAR(6) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    board_id VARCHAR(6) REFERENCES "board"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "card"
(
    id VARCHAR(6) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    list_id VARCHAR(6) REFERENCES "list"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "comment"
(
    id VARCHAR(6) PRIMARY KEY,
    content TEXT NOT NULL,
    card_id VARCHAR(6) REFERENCES "card"(id),
    creator_id VARCHAR(6) REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- star/unstar boards
CREATE TABLE IF NOT EXISTS "starred_boards"
(
    user_id VARCHAR(6) REFERENCES "user"(id),
    board_id VARCHAR(6) REFERENCES "board"(id),
    PRIMARY KEY (user_id, board_id)
);
