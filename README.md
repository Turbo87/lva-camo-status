# LVA CAMO Status

A static site generator that displays the CAMO (Continuing Airworthiness Management Organization) status for aircraft from the LVA and Nordstern glider clubs.

## How it works

The binary fetches the current airworthiness status for each aircraft from [CAMO Europe](https://camo-europe.aero), parses the HTML responses, and generates a single `index.html` file with status indicators for each aircraft.

Status indicators:
- **Green** (thumb up): Airworthy
- **Yellow** (warning): Prewarning
- **Red** (thumb down): Grounded
- **Gray** (question mark): Unknown/Error

## Usage

```bash
cargo run
```

This generates an `index.html` file in the current directory.

## Development

```bash
# Run tests
cargo test

# Check formatting
cargo fmt --check

# Run clippy
cargo clippy -- -D warnings
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this crate by you, as defined in the Apache-2.0 license, shall
be dually licensed as above, without any additional terms or conditions.
