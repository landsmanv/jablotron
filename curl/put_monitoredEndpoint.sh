curl --request PUT \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/README.md","Name":"tato","Id":"1"}'
