version=$(node ./bump-version.js)
echo ""
echo "Version bumped to: $version"
echo ""
 echo $(git add .)
echo $(git commit -m "$1")
echo $(git tag $version)
echo $(git push origin main)
echo $(git push origin main $version)
APP_ENV=$2 ./deploy.sh
