version=$(node ./bump-version.js)
git add .
git commit -m "$1"
git tag $version
