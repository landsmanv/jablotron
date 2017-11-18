# How to deploy app:

Requirements: 
* GNU/linux, tested on arch/4.9.60-1
* docker, tested version 17.10.0-ce
* docker-compose, tested version 1.17.0
* curl, tested version 7.56.1

Instructions:
1) git clone https://github.com/landsmanv/jablotron
2) cd jablotron
3) docker-compose up -d

It starts 3 containers:
* Main node aplication which is build from included Dockerfile
* Mysql database Mariadb on localhost:3306
* Adminer, database management tool (enabled but optionally) on http://localhost:8080

Default credentials for db jablotron is root:password
http://localhost:8080/?server=db&username=root&password=password&db=jablotron

# About App
Main aplication is listening on localhost:4567 with two endpoints
* monitoredEndpoint (CRUD)
* monitoringResult (R)

Aplication creates empty tables.sql and inserts two users with credentials coded by base64

Aplication starts monitoring Urls if any (we need import some for first run).

Use some rest client or edit/use following samples in curl folder

based64 acessToken required in header (jablotron amFibG90cm9uOnRyb24= or batman YmF0bWFuOnJvYmlu)

'content-type: application/json' and other have to be specified

# POST monitoredEndpoint #
#Import one Url for user batman, name, monitoredInterval, Url have to be specified in data part

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/one","Name":"one","monitoredInterval":"60"}'

#Import one Url for user jablotron, Name, monitoredInterval, Url have to be specified in data part

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/two","Name":"two","monitoredInterval":"120"}'

# GET monitoredEndpoint #
#Get all records for auth user YmF0bWFuOnJvYmlu

curl --request GET \
     --url 'http://localhost:4567/monitoredEndpoint/' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json'

# DEL monitoredEndpoint #
#Delete record, Id of record is required, can be acquired with GET

curl --request DELETE \
     --url 'http://localhost:4567/monitoredEndpoint/1' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json'

# PUT monitoredEndpoint #

#Update record, Id, Name, monitoredInterval and Url have to be specified in data part

curl --request PUT \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/README.md","Name":"tato","monitoredInterval":"60","Id":"2"}'

# GET monitoringResult #

#Get last 10 records for Url, Id of Url is required, can be acquired with monitoredEndpoint GET

curl --request GET \
     --url 'http://localhost:4567/monitoringResult/1' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json'

