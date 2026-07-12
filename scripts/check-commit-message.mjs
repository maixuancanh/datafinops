const message = process.argv.slice(2).join(' ').trim() || process.env.COMMIT_MESSAGE?.trim();
if (!message) {
  console.error('Provide a commit message as an argument or COMMIT_MESSAGE.');
  process.exitCode = 2;
} else if (
  !/^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|security|test)(?:\([a-z0-9-]+\))?!?: .{3,72}$/u.test(
    message,
  )
) {
  console.error('Commit message must use Conventional Commits and a 3-72 character subject.');
  process.exitCode = 1;
} else {
  console.log('Commit message policy passed.');
}
