FROM node:20
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn
RUN yarn playwright install
RUN yarn playwright install-deps

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]