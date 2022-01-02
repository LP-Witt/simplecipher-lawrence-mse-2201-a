# Simple-Cipher

Encrypt and decrypt `.txt` files with a simple 1-1 character set.

## Installation

````
npm install simplecipher-lawrence-mse-2201-a
````

## Example Sets

### Letter-Number

````
character, value
a, 1
b, 7
c, 30
d, 365
````

### Letter-Letter

````
character, value
a, !
b, .
c, ?
d, @
````

## Usage

Encrypt and decrypt a message using a letter-letter character set.

````
simple-cipher -c letterLetterSet.txt -a ll -e message.txt
````

````
simple-cipher -c letterLetterSet.txt -a ll -d message.enc.txt
````

Encrypt and decrypt a message using a letter-number character set with optional offset argument.

````
simple-cipher -c letterNumberSet.txt -a ln -e message.txt -k 42
````

````
simple-cipher -c letterNumberSet.txt -a ln -d message.enc.txt -k 42
````