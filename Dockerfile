ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for add-on
RUN apk add --update nodejs npm

# Python 3 HTTP Server serves the current working dir
# So let's set it to our add-on persistent data directory.
WORKDIR /

# Copy data for add-on
COPY . /
#RUN chmod a+x /run.sh
RUN npm install

CMD [ "npm", "start" ]