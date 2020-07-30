create table blocks(
    id serial primary key,
    blockNumber int not null unique,
    size varchar not null,
    timestamp varchar not null,
    nonce varchar not null,
    gasLimit varchar not null,
    hash varchar not null
)