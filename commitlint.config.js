module.exports = {
    rules: {
        'type-enum': [2, 'always', ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'chore']],
        'header-max-length': [0, 'always', 75],
        'scope-case': [0]
    },
    extends: ['@commitlint/config-angular']
}