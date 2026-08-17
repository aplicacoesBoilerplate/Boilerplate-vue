import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Nginx forwarded headers', () => {
  it('overwrites client-supplied forwarding metadata at every API boundary', () => {
    const configuration = readFileSync(
      resolve(process.cwd(), 'config/nginx.conf'),
      'utf8',
    )

    expect(configuration).not.toContain('$proxy_add_x_forwarded_for')
    expect(
      configuration.match(/proxy_set_header X-Forwarded-For \$remote_addr;/g),
    ).toHaveLength(2)
  })
})
