Create database ecom;


-- User Table
Create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    email varchar (50),
    password varchar(50),
     status varchar(20),
    role varchar (20),
   
    unique(email)


)
--ex:
insert into user (name,email,password,status,role) values ("Admin", "Admin@gmail.com","admin","true","admin")


-- Products Table
Create table products(
    id int not null AUTO_INCREMENT,
    name varchar (250) not null,
    image varchar(250) not null,
    price varchar(250) not null,
    comment varchar(250) not null,
    primary key (id)


);