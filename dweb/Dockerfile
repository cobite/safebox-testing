FROM rustlang/rust:nightly-alpine as builder

# Install deps
RUN apk add --no-cache \
  git \
  build-base \
  pkgconfig \
  openssl-dev \
  protobuf \
  protobuf-dev \
  protoc

# Add rustfmt (needed by ant-protocol)
RUN rustup component add rustfmt

# Clone DWEB repo
WORKDIR /usr/src
RUN git clone https://codeberg.org/happybeing/dweb.git

# Build
WORKDIR /usr/src/dweb
RUN cargo build --release

EXPOSE 8083

CMD ["./target/release/dweb"]
