'use strict'

const { BaseCratesService, keywords } = require('./crates-base')

module.exports = class CratesLicense extends BaseCratesService {
  static get category() {
    return 'license'
  }

  static get route() {
    return {
      base: 'crates/l',
      format: '([A-Za-z0-9_-]+)(?:/([0-9.]+))?',
      capture: ['crate', 'version'],
    }
  }

  static get examples() {
    return [
      {
        title: 'Crates.io',
        pattern: ':crate',
        namedParams: { crate: 'rustc-serialize' },
        staticExample: this.render({ license: 'MIT/Apache-2.0' }),
        keywords,
      },
      {
        title: 'Crates.io',
        pattern: ':crate/:version',
        namedParams: { crate: 'rustc-serialize', version: '0.3.24' },
        staticExample: this.render({ license: 'MIT/Apache-2.0' }),
        keywords,
      },
    ]
  }

  static render({ license }) {
    return {
      label: 'license',
      message: license,
      color: 'blue',
    }
  }

  async handle({ crate, version }) {
    const json = await this.fetch({ crate, version })

    if (json.errors) {
      /* a call like
         https://crates.io/api/v1/crates/libc/0.1
         or
         https://crates.io/api/v1/crates/libc/0.1.76
         returns a 200 OK with an errors object */
      return { message: json.errors[0].detail }
    }

    return this.constructor.render({
      license: json.version ? json.version.license : json.versions[0].license,
    })
  }
}
