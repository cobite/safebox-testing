FROM node:18-alpine

WORKDIR /app

# Copy files from the toolbar directory into the image
COPY proxy.js .

# Install required npm packages
RUN npm install express http-proxy-middleware

# Run the proxy
CMD ["node", "proxy.js"]
