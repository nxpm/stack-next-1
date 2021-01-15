import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing'
describe('api e2e', () => {
  it('should create api', async (done) => {
    const plugin = uniq('api')
    ensureNxProject('@nxpm/api', 'dist/packages/api')
    await runNxCommandAsync(`generate @nxpm/api:application ${plugin}`)

    // const result = await runNxCommandAsync(`build ${plugin}`)
    // expect(result.stdout).toContain('Executor ran')

    done()
  })

  describe('--directory', () => {
    xit('should create src in the specified directory', async (done) => {
      const plugin = uniq('api')
      ensureNxProject('@nxpm/api', 'dist/packages/api')
      await runNxCommandAsync(`generate @nxpm/api:api ${plugin} --directory subdir`)
      expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow()
      done()
    })
  })

  describe('--tags', () => {
    xit('should add tags to nx.json', async (done) => {
      const plugin = uniq('api')
      ensureNxProject('@nxpm/api', 'dist/packages/api')
      await runNxCommandAsync(`generate @nxpm/api:api ${plugin} --tags e2etag,e2ePackage`)
      const nxJson = readJson('nx.json')
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage'])
      done()
    })
  })
})
