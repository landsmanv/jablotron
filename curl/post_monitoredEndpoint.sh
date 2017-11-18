curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic YmF0bWFuOnJvYmlu' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/one","Name":"one","monitoredInterval":"60"}'

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/two","Name":"two","monitoredInterval":"120"}'

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"https://raw.githubusercontent.com/landsmanv/jablotron/master/three","Name":"three","monitoredInterval":"ahoj"}'

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"invalid_url","Name":"four","monitoredInterval":"100"}'

curl --request POST \
     --url 'http://localhost:4567/monitoredEndpoint' \
     --header 'authorization: Basic amFibG90cm9uOnRyb24=' \
     --header 'content-type: application/json' \
     --data '{"Url":"invalid_url","Name":"five","monitoredInterval":"0"}'

