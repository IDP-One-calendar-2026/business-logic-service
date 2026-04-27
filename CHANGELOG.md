# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- markdownlint-disable MD024 -->

## [Unreleased]

### Changed

- Reserved for upcoming business rules, orchestration, and packaging changes.

## [0.0.1] - 2026-04-26

### Added

- Added the initial Hono-based business-logic service implementation.
- Added Docker support and a GitHub Actions workflow for building and publishing the image.
- Added packaging support for distributing the service to the UI through the local vendor tarball flow.

### Changed

- Updated Docker image setup to install `pnpm` globally for compatibility with the chosen runtime base image.
- Simplified Docker workflow version extraction to make image-tag generation more reliable.

### Fixed

- Improved container build compatibility by avoiding the unavailable `corepack` setup path in the runtime image.
