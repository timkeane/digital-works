version=$(node ./bump-version.js)
echo "\nVersion bumped to: $version\n"
echo $(git add .)
echo $(git commit -m "$1")
echo $(git tag $version)
echo $(git push origin main)
echo $(git push origin main $version)
