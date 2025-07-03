FROM rustlang/rust:nightly-alpine as builder

# Install required build tools and OpenSSL
RUN apk add --no-cache \
  git \
  build-base \
  pkgconfig \
  openssl-dev \
  protobuf \
  protobuf-dev \
  protoc \
  musl-dev \
  perl

# Install rustfmt for required crates (like ant-protocol)
RUN rustup component add rustfmt

# Clone DWEB repo
WORKDIR /usr/src
RUN git clone https://codeberg.org/happybeing/dweb.git

# Build
WORKDIR /usr/src/dweb
RUN cargo build --release

EXPOSE 8083

CMD ["./target/release/dweb"]
