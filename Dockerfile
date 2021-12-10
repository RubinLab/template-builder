FROM node:14-alpine as build-stage

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

RUN git clone https://github.com/RubinLab/template-builder.git /home/node/app/
COPY keys.js /home/node/app/src/services

RUN sed -i 's/react-scripts build/react-scripts --max_old_space_size=6144 build/g' /home/node/app/package.json

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_OPTIONS "--max-old-space-size=6144"
RUN npm install 
RUN npm run build 

FROM nginx:1.15
COPY --from=build-stage /home/node/app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY entrypoint.sh /usr/local/bin/entrypoint
EXPOSE 80
#ENTRYPOINT [ "entrypoint" ]
CMD ["nginx", "-g", "daemon off;"]