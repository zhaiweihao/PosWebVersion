FROM 10.173.208.142:5000/nginx-react

#ENV BASE_URL=/data \
#    API_REGEX=/api_vd? \ 
#    API_GATEWAY=https://api.your.damain
ARG DIST_DIR=./build

## Suppose your app is in the public directory.
COPY $DIST_DIR /app