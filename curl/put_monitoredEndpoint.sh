curl --request PUT \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/README.md","Name":"tato","monitoredInterval":"60","Id":"2"}'

